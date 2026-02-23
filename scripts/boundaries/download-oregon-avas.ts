import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://raw.githubusercontent.com/UCDavisLibrary/ava/master/avas';

// Oregon AVA hierarchy
const OREGON_AVAS = {
  // Major AVAs
  major: [
    'willamette_valley',
    'southern_oregon',
    'columbia_gorge',
    'columbia_valley',  // Shared with Washington
    'walla_walla_valley',  // Shared with Washington
    'snake_river_valley',  // Shared with Idaho
  ],

  // Willamette Valley sub-AVAs
  'willamette-valley': [
    'chehalem_mountains',
    'dundee_hills',
    'eola-amity_hills',
    'laurelwood_district',
    'lower_long_tom',
    'mcminnville',
    'mount_pisgah',
    'polk_county',
    'ribbon_ridge',
    'tualatin_hills',
    'van_duzer_corridor',
    'yamhill-carlton',
  ],

  // Southern Oregon sub-AVAs
  'southern-oregon': [
    'applegate_valley',
    'elkton_oregon',
    'red_hill_douglas_county',
    'rogue_valley',
    'umpqua_valley',
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

async function downloadOregonAVAs() {
  console.log('🍇 Downloading Oregon AVA boundaries...\n');

  const baseDir = path.join(__dirname, '../data');
  let downloaded = 0;
  let failed = 0;

  // Download major AVAs
  console.log('📍 MAJOR AVAs');
  const majorDir = path.join(baseDir, 'oregon-major-avas');
  if (!fs.existsSync(majorDir)) fs.mkdirSync(majorDir, { recursive: true });

  for (const filename of OREGON_AVAS.major) {
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

  // Download Willamette Valley sub-AVAs
  console.log('\n📍 WILLAMETTE VALLEY SUB-AVAs');
  const willametteDir = path.join(baseDir, 'willamette-valley-avas');
  if (!fs.existsSync(willametteDir)) fs.mkdirSync(willametteDir, { recursive: true });

  for (const filename of OREGON_AVAS['willamette-valley']) {
    process.stdout.write(`  ${filename}... `);
    const result = await downloadAVA(filename, willametteDir);
    if (result) {
      console.log(`✓ ${result.name}`);
      downloaded++;
    } else {
      console.log('✗ 404');
      failed++;
    }
  }

  // Download Southern Oregon sub-AVAs
  console.log('\n📍 SOUTHERN OREGON SUB-AVAs');
  const southernDir = path.join(baseDir, 'southern-oregon-avas');
  if (!fs.existsSync(southernDir)) fs.mkdirSync(southernDir, { recursive: true });

  for (const filename of OREGON_AVAS['southern-oregon']) {
    process.stdout.write(`  ${filename}... `);
    const result = await downloadAVA(filename, southernDir);
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

downloadOregonAVAs().catch(console.error);
