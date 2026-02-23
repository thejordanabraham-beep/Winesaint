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

async function linkReviewsToWines() {
  console.log('\n🔗 LINKING REVIEWS TO WINES');
  console.log('='.repeat(70));

  // Fetch all reviews with their wine references
  const reviews = await client.fetch(`
    *[_type == 'review' && defined(wine._ref)] {
      _id,
      'wineId': wine._ref
    }
  `);

  console.log(`\nFound ${reviews.length} reviews to link\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i];

    if ((i + 1) % 100 === 0 || i === 0) {
      console.log(`[${i + 1}/${reviews.length}] Linking reviews...`);
    }

    try {
      // Update the wine document to reference this review
      await client
        .patch(review.wineId)
        .set({
          review: {
            _type: 'reference',
            _ref: review._id
          }
        })
        .commit();

      successCount++;
    } catch (error: any) {
      console.log(`   ❌ Error linking review ${review._id} to wine ${review.wineId}: ${error.message}`);
      errorCount++;
    }

    // Small delay to avoid rate limits
    if (i < reviews.length - 1 && i % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 LINKING COMPLETE');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log('='.repeat(70) + '\n');

  // Verify the results
  const winesWithReviews = await client.fetch(`count(*[_type == 'wine' && defined(review._ref)])`);
  console.log(`\n✅ Verification: ${winesWithReviews} wines now have reviews\n`);
}

linkReviewsToWines();
