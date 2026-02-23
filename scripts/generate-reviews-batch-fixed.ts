/**
 * FIXED BATCH REVIEW GENERATOR
 *
 * Improvements:
 * 1. Uses the fixed generation system with duplicate checking
 * 2. Verifies after each batch
 * 3. Shows cost estimates
 * 4. Better error handling
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { generateReview } from './wine-saint-unified-system-fixed';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function generateBatchReviews(limit?: number) {
  console.log('\n🍷 WINE SAINT BATCH REVIEW GENERATOR (FIXED)');
  console.log('='.repeat(70));
  console.log('Using: wine-saint-unified-system-fixed.ts');
  console.log('='.repeat(70));

  // Fetch wines without reviews (checking the review field properly)
  const wines = await client.fetch(`
    *[_type == 'wine' && !defined(review._ref)] {
      _id,
      name,
      'regionName': region->name
    } | order(name asc) ${limit ? `[0..${limit - 1}]` : ''}
  `);

  console.log(`\nFound ${wines.length} wines without reviews`);

  if (wines.length === 0) {
    console.log('✅ All wines already have reviews!\n');
    return;
  }

  // Estimate cost (rough: ~$0.01 per review)
  const estimatedCost = (wines.length * 0.01).toFixed(2);
  console.log(`💰 Estimated cost: ~$${estimatedCost}\n`);

  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < wines.length; i++) {
    const wine = wines[i];
    console.log(`\n[${i + 1}/${wines.length}] Processing: ${wine.name}`);
    console.log(`   Region: ${wine.regionName}`);

    try {
      const result = await generateReview(wine._id);

      if (result === null) {
        // Wine was skipped (already has review)
        skippedCount++;
      } else {
        successCount++;
      }
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
      errorCount++;

      // If it's an API credit error, stop immediately
      if (error.message && error.message.includes('credit balance')) {
        console.log('\n🛑 API credit limit reached. Stopping batch.\n');
        break;
      }
    }

    // Small delay to avoid rate limits
    if (i < wines.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 BATCH COMPLETE');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ⏭️  Skipped: ${skippedCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log('='.repeat(70) + '\n');

  // Verify results
  const stats = await client.fetch(`{
    'totalWines': count(*[_type == 'wine']),
    'winesWithReviews': count(*[_type == 'wine' && defined(review._ref)]),
    'totalReviews': count(*[_type == 'review'])
  }`);

  console.log('📊 Current Database Stats:');
  console.log(`   Total wines: ${stats.totalWines}`);
  console.log(`   Wines with reviews: ${stats.winesWithReviews} (${Math.round(stats.winesWithReviews/stats.totalWines*100)}%)`);
  console.log(`   Total reviews: ${stats.totalReviews}`);
  console.log(`   Remaining: ${stats.totalWines - stats.winesWithReviews}\n`);
}

if (require.main === module) {
  const arg = process.argv[2];

  if (!arg) {
    console.log('Usage: npx tsx scripts/generate-reviews-batch-fixed.ts <limit|all>');
    console.log('Example: npx tsx scripts/generate-reviews-batch-fixed.ts 10');
    console.log('Example: npx tsx scripts/generate-reviews-batch-fixed.ts 100');
    process.exit(1);
  }

  const limit = arg === 'all' ? undefined : parseInt(arg);

  if (arg !== 'all' && isNaN(limit!)) {
    console.log('Error: limit must be a number or "all"');
    process.exit(1);
  }

  generateBatchReviews(limit);
}
