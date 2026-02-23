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

async function standardizeReviewerNames() {
  console.log('🔄 STANDARDIZING REVIEWER NAMES TO "WINE SAINT"');
  console.log('='.repeat(70));

  // Get all reviews
  const reviews = await client.fetch(`*[_type == 'review']{
    _id,
    reviewerName
  }`);

  console.log(`\nFound ${reviews.length} total reviews\n`);

  const reviewerCounts: Record<string, number> = {};
  reviews.forEach((r: any) => {
    reviewerCounts[r.reviewerName] = (reviewerCounts[r.reviewerName] || 0) + 1;
  });

  console.log('Current reviewer breakdown:');
  Object.entries(reviewerCounts).forEach(([name, count]) => {
    console.log(`  ${name}: ${count} reviews`);
  });

  // Update all non-Wine Saint reviews
  const toUpdate = reviews.filter((r: any) => r.reviewerName !== 'Wine Saint');

  if (toUpdate.length === 0) {
    console.log('\n✅ All reviews already use "Wine Saint"');
    return;
  }

  console.log(`\n📝 Updating ${toUpdate.length} reviews to "Wine Saint"...\n`);

  for (const review of toUpdate) {
    await client.patch(review._id).set({
      reviewerName: 'Wine Saint'
    }).commit();
  }

  console.log('\n✅ COMPLETE - All reviews now use "Wine Saint"');
}

standardizeReviewerNames();
