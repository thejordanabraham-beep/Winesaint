import { useState, useCallback, useRef, useEffect, lazy, Suspense } from 'react';
import MapView, { loadCountryGeoJSON } from './MapView';
import RegionTree from './RegionTree';
import AppellationPanel from './AppellationPanel';
import SearchBar from './SearchBar';
import RegionBreadcrumb from './RegionBreadcrumb';

const TerrainOverlayPanel = lazy(() => import('./TerrainOverlayPanel'));
const MeasureTools = lazy(() => import('./MeasureTools'));
const ElevationProfile = lazy(() => import('./ElevationProfile'));
import { useRegionHierarchy } from './hooks/useRegionHierarchy';
import { useCheckboxTree } from './hooks/useCheckboxTree';
import { buildTree, getVisibleFeatureIds, injectClimatNodes } from './hooks/useHierarchyTree';
import { shouldFadeAtZoom } from './data/hierarchyConfig';
import { useUrlState } from './hooks/useUrlState';

function MapApp() {
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
  const champagneLieuxDitsRef = useRef(null);

  const {
    navigationStack,
    drillDown,
    navigateTo,
  } = useRegionHierarchy();

  const checkboxTree = useCheckboxTree();

  // When a country is toggled on, load its data and build the tree
  const handleToggleCountry = useCallback(async (country, visible) => {
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
              const res = await fetch('/data/maps/burgundy-climats.geojson');
              climatDataRef.current = await res.json();
            } catch (e) {
              console.warn('Failed to load burgundy-climats.geojson', e);
            }
          }
          injectClimatNodes(tree, climatDataRef.current?.features);

          // Load Rhône lieux-dits
          if (!rhoneLieuxDitsRef.current) {
            try {
              const res = await fetch('/data/maps/rhone-lieux-dits.geojson');
              rhoneLieuxDitsRef.current = await res.json();
            } catch (e) {
              console.warn('Failed to load rhone-lieux-dits.geojson', e);
            }
          }
          injectClimatNodes(tree, [], rhoneLieuxDitsRef.current?.features);

          // Load Loire lieux-dits
          if (!loireLieuxDitsRef.current) {
            try {
              const res = await fetch('/data/maps/loire-lieux-dits.geojson');
              loireLieuxDitsRef.current = await res.json();
            } catch (e) {
              console.warn('Failed to load loire-lieux-dits.geojson', e);
            }
          }
          injectClimatNodes(tree, [], loireLieuxDitsRef.current?.features);

          // Load extra lieux-dits (Beaujolais, Jura, Languedoc, Provence, Southwest)
          if (!extraLieuxDitsRef.current) {
            try {
              const res = await fetch('/data/maps/france-extra-lieux-dits.geojson');
              extraLieuxDitsRef.current = await res.json();
            } catch (e) {
              console.warn('Failed to load france-extra-lieux-dits.geojson', e);
            }
          }
          injectClimatNodes(tree, [], extraLieuxDitsRef.current?.features);

          // Load Champagne lieux-dits
          if (!champagneLieuxDitsRef.current) {
            try {
              const res = await fetch('/data/maps/champagne-lieux-dits.geojson');
              champagneLieuxDitsRef.current = await res.json();
            } catch (e) {
              console.warn('Failed to load champagne-lieux-dits.geojson', e);
            }
          }
          injectClimatNodes(tree, [], champagneLieuxDitsRef.current?.features);
        }

        // For Italy: load MGA data and inject into tree
        if (country === 'italy') {
          if (!mgaDataRef.current) {
            try {
              const [mgaRes, etnaRes] = await Promise.all([
                fetch('/data/maps/piedmont-mga.geojson'),
                fetch('/data/maps/etna-contrade.geojson'),
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
              const res = await fetch('/data/maps/german-einzellagen.geojson');
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
              const res = await fetch('/data/maps/austrian-rieden.geojson');
              riedenDataRef.current = await res.json();
            } catch (e) {
              console.warn('Failed to load austrian-rieden.geojson', e);
            }
          }
          injectClimatNodes(tree, [], riedenDataRef.current?.features);
        }

        // For other countries with hierarchy: run post-processing
        if (country !== 'france' && country !== 'italy' && tree.roots.some(r => r.children.length > 0)) {
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
  const handleMapMove = useCallback((center, zoom) => {
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
    } catch { /* map not ready */ }
  }, [mapStyle, visibleCountries, updateUrl]);

  // Recompute hidden/faded feature IDs when checkbox state or zoom changes
  useEffect(() => {
    const newHidden = new Set();
    const newFaded = new Set();

    for (const country of visibleCountries) {
      const tree = countryTrees[country];
      if (!tree) continue;

      const uncheckedIds = checkboxTree.getUncheckedIds(country);
      const { visible, faded } = getVisibleFeatureIds(tree, zoomLevel, uncheckedIds);

      // All features not in the visible set are hidden
      for (const [id, node] of tree.nodeMap) {
        if (!visible.has(id)) {
          newHidden.add(id);
        }
        // Features that have children and should fade at current zoom
        if (visible.has(id) && faded.has(id) && shouldFadeAtZoom(node.hierarchyLevel, zoomLevel)) {
          newFaded.add(id);
        }
      }
    }

    // Also hide parent-only-hidden nodes (tri-state ✕ mode)
    for (const id of parentOnlyHiddenIds) {
      newHidden.add(id);
    }

    setHiddenFeatureIds(newHidden);
    setFadedFeatureIds(newFaded);
  }, [visibleCountries, countryTrees, checkboxTree._state, zoomLevel, parentOnlyHiddenIds]);

  const handleFeatureClick = useCallback((feature) => {
    setSelectedFeature(feature);
  }, []);

  const handleDrillDown = useCallback((feature) => {
    drillDown(feature);
    setSelectedFeature(null);
  }, [drillDown]);

  const handleBreadcrumbNavigate = useCallback((index) => {
    navigateTo(index);
    setSelectedFeature(null);
  }, [navigateTo]);

  const handleZoomChange = useCallback((zoom) => {
    // Round to nearest integer — visibility only changes at integer zoom boundaries
    setZoomLevel(Math.round(zoom));
  }, []);

  const handleFlyTo = useCallback((bbox) => {
    mapRef.current?.flyTo(bbox);
  }, []);

  const handleSearchSelect = useCallback((result) => {
    const [lng, lat] = result.coords;
    const map = mapRef.current?.getMap?.();
    if (map) map.flyTo({ center: [lng, lat], zoom: 14, duration: 1200 });
  }, []);

  const handleSetParentHidden = useCallback((nodeId, hidden) => {
    setParentOnlyHiddenIds(prev => {
      const next = new Set(prev);
      if (hidden) next.add(nodeId);
      else next.delete(nodeId);
      return next;
    });
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Wine Saint Maps</h1>
        <SearchBar onSelect={handleSearchSelect} />
        <RegionBreadcrumb
          stack={navigationStack}
          onNavigate={handleBreadcrumbNavigate}
        />
        <div className="header-toolbar">
          <div className="toolbar-group">
            <button
              className={`toolbar-btn ${mapStyle}`}
              onClick={() => setMapStyle(s => s === 'light' ? 'dark' : s === 'dark' ? 'satellite' : 'light')}
              title="Toggle map style"
            >
              {mapStyle === 'light' ? '🌙' : mapStyle === 'dark' ? '🛰️' : '☀️'}
            </button>
            <button
              className={`toolbar-btn ${terrain3D ? 'active' : ''}`}
              onClick={() => setTerrain3D(v => !v)}
              title={terrain3D ? 'Switch to flat' : 'Enable 3D terrain'}
            >
              ⛰️
            </button>
          </div>
          <span className="toolbar-divider" />
          <div className="toolbar-group">
            <button
              className={`toolbar-btn ${showAnalysisPanel ? 'active' : ''}`}
              onClick={() => setShowAnalysisPanel(v => !v)}
              title="Terrain analysis overlays"
            >
              📊
            </button>
          </div>
          <span className="toolbar-divider" />
          <div className="toolbar-group">
            <button
              className={`toolbar-btn ${measureMode === 'distance' ? 'active' : ''}`}
              onClick={() => { setMeasureMode(m => m === 'distance' ? null : 'distance'); setShowElevationProfile(false); }}
              title="Measure distance"
            >
              📏
            </button>
            <button
              className={`toolbar-btn ${measureMode === 'area' ? 'active' : ''}`}
              onClick={() => { setMeasureMode(m => m === 'area' ? null : 'area'); setShowElevationProfile(false); }}
              title="Measure area"
            >
              📐
            </button>
            <button
              className={`toolbar-btn ${showElevationProfile ? 'active' : ''}`}
              onClick={() => { setShowElevationProfile(v => !v); setMeasureMode(null); }}
              title="Elevation profile"
            >
              📈
            </button>
          </div>
        </div>
      </header>
      <div className="app-body">
        <aside className={`sidebar ${sidebarOpen ? '' : 'sidebar--collapsed'}`}>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(v => !v)}
            title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            {sidebarOpen ? '‹' : '›'}
          </button>
          {sidebarOpen && (
            <>
              <RegionTree
                visibleCountries={visibleCountries}
                onToggleCountry={handleToggleCountry}
                countryTrees={countryTrees}
                checkboxTree={checkboxTree}
                zoomLevel={zoomLevel}
                onFlyTo={handleFlyTo}
                onFeatureClick={handleFeatureClick}
                parentOnlyHiddenIds={parentOnlyHiddenIds}
                onSetParentHidden={handleSetParentHidden}
              />
              {selectedFeature && (
                <AppellationPanel
                  feature={selectedFeature}
                  onDrillDown={handleDrillDown}
                  onClose={() => setSelectedFeature(null)}
                />
              )}
            </>
          )}
        </aside>
        <main className="map-area">
          <MapView
            ref={mapRef}
            visibleCountries={visibleCountries}
            onFeatureClick={handleFeatureClick}
            onZoomChange={handleZoomChange}
            onMapMove={handleMapMove}
            initialCenter={initialCenter}
            initialZoom={initialZoom}
            hiddenFeatureIds={hiddenFeatureIds}
            fadedFeatureIds={fadedFeatureIds}
            mapStyle={mapStyle}
            terrain3D={terrain3D}
            terrainOverlays={terrainOverlays}
            suppressClicks={!!measureMode || showElevationProfile}
          />
          <Suspense fallback={null}>
            {measureMode && (
              <MeasureTools
                mapRef={mapRef}
                mode={measureMode}
                onClose={() => setMeasureMode(null)}
              />
            )}
            {showElevationProfile && (
              <ElevationProfile
                mapRef={mapRef}
                onClose={() => setShowElevationProfile(false)}
              />
            )}
            {showAnalysisPanel && (
              <TerrainOverlayPanel
                overlays={terrainOverlays}
                onToggle={(key) => setTerrainOverlays(prev => ({ ...prev, [key]: !prev[key] }))}
                onClose={() => setShowAnalysisPanel(false)}
              />
            )}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default MapApp;
