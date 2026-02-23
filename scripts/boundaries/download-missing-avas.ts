import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://raw.githubusercontent.com/UCDavisLibrary/ava/master/avas';

// Missing AVAs to download
const MISSING_AVAS = {
  // South Coast / Southern California
  'south-coast': {
    files: [
      'south_coast',
      'malibu_coast',
      'saddle_rock-malibu',
      'san_pasqual_valley',
      'ramona_valley',
      'cucamonga_valley',
      'antelope_valley_of_the_california_high_desert',
      'leona_valley',
    ],
    dir: 'south-coast-avas',
  },

  // Sacramento Delta / Inland
  'inland': {
    files: [
      'clarksburg',
      'suisun_valley',
      'capay_valley',
      'dunnigan_hills',
      'solano_county_green_valley',
      'merritt_island',
    ],
    dir: 'inland-avas',
  },

  // Crystal Springs - Napa's newest
  'napa-new': {
    files: ['crystal_springs'],
    dir: 'napa-valley-avas',
  },

  // Try alternate names for failed downloads
  'retry': {
    files: [
      'pine_mountain_cloverdale_peak',  // Try without hyphen
      'big_valley_district_lake_county',
      'kelsey_bench_lake_county',
      'los_alamos_valley',
      'estrella_district',
      'geneseo_district',
      'highlands_district',
    ],
    dir: 'retry-avas',
  },
};

async function downloadAVA(filename: string, outputDir: string): Promise<any | null> {
  const url = `${BASE_URL}/${filename}.geojson`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    let feature = data.features?.[0];
    for (const f of data.features || []) {
      if (f.properties?.valid_end === null) {
        feature = f;
        break;
      }
    }

    if (!feature) return null;

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

    return output;
  } catch (error) {
    return null;
  }
}

async function downloadMissingAVAs() {
  console.log('🍇 Downloading missing California AVAs...\n');

  const baseDir = path.join(__dirname, '../data');
  let downloaded = 0;
  let failed = 0;

  for (const [category, config] of Object.entries(MISSING_AVAS)) {
    console.log(`\n📍 ${category.toUpperCase()}`);

    const outputDir = path.join(baseDir, config.dir);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const filename of config.files) {
      process.stdout.write(`  ${filename}... `);
      const result = await downloadAVA(filename, outputDir);
      if (result) {
        console.log(`✓ ${result.name}`);
        downloaded++;
      } else {
        console.log('✗ 404');
        failed++;
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Failed: ${failed}`);
}

downloadMissingAVAs().catch(console.error);
