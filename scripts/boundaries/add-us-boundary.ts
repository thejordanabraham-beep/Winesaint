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

// Simplified US continental boundary
const US_BOUNDARY = {
  type: 'Polygon',
  coordinates: [[
    [-124.7, 48.4], [-123.0, 48.4], [-117.0, 49.0], [-104.0, 49.0],
    [-100.0, 49.0], [-95.2, 49.0], [-89.0, 47.3], [-84.8, 46.0],
    [-82.5, 41.7], [-79.8, 42.5], [-75.0, 45.0], [-70.0, 45.5],
    [-67.0, 44.8], [-67.0, 41.0], [-71.0, 41.5], [-74.0, 39.5],
    [-75.5, 35.2], [-81.0, 31.0], [-81.5, 25.0], [-80.0, 25.0],
    [-83.0, 29.0], [-88.0, 30.0], [-89.5, 29.0], [-94.0, 29.5],
    [-97.0, 26.0], [-99.5, 26.5], [-104.0, 29.5], [-107.0, 31.8],
    [-111.0, 31.3], [-114.5, 32.7], [-117.0, 32.5], [-118.4, 34.0],
    [-120.5, 34.5], [-121.0, 36.5], [-122.4, 37.8], [-124.0, 40.0],
    [-124.5, 42.0], [-124.7, 48.4]
  ]],
};

async function addUSBoundary() {
  console.log('Adding United States boundary...');

  const us = await client.fetch(
    `*[_type == "appellation" && slug.current == "united-states"][0]{ _id }`
  );

  if (us) {
    await client.patch(us._id)
      .set({
        boundaries: {
          type: 'Feature',
          geometry: US_BOUNDARY,
          properties: { source: 'Simplified outline', fillColor: '#1e3a5f' },
        },
        centerPoint: { longitude: -98.5, latitude: 39.8, defaultZoom: 4 },
      })
      .commit();
    console.log('✓ Added boundary to United States');
  } else {
    console.log('United States not found');
  }
}

addUSBoundary().catch(console.error);
