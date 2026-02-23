import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://raw.githubusercontent.com/UCDavisLibrary/ava/master/avas';

// California AVA hierarchy
// Major AVAs are top-level regions, sub-AVAs are nested under them
const CALIFORNIA_AVAS = {
  // Napa Valley and sub-AVAs (already done, but including for completeness)
  'napa-valley': {
    file: 'napa_valley',
    name: 'Napa Valley',
    subAvas: [
      'atlas_peak', 'calistoga', 'chiles_valley', 'coombsville',
      'diamond_mountain_district', 'howell_mountain', 'los_carneros',
      'mt__veeder', 'oak_knoll_district_of_napa_valley', 'oakville',
      'rutherford', 'spring_mountain_district', 'st__helena',
      'stags_leap_district', 'wild_horse_valley', 'yountville',
    ],
  },

  // Sonoma County and sub-AVAs
  'sonoma-county': {
    file: 'sonoma_county',
    name: 'Sonoma County',
    subAvas: [
      'alexander_valley', 'bennett_valley', 'chalk_hill',
      'dry_creek_valley', 'fountaingrove_district', 'knights_valley',
      'los_carneros', 'moon_mountain_district_sonoma_county',
      'petaluma_gap', 'pine_mountain-cloverdale_peak', 'rockpile',
      'russian_river_valley', 'sonoma_coast', 'sonoma_mountain',
      'sonoma_valley', 'west_sonoma_coast',
    ],
  },

  // Mendocino County
  'mendocino': {
    file: 'mendocino',
    name: 'Mendocino',
    subAvas: [
      'anderson_valley', 'cole_ranch', 'covelo', 'dos_rios',
      'eagle_peak_mendocino_county', 'mcdowell_valley',
      'mendocino_ridge', 'potter_valley', 'redwood_valley',
      'yorkville_highlands',
    ],
  },

  // Paso Robles
  'paso-robles': {
    file: 'paso_robles',
    name: 'Paso Robles',
    subAvas: [
      'adelaida_district', 'creston_district', 'el_pomar_district',
      'estrella_district', 'geneseo_district', 'highlands_district',
      'paso_robles_willow_creek_district', 'san_juan_creek',
      'san_miguel_district', 'santa_margarita_ranch', 'templeton_gap_district',
    ],
  },

  // Santa Barbara County
  'santa-barbara-county': {
    file: 'santa_barbara_county',
    name: 'Santa Barbara County',
    subAvas: [
      'ballard_canyon', 'happy_canyon_of_santa_barbara',
      'los_alamos_valley', 'los_olivos_district',
      'santa_maria_valley', 'santa_ynez_valley', 'sta__rita_hills',
    ],
  },

  // Monterey
  'monterey': {
    file: 'monterey',
    name: 'Monterey',
    subAvas: [
      'arroyo_seco', 'carmel_valley', 'chalone',
      'hames_valley', 'san_antonio_valley', 'san_bernabe',
      'san_lucas', 'santa_lucia_highlands',
    ],
  },

  // Central Coast (broader region)
  'central-coast': {
    file: 'central_coast',
    name: 'Central Coast',
    subAvas: [], // Sub-regions are their own major AVAs
  },

  // Livermore Valley
  'livermore-valley': {
    file: 'livermore_valley',
    name: 'Livermore Valley',
    subAvas: [],
  },

  // Santa Cruz Mountains
  'santa-cruz-mountains': {
    file: 'santa_cruz_mountains',
    name: 'Santa Cruz Mountains',
    subAvas: ['ben_lomond_mountain', 'san_ysidro_district'],
  },

  // Lodi
  'lodi': {
    file: 'lodi',
    name: 'Lodi',
    subAvas: [
      'alta_mesa', 'borden_ranch', 'clements_hills',
      'cosumnes_river', 'jahant', 'mokelumne_river', 'sloughhouse',
    ],
  },

  // Sierra Foothills
  'sierra-foothills': {
    file: 'sierra_foothills',
    name: 'Sierra Foothills',
    subAvas: [
      'california_shenandoah_valley', 'el_dorado',
      'fair_play', 'fiddletown', 'north_yuba',
    ],
  },

  // Lake County
  'lake-county': {
    file: 'lake_county',
    name: 'Lake County',
    subAvas: [
      'big_valley_district-lake_county', 'clear_lake',
      'guenoc_valley', 'high_valley', 'kelsey_bench-lake_county',
      'red_hills_lake_county',
    ],
  },

  // Temecula Valley (Southern California)
  'temecula-valley': {
    file: 'temecula_valley',
    name: 'Temecula Valley',
    subAvas: [],
  },
};

// Color palette for major AVAs
const MAJOR_AVA_COLORS: Record<string, string> = {
  'napa-valley': '#722F37',      // Wine red
  'sonoma-county': '#2E5A1C',    // Forest green
  'mendocino': '#1E3A5F',        // Deep blue
  'paso-robles': '#8B4513',      // Saddle brown
  'santa-barbara-county': '#DAA520', // Goldenrod
  'monterey': '#2F4F4F',         // Dark slate
  'central-coast': '#4682B4',    // Steel blue
  'livermore-valley': '#556B2F', // Olive
  'santa-cruz-mountains': '#6B8E23', // Olive drab
  'lodi': '#CD853F',             // Peru
  'sierra-foothills': '#8B7355', // Tan
  'lake-county': '#4169E1',      // Royal blue
  'temecula-valley': '#B8860B',  // Dark goldenrod
};

function calculateCentroid(coordinates: number[][][]): { longitude: number; latitude: number } {
  const ring = coordinates[0];
  let sumLng = 0;
  let sumLat = 0;

  for (const coord of ring) {
    sumLng += coord[0];
    sumLat += coord[1];
  }

  return {
    longitude: sumLng / ring.length,
    latitude: sumLat / ring.length,
  };
}

async function downloadAVA(filename: string, outputDir: string): Promise<any | null> {
  const url = `${BASE_URL}/${filename}.geojson`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`  ⚠️  Failed: ${response.status} for ${filename}`);
      return null;
    }

    const data = await response.json();

    // Find the most recent feature (valid_end is null)
    let feature = data.features?.[0];
    for (const f of data.features || []) {
      if (f.properties?.valid_end === null) {
        feature = f;
        break;
      }
    }

    if (!feature) {
      console.log(`  ⚠️  No valid feature found for ${filename}`);
      return null;
    }

    // Handle both Polygon and MultiPolygon
    let coords: number[][][];
    if (feature.geometry.type === 'MultiPolygon') {
      coords = feature.geometry.coordinates[0];
    } else {
      coords = feature.geometry.coordinates;
    }

    // Simplify coordinates
    const step = Math.max(1, Math.floor(coords[0].length / 100));
    const simplified = coords[0].filter((_: any, i: number) => i % step === 0);

    // Ensure polygon closes
    if (JSON.stringify(simplified[0]) !== JSON.stringify(simplified[simplified.length - 1])) {
      simplified.push(simplified[0]);
    }

    const output = {
      name: feature.properties.name,
      established: feature.properties.created,
      geometry: {
        type: 'Polygon',
        coordinates: [simplified],
      },
    };

    const outputPath = path.join(outputDir, `${filename}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`  ✓ ${feature.properties.name} (${coords[0].length} → ${simplified.length} points)`);

    return output;
  } catch (error) {
    console.log(`  ⚠️  Error downloading ${filename}: ${error}`);
    return null;
  }
}

async function downloadAllAVAs() {
  console.log('🍇 Downloading all California AVA boundaries...\n');

  const baseDir = path.join(__dirname, '../data');

  // Create directories
  const majorsDir = path.join(baseDir, 'major-avas');
  if (!fs.existsSync(majorsDir)) {
    fs.mkdirSync(majorsDir, { recursive: true });
  }

  let totalMajor = 0;
  let totalSub = 0;

  for (const [slug, config] of Object.entries(CALIFORNIA_AVAS)) {
    console.log(`\n📍 ${config.name}`);

    // Download major AVA
    const majorResult = await downloadAVA(config.file, majorsDir);
    if (majorResult) {
      totalMajor++;

      // Add color to the output
      const majorPath = path.join(majorsDir, `${config.file}.json`);
      const majorData = JSON.parse(fs.readFileSync(majorPath, 'utf-8'));
      majorData.color = MAJOR_AVA_COLORS[slug] || '#666666';
      majorData.slug = slug;
      fs.writeFileSync(majorPath, JSON.stringify(majorData, null, 2));
    }

    // Download sub-AVAs if any
    if (config.subAvas.length > 0) {
      const subDir = path.join(baseDir, `${slug}-avas`);
      if (!fs.existsSync(subDir)) {
        fs.mkdirSync(subDir, { recursive: true });
      }

      console.log(`  Sub-AVAs:`);
      for (const subAva of config.subAvas) {
        const result = await downloadAVA(subAva, subDir);
        if (result) totalSub++;
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Download complete!`);
  console.log(`   Major AVAs: ${totalMajor}`);
  console.log(`   Sub-AVAs: ${totalSub}`);
  console.log(`   Total: ${totalMajor + totalSub}`);
}

downloadAllAVAs().catch(console.error);
