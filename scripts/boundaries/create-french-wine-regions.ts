import * as fs from 'fs';
import * as path from 'path';

// French wine region boundaries (simplified approximations)
// These are approximate boundaries based on the general wine-growing areas

const FRENCH_MAJOR_REGIONS = {
  bordeaux: {
    name: 'Bordeaux',
    established: '1936',
    color: '#722F37',
    zoom: 9,
    description: 'The largest fine wine region in the world, famous for its red blends of Cabernet Sauvignon, Merlot, and Cabernet Franc.',
    coordinates: [[
      [-1.25, 45.35], [-0.85, 45.35], [-0.35, 45.25], [-0.15, 45.05],
      [-0.05, 44.85], [-0.05, 44.55], [-0.15, 44.35], [-0.35, 44.25],
      [-0.65, 44.25], [-0.95, 44.35], [-1.15, 44.55], [-1.25, 44.85],
      [-1.35, 45.15], [-1.25, 45.35]
    ]],
  },
  burgundy: {
    name: 'Burgundy',
    established: '1936',
    color: '#8B0000',
    zoom: 8,
    description: 'The spiritual home of Pinot Noir and Chardonnay, renowned for its complex terroir-driven wines.',
    coordinates: [[
      [4.55, 47.45], [4.95, 47.45], [5.15, 47.25], [5.25, 46.95],
      [5.15, 46.65], [4.95, 46.35], [4.75, 46.15], [4.55, 46.05],
      [4.35, 46.15], [4.25, 46.45], [4.25, 46.85], [4.35, 47.15],
      [4.45, 47.35], [4.55, 47.45]
    ]],
  },
  champagne: {
    name: 'Champagne',
    established: '1936',
    color: '#F5E6CC',
    zoom: 9,
    description: 'The only region in the world that can legally produce Champagne, the most celebrated sparkling wine.',
    coordinates: [[
      [3.45, 49.45], [4.05, 49.45], [4.35, 49.25], [4.45, 48.95],
      [4.35, 48.65], [4.05, 48.45], [3.65, 48.35], [3.35, 48.45],
      [3.15, 48.75], [3.15, 49.05], [3.25, 49.35], [3.45, 49.45]
    ]],
  },
  rhone: {
    name: 'Rhône Valley',
    established: '1936',
    color: '#5D3A3A',
    zoom: 8,
    description: 'Divided into Northern and Southern regions, known for Syrah, Grenache, and Mourvèdre.',
    coordinates: [[
      [4.55, 45.55], [4.95, 45.55], [5.05, 45.25], [5.05, 44.85],
      [4.95, 44.45], [4.85, 44.15], [4.65, 43.95], [4.35, 43.95],
      [4.15, 44.15], [4.05, 44.55], [4.15, 44.95], [4.35, 45.35],
      [4.55, 45.55]
    ]],
  },
  loire: {
    name: 'Loire Valley',
    established: '1936',
    color: '#7BA05B',
    zoom: 7,
    description: 'A vast region along the Loire River, producing diverse wines from Sauvignon Blanc, Chenin Blanc, and Cabernet Franc.',
    coordinates: [[
      [-2.25, 47.55], [-1.45, 47.75], [-0.65, 47.65], [0.25, 47.55],
      [1.15, 47.45], [2.05, 47.35], [2.85, 47.15], [2.85, 46.95],
      [2.45, 46.85], [1.65, 46.85], [0.75, 46.95], [-0.15, 47.05],
      [-1.05, 47.15], [-1.85, 47.25], [-2.25, 47.55]
    ]],
  },
  alsace: {
    name: 'Alsace',
    established: '1962',
    color: '#FFD700',
    zoom: 9,
    description: 'A narrow strip along the Rhine, famous for aromatic white wines like Riesling and Gewürztraminer.',
    coordinates: [[
      [7.15, 49.05], [7.55, 49.05], [7.75, 48.75], [7.75, 48.35],
      [7.65, 48.05], [7.45, 47.75], [7.25, 47.55], [7.05, 47.55],
      [6.95, 47.85], [6.95, 48.25], [7.05, 48.65], [7.15, 49.05]
    ]],
  },
  provence: {
    name: 'Provence',
    established: '1977',
    color: '#FFB6C1',
    zoom: 8,
    description: 'The leading producer of rosé wine in France, with a Mediterranean climate.',
    coordinates: [[
      [5.45, 43.95], [6.15, 43.95], [6.75, 43.75], [7.05, 43.55],
      [7.05, 43.35], [6.65, 43.15], [6.05, 43.15], [5.45, 43.25],
      [5.05, 43.45], [5.05, 43.75], [5.25, 43.95], [5.45, 43.95]
    ]],
  },
  languedoc: {
    name: 'Languedoc-Roussillon',
    established: '1985',
    color: '#C19A6B',
    zoom: 8,
    description: 'The largest wine-producing region in France, offering excellent value wines.',
    coordinates: [[
      [2.05, 43.85], [2.95, 43.85], [3.65, 43.65], [4.25, 43.45],
      [4.25, 43.15], [3.85, 42.85], [3.25, 42.65], [2.65, 42.55],
      [2.05, 42.65], [1.65, 42.95], [1.65, 43.35], [1.85, 43.65],
      [2.05, 43.85]
    ]],
  },
};

// Sub-appellations for major regions
const BORDEAUX_SUBS = {
  medoc: {
    name: 'Médoc',
    established: '1936',
    color: '#8B0000',
    description: 'Home to many of Bordeaux\'s most famous estates, known for Cabernet Sauvignon-dominant blends.',
    coordinates: [[
      [-1.15, 45.45], [-0.85, 45.45], [-0.75, 45.25], [-0.75, 45.05],
      [-0.85, 44.95], [-1.05, 44.95], [-1.15, 45.15], [-1.15, 45.45]
    ]],
  },
  'saint-emilion': {
    name: 'Saint-Émilion',
    established: '1936',
    color: '#A52A2A',
    description: 'UNESCO World Heritage site, famous for Merlot-based wines.',
    coordinates: [[
      [-0.25, 44.95], [-0.05, 44.95], [0.05, 44.85], [0.05, 44.75],
      [-0.05, 44.65], [-0.25, 44.65], [-0.35, 44.75], [-0.35, 44.85],
      [-0.25, 44.95]
    ]],
  },
  pomerol: {
    name: 'Pomerol',
    established: '1936',
    color: '#B22222',
    description: 'Small but prestigious appellation, home to Château Pétrus.',
    coordinates: [[
      [-0.25, 44.95], [-0.15, 44.95], [-0.05, 44.88], [-0.05, 44.82],
      [-0.15, 44.78], [-0.25, 44.78], [-0.32, 44.85], [-0.25, 44.95]
    ]],
  },
  graves: {
    name: 'Graves',
    established: '1937',
    color: '#6B4423',
    description: 'Known for both red wines and dry whites, including Pessac-Léognan.',
    coordinates: [[
      [-0.75, 44.85], [-0.45, 44.85], [-0.35, 44.65], [-0.35, 44.45],
      [-0.55, 44.35], [-0.75, 44.35], [-0.85, 44.55], [-0.85, 44.75],
      [-0.75, 44.85]
    ]],
  },
  sauternes: {
    name: 'Sauternes',
    established: '1936',
    color: '#DAA520',
    description: 'World-famous for luscious sweet wines made from botrytized grapes.',
    coordinates: [[
      [-0.45, 44.55], [-0.25, 44.55], [-0.15, 44.45], [-0.15, 44.35],
      [-0.25, 44.28], [-0.45, 44.28], [-0.55, 44.38], [-0.55, 44.48],
      [-0.45, 44.55]
    ]],
  },
  'margaux': {
    name: 'Margaux',
    established: '1954',
    color: '#9B2335',
    description: 'Produces elegant, perfumed wines, home to Château Margaux.',
    coordinates: [[
      [-0.75, 45.05], [-0.65, 45.05], [-0.58, 44.98], [-0.58, 44.92],
      [-0.65, 44.88], [-0.75, 44.88], [-0.82, 44.95], [-0.75, 45.05]
    ]],
  },
};

const BURGUNDY_SUBS = {
  'cote-de-nuits': {
    name: 'Côte de Nuits',
    established: '1936',
    color: '#800020',
    description: 'Northern part of Côte d\'Or, home to legendary Pinot Noir vineyards.',
    coordinates: [[
      [4.85, 47.25], [5.05, 47.25], [5.12, 47.12], [5.12, 47.02],
      [5.05, 46.95], [4.85, 46.95], [4.78, 47.08], [4.85, 47.25]
    ]],
  },
  'cote-de-beaune': {
    name: 'Côte de Beaune',
    established: '1936',
    color: '#F5DEB3',
    description: 'Southern Côte d\'Or, famous for white Burgundy and some reds.',
    coordinates: [[
      [4.72, 47.05], [4.92, 47.05], [5.02, 46.92], [5.02, 46.78],
      [4.92, 46.72], [4.72, 46.72], [4.62, 46.85], [4.72, 47.05]
    ]],
  },
  chablis: {
    name: 'Chablis',
    established: '1938',
    color: '#FFFACD',
    description: 'Isolated northern outpost, producing steely, mineral Chardonnay.',
    coordinates: [[
      [3.72, 47.92], [3.92, 47.92], [4.02, 47.78], [4.02, 47.68],
      [3.92, 47.62], [3.72, 47.62], [3.62, 47.75], [3.72, 47.92]
    ]],
  },
  'cote-chalonnaise': {
    name: 'Côte Chalonnaise',
    established: '1990',
    color: '#CD853F',
    description: 'South of Côte de Beaune, offering excellent value Burgundy.',
    coordinates: [[
      [4.62, 46.85], [4.82, 46.85], [4.92, 46.68], [4.92, 46.52],
      [4.82, 46.45], [4.62, 46.45], [4.52, 46.62], [4.62, 46.85]
    ]],
  },
  maconnais: {
    name: 'Mâconnais',
    established: '1936',
    color: '#9ACD32',
    description: 'Southernmost Burgundy region, known for Pouilly-Fuissé.',
    coordinates: [[
      [4.62, 46.55], [4.82, 46.55], [4.92, 46.35], [4.92, 46.15],
      [4.82, 46.05], [4.62, 46.05], [4.52, 46.25], [4.62, 46.55]
    ]],
  },
  beaujolais: {
    name: 'Beaujolais',
    established: '1936',
    color: '#DC143C',
    description: 'Home of Gamay, from simple Nouveau to age-worthy Crus.',
    coordinates: [[
      [4.52, 46.25], [4.82, 46.25], [4.92, 46.02], [4.92, 45.82],
      [4.82, 45.75], [4.52, 45.75], [4.42, 45.95], [4.52, 46.25]
    ]],
  },
};

const RHONE_SUBS = {
  'cote-rotie': {
    name: 'Côte-Rôtie',
    established: '1940',
    color: '#4A0E0E',
    description: 'The "roasted slope" produces powerful, elegant Syrah.',
    coordinates: [[
      [4.78, 45.52], [4.88, 45.52], [4.92, 45.45], [4.92, 45.38],
      [4.88, 45.35], [4.78, 45.35], [4.72, 45.42], [4.78, 45.52]
    ]],
  },
  hermitage: {
    name: 'Hermitage',
    established: '1936',
    color: '#3D0C0C',
    description: 'Iconic Northern Rhône appellation for both red and white.',
    coordinates: [[
      [4.82, 45.12], [4.92, 45.12], [4.98, 45.05], [4.98, 44.98],
      [4.92, 44.92], [4.82, 44.92], [4.75, 45.02], [4.82, 45.12]
    ]],
  },
  'chateauneuf-du-pape': {
    name: 'Châteauneuf-du-Pape',
    established: '1936',
    color: '#722F37',
    description: 'The "Pope\'s New Castle" - flagship of Southern Rhône.',
    coordinates: [[
      [4.78, 44.12], [4.92, 44.12], [5.02, 43.98], [5.02, 43.88],
      [4.92, 43.82], [4.78, 43.82], [4.68, 43.95], [4.78, 44.12]
    ]],
  },
  gigondas: {
    name: 'Gigondas',
    established: '1971',
    color: '#6B2D2D',
    description: 'Powerful reds from the foot of the Dentelles de Montmirail.',
    coordinates: [[
      [4.98, 44.22], [5.08, 44.22], [5.15, 44.12], [5.15, 44.02],
      [5.08, 43.95], [4.98, 43.95], [4.92, 44.08], [4.98, 44.22]
    ]],
  },
  'crozes-hermitage': {
    name: 'Crozes-Hermitage',
    established: '1937',
    color: '#5C3317',
    description: 'Largest Northern Rhône appellation surrounding Hermitage.',
    coordinates: [[
      [4.75, 45.18], [4.98, 45.18], [5.08, 44.98], [5.08, 44.85],
      [4.98, 44.78], [4.75, 44.78], [4.65, 44.95], [4.75, 45.18]
    ]],
  },
};

async function createFrenchWineRegions() {
  console.log('🍷 Creating French wine region data...\n');

  const dataDir = path.join(__dirname, '../data');

  // Create directories
  const majorDir = path.join(dataDir, 'france-major-regions');
  const bordeauxDir = path.join(dataDir, 'bordeaux-appellations');
  const burgundyDir = path.join(dataDir, 'burgundy-appellations');
  const rhoneDir = path.join(dataDir, 'rhone-appellations');

  for (const dir of [majorDir, bordeauxDir, burgundyDir, rhoneDir]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  // Create major regions
  console.log('📍 MAJOR REGIONS');
  for (const [slug, data] of Object.entries(FRENCH_MAJOR_REGIONS)) {
    const output = {
      name: data.name,
      established: data.established,
      description: data.description,
      color: data.color,
      zoom: data.zoom,
      geometry: {
        type: 'Polygon',
        coordinates: data.coordinates,
      },
    };
    fs.writeFileSync(path.join(majorDir, `${slug}.json`), JSON.stringify(output, null, 2));
    console.log(`  ✓ ${data.name}`);
  }

  // Create Bordeaux sub-appellations
  console.log('\n📍 BORDEAUX APPELLATIONS');
  for (const [slug, data] of Object.entries(BORDEAUX_SUBS)) {
    const output = {
      name: data.name,
      established: data.established,
      description: data.description,
      color: data.color,
      geometry: {
        type: 'Polygon',
        coordinates: data.coordinates,
      },
    };
    fs.writeFileSync(path.join(bordeauxDir, `${slug}.json`), JSON.stringify(output, null, 2));
    console.log(`  ✓ ${data.name}`);
  }

  // Create Burgundy sub-appellations
  console.log('\n📍 BURGUNDY APPELLATIONS');
  for (const [slug, data] of Object.entries(BURGUNDY_SUBS)) {
    const output = {
      name: data.name,
      established: data.established,
      description: data.description,
      color: data.color,
      geometry: {
        type: 'Polygon',
        coordinates: data.coordinates,
      },
    };
    fs.writeFileSync(path.join(burgundyDir, `${slug}.json`), JSON.stringify(output, null, 2));
    console.log(`  ✓ ${data.name}`);
  }

  // Create Rhône sub-appellations
  console.log('\n📍 RHÔNE APPELLATIONS');
  for (const [slug, data] of Object.entries(RHONE_SUBS)) {
    const output = {
      name: data.name,
      established: data.established,
      description: data.description,
      color: data.color,
      geometry: {
        type: 'Polygon',
        coordinates: data.coordinates,
      },
    };
    fs.writeFileSync(path.join(rhoneDir, `${slug}.json`), JSON.stringify(output, null, 2));
    console.log(`  ✓ ${data.name}`);
  }

  console.log('\n✅ French wine region data created!');
}

createFrenchWineRegions().catch(console.error);
