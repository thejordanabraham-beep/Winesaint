import { useRef, useCallback, useMemo } from 'react';

const DEFAULTS = {
  center: [10, 45],
  zoom: 3,
  style: 'light',
  countries: [],
};

function parseHash() {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.slice(1);
  if (!hash) return null;

  const params = new URLSearchParams(hash);
  const result = {};

  const map = params.get('map');
  if (map) {
    const parts = map.split('/');
    if (parts.length === 3) {
      const zoom = parseFloat(parts[0]);
      const lat = parseFloat(parts[1]);
      const lng = parseFloat(parts[2]);
      if (!isNaN(zoom) && !isNaN(lat) && !isNaN(lng)) {
        result.zoom = zoom;
        result.center = [lng, lat];
      }
    }
  }

  const style = params.get('style');
  if (style && ['light', 'dark', 'satellite'].includes(style)) {
    result.style = style;
  }

  const countries = params.get('countries');
  if (countries) {
    result.countries = countries.split(',').filter(Boolean);
  }

  return Object.keys(result).length > 0 ? result : null;
}

function buildHash(zoom, center, style, countries) {
  const z = zoom.toFixed(1);
  const lat = center[1].toFixed(4);
  const lng = center[0].toFixed(4);

  let hash = `map=${z}/${lat}/${lng}`;
  if (style && style !== 'light') {
    hash += `&style=${style}`;
  }
  if (countries.length > 0) {
    hash += `&countries=${countries.join(',')}`;
  }
  return hash;
}

export function useUrlState() {
  const timerRef = useRef(null);

  const parsed = useMemo(() => parseHash(), []);

  const initialCenter = parsed?.center ?? DEFAULTS.center;
  const initialZoom = parsed?.zoom ?? DEFAULTS.zoom;
  const initialStyle = parsed?.style ?? DEFAULTS.style;
  const initialCountries = parsed?.countries ?? DEFAULTS.countries;

  const updateUrl = useCallback((zoom, center, style, countries) => {
    if (typeof window === 'undefined') return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const hash = buildHash(zoom, center, style, countries);
      window.history.replaceState(null, '', '#' + hash);
    }, 300);
  }, []);

  return { initialCenter, initialZoom, initialStyle, initialCountries, updateUrl };
}
