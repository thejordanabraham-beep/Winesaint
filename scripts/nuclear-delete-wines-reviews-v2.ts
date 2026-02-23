/**
 * Nuclear delete v2: More robust with retries and batch operations
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

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function deleteWithRetry(fn: () => Promise<any>, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (i === retries - 1) throw error;
      console.log(`  ⚠️  Error (retrying ${i + 1}/${retries}): ${error.message}`);
      await sleep(2000 * (i + 1)); // Exponential backoff
    }
  }
}

async function nuclearDeleteV2() {
  console.log('\n💣 NUCLEAR DELETE V2: WINES AND REVIEWS');
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

  // Step 1: Delete reviews first (they reference wines)
  console.log('\n🗑️  Step 1: Deleting all reviews in batches...');
  let deletedReviews = 0;

  while (true) {
    const batch = await deleteWithRetry(() =>
      client.fetch('*[_type == "review"][0...100]{_id}')
    );

    if (batch.length === 0) break;

    await deleteWithRetry(async () => {
      const transaction = client.transaction();
      batch.forEach((doc: any) => transaction.delete(doc._id));
      await transaction.commit();
    });

    deletedReviews += batch.length;
    console.log(`  Deleted ${deletedReviews} reviews...`);
    await sleep(100); // Small delay between batches
  }
  console.log(`  ✅ Deleted all reviews`);

  // Step 2: Remove references from wines in batches
  console.log('\n🔧 Step 2: Removing references from wines in batches...');
  let processedWines = 0;

  while (true) {
    const batch = await deleteWithRetry(() =>
      client.fetch('*[_type == "wine"][0...50]{_id}')
    );

    if (batch.length === 0) break;

    await deleteWithRetry(async () => {
      const transaction = client.transaction();
      batch.forEach((doc: any) => {
        transaction.patch(doc._id, patch =>
          patch.unset([
            'reviews',
            'grapes',
            'producer',
            'region',
            'vineyard',
            'appellation',
            'subRegion',
            'village'
          ])
        );
      });
      await transaction.commit();
    });

    processedWines += batch.length;
    console.log(`  Processed ${processedWines} wines...`);
    await sleep(100);
  }
  console.log(`  ✅ Removed references from all wines`);

  // Step 3: Delete all wines in batches
  console.log('\n🗑️  Step 3: Deleting all wines...');
  let deletedWines = 0;

  while (true) {
    const batch = await deleteWithRetry(() =>
      client.fetch('*[_type == "wine"][0...100]{_id}')
    );

    if (batch.length === 0) break;

    await deleteWithRetry(async () => {
      const transaction = client.transaction();
      batch.forEach((doc: any) => transaction.delete(doc._id));
      await transaction.commit();
    });

    deletedWines += batch.length;
    console.log(`  Deleted ${deletedWines} wines...`);
    await sleep(100);
  }
  console.log(`  ✅ Deleted all wines`);

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

  console.log('\n🎉 Done!');
}

nuclearDeleteV2().catch(console.error);
