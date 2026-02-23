/**
 * Migration Script: Convert aiReview fields to review documents
 *
 * Finds all wines with aiReview but no review document, and creates review docs
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const BATCH_SIZE = 50;
const DELAY_MS = 1000;

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  console.log('🔄 AI REVIEW TO REVIEW DOCUMENT MIGRATION');
  console.log('='.repeat(70));
  console.log(`Mode: ${dryRun ? 'DRY RUN (no changes)' : 'LIVE MIGRATION'}\n`);

  // Find wines with aiReview but no review document
  const winesNeedingReviews = await sanityClient.fetch(`
    *[_type == "wine" && defined(aiReview)] {
      _id,
      name,
      vintage,
      aiReview,
      hasAiReview,
      "reviewCount": count(*[_type == "review" && wine._ref == ^._id])
    }[reviewCount == 0]
  `);

  console.log(`Found ${winesNeedingReviews.length} wines with aiReview but no review document\n`);

  if (winesNeedingReviews.length === 0) {
    console.log('✅ No migration needed!');
    return;
  }

  if (dryRun) {
    console.log('DRY RUN - Sample wines that would be migrated:');
    winesNeedingReviews.slice(0, 10).forEach((wine: any, i: number) => {
      console.log(`  ${i + 1}. ${wine.name} ${wine.vintage || 'NV'}`);
      console.log(`     Review length: ${wine.aiReview?.length || 0} chars\n`);
    });
    console.log(`\nRun without --dry-run to create ${winesNeedingReviews.length} review documents`);
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < winesNeedingReviews.length; i += BATCH_SIZE) {
    const batch = winesNeedingReviews.slice(i, Math.min(i + BATCH_SIZE, winesNeedingReviews.length));
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(winesNeedingReviews.length / BATCH_SIZE);

    console.log(`\n📦 BATCH ${batchNum}/${totalBatches} (${batch.length} wines)`);
    console.log('='.repeat(70));

    for (const wine of batch) {
      const wineNum = i + batch.indexOf(wine) + 1;
      console.log(`[${wineNum}/${winesNeedingReviews.length}] ${wine.name} ${wine.vintage || 'NV'}`);

      try {
        // Create review document
        const reviewDoc = {
          _type: 'review',
          wine: {
            _type: 'reference',
            _ref: wine._id
          },
          score: 7.5, // Default score - can be updated later
          tastingNotes: wine.aiReview,
          reviewerName: 'WineSaint AI',
          reviewDate: new Date().toISOString(),
          isAiGenerated: true
        };

        const result = await sanityClient.create(reviewDoc);
        console.log(`  ✅ Created review: ${result._id}`);
        successCount++;

      } catch (error: any) {
        console.error(`  ❌ Error: ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n  Batch complete: ${successCount} created, ${errorCount} errors`);

    // Delay between batches
    if (i + BATCH_SIZE < winesNeedingReviews.length) {
      console.log(`  ⏳ Waiting ${DELAY_MS}ms...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 MIGRATION SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Reviews created: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`\nTotal review documents now: ${await sanityClient.fetch('count(*[_type == "review"])')}`);
}

main()
  .then(() => {
    console.log('\n✅ Migration complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
