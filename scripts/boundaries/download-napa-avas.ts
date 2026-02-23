import * as fs from 'fs';
import * as path from 'path';

const NAPA_SUB_AVAS = [
  'oakville',
  'rutherford',
  'stags_leap_district',
  'los_carneros',
  'atlas_peak',
  'calistoga',
  'chiles_valley',
  'coombsville',
  'diamond_mountain_district',
  'howell_mountain',
  'mt__veeder',
  'oak_knoll_district_of_napa_valley',
  'spring_mountain_district',
  'st__helena',
  'wild_horse_valley',
  'yountville',
];

const BASE_URL = 'https://raw.githubusercontent.com/UCDavisLibrary/ava/master/avas';

async function downloadAVAs() {
  console.log('🍇 Downloading all Napa Valley sub-AVA boundaries...\n');

  const dataDir = path.join(__dirname, '../data/napa-avas');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  for (const ava of NAPA_SUB_AVAS) {
    const url = `${BASE_URL}/${ava}.geojson`;
    console.log(`Downloading ${ava}...`);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.log(`  ⚠️  Failed: ${response.status}`);
        continue;
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
        console.log(`  ⚠️  No valid feature found`);
        continue;
      }

      // Simplify coordinates
      const coords = feature.geometry.coordinates[0];
      const step = Math.max(1, Math.floor(coords.length / 100));
      const simplified = coords.filter((_: any, i: number) => i % step === 0);

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

      const outputPath = path.join(dataDir, `${ava}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
      console.log(`  ✓ Saved (${coords.length} → ${simplified.length} points)`);
    } catch (error) {
      console.log(`  ⚠️  Error: ${error}`);
    }
  }

  console.log('\n✅ Done!');
}

downloadAVAs().catch(console.error);
