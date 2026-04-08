/**
 * Czech Republic Wine Region Hierarchy
 * Maps all 11 Czech PDOs into 2 regions.
 */

export const CZECH_REPUBLIC_SUBREGIONS = {
  'Moravia': [],
  'Bohemia': [],
};

export const CZECH_REPUBLIC_REGIONS = Object.keys(CZECH_REPUBLIC_SUBREGIONS);

export const CZECH_REPUBLIC_APPELLATIONS = {
  // Moravia
  'Morava': 'Moravia',
  'Slovácká': 'Moravia',
  'Znojemská': 'Moravia',
  'Velkopavlovická': 'Moravia',
  'Mikulovská': 'Moravia',
  'Znojmo': 'Moravia',
  'Šobes / Šobeské víno': 'Moravia',
  'Novosedelské Slámové víno': 'Moravia',

  // Bohemia
  'Čechy': 'Bohemia',
  'Litoměřická': 'Bohemia',
  'Mělnická': 'Bohemia',
};
