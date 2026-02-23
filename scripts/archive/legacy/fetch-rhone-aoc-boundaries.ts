/**
 * Fetch real AOC boundaries from French government API
 * AOCs are defined by specific communes - we fetch those boundaries and merge them
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AOC definitions - which communes make up each appellation
// Source: INAO official appellation definitions
const RHONE_AOCS = {
  northern: {
    'cote-rotie': {
      name: 'Côte-Rôtie',
      communes: ['Ampuis', 'Saint-Cyr-sur-le-Rhône', 'Tupin-et-Semons'],
      established: 1940,
      description: "The 'roasted slope' - steep terraced vineyards producing elegant, aromatic Syrah, often blended with up to 20% Viognier.",
      color: '#4A0E0E',
      totalAcreage: 741,
    },
    'condrieu': {
      name: 'Condrieu',
      communes: ['Condrieu', 'Vérin', 'Saint-Michel-sur-Rhône', 'Chavanay', 'Malleval', 'Limony', 'Saint-Pierre-de-Boeuf'],
      established: 1940,
      description: 'Exclusive to Viognier, producing rich, aromatic white wines with notes of apricot, peach, and flowers.',
      color: '#DAA520',
      totalAcreage: 420,
    },
    'chateau-grillet': {
      name: 'Château-Grillet',
      communes: ['Vérin', 'Saint-Michel-sur-Rhône'],
      established: 1936,
      description: "One of France's smallest appellations, a single-estate AOC producing exceptional Viognier.",
      color: '#FFD700',
      totalAcreage: 9,
    },
    'saint-joseph': {
      name: 'Saint-Joseph',
      communes: ['Chavanay', 'Saint-Pierre-de-Boeuf', 'Malleval', 'Limony', 'Félines', 'Serrières', 'Charnas', 'Champagne', 'Saint-Désirat', 'Ardoix', 'Ozon', 'Sarras', 'Arras-sur-Rhône', 'Sécheras', 'Tournon-sur-Rhône', 'Mauves', 'Glun', 'Châteaubourg', 'Lemps', 'Vion', 'Saint-Jean-de-Muzols', 'Érôme', 'Gervans', 'Larnage', 'Crozes-Hermitage', 'Serves-sur-Rhône', 'Beaumont-Monteux', 'Mercurol-Veaunes', 'Chanos-Curson', 'Pont-de-l\'Isère', 'La Roche-de-Glun', 'Guilherand-Granges'],
      established: 1956,
      description: 'A large appellation stretching along the west bank of the Rhône, producing both red Syrah and white wines.',
      color: '#8B0000',
      totalAcreage: 3200,
    },
    'hermitage': {
      name: 'Hermitage',
      communes: ['Tain-l\'Hermitage', 'Crozes-Hermitage', 'Larnage'],
      established: 1937,
      description: "The legendary hill of Hermitage produces some of France's greatest and most age-worthy wines.",
      color: '#2F1810',
      totalAcreage: 340,
    },
    'crozes-hermitage': {
      name: 'Crozes-Hermitage',
      communes: ['Crozes-Hermitage', 'Tain-l\'Hermitage', 'Larnage', 'Gervans', 'Érôme', 'Serves-sur-Rhône', 'Beaumont-Monteux', 'Pont-de-l\'Isère', 'La Roche-de-Glun', 'Mercurol-Veaunes', 'Chanos-Curson'],
      established: 1937,
      description: 'The largest Northern Rhône appellation, surrounding the hill of Hermitage.',
      color: '#A52A2A',
      totalAcreage: 4200,
    },
    'cornas': {
      name: 'Cornas',
      communes: ['Cornas'],
      established: 1938,
      description: 'The most powerful wines of the Northern Rhône, 100% Syrah from sun-baked granite slopes.',
      color: '#1C1C1C',
      totalAcreage: 350,
    },
    'saint-peray': {
      name: 'Saint-Péray',
      communes: ['Saint-Péray', 'Toulaud'],
      established: 1936,
      description: 'The southernmost Northern Rhône appellation, producing exclusively white wines.',
      color: '#F5DEB3',
      totalAcreage: 200,
    },
  },
  southern: {
    'chateauneuf-du-pape': {
      name: 'Châteauneuf-du-Pape',
      communes: ['Châteauneuf-du-Pape', 'Orange', 'Courthézon', 'Bédarrides', 'Sorgues'],
      established: 1936,
      description: "The flagship of the Southern Rhône, named after the Avignon popes' summer residence.",
      color: '#800020',
      totalAcreage: 8000,
    },
    'gigondas': {
      name: 'Gigondas',
      communes: ['Gigondas'],
      established: 1971,
      description: "Nestled beneath the dramatic Dentelles de Montmirail, often called 'the son of Châteauneuf'.",
      color: '#660000',
      totalAcreage: 3000,
    },
    'vacqueyras': {
      name: 'Vacqueyras',
      communes: ['Vacqueyras', 'Sarrians'],
      established: 1990,
      description: 'Neighbor to Gigondas, producing similarly styled wines with excellent value.',
      color: '#8B4513',
      totalAcreage: 3500,
    },
    'beaumes-de-venise': {
      name: 'Beaumes-de-Venise',
      communes: ['Beaumes-de-Venise', 'Lafare', 'La Roque-Alric', 'Suzette'],
      established: 1945,
      description: 'Famous for its vin doux naturel from Muscat, but also produces excellent red wines.',
      color: '#FFE4B5',
      totalAcreage: 1600,
    },
    'rasteau': {
      name: 'Rasteau',
      communes: ['Rasteau'],
      established: 2010,
      description: 'Elevated to cru status in 2010, known for both dry reds and vin doux naturel.',
      color: '#A0522D',
      totalAcreage: 2400,
    },
    'lirac': {
      name: 'Lirac',
      communes: ['Lirac', 'Saint-Laurent-des-Arbres', 'Saint-Geniès-de-Comolas', 'Roquemaure'],
      established: 1947,
      description: 'Located on the west bank of the Rhône, opposite Châteauneuf-du-Pape.',
      color: '#B22222',
      totalAcreage: 1800,
    },
    'tavel': {
      name: 'Tavel',
      communes: ['Tavel', 'Roquemaure'],
      established: 1936,
      description: "France's most prestigious rosé-only appellation, producing deep-colored, full-bodied rosés.",
      color: '#F08080',
      totalAcreage: 2400,
    },
    'cotes-du-rhone': {
      name: 'Côtes du Rhône',
      // Regional appellation - use main communes as representative boundary
      communes: ['Orange', 'Châteauneuf-du-Pape', 'Avignon', 'Carpentras', 'Vaison-la-Romaine', 'Bollène', 'Nyons'],
      established: 1937,
      description: 'The regional appellation covering the entire Rhône Valley.',
      color: '#CD5C5C',
      totalAcreage: 100000,
    },
    'cotes-du-rhone-villages': {
      name: 'Côtes du Rhône Villages',
      communes: ['Cairanne', 'Sablet', 'Séguret', 'Valréas', 'Vinsobres', 'Visan', 'Roaix', 'Rochegude'],
      established: 1966,
      description: 'A step up from basic Côtes du Rhône, with stricter production standards.',
      color: '#DC143C',
      totalAcreage: 20000,
    },
  },
};

interface CommuneFeature {
  type: 'Feature';
  properties: {
    nom: string;
    code: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

async function fetchCommuneBoundary(communeName: string): Promise<CommuneFeature | null> {
  try {
    const url = `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(communeName)}&fields=nom,code,contour&format=geojson&geometry=contour`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      // Find exact match or best match
      const exactMatch = data.features.find((f: any) =>
        f.properties.nom.toLowerCase() === communeName.toLowerCase()
      );
      return exactMatch || data.features[0];
    }
    return null;
  } catch (error) {
    console.error(`  Error fetching ${communeName}:`, error);
    return null;
  }
}

function mergePolygons(features: CommuneFeature[]): { type: 'MultiPolygon'; coordinates: number[][][][] } {
  const allCoordinates: number[][][][] = [];

  for (const feature of features) {
    if (feature.geometry.type === 'Polygon') {
      allCoordinates.push(feature.geometry.coordinates as number[][][]);
    } else if (feature.geometry.type === 'MultiPolygon') {
      allCoordinates.push(...(feature.geometry.coordinates as number[][][][]));
    }
  }

  return {
    type: 'MultiPolygon',
    coordinates: allCoordinates,
  };
}

function calculateCentroid(geometry: { type: string; coordinates: number[][][] | number[][][][] }): { longitude: number; latitude: number } {
  let sumLng = 0, sumLat = 0, count = 0;

  function processRing(ring: number[][]) {
    for (const coord of ring) {
      sumLng += coord[0];
      sumLat += coord[1];
      count++;
    }
  }

  if (geometry.type === 'Polygon') {
    processRing((geometry.coordinates as number[][][])[0]);
  } else if (geometry.type === 'MultiPolygon') {
    for (const polygon of geometry.coordinates as number[][][][]) {
      processRing(polygon[0]);
    }
  }

  return { longitude: sumLng / count, latitude: sumLat / count };
}

async function fetchAndSaveAOCBoundaries() {
  console.log('🍷 Fetching real AOC boundaries from French government API...\n');

  const dataDir = path.join(__dirname, '../data');

  // Process Northern Rhône
  console.log('📍 NORTHERN RHÔNE APPELLATIONS\n');
  const northernDir = path.join(dataDir, 'france-appellations/rhone/northern');

  for (const [slug, aoc] of Object.entries(RHONE_AOCS.northern)) {
    console.log(`Processing ${aoc.name}...`);
    const communeFeatures: CommuneFeature[] = [];

    for (const commune of aoc.communes) {
      const feature = await fetchCommuneBoundary(commune);
      if (feature && feature.geometry) {
        communeFeatures.push(feature);
        console.log(`  ✓ ${commune}`);
      } else {
        console.log(`  ✗ ${commune} (not found)`);
      }
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (communeFeatures.length > 0) {
      const mergedGeometry = mergePolygons(communeFeatures);
      const center = calculateCentroid(mergedGeometry);

      const aocData = {
        name: aoc.name,
        slug,
        established: aoc.established,
        description: aoc.description,
        color: aoc.color,
        totalAcreage: aoc.totalAcreage,
        zoom: 12,
        geometry: mergedGeometry,
      };

      const filePath = path.join(northernDir, `${slug}.json`);
      fs.writeFileSync(filePath, JSON.stringify(aocData, null, 2));
      console.log(`  → Saved to ${slug}.json (${communeFeatures.length} communes)\n`);
    }
  }

  // Process Southern Rhône
  console.log('\n📍 SOUTHERN RHÔNE APPELLATIONS\n');
  const southernDir = path.join(dataDir, 'france-appellations/rhone/southern');

  for (const [slug, aoc] of Object.entries(RHONE_AOCS.southern)) {
    console.log(`Processing ${aoc.name}...`);
    const communeFeatures: CommuneFeature[] = [];

    for (const commune of aoc.communes) {
      const feature = await fetchCommuneBoundary(commune);
      if (feature && feature.geometry) {
        communeFeatures.push(feature);
        console.log(`  ✓ ${commune}`);
      } else {
        console.log(`  ✗ ${commune} (not found)`);
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (communeFeatures.length > 0) {
      const mergedGeometry = mergePolygons(communeFeatures);
      const center = calculateCentroid(mergedGeometry);

      const aocData = {
        name: aoc.name,
        slug,
        established: aoc.established,
        description: aoc.description,
        color: aoc.color,
        totalAcreage: aoc.totalAcreage,
        zoom: 12,
        geometry: mergedGeometry,
      };

      const filePath = path.join(southernDir, `${slug}.json`);
      fs.writeFileSync(filePath, JSON.stringify(aocData, null, 2));
      console.log(`  → Saved to ${slug}.json (${communeFeatures.length} communes)\n`);
    }
  }

  console.log('\n✅ AOC boundary fetching complete!');
  console.log('Note: Boundaries are based on commune administrative limits.');
  console.log('For parcel-level accuracy, official INAO data would be needed.');
}

fetchAndSaveAOCBoundaries().catch(console.error);
