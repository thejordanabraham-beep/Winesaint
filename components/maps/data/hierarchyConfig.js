/**
 * Hierarchy level depths and zoom thresholds for wine region visibility.
 *
 * Depth 0 = coarsest (geographical_unit, zone)
 * Depth 4 = finest (appellation, ward)
 *
 * Zoom thresholds control when each depth becomes visible on the map.
 * Features "fade" (become parent outlines) when zoom exceeds their maxZoom
 * and their children are rendering.
 */

export const HIERARCHY_DEPTHS = {
  geographical_unit: 0,
  zone: 1,
  region: 2,
  subregion: 3,
  district: 3,
  appellation: 4,
  ward: 4,
  category: 5,   // climat category headers (Grand Crus, Premier Crus)
  grand_cru: 6,
  premier_cru: 6,
  mga: 6,
  einzellage: 6,
  ried: 6,
  lieu_dit: 6,
};

// For flat countries (all features are "appellation" with no parent),
// everything renders at the same depth
export const DEFAULT_DEPTH = 4;

export const ZOOM_THRESHOLDS = [
  { minZoom: 2, maxZoom: 6 },   // depth 0: geographical_unit
  { minZoom: 3, maxZoom: 7 },   // depth 1: zone
  { minZoom: 3, maxZoom: 8 },   // depth 2: region
  { minZoom: 5, maxZoom: 10 },  // depth 3: subregion / district
  { minZoom: 5, maxZoom: 16 },  // depth 4: appellation / ward
  { minZoom: 9, maxZoom: 16 },  // depth 5: category headers (Grand Crus, Premier Crus)
  { minZoom: 9, maxZoom: 16 },  // depth 6: grand_cru / premier_cru climat leaves
];

export function getDepth(hierarchyLevel) {
  return HIERARCHY_DEPTHS[hierarchyLevel] ?? DEFAULT_DEPTH;
}

export function isVisibleAtZoom(hierarchyLevel, zoom) {
  const depth = getDepth(hierarchyLevel);
  const threshold = ZOOM_THRESHOLDS[depth];
  return zoom >= threshold.minZoom;
}

export function shouldFadeAtZoom(hierarchyLevel, zoom) {
  const depth = getDepth(hierarchyLevel);
  const threshold = ZOOM_THRESHOLDS[depth];
  return zoom > threshold.maxZoom;
}

