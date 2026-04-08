'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

const SOURCE_ID = 'measure-geojson';
const LINE_LAYER = 'measure-line';
const FILL_LAYER = 'measure-fill';
const POINT_LAYER = 'measure-points';

// Haversine distance in meters
function haversine(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * sinLng * sinLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Total distance along a polyline (meters)
function totalDistance(points) {
  let d = 0;
  for (let i = 1; i < points.length; i++) {
    d += haversine(points[i - 1], points[i]);
  }
  return d;
}

// Shoelace area on a sphere approximation — project to meters then compute
function polygonArea(points) {
  if (points.length < 3) return 0;
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371000;
  // Convert lng/lat to approximate local meters from centroid
  const cLat = points.reduce((s, p) => s + p[1], 0) / points.length;
  const cosLat = Math.cos(toRad(cLat));
  const meters = points.map((p) => [
    toRad(p[0]) * R * cosLat,
    toRad(p[1]) * R,
  ]);
  // Shoelace
  let area = 0;
  for (let i = 0; i < meters.length; i++) {
    const j = (i + 1) % meters.length;
    area += meters[i][0] * meters[j][1];
    area -= meters[j][0] * meters[i][1];
  }
  return Math.abs(area) / 2;
}

function formatDistance(meters) {
  const km = meters / 1000;
  const miles = km * 0.621371;
  if (km < 1) return `${Math.round(meters)} m / ${Math.round(meters * 3.28084)} ft`;
  return `${km.toFixed(2)} km / ${miles.toFixed(2)} mi`;
}

function formatArea(sqMeters) {
  const hectares = sqMeters / 10000;
  const acres = hectares * 2.47105;
  if (hectares < 1) return `${Math.round(sqMeters)} m² / ${Math.round(sqMeters * 10.7639)} ft²`;
  return `${hectares.toFixed(2)} ha / ${acres.toFixed(2)} ac`;
}

export default function MeasureTools({ mapRef, mode, onClose }) {
  const [points, setPoints] = useState([]);
  const pointsRef = useRef([]);
  const modeRef = useRef(mode);

  // Keep refs in sync
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Reset points when mode changes
  useEffect(() => {
    setPoints([]);
    pointsRef.current = [];
  }, [mode]);

  const updateSource = useCallback((pts) => {
    const map = mapRef.current?.getMap?.();
    if (!map) return;
    const src = map.getSource(SOURCE_ID);
    if (!src) return;

    const features = [];

    // Points
    for (const p of pts) {
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: p },
        properties: {},
      });
    }

    // Line or polygon
    if (pts.length >= 2) {
      if (modeRef.current === 'area' && pts.length >= 3) {
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[...pts, pts[0]]],
          },
          properties: { shape: 'polygon' },
        });
      }
      features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: modeRef.current === 'area' ? [...pts, pts[0]] : pts,
        },
        properties: { shape: 'line' },
      });
    }

    src.setData({ type: 'FeatureCollection', features });
  }, [mapRef]);

  // Setup source + layers + click handler
  useEffect(() => {
    const map = mapRef.current?.getMap?.();
    if (!map || !mode) return;

    // Ensure source exists
    if (!map.getSource(SOURCE_ID)) {
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
    }

    // Add layers
    if (!map.getLayer(FILL_LAYER)) {
      map.addLayer({
        id: FILL_LAYER,
        type: 'fill',
        source: SOURCE_ID,
        filter: ['==', ['get', 'shape'], 'polygon'],
        paint: {
          'fill-color': '#c9a96e',
          'fill-opacity': 0.15,
        },
      });
    }

    if (!map.getLayer(LINE_LAYER)) {
      map.addLayer({
        id: LINE_LAYER,
        type: 'line',
        source: SOURCE_ID,
        filter: ['==', ['get', 'shape'], 'line'],
        paint: {
          'line-color': '#c9a96e',
          'line-width': 2.5,
          'line-dasharray': [4, 3],
        },
      });
    }

    if (!map.getLayer(POINT_LAYER)) {
      map.addLayer({
        id: POINT_LAYER,
        type: 'circle',
        source: SOURCE_ID,
        filter: ['==', ['geometry-type'], 'Point'],
        paint: {
          'circle-radius': 5,
          'circle-color': '#c9a96e',
          'circle-stroke-color': '#fff',
          'circle-stroke-width': 2,
        },
      });
    }

    // Click handler
    const onClick = (e) => {
      if (!modeRef.current) return;
      const coord = [e.lngLat.lng, e.lngLat.lat];
      const next = [...pointsRef.current, coord];
      pointsRef.current = next;
      setPoints(next);
      updateSource(next);
    };

    map.on('click', onClick);
    map.getCanvas().style.cursor = 'crosshair';

    return () => {
      map.off('click', onClick);
      try {
        map.getCanvas().style.cursor = '';
        if (map.getLayer(POINT_LAYER)) map.removeLayer(POINT_LAYER);
        if (map.getLayer(LINE_LAYER)) map.removeLayer(LINE_LAYER);
        if (map.getLayer(FILL_LAYER)) map.removeLayer(FILL_LAYER);
        if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
      } catch { /* map may be disposed */ }
    };
  }, [mapRef, mode, updateSource]);

  if (!mode) return null;

  const dist = points.length >= 2 ? totalDistance(points) : 0;
  const area = mode === 'area' && points.length >= 3 ? polygonArea(points) : 0;

  const handleUndo = () => {
    const next = pointsRef.current.slice(0, -1);
    pointsRef.current = next;
    setPoints(next);
    updateSource(next);
  };

  const handleClear = () => {
    pointsRef.current = [];
    setPoints([]);
    updateSource([]);
  };

  return (
    <div className="measure-panel">
      <div className="measure-header">
        <span>{mode === 'distance' ? '📏 Distance' : '📐 Area'}</span>
        <button className="panel-close" onClick={onClose} title="Close">×</button>
      </div>
      <div className="measure-body">
        <div className="measure-hint">
          Click on the map to add points.{' '}
          {mode === 'area' && points.length < 3 && `Need ${3 - points.length} more point(s).`}
        </div>
        {points.length >= 2 && (
          <div className="measure-result">
            <span className="measure-label">Distance</span>
            <span className="measure-value">{formatDistance(dist)}</span>
          </div>
        )}
        {mode === 'area' && area > 0 && (
          <div className="measure-result">
            <span className="measure-label">Area</span>
            <span className="measure-value">{formatArea(area)}</span>
          </div>
        )}
        <div className="measure-actions">
          <button
            className="measure-btn"
            onClick={handleUndo}
            disabled={points.length === 0}
          >
            Undo
          </button>
          <button
            className="measure-btn"
            onClick={handleClear}
            disabled={points.length === 0}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
