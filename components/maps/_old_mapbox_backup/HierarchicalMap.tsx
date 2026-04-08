'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Map, { Source, Layer, Popup, NavigationControl } from 'react-map-gl/mapbox';
import type { MapMouseEvent, MapRef } from 'react-map-gl/mapbox';
import { useRouter } from 'next/navigation';
import type { Appellation, Vineyard } from '@/types';
import type { FeatureCollection, Feature, Polygon, MultiPolygon, Point } from 'geojson';
import { MAP_COLORS, MAP_ZOOM_LEVELS, WINE_REGION_COLORS } from '@/lib/constants';
import MapBreadcrumb from './MapBreadcrumb';
import MapRegionSelector from './MapRegionSelector';
import 'mapbox-gl/dist/mapbox-gl.css';

interface BreadcrumbItem {
  name: string;
  slug: string;
  path: string;
}

interface HierarchicalMapProps {
  level: 'continent' | 'country' | 'state' | 'sub_region' | 'major_ava' | 'sub_ava';
  region: Appellation | null;
  children: (Appellation | Vineyard)[];
  siblings: Appellation[];
  breadcrumbs: BreadcrumbItem[];
  currentPath: string[];
}

interface PopupInfo {
  name: string;
  description?: string;
  acreage?: number;
  childCount?: number;
  vineyardCount?: number;
  longitude: number;
  latitude: number;
  slug: string;
  type: 'appellation' | 'vineyard';
}

const MAP_STYLES = {
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
};

export default function HierarchicalMap({
  level,
  region,
  children,
  siblings,
  breadcrumbs,
  currentPath,
}: HierarchicalMapProps) {
  const router = useRouter();
  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<'outdoors' | 'satellite'>('outdoors');

  const initialViewState = {
    longitude: region?.centerPoint?.longitude ?? -30,
    latitude: region?.centerPoint?.latitude ?? 40,
    zoom: region?.centerPoint?.defaultZoom ?? (region ? MAP_ZOOM_LEVELS[level] : 2),
  };

  useEffect(() => {
    if (mapRef.current && region?.centerPoint) {
      mapRef.current.flyTo({
        center: [region.centerPoint.longitude, region.centerPoint.latitude],
        zoom: region.centerPoint.defaultZoom ?? MAP_ZOOM_LEVELS[level],
        duration: 1200,
      });
    }
  }, [region, level]);

  // Current region boundary (outline only — shows parent context when drilling in)
  const regionGeoJSON: FeatureCollection<Polygon | MultiPolygon> | null =
    region?.boundaries?.geometry?.coordinates
      ? {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: region.boundaries.geometry.type,
                coordinates: region.boundaries.geometry.coordinates,
              } as Polygon | MultiPolygon,
            },
          ],
        }
      : null;

  // Convert children to GeoJSON
  const childrenGeoJSON: FeatureCollection<Polygon | MultiPolygon> = useMemo(() => ({
    type: 'FeatureCollection',
    features: children
      .filter((c) => {
        const boundaries = 'boundaries' in c ? c.boundaries : undefined;
        return boundaries?.geometry?.coordinates;
      })
      .map((child, index): Feature<Polygon | MultiPolygon> => {
        const boundaries = (child as any).boundaries;
        const isVineyard = 'acreage' in child && 'labelPosition' in child;

        return {
          type: 'Feature',
          id: child._id,
          properties: {
            id: child._id,
            name: child.name,
            slug: child.slug,
            fillColor: boundaries?.properties?.fillColor || WINE_REGION_COLORS[child.slug] || MAP_COLORS[index % MAP_COLORS.length],
            acreage: (child as Vineyard).acreage,
            childCount: (child as Appellation).childCount,
            vineyardCount: (child as Appellation).vineyardCount,
            type: isVineyard ? 'vineyard' : 'appellation',
          },
          geometry: {
            type: boundaries!.geometry.type,
            coordinates: boundaries!.geometry.coordinates,
          } as Polygon | MultiPolygon,
        };
      }),
  }), [children]);

  // Labels GeoJSON
  const labelsGeoJSON: FeatureCollection<Point> = useMemo(() => ({
    type: 'FeatureCollection',
    features: children
      .filter((c) => {
        const hasLabel = 'labelPosition' in c && c.labelPosition;
        const hasBoundaries = 'boundaries' in c && c.boundaries?.geometry?.coordinates;
        const hasCenterPoint = 'centerPoint' in c && c.centerPoint;
        return hasLabel || hasBoundaries || hasCenterPoint;
      })
      .map((child): Feature<Point> => {
        const labelPos = (child as Vineyard).labelPosition;
        const centerPoint = (child as Appellation).centerPoint;
        const boundaries = (child as any).boundaries;

        let coordinates: [number, number];

        if (labelPos) {
          coordinates = [labelPos.longitude, labelPos.latitude];
        } else if (centerPoint) {
          coordinates = [centerPoint.longitude, centerPoint.latitude];
        } else if (boundaries?.geometry?.coordinates) {
          coordinates = calculateCentroid(boundaries.geometry.coordinates);
        } else {
          coordinates = [-119.4, 37.5];
        }

        return {
          type: 'Feature',
          properties: { name: child.name },
          geometry: { type: 'Point', coordinates },
        };
      }),
  }), [children]);

  // Siblings GeoJSON
  const siblingsGeoJSON: FeatureCollection<Polygon | MultiPolygon> = useMemo(() => ({
    type: 'FeatureCollection',
    features: siblings
      .filter((s) => s.boundaries?.geometry?.coordinates)
      .map((sibling, index): Feature<Polygon | MultiPolygon> => {
        const boundaries = sibling.boundaries!;
        return {
          type: 'Feature',
          id: sibling._id,
          properties: {
            id: sibling._id,
            name: sibling.name,
            slug: sibling.slug,
            fillColor: boundaries.properties?.fillColor || MAP_COLORS[(index + 5) % MAP_COLORS.length],
            type: 'appellation',
          },
          geometry: {
            type: boundaries.geometry.type,
            coordinates: boundaries.geometry.coordinates,
          } as Polygon | MultiPolygon,
        };
      }),
  }), [siblings]);

  const siblingLabelsGeoJSON: FeatureCollection<Point> = useMemo(() => ({
    type: 'FeatureCollection',
    features: siblings
      .filter((s) => s.centerPoint || s.boundaries?.geometry?.coordinates)
      .map((sibling): Feature<Point> => {
        const centerPoint = sibling.centerPoint;
        const boundaries = sibling.boundaries;
        let coordinates: [number, number];
        if (centerPoint) {
          coordinates = [centerPoint.longitude, centerPoint.latitude];
        } else if (boundaries?.geometry?.coordinates) {
          coordinates = calculateCentroid(boundaries.geometry.coordinates);
        } else {
          coordinates = [-119.4, 37.5];
        }
        return {
          type: 'Feature',
          properties: { name: sibling.name },
          geometry: { type: 'Point', coordinates },
        };
      }),
  }), [siblings]);

  const onClick = useCallback(
    (event: MapMouseEvent) => {
      const feature = event.features?.[0];
      if (feature && feature.properties) {
        const slug = feature.properties.slug;
        const type = feature.properties.type;
        const layerId = feature.layer?.id;

        if (type === 'appellation') {
          if (layerId === 'siblings-fill') {
            const newPath = [...currentPath.slice(0, -1), slug].join('/');
            router.push(`/maps/${newPath}`);
          } else {
            const newPath = [...currentPath, slug].join('/');
            router.push(`/maps/${newPath}`);
          }
        } else if (type === 'vineyard') {
          const child = children.find((c) => c.slug === slug);
          if (child) {
            const labelPos = (child as Vineyard).labelPosition;
            setPopupInfo({
              name: child.name,
              description: child.description,
              acreage: (child as Vineyard).acreage,
              longitude: labelPos?.longitude ?? event.lngLat.lng,
              latitude: labelPos?.latitude ?? event.lngLat.lat,
              slug,
              type: 'vineyard',
            });
          }
        }
      }
    },
    [children, currentPath, router]
  );

  const onMouseEnter = useCallback((event: MapMouseEvent) => {
    const feature = event.features?.[0];
    if (feature) setHoveredId(feature.properties?.id || null);
  }, []);

  const onMouseLeave = useCallback(() => setHoveredId(null), []);

  // Macro views (continent/country/state): traditional wine map — solid fills, thin lines
  // Micro views (sub_region and below): detail mode — lighter fills to avoid nesting doll
  const isMacroView = level === 'continent' || level === 'country' || level === 'state';

  const getFillOpacity = () => {
    switch (level) {
      case 'continent':
      case 'country':
        return 0.60;
      case 'state':
        return 0.55;
      case 'sub_region':
        return 0.45;
      case 'major_ava':
        return 0.35;
      case 'sub_ava':
        return 0.30;
      default:
        return 0.40;
    }
  };

  const getLineWidth = () => {
    // Macro views: thin lines so parcel clusters read as colored shapes, not black blobs
    if (isMacroView) return 0.75;
    switch (level) {
      case 'sub_region': return 1.5;
      case 'major_ava': return 1.5;
      default: return 1.5;
    }
  };

  const getTextSize = () => {
    switch (level) {
      case 'continent': return 18;
      case 'country': return 16;
      case 'state': return 14;
      case 'sub_region': return 13;
      case 'major_ava': return 12;
      case 'sub_ava': return 11;
      default: return 12;
    }
  };

  // Label color flips to white on satellite for readability
  const labelColor = mapStyle === 'satellite' ? '#ffffff' : '#1C1C1C';
  const labelHaloColor = mapStyle === 'satellite' ? 'rgba(0,0,0,0.6)' : '#ffffff';

  return (
    <div className="w-full h-full relative">
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        mapStyle={MAP_STYLES[mapStyle]}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        interactiveLayerIds={['children-fill', 'siblings-fill']}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        cursor={hoveredId ? 'pointer' : 'grab'}
      >
        <NavigationControl position="top-right" />

        {/* Current region outline — provides parent context when drilling in */}
        {regionGeoJSON && (
          <Source id="region-boundary" type="geojson" data={regionGeoJSON}>
            <Layer
              id="region-outline"
              type="line"
              paint={{
                'line-color': mapStyle === 'satellite' ? '#ffffff' : '#1C1C1C',
                'line-width': 2.5,
                'line-dasharray': [4, 2],
                'line-opacity': 0.7,
              }}
            />
          </Source>
        )}

        {/* Sibling sub-AVAs */}
        {siblings.length > 0 && (
          <>
            <Source id="siblings" type="geojson" data={siblingsGeoJSON}>
              <Layer
                id="siblings-fill"
                type="fill"
                paint={{
                  'fill-color': ['get', 'fillColor'],
                  'fill-opacity': [
                    'case',
                    ['==', ['get', 'id'], hoveredId],
                    0.3,
                    0.15,
                  ],
                }}
              />
              <Layer
                id="siblings-outline"
                type="line"
                paint={{
                  'line-color': mapStyle === 'satellite' ? '#aaaaaa' : '#666',
                  'line-width': ['case', ['==', ['get', 'id'], hoveredId], 2, 1],
                  'line-dasharray': [2, 2],
                }}
              />
            </Source>
            <Source id="sibling-labels" type="geojson" data={siblingLabelsGeoJSON}>
              <Layer
                id="siblings-label"
                type="symbol"
                layout={{
                  'text-field': ['get', 'name'],
                  'text-size': 10,
                  'text-anchor': 'center',
                  'text-allow-overlap': false,
                  'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
                }}
                paint={{
                  'text-color': '#888',
                  'text-halo-color': labelHaloColor,
                  'text-halo-width': 1.5,
                }}
              />
            </Source>
          </>
        )}

        {/* Children polygons */}
        <Source id="children" type="geojson" data={childrenGeoJSON}>
          <Layer
            id="children-fill"
            type="fill"
            paint={{
              'fill-color': ['get', 'fillColor'],
              'fill-opacity': [
                'case',
                ['==', ['get', 'id'], hoveredId],
                (level === 'continent' || level === 'country') ? 0.15 : getFillOpacity() + 0.15,
                getFillOpacity(),
              ],
            }}
          />
          <Layer
            id="children-outline"
            type="line"
            paint={{
              'line-color': mapStyle === 'satellite' ? '#ffffff' : '#1C1C1C',
              'line-width': [
                'case',
                ['==', ['get', 'id'], hoveredId],
                getLineWidth() + 1,
                getLineWidth(),
              ],
              'line-opacity': mapStyle === 'satellite' ? 0.9 : 1,
            }}
          />
        </Source>

        {/* Labels */}
        <Source id="labels" type="geojson" data={labelsGeoJSON}>
          <Layer
            id="children-label"
            type="symbol"
            layout={{
              'text-field': ['get', 'name'],
              'text-size': getTextSize(),
              'text-anchor': 'center',
              'text-allow-overlap': level === 'sub_ava' ? false : true,
              'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
            }}
            paint={{
              'text-color': labelColor,
              'text-halo-color': labelHaloColor,
              'text-halo-width': 2,
            }}
          />
        </Source>

        {/* Popup */}
        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="p-2 min-w-[150px]">
              <h3 className="font-semibold text-[#1C1C1C] text-sm">{popupInfo.name}</h3>
              {popupInfo.acreage && (
                <p className="text-xs text-gray-600 mt-1">{popupInfo.acreage.toLocaleString()} acres</p>
              )}
              {popupInfo.description && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{popupInfo.description}</p>
              )}
            </div>
          </Popup>
        )}

        {/* Breadcrumb */}
        <MapBreadcrumb breadcrumbs={breadcrumbs} />

        {/* Region selector */}
        <MapRegionSelector />

        {/* Satellite / Terrain toggle */}
        <div className="absolute bottom-4 right-4 z-10">
          <button
            onClick={() => setMapStyle(mapStyle === 'outdoors' ? 'satellite' : 'outdoors')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md text-xs font-semibold text-[#1C1C1C] hover:bg-white transition-colors"
          >
            {mapStyle === 'outdoors' ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
                Satellite
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Terrain
              </>
            )}
          </button>
        </div>

        {/* Region info overlay */}
        {region && level !== 'state' && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md z-10 max-w-xs">
            <h2 className="font-serif text-lg font-bold text-[#1C1C1C]">{region.name}</h2>
            <div className="flex gap-3 mt-1 text-xs text-gray-500">
              {region.totalAcreage && <span>{region.totalAcreage.toLocaleString()} acres</span>}
              {region.establishedYear && <span>Est. {region.establishedYear}</span>}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {children.length} {level === 'major_ava' ? 'sub-appellations' : 'vineyards'}
            </p>
          </div>
        )}
      </Map>
    </div>
  );
}

function calculateCentroid(coordinates: number[][][] | number[][][][]): [number, number] {
  if (!coordinates || coordinates.length === 0) return [-119.4, 37.5];

  const ring = Array.isArray(coordinates[0][0][0])
    ? (coordinates as number[][][][])[0][0]
    : (coordinates as number[][][])[0];

  let sumLng = 0;
  let sumLat = 0;
  const n = ring.length;
  for (const coord of ring) {
    sumLng += coord[0];
    sumLat += coord[1];
  }

  return [sumLng / n, sumLat / n];
}
