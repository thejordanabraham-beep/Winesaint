/**
 * Portugal Wine Region Hierarchy
 *
 * Maps all 30 Portuguese PDOs into regions.
 * Every PDO name in the GeoJSON must appear exactly once in PORTUGAL_APPELLATIONS.
 */

export const PORTUGAL_SUBREGIONS = {
  'Douro & Porto': [],
  'Minho': [],
  'Trás-os-Montes': [],
  'Beiras': [],
  'Lisboa': [],
  'Tejo': [],
  'Setúbal Peninsula': [],
  'Alentejo': [],
  'Algarve': [],
  'Madeira': [],
  'Azores': [],
};

export const PORTUGAL_REGIONS = Object.keys(PORTUGAL_SUBREGIONS);

export const PORTUGAL_APPELLATIONS = {
  // ═══════════════════════════════════════════════════════════════════
  // DOURO & PORTO
  // ═══════════════════════════════════════════════════════════════════
  'Douro': 'Douro & Porto',
  'Porto / Port / vinho do Porto / Port Wine / vin de Porto / Oporto / Portvin / Portwein / Portwijn': 'Douro & Porto',

  // ═══════════════════════════════════════════════════════════════════
  // MINHO
  // ═══════════════════════════════════════════════════════════════════
  'Vinho Verde': 'Minho',

  // ═══════════════════════════════════════════════════════════════════
  // TRÁS-OS-MONTES
  // ═══════════════════════════════════════════════════════════════════
  'Trás-os-Montes': 'Trás-os-Montes',

  // ═══════════════════════════════════════════════════════════════════
  // BEIRAS
  // ═══════════════════════════════════════════════════════════════════
  'Dão': 'Beiras',
  'Bairrada': 'Beiras',
  'Beira Interior': 'Beiras',
  'Távora-Varosa': 'Beiras',
  'Lafões': 'Beiras',

  // ═══════════════════════════════════════════════════════════════════
  // LISBOA
  // ═══════════════════════════════════════════════════════════════════
  'Colares': 'Lisboa',
  'Carcavelos': 'Lisboa',
  'Bucelas': 'Lisboa',
  'Torres Vedras': 'Lisboa',
  'Alenquer': 'Lisboa',
  'Óbidos': 'Lisboa',
  'Encostas d\u2019Aire': 'Lisboa',
  'Arruda': 'Lisboa',

  // ═══════════════════════════════════════════════════════════════════
  // TEJO
  // ═══════════════════════════════════════════════════════════════════
  'DoTejo': 'Tejo',

  // ═══════════════════════════════════════════════════════════════════
  // SETÚBAL PENINSULA
  // ═══════════════════════════════════════════════════════════════════
  'Setúbal': 'Setúbal Peninsula',
  'Palmela': 'Setúbal Peninsula',

  // ═══════════════════════════════════════════════════════════════════
  // ALENTEJO
  // ═══════════════════════════════════════════════════════════════════
  'Alentejo': 'Alentejo',

  // ═══════════════════════════════════════════════════════════════════
  // ALGARVE
  // ═══════════════════════════════════════════════════════════════════
  'Tavira': 'Algarve',
  'Lagoa': 'Algarve',
  'Portimão': 'Algarve',
  'Lagos': 'Algarve',

  // ═══════════════════════════════════════════════════════════════════
  // MADEIRA
  // ═══════════════════════════════════════════════════════════════════
  'Madeira / Vinho da Madeira / Madère / Vin de Madère / Madera / Madeira Wein / Madeira Wine / Vino di Madera / Madeira Wijn': 'Madeira',
  'Madeirense': 'Madeira',

  // ═══════════════════════════════════════════════════════════════════
  // AZORES
  // ═══════════════════════════════════════════════════════════════════
  'Biscoitos': 'Azores',
  'Pico': 'Azores',
  'Graciosa': 'Azores',
};
