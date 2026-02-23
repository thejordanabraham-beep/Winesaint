import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://raw.githubusercontent.com/UCDavisLibrary/ava/master/avas';

const MISSING = [
  { filename: 'eola_amity_hills', dir: 'willamette-valley-avas' },
  { filename: 'yamhill_carlton', dir: 'willamette-valley-avas' },
];

async function download() {
  const baseDir = path.join(__dirname, '../data');

  for (const { filename, dir } of MISSING) {
    const url = `${BASE_URL}/${filename}.geojson`;
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`Failed: ${filename}`);
      continue;
    }

    const data = await response.json();
    let feature = data.features?.[0];
    for (const f of data.features || []) {
      if (f.properties?.valid_end === null) {
        feature = f;
        break;
      }
    }

    if (!feature) continue;

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
      geometry: { type: 'Polygon', coordinates: [simplified] },
    };

    const outputPath = path.join(baseDir, dir, `${filename}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`✓ ${feature.properties.name}`);
  }
}

download().catch(console.error);
