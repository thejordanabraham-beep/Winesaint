// Theme Colors - BORDEAUX ELEGANCE PALETTE
export const COLORS = {
  primary: '#722F37',      // Bordeaux wine (was #e63946)
  primaryDark: '#A64253',  // Berry/lighter wine hover (was #d62839)
  secondary: '#B8926A',    // Oxidized barrel copper (was #f4d35e)
  background: '#FAF7F2',   // Warm linen (was #fffbf5)
  text: '#1C1C1C',         // Deep ink (was #1a1a1a)
  accent: '#8B9D83',       // Vineyard sage (was #123524)
  accentDark: '#6B7F5C',   // Dark sage hover (was #0d2518)
} as const;

/* OLD COLORS (to revert):
export const COLORS = {
  primary: '#e63946',
  primaryDark: '#d62839',
  secondary: '#f4d35e',
  background: '#fffbf5',
  text: '#1a1a1a',
  accent: '#123524',
  accentDark: '#0d2518',
} as const;
*/

// Per-slug colors for known wine regions — used on macro (country/continent) views
// to give each region a distinct, traditional wine map color
export const WINE_REGION_COLORS: Record<string, string> = {
  // France
  'loire-valley': '#C8956A',
  'champagne': '#E07B39',
  'alsace': '#A8CC5A',
  'burgundy': '#C0392B',
  'beaujolais': '#8E44AD',
  'rhone-valley': '#E891A0',
  'northern-rhone': '#D4698A',
  'southern-rhone': '#E8A0B4',
  'provence': '#2E9B9B',
  'languedoc': '#5B9BD5',
  'roussillon': '#85C1D6',
  'bordeaux': '#4B8A40',
  'jura': '#20A89A',
  'savoie': '#8B6914',
  'southwest': '#6B9640',
  // USA
  'napa-valley': '#722F37',
  'sonoma-county': '#C0392B',
  'willamette-valley': '#8E44AD',
  'columbia-valley': '#2E9B9B',
  'paso-robles': '#E07B39',
  // Germany
  'mosel': '#5B9BD5',
  'rheingau': '#4B8A40',
  'rheinpfalz': '#E891A0',
  'rheinhessen': '#E07B39',
  'pfalz': '#D4698A',
  'franken': '#C8956A',
  'nahe': '#A8CC5A',
  'wurttemberg': '#6B9640',
  'ahr': '#722F37',
  'mittelrhein': '#8E44AD',
  'saale-unstrut': '#2E9B9B',
  'sachsen-wine': '#20A89A',
  'hessische-bergstrasse': '#E8A040',
  'baden': '#4B8A40',
  // Italy
  'tuscany': '#C0392B',
  'piedmont': '#8E44AD',
  'veneto': '#E07B39',
  'sicily': '#E8A040',
  'umbria': '#C8956A',
  'marche': '#A8CC5A',
  'friuli-venezia-giulia': '#5B9BD5',
  'campania': '#E07B39',
  'puglia': '#D4698A',
  'sardinia': '#2E9B9B',
  'trentino-alto-adige': '#20A89A',
  'emilia-romagna': '#6B9640',
  'abruzzo': '#E891A0',
  'lazio': '#C0392B',
  // Spain
  'la-rioja': '#C0392B',
  'catalonia': '#E07B39',
  'castilla-y-leon': '#8E44AD',
  'galicia-spain': '#5B9BD5',
  'andalusia': '#E8A040',
  'aragon': '#4B8A40',
  'valencia-spain': '#E891A0',
  'navarre': '#A8CC5A',
  'basque-country': '#6B9640',
  'castilla-la-mancha': '#C8956A',
  'extremadura': '#D4698A',
  // Portugal
  'douro': '#C0392B',
  'alentejo': '#E8A040',
  'vinho-verde': '#4B8A40',
  'dao': '#5B9BD5',
  'bairrada': '#2E9B9B',
  'setubal': '#C8956A',
  'tejo': '#8E44AD',
  'lisboa-wine': '#E07B39',
  'algarve': '#E891A0',
  // Argentina
  'mendoza': '#C0392B',
  'salta': '#E8A040',
  'san-juan': '#8E44AD',
  'la-rioja-argentina': '#5B9BD5',
  'neuquen': '#4B8A40',
  'rio-negro': '#2E9B9B',
  'catamarca': '#A8CC5A',
  'tucuman': '#D4698A',
  // Chile
  'aconcagua-valley': '#C0392B',
  'casablanca-valley': '#5B9BD5',
  'maipo-valley': '#8E44AD',
  'rapel-valley': '#E07B39',
  'colchagua-valley': '#C8956A',
  'curico-valley': '#4B8A40',
  'maule-valley': '#2E9B9B',
  'bio-bio-valley': '#A8CC5A',
  'elqui-valley': '#E891A0',
  'limari-valley': '#E8A040',
  // Australia
  'south-australia': '#C0392B',
  'victoria-wine': '#8E44AD',
  'new-south-wales': '#E07B39',
  'western-australia': '#2E9B9B',
  'barossa-valley': '#C0392B',
  'mclaren-vale': '#D4698A',
  'clare-valley': '#4B8A40',
  'eden-valley': '#A8CC5A',
  'margaret-river': '#5B9BD5',
  'great-southern': '#20A89A',
  'yarra-valley': '#8E44AD',
  'mornington-peninsula': '#6B9640',
  'hunter-valley': '#E8A040',
  'mudgee': '#C8956A',
  // New Zealand
  'marlborough': '#4B8A40',
  'central-otago': '#C0392B',
  'hawkes-bay': '#E07B39',
  'martinborough': '#8E44AD',
  'waipara-valley': '#5B9BD5',
  'nelson-wine': '#2E9B9B',
  'gisborne': '#A8CC5A',
  'northland-wine': '#E891A0',
  'auckland-wine': '#C8956A',
  'waikato-wine': '#D4698A',
} as const;

// Map Colors - Color palette for regions/vineyards on maps (Updated for Bordeaux theme)
export const MAP_COLORS = [
  '#722F37', '#457b9d', '#8B9D83', '#B8926A', '#f4a261',
  '#6d597a', '#b5838d', '#588157', '#A64253', '#219ebc',
  '#8338ec', '#ff006e', '#3a86ff', '#fb5607', '#06d6a0',
] as const;

/* OLD MAP_COLORS (to revert):
export const MAP_COLORS = [
  '#e63946', '#457b9d', '#2a9d8f', '#e9c46a', '#f4a261',
  '#6d597a', '#b5838d', '#588157', '#bc6c25', '#219ebc',
  '#8338ec', '#ff006e', '#3a86ff', '#fb5607', '#06d6a0',
] as const;
*/

// Map Zoom Levels by hierarchy level
export const MAP_ZOOM_LEVELS = {
  continent: 4,
  country: 4,
  state: 6,
  sub_region: 8,
  major_ava: 10,
  sub_ava: 12,
} as const;

// Navigation Map Links
export interface MapLink {
  href: string;
  label: string;
  indent?: boolean;
}

export interface MapSection {
  title: string;
  links: MapLink[];
}

export const MAP_SECTIONS: MapSection[] = [
  {
    title: 'Europe',
    links: [
      { href: '/maps/europe/france', label: 'France' },
      { href: '/maps/europe/france/bordeaux', label: 'Bordeaux', indent: true },
      { href: '/maps/europe/france/burgundy', label: 'Burgundy', indent: true },
      { href: '/maps/europe/france/champagne', label: 'Champagne', indent: true },
      { href: '/maps/italy', label: 'Italy' },
      { href: '/maps/spain', label: 'Spain' },
      { href: '/maps/germany', label: 'Germany' },
      { href: '/maps/portugal', label: 'Portugal' },
    ],
  },
  {
    title: 'United States',
    links: [
      { href: '/maps/united-states/california', label: 'California' },
      { href: '/maps/united-states/oregon', label: 'Oregon' },
      { href: '/maps/united-states/washington', label: 'Washington' },
    ],
  },
  {
    title: 'South America',
    links: [
      { href: '/maps/argentina', label: 'Argentina' },
      { href: '/maps/chile', label: 'Chile' },
    ],
  },
  {
    title: 'Oceania',
    links: [
      { href: '/maps/australia', label: 'Australia' },
      { href: '/maps/new-zealand', label: 'New Zealand' },
    ],
  },
];

// Wine Countries for filters
export const WINE_COUNTRIES = [
  'Argentina', 'Australia', 'Austria', 'Canada', 'Chile', 'China',
  'Croatia', 'England', 'France', 'Germany', 'Italy', 'New Zealand',
  'Portugal', 'Spain', 'USA'
] as const;

// Score scale options
export const SCORE_OPTIONS = [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0] as const;

// Price filter options
export const PRICE_OPTIONS = [0, 25, 50, 75, 100, 150, 200, 300, 500, 1000, 2000] as const;

// White grape varieties (for determining wine color)
export const WHITE_GRAPES = [
  'Chardonnay', 'Sauvignon Blanc', 'Riesling', 'Pinot Grigio', 'Gewürztraminer',
  'Viognier', 'Chenin Blanc', 'Semillon', 'Albariño', 'Grüner Veltliner'
] as const;
