import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function addVineyard() {
  console.log('🍇 ADDING CLOS DES VAROILLES VINEYARD');
  console.log('='.repeat(70));

  // Find the wine
  const wine = await client.fetch(`*[_type == 'wine' && name match '*Clos des Varoilles*'][0]{
    _id,
    name,
    'regionName': region->name,
    'vineyardName': vineyard->name
  }`);

  if (!wine) {
    console.log('❌ Wine not found');
    return;
  }

  console.log(`\nFound: ${wine.name}`);
  console.log(`Current vineyard: ${wine.vineyardName || 'NONE'}`);

  // Check if Clos des Varoilles vineyard exists
  let vineyard = await client.fetch(`*[_type == 'vineyard' && name == 'Clos des Varoilles'][0]`);

  if (!vineyard) {
    console.log('\n✨ Creating Clos des Varoilles vineyard...');
    vineyard = await client.create({
      _type: 'vineyard',
      name: 'Clos des Varoilles',
      region: wine.regionName || 'France - Burgundy - Gevrey Chambertin',
      slug: {
        current: 'clos-des-varoilles'
      },
    });
    console.log(`Created: ${vineyard._id}`);
  } else {
    console.log(`\nVineyard exists: ${vineyard._id}`);
  }

  // Update the wine
  console.log('\n📝 Updating wine...');
  await client.patch(wine._id).set({
    vineyard: { _type: 'reference', _ref: vineyard._id }
  }).commit();

  console.log('✅ DONE - Wine now has Clos des Varoilles vineyard');
}

addVineyard();
