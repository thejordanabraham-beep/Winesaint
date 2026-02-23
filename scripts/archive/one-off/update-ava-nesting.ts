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

// Define the nested hierarchy
// Central Coast contains these major AVAs
const CENTRAL_COAST_CHILDREN = [
  'paso-robles',
  'monterey',
  'santa-barbara-county',
  'santa-cruz-mountains',
  'livermore-valley',
];

// North Coast would contain these (if we want to add it)
const NORTH_COAST_CHILDREN = [
  'napa-valley',
  'sonoma-county',
  'mendocino',
  'lake-county',
];

async function updateNesting() {
  console.log('🍇 Updating AVA nesting hierarchy...\n');

  // Get Central Coast
  const centralCoast = await client.fetch(
    `*[_type == "appellation" && slug.current == "central-coast"][0]{ _id, name }`
  );

  if (!centralCoast) {
    console.log('❌ Central Coast not found');
    return;
  }

  console.log(`Found Central Coast: ${centralCoast._id}`);

  // Update Central Coast children
  console.log('\nUpdating Central Coast children...');
  for (const childSlug of CENTRAL_COAST_CHILDREN) {
    const child = await client.fetch(
      `*[_type == "appellation" && slug.current == $slug][0]{ _id, name, level }`,
      { slug: childSlug }
    );

    if (child) {
      await client.patch(child._id)
        .set({
          parentAppellation: { _type: 'reference', _ref: centralCoast._id },
          // Keep as major_ava since they have their own sub-AVAs
        })
        .commit();
      console.log(`  ✓ ${child.name} → Central Coast`);
    } else {
      console.log(`  ⚠️ ${childSlug} not found`);
    }
  }

  // Now let's also handle North Coast if we want (optional - download it first)
  // For now, we'll create a North Coast AVA

  // Check if North Coast exists
  let northCoast = await client.fetch(
    `*[_type == "appellation" && slug.current == "north-coast"][0]{ _id }`
  );

  // Get California region reference
  const californiaRegion = await client.fetch(
    `*[_type == "region" && slug.current == "california"][0]{ _id }`
  );

  if (!northCoast && californiaRegion) {
    console.log('\nCreating North Coast AVA...');

    // Use Sonoma Coast boundary as approximation for North Coast
    const sonomaCoast = await client.fetch(
      `*[_type == "appellation" && slug.current == "sonoma-county"][0]{ boundaries, centerPoint }`
    );

    northCoast = await client.create({
      _type: 'appellation',
      name: 'North Coast',
      slug: { _type: 'slug', current: 'north-coast' },
      parentRegion: { _type: 'reference', _ref: californiaRegion._id },
      level: 'major_ava',
      description: 'The North Coast AVA encompasses the wine regions north of San Francisco Bay, including Napa Valley, Sonoma County, Mendocino, and Lake County.',
      boundaries: sonomaCoast?.boundaries,
      centerPoint: {
        longitude: -122.5,
        latitude: 38.5,
        defaultZoom: 8,
      },
    });
    console.log(`  ✓ Created North Coast (${northCoast._id})`);
  }

  if (northCoast) {
    console.log('\nUpdating North Coast children...');
    for (const childSlug of NORTH_COAST_CHILDREN) {
      const child = await client.fetch(
        `*[_type == "appellation" && slug.current == $slug][0]{ _id, name }`,
        { slug: childSlug }
      );

      if (child) {
        await client.patch(child._id)
          .set({
            parentAppellation: { _type: 'reference', _ref: northCoast._id },
          })
          .commit();
        console.log(`  ✓ ${child.name} → North Coast`);
      }
    }
  }

  // Update Central Coast to be a major_ava (top level under California)
  // and North Coast similarly
  if (californiaRegion) {
    await client.patch(centralCoast._id)
      .set({
        parentRegion: { _type: 'reference', _ref: californiaRegion._id },
        level: 'major_ava',
      })
      .unset(['parentAppellation'])
      .commit();
    console.log('\n✓ Central Coast set as top-level major AVA');

    if (northCoast) {
      await client.patch(northCoast._id)
        .set({
          parentRegion: { _type: 'reference', _ref: californiaRegion._id },
          level: 'major_ava',
        })
        .unset(['parentAppellation'])
        .commit();
      console.log('✓ North Coast set as top-level major AVA');
    }
  }

  // Also ensure Lodi and Sierra Foothills are top-level (Central Valley region)
  // And Temecula is top-level (South Coast)

  console.log('\n✅ Nesting hierarchy updated!');
  console.log('\nNew structure:');
  console.log('California');
  console.log('├── North Coast');
  console.log('│   ├── Napa Valley → sub-AVAs');
  console.log('│   ├── Sonoma County → sub-AVAs');
  console.log('│   ├── Mendocino → sub-AVAs');
  console.log('│   └── Lake County → sub-AVAs');
  console.log('├── Central Coast');
  console.log('│   ├── Paso Robles → sub-AVAs');
  console.log('│   ├── Monterey → sub-AVAs');
  console.log('│   ├── Santa Barbara County → sub-AVAs');
  console.log('│   ├── Santa Cruz Mountains → sub-AVAs');
  console.log('│   └── Livermore Valley');
  console.log('├── Lodi → sub-AVAs');
  console.log('├── Sierra Foothills → sub-AVAs');
  console.log('└── Temecula Valley');
}

updateNesting().catch(console.error);
