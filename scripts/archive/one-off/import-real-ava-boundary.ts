import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'hj3ee4sp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Real Howell Mountain AVA boundary from UC Davis AVA Project
// Source: https://github.com/UCDavisLibrary/ava
// License: CC0 (Public Domain)
const HOWELL_MOUNTAIN_AVA_BOUNDARY = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/howell_mountain_simplified.json'), 'utf-8')
);

// Calculate center point from boundary
function calculateCenter(coordinates: number[][]): { longitude: number; latitude: number } {
  let sumLng = 0;
  let sumLat = 0;
  const n = coordinates.length;

  for (const coord of coordinates) {
    sumLng += coord[0];
    sumLat += coord[1];
  }

  return {
    longitude: sumLng / n,
    latitude: sumLat / n,
  };
}

async function importRealAVABoundary() {
  console.log('🗺️  Importing real Howell Mountain AVA boundary from UC Davis data...\n');

  // Find existing Howell Mountain appellation
  const appellation = await client.fetch(
    `*[_type == "appellation" && slug.current == "howell-mountain"][0]{ _id, name }`
  );

  if (!appellation) {
    console.log('❌ Howell Mountain appellation not found. Run seed-howell-mountain.ts first.');
    return;
  }

  // Calculate center from real boundary
  const coords = HOWELL_MOUNTAIN_AVA_BOUNDARY.coordinates[0];
  const center = calculateCenter(coords);

  // Update with real boundary
  await client.patch(appellation._id)
    .set({
      boundaries: {
        type: 'Feature',
        geometry: HOWELL_MOUNTAIN_AVA_BOUNDARY,
        properties: {
          source: 'UC Davis AVA Project',
          license: 'CC0',
          url: 'https://github.com/UCDavisLibrary/ava',
        },
      },
      centerPoint: {
        longitude: center.longitude,
        latitude: center.latitude,
        defaultZoom: 12,
      },
    })
    .commit();

  console.log(`✅ Updated ${appellation.name} with real AVA boundary`);
  console.log(`   - ${coords.length} boundary points`);
  console.log(`   - Center: ${center.longitude.toFixed(4)}, ${center.latitude.toFixed(4)}`);
  console.log('\n📍 View: http://localhost:3000/maps/howell-mountain');
}

importRealAVABoundary().catch(console.error);
