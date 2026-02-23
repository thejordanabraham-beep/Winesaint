/**
 * BATCH REVIEW GENERATOR
 *
 * Generates Wine Saint reviews for multiple wines.
 * Uses the permanent default wine-saint-unified-system.ts
 *
 * Usage:
 *   npx tsx scripts/generate-reviews-batch.ts <limit>
 *
 * Example:
 *   npx tsx scripts/generate-reviews-batch.ts 10    # Generate 10 reviews
 *   npx tsx scripts/generate-reviews-batch.ts all   # Generate for all wines without reviews
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { generateReview } from './wine-saint-unified-system';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function generateBatchReviews(limit?: number) {
  console.log('\n🍷 WINE SAINT BATCH REVIEW GENERATOR');
  console.log('='.repeat(70));
  console.log('Using: wine-saint-unified-system.ts (permanent default)');
  console.log('='.repeat(70));

  // Fetch wines without reviews
  const wines = await client.fetch(`
    *[_type == 'wine' && !defined(*[_type == 'review' && wine._ref == ^._id][0]._id)] {
      _id,
      name,
      'regionName': region->name
    } | order(name asc) ${limit ? `[0..${limit - 1}]` : ''}
  `);

  console.log(`\nFound ${wines.length} wines without reviews\n`);

  if (wines.length === 0) {
    console.log('✅ All wines already have reviews!\n');
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < wines.length; i++) {
    const wine = wines[i];
    console.log(`\n[${ i + 1}/${wines.length}] Processing: ${wine.name}`);
    console.log(`   Region: ${wine.regionName}`);

    try {
      await generateReview(wine._id);
      successCount++;
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
      errorCount++;
    }

    // Small delay to avoid rate limits
    if (i < wines.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 BATCH COMPLETE');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log('='.repeat(70) + '\n');
}

// CLI usage
if (require.main === module) {
  const arg = process.argv[2];

  if (!arg) {
    console.log('Usage: npx tsx scripts/generate-reviews-batch.ts <limit|all>');
    console.log('Example: npx tsx scripts/generate-reviews-batch.ts 10');
    console.log('Example: npx tsx scripts/generate-reviews-batch.ts all');
    process.exit(1);
  }

  const limit = arg === 'all' ? undefined : parseInt(arg);

  if (arg !== 'all' && isNaN(limit!)) {
    console.log('Error: limit must be a number or "all"');
    process.exit(1);
  }

  generateBatchReviews(limit);
}
