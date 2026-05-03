/**
 * Spain Wine Region Hierarchy
 *
 * Maps all 99 Spanish PDOs into a multi-level hierarchy:
 *   Region (autonomous community) → Appellation
 *
 * Spain uses DO (Denominación de Origen) and DOCa/DOQ (Calificada/Qualificada)
 * as its classification system. Vinos de Pago are single-estate DOs.
 *
 * Every PDO name in the GeoJSON must appear exactly once in SPAIN_APPELLATIONS.
 */

// Sub-regions grouped under their parent region
// Spain's regions are based on autonomous communities.
// Most regions have no subregions (appellations map directly).
export const SPAIN_SUBREGIONS = {
  'Castilla-La Mancha': [
    'Central La Mancha',
    'Pagos de Castilla-La Mancha',
  ],
  'Castilla y León': [
    'Duero Valley',
    'Western Castilla y León',
    'Pagos de Castilla y León',
  ],
  'Catalonia': [],
  'Andalusia': [],
  'Aragon': [],
  'Galicia': [],
  'Navarra': [],
  'Valencia': [],
  'Murcia': [],
  'Basque Country': [],
  'Canary Islands': [],
  'Balearic Islands': [],
  'Rioja': [],
  'Madrid': [],
  'Extremadura': [],
  'Asturias': [],
};

// Top-level regions
export const SPAIN_REGIONS = Object.keys(SPAIN_SUBREGIONS);

/**
 * Every Spanish PDO mapped to its immediate parent.
 * Parent is either a sub-region name or a region name (if no sub-regions).
 */
export const SPAIN_APPELLATIONS = {
  // ═══════════════════════════════════════════════════════════════════
  // CASTILLA-LA MANCHA — Central La Mancha
  // ═══════════════════════════════════════════════════════════════════
  'La Mancha': 'Central La Mancha',
  'Valdepeñas': 'Central La Mancha',
  'Manchuela': 'Central La Mancha',
  'Almansa': 'Central La Mancha',
  'Méntrida': 'Central La Mancha',
  'Mondéjar': 'Central La Mancha',
  'Ribera del Júcar': 'Central La Mancha',
  'Uclés': 'Central La Mancha',

  // CASTILLA-LA MANCHA — Pagos (single-estate DOs)
  'Dominio de Valdepusa': 'Pagos de Castilla-La Mancha',
  'Finca Élez': 'Pagos de Castilla-La Mancha',
  'Dehesa del Carrizal': 'Pagos de Castilla-La Mancha',
  'Campo de La Guardia': 'Pagos de Castilla-La Mancha',
  'Calzadilla': 'Pagos de Castilla-La Mancha',
  'Pago Florentino': 'Pagos de Castilla-La Mancha',
  'Guijoso': 'Pagos de Castilla-La Mancha',
  'Casa del Blanco': 'Pagos de Castilla-La Mancha',
  'La Jaraba': 'Pagos de Castilla-La Mancha',
  'Vallegarcía': 'Pagos de Castilla-La Mancha',
  'El Vicario': 'Pagos de Castilla-La Mancha',

  // ═══════════════════════════════════════════════════════════════════
  // CASTILLA Y LEÓN — Duero Valley
  // ═══════════════════════════════════════════════════════════════════
  'Ribera del Duero': 'Duero Valley',
  'Rueda': 'Duero Valley',
  'Toro': 'Duero Valley',
  'Cigales': 'Duero Valley',
  'Arlanza': 'Duero Valley',

  // CASTILLA Y LEÓN — Western
  'Bierzo': 'Western Castilla y León',
  'Arribes': 'Western Castilla y León',
  'Sierra de Salamanca': 'Western Castilla y León',
  'Tierra del Vino de Zamora': 'Western Castilla y León',
  'León': 'Western Castilla y León',
  'Valles de Benavente': 'Western Castilla y León',

  // CASTILLA Y LEÓN — Pagos
  'Cebreros': 'Pagos de Castilla y León',
  'Urueña': 'Pagos de Castilla y León',
  'Dehesa Peñalba': 'Pagos de Castilla y León',
  'Los Cerrillos': 'Pagos de Castilla y León',
  'Valtiendas': 'Pagos de Castilla y León',

  // ═══════════════════════════════════════════════════════════════════
  // CATALONIA (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Priorat / Priorato': 'Catalonia',
  'Penedès': 'Catalonia',
  'Montsant': 'Catalonia',
  'Empordà': 'Catalonia',
  'Costers del Segre': 'Catalonia',
  'Conca de Barberà': 'Catalonia',
  'Terra Alta': 'Catalonia',
  'Pla de Bages': 'Catalonia',
  'Alella': 'Catalonia',
  'Tarragona': 'Catalonia',
  'Cataluña / Catalunya': 'Catalonia',
  'Cava': 'Catalonia',

  // ═══════════════════════════════════════════════════════════════════
  // ANDALUSIA (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Jerez-Xérès-Sherry / Jerez / Xérès / Sherry': 'Andalusia',
  'Manzanilla-Sanlúcar de Barrameda / Manzanilla': 'Andalusia',
  'Montilla-Moriles': 'Andalusia',
  'Málaga': 'Andalusia',
  'Sierras de Málaga': 'Andalusia',
  'Condado de Huelva': 'Andalusia',
  'Granada': 'Andalusia',
  'Lebrija': 'Andalusia',

  // ═══════════════════════════════════════════════════════════════════
  // ARAGON (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Cariñena': 'Aragon',
  'Campo de Borja': 'Aragon',
  'Calatayud': 'Aragon',
  'Somontano': 'Aragon',
  'Aylés': 'Aragon',

  // ═══════════════════════════════════════════════════════════════════
  // GALICIA (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Rías Baixas': 'Galicia',
  'Ribeiro': 'Galicia',
  'Ribeira Sacra': 'Galicia',
  'Valdeorras': 'Galicia',
  'Monterrei': 'Galicia',

  // ═══════════════════════════════════════════════════════════════════
  // NAVARRA (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Navarra': 'Navarra',
  'Prado de Irache': 'Navarra',
  'Pago de Arínzano': 'Navarra',
  'Pago de Otazu': 'Navarra',

  // ═══════════════════════════════════════════════════════════════════
  // VALENCIA (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Valencia': 'Valencia',
  'Utiel-Requena': 'Valencia',
  'Alicante': 'Valencia',
  'El Terrerazo': 'Valencia',
  'Los Balagueses': 'Valencia',
  'Vera de Estenas': 'Valencia',
  'Chozas Carrascal': 'Valencia',

  // ═══════════════════════════════════════════════════════════════════
  // MURCIA (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Jumilla': 'Murcia',
  'Bullas': 'Murcia',
  'Yecla': 'Murcia',

  // ═══════════════════════════════════════════════════════════════════
  // BASQUE COUNTRY (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Arabako Txakolina / Txakolí de Álava / Chacolí de Álava': 'Basque Country',
  'Getariako Txakolina / Chacolí de Getaria / Txakolí de Getaria': 'Basque Country',
  'Bizkaiko Txakolina / Chacolí de Bizkaia / Txakolí de Bizkaia': 'Basque Country',

  // ═══════════════════════════════════════════════════════════════════
  // CANARY ISLANDS (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Islas Canarias': 'Canary Islands',
  'La Gomera': 'Canary Islands',
  'Gran Canaria': 'Canary Islands',
  'Lanzarote': 'Canary Islands',
  'Ycoden-Daute-Isora': 'Canary Islands',
  'Tacoronte-Acentejo': 'Canary Islands',
  'La Palma': 'Canary Islands',
  'Abona': 'Canary Islands',
  'Valle de Güímar': 'Canary Islands',
  'Valle de la Orotava': 'Canary Islands',
  'El Hierro': 'Canary Islands',

  // ═══════════════════════════════════════════════════════════════════
  // BALEARIC ISLANDS (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Binissalem': 'Balearic Islands',
  'Pla i Llevant': 'Balearic Islands',

  // ═══════════════════════════════════════════════════════════════════
  // RIOJA (no subregions — it IS the region)
  // ═══════════════════════════════════════════════════════════════════
  'Rioja': 'Rioja',

  // ═══════════════════════════════════════════════════════════════════
  // MADRID (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Vinos de Madrid': 'Madrid',

  // ═══════════════════════════════════════════════════════════════════
  // EXTREMADURA (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Ribera del Guadiana': 'Extremadura',

  // ═══════════════════════════════════════════════════════════════════
  // ASTURIAS (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Cangas': 'Asturias',
};
