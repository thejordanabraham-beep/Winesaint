'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

const TILE_SIZE = 256;

function terrariumToElevation(r, g, b) {
  return (r * 256 + g + b / 256) - 32768;
}

function lngLatToTile(lng, lat, zoom) {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
  return { x, y };
}

function lngLatToPixel(lng, lat, zoom) {
  const n = Math.pow(2, zoom);
  const xFull = ((lng + 180) / 360) * n * TILE_SIZE;
  const latRad = (lat * Math.PI) / 180;
  const yFull = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n * TILE_SIZE;
  const tile = lngLatToTile(lng, lat, zoom);
  const px = Math.floor(xFull - tile.x * TILE_SIZE);
  const py = Math.floor(yFull - tile.y * TILE_SIZE);
  return { px: Math.min(255, Math.max(0, px)), py: Math.min(255, Math.max(0, py)) };
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const tileImageCache = new Map();
const MAX_TILE_CACHE = 50;

async function getElevationAtPoint(lng, lat) {
  const zoom = 12;
  const tile = lngLatToTile(lng, lat, zoom);
  const key = `${zoom}/${tile.x}/${tile.y}`;

  let imageData;
  if (tileImageCache.has(key)) {
    imageData = tileImageCache.get(key);
  } else {
    const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${zoom}/${tile.x}/${tile.y}.png`;
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const blob = await res.blob();
      const bitmap = await createImageBitmap(blob);
      const canvas = new OffscreenCanvas(TILE_SIZE, TILE_SIZE);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(bitmap, 0, 0);
      imageData = ctx.getImageData(0, 0, TILE_SIZE, TILE_SIZE);
      if (tileImageCache.size > MAX_TILE_CACHE) {
        const oldest = tileImageCache.keys().next().value;
        tileImageCache.delete(oldest);
      }
      tileImageCache.set(key, imageData);
    } catch {
      return null;
    }
  }

  const { px, py } = lngLatToPixel(lng, lat, zoom);
  const idx = (py * TILE_SIZE + px) * 4;
  return terrariumToElevation(imageData.data[idx], imageData.data[idx + 1], imageData.data[idx + 2]);
}

async function sampleElevationProfile(start, end, numSamples = 100) {
  const points = [];
  for (let i = 0; i <= numSamples; i++) {
    const t = i / numSamples;
    const lng = start[0] + t * (end[0] - start[0]);
    const lat = start[1] + t * (end[1] - start[1]);
    const dist = haversine(start[1], start[0], lat, lng);
    points.push({ lng, lat, dist, t });
  }

  const elevations = await Promise.all(points.map(p => getElevationAtPoint(p.lng, p.lat)));
  return points.map((p, i) => ({ ...p, elevation: elevations[i] ?? 0 }));
}

function ElevationProfile({ mapRef, onClose }) {
  const [points, setPoints] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(null);
  const canvasRef = useRef(null);

  // Register click handler on map — stopPropagation to avoid triggering feature clicks
  useEffect(() => {
    const map = mapRef?.current?.getMap?.();
    if (!map) return;

    const handler = (e) => {
      e.preventDefault();
      setPoints(prev => {
        if (prev.length >= 2) return [e.lngLat];
        return [...prev, e.lngLat];
      });
    };

    map.on('click', handler);
    map.getCanvas().style.cursor = 'crosshair';

    return () => {
      map.off('click', handler);
      map.getCanvas().style.cursor = '';
    };
  }, [mapRef]);

  // Draw line on map between the two points
  useEffect(() => {
    const map = mapRef?.current?.getMap?.();
    if (!map || points.length !== 2) return;

    const geojson = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [points[0].lng, points[0].lat],
          [points[1].lng, points[1].lat],
        ],
      },
    };

    if (map.getSource('elevation-profile-line')) {
      map.getSource('elevation-profile-line').setData(geojson);
    } else {
      map.addSource('elevation-profile-line', { type: 'geojson', data: geojson });
      map.addLayer({
        id: 'elevation-profile-line-layer',
        type: 'line',
        source: 'elevation-profile-line',
        paint: {
          'line-color': '#c9a96e',
          'line-width': 3,
          'line-dasharray': [3, 2],
        },
      });
    }
  }, [points, mapRef]);

  // Cleanup map layers on unmount
  useEffect(() => {
    return () => {
      const map = mapRef?.current?.getMap?.();
      if (!map) return;
      try {
        if (map.getLayer('elevation-profile-line-layer')) map.removeLayer('elevation-profile-line-layer');
        if (map.getLayer('elevation-profile-marker')) map.removeLayer('elevation-profile-marker');
        if (map.getSource('elevation-profile-line')) map.removeSource('elevation-profile-line');
        if (map.getSource('elevation-profile-point')) map.removeSource('elevation-profile-point');
      } catch { /* map may be disposed */ }
    };
  }, [mapRef]);

  // Fetch elevation profile when both points are set
  useEffect(() => {
    if (points.length !== 2) {
      setProfile(null);
      return;
    }
    let stale = false;
    setLoading(true);
    const start = [points[0].lng, points[0].lat];
    const end = [points[1].lng, points[1].lat];
    sampleElevationProfile(start, end).then(data => {
      if (!stale) {
        setProfile(data);
        setLoading(false);
      }
    });
    return () => { stale = true; };
  }, [points]);

  // Draw the chart on canvas
  useEffect(() => {
    if (!profile || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const pad = { top: 20, right: 16, bottom: 30, left: 50 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;

    ctx.clearRect(0, 0, W, H);

    const elevs = profile.map(p => p.elevation);
    const minE = Math.min(...elevs);
    const maxE = Math.max(...elevs);
    const range = maxE - minE || 1;
    const maxDist = profile[profile.length - 1].dist;

    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (chartH * i) / 4;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(W - pad.right, y);
      ctx.stroke();
    }

    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const elev = maxE - (range * i) / 4;
      const y = pad.top + (chartH * i) / 4;
      ctx.fillText(`${Math.round(elev)}m`, pad.left - 6, y + 3);
    }

    ctx.textAlign = 'center';
    for (let i = 0; i <= 4; i++) {
      const dist = (maxDist * i) / 4;
      const x = pad.left + (chartW * i) / 4;
      ctx.fillText(`${dist.toFixed(1)}km`, x, H - 6);
    }

    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top + chartH);
    for (let i = 0; i < profile.length; i++) {
      const x = pad.left + (profile[i].dist / maxDist) * chartW;
      const y = pad.top + chartH - ((profile[i].elevation - minE) / range) * chartH;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(pad.left + chartW, pad.top + chartH);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    grad.addColorStop(0, 'rgba(201, 169, 110, 0.4)');
    grad.addColorStop(1, 'rgba(201, 169, 110, 0.05)');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    for (let i = 0; i < profile.length; i++) {
      const x = pad.left + (profile[i].dist / maxDist) * chartW;
      const y = pad.top + chartH - ((profile[i].elevation - minE) / range) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#c9a96e';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (hoverIdx != null && hoverIdx < profile.length) {
      const p = profile[hoverIdx];
      const x = pad.left + (p.dist / maxDist) * chartW;
      const y = pad.top + chartH - ((p.elevation - minE) / range) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      ctx.fillStyle = '#c9a96e';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(p.elevation)}m`, x, y - 10);
    }
  }, [profile, hoverIdx]);

  const handleCanvasHover = useCallback((e) => {
    if (!profile || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pad = { left: 50, right: 16 };
    const chartW = canvasRef.current.width - pad.left - pad.right;
    const t = (x - pad.left) / chartW;
    if (t < 0 || t > 1) { setHoverIdx(null); return; }
    const idx = Math.round(t * (profile.length - 1));
    setHoverIdx(idx);

    const map = mapRef?.current?.getMap?.();
    if (map && profile[idx]) {
      const point = {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [profile[idx].lng, profile[idx].lat] },
      };
      if (map.getSource('elevation-profile-point')) {
        map.getSource('elevation-profile-point').setData(point);
      } else {
        map.addSource('elevation-profile-point', { type: 'geojson', data: point });
        map.addLayer({
          id: 'elevation-profile-marker',
          type: 'circle',
          source: 'elevation-profile-point',
          paint: { 'circle-radius': 6, 'circle-color': '#c9a96e', 'circle-stroke-color': '#fff', 'circle-stroke-width': 2 },
        });
      }
    }
  }, [profile, mapRef]);

  const totalDist = points.length === 2 ? haversine(points[0].lat, points[0].lng, points[1].lat, points[1].lng) : 0;
  const elevGain = profile ? (() => {
    let gain = 0;
    for (let i = 1; i < profile.length; i++) {
      const diff = profile[i].elevation - profile[i - 1].elevation;
      if (diff > 0) gain += diff;
    }
    return Math.round(gain);
  })() : 0;

  return (
    <div className="elevation-profile-panel">
      <div className="elevation-profile-header">
        <span>Elevation Profile</span>
        <button className="panel-close" onClick={onClose}>&times;</button>
      </div>
      <div className="elevation-profile-body">
        {points.length < 2 && (
          <div className="elevation-profile-hint">
            Click {points.length === 0 ? 'a start point' : 'an end point'} on the map
          </div>
        )}
        {loading && <div className="elevation-profile-hint">Loading elevation data...</div>}
        {profile && (
          <>
            <div className="elevation-profile-stats">
              <span>Distance: {totalDist.toFixed(2)} km</span>
              <span>Gain: +{elevGain}m</span>
              <span>Min: {Math.round(Math.min(...profile.map(p => p.elevation)))}m</span>
              <span>Max: {Math.round(Math.max(...profile.map(p => p.elevation)))}m</span>
            </div>
            <canvas
              ref={canvasRef}
              width={440}
              height={160}
              className="elevation-profile-canvas"
              onMouseMove={handleCanvasHover}
              onMouseLeave={() => setHoverIdx(null)}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default ElevationProfile;
