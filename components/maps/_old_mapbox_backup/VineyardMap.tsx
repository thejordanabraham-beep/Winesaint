'use client';

import { useState, useCallback } from 'react';
import Map, { Source, Layer, Popup, NavigationControl } from 'react-map-gl/mapbox';
import type { MapMouseEvent } from 'react-map-gl/mapbox';
import type { Vineyard, Appellation } from '@/types';
import type { FeatureCollection, Feature, Polygon, MultiPolygon, Point } from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';

interface VineyardMapProps {
  appellation: Appellation;
  vineyards: Vineyard[];
  onVineyardSelect?: (vineyard: Vineyard | null) => void;
}

interface PopupInfo {
  vineyard: Vineyard;
  longitude: number;
  latitude: number;
}

// Color palette for vineyard polygons (rotating through these)
const VINEYARD_COLORS = [
  '#722F37', // red
  '#457b9d', // blue
  '#2a9d8f', // teal
  '#e9c46a', // yellow
  '#f4a261', // orange
  '#6d597a', // purple
  '#b5838d', // mauve
  '#588157', // green
  '#bc6c25', // brown
  '#219ebc', // cyan
];

export default function VineyardMap({
  appellation,
  vineyards,
  onVineyardSelect,
}: VineyardMapProps) {
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [hoveredVineyardId, setHoveredVineyardId] = useState<string | null>(null);

  // Default to Howell Mountain area if no center point
  const initialViewState = {
    longitude: appellation.centerPoint?.longitude ?? -122.48,
    latitude: appellation.centerPoint?.latitude ?? 38.54,
    zoom: appellation.centerPoint?.defaultZoom ?? 12,
  };

  // Convert vineyards to GeoJSON FeatureCollection
  const vineyardsGeoJSON: FeatureCollection<Polygon | MultiPolygon> = {
    type: 'FeatureCollection',
    features: vineyards
      .filter((v) => v.boundaries?.geometry?.coordinates)
      .map((vineyard, index): Feature<Polygon | MultiPolygon> => ({
        type: 'Feature',
        id: vineyard._id,
        properties: {
          id: vineyard._id,
          name: vineyard.name,
          fillColor: vineyard.boundaries?.properties?.fillColor || VINEYARD_COLORS[index % VINEYARD_COLORS.length],
          acreage: vineyard.acreage,
        },
        geometry: {
          type: vineyard.boundaries!.geometry.type,
          coordinates: vineyard.boundaries!.geometry.coordinates,
        } as Polygon | MultiPolygon,
      })),
  };

  // Labels GeoJSON (using label position or centroid)
  const labelsGeoJSON: FeatureCollection<Point> = {
    type: 'FeatureCollection',
    features: vineyards
      .filter((v) => v.labelPosition || v.boundaries?.geometry?.coordinates)
      .map((vineyard): Feature<Point> => ({
        type: 'Feature',
        properties: {
          name: vineyard.name,
        },
        geometry: {
          type: 'Point',
          coordinates: vineyard.labelPosition
            ? [vineyard.labelPosition.longitude, vineyard.labelPosition.latitude]
            : calculateCentroid(vineyard.boundaries?.geometry?.coordinates),
        },
      })),
  };

  const onClick = useCallback(
    (event: MapMouseEvent) => {
      const feature = event.features?.[0];
      if (feature && feature.properties) {
        const vineyard = vineyards.find((v) => v._id === feature.properties?.id);
        if (vineyard) {
          const coords = vineyard.labelPosition || {
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
          };
          setPopupInfo({
            vineyard,
            longitude: coords.longitude ?? event.lngLat.lng,
            latitude: coords.latitude ?? event.lngLat.lat,
          });
          onVineyardSelect?.(vineyard);
        }
      }
    },
    [vineyards, onVineyardSelect]
  );

  const onMouseEnter = useCallback((event: MapMouseEvent) => {
    const feature = event.features?.[0];
    if (feature) {
      setHoveredVineyardId(feature.properties?.id || null);
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    setHoveredVineyardId(null);
  }, []);

  return (
    <div className="w-full h-full relative">
      <Map
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        interactiveLayerIds={['vineyard-fill']}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        cursor={hoveredVineyardId ? 'pointer' : 'grab'}
      >
        <NavigationControl position="top-right" />

        {/* Vineyard polygons */}
        <Source id="vineyards" type="geojson" data={vineyardsGeoJSON}>
          {/* Fill layer */}
          <Layer
            id="vineyard-fill"
            type="fill"
            paint={{
              'fill-color': ['get', 'fillColor'],
              'fill-opacity': [
                'case',
                ['==', ['get', 'id'], hoveredVineyardId],
                0.7,
                0.5,
              ],
            }}
          />
          {/* Outline layer */}
          <Layer
            id="vineyard-outline"
            type="line"
            paint={{
              'line-color': '#1C1C1C',
              'line-width': [
                'case',
                ['==', ['get', 'id'], hoveredVineyardId],
                2,
                1,
              ],
            }}
          />
        </Source>

        {/* Vineyard labels */}
        <Source id="vineyard-labels" type="geojson" data={labelsGeoJSON}>
          <Layer
            id="vineyard-label"
            type="symbol"
            layout={{
              'text-field': ['get', 'name'],
              'text-size': 11,
              'text-anchor': 'center',
              'text-allow-overlap': false,
              'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
            }}
            paint={{
              'text-color': '#1C1C1C',
              'text-halo-color': '#ffffff',
              'text-halo-width': 1.5,
            }}
          />
        </Source>

        {/* Popup on click */}
        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            anchor="bottom"
            onClose={() => {
              setPopupInfo(null);
              onVineyardSelect?.(null);
            }}
            closeButton={true}
            closeOnClick={false}
            className="vineyard-popup"
          >
            <div className="p-2 min-w-[150px]">
              <h3 className="font-semibold text-[#1C1C1C] text-sm">
                {popupInfo.vineyard.name}
              </h3>
              {popupInfo.vineyard.acreage && (
                <p className="text-xs text-gray-600 mt-1">
                  {popupInfo.vineyard.acreage} acres
                </p>
              )}
              {popupInfo.vineyard.primaryGrapes && popupInfo.vineyard.primaryGrapes.length > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  {popupInfo.vineyard.primaryGrapes.join(', ')}
                </p>
              )}
            </div>
          </Popup>
        )}
      </Map>

      {/* Map title overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-[#1C1C1C]">
          {appellation.name}
        </h2>
        <p className="text-xs text-gray-600">
          {vineyards.length} vineyard{vineyards.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}

// Helper function to calculate centroid of a polygon
function calculateCentroid(coordinates: number[][][] | number[][][][] | undefined): [number, number] {
  if (!coordinates || coordinates.length === 0) {
    return [-122.48, 38.54]; // Default fallback
  }

  // Handle both Polygon and MultiPolygon
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
