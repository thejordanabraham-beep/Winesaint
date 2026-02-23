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

async function fixDuplicates() {
  console.log('\n🔧 FIXING DUPLICATE REVIEWS');
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

  let updatedWines = 0;
  let deletedReviews = 0;

  for (const [wineId, wineReviews] of duplicates) {
    // Keep the most recent review (first in array since sorted by date desc)
    const toKeep = wineReviews[0];
    const toDelete = wineReviews.slice(1);

    console.log(`Wine ${wineId}: keeping 1, removing ${toDelete.length} duplicates`);

    try {
      // Step 1: Update wine to reference the latest review
      await client
        .patch(wineId)
        .set({
          review: {
            _type: 'reference',
            _ref: toKeep._id
          }
        })
        .commit();
      updatedWines++;

      // Step 2: Delete the older reviews
      for (const review of toDelete) {
        try {
          await client.delete(review._id);
          deletedReviews++;
        } catch (error: any) {
          console.log(`   ❌ Error deleting review ${review._id}: ${error.message}`);
        }
      }
    } catch (error: any) {
      console.log(`   ❌ Error updating wine ${wineId}: ${error.message}`);
    }

    // Small delay to avoid rate limits
    if (updatedWines % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 CLEANUP COMPLETE');
  console.log(`   🔧 Wines updated: ${updatedWines}`);
  console.log(`   🗑️  Reviews deleted: ${deletedReviews}`);
  console.log('='.repeat(70) + '\n');

  // Final verification
  const finalStats = await client.fetch(`{
    'totalWines': count(*[_type == 'wine']),
    'winesWithReviews': count(*[_type == 'wine' && defined(review._ref)]),
    'totalReviews': count(*[_type == 'review'])
  }`);

  console.log('📊 Final Statistics:');
  console.log(`   Total wines: ${finalStats.totalWines}`);
  console.log(`   Wines with reviews: ${finalStats.winesWithReviews}`);
  console.log(`   Total reviews: ${finalStats.totalReviews}`);
  console.log(`   Wines needing reviews: ${finalStats.totalWines - finalStats.winesWithReviews}\n`);
}

fixDuplicates();
