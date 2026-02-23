// WEG Region Matcher - Maps wine regions to WEG URL structure

export interface WEGRegion {
  name: string;
  slug: string;
  country: string;
  parent?: string; // Parent region (e.g., "sicily" for "etna")
  url: string;
}

// Complete WEG region mapping
export const WEG_REGIONS: Record<string, WEGRegion> = {
  // ITALY
  'etna': {
    name: 'Etna',
    slug: 'etna',
    country: 'italy',
    parent: 'sicily',
    url: '/regions/italy/sicily/etna'
  },
  'barolo': {
    name: 'Barolo',
    slug: 'barolo',
    country: 'italy',
    parent: 'piedmont',
    url: '/regions/italy/piedmont/barolo'
  },
  'barbaresco': {
    name: 'Barbaresco',
    slug: 'barbaresco',
    country: 'italy',
    parent: 'piedmont',
    url: '/regions/italy/piedmont/barbaresco'
  },
  'langhe': {
    name: 'Langhe',
    slug: 'langhe',
    country: 'italy',
    parent: 'piedmont',
    url: '/regions/italy/piedmont/langhe'
  },
  'roero': {
    name: 'Roero',
    slug: 'roero',
    country: 'italy',
    parent: 'piedmont',
    url: '/regions/italy/piedmont/roero'
  },
  'valtellina': {
    name: 'Valtellina',
    slug: 'valtellina',
    country: 'italy',
    parent: 'lombardy',
    url: '/regions/italy/lombardy/valtellina'
  },

  // GERMANY
  'mosel': {
    name: 'Mosel',
    slug: 'mosel',
    country: 'germany',
    url: '/regions/germany/mosel'
  },
  'rheingau': {
    name: 'Rheingau',
    slug: 'rheingau',
    country: 'germany',
    url: '/regions/germany/rheingau'
  },
  'rheinhessen': {
    name: 'Rheinhessen',
    slug: 'rheinhessen',
    country: 'germany',
    url: '/regions/germany/rheinhessen'
  },
  'pfalz': {
    name: 'Pfalz',
    slug: 'pfalz',
    country: 'germany',
    url: '/regions/germany/pfalz'
  },
  'nahe': {
    name: 'Nahe',
    slug: 'nahe',
    country: 'germany',
    url: '/regions/germany/nahe'
  },

  // AUSTRIA
  'wachau': {
    name: 'Wachau',
    slug: 'wachau',
    country: 'austria',
    url: '/regions/austria/wachau'
  },
  'kamptal': {
    name: 'Kamptal',
    slug: 'kamptal',
    country: 'austria',
    url: '/regions/austria/kamptal'
  },
  'kremstal': {
    name: 'Kremstal',
    slug: 'kremstal',
    country: 'austria',
    url: '/regions/austria/kremstal'
  },

  // FRANCE
  'burgundy': {
    name: 'Burgundy',
    slug: 'burgundy',
    country: 'france',
    url: '/regions/france/burgundy'
  },
  'chablis': {
    name: 'Chablis',
    slug: 'chablis',
    country: 'france',
    parent: 'burgundy',
    url: '/regions/france/burgundy/chablis'
  },
  'cote-de-nuits': {
    name: 'Côte de Nuits',
    slug: 'cote-de-nuits',
    country: 'france',
    parent: 'burgundy',
    url: '/regions/france/burgundy/cote-de-nuits'
  },
  'cote-de-beaune': {
    name: 'Côte de Beaune',
    slug: 'cote-de-beaune',
    country: 'france',
    parent: 'burgundy',
    url: '/regions/france/burgundy/cote-de-beaune'
  },
  'champagne': {
    name: 'Champagne',
    slug: 'champagne',
    country: 'france',
    url: '/regions/france/champagne'
  },
  'alsace': {
    name: 'Alsace',
    slug: 'alsace',
    country: 'france',
    url: '/regions/france/alsace'
  },

  // USA
  'napa-valley': {
    name: 'Napa Valley',
    slug: 'napa-valley',
    country: 'usa',
    parent: 'california',
    url: '/regions/usa/california/napa-valley'
  },
  'sonoma-county': {
    name: 'Sonoma County',
    slug: 'sonoma-county',
    country: 'usa',
    parent: 'california',
    url: '/regions/usa/california/sonoma-county'
  },
  'santa-barbara': {
    name: 'Santa Barbara',
    slug: 'santa-barbara',
    country: 'usa',
    parent: 'california',
    url: '/regions/usa/california/santa-barbara'
  },
};

// Common region name variations
const REGION_ALIASES: Record<string, string> = {
  'mt. etna': 'etna',
  'mount etna': 'etna',
  'etna doc': 'etna',
  'etna rosso': 'etna',
  'etna bianco': 'etna',
  'barolo docg': 'barolo',
  'barbaresco docg': 'barbaresco',
  'mosel-saar-ruwer': 'mosel',
  'moselle': 'mosel',
  'wachau valley': 'wachau',
  'napa': 'napa-valley',
  'sonoma': 'sonoma-county',
};

/**
 * Match a region name to WEG structure
 */
export function matchRegion(regionName: string): WEGRegion | null {
  if (!regionName) return null;

  const normalized = regionName.toLowerCase().trim();

  // Try direct match
  if (WEG_REGIONS[normalized]) {
    return WEG_REGIONS[normalized];
  }

  // Try aliases
  if (REGION_ALIASES[normalized]) {
    return WEG_REGIONS[REGION_ALIASES[normalized]];
  }

  // Try fuzzy match (contains)
  for (const [key, region] of Object.entries(WEG_REGIONS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return region;
    }
  }

  return null;
}

/**
 * Get all regions for a country
 */
export function getRegionsByCountry(country: string): WEGRegion[] {
  return Object.values(WEG_REGIONS).filter(r => r.country === country.toLowerCase());
}

// Test
if (require.main === module) {
  console.log('TESTING REGION MATCHER:\n');

  const tests = [
    'Etna',
    'Mt. Etna',
    'Etna DOC',
    'Barolo',
    'Mosel',
    'Wachau',
    'Napa Valley',
    'Burgundy'
  ];

  tests.forEach(test => {
    const match = matchRegion(test);
    console.log(`"${test}" →`, match ? match.url : 'NO MATCH');
  });
}
