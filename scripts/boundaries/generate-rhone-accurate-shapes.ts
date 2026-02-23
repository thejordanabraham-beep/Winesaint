/**
 * Generate accurate Rhône Valley AOC boundaries
 * Based on Quentin Sadler's Wine Map of the Rhône Valley
 *
 * Key geographic references:
 * - Vienne: 45.525°N, 4.875°E
 * - Ampuis: 45.49°N, 4.81°E
 * - Tain l'Hermitage: 45.07°N, 4.84°E
 * - Valence: 44.93°N, 4.89°E
 * - Montélimar: 44.56°N, 4.75°E
 * - Orange: 44.14°N, 4.81°E
 * - Avignon: 43.95°N, 4.81°E
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AOCBoundary {
  name: string;
  slug: string;
  established: number;
  description: string;
  color: string;
  zoom: number;
  totalAcreage: number;
  primaryGrapes: string[];
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

// =====================================================
// NORTHERN RHÔNE APPELLATIONS
// Narrow strips along steep hillsides, mostly west bank
// =====================================================

const NORTHERN_RHONE_AOCS: AOCBoundary[] = [
  {
    name: 'Côte-Rôtie',
    slug: 'cote-rotie',
    established: 1940,
    description: 'The "roasted slope" - steep terraced vineyards on mica schist near Ampuis. Includes Côte Brune (iron-rich, darker wines) and Côte Blonde (lighter soils, more elegant wines).',
    color: '#C41E3A',
    zoom: 13,
    totalAcreage: 741,
    primaryGrapes: ['Syrah', 'Viognier'],
    // Small compact area on west bank near Ampuis - irregular shape following hillside
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [4.795, 45.515],  // North tip
        [4.810, 45.510],
        [4.818, 45.495],
        [4.820, 45.480],
        [4.815, 45.465],
        [4.808, 45.455],  // South end
        [4.795, 45.458],
        [4.785, 45.465],
        [4.780, 45.480],
        [4.782, 45.495],
        [4.788, 45.508],
        [4.795, 45.515]   // Close polygon
      ]]
    }
  },
  {
    name: 'Condrieu',
    slug: 'condrieu',
    established: 1940,
    description: 'Exclusive to Viognier, producing opulent white wines with stone fruit and floral aromatics. Steep granite slopes facing south and southeast.',
    color: '#F4D03F',
    zoom: 13,
    totalAcreage: 420,
    primaryGrapes: ['Viognier'],
    // Narrow strip south of Côte-Rôtie along west bank
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [4.780, 45.455],  // North (below Côte-Rôtie)
        [4.795, 45.450],
        [4.805, 45.440],
        [4.810, 45.420],
        [4.808, 45.395],
        [4.802, 45.375],
        [4.795, 45.360],  // South end
        [4.782, 45.365],
        [4.772, 45.380],
        [4.768, 45.400],
        [4.770, 45.425],
        [4.775, 45.445],
        [4.780, 45.455]
      ]]
    }
  },
  {
    name: 'Château-Grillet',
    slug: 'chateau-grillet',
    established: 1936,
    description: 'One of France\'s smallest appellations - a single-estate AOC of just 3.8 hectares. The south-facing amphitheater produces exceptional age-worthy Viognier.',
    color: '#FFD700',
    zoom: 15,
    totalAcreage: 9,
    primaryGrapes: ['Viognier'],
    // Tiny enclave within Condrieu area
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [4.790, 45.372],
        [4.796, 45.370],
        [4.798, 45.365],
        [4.795, 45.360],
        [4.788, 45.362],
        [4.786, 45.368],
        [4.790, 45.372]
      ]]
    }
  },
  {
    name: 'Saint-Joseph',
    slug: 'saint-joseph',
    established: 1956,
    description: 'A 50km-long appellation stretching along the west bank from Condrieu to Cornas. Best sites on steep granite slopes rival the great crus.',
    color: '#D2B48C',
    zoom: 11,
    totalAcreage: 3200,
    primaryGrapes: ['Syrah', 'Marsanne', 'Roussanne'],
    // Very long, narrow strip along west bank - the defining shape
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [4.765, 45.360],  // North end (below Condrieu)
        [4.785, 45.355],
        [4.795, 45.340],
        [4.798, 45.300],
        [4.795, 45.250],
        [4.790, 45.200],
        [4.788, 45.150],
        [4.792, 45.100],
        [4.798, 45.050],
        [4.802, 45.000],
        [4.805, 44.960],
        [4.800, 44.930],  // South end near Cornas
        [4.785, 44.935],
        [4.770, 44.945],
        [4.760, 44.980],
        [4.755, 45.030],
        [4.752, 45.080],
        [4.750, 45.130],
        [4.752, 45.180],
        [4.755, 45.230],
        [4.758, 45.280],
        [4.760, 45.320],
        [4.762, 45.350],
        [4.765, 45.360]
      ]]
    }
  },
  {
    name: 'Hermitage',
    slug: 'hermitage',
    established: 1937,
    description: 'The legendary granite hill overlooking Tain produces some of France\'s greatest wines. Famous lieux-dits include Les Bessards, Le Méal, L\'Hermite, and Les Greffieux.',
    color: '#722F37',
    zoom: 14,
    totalAcreage: 340,
    primaryGrapes: ['Syrah', 'Marsanne', 'Roussanne'],
    // Compact triangular/irregular hill shape at Tain l'Hermitage
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [4.825, 45.085],  // Northwest
        [4.845, 45.082],
        [4.865, 45.075],  // Northeast
        [4.870, 45.068],
        [4.868, 45.058],
        [4.858, 45.050],  // Southeast
        [4.840, 45.048],
        [4.825, 45.052],  // Southwest
        [4.815, 45.060],
        [4.812, 45.072],
        [4.818, 45.082],
        [4.825, 45.085]
      ]]
    }
  },
  {
    name: 'Crozes-Hermitage',
    slug: 'crozes-hermitage',
    established: 1937,
    description: 'The largest Northern Rhône appellation, surrounding the famous hill of Hermitage. Diverse terroirs from granite hills to alluvial plains.',
    color: '#C8A2C8',
    zoom: 12,
    totalAcreage: 4200,
    primaryGrapes: ['Syrah', 'Marsanne', 'Roussanne'],
    // Large irregular area east of the river, surrounding Hermitage
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [4.850, 45.140],  // North
        [4.900, 45.135],
        [4.950, 45.120],
        [4.980, 45.095],  // Northeast
        [4.985, 45.060],
        [4.975, 45.020],
        [4.960, 44.985],
        [4.930, 44.960],  // Southeast
        [4.890, 44.955],
        [4.855, 44.965],
        [4.830, 44.980],  // South (near Hermitage)
        [4.815, 45.000],
        [4.810, 45.025],
        [4.815, 45.045],  // Gap for Hermitage
        [4.870, 45.048],  // Around Hermitage
        [4.875, 45.075],
        [4.850, 45.088],
        [4.825, 45.095],  // Back from Hermitage
        [4.820, 45.115],
        [4.830, 45.135],
        [4.850, 45.140]
      ]]
    }
  },
  {
    name: 'Cornas',
    slug: 'cornas',
    established: 1938,
    description: 'The most powerful wines of the Northern Rhône - 100% Syrah from sun-baked granite amphitheater. Dark, tannic, and exceptionally long-lived.',
    color: '#4B0082',
    zoom: 14,
    totalAcreage: 350,
    primaryGrapes: ['Syrah'],
    // Small compact area south of Hermitage, west bank
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [4.835, 44.975],  // North
        [4.855, 44.970],
        [4.865, 44.958],
        [4.868, 44.940],
        [4.862, 44.925],
        [4.850, 44.915],  // South
        [4.835, 44.918],
        [4.822, 44.928],
        [4.818, 44.945],
        [4.822, 44.962],
        [4.835, 44.975]
      ]]
    }
  },
  {
    name: 'Saint-Péray',
    slug: 'saint-peray',
    established: 1936,
    description: 'The southernmost Northern Rhône AOC, exclusively white wines. Known for both still and traditional-method sparkling Marsanne/Roussanne.',
    color: '#E6E6FA',
    zoom: 14,
    totalAcreage: 200,
    primaryGrapes: ['Marsanne', 'Roussanne'],
    // Small area at southern end near Valence
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [4.830, 44.920],  // North (below Cornas)
        [4.850, 44.915],
        [4.865, 44.905],
        [4.870, 44.888],
        [4.865, 44.870],
        [4.850, 44.862],  // South
        [4.832, 44.865],
        [4.818, 44.875],
        [4.812, 44.892],
        [4.818, 44.908],
        [4.830, 44.920]
      ]]
    }
  }
];

// =====================================================
// SOUTHERN RHÔNE APPELLATIONS
// Wider areas spread across both banks
// =====================================================

const SOUTHERN_RHONE_AOCS: AOCBoundary[] = [
  {
    name: 'Châteauneuf-du-Pape',
    slug: 'chateauneuf-du-pape',
    established: 1936,
    description: 'The flagship of the Southern Rhône, named after the Avignon popes\' summer residence. Famous for galets roulés (large rounded stones) and complex blends.',
    color: '#800080',
    zoom: 12,
    totalAcreage: 8000,
    primaryGrapes: ['Grenache', 'Syrah', 'Mourvèdre', 'Cinsault'],
    // Distinctive irregular shape north of Avignon
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [4.780, 44.080],  // Northwest
        [4.820, 44.085],
        [4.855, 44.075],
        [4.880, 44.060],  // Northeast
        [4.885, 44.035],
        [4.878, 44.010],
        [4.860, 43.990],
        [4.835, 43.980],  // South
        [4.805, 43.982],
        [4.775, 43.995],
        [4.755, 44.015],
        [4.750, 44.040],
        [4.758, 44.062],
        [4.780, 44.080]
      ]]
    }
  },
  {
    name: 'Gigondas',
    slug: 'gigondas',
    established: 1971,
    description: 'Nestled beneath the dramatic Dentelles de Montmirail, producing powerful, structured wines. Often called "the son of Châteauneuf" for similar quality.',
    color: '#8B0000',
    zoom: 13,
    totalAcreage: 3000,
    primaryGrapes: ['Grenache', 'Syrah', 'Mourvèdre'],
    // Compact area near Dentelles de Montmirail
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [4.995, 44.175],  // North
        [5.025, 44.172],
        [5.050, 44.160],
        [5.062, 44.140],
        [5.058, 44.120],
        [5.042, 44.105],
        [5.018, 44.100],  // South
        [4.995, 44.108],
        [4.978, 44.125],
        [4.975, 44.148],
        [4.982, 44.168],
        [4.995, 44.175]
      ]]
    }
  },
  {
    name: 'Vacqueyras',
    slug: 'vacqueyras',
    established: 1990,
    description: 'Neighbor to Gigondas with similar terroir. Clay-limestone and sandy soils create wines with both power and finesse at excellent value.',
    color: '#CD853F',
    zoom: 13,
    totalAcreage: 3500,
    primaryGrapes: ['Grenache', 'Syrah', 'Mourvèdre'],
    // Adjacent to Gigondas, slightly south/west
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [4.955, 44.145],  // North
        [4.985, 44.140],
        [5.005, 44.125],
        [5.012, 44.105],
        [5.005, 44.085],
        [4.985, 44.072],
        [4.958, 44.070],  // South
        [4.935, 44.082],
        [4.925, 44.102],
        [4.930, 44.125],
        [4.942, 44.142],
        [4.955, 44.145]
      ]]
    }
  },
  {
    name: 'Beaumes-de-Venise',
    slug: 'beaumes-de-venise',
    established: 1945,
    description: 'Famous for golden Muscat vin doux naturel, but also produces excellent dry reds from the Dentelles slopes.',
    color: '#FFE4B5',
    zoom: 13,
    totalAcreage: 1600,
    primaryGrapes: ['Muscat', 'Grenache', 'Syrah'],
    // East of Vacqueyras, near Dentelles
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [5.015, 44.140],  // Northwest
        [5.045, 44.135],
        [5.070, 44.120],
        [5.080, 44.100],
        [5.075, 44.080],
        [5.058, 44.065],
        [5.035, 44.062],  // South
        [5.012, 44.072],
        [4.998, 44.090],
        [4.995, 44.112],
        [5.005, 44.132],
        [5.015, 44.140]
      ]]
    }
  },
  {
    name: 'Rasteau',
    slug: 'rasteau',
    established: 2010,
    description: 'Elevated to cru status in 2010 for dry reds. Clay-limestone terroir produces rich, concentrated wines with good aging potential.',
    color: '#A0522D',
    zoom: 13,
    totalAcreage: 2400,
    primaryGrapes: ['Grenache', 'Syrah', 'Mourvèdre'],
    // North of Gigondas
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [4.965, 44.235],  // North
        [4.998, 44.230],
        [5.025, 44.215],
        [5.038, 44.195],
        [5.035, 44.175],
        [5.018, 44.160],
        [4.992, 44.158],  // South
        [4.968, 44.168],
        [4.952, 44.188],
        [4.950, 44.210],
        [4.958, 44.228],
        [4.965, 44.235]
      ]]
    }
  },
  {
    name: 'Lirac',
    slug: 'lirac',
    established: 1947,
    description: 'On the west bank opposite Châteauneuf-du-Pape. Produces excellent reds, whites, and rosés at great value.',
    color: '#B22222',
    zoom: 13,
    totalAcreage: 1800,
    primaryGrapes: ['Grenache', 'Syrah', 'Mourvèdre', 'Cinsault'],
    // West bank, distinct small area
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [4.665, 44.055],  // North
        [4.695, 44.050],
        [4.715, 44.038],
        [4.722, 44.018],
        [4.718, 43.998],
        [4.702, 43.982],
        [4.678, 43.978],  // South
        [4.655, 43.988],
        [4.642, 44.008],
        [4.645, 44.032],
        [4.655, 44.048],
        [4.665, 44.055]
      ]]
    }
  },
  {
    name: 'Tavel',
    slug: 'tavel',
    established: 1936,
    description: 'France\'s most prestigious rosé-only appellation. Deep-colored, full-bodied rosés from sandy limestone. A favorite of Louis XIV.',
    color: '#FFB6C1',
    zoom: 13,
    totalAcreage: 2400,
    primaryGrapes: ['Grenache', 'Cinsault', 'Clairette', 'Bourboulenc'],
    // Small area near Lirac, south of it
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [4.685, 43.985],  // North
        [4.712, 43.980],
        [4.728, 43.965],
        [4.732, 43.945],
        [4.725, 43.928],
        [4.705, 43.918],
        [4.680, 43.920],  // South
        [4.658, 43.932],
        [4.648, 43.952],
        [4.655, 43.972],
        [4.670, 43.982],
        [4.685, 43.985]
      ]]
    }
  },
  {
    name: 'Côtes du Rhône',
    slug: 'cotes-du-rhone',
    established: 1937,
    description: 'The regional appellation covering 171 communes across the Rhône Valley. Approachable, fruit-forward wines at excellent value.',
    color: '#DDA0DD',
    zoom: 9,
    totalAcreage: 100000,
    primaryGrapes: ['Grenache', 'Syrah', 'Mourvèdre', 'Cinsault'],
    // Large area covering most of the Southern Rhône
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [4.450, 44.550],  // Northwest
        [4.650, 44.580],
        [4.850, 44.560],
        [5.050, 44.500],
        [5.150, 44.380],  // Northeast
        [5.180, 44.200],
        [5.150, 44.050],
        [5.080, 43.920],
        [4.950, 43.850],  // Southeast
        [4.780, 43.830],
        [4.600, 43.860],
        [4.450, 43.920],
        [4.350, 44.050],
        [4.320, 44.200],  // Southwest
        [4.350, 44.380],
        [4.400, 44.500],
        [4.450, 44.550]
      ]]
    }
  },
  {
    name: 'Côtes du Rhône Villages',
    slug: 'cotes-du-rhone-villages',
    established: 1966,
    description: 'A step up from Côtes du Rhône with stricter standards. 22 villages can append their name to the label for superior terroir.',
    color: '#DC143C',
    zoom: 10,
    totalAcreage: 20000,
    primaryGrapes: ['Grenache', 'Syrah', 'Mourvèdre'],
    // Concentrated area within Côtes du Rhône
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [4.550, 44.450],  // Northwest
        [4.750, 44.480],
        [4.950, 44.440],
        [5.100, 44.350],  // Northeast
        [5.120, 44.200],
        [5.080, 44.080],
        [4.980, 43.980],
        [4.850, 43.940],  // South
        [4.700, 43.960],
        [4.580, 44.020],
        [4.500, 44.120],
        [4.470, 44.250],  // Southwest
        [4.490, 44.380],
        [4.550, 44.450]
      ]]
    }
  }
];

// =====================================================
// SUB-REGION BOUNDARIES
// =====================================================

const NORTHERN_RHONE_BOUNDARY = {
  name: 'Northern Rhône',
  slug: 'northern-rhone',
  description: 'The northern section of the Rhône Valley, from Vienne to Valence. Known for powerful, elegant Syrah from steep granite slopes along the river.',
  color: '#4A1A2C',
  zoom: 10,
  geometry: {
    type: 'Polygon' as const,
    coordinates: [[
      [4.700, 45.550],  // Northwest
      [4.850, 45.560],
      [5.000, 45.520],
      [5.050, 45.400],
      [5.020, 45.200],
      [5.000, 45.000],
      [4.950, 44.850],  // Southeast
      [4.850, 44.820],
      [4.750, 44.830],
      [4.680, 44.880],
      [4.650, 45.000],
      [4.640, 45.200],
      [4.660, 45.400],
      [4.700, 45.550]
    ]]
  }
};

const SOUTHERN_RHONE_BOUNDARY = {
  name: 'Southern Rhône',
  slug: 'southern-rhone',
  description: 'The southern section from Montélimar to Avignon. Mediterranean climate with famous galets roulés. Grenache-dominant blends including legendary Châteauneuf-du-Pape.',
  color: '#722F37',
  zoom: 9,
  geometry: {
    type: 'Polygon' as const,
    coordinates: [[
      [4.300, 44.600],  // Northwest
      [4.550, 44.650],
      [4.800, 44.620],
      [5.050, 44.550],
      [5.200, 44.400],  // Northeast
      [5.220, 44.150],
      [5.180, 43.950],
      [5.050, 43.800],
      [4.850, 43.750],  // Southeast
      [4.600, 43.780],
      [4.400, 43.850],
      [4.280, 43.980],
      [4.220, 44.150],
      [4.250, 44.350],  // Southwest
      [4.280, 44.500],
      [4.300, 44.600]
    ]]
  }
};

// =====================================================
// FILE GENERATION
// =====================================================

function writeAOCFile(aoc: AOCBoundary, outputDir: string): void {
  const data = {
    name: aoc.name,
    slug: aoc.slug,
    established: aoc.established,
    description: aoc.description,
    color: aoc.color,
    zoom: aoc.zoom,
    totalAcreage: aoc.totalAcreage,
    primaryGrapes: aoc.primaryGrapes,
    geometry: aoc.geometry
  };

  const filePath = path.join(outputDir, `${aoc.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`  ✓ ${aoc.name}`);
}

function writeSubRegionFile(subRegion: typeof NORTHERN_RHONE_BOUNDARY, outputDir: string): void {
  const filePath = path.join(outputDir, `${subRegion.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(subRegion, null, 2));
  console.log(`  ✓ ${subRegion.name}`);
}

async function main() {
  console.log('🍷 Generating accurate Rhône Valley AOC shapes...\n');
  console.log('Based on Quentin Sadler Wine Map reference\n');

  const dataDir = path.join(__dirname, '../data');

  // Create directories
  const subRegionsDir = path.join(dataDir, 'france-sub-regions/rhone');
  const northernDir = path.join(dataDir, 'france-appellations/rhone/northern');
  const southernDir = path.join(dataDir, 'france-appellations/rhone/southern');

  fs.mkdirSync(subRegionsDir, { recursive: true });
  fs.mkdirSync(northernDir, { recursive: true });
  fs.mkdirSync(southernDir, { recursive: true });

  // Generate sub-region files
  console.log('📍 SUB-REGIONS');
  writeSubRegionFile(NORTHERN_RHONE_BOUNDARY, subRegionsDir);
  writeSubRegionFile(SOUTHERN_RHONE_BOUNDARY, subRegionsDir);

  // Generate Northern Rhône AOCs
  console.log('\n📍 NORTHERN RHÔNE AOCs (narrow strips along west bank)');
  for (const aoc of NORTHERN_RHONE_AOCS) {
    writeAOCFile(aoc, northernDir);
  }

  // Generate Southern Rhône AOCs
  console.log('\n📍 SOUTHERN RHÔNE AOCs (wider areas, both banks)');
  for (const aoc of SOUTHERN_RHONE_AOCS) {
    writeAOCFile(aoc, southernDir);
  }

  console.log('\n✅ All Rhône Valley AOC shapes generated!');
  console.log('\nKey features:');
  console.log('- Northern appellations: Narrow strips along steep hillsides');
  console.log('- Saint-Joseph: Long 50km strip along west bank');
  console.log('- Hermitage: Compact triangular hill');
  console.log('- Southern appellations: Wider, irregular shapes');
  console.log('- Châteauneuf-du-Pape: Distinctive shape north of Avignon');
}

main().catch(console.error);
