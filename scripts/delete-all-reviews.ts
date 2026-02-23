/**
 * Delete all reviews from Sanity
 * Keeps: wines, regions, producers, vineyards
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

async function deleteAllReviews() {
  console.log('\n🗑️  DELETING ALL REVIEWS FROM SANITY');
  console.log('='.repeat(70));

  // Count what we're about to delete
  const reviewCount = await client.fetch('count(*[_type == "review"])');

  console.log(`\nFound: ${reviewCount} reviews`);

  if (reviewCount === 0) {
    console.log('\n✅ No reviews to delete');
    process.exit(0);
  }

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

  console.log('\n🗑️  Deleting reviews...');
  const reviewResult = await client.delete({
    query: '*[_type == "review"]'
  });
  console.log(`  ✅ Deleted ${reviewCount} reviews`);

  // Verify
  const remainingReviews = await client.fetch('count(*[_type == "review"])');

  console.log('\n📊 VERIFICATION');
  console.log('='.repeat(70));
  console.log(`Reviews remaining: ${remainingReviews}`);

  if (remainingReviews === 0) {
    console.log('\n✅ All reviews successfully deleted!');
  } else {
    console.log(`\n⚠️  ${remainingReviews} reviews still remain`);
  }

  console.log('\n📋 What was kept:');
  const wines = await client.fetch('count(*[_type == "wine"])');
  const producers = await client.fetch('count(*[_type == "producer"])');
  const vineyards = await client.fetch('count(*[_type == "vineyard"])');
  const regions = await client.fetch('count(*[_type == "region"])');
  console.log(`  - ${wines} wines`);
  console.log(`  - ${producers} producers`);
  console.log(`  - ${vineyards} vineyards`);
  console.log(`  - ${regions} regions`);
}

deleteAllReviews().catch(console.error);
