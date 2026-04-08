'use client';

import { useState, useCallback, useRef, useEffect, lazy, Suspense } from 'react';
import MapView, { loadCountryGeoJSON } from './MapView';
import RegionTree from './RegionTree';
import AppellationPanel from './AppellationPanel';
import SearchBar from './SearchBar';
import RegionBreadcrumb from './RegionBreadcrumb';

const TerrainOverlayPanel = lazy(() => import('./TerrainOverlayPanel'));
const MeasureTools = lazy(() => import('./MeasureTools'));
const ElevationProfile = lazy(() => import('./ElevationProfile'));
import { useRegionHierarchy } from '@/hooks/maplibre/useRegionHierarchy';
import { useCheckboxTree } from '@/hooks/maplibre/useCheckboxTree';
import { buildTree, getVisibleFeatureIds, injectClimatNodes } from '@/hooks/maplibre/useHierarchyTree';
import { shouldFadeAtZoom } from '@/lib/maplibre/hierarchyConfig';
import { useUrlState } from '@/hooks/maplibre/useUrlState';
import './WineMap.css';

export default function WineMap() {
  const { initialCenter, initialZoom, initialStyle, initialCountries, updateUrl } = useUrlState();
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [visibleCountries, setVisibleCountries] = useState(new Set());
  const [zoomLevel, setZoomLevel] = useState(initialZoom);
  const [countryTrees, setCountryTrees] = useState({});
  const [hiddenFeatureIds, setHiddenFeatureIds] = useState(new Set());
  const [fadedFeatureIds, setFadedFeatureIds] = useState(new Set());
  const [mapStyle, setMapStyle] = useState(initialStyle);
  const [terrain3D, setTerrain3D] = useState(false);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
  const [measureMode, setMeasureMode] = useState(null);
  const [showElevationProfile, setShowElevationProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [terrainOverlays, setTerrainOverlays] = useState({
    slope: false,
    aspect: false,
    contours: false,
    drainage: false,
  });
  // Tri-state: IDs where parent polygon is hidden but children stay visible
  const [parentOnlyHiddenIds, setParentOnlyHiddenIds] = useState(new Set());
  const mapRef = useRef(null);
  const climatDataRef = useRef(null);
  const mgaDataRef = useRef(null);
  const einzellagenDataRef = useRef(null);
  const riedenDataRef = useRef(null);
  const rhoneLieuxDitsRef = useRef(null);
  const loireLieuxDitsRef = useRef(null);
  const extraLieuxDitsRef = useRef(null);

  const {
    navigationStack,
    drillDown,
    navigateTo,
  } = useRegionHierarchy();

  const checkboxTree = useCheckboxTree();

  // When a country is toggled on, load its data and build the tree
  const handleToggleCountry = useCallback(async (country: string, visible: boolean) => {
    setVisibleCountries(prev => {
      const next = new Set(prev);
      if (visible) {
        next.add(country);
      } else {
        next.delete(country);
      }
      return next;
    });

    if (visible) {
      // Initialize checkbox state (everything checked by default)
      checkboxTree.initCountry(country);

      // Load and build tree
      const data = await loadCountryGeoJSON(country);
      if (data) {
        const tree = buildTree(data.features);

        // For France: inject Burgundy Grand Cru / Premier Cru climat nodes
        if (country === 'france') {
          if (!climatDataRef.current) {
            try {
              const res = await fetch('/data/burgundy-climats.geojson');
              climatDataRef.current = await res.json();
            } catch (e) {
              console.warn('Failed to load burgundy-climats.geojson', e);
            }
          }
          injectClimatNodes(tree, climatDataRef.current?.features);

          // Load Rhône lieux-dits
          if (!rhoneLieuxDitsRef.current) {
            try {
              const res = await fetch('/data/rhone-lieux-dits.geojson');
              rhoneLieuxDitsRef.current = await res.json();
            } catch (e) {
              console.warn('Failed to load rhone-lieux-dits.geojson', e);
            }
          }
          injectClimatNodes(tree, [], rhoneLieuxDitsRef.current?.features);

          // Load Loire lieux-dits
          if (!loireLieuxDitsRef.current) {
            try {
              const res = await fetch('/data/loire-lieux-dits.geojson');
              loireLieuxDitsRef.current = await res.json();
            } catch (e) {
              console.warn('Failed to load loire-lieux-dits.geojson', e);
            }
          }
          injectClimatNodes(tree, [], loireLieuxDitsRef.current?.features);

          // Load extra lieux-dits (Beaujolais, Jura, Languedoc, Provence, Southwest)
          if (!extraLieuxDitsRef.current) {
            try {
              const res = await fetch('/data/france-extra-lieux-dits.geojson');
              extraLieuxDitsRef.current = await res.json();
            } catch (e) {
              console.warn('Failed to load france-extra-lieux-dits.geojson', e);
            }
          }
          injectClimatNodes(tree, [], extraLieuxDitsRef.current?.features);
        }

        // For Italy: load MGA data and inject into tree
        if (country === 'italy') {
          if (!mgaDataRef.current) {
            try {
              const [mgaRes, etnaRes] = await Promise.all([
                fetch('/data/piedmont-mga.geojson'),
                fetch('/data/etna-contrade.geojson'),
              ]);
              const mgaData = await mgaRes.json();
              const etnaData = await etnaRes.json();
              // Merge all MGA-style features
              mgaDataRef.current = {
                features: [...(mgaData?.features || []), ...(etnaData?.features || [])],
              };
            } catch (e) {
              console.warn('Failed to load MGA data', e);
            }
          }
          injectClimatNodes(tree, [], mgaDataRef.current?.features);
        }

        // For Germany: load Einzellagen data and inject into tree
        if (country === 'germany') {
          if (!einzellagenDataRef.current) {
            try {
              const res = await fetch('/data/german-einzellagen.geojson');
              einzellagenDataRef.current = await res.json();
            } catch (e) {
              console.warn('Failed to load german-einzellagen.geojson', e);
            }
          }
          injectClimatNodes(tree, [], einzellagenDataRef.current?.features);
        }

        // For Austria: load Rieden data and inject into tree
        if (country === 'austria') {
          if (!riedenDataRef.current) {
            try {
              const res = await fetch('/data/austrian-rieden.geojson');
              riedenDataRef.current = await res.json();
            } catch (e) {
              console.warn('Failed to load austrian-rieden.geojson', e);
            }
          }
          injectClimatNodes(tree, [], riedenDataRef.current?.features);
        }

        // For other countries with hierarchy: run post-processing
        if (country !== 'france' && country !== 'italy' && tree.roots.some((r: any) => r.children.length > 0)) {
          injectClimatNodes(tree);
        }

        setCountryTrees(prev => ({ ...prev, [country]: tree }));
      }
    }
  }, [checkboxTree]);

  // Load countries from URL hash on initial mount
  useEffect(() => {
    for (const country of initialCountries) {
      handleToggleCountry(country, true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update URL hash when map moves
  const handleMapMove = useCallback((center: [number, number], zoom: number) => {
    updateUrl(zoom, center, mapStyle, [...visibleCountries]);
  }, [updateUrl, mapStyle, visibleCountries]);

  // Also update URL when style or countries change
  useEffect(() => {
    const mapInstance = mapRef.current?.getMap?.();
    if (!mapInstance) return;
    try {
      const z = mapInstance.getZoom();
      const c = mapInstance.getCenter();
      if (c) updateUrl(z, [c.lng, c.lat], mapStyle, [...visibleCountries]);
    } catch (e) {
      // Map might not be ready
    }
  }, [updateUrl, mapStyle, visibleCountries]);

  // Compute which features should be visible based on checkbox tree
  useEffect(() => {
    const allTrees = Object.values(countryTrees);
    if (allTrees.length === 0) return;

    const vis = getVisibleFeatureIds(allTrees, checkboxTree.checked);
    setHiddenFeatureIds(vis.hidden);
    setParentOnlyHiddenIds(vis.parentOnlyHidden);

    // Compute fade sets
    const fade = new Set();
    for (const tree of allTrees) {
      for (const node of tree.byId.values()) {
        if (shouldFadeAtZoom(node.depth, zoomLevel)) {
          fade.add(node.id);
        }
      }
    }
    setFadedFeatureIds(fade);
  }, [countryTrees, checkboxTree.checked, zoomLevel]);

  const handleZoomChange = useCallback((z: number) => {
    setZoomLevel(z);
  }, []);

  const handleFeatureClick = useCallback((feature: any) => {
    setSelectedFeature(feature);
    // Find and select the node in the hierarchy tree
    for (const tree of Object.values(countryTrees)) {
      const node = (tree as any).byId.get(feature.id);
      if (node) {
        drillDown(node);
        break;
      }
    }
  }, [countryTrees, drillDown]);

  const handleNavigateToFeature = useCallback((featureId: string) => {
    const mapInstance = mapRef.current?.getMap?.();
    if (!mapInstance) return;

    for (const data of Object.values(countryTrees)) {
      const node = (data as any).byId.get(featureId);
      if (node?.geojson?.geometry) {
        const geom = node.geojson.geometry;
        let coords;
        if (geom.type === 'Polygon') {
          coords = geom.coordinates[0];
        } else if (geom.type === 'MultiPolygon') {
          coords = geom.coordinates[0][0];
        }
        if (coords && coords.length > 0) {
          const bounds = coords.reduce(
            (b: any, c: any) => {
              b[0][0] = Math.min(b[0][0], c[0]);
              b[0][1] = Math.min(b[0][1], c[1]);
              b[1][0] = Math.max(b[1][0], c[0]);
              b[1][1] = Math.max(b[1][1], c[1]);
              return b;
            },
            [[Infinity, Infinity], [-Infinity, -Infinity]]
          );
          mapInstance.fitBounds(bounds, { padding: 50, maxZoom: 14, duration: 1000 });
          setSelectedFeature(node.geojson);
        }
        break;
      }
    }
  }, [countryTrees]);

  return (
    <div className="wine-map-container">
      {/* Sidebar */}
      <div className={`sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>

        {sidebarOpen && (
          <>
            <SearchBar
              countryTrees={countryTrees}
              onNavigate={handleNavigateToFeature}
            />

            <RegionBreadcrumb
              stack={navigationStack}
              onNavigate={navigateTo}
            />

            <RegionTree
              countryTrees={countryTrees}
              visibleCountries={visibleCountries}
              onToggleCountry={handleToggleCountry}
              checkboxTree={checkboxTree}
            />
          </>
        )}
      </div>

      {/* Map */}
      <div className="map-container">
        <MapView
          ref={mapRef}
          initialCenter={initialCenter}
          initialZoom={initialZoom}
          initialStyle={mapStyle}
          visibleCountries={visibleCountries}
          hiddenFeatureIds={hiddenFeatureIds}
          fadedFeatureIds={fadedFeatureIds}
          parentOnlyHiddenIds={parentOnlyHiddenIds}
          terrain3D={terrain3D}
          terrainOverlays={terrainOverlays}
          measureMode={measureMode}
          onZoomChange={handleZoomChange}
          onFeatureClick={handleFeatureClick}
          onMapMove={handleMapMove}
        />

        {/* Style switcher */}
        <div className="style-switcher">
          <button
            className={mapStyle === 'satellite' ? 'active' : ''}
            onClick={() => setMapStyle('satellite')}
            title="Satellite"
          >
            🛰️
          </button>
          <button
            className={mapStyle === 'light' ? 'active' : ''}
            onClick={() => setMapStyle('light')}
            title="Light"
          >
            ☀️
          </button>
          <button
            className={mapStyle === 'dark' ? 'active' : ''}
            onClick={() => setMapStyle('dark')}
            title="Dark"
          >
            🌙
          </button>
        </div>

        {/* 3D terrain toggle */}
        <button
          className="terrain-toggle"
          onClick={() => setTerrain3D(!terrain3D)}
          title={terrain3D ? 'Disable 3D terrain' : 'Enable 3D terrain'}
        >
          {terrain3D ? '🏔️' : '🗻'}
        </button>

        {/* Measurement tools toggle */}
        <button
          className="measure-toggle"
          onClick={() => setShowAnalysisPanel(!showAnalysisPanel)}
          title="Terrain analysis & measurement tools"
        >
          📏
        </button>
      </div>

      {/* Right panels */}
      {selectedFeature && (
        <AppellationPanel
          feature={selectedFeature}
          onClose={() => setSelectedFeature(null)}
        />
      )}

      {showAnalysisPanel && (
        <Suspense fallback={<div>Loading...</div>}>
          <TerrainOverlayPanel
            overlays={terrainOverlays}
            onToggle={(key: string) =>
              setTerrainOverlays(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
            }
            onClose={() => setShowAnalysisPanel(false)}
          />
          <MeasureTools
            mode={measureMode}
            onModeChange={setMeasureMode}
            onShowProfile={() => setShowElevationProfile(true)}
          />
        </Suspense>
      )}

      {showElevationProfile && (
        <Suspense fallback={<div>Loading...</div>}>
          <ElevationProfile
            onClose={() => setShowElevationProfile(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
