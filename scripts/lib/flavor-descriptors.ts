/**
 * Flavor Descriptors - Wine Aroma Wheel vocabulary
 *
 * Based on standard wine flavor wheels used in sommelier training.
 * Categories: Primary (grape), Secondary (winemaking), Tertiary (aging)
 */

// Primary Aromas - from the grape
export const PRIMARY_AROMAS = {
  redFruits: [
    'strawberry', 'raspberry', 'cherry', 'red currant', 'cranberry',
    'red plum', 'pomegranate', 'blood orange',
  ],
  blackFruits: [
    'blackberry', 'blackcurrant', 'cassis', 'black cherry', 'black plum',
    'bramble', 'boysenberry', 'mulberry', 'blueberry',
  ],
  tropicalFruits: [
    'pineapple', 'mango', 'passion fruit', 'lychee', 'guava', 'papaya',
  ],
  stoneFruits: [
    'peach', 'apricot', 'nectarine', 'white peach', 'yellow plum',
  ],
  citrus: [
    'lemon', 'lime', 'grapefruit', 'orange peel', 'tangerine', 'yuzu',
  ],
  pomeFruits: [
    'apple', 'pear', 'quince', 'green apple', 'baked apple',
  ],
  floral: [
    'violet', 'rose', 'lavender', 'elderflower', 'orange blossom',
    'jasmine', 'acacia', 'honeysuckle',
  ],
  herbaceous: [
    'green bell pepper', 'tomato leaf', 'grass', 'eucalyptus', 'mint',
    'sage', 'rosemary', 'thyme', 'oregano', 'bay leaf',
  ],
  vegetal: [
    'asparagus', 'green bean', 'artichoke', 'olive',
  ],
};

// Secondary Aromas - from winemaking
export const SECONDARY_AROMAS = {
  oak: [
    'vanilla', 'toast', 'cedar', 'smoke', 'coconut', 'dill', 'clove',
    'sandalwood', 'pencil shavings', 'cigar box',
  ],
  malolactic: [
    'butter', 'cream', 'yogurt', 'crème fraîche',
  ],
  lees: [
    'yeast', 'brioche', 'biscuit', 'bread dough', 'pastry',
  ],
  fermentation: [
    'banana', 'bubblegum', 'candy',
  ],
};

// Tertiary Aromas - from aging
export const TERTIARY_AROMAS = {
  oxidative: [
    'nuts', 'almond', 'hazelnut', 'walnut', 'marzipan',
  ],
  reductive: [
    'leather', 'tobacco', 'game', 'meat', 'iron', 'blood',
  ],
  driedFruits: [
    'fig', 'prune', 'raisin', 'date', 'dried cherry', 'dried apricot',
  ],
  evolved: [
    'forest floor', 'mushroom', 'truffle', 'wet leaves', 'compost',
    'petrol', 'kerosene', 'honey',
  ],
  savory: [
    'soy sauce', 'umami', 'anchovy', 'olive brine',
  ],
};

// Earth and Mineral descriptors
export const EARTH_MINERAL = {
  mineral: [
    'wet stones', 'chalk', 'slate', 'flint', 'gravel', 'limestone',
    'granite', 'volcanic', 'iron', 'graphite', 'pencil lead',
  ],
  earth: [
    'dust', 'clay', 'loam', 'potting soil', 'barnyard', 'leather',
  ],
};

// Spice descriptors
export const SPICES = {
  sweet: [
    'vanilla', 'cinnamon', 'nutmeg', 'allspice', 'clove', 'star anise',
  ],
  savory: [
    'black pepper', 'white pepper', 'pink peppercorn', 'licorice',
    'fennel', 'cardamom', 'cumin',
  ],
};

// Structure and texture vocabulary
export const STRUCTURE = {
  tannin: [
    'silky', 'velvety', 'plush', 'polished', 'fine-grained', 'powdery',
    'grippy', 'firm', 'chewy', 'astringent', 'drying',
  ],
  acidity: [
    'crisp', 'bright', 'racy', 'zesty', 'tart', 'searing', 'mouthwatering',
    'linear', 'focused', 'driving',
  ],
  body: [
    'light', 'medium', 'full', 'dense', 'concentrated', 'weighty',
    'substantial', 'muscular', 'broad', 'lean',
  ],
  texture: [
    'creamy', 'silky', 'satiny', 'oily', 'glycerin', 'round', 'supple',
    'angular', 'taut', 'sleek',
  ],
  finish: [
    'short', 'medium', 'long', 'persistent', 'lingering', 'endless',
    'clean', 'dry', 'tannic', 'mineral',
  ],
};

// Academic wine terms (concise, technical)
export const ACADEMIC_TERMS = {
  positive: [
    'balanced', 'integrated', 'harmonious', 'focused', 'precise',
    'pure', 'lifted', 'refined', 'elegant', 'complex',
  ],
  neutral: [
    'correct', 'typical', 'representative', 'varietal', 'regional',
  ],
  critical: [
    'simple', 'closed', 'muted', 'monolithic', 'extracted',
    'overripe', 'hot', 'disjointed',
  ],
};

/**
 * Get random descriptors from a category
 */
export function getRandomDescriptors(category: string[], count: number = 3): string[] {
  const shuffled = [...category].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get appropriate fruit descriptors for red wine by style
 */
export function getRedWineFruits(style: 'cool' | 'warm' | 'neutral' = 'neutral'): string[] {
  if (style === 'cool') {
    return getRandomDescriptors([
      ...PRIMARY_AROMAS.redFruits,
      'cranberry', 'sour cherry', 'raspberry',
    ], 2);
  }
  if (style === 'warm') {
    return getRandomDescriptors([
      ...PRIMARY_AROMAS.blackFruits,
      'fig', 'prune', 'baked plum',
    ], 2);
  }
  return getRandomDescriptors([
    ...PRIMARY_AROMAS.redFruits.slice(0, 4),
    ...PRIMARY_AROMAS.blackFruits.slice(0, 4),
  ], 2);
}

/**
 * Build a suggested flavor palette for a wine
 */
export function buildFlavorPalette(wineType: 'red' | 'white', ageYears: number): {
  primaryFruits: string[];
  secondary: string[];
  tertiary: string[];
  structure: string[];
} {
  if (wineType === 'red') {
    return {
      primaryFruits: getRandomDescriptors([
        ...PRIMARY_AROMAS.blackFruits,
        ...PRIMARY_AROMAS.redFruits,
      ], 3),
      secondary: getRandomDescriptors([
        ...SECONDARY_AROMAS.oak,
        ...PRIMARY_AROMAS.herbaceous.slice(0, 4),
      ], 2),
      tertiary: ageYears > 5
        ? getRandomDescriptors([...TERTIARY_AROMAS.reductive, ...TERTIARY_AROMAS.evolved], 2)
        : [],
      structure: getRandomDescriptors([
        ...STRUCTURE.tannin.slice(0, 5),
        ...STRUCTURE.body.slice(3, 7),
      ], 2),
    };
  }

  return {
    primaryFruits: getRandomDescriptors([
      ...PRIMARY_AROMAS.citrus,
      ...PRIMARY_AROMAS.stoneFruits,
      ...PRIMARY_AROMAS.pomeFruits,
    ], 3),
    secondary: getRandomDescriptors([
      ...SECONDARY_AROMAS.lees,
      ...SECONDARY_AROMAS.malolactic,
    ], 2),
    tertiary: ageYears > 3
      ? getRandomDescriptors([...TERTIARY_AROMAS.oxidative, 'honey', 'petrol'], 1)
      : [],
    structure: getRandomDescriptors([
      ...STRUCTURE.acidity.slice(0, 5),
      ...STRUCTURE.texture.slice(0, 5),
    ], 2),
  };
}
