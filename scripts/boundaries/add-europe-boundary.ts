import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'hj3ee4sp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Simplified Europe boundary (Western Europe wine regions focus)
const EUROPE_BOUNDARY = {
  type: 'Polygon',
  coordinates: [[
    [-10.0, 36.0], [-9.5, 38.0], [-9.0, 40.0], [-9.0, 42.0],
    [-8.0, 44.0], [-5.0, 44.0], [-2.0, 43.5], [0.0, 42.5],
    [3.0, 42.5], [3.5, 43.5], [6.0, 43.0], [8.0, 44.0],
    [9.5, 45.5], [13.5, 46.0], [16.0, 46.5], [17.0, 48.0],
    [15.0, 49.0], [12.5, 50.5], [9.0, 54.0], [8.0, 55.5],
    [5.0, 53.5], [4.0, 52.0], [2.5, 51.0], [1.5, 51.0],
    [-1.0, 50.5], [-4.0, 50.0], [-5.5, 50.0], [-5.5, 48.5],
    [-4.0, 48.5], [-2.0, 47.5], [-1.5, 46.5], [-1.5, 44.5],
    [-2.0, 43.5], [-7.5, 43.5], [-9.0, 42.0], [-9.5, 39.0],
    [-8.5, 37.0], [-6.0, 36.0], [-5.5, 36.0], [-10.0, 36.0]
  ]],
};

async function addEuropeBoundary() {
  console.log('Adding Europe boundary...');

  const europe = await client.fetch(
    `*[_type == "appellation" && slug.current == "europe"][0]{ _id }`
  );

  if (europe) {
    await client.patch(europe._id)
      .set({
        boundaries: {
          type: 'Feature',
          geometry: EUROPE_BOUNDARY,
          properties: { source: 'Simplified outline', fillColor: '#003399' },
        },
        centerPoint: { longitude: 5, latitude: 47, defaultZoom: 4 },
      })
      .commit();
    console.log('✓ Added boundary to Europe');
  } else {
    console.log('Europe not found');
  }
}

addEuropeBoundary().catch(console.error);
