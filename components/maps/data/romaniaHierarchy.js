/**
 * Romania Wine Region Hierarchy
 * Maps all 40 Romanian PDOs into 6 regions.
 *
 * Note: Romania has duplicate feature names (Dealu Mare ×4, Panciu ×3,
 * Târnave ×2, Murfatlar ×2). The build script handles this by matching
 * features by name — duplicates all get the same parentId.
 */

export const ROMANIA_SUBREGIONS = {
  'Moldavia': [],
  'Muntenia & Oltenia': [],
  'Transylvania': [],
  'Dobrogea': [],
  'Banat': [],
  'Crişana': [],
};

export const ROMANIA_REGIONS = Object.keys(ROMANIA_SUBREGIONS);

export const ROMANIA_APPELLATIONS = {
  // Moldavia
  'Cotnari': 'Moldavia',
  'Iaşi': 'Moldavia',
  'Huşi': 'Moldavia',
  'Odobeşti': 'Moldavia',
  'Panciu': 'Moldavia',
  'Nicoreşti': 'Moldavia',
  'Coteşti': 'Moldavia',
  'Iana': 'Moldavia',
  'Bohotin': 'Moldavia',
  'Dealu Bujorului': 'Moldavia',

  // Muntenia & Oltenia
  'Dealu Mare': 'Muntenia & Oltenia',
  'Ştefăneşti': 'Muntenia & Oltenia',
  'Pietroasa': 'Muntenia & Oltenia',
  'Drăgăşani': 'Muntenia & Oltenia',
  'Sâmbureşti': 'Muntenia & Oltenia',
  'Segarcea': 'Muntenia & Oltenia',
  'Mehedinţi': 'Muntenia & Oltenia',
  'Banu Mărăcine': 'Muntenia & Oltenia',

  // Transylvania
  'Târnave': 'Transylvania',
  'Aiud': 'Transylvania',
  'Alba Iulia': 'Transylvania',
  'Lechinţa': 'Transylvania',
  'Sebeş-Apold': 'Transylvania',

  // Dobrogea
  'Murfatlar': 'Dobrogea',
  'Babadag': 'Dobrogea',
  'Sarica Niculiţel': 'Dobrogea',
  'Adamclisi': 'Dobrogea',
  'Oltina': 'Dobrogea',
  'Însurăţei': 'Dobrogea',

  // Banat
  'Banat': 'Banat',
  'Recaş': 'Banat',
  'Miniş': 'Banat',

  // Crişana
  'Crişana': 'Crişana',
};
