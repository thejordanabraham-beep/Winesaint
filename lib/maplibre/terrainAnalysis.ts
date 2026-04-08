/**
 * Custom tile protocol for computing slope and aspect from Terrarium DEM tiles.
 * Registers terrain-analysis:// protocol with MapLibre.
 *
 * Usage:
 *   tiles: ['terrain-analysis://slope/{z}/{x}/{y}']
 *   tiles: ['terrain-analysis://aspect/{z}/{x}/{y}']
 */

const TILE_SIZE = 256;

// Decode Terrarium-encoded RGB to elevation in meters
function terrariumToElevation(r, g, b) {
  return (r * 256 + g + b / 256) - 32768;
}

// Slope color ramp: green (flat) -> yellow -> orange -> red (steep)
function slopeToColor(slopeDeg) {
  if (slopeDeg < 5) {
    // 0-5°: transparent green
    const t = slopeDeg / 5;
    return [34, 139, 34, Math.round(t * 120)];
  } else if (slopeDeg < 15) {
    // 5-15°: green -> yellow
    const t = (slopeDeg - 5) / 10;
    return [
      Math.round(34 + t * (255 - 34)),
      Math.round(139 + t * (200 - 139)),
      Math.round(34 * (1 - t)),
      140,
    ];
  } else if (slopeDeg < 25) {
    // 15-25°: yellow -> orange
    const t = (slopeDeg - 15) / 10;
    return [255, Math.round(200 - t * 80), 0, 160];
  } else if (slopeDeg < 35) {
    // 25-35°: orange -> red
    const t = (slopeDeg - 25) / 10;
    return [255, Math.round(120 - t * 100), 0, 180];
  } else {
    // 35°+: deep red
    return [200, 0, 0, 200];
  }
}

// Aspect color ramp: circular hue wheel for compass direction
function aspectToColor(aspectDeg) {
  // aspectDeg: 0=North, 90=East, 180=South, 270=West
  // North=blue, East=yellow, South=red/warm, West=green
  const a = aspectDeg;
  let r, g, b;

  if (a < 45 || a >= 315) {
    // North: blue
    const t = a < 45 ? (45 - a) / 45 : (405 - a) / 45;
    r = Math.round(60 * (1 - t) + 100 * t);
    g = Math.round(100 * (1 - t) + 140 * t);
    b = Math.round(220 * t + 180 * (1 - t));
  } else if (a < 135) {
    // East: yellow/gold
    const t = (a - 45) / 90;
    r = Math.round(100 + t * 155);
    g = Math.round(140 + t * 60);
    b = Math.round(180 * (1 - t));
  } else if (a < 225) {
    // South: warm red/orange
    const t = (a - 135) / 90;
    r = Math.round(255 - t * 30);
    g = Math.round(200 * (1 - t) + 100 * t);
    b = Math.round(40 * t);
  } else {
    // West: green
    const t = (a - 225) / 90;
    r = Math.round(225 * (1 - t) + 60 * t);
    g = Math.round(100 + t * 40);
    b = Math.round(40 + t * 140);
  }

  return [r, g, b, 150];
}

// Fetch a Terrarium tile and return elevation grid
async function fetchElevationTile(z, x, y) {
  const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`;
  const response = await fetch(url);
  if (!response.ok) return null;

  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);

  const canvas = new OffscreenCanvas(TILE_SIZE, TILE_SIZE);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, TILE_SIZE, TILE_SIZE);
  const data = imageData.data;

  const elevations = new Float32Array(TILE_SIZE * TILE_SIZE);
  for (let i = 0; i < TILE_SIZE * TILE_SIZE; i++) {
    const idx = i * 4;
    elevations[i] = terrariumToElevation(data[idx], data[idx + 1], data[idx + 2]);
  }

  return elevations;
}

// Compute slope and aspect from elevation grid using Horn's method
function computeSlopeAspect(elevations, cellSize) {
  const w = TILE_SIZE;
  const h = TILE_SIZE;
  const slopes = new Float32Array(w * h);
  const aspects = new Float32Array(w * h);

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;

      // 3x3 neighborhood
      const a = elevations[(y - 1) * w + (x - 1)];
      const b = elevations[(y - 1) * w + x];
      const c = elevations[(y - 1) * w + (x + 1)];
      const d = elevations[y * w + (x - 1)];
      const f = elevations[y * w + (x + 1)];
      const g = elevations[(y + 1) * w + (x - 1)];
      const hh = elevations[(y + 1) * w + x];
      const ii = elevations[(y + 1) * w + (x + 1)];

      // Horn's method
      const dzdx = ((c + 2 * f + ii) - (a + 2 * d + g)) / (8 * cellSize);
      const dzdy = ((g + 2 * hh + ii) - (a + 2 * b + c)) / (8 * cellSize);

      const slopeRad = Math.atan(Math.sqrt(dzdx * dzdx + dzdy * dzdy));
      slopes[idx] = slopeRad * 180 / Math.PI;

      let aspectRad = Math.atan2(-dzdy, dzdx);
      let aspectDeg = aspectRad * 180 / Math.PI;
      // Convert from math convention to compass (0=North, clockwise)
      aspectDeg = (90 - aspectDeg + 360) % 360;
      aspects[idx] = aspectDeg;
    }
  }

  // Fill edges by copying nearest computed values
  for (let x = 0; x < w; x++) {
    slopes[x] = slopes[w + x];
    aspects[x] = aspects[w + x];
    slopes[(h - 1) * w + x] = slopes[(h - 2) * w + x];
    aspects[(h - 1) * w + x] = aspects[(h - 2) * w + x];
  }
  for (let y = 0; y < h; y++) {
    slopes[y * w] = slopes[y * w + 1];
    aspects[y * w] = aspects[y * w + 1];
    slopes[y * w + w - 1] = slopes[y * w + w - 2];
    aspects[y * w + w - 1] = aspects[y * w + w - 2];
  }

  return { slopes, aspects };
}

// Compute cell size in meters for a given zoom level and latitude
function cellSizeMeters(z, lat) {
  const metersPerPixel = 156543.03 * Math.cos(lat * Math.PI / 180) / Math.pow(2, z);
  return metersPerPixel;
}

// Tile cache
const tileCache = new Map();
const MAX_CACHE = 200;

function cacheKey(type, z, x, y) {
  return `${type}/${z}/${x}/${y}`;
}

function pruneCache() {
  if (tileCache.size > MAX_CACHE) {
    const keys = [...tileCache.keys()];
    for (let i = 0; i < keys.length - MAX_CACHE / 2; i++) {
      tileCache.delete(keys[i]);
    }
  }
}

// Generate contour line tile from elevation data
function renderContourTile(elevations, z) {
  // Choose contour intervals based on zoom level
  const minorInterval = z >= 13 ? 10 : z >= 11 ? 20 : z >= 9 ? 50 : 100;
  const majorInterval = minorInterval * 5;

  const canvas = new OffscreenCanvas(TILE_SIZE, TILE_SIZE);
  const ctx = canvas.getContext('2d');

  // For each pixel, check if a contour line crosses between it and its neighbors
  const imageData = ctx.createImageData(TILE_SIZE, TILE_SIZE);
  const pixels = imageData.data;

  for (let y = 0; y < TILE_SIZE - 1; y++) {
    for (let x = 0; x < TILE_SIZE - 1; x++) {
      const idx = y * TILE_SIZE + x;
      const e0 = elevations[idx];
      const eRight = elevations[idx + 1];
      const eDown = elevations[(y + 1) * TILE_SIZE + x];

      // Check if a contour crosses horizontally or vertically
      const minE = Math.min(e0, eRight, eDown);
      const maxE = Math.max(e0, eRight, eDown);

      // Find the lowest contour level in range
      const lowContour = Math.ceil(minE / minorInterval) * minorInterval;

      if (lowContour <= maxE && lowContour > 0) {
        const isMajor = lowContour % majorInterval === 0;
        const pidx = idx * 4;
        if (isMajor) {
          pixels[pidx] = 90;
          pixels[pidx + 1] = 58;
          pixels[pidx + 2] = 26;
          pixels[pidx + 3] = 200;
        } else {
          pixels[pidx] = 139;
          pixels[pidx + 1] = 115;
          pixels[pidx + 2] = 85;
          pixels[pidx + 3] = 130;
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

// Generate a colored tile for slope, aspect, or contours
async function generateAnalysisTile(type, z, x, y) {
  const key = cacheKey(type, z, x, y);
  if (tileCache.has(key)) return tileCache.get(key);

  const elevations = await fetchElevationTile(z, x, y);
  if (!elevations) return null;

  let canvas;

  if (type === 'contour') {
    canvas = renderContourTile(elevations, z);
  } else {
    // Approximate latitude of tile center for cell size calculation
    const n = Math.PI - 2 * Math.PI * (y + 0.5) / Math.pow(2, z);
    const lat = 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    const cs = cellSizeMeters(z, lat);

    const { slopes, aspects } = computeSlopeAspect(elevations, cs);

    canvas = new OffscreenCanvas(TILE_SIZE, TILE_SIZE);
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(TILE_SIZE, TILE_SIZE);
    const pixels = imageData.data;

    const colorFn = type === 'slope' ? slopeToColor : aspectToColor;
    const values = type === 'slope' ? slopes : aspects;

    for (let i = 0; i < TILE_SIZE * TILE_SIZE; i++) {
      const [r, g, b, a] = colorFn(values[i]);
      const idx = i * 4;
      pixels[idx] = r;
      pixels[idx + 1] = g;
      pixels[idx + 2] = b;
      pixels[idx + 3] = a;
    }

    ctx.putImageData(imageData, 0, 0);
  }

  const blob = await canvas.convertToBlob({ type: 'image/png' });
  const buffer = await blob.arrayBuffer();

  pruneCache();
  tileCache.set(key, buffer);

  return buffer;
}

// Register the custom protocol with MapLibre
export function registerTerrainAnalysisProtocol(maplibregl) {
  maplibregl.addProtocol('terrain-analysis', async (params) => {
    // URL format: terrain-analysis://slope/{z}/{x}/{y} or terrain-analysis://aspect/{z}/{x}/{y}
    const parts = params.url.replace('terrain-analysis://', '').split('/');
    const type = parts[0]; // 'slope' or 'aspect'
    const z = parseInt(parts[1]);
    const x = parseInt(parts[2]);
    const y = parseInt(parts[3]);

    const buffer = await generateAnalysisTile(type, z, x, y);
    if (!buffer) {
      return { data: new ArrayBuffer(0) };
    }

    return { data: buffer };
  });
}
