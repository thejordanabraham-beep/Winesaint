import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Protocol } from 'pmtiles';
import { COUNTRY_COLORS, REGION_COLORS, SUBREGION_COLORS } from './data/colorPalette';
import { getDepth } from './data/hierarchyConfig';
import { generateColorVariants, createHatchPattern } from './utils/colorFamilies';
import { isGrandCru } from './data/grandCruList';
import { registerTerrainAnalysisProtocol } from './utils/terrainAnalysis';

let protocolAdded = false;
let terrainProtocolAdded = false;


// Module-level GeoJSON cache — survives re-renders, avoids re-fetching
const geoCache = new Map();

async function loadCountryGeoJSON(country) {
  if (geoCache.has(country)) return geoCache.get(country);
  try {
    const res = await fetch(`/data/maps/${country}.geojson`);
    if (!res.ok) return null;
    const data = await res.json();
    geoCache.set(country, data);
    return data;
  } catch (e) {
    console.warn(`Failed to load ${country}:`, e);
    return null;
  }
}

// Paint properties per theme
const THEMES = {
  satellite: {
    countryBorderColor:     '#ffffff',
    countryBorderOpacity:   0.8,
    statesBorderColor:      '#ffffff',
    statesBorderOpacity:    0.65,
    regionBorderColor:      '#ffffff',
    regionBorderOpacity:    0.95,
    subregionBorderOpacity: 0.85,
    appellationHoverColor:  '#ffffff',
    appellationBorderOpacity: 0.7,
    grandCruBorderColor:    '#d4af37',
    grandCruBorderOpacity:  0.9,
    fadedLineColor:         '#ffffff',
    fadedLineOpacity:       0.25,
    labelRegionColor:       '#ffffff',
    labelRegionHalo:        'rgba(0,0,0,0.8)',
    labelSubregionColor:    '#f0f0f0',
    labelSubregionHalo:     'rgba(0,0,0,0.75)',
    labelAppellationColor:  '#e8e8e8',
    labelGrandCruColor:     '#d4af37',
    labelAppellationHalo:   'rgba(0,0,0,0.75)',
  },
  light: {
    countryBorderColor:     '#2c2c2c',
    countryBorderOpacity:   0.6,
    statesBorderColor:      '#2c2c2c',
    statesBorderOpacity:    0.45,
    regionBorderColor:      '#1a1a1a',
    regionBorderOpacity:    0.85,
    subregionBorderOpacity: 0.8,
    appellationHoverColor:  '#1a1a1a',
    appellationBorderOpacity: 0.7,
    grandCruBorderColor:    '#b8860b',
    grandCruBorderOpacity:  0.9,
    fadedLineColor:         '#555555',
    fadedLineOpacity:       0.35,
    labelRegionColor:       '#1a1a1a',
    labelRegionHalo:        'rgba(255,255,255,0.85)',
    labelSubregionColor:    '#2a2a2a',
    labelSubregionHalo:     'rgba(255,255,255,0.8)',
    labelAppellationColor:  '#333333',
    labelGrandCruColor:     '#7a5c00',
    labelAppellationHalo:   'rgba(255,255,255,0.85)',
  },
  dark: {
    countryBorderColor:     '#ffffff',
    countryBorderOpacity:   0.65,
    statesBorderColor:      '#ffffff',
    statesBorderOpacity:    0.5,
    regionBorderColor:      '#ffffff',
    regionBorderOpacity:    0.9,
    subregionBorderOpacity: 0.75,
    appellationHoverColor:  '#ffffff',
    appellationBorderOpacity: 0.85,
    grandCruBorderColor:    '#d4af37',
    grandCruBorderOpacity:  0.7,
    fadedLineColor:         '#ffffff',
    fadedLineOpacity:       0.2,
    labelRegionColor:       '#ffffff',
    labelRegionHalo:        '#0d0d1a',
    labelSubregionColor:    '#e8e8e8',
    labelSubregionHalo:     '#1a1a2e',
    labelAppellationColor:  '#d0d0d0',
    labelGrandCruColor:     '#d4af37',
    labelAppellationHalo:   '#1a1a2e',
  },
};

const MapView = forwardRef(function MapView(
  { visibleCountries, onFeatureClick, onZoomChange, onMapMove, initialCenter, initialZoom, hiddenFeatureIds, fadedFeatureIds, mapStyle, terrain3D, terrainOverlays = {}, suppressClicks = false },
  ref
) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const hoveredIdRef = useRef(null);
  const zoomDebounceRef = useRef(null);
  const drainageHandlerRef = useRef(null);
  const drainageTimerRef = useRef(null);
  const onMapMoveRef = useRef(onMapMove);
  const suppressClicksRef = useRef(suppressClicks);

  onMapMoveRef.current = onMapMove;
  suppressClicksRef.current = suppressClicks;

  // Expose flyTo to parent
  useImperativeHandle(ref, () => ({
    flyTo(bbox) {
      const map = mapRef.current;
      if (!map) return;
      map.fitBounds(
        [[bbox[0], bbox[1]], [bbox[2], bbox[3]]],
        { padding: 50, duration: 1200 }
      );
    },
    getZoom() {
      return mapRef.current?.getZoom() || 3;
    },
    getMap() {
      return mapRef.current;
    },
  }));

  // Initialize map (once)
  useEffect(() => {
    if (!protocolAdded) {
      const protocol = new Protocol();
      maplibregl.addProtocol('pmtiles', protocol.tile);
      protocolAdded = true;
    }
    if (!terrainProtocolAdded) {
      registerTerrainAnalysisProtocol(maplibregl);
      terrainProtocolAdded = true;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          'carto-voyager': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
              'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          },
          'carto-dark': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          },
          'esri-satellite': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            attribution: 'Esri, DigitalGlobe, GeoEye, Earthstar Geographics',
          },
          'terrain-dem': {
            type: 'raster-dem',
            tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
            tileSize: 256,
            encoding: 'terrarium',
            maxzoom: 15,
          },
          'esri-hillshade': {
            type: 'raster',
            tiles: [
              'https://services.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            attribution: 'Esri, USGS, NOAA',
          },
        },
        layers: [
          {
            id: 'carto-voyager-layer',
            type: 'raster',
            source: 'carto-voyager',
            minzoom: 0,
            maxzoom: 19,
          },
          {
            id: 'carto-dark-layer',
            type: 'raster',
            source: 'carto-dark',
            minzoom: 0,
            maxzoom: 19,
            layout: { visibility: 'none' },
          },
          {
            id: 'esri-satellite-layer',
            type: 'raster',
            source: 'esri-satellite',
            minzoom: 0,
            maxzoom: 19,
            layout: { visibility: 'none' },
          },
          {
            id: 'hillshade-layer',
            type: 'raster',
            source: 'esri-hillshade',
            minzoom: 0,
            maxzoom: 19,
            paint: { 'raster-opacity': 0.28 },
          },
        ],
      },
      center: initialCenter || [10, 45],
      zoom: initialZoom ?? 3,
      minZoom: 2,
      maxZoom: 16,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', () => {
      // ── Boundary sources (always present, context layers) ─────────────────
      map.addSource('countries-outline', {
        type: 'geojson',
        data: '/data/maps/countries-outline.geojson',
      });
      map.addSource('us-states-outline', {
        type: 'geojson',
        data: '/data/maps/us-states-outline.geojson',
      });

      // Burgundy climat/lieu-dit parcel source
      map.addSource('burgundy-climats', {
        type: 'geojson',
        data: '/data/maps/burgundy-climats.geojson',
      });

      // Centroid points — one per climat, for duplicate-free labels
      map.addSource('burgundy-climat-labels', {
        type: 'geojson',
        data: '/data/maps/burgundy-climat-labels.geojson',
      });

      // Piedmont MGA parcel source (Barolo, Barbaresco, Roero, Dogliani, Diano d'Alba)
      map.addSource('piedmont-mga', {
        type: 'geojson',
        data: '/data/maps/piedmont-mga.geojson',
      });

      // MGA centroid labels
      map.addSource('piedmont-mga-labels', {
        type: 'geojson',
        data: '/data/maps/piedmont-mga-labels.geojson',
      });

      // Etna DOC contrade parcel source
      map.addSource('etna-contrade', {
        type: 'geojson',
        data: '/data/maps/etna-contrade.geojson',
      });

      // Etna contrade centroid labels
      map.addSource('etna-contrade-labels', {
        type: 'geojson',
        data: '/data/maps/etna-contrade-labels.geojson',
      });

      // Austrian Rieden parcel source
      map.addSource('austrian-rieden', {
        type: 'geojson',
        data: '/data/maps/austrian-rieden.geojson',
      });

      // Austrian Rieden centroid labels
      map.addSource('austrian-rieden-labels', {
        type: 'geojson',
        data: '/data/maps/austrian-rieden-labels.geojson',
      });

      // France extra lieux-dits (Beaujolais, Jura, Languedoc, Provence, SW)
      map.addSource('france-extra-lieux-dits', {
        type: 'geojson',
        data: '/data/maps/france-extra-lieux-dits.geojson',
      });

      map.addSource('france-extra-lieux-dits-labels', {
        type: 'geojson',
        data: '/data/maps/france-extra-lieux-dits-labels.geojson',
      });

      // Loire lieux-dits parcel source
      map.addSource('loire-lieux-dits', {
        type: 'geojson',
        data: '/data/maps/loire-lieux-dits.geojson',
      });

      // Loire lieux-dits centroid labels
      map.addSource('loire-lieux-dits-labels', {
        type: 'geojson',
        data: '/data/maps/loire-lieux-dits-labels.geojson',
      });

      // Rhône lieux-dits parcel source
      map.addSource('rhone-lieux-dits', {
        type: 'geojson',
        data: '/data/maps/rhone-lieux-dits.geojson',
      });

      // Rhône lieux-dits centroid labels
      map.addSource('rhone-lieux-dits-labels', {
        type: 'geojson',
        data: '/data/maps/rhone-lieux-dits-labels.geojson',
      });

      // Champagne lieux-dits polygons
      map.addSource('champagne-lieux-dits', {
        type: 'geojson',
        data: '/data/maps/champagne-lieux-dits.geojson',
      });

      // Champagne lieux-dits centroid labels
      map.addSource('champagne-lieux-dits-labels', {
        type: 'geojson',
        data: '/data/maps/champagne-lieux-dits-labels.geojson',
      });

      // German Einzellagen parcel source
      map.addSource('german-einzellagen', {
        type: 'geojson',
        data: '/data/maps/german-einzellagen.geojson',
      });

      // German Einzellagen centroid labels
      map.addSource('german-einzellagen-labels', {
        type: 'geojson',
        data: '/data/maps/german-einzellagen-labels.geojson',
      });

      // Bordeaux classified châteaux
      map.addSource('bordeaux-chateaux', {
        type: 'geojson',
        data: '/data/maps/bordeaux-chateaux.geojson',
      });

      // California vineyard parcels (all counties except Napa)
      map.addSource('california-vineyards', {
        type: 'geojson',
        data: '/data/maps/california-vineyards.geojson',
      });

      // Napa vineyard parcels
      map.addSource('napa-vineyards', {
        type: 'geojson',
        data: '/data/maps/napa-vineyards.geojson',
      });

      // Napa sub-AVA boundaries
      map.addSource('napa-sub-avas', {
        type: 'geojson',
        data: '/data/maps/napa-sub-avas.geojson',
      });

      // Napa winery markers
      map.addSource('napa-wineries', {
        type: 'geojson',
        data: '/data/maps/napa-wineries.geojson',
      });

      // Washington vineyard parcels
      map.addSource('washington-vineyards', {
        type: 'geojson',
        data: '/data/maps/washington-vineyards.geojson',
      });

      // Washington AVA boundaries
      map.addSource('washington-avas', {
        type: 'geojson',
        data: '/data/maps/washington-avas.geojson',
      });

      // Oregon vineyard parcels
      map.addSource('oregon-vineyards', {
        type: 'geojson',
        data: '/data/maps/oregon-vineyards.geojson',
      });

      // Oregon AVA boundaries
      map.addSource('oregon-avas', {
        type: 'geojson',
        data: '/data/maps/oregon-avas.geojson',
      });

      // OSM named vineyard polygons + labels
      map.addSource('osm-named-vineyards', {
        type: 'geojson',
        data: '/data/maps/osm-named-vineyards.geojson',
      });

      map.addSource('osm-named-vineyards-labels', {
        type: 'geojson',
        data: '/data/maps/osm-named-vineyards-labels.geojson',
      });

      // Crowd-sourced named vineyard parcels (from appellation societies + web research)
      map.addSource('named-vineyard-parcels', {
        type: 'geojson',
        data: '/data/maps/named-vineyard-parcels.geojson',
      });

      // Napa County named vineyard parcels (from pesticide permit data — 2000+ named parcels)
      map.addSource('napa-named-vineyards', {
        type: 'geojson',
        data: '/data/maps/napa-named-vineyards.geojson',
      });

      // OSM winery POIs (CA, OR, WA)
      map.addSource('osm-wineries', {
        type: 'geojson',
        data: '/data/maps/osm-wineries.geojson',
      });

      // GeoJSON source
      map.addSource('appellations', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
        generateId: true,
      });

      // Terrain analysis overlay sources
      map.addSource('slope-analysis', {
        type: 'raster',
        tiles: ['terrain-analysis://slope/{z}/{x}/{y}'],
        tileSize: 256,
        maxzoom: 14,
      });
      map.addSource('aspect-analysis', {
        type: 'raster',
        tiles: ['terrain-analysis://aspect/{z}/{x}/{y}'],
        tileSize: 256,
        maxzoom: 14,
      });
      map.addSource('contour-analysis', {
        type: 'raster',
        tiles: ['terrain-analysis://contour/{z}/{x}/{y}'],
        tileSize: 256,
        maxzoom: 14,
      });

      // === TERRAIN ANALYSIS LAYERS (hidden by default, toggled by user) ===
      map.addLayer({
        id: 'slope-overlay',
        type: 'raster',
        source: 'slope-analysis',
        paint: { 'raster-opacity': 0.6 },
        layout: { visibility: 'none' },
      });
      map.addLayer({
        id: 'aspect-overlay',
        type: 'raster',
        source: 'aspect-analysis',
        paint: { 'raster-opacity': 0.6 },
        layout: { visibility: 'none' },
      });

      map.addLayer({
        id: 'contour-overlay',
        type: 'raster',
        source: 'contour-analysis',
        paint: { 'raster-opacity': 0.8 },
        layout: { visibility: 'none' },
        minzoom: 9,
      });



      // === LAYER STACK (bottom to top) ===
      // Light basemap (Voyager) — dark borders, dark labels, terrain depth via hillshade

      // 1. Region fill — very subtle tint on light background
      map.addLayer({
        id: 'appellation-fill',
        type: 'fill',
        source: 'appellations',
        filter: ['all',
          ['!=', ['get', '_hidden'], true],
          ['!=', ['get', '_faded'], true],
          ['!=', ['get', '_virtual'], true],
        ],
        paint: {
          'fill-color': ['coalesce', ['get', 'color'], '#c9a96e'],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false], 0.55,
            ['==', ['get', '_isRegional'], true], 0.08,
            ['==', ['get', '_isGrandCru'], true], 0.12,
            ['interpolate', ['linear'], ['coalesce', ['get', '_depth'], 4],
              0, 0.10,
              1, 0.15,
              2, 0.22,
              3, 0.38,
              4, 0.50,
            ],
          ],
        },
      });

      // 2. Grand Cru hatching overlay
      if (!map.hasImage('gc-hatch')) map.addImage('gc-hatch', createHatchPattern());
      map.addLayer({
        id: 'appellation-grandcru-overlay',
        type: 'fill',
        source: 'appellations',
        filter: ['all',
          ['!=', ['get', '_hidden'], true],
          ['!=', ['get', '_faded'], true],
          ['==', ['get', '_isGrandCru'], true],
        ],
        paint: {
          'fill-pattern': 'gc-hatch',
          'fill-opacity': 0.18,
        },
      });

      // 3. Premier Cru fills — zoom 12+ only, fade out at very high zoom (let borders do the work)
      map.addLayer({
        id: 'climat-premier-cru-fill',
        type: 'fill',
        source: 'burgundy-climats',
        filter: ['==', ['get', 'classification'], 'premier_cru'],
        minzoom: 12,
        paint: {
          'fill-color': '#8b1a4a',
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0.12, 14, 0.08],
        },
      });

      // 4. Grand Cru fills — zoom 11+, subtle at high zoom
      map.addLayer({
        id: 'climat-grand-cru-fill',
        type: 'fill',
        source: 'burgundy-climats',
        filter: ['==', ['get', 'classification'], 'grand_cru'],
        minzoom: 11,
        paint: {
          'fill-color': '#b8860b',
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 11, 0.30, 14, 0.15],
        },
      });

      // 5. Premier Cru borders — zoom 12+, borders carry the visual weight
      map.addLayer({
        id: 'climat-premier-cru-border',
        type: 'line',
        source: 'burgundy-climats',
        filter: ['==', ['get', 'classification'], 'premier_cru'],
        minzoom: 12,
        paint: {
          'line-color': '#8b1a4a',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.8, 15, 1.5],
          'line-opacity': 0.85,
        },
      });

      // 6. Grand Cru borders — gold, zoom 11+
      map.addLayer({
        id: 'climat-grand-cru-border',
        type: 'line',
        source: 'burgundy-climats',
        filter: ['==', ['get', 'classification'], 'grand_cru'],
        minzoom: 11,
        paint: {
          'line-color': '#b8860b',
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1.2, 14, 2.0],
          'line-opacity': 0.95,
        },
      });

      // 7. Premier Cru labels — centroid points, one per lieu-dit, zoom 13+
      map.addLayer({
        id: 'climat-premier-cru-label',
        type: 'symbol',
        source: 'burgundy-climat-labels',
        filter: ['all',
          ['==', ['get', 'classification'], 'premier_cru'],
          ['!=', ['get', 'lieu_dit'], null],
        ],
        minzoom: 13,
        layout: {
          'text-field': ['get', 'lieu_dit'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 13, 9, 15, 12],
          'text-max-width': 6,
          'text-allow-overlap': false,
          'symbol-sort-key': 2,
        },
        paint: {
          'text-color': '#5a0d2a',
          'text-halo-color': 'rgba(255,255,255,0.9)',
          'text-halo-width': 1.5,
        },
      });

      // 8. Grand Cru labels — centroid points, zoom 11+
      map.addLayer({
        id: 'climat-grand-cru-label',
        type: 'symbol',
        source: 'burgundy-climat-labels',
        filter: ['==', ['get', 'classification'], 'grand_cru'],
        minzoom: 11,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 11, 10, 14, 13],
          'text-max-width': 7,
          'text-allow-overlap': false,
          'symbol-sort-key': 1,
        },
        paint: {
          'text-color': '#7a5000',
          'text-halo-color': 'rgba(255,255,255,0.92)',
          'text-halo-width': 2.0,
        },
      });

      // ── Barolo & Barbaresco MGA layers (like Burgundy climats) ──

      // MGA fills — zoom 12+, deep wine-red tint
      map.addLayer({
        id: 'mga-fill',
        type: 'fill',
        source: 'piedmont-mga',
        minzoom: 12,
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'appellation'], 'Barolo'], '#7a1a2a',
            '#5a2040', // Barbaresco — slightly different
          ],
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0.15, 14, 0.10],
        },
      });

      // MGA borders — zoom 12+
      map.addLayer({
        id: 'mga-border',
        type: 'line',
        source: 'piedmont-mga',
        minzoom: 12,
        paint: {
          'line-color': '#7a1a2a',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.8, 15, 1.5],
          'line-opacity': 0.85,
        },
      });

      // MGA labels — zoom 13+
      map.addLayer({
        id: 'mga-label',
        type: 'symbol',
        source: 'piedmont-mga-labels',
        minzoom: 13,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 13, 9, 15, 12],
          'text-max-width': 6,
          'text-allow-overlap': false,
          'text-font': ['Open Sans Italic', 'Arial Unicode MS Regular'],
        },
        paint: {
          'text-color': '#5a1020',
          'text-halo-color': 'rgba(255,255,255,0.9)',
          'text-halo-width': 1.5,
        },
      });

      // ── Etna DOC contrade layers ──

      // Contrade fills — zoom 12+
      map.addLayer({
        id: 'etna-contrade-fill',
        type: 'fill',
        source: 'etna-contrade',
        minzoom: 12,
        paint: {
          'fill-color': '#a83a10',
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0.15, 14, 0.10],
        },
      });

      // Contrade borders — zoom 12+
      map.addLayer({
        id: 'etna-contrade-border',
        type: 'line',
        source: 'etna-contrade',
        minzoom: 12,
        paint: {
          'line-color': '#a83a10',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.8, 15, 1.5],
          'line-opacity': 0.85,
        },
      });

      // Contrade labels — zoom 13+
      map.addLayer({
        id: 'etna-contrade-label',
        type: 'symbol',
        source: 'etna-contrade-labels',
        minzoom: 13,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 13, 9, 15, 12],
          'text-max-width': 6,
          'text-allow-overlap': false,
          'text-font': ['Open Sans Italic', 'Arial Unicode MS Regular'],
        },
        paint: {
          'text-color': '#6a2a08',
          'text-halo-color': 'rgba(255,255,255,0.9)',
          'text-halo-width': 1.5,
        },
      });

      // ── Rhône lieux-dits layers ──

      // Lieux-dits fills — zoom 12+
      map.addLayer({
        id: 'rhone-lieux-dits-fill',
        type: 'fill',
        source: 'rhone-lieux-dits',
        minzoom: 12,
        paint: {
          'fill-color': '#6b3030',
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0.18, 14, 0.12],
        },
      });

      // Lieux-dits borders — zoom 12+
      map.addLayer({
        id: 'rhone-lieux-dits-border',
        type: 'line',
        source: 'rhone-lieux-dits',
        minzoom: 12,
        paint: {
          'line-color': '#8b2020',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.8, 15, 1.5],
          'line-opacity': 0.85,
        },
      });

      // Lieux-dits labels — zoom 13+
      map.addLayer({
        id: 'rhone-lieux-dits-label',
        type: 'symbol',
        source: 'rhone-lieux-dits-labels',
        minzoom: 13,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 13, 9, 15, 12],
          'text-max-width': 6,
          'text-allow-overlap': false,
          'text-font': ['Open Sans Italic', 'Arial Unicode MS Regular'],
        },
        paint: {
          'text-color': '#6b2020',
          'text-halo-color': 'rgba(255,255,255,0.9)',
          'text-halo-width': 1.5,
        },
      });

      // ── France extra lieux-dits layers (Beaujolais, Jura, Languedoc, Provence, SW) ──

      map.addLayer({
        id: 'france-extra-lieux-dits-fill',
        type: 'fill',
        source: 'france-extra-lieux-dits',
        minzoom: 12,
        paint: {
          'fill-color': '#5a3a6a',
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0.18, 14, 0.12],
        },
      });

      map.addLayer({
        id: 'france-extra-lieux-dits-border',
        type: 'line',
        source: 'france-extra-lieux-dits',
        minzoom: 12,
        paint: {
          'line-color': '#4a2a5a',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.8, 15, 1.5],
          'line-opacity': 0.85,
        },
      });

      map.addLayer({
        id: 'france-extra-lieux-dits-label',
        type: 'symbol',
        source: 'france-extra-lieux-dits-labels',
        minzoom: 13,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 13, 9, 15, 12],
          'text-max-width': 6,
          'text-allow-overlap': false,
          'text-font': ['Open Sans Italic', 'Arial Unicode MS Regular'],
        },
        paint: {
          'text-color': '#4a2a5a',
          'text-halo-color': 'rgba(255,255,255,0.9)',
          'text-halo-width': 1.5,
        },
      });

      // ── Loire lieux-dits layers ──

      map.addLayer({
        id: 'loire-lieux-dits-fill',
        type: 'fill',
        source: 'loire-lieux-dits',
        minzoom: 12,
        paint: {
          'fill-color': '#2a5a4a',
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0.18, 14, 0.12],
        },
      });

      map.addLayer({
        id: 'loire-lieux-dits-border',
        type: 'line',
        source: 'loire-lieux-dits',
        minzoom: 12,
        paint: {
          'line-color': '#1a4a3a',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.8, 15, 1.5],
          'line-opacity': 0.85,
        },
      });

      map.addLayer({
        id: 'loire-lieux-dits-label',
        type: 'symbol',
        source: 'loire-lieux-dits-labels',
        minzoom: 13,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 13, 9, 15, 12],
          'text-max-width': 6,
          'text-allow-overlap': false,
          'text-font': ['Open Sans Italic', 'Arial Unicode MS Regular'],
        },
        paint: {
          'text-color': '#1a4a3a',
          'text-halo-color': 'rgba(255,255,255,0.9)',
          'text-halo-width': 1.5,
        },
      });

      // ── Champagne lieux-dits layers ──

      // Champagne lieux-dits fills — zoom 12+
      map.addLayer({
        id: 'champagne-lieux-dits-fill',
        type: 'fill',
        source: 'champagne-lieux-dits',
        minzoom: 12,
        paint: {
          'fill-color': '#8b6914',
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0.15, 14, 0.10],
        },
      });

      // Champagne lieux-dits borders — zoom 12+
      map.addLayer({
        id: 'champagne-lieux-dits-border',
        type: 'line',
        source: 'champagne-lieux-dits',
        minzoom: 12,
        paint: {
          'line-color': '#8b6914',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.8, 15, 1.5],
          'line-opacity': 0.85,
        },
      });

      // Champagne lieux-dits labels — zoom 13+
      map.addLayer({
        id: 'champagne-lieux-dits-label',
        type: 'symbol',
        source: 'champagne-lieux-dits-labels',
        minzoom: 13,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 13, 9, 15, 12],
          'text-max-width': 6,
          'text-allow-overlap': false,
          'text-font': ['Open Sans Italic', 'Arial Unicode MS Regular'],
        },
        paint: {
          'text-color': '#8b6914',
          'text-halo-color': 'rgba(255,255,255,0.9)',
          'text-halo-width': 1.5,
        },
      });

      // ── German Einzellagen layers ──

      // ── Austrian Rieden layers ──

      // Rieden fills — zoom 12+
      map.addLayer({
        id: 'rieden-fill',
        type: 'fill',
        source: 'austrian-rieden',
        minzoom: 12,
        paint: {
          'fill-color': '#2a7a4a',
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0.18, 14, 0.12],
        },
      });

      // Rieden borders — zoom 12+
      map.addLayer({
        id: 'rieden-border',
        type: 'line',
        source: 'austrian-rieden',
        minzoom: 12,
        paint: {
          'line-color': '#1a6a3a',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.8, 15, 1.5],
          'line-opacity': 0.85,
        },
      });

      // Rieden labels — zoom 13+
      map.addLayer({
        id: 'rieden-label',
        type: 'symbol',
        source: 'austrian-rieden-labels',
        minzoom: 13,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 13, 9, 15, 12],
          'text-max-width': 6,
          'text-allow-overlap': false,
          'text-font': ['Open Sans Italic', 'Arial Unicode MS Regular'],
        },
        paint: {
          'text-color': '#1a5a2a',
          'text-halo-color': 'rgba(255,255,255,0.9)',
          'text-halo-width': 1.5,
        },
      });

      // ── California vineyard layers (all counties except Napa) ──

      map.addLayer({
        id: 'california-vineyards-fill',
        type: 'fill',
        source: 'california-vineyards',
        minzoom: 10,
        paint: {
          'fill-color': '#5a8a3a',
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.15, 13, 0.10],
        },
      });

      map.addLayer({
        id: 'california-vineyards-border',
        type: 'line',
        source: 'california-vineyards',
        minzoom: 11,
        paint: {
          'line-color': '#3a6a1a',
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 0.4, 15, 1.2],
          'line-opacity': 0.7,
        },
      });

      // ── Napa vineyard layers ──

      // Vineyard parcels fill — zoom 10+
      map.addLayer({
        id: 'napa-vineyards-fill',
        type: 'fill',
        source: 'napa-vineyards',
        minzoom: 10,
        paint: {
          'fill-color': '#5a8a3a',
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.15, 13, 0.10],
        },
      });

      // Vineyard parcels border — zoom 11+
      map.addLayer({
        id: 'napa-vineyards-border',
        type: 'line',
        source: 'napa-vineyards',
        minzoom: 11,
        paint: {
          'line-color': '#3a6a1a',
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 0.4, 15, 1.2],
          'line-opacity': 0.7,
        },
      });

      // Sub-AVA boundaries — zoom 8+
      map.addLayer({
        id: 'napa-sub-avas-border',
        type: 'line',
        source: 'napa-sub-avas',
        minzoom: 8,
        paint: {
          'line-color': '#7a1a2a',
          'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1, 12, 2.5],
          'line-opacity': 0.8,
          'line-dasharray': [3, 2],
        },
      });

      // Sub-AVA labels — zoom 9+
      map.addLayer({
        id: 'napa-sub-avas-label',
        type: 'symbol',
        source: 'napa-sub-avas',
        minzoom: 9,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 9, 10, 13, 14],
          'text-max-width': 8,
          'text-allow-overlap': false,
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        },
        paint: {
          'text-color': '#7a1a2a',
          'text-halo-color': 'rgba(255,255,255,0.9)',
          'text-halo-width': 1.5,
        },
      });

      // Winery markers — zoom 11+
      map.addLayer({
        id: 'napa-wineries-marker',
        type: 'circle',
        source: 'napa-wineries',
        minzoom: 11,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 11, 2, 15, 5],
          'circle-color': '#8b4513',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1,
          'circle-opacity': 0.8,
        },
      });

      // Winery labels — zoom 13+
      map.addLayer({
        id: 'napa-wineries-label',
        type: 'symbol',
        source: 'napa-wineries',
        minzoom: 13,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 13, 8, 16, 11],
          'text-offset': [0, 1.2],
          'text-max-width': 8,
          'text-allow-overlap': false,
          'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        },
        paint: {
          'text-color': '#5a3000',
          'text-halo-color': 'rgba(255,255,255,0.9)',
          'text-halo-width': 1,
        },
      });

      // ── Bordeaux classified châteaux ──

      // Château markers — zoom 10+, color-coded by classification tier
      map.addLayer({
        id: 'bordeaux-chateaux-marker',
        type: 'circle',
        source: 'bordeaux-chateaux',
        minzoom: 10,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 3, 15, 7],
          'circle-color': [
            'match', ['get', 'classification'],
            'Premier Cru', '#d4af37',
            'Premier Cru Supérieur', '#d4af37',
            'Premier Grand Cru Classé A', '#d4af37',
            'Premier Grand Cru Classé B', '#c0962c',
            'Deuxième Cru', '#a0522d',
            'Troisième Cru', '#8b4513',
            'Quatrième Cru', '#6b3410',
            'Cinquième Cru', '#5a2d0c',
            'Grand Cru Classé', '#8b2252',
            'Pomerol', '#6a1b4d',
            '#5a3000',
          ],
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1.5,
          'circle-opacity': 0.9,
        },
      });

      // Château labels — zoom 12+
      map.addLayer({
        id: 'bordeaux-chateaux-label',
        type: 'symbol',
        source: 'bordeaux-chateaux',
        minzoom: 12,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 12, 9, 16, 13],
          'text-offset': [0, 1.3],
          'text-max-width': 8,
          'text-allow-overlap': false,
          'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        },
        paint: {
          'text-color': [
            'match', ['get', 'classification'],
            'Premier Cru', '#b8960f',
            'Premier Cru Supérieur', '#b8960f',
            'Premier Grand Cru Classé A', '#b8960f',
            'Premier Grand Cru Classé B', '#a07a1c',
            '#5a3000',
          ],
          'text-halo-color': 'rgba(255,255,255,0.9)',
          'text-halo-width': 1.2,
        },
      });

      // ── OSM named vineyard layers ──

      map.addLayer({
        id: 'osm-named-vineyards-fill',
        type: 'fill',
        source: 'osm-named-vineyards',
        minzoom: 11,
        paint: {
          'fill-color': '#4a7a2a',
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 11, 0.20, 14, 0.12],
        },
      });

      map.addLayer({
        id: 'osm-named-vineyards-border',
        type: 'line',
        source: 'osm-named-vineyards',
        minzoom: 11,
        paint: {
          'line-color': '#2a5a0a',
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 0.8, 15, 1.8],
          'line-opacity': 0.9,
        },
      });

      map.addLayer({
        id: 'osm-named-vineyards-label',
        type: 'symbol',
        source: 'osm-named-vineyards-labels',
        minzoom: 12,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 12, 9, 16, 13],
          'text-max-width': 8,
          'text-allow-overlap': false,
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        },
        paint: {
          'text-color': '#2a5a0a',
          'text-halo-color': 'rgba(255,255,255,0.95)',
          'text-halo-width': 1.5,
        },
      });

      // ── Crowd-sourced named vineyard parcel layers ──

      map.addLayer({
        id: 'named-parcels-fill',
        type: 'fill',
        source: 'named-vineyard-parcels',
        minzoom: 11,
        filter: ['==', ['geometry-type'], 'Polygon'],
        paint: {
          'fill-color': '#3a6a1a',
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 11, 0.25, 14, 0.15],
        },
      });

      map.addLayer({
        id: 'named-parcels-border',
        type: 'line',
        source: 'named-vineyard-parcels',
        minzoom: 11,
        filter: ['==', ['geometry-type'], 'Polygon'],
        paint: {
          'line-color': '#1a4a00',
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1, 15, 2.2],
          'line-opacity': 0.95,
        },
      });

      map.addLayer({
        id: 'named-parcels-label',
        type: 'symbol',
        source: 'named-vineyard-parcels',
        minzoom: 12,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 12, 9, 16, 13],
          'text-max-width': 8,
          'text-allow-overlap': false,
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        },
        paint: {
          'text-color': '#1a4a00',
          'text-halo-color': 'rgba(255,255,255,0.95)',
          'text-halo-width': 1.5,
        },
      });

      // Named parcels that are points (no polygon match) — show as markers
      map.addLayer({
        id: 'named-parcels-point',
        type: 'circle',
        source: 'named-vineyard-parcels',
        minzoom: 11,
        filter: ['==', ['geometry-type'], 'Point'],
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 11, 3, 15, 6],
          'circle-color': '#3a6a1a',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.85,
        },
      });

      // ── Napa County named vineyard parcels (pesticide permit data) ──

      map.addLayer({
        id: 'napa-named-vineyards-fill',
        type: 'fill',
        source: 'napa-named-vineyards',
        minzoom: 11,
        paint: {
          'fill-color': '#3a6a1a',
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 11, 0.25, 14, 0.15],
        },
      });

      map.addLayer({
        id: 'napa-named-vineyards-border',
        type: 'line',
        source: 'napa-named-vineyards',
        minzoom: 11,
        paint: {
          'line-color': '#1a4a00',
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1, 15, 2.2],
          'line-opacity': 0.95,
        },
      });

      map.addLayer({
        id: 'napa-named-vineyards-label',
        type: 'symbol',
        source: 'napa-named-vineyards',
        minzoom: 13,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 13, 8, 16, 12],
          'text-max-width': 8,
          'text-allow-overlap': false,
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        },
        paint: {
          'text-color': '#1a4a00',
          'text-halo-color': 'rgba(255,255,255,0.95)',
          'text-halo-width': 1.5,
        },
      });

      // ── OSM winery markers (CA, OR, WA) ──

      map.addLayer({
        id: 'osm-wineries-marker',
        type: 'circle',
        source: 'osm-wineries',
        minzoom: 11,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 11, 2, 15, 5],
          'circle-color': '#8b4513',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1,
          'circle-opacity': 0.8,
        },
      });

      map.addLayer({
        id: 'osm-wineries-label',
        type: 'symbol',
        source: 'osm-wineries',
        minzoom: 13,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 13, 8, 16, 11],
          'text-offset': [0, 1.2],
          'text-max-width': 8,
          'text-allow-overlap': false,
          'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        },
        paint: {
          'text-color': '#5a3000',
          'text-halo-color': 'rgba(255,255,255,0.9)',
          'text-halo-width': 1,
        },
      });

      // ── Washington vineyard layers ──

      map.addLayer({
        id: 'washington-vineyards-fill',
        type: 'fill',
        source: 'washington-vineyards',
        minzoom: 10,
        paint: {
          'fill-color': '#5a8a3a',
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.15, 13, 0.10],
        },
      });

      map.addLayer({
        id: 'washington-vineyards-border',
        type: 'line',
        source: 'washington-vineyards',
        minzoom: 11,
        paint: {
          'line-color': '#3a6a1a',
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 0.4, 15, 1.2],
          'line-opacity': 0.7,
        },
      });

      // Washington AVA boundaries
      map.addLayer({
        id: 'washington-avas-border',
        type: 'line',
        source: 'washington-avas',
        minzoom: 7,
        paint: {
          'line-color': '#7a1a2a',
          'line-width': ['interpolate', ['linear'], ['zoom'], 7, 0.8, 12, 2.5],
          'line-opacity': 0.8,
          'line-dasharray': [3, 2],
        },
      });

      map.addLayer({
        id: 'washington-avas-label',
        type: 'symbol',
        source: 'washington-avas',
        minzoom: 8,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 8, 9, 13, 14],
          'text-max-width': 8,
          'text-allow-overlap': false,
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        },
        paint: {
          'text-color': '#7a1a2a',
          'text-halo-color': 'rgba(255,255,255,0.9)',
          'text-halo-width': 1.5,
        },
      });

      // ── Oregon vineyard layers ──

      map.addLayer({
        id: 'oregon-vineyards-fill',
        type: 'fill',
        source: 'oregon-vineyards',
        minzoom: 10,
        paint: {
          'fill-color': '#5a8a3a',
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.15, 13, 0.10],
        },
      });

      map.addLayer({
        id: 'oregon-vineyards-border',
        type: 'line',
        source: 'oregon-vineyards',
        minzoom: 11,
        paint: {
          'line-color': '#3a6a1a',
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 0.4, 15, 1.2],
          'line-opacity': 0.7,
        },
      });

      // Oregon AVA boundaries
      map.addLayer({
        id: 'oregon-avas-border',
        type: 'line',
        source: 'oregon-avas',
        minzoom: 7,
        paint: {
          'line-color': '#7a1a2a',
          'line-width': ['interpolate', ['linear'], ['zoom'], 7, 0.8, 12, 2.5],
          'line-opacity': 0.8,
          'line-dasharray': [3, 2],
        },
      });

      map.addLayer({
        id: 'oregon-avas-label',
        type: 'symbol',
        source: 'oregon-avas',
        minzoom: 8,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 8, 9, 13, 14],
          'text-max-width': 8,
          'text-allow-overlap': false,
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        },
        paint: {
          'text-color': '#7a1a2a',
          'text-halo-color': 'rgba(255,255,255,0.9)',
          'text-halo-width': 1.5,
        },
      });

      // Einzellagen fills — zoom 12+, color by VDP classification
      map.addLayer({
        id: 'einzellagen-fill',
        type: 'fill',
        source: 'german-einzellagen',
        minzoom: 12,
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'vdp'], 'grosse_lage'], '#b8860b',
            ['==', ['get', 'vdp'], 'erste_lage'], '#8b1a4a',
            '#4a6b8a',
          ],
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0.18, 14, 0.12],
        },
      });

      // Einzellagen borders — zoom 12+, VDP colored
      map.addLayer({
        id: 'einzellagen-border',
        type: 'line',
        source: 'german-einzellagen',
        minzoom: 12,
        paint: {
          'line-color': [
            'case',
            ['==', ['get', 'vdp'], 'grosse_lage'], '#b8860b',
            ['==', ['get', 'vdp'], 'erste_lage'], '#8b1a4a',
            '#3a5a7a',
          ],
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.8, 15, 1.5],
          'line-opacity': 0.85,
        },
      });

      // Einzellagen labels — zoom 13+, VDP colored
      map.addLayer({
        id: 'einzellagen-label',
        type: 'symbol',
        source: 'german-einzellagen-labels',
        minzoom: 13,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 13, 9, 15, 12],
          'text-max-width': 6,
          'text-allow-overlap': false,
          'text-font': ['Open Sans Italic', 'Arial Unicode MS Regular'],
        },
        paint: {
          'text-color': [
            'case',
            ['==', ['get', 'vdp'], 'grosse_lage'], '#7a5000',
            ['==', ['get', 'vdp'], 'erste_lage'], '#5a0d2a',
            '#2a4a6a',
          ],
          'text-halo-color': 'rgba(255,255,255,0.9)',
          'text-halo-width': 1.5,
        },
      });

      // Country & state boundary outlines — dark, always visible
      map.addLayer({
        id: 'country-border',
        type: 'line',
        source: 'countries-outline',
        filter: ['!=', ['get', 'iso'], 'US'],
        paint: {
          'line-color': '#2c2c2c',
          'line-width': ['interpolate', ['linear'], ['zoom'], 2, 1.5, 8, 2.5],
          'line-opacity': 0.6,
        },
      });

      map.addLayer({
        id: 'us-states-border',
        type: 'line',
        source: 'us-states-outline',
        paint: {
          'line-color': '#2c2c2c',
          'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.8, 8, 1.5],
          'line-opacity': 0.45,
        },
      });

      // 4. Region border (depth 0-2) — boldest appellation boundary
      map.addLayer({
        id: 'region-border',
        type: 'line',
        source: 'appellations',
        filter: ['all',
          ['!=', ['get', '_hidden'], true],
          ['!=', ['get', '_virtual'], true],
          ['<=', ['get', '_depth'], 2],
        ],
        paint: {
          'line-color': '#1a1a1a',
          'line-width': 2.5,
          'line-opacity': 0.85,
        },
      });

      // 5. Subregion border (depth 3) — medium weight, colored
      map.addLayer({
        id: 'subregion-border',
        type: 'line',
        source: 'appellations',
        filter: ['all',
          ['!=', ['get', '_hidden'], true],
          ['!=', ['get', '_virtual'], true],
          ['==', ['get', '_depth'], 3],
        ],
        paint: {
          'line-color': ['coalesce', ['get', 'color'], '#8b5a2b'],
          'line-width': 1.6,
          'line-opacity': 0.8,
        },
      });

      // 6. Village/appellation border (depth 4) — thin, colored
      map.addLayer({
        id: 'appellation-border',
        type: 'line',
        source: 'appellations',
        filter: ['all',
          ['!=', ['get', '_hidden'], true],
          ['!=', ['get', '_faded'], true],
          ['!=', ['get', '_virtual'], true],
          ['==', ['get', '_depth'], 4],
        ],
        paint: {
          'line-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#1a1a1a',
            ['coalesce', ['get', 'color'], '#8b5a2b'],
          ],
          'line-width': ['interpolate', ['linear'], ['zoom'],
            5, 1.2,
            12, 1.8,
            15, 2.5,
          ],
          'line-opacity': 1.0,
        },
      });

      // 7. Grand Cru accent border — gold, slightly wider
      map.addLayer({
        id: 'grandcru-border-accent',
        type: 'line',
        source: 'appellations',
        filter: ['all',
          ['!=', ['get', '_hidden'], true],
          ['!=', ['get', '_faded'], true],
          ['==', ['get', '_isGrandCru'], true],
        ],
        paint: {
          'line-color': '#d4af37',
          'line-width': 2.5,
          'line-opacity': 1.0,
        },
      });

      // 8. Faded parent dashed outline
      map.addLayer({
        id: 'appellation-parent-line',
        type: 'line',
        source: 'appellations',
        filter: ['all',
          ['==', ['get', '_faded'], true],
          ['!=', ['get', '_virtual'], true],
          ['<=', ['get', '_depth'], 2],
        ],
        paint: {
          'line-color': '#555555',
          'line-width': 1.2,
          'line-opacity': 0.35,
          'line-dasharray': [4, 4],
        },
      });

      // 9. Region labels — uppercase serif-style, dark
      map.addLayer({
        id: 'label-region',
        type: 'symbol',
        source: 'appellations',
        filter: ['all',
          ['!=', ['get', '_hidden'], true],
          ['!=', ['get', '_faded'], true],
          ['!=', ['get', '_virtual'], true],
          ['<=', ['get', '_depth'], 2],
        ],
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 3, 11, 6, 15, 10, 18],
          'text-transform': 'uppercase',
          'text-letter-spacing': 0.12,
          'text-max-width': 10,
          'text-allow-overlap': false,
          'symbol-sort-key': ['get', '_depth'],
        },
        paint: {
          'text-color': '#1a1a1a',
          'text-halo-color': 'rgba(255,255,255,0.85)',
          'text-halo-width': 2.0,
        },
      });

      // 10. Subregion labels
      map.addLayer({
        id: 'label-subregion',
        type: 'symbol',
        source: 'appellations',
        filter: ['all',
          ['!=', ['get', '_hidden'], true],
          ['!=', ['get', '_faded'], true],
          ['!=', ['get', '_virtual'], true],
          ['==', ['get', '_depth'], 3],
        ],
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 5, 9, 8, 12, 12, 15],
          'text-letter-spacing': 0.04,
          'text-max-width': 8,
          'text-allow-overlap': false,
          'symbol-sort-key': ['get', '_depth'],
        },
        paint: {
          'text-color': '#2a2a2a',
          'text-halo-color': 'rgba(255,255,255,0.8)',
          'text-halo-width': 1.8,
        },
      });

      // 11. Appellation labels — Grand Crus in dark gold, others in dark charcoal
      map.addLayer({
        id: 'label-appellation',
        type: 'symbol',
        source: 'appellations',
        filter: ['all',
          ['!=', ['get', '_hidden'], true],
          ['!=', ['get', '_faded'], true],
          ['!=', ['get', '_virtual'], true],
          ['==', ['get', '_depth'], 4],
        ],
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 5, 7, 8, 9, 12, 13],
          'text-max-width': 8,
          'text-allow-overlap': false,
          'symbol-sort-key': [
            'case',
            ['==', ['get', '_isGrandCru'], true], 1,
            0,   // Village labels (0) beat GC PDO labels (1); GC parcels have their own label layer
          ],
        },
        paint: {
          'text-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false], '#c9a96e',
            ['==', ['get', '_isGrandCru'], true], '#7a5c00',
            '#333333',
          ],
          'text-halo-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false], 'rgba(0,0,0,0.6)',
            'rgba(255,255,255,0.85)',
          ],
          'text-halo-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false], 2.0,
            1.5,
          ],
        },
      });

      // Hover interaction — pick the most specific feature at the cursor
      function pickBestFeature(features) {
        // Filter out regional background polygons and faded parents
        const candidates = features.filter(f => !f.properties._isRegional && !f.properties._faded);
        const pool = candidates.length > 0 ? candidates : features;
        // Among remaining, pick deepest; ties broken by smallest area (most specific)
        pool.sort((a, b) => {
          const dd = (b.properties._depth || 0) - (a.properties._depth || 0);
          if (dd !== 0) return dd;
          // Rough area proxy: smaller bbox = more specific
          return (a.properties._bboxArea || Infinity) - (b.properties._bboxArea || Infinity);
        });
        return pool[0];
      }

      map.on('mousemove', 'appellation-fill', (e) => {
        if (e.features.length > 0) {
          if (hoveredIdRef.current !== null) {
            map.setFeatureState(
              { source: 'appellations', id: hoveredIdRef.current },
              { hover: false }
            );
          }
          const best = pickBestFeature(e.features);
          hoveredIdRef.current = best.id;
          map.setFeatureState(
            { source: 'appellations', id: hoveredIdRef.current },
            { hover: true }
          );
          map.getCanvas().style.cursor = 'pointer';
        }
      });

      map.on('mouseleave', 'appellation-fill', () => {
        if (hoveredIdRef.current !== null) {
          map.setFeatureState(
            { source: 'appellations', id: hoveredIdRef.current },
            { hover: false }
          );
        }
        hoveredIdRef.current = null;
        map.getCanvas().style.cursor = '';
      });

      // Label hover — hovering over a label also highlights its polygon
      for (const labelLayer of ['label-appellation', 'label-subregion', 'label-region']) {
        map.on('mousemove', labelLayer, (e) => {
          if (e.features.length > 0) {
            if (hoveredIdRef.current !== null) {
              map.setFeatureState(
                { source: 'appellations', id: hoveredIdRef.current },
                { hover: false }
              );
            }
            hoveredIdRef.current = e.features[0].id;
            map.setFeatureState(
              { source: 'appellations', id: hoveredIdRef.current },
              { hover: true }
            );
            map.getCanvas().style.cursor = 'pointer';
          }
        });
        map.on('mouseleave', labelLayer, () => {
          if (hoveredIdRef.current !== null) {
            map.setFeatureState(
              { source: 'appellations', id: hoveredIdRef.current },
              { hover: false }
            );
          }
          hoveredIdRef.current = null;
          map.getCanvas().style.cursor = '';
        });
      }

      // Click + hover for vineyard-level layers (lieux-dits, MGA, Einzellagen, Rieden, climats)
      // These must be registered BEFORE the appellation-fill click handler
      // so we can set a flag to prevent the appellation handler from overwriting.
      let vineyardClickHandled = false;

      const vineyardFillLayers = [
        'champagne-lieux-dits-fill',
        'rhone-lieux-dits-fill',
        'loire-lieux-dits-fill',
        'france-extra-lieux-dits-fill',
        'mga-fill',
        'einzellagen-fill',
        'rieden-fill',
        'climat-premier-cru-fill',
        'climat-grand-cru-fill',
        'etna-contrade-fill',
        'napa-vineyards-fill',
        'california-vineyards-fill',
        'washington-vineyards-fill',
        'oregon-vineyards-fill',
        'osm-named-vineyards-fill',
        'named-parcels-fill',
        'named-parcels-point',
        'napa-named-vineyards-fill',
      ];

      // Winery marker clicks (Napa + OSM)
      for (const wineryLayer of ['bordeaux-chateaux-marker', 'napa-wineries-marker', 'osm-wineries-marker']) {
        map.on('click', wineryLayer, (e) => {
          if (suppressClicksRef.current) return;
          if (e.features.length > 0) {
            const feature = e.features[0];
            onFeatureClick({
              id: feature.properties.name,
              ...feature.properties,
              type: 'winery',
            });
            vineyardClickHandled = true;
            setTimeout(() => { vineyardClickHandled = false; }, 0);
          }
        });
        map.on('mouseenter', wineryLayer, () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', wineryLayer, () => {
          map.getCanvas().style.cursor = '';
        });
      }

      for (const layerId of vineyardFillLayers) {
        map.on('click', layerId, (e) => {
          if (suppressClicksRef.current) return;
          if (e.features.length > 0) {
            const feature = e.features[0];
            onFeatureClick({
              id: feature.properties.id || feature.properties.name,
              ...feature.properties,
              bbox: feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon'
                ? getBbox(feature.geometry)
                : null,
            });
            vineyardClickHandled = true;
            setTimeout(() => { vineyardClickHandled = false; }, 0);
          }
        });

        map.on('mouseenter', layerId, () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', layerId, () => {
          map.getCanvas().style.cursor = '';
        });
      }

      // Click interaction — pick the most specific appellation feature
      map.on('click', 'appellation-fill', (e) => {
        if (suppressClicksRef.current) return;
        if (vineyardClickHandled) return; // vineyard layer already handled this click
        if (e.features.length > 0) {
          const feature = pickBestFeature(e.features);
          onFeatureClick({
            id: feature.properties.id || feature.id,
            ...feature.properties,
            bbox: feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon'
              ? getBbox(feature.geometry)
              : null,
          });
        }
      });

      // Zoom change — fade fills at zoom 12+ but never hide them entirely
      // Also fade parent region/subregion borders and labels at high zoom
      map.on('zoom', () => {
        if (zoomDebounceRef.current) cancelAnimationFrame(zoomDebounceRef.current);
        zoomDebounceRef.current = requestAnimationFrame(() => {
          const z = map.getZoom();

          // Parent regions (depth 0-2): fade z11-13, gone by z13
          const regionFade = z < 11 ? 1.0 : z < 13 ? (13 - z) / 2 : 0;
          // Subregions (depth 3): fade z12-14, gone by z14
          const subFade = z < 12 ? 1.0 : z < 14 ? (14 - z) / 2 : 0;
          // Appellations (depth 4): keep a small amount but fade large ones
          const appFade = z < 12 ? 1.0 : z < 14 ? (14 - z) / 2 + 0.1 : 0.1;

          if (map.getLayer('appellation-fill')) {
            map.setPaintProperty('appellation-fill', 'fill-opacity', [
              'case',
              // Hover: only highlight if the feature wouldn't be faded out at this zoom
              ['all', ['boolean', ['feature-state', 'hover'], false], ['==', ['get', '_isRegional'], true]],
                0.45 * regionFade,
              ['all', ['boolean', ['feature-state', 'hover'], false], ['<=', ['coalesce', ['get', '_depth'], 4], 2]],
                0.45 * regionFade,
              ['all', ['boolean', ['feature-state', 'hover'], false], ['==', ['coalesce', ['get', '_depth'], 4], 3]],
                0.45 * subFade,
              ['all', ['boolean', ['feature-state', 'hover'], false], ['>', ['coalesce', ['get', '_bboxArea'], 0], 0.1]],
                0.45 * subFade,
              ['boolean', ['feature-state', 'hover'], false], 0.45 * appFade,
              // Normal (non-hover) opacity
              ['==', ['get', '_isRegional'], true], 0.08 * regionFade,
              ['==', ['get', '_isGrandCru'], true], 0.12,
              ['<=', ['coalesce', ['get', '_depth'], 4], 2],
                0.15 * regionFade,
              ['==', ['coalesce', ['get', '_depth'], 4], 3],
                0.38 * subFade,
              ['>', ['coalesce', ['get', '_bboxArea'], 0], 0.1],
                0.35 * subFade,
              0.50 * appFade,
            ]);
          }

          // Region borders + labels
          if (map.getLayer('region-border')) {
            map.setPaintProperty('region-border', 'line-opacity', 0.85 * regionFade);
          }
          if (map.getLayer('label-region')) {
            map.setPaintProperty('label-region', 'text-opacity', regionFade);
          }
          if (map.getLayer('appellation-parent-line')) {
            map.setPaintProperty('appellation-parent-line', 'line-opacity', 0.35 * regionFade);
          }

          // Subregion borders + labels
          if (map.getLayer('subregion-border')) {
            map.setPaintProperty('subregion-border', 'line-opacity', 0.8 * subFade);
          }
          if (map.getLayer('label-subregion')) {
            map.setPaintProperty('label-subregion', 'text-opacity', subFade);
          }

          // Large appellation labels (like "Sonoma Coast") — fade at high zoom
          if (map.getLayer('label-appellation')) {
            map.setPaintProperty('label-appellation', 'text-opacity', [
              'case',
              ['>', ['coalesce', ['get', '_bboxArea'], 0], 0.1], subFade,
              1.0,
            ]);
          }

          if (onZoomChange) onZoomChange(z);
        });
      });

      // Fire initial zoom
      if (onZoomChange) onZoomChange(map.getZoom());

      // URL state: report center+zoom on moveend
      map.on('moveend', () => {
        if (onMapMoveRef.current) {
          const c = map.getCenter();
          onMapMoveRef.current([c.lng, c.lat], map.getZoom());
        }
      });
    });

    mapRef.current = map;
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Toggle 3D terrain
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    if (terrain3D) {
      map.setTerrain({ source: 'terrain-dem', exaggeration: 2.0 });
      map.easeTo({ pitch: 50, duration: 800 });
    } else {
      map.setTerrain(null);
      map.easeTo({ pitch: 0, duration: 800 });
    }
  }, [terrain3D]);

  // Toggle terrain analysis overlays
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const layers = {
      slope: ['slope-overlay'],
      aspect: ['aspect-overlay'],
      contours: ['contour-overlay'],
    };

    for (const [key, layerIds] of Object.entries(layers)) {
      const vis = terrainOverlays[key] ? 'visible' : 'none';
      for (const id of layerIds) {
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, 'visibility', vis);
        }
      }
    }

    // Drainage: fetch OSM waterways on demand
    if (terrainOverlays.drainage) {
      if (!map.getSource('drainage-waterways')) {
        map.addSource('drainage-waterways', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] },
        });
        map.addLayer({
          id: 'drainage-lines',
          type: 'line',
          source: 'drainage-waterways',
          paint: {
            'line-color': '#4488cc',
            'line-width': [
              'case',
              ['==', ['get', 'waterway'], 'river'], 2.5,
              ['==', ['get', 'waterway'], 'stream'], 1.2,
              0.8,
            ],
            'line-opacity': 0.7,
          },
        });
      }
      // Set up debounced waterway fetcher
      const fetchWaterways = async () => {
        const bounds = map.getBounds();
        const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
        try {
          const query = `[out:json][timeout:15];(way["waterway"~"river|stream"](${bbox}););out geom;`;
          const res = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: `data=${encodeURIComponent(query)}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          });
          const data = await res.json();
          const features = data.elements
            .filter(e => e.type === 'way' && e.geometry)
            .map(e => ({
              type: 'Feature',
              properties: { waterway: e.tags?.waterway || 'stream' },
              geometry: {
                type: 'LineString',
                coordinates: e.geometry.map(p => [p.lon, p.lat]),
              },
            }));
          const src = map.getSource('drainage-waterways');
          if (src) src.setData({ type: 'FeatureCollection', features });
        } catch (err) {
          console.warn('Failed to fetch waterways:', err);
        }
      };
      const debouncedFetch = () => {
        clearTimeout(drainageTimerRef.current);
        drainageTimerRef.current = setTimeout(fetchWaterways, 800);
      };
      // Remove previous listener if any, then add new one
      if (drainageHandlerRef.current) {
        map.off('moveend', drainageHandlerRef.current);
      }
      drainageHandlerRef.current = debouncedFetch;
      fetchWaterways();
      map.on('moveend', debouncedFetch);
      if (map.getLayer('drainage-lines')) {
        map.setLayoutProperty('drainage-lines', 'visibility', 'visible');
      }
    } else {
      // Clean up listener when drainage is toggled off
      if (drainageHandlerRef.current) {
        map.off('moveend', drainageHandlerRef.current);
        drainageHandlerRef.current = null;
      }
      clearTimeout(drainageTimerRef.current);
      if (map.getLayer('drainage-lines')) {
        map.setLayoutProperty('drainage-lines', 'visibility', 'none');
      }
    }
  }, [terrainOverlays]);

  // Swap basemap and repaint all layers when mapStyle changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const t = THEMES[mapStyle] || THEMES.light;

    // Basemap visibility
    map.setLayoutProperty('carto-voyager-layer',  'visibility', mapStyle === 'light'     ? 'visible' : 'none');
    map.setLayoutProperty('carto-dark-layer',     'visibility', mapStyle === 'dark'      ? 'visible' : 'none');
    map.setLayoutProperty('esri-satellite-layer', 'visibility', mapStyle === 'satellite' ? 'visible' : 'none');
    map.setPaintProperty('hillshade-layer', 'raster-opacity', mapStyle === 'light' ? 0.28 : 0);

    // Country / state borders
    map.setPaintProperty('country-border',  'line-color',   t.countryBorderColor);
    map.setPaintProperty('country-border',  'line-opacity', t.countryBorderOpacity);
    map.setPaintProperty('us-states-border','line-color',   t.statesBorderColor);
    map.setPaintProperty('us-states-border','line-opacity', t.statesBorderOpacity);

    // Appellation borders
    map.setPaintProperty('region-border',   'line-color',   t.regionBorderColor);
    map.setPaintProperty('region-border',   'line-opacity', t.regionBorderOpacity);
    map.setPaintProperty('subregion-border','line-opacity', t.subregionBorderOpacity);
    map.setPaintProperty('appellation-border', 'line-opacity', [
      'case', ['boolean', ['feature-state', 'hover'], false], 1.0, t.appellationBorderOpacity,
    ]);
    map.setPaintProperty('appellation-border', 'line-color', [
      'case', ['boolean', ['feature-state', 'hover'], false],
      t.appellationHoverColor,
      mapStyle === 'dark' ? '#c9a96e' : ['coalesce', ['get', 'color'], '#8b5a2b'],
    ]);
    map.setPaintProperty('grandcru-border-accent', 'line-color',   t.grandCruBorderColor);
    map.setPaintProperty('grandcru-border-accent', 'line-opacity', t.grandCruBorderOpacity);
    map.setPaintProperty('appellation-parent-line','line-color',   t.fadedLineColor);
    map.setPaintProperty('appellation-parent-line','line-opacity', t.fadedLineOpacity);

    // Labels
    map.setPaintProperty('label-region',      'text-color',      t.labelRegionColor);
    map.setPaintProperty('label-region',      'text-halo-color', t.labelRegionHalo);
    map.setPaintProperty('label-subregion',   'text-color',      t.labelSubregionColor);
    map.setPaintProperty('label-subregion',   'text-halo-color', t.labelSubregionHalo);
    map.setPaintProperty('label-appellation', 'text-color', [
      'case',
      ['==', ['get', '_isGrandCru'], true], t.labelGrandCruColor,
      t.labelAppellationColor,
    ]);
    map.setPaintProperty('label-appellation', 'text-halo-color', t.labelAppellationHalo);

    // Climat layers — adjust label halos for dark mode
    const climHalo = mapStyle === 'light' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)';
    const pcColor  = mapStyle === 'light' ? '#5a0d2a' : '#e8a0c0';
    const gcColor  = mapStyle === 'light' ? '#7a5000' : '#ffd700';
    map.setPaintProperty('climat-premier-cru-label', 'text-halo-color', climHalo);
    map.setPaintProperty('climat-premier-cru-label', 'text-color', pcColor);
    map.setPaintProperty('climat-grand-cru-label',   'text-halo-color', climHalo);
    map.setPaintProperty('climat-grand-cru-label',   'text-color', gcColor);
  }, [mapStyle]);

  // Update source data when visible countries, hidden set, or faded set changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    loadAllVisibleData(visibleCountries, hiddenFeatureIds, fadedFeatureIds).then((geojson) => {
      const source = map.getSource('appellations');
      if (source) {
        source.setData(geojson);
      }
    });
  }, [visibleCountries, hiddenFeatureIds, fadedFeatureIds]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
});

// Cache for pre-processed features (color, depth, bbox etc. computed once per country)
const processedCache = new Map();

/**
 * Pre-process a country's features: compute colors, depths, bboxes.
 * Cached per country — only runs once per country load.
 */
async function getProcessedFeatures(country) {
  if (processedCache.has(country)) return processedCache.get(country);

  const data = await loadCountryGeoJSON(country);
  if (!data) return [];

  const countryColor = COUNTRY_COLORS[country] || '#c9a96e';
  const regionColors = REGION_COLORS[country];
  const subregionColors = SUBREGION_COLORS[country];

  // Build parent map and ancestor lookups
  const parentMap = new Map();
  for (const f of data.features) {
    const p = f.properties;
    if (p.parentId) parentMap.set(p.id || p.name, p.parentId);
  }

  // For each feature, find its top-level region name AND its subregion id
  const regionLookup = new Map();
  const subregionLookup = new Map();
  if (regionColors) {
    for (const f of data.features) {
      const p = f.properties;
      const fid = p.id || p.name;
      const chain = [fid];
      let current = fid;
      let depth = 0;
      while (parentMap.has(current) && depth < 10) {
        current = parentMap.get(current);
        chain.push(current);
        depth++;
      }
      const rootId = chain[chain.length - 1];
      const rootFeat = data.features.find(rf => (rf.properties.id || rf.properties.name) === rootId);
      regionLookup.set(fid, rootFeat ? rootFeat.properties.name : p.name);
      if (chain.length >= 2) {
        subregionLookup.set(fid, chain[chain.length - 2]);
      }
    }
  }

  // Build sibling groups for color variant assignment
  const siblingsBySubregion = new Map();
  if (subregionColors) {
    for (const f of data.features) {
      const p = f.properties;
      if (getDepth(p.hierarchyLevel) === 4) {
        const subId = subregionLookup.get(p.id || p.name);
        if (subId && subregionColors[subId]) {
          if (!siblingsBySubregion.has(subId)) siblingsBySubregion.set(subId, []);
          siblingsBySubregion.get(subId).push(p.name);
        }
      }
    }
    for (const [, names] of siblingsBySubregion) {
      names.sort((a, b) => a.localeCompare(b));
    }
  }

  const variantsBySubregion = new Map();
  for (const [subId, names] of siblingsBySubregion) {
    const baseColor = subregionColors[subId];
    variantsBySubregion.set(subId, generateColorVariants(baseColor, names.length));
  }

  // Process features once — compute all static properties
  const processed = data.features.map(feature => {
    const featId = feature.properties.id || feature.properties.name;
    const name = feature.properties.name || '';
    const depth = getDepth(feature.properties.hierarchyLevel);

    let color = countryColor;
    if (subregionColors) {
      const subId = subregionLookup.get(featId);
      if (subId && subregionColors[subId]) {
        const siblings = siblingsBySubregion.get(subId);
        const variants = variantsBySubregion.get(subId);
        if (depth === 4 && siblings && variants) {
          const idx = siblings.indexOf(name);
          color = idx >= 0 ? variants[idx] : subregionColors[subId];
        } else {
          color = subregionColors[subId];
        }
      } else if (regionColors) {
        const regionName = regionLookup.get(featId);
        color = regionColors[regionName] || countryColor;
      }
    } else if (regionColors) {
      const regionName = regionLookup.get(featId);
      color = regionColors[regionName] || countryColor;
    }

    feature.properties.id = featId;
    feature.properties.color = color;
    feature.properties.country = feature.properties.country || country;
    feature.properties._depth = depth;
    const pid = feature.properties.parentId || '';
    feature.properties._isRegional = pid.includes('regional') ? true : false;
    feature.properties._isGrandCru = isGrandCru(name);
    const bbox = getBbox(feature.geometry);
    feature.properties._bboxArea = (bbox[2] - bbox[0]) * (bbox[3] - bbox[1]);
    return feature;
  });

  processedCache.set(country, processed);
  return processed;
}

/**
 * Load and merge GeoJSON for visible countries.
 * Uses cached pre-processed features; only updates _hidden/_faded flags.
 */
async function loadAllVisibleData(visibleCountries, hiddenIds, fadedIds) {
  const features = [];

  const promises = [...visibleCountries].map(async (country) => {
    const processed = await getProcessedFeatures(country);
    // Only update the lightweight hidden/faded flags
    for (const feature of processed) {
      const featId = feature.properties.id;
      feature.properties._hidden = hiddenIds?.has(featId) || false;
      feature.properties._faded = !feature.properties._hidden && (fadedIds?.has(featId) || false);
    }
    return processed;
  });

  const results = await Promise.all(promises);
  for (const countryFeatures of results) {
    features.push(...countryFeatures);
  }

  return { type: 'FeatureCollection', features };
}

function getBbox(geometry) {
  if (!geometry || !geometry.coordinates) return [0, 0, 0, 0];
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  const coords = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  for (const polygon of coords) {
    for (const ring of polygon) {
      for (const [lng, lat] of ring) {
        if (lng < minLng) minLng = lng;
        if (lat < minLat) minLat = lat;
        if (lng > maxLng) maxLng = lng;
        if (lat > maxLat) maxLat = lat;
      }
    }
  }
  return [minLng, minLat, maxLng, maxLat];
}

export { loadCountryGeoJSON };
export default MapView;
