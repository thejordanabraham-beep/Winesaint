/**
 * Delete all wines and reviews from Sanity
 * Keeps: regions, producers, vineyards
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

async function deleteAllWinesAndReviews() {
  console.log('\n🗑️  DELETING ALL WINES AND REVIEWS FROM SANITY');
  console.log('='.repeat(70));

  // Count what we're about to delete
  const wineCount = await client.fetch('count(*[_type == "wine"])');
  const reviewCount = await client.fetch('count(*[_type == "review"])');

  console.log(`\nFound:`);
  console.log(`  - ${wineCount} wines`);
  console.log(`  - ${reviewCount} reviews`);
  console.log(`\nTotal to delete: ${wineCount + reviewCount} documents`);

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answer = await new Promise<string>((resolve) => {
    readline.question('\nAre you sure? Type "DELETE" to confirm: ', resolve);
  });
  readline.close();

  if (answer !== 'DELETE') {
    console.log('\n❌ Cancelled');
    process.exit(0);
  }

  console.log('\n🗑️  Deleting wines first (to remove references to reviews)...');
  const wineResult = await client.delete({
    query: '*[_type == "wine"]'
  });
  console.log(`  ✅ Deleted ${wineCount} wines`);

  console.log('\n🗑️  Deleting reviews...');
  const reviewResult = await client.delete({
    query: '*[_type == "review"]'
  });
  console.log(`  ✅ Deleted ${reviewCount} reviews`);

  // Verify
  const remainingWines = await client.fetch('count(*[_type == "wine"])');
  const remainingReviews = await client.fetch('count(*[_type == "review"])');

  console.log('\n📊 VERIFICATION');
  console.log('='.repeat(70));
  console.log(`Wines remaining: ${remainingWines}`);
  console.log(`Reviews remaining: ${remainingReviews}`);

  if (remainingWines === 0 && remainingReviews === 0) {
    console.log('\n✅ All wines and reviews successfully deleted!');
  } else {
    console.log('\n⚠️  Some documents may remain');
  }

  console.log('\n📋 What was kept:');
  const producers = await client.fetch('count(*[_type == "producer"])');
  const vineyards = await client.fetch('count(*[_type == "vineyard"])');
  const regions = await client.fetch('count(*[_type == "region"])');
  console.log(`  - ${producers} producers`);
  console.log(`  - ${vineyards} vineyards`);
  console.log(`  - ${regions} regions`);
}

deleteAllWinesAndReviews().catch(console.error);
