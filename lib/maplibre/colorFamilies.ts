/**
 * Color family generation for wine region maps.
 * Given a base hex color, generates N visually distinct variants
 * that share the same hue but vary in saturation and lightness.
 */

// Cache generated variant arrays: key = `${hex}-${count}`
const variantCache = new Map();

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return [h * 360, s * 100, l * 100];
}

function hslToHex(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generate `count` color variants from a base hex color.
 * Variants share the base hue but spread across saturation and lightness,
 * optimized for readability on a dark basemap.
 */
export function generateColorVariants(baseHex, count) {
  const cacheKey = `${baseHex}-${count}`;
  if (variantCache.has(cacheKey)) return variantCache.get(cacheKey);

  if (count <= 1) {
    const result = [baseHex];
    variantCache.set(cacheKey, result);
    return result;
  }

  const [baseH] = hexToHsl(baseHex);

  // Spread saturation and lightness across these ranges
  const satMin = 40, satMax = 85;
  const litMin = 32, litMax = 58;

  const variants = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    // Slight hue shift for extra variation (+/- 8 degrees)
    const h = baseH + (t - 0.5) * 16;
    const s = satMin + t * (satMax - satMin);
    const l = litMin + t * (litMax - litMin);
    variants.push(hslToHex(h, s, l));
  }

  variantCache.set(cacheKey, variants);
  return variants;
}

/**
 * Create a diagonal hatch pattern as a canvas image for MapLibre's fill-pattern.
 * Returns a canvas element that can be passed to map.addImage().
 */
export function createHatchPattern(size = 16) {
  const data = new Uint8ClampedArray(size * size * 4);
  // Draw diagonal lines in gold (212, 175, 55) at ~60% opacity
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const onDiagonal = ((x + y) % size === 0) || ((x + y) % size === 1);
      const i = (y * size + x) * 4;
      if (onDiagonal) {
        data[i]     = 212; // R
        data[i + 1] = 175; // G
        data[i + 2] = 55;  // B
        data[i + 3] = 153; // A (~60%)
      }
    }
  }
  return { width: size, height: size, data };
}

