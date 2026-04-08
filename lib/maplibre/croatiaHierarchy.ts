/**
 * Croatia Wine Region Hierarchy
 * Maps all 18 Croatian PDOs into 3 regions.
 */

export const CROATIA_SUBREGIONS = {
  'Continental Croatia': [],
  'Istria & Kvarner': [],
  'Dalmatia': [],
};

export const CROATIA_REGIONS = Object.keys(CROATIA_SUBREGIONS);

export const CROATIA_APPELLATIONS = {
  // Continental Croatia
  'Istočna kontinentalna Hrvatska': 'Continental Croatia',
  'Zapadna kontinentalna Hrvatska': 'Continental Croatia',
  'Slavonija': 'Continental Croatia',
  'Hrvatsko Podunavlje': 'Continental Croatia',
  'Moslavina': 'Continental Croatia',
  'Plešivica': 'Continental Croatia',
  'Pokuplje': 'Continental Croatia',
  'Prigorje-Bilogora': 'Continental Croatia',
  'Zagorje – Međimurje': 'Continental Croatia',

  // Istria & Kvarner
  'Hrvatska Istra': 'Istria & Kvarner',
  'Hrvatsko primorje': 'Istria & Kvarner',
  'Primorska Hrvatska': 'Istria & Kvarner',
  'Ponikve': 'Istria & Kvarner',
  'Muškat momjanski / Moscato di Momiano': 'Istria & Kvarner',

  // Dalmatia
  'Dalmatinska zagora': 'Dalmatia',
  'Dingač': 'Dalmatia',
  'Sjeverna Dalmacija': 'Dalmatia',
  'Srednja i Južna Dalmacija': 'Dalmatia',
};
