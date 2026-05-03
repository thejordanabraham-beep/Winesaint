/**
 * Slovenia Wine Region Hierarchy
 * Maps all 14 Slovenian PDOs into 3 regions.
 */

export const SLOVENIA_SUBREGIONS = {
  'Primorska': [],
  'Podravje': [],
  'Posavje': [],
};

export const SLOVENIA_REGIONS = Object.keys(SLOVENIA_SUBREGIONS);

export const SLOVENIA_APPELLATIONS = {
  // Primorska (Littoral)
  'Goriška Brda': 'Primorska',
  'Vipavska dolina': 'Primorska',
  'Slovenska Istra': 'Primorska',
  'Kras': 'Primorska',
  'Teran': 'Primorska',

  // Podravje (Drava)
  'Štajerska Slovenija': 'Podravje',
  'Prekmurje': 'Podravje',

  // Posavje (Sava)
  'Bizeljsko Sremič': 'Posavje',
  'Dolenjska': 'Posavje',
  'Bela krajina': 'Posavje',
  'Bizeljčan': 'Posavje',
  'Cviček': 'Posavje',
  'Belokranjec': 'Posavje',
  'Metliška črnina': 'Posavje',
};
