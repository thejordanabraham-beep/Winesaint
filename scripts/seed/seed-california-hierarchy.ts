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

// Load boundary data
const CALIFORNIA_BOUNDARY = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/california_simplified.json'), 'utf-8')
);

const NAPA_VALLEY_BOUNDARY = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/napa_valley_simplified.json'), 'utf-8')
);

async function seedCaliforniaHierarchy() {
  console.log('🍇 Seeding California wine region hierarchy...\n');

  // Step 1: Create or update California region
  let californiaRegion = await client.fetch(
    `*[_type == "region" && slug.current == "california"][0]{ _id }`
  );

  if (!californiaRegion) {
    console.log('Creating California region...');
    californiaRegion = await client.create({
      _type: 'region',
      name: 'California',
      slug: { _type: 'slug', current: 'california' },
      country: 'USA',
      description: 'California is the largest wine-producing state in the United States, responsible for nearly 90% of American wine production. The state features diverse climates and terroirs, from cool coastal regions to warm inland valleys.',
    });
    console.log(`✓ Created California region (${californiaRegion._id})`);
  } else {
    console.log(`✓ California region exists (${californiaRegion._id})`);
  }

  // Step 2: Create or update Napa Valley appellation
  let napaValley = await client.fetch(
    `*[_type == "appellation" && slug.current == "napa-valley"][0]{ _id }`
  );

  if (!napaValley) {
    console.log('Creating Napa Valley appellation...');
    napaValley = await client.create({
      _type: 'appellation',
      name: 'Napa Valley',
      slug: { _type: 'slug', current: 'napa-valley' },
      parentRegion: { _type: 'reference', _ref: californiaRegion._id },
      level: 'major_ava',
      description: 'Napa Valley is one of the premier wine regions in the world, known for exceptional Cabernet Sauvignon. The valley stretches about 30 miles long and up to 5 miles wide, with diverse microclimates and 16 distinct sub-appellations.',
      establishedYear: 1981,
      totalAcreage: 45000,
      boundaries: {
        type: 'Feature',
        geometry: NAPA_VALLEY_BOUNDARY,
        properties: {
          source: 'UC Davis AVA Project',
        },
      },
      centerPoint: {
        longitude: -122.3,
        latitude: 38.45,
        defaultZoom: 10,
      },
    });
    console.log(`✓ Created Napa Valley appellation (${napaValley._id})`);
  } else {
    // Update with hierarchy fields
    await client.patch(napaValley._id)
      .set({
        parentRegion: { _type: 'reference', _ref: californiaRegion._id },
        level: 'major_ava',
        boundaries: {
          type: 'Feature',
          geometry: NAPA_VALLEY_BOUNDARY,
          properties: {
            source: 'UC Davis AVA Project',
          },
        },
        centerPoint: {
          longitude: -122.3,
          latitude: 38.45,
          defaultZoom: 10,
        },
      })
      .commit();
    console.log(`✓ Updated Napa Valley appellation (${napaValley._id})`);
  }

  // Step 3: Update Howell Mountain to reference Napa Valley as parent
  const howellMountain = await client.fetch(
    `*[_type == "appellation" && slug.current == "howell-mountain"][0]{ _id, name }`
  );

  if (howellMountain) {
    await client.patch(howellMountain._id)
      .set({
        parentAppellation: { _type: 'reference', _ref: napaValley._id },
        level: 'sub_ava',
      })
      .commit();
    console.log(`✓ Updated Howell Mountain to reference Napa Valley`);
  } else {
    console.log('⚠️  Howell Mountain not found - run seed-howell-mountain.ts first');
  }

  // Step 4: Create a California "appellation" for map navigation
  // This allows the map to show California as the top level
  let californiaAva = await client.fetch(
    `*[_type == "appellation" && slug.current == "california"][0]{ _id }`
  );

  if (!californiaAva) {
    console.log('Creating California map entry...');
    californiaAva = await client.create({
      _type: 'appellation',
      name: 'California Wine Regions',
      slug: { _type: 'slug', current: 'california' },
      parentRegion: { _type: 'reference', _ref: californiaRegion._id },
      description: 'Explore California\'s diverse wine regions, from the cool coastal appellations to the warm inland valleys.',
      boundaries: {
        type: 'Feature',
        geometry: CALIFORNIA_BOUNDARY,
        properties: {
          source: 'Natural Earth',
        },
      },
      centerPoint: {
        longitude: -119.4,
        latitude: 37.5,
        defaultZoom: 6,
      },
    });
    console.log(`✓ Created California map entry (${californiaAva._id})`);
  } else {
    await client.patch(californiaAva._id)
      .set({
        boundaries: {
          type: 'Feature',
          geometry: CALIFORNIA_BOUNDARY,
          properties: {
            source: 'Natural Earth',
          },
        },
        centerPoint: {
          longitude: -119.4,
          latitude: 37.5,
          defaultZoom: 6,
        },
      })
      .commit();
    console.log(`✓ Updated California map entry (${californiaAva._id})`);
  }

  console.log('\n✅ Hierarchy seeding complete!');
  console.log('\nHierarchy structure:');
  console.log('  California (Region)');
  console.log('    └── California Wine Regions (appellation for map)');
  console.log('    └── Napa Valley (major_ava)');
  console.log('          └── Howell Mountain (sub_ava)');
  console.log('                └── 89 vineyard parcels');
  console.log('\n📍 View: http://localhost:3000/maps');
}

seedCaliforniaHierarchy().catch(console.error);
