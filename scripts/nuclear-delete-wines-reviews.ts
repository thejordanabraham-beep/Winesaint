/**
 * Nuclear delete: Remove all references, then delete wines and reviews
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function nuclearDelete() {
  console.log('\n💣 NUCLEAR DELETE: WINES AND REVIEWS');
  console.log('='.repeat(70));

  // Count what we're dealing with
  const wineCount = await client.fetch('count(*[_type == "wine"])');
  const reviewCount = await client.fetch('count(*[_type == "review"])');

  console.log(`\nFound:`);
  console.log(`  - ${wineCount} wines`);
  console.log(`  - ${reviewCount} reviews`);

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answer = await new Promise<string>((resolve) => {
    readline.question('\nType "NUCLEAR" to proceed: ', resolve);
  });
  readline.close();

  if (answer !== 'NUCLEAR') {
    console.log('\n❌ Cancelled');
    process.exit(0);
  }

  // Step 1: Remove all references from wines
  console.log('\n🔧 Step 1: Removing all references from wine documents...');
  const wines = await client.fetch('*[_type == "wine"]{_id}');
  
  let processed = 0;
  for (const wine of wines) {
    await client
      .patch(wine._id)
      .unset([
        'reviews',
        'grapes',
        'producer',
        'region',
        'vineyard',
        'appellation',
        'subRegion',
        'village'
      ])
      .commit();
    
    processed++;
    if (processed % 100 === 0) {
      console.log(`  Processed ${processed}/${wines.length} wines...`);
    }
  }
  console.log(`  ✅ Removed references from ${wines.length} wines`);

  // Step 2: Delete all wines in batches
  console.log('\n🗑️  Step 2: Deleting all wines...');
  let deletedWines = 0;
  
  while (true) {
    const batch = await client.fetch('*[_type == "wine"][0...100]{_id}');
    if (batch.length === 0) break;
    
    const transaction = client.transaction();
    batch.forEach((doc: any) => transaction.delete(doc._id));
    await transaction.commit();
    
    deletedWines += batch.length;
    console.log(`  Deleted ${deletedWines} wines...`);
  }
  console.log(`  ✅ Deleted all wines`);

  // Step 3: Delete all reviews in batches
  console.log('\n🗑️  Step 3: Deleting all reviews...');
  let deletedReviews = 0;
  
  while (true) {
    const batch = await client.fetch('*[_type == "review"][0...100]{_id}');
    if (batch.length === 0) break;
    
    const transaction = client.transaction();
    batch.forEach((doc: any) => transaction.delete(doc._id));
    await transaction.commit();
    
    deletedReviews += batch.length;
    console.log(`  Deleted ${deletedReviews} reviews...`);
  }
  console.log(`  ✅ Deleted all reviews`);

  // Verify
  const remainingWines = await client.fetch('count(*[_type == "wine"])');
  const remainingReviews = await client.fetch('count(*[_type == "review"])');

  console.log('\n📊 VERIFICATION');
  console.log('='.repeat(70));
  console.log(`Wines remaining: ${remainingWines}`);
  console.log(`Reviews remaining: ${remainingReviews}`);

  if (remainingWines === 0 && remainingReviews === 0) {
    console.log('\n✅ ALL WINES AND REVIEWS DELETED!');
  } else {
    console.log('\n⚠️  Some documents may remain');
  }

  // Show what's left
  const producers = await client.fetch('count(*[_type == "producer"])');
  const vineyards = await client.fetch('count(*[_type == "vineyard"])');
  const regions = await client.fetch('count(*[_type == "region"])');
  
  console.log('\n📋 What was kept:');
  console.log(`  - ${producers} producers`);
  console.log(`  - ${vineyards} vineyards`);
  console.log(`  - ${regions} regions`);
  
  console.log('\n🎉 Done! Sanity document usage should drop significantly.');
}

nuclearDelete().catch(console.error);
