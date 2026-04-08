/**
 * Hungary Wine Region Hierarchy
 * Maps all 33 Hungarian PDOs into 7 regions.
 */

export const HUNGARY_SUBREGIONS = {
  'Tokaj': [],
  'Eger & Northern Hungary': [],
  'Balaton': [],
  'Villány & Southern Transdanubia': [],
  'Duna (Great Plain)': [],
  'Northern Transdanubia': [],
  'Somló': [],
};

export const HUNGARY_REGIONS = Object.keys(HUNGARY_SUBREGIONS);

export const HUNGARY_APPELLATIONS = {
  // Tokaj
  'Tokaj / Tokaji': 'Tokaj',

  // Eger & Northern Hungary
  'Eger / Egri': 'Eger & Northern Hungary',
  'Bükk / Bükki': 'Eger & Northern Hungary',
  'Mátra / Mátrai': 'Eger & Northern Hungary',
  'Debrői Hárslevelű': 'Eger & Northern Hungary',

  // Balaton
  'Badacsony / Badacsonyi': 'Balaton',
  'Balatonfüred-Csopak / Balatonfüred-Csopaki': 'Balaton',
  'Csopak / Csopaki': 'Balaton',
  'Balatonboglár / Balatonboglári': 'Balaton',
  'Balaton / Balatoni': 'Balaton',
  'Balaton-felvidék / Balaton-felvidéki': 'Balaton',
  'Tihany / Tihanyi': 'Balaton',
  'Káli': 'Balaton',
  'Zala / Zalai': 'Balaton',

  // Villány & Southern Transdanubia
  'Villány / Villányi': 'Villány & Southern Transdanubia',
  'Szekszárd / Szekszárdi': 'Villány & Southern Transdanubia',
  'Tolna / Tolnai': 'Villány & Southern Transdanubia',
  'Pécs': 'Villány & Southern Transdanubia',
  'Pannon': 'Villány & Southern Transdanubia',

  // Duna (Great Plain)
  'Kunság / Kunsági': 'Duna (Great Plain)',
  'Duna / Dunai': 'Duna (Great Plain)',
  'Hajós-Baja': 'Duna (Great Plain)',
  'Csongrád / Csongrádi': 'Duna (Great Plain)',
  'Soltvadkerti': 'Duna (Great Plain)',
  'Izsáki Arany Sárfehér': 'Duna (Great Plain)',
  'Monor / Monori': 'Duna (Great Plain)',

  // Northern Transdanubia
  'Sopron / Soproni': 'Northern Transdanubia',
  'Pannonhalma / Pannonhalmi': 'Northern Transdanubia',
  'Neszmély / Neszmélyi': 'Northern Transdanubia',
  'Mór / Móri': 'Northern Transdanubia',
  'Etyek-Buda / Etyek-Budai': 'Northern Transdanubia',

  // Somló
  'Somlói / Somló': 'Somló',
  'Nagy-Somló / Nagy-Somlói': 'Somló',
};
