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

async function deleteDuplicates() {
  console.log('\n🗑️  DELETING DUPLICATE REVIEWS');
  console.log('='.repeat(70));

  // Fetch all reviews grouped by wine
  const reviews = await client.fetch(`
    *[_type == 'review'] | order(reviewDate desc) {
      _id,
      'wineId': wine._ref,
      reviewDate
    }
  `);

  console.log(`\nFound ${reviews.length} total reviews\n`);

  // Group by wine ID
  const reviewsByWine: Record<string, any[]> = {};
  reviews.forEach((review: any) => {
    if (!reviewsByWine[review.wineId]) {
      reviewsByWine[review.wineId] = [];
    }
    reviewsByWine[review.wineId].push(review);
  });

  // Find duplicates (wines with more than 1 review)
  const duplicates = Object.entries(reviewsByWine)
    .filter(([_, reviews]) => reviews.length > 1);

  console.log(`Found ${duplicates.length} wines with duplicate reviews\n`);

  let deletedCount = 0;

  for (const [wineId, wineReviews] of duplicates) {
    // Keep the most recent review (first in array since sorted by date desc)
    const toKeep = wineReviews[0];
    const toDelete = wineReviews.slice(1);

    console.log(`Wine ${wineId}: keeping 1, deleting ${toDelete.length} duplicates`);

    // Delete the older reviews
    for (const review of toDelete) {
      try {
        await client.delete(review._id);
        deletedCount++;
      } catch (error: any) {
        console.log(`   ❌ Error deleting review ${review._id}: ${error.message}`);
      }
    }

    // Small delay to avoid rate limits
    if (deletedCount % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 CLEANUP COMPLETE');
  console.log(`   🗑️  Deleted: ${deletedCount} duplicate reviews`);
  console.log(`   ✅ Kept: ${Object.keys(reviewsByWine).length} unique reviews`);
  console.log('='.repeat(70) + '\n');
}

deleteDuplicates();
