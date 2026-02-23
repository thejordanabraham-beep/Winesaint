/**
 * Nuclear delete FINAL: Proper order - remove wine->review refs first
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
      console.log(`  ⚠️  Error (retrying ${i + 1}/${retries}): ${error.message.substring(0, 100)}...`);
      await sleep(2000 * (i + 1));
    }
  }
}

async function nuclearDeleteFinal() {
  console.log('\n💣 NUCLEAR DELETE: WINES AND REVIEWS');
  console.log('='.repeat(70));

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

  // Step 1: Remove 'review' references from ALL wines (singular field)
  console.log('\n🔧 Step 1: Removing review references from wines...');
  let processedWines = 0;

  while (true) {
    const batch = await deleteWithRetry(() =>
      client.fetch('*[_type == "wine" && defined(review)][0...50]{_id}')
    );

    if (batch.length === 0) break;

    await deleteWithRetry(async () => {
      const transaction = client.transaction();
      batch.forEach((doc: any) => {
        transaction.patch(doc._id, patch => patch.unset(['review']));
      });
      await transaction.commit();
    });

    processedWines += batch.length;
    console.log(`  Processed ${processedWines} wines...`);
    await sleep(50);
  }
  console.log(`  ✅ Removed review references from wines`);

  // Step 2: Delete all reviews
  console.log('\n🗑️  Step 2: Deleting all reviews...');
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
    await sleep(50);
  }
  console.log(`  ✅ Deleted all reviews`);

  // Step 3: Delete all wines
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
    await sleep(50);
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

  console.log('\n🎉 Done! Ready for fresh import.');
}

nuclearDeleteFinal().catch(console.error);
