import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://raw.githubusercontent.com/UCDavisLibrary/ava/master/avas';

// Washington AVA hierarchy
const WASHINGTON_AVAS = {
  // Major AVAs
  major: [
    'columbia_valley',
    'puget_sound',
    'columbia_gorge', // Shared with Oregon
  ],

  // Columbia Valley sub-AVAs
  'columbia-valley': [
    'yakima_valley',
    'walla_walla_valley', // Shared with Oregon
    'red_mountain',
    'horse_heaven_hills',
    'wahluke_slope',
    'rattlesnake_hills',
    'snipes_mountain',
    'lake_chelan',
    'naches_heights',
    'ancient_lakes',
    'white_bluffs',
    'candy_mountain',
    'the_burn_of_columbia_valley',
    'goose_gap',
    'royal_slope',
  ],

  // Yakima Valley sub-AVAs
  'yakima-valley': [
    'red_mountain',
    'rattlesnake_hills',
    'snipes_mountain',
  ],
};

async function downloadAVA(filename: string, outputDir: string): Promise<any | null> {
  const url = `${BASE_URL}/${filename}.geojson`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();

    let feature = data.features?.[0];
    for (const f of data.features || []) {
      if (f.properties?.valid_end === null) {
        feature = f;
        break;
      }
    }

    if (!feature) return null;

    let coords: number[][][];
    if (feature.geometry.type === 'MultiPolygon') {
      coords = feature.geometry.coordinates[0];
    } else {
      coords = feature.geometry.coordinates;
    }

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

async function downloadWashingtonAVAs() {
  console.log('🍇 Downloading Washington AVA boundaries...\n');

  const baseDir = path.join(__dirname, '../data');
  let downloaded = 0;
  let failed = 0;

  // Download major AVAs
  console.log('📍 MAJOR AVAs');
  const majorDir = path.join(baseDir, 'washington-major-avas');
  if (!fs.existsSync(majorDir)) fs.mkdirSync(majorDir, { recursive: true });

  for (const filename of WASHINGTON_AVAS.major) {
    process.stdout.write(`  ${filename}... `);
    const result = await downloadAVA(filename, majorDir);
    if (result) {
      console.log(`✓ ${result.name}`);
      downloaded++;
    } else {
      console.log('✗ 404');
      failed++;
    }
  }

  // Download Columbia Valley sub-AVAs
  console.log('\n📍 COLUMBIA VALLEY SUB-AVAs');
  const columbiaDir = path.join(baseDir, 'columbia-valley-avas');
  if (!fs.existsSync(columbiaDir)) fs.mkdirSync(columbiaDir, { recursive: true });

  for (const filename of WASHINGTON_AVAS['columbia-valley']) {
    process.stdout.write(`  ${filename}... `);
    const result = await downloadAVA(filename, columbiaDir);
    if (result) {
      console.log(`✓ ${result.name}`);
      downloaded++;
    } else {
      console.log('✗ 404');
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Failed: ${failed}`);
}

downloadWashingtonAVAs().catch(console.error);
