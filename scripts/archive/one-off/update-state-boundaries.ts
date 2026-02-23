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

function calculateCentroid(coordinates: number[][][]): { longitude: number; latitude: number } {
  const ring = coordinates[0];
  let sumLng = 0, sumLat = 0;
  for (const coord of ring) { sumLng += coord[0]; sumLat += coord[1]; }
  return { longitude: sumLng / ring.length, latitude: sumLat / ring.length };
}

async function updateStateBoundaries() {
  console.log('🗺️ Updating state boundaries in Sanity...\n');

  const dataDir = path.join(__dirname, '../data');

  // Update California
  const californiaData = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'california_state.json'), 'utf-8')
  );
  const caCenter = calculateCentroid(californiaData.coordinates);

  const california = await client.fetch(
    `*[_type == "appellation" && slug.current == "california"][0]{ _id }`
  );

  if (california) {
    await client.patch(california._id)
      .set({
        boundaries: {
          type: 'Feature',
          geometry: californiaData,
          properties: { source: 'US Census', fillColor: '#C5A572' },
        },
        centerPoint: { longitude: caCenter.longitude, latitude: caCenter.latitude, defaultZoom: 6 },
      })
      .commit();
    console.log('✓ Updated California boundary');
  }

  // Update Oregon
  const oregonData = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'oregon_state.json'), 'utf-8')
  );
  const orCenter = calculateCentroid(oregonData.coordinates);

  const oregon = await client.fetch(
    `*[_type == "appellation" && slug.current == "oregon"][0]{ _id }`
  );

  if (oregon) {
    await client.patch(oregon._id)
      .set({
        boundaries: {
          type: 'Feature',
          geometry: oregonData,
          properties: { source: 'US Census', fillColor: '#2E5A1C' },
        },
        centerPoint: { longitude: orCenter.longitude, latitude: orCenter.latitude, defaultZoom: 6 },
      })
      .commit();
    console.log('✓ Updated Oregon boundary');
  }

  console.log('\n✅ State boundaries updated!');
}

updateStateBoundaries().catch(console.error);
