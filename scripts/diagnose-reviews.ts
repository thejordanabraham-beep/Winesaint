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

async function diagnoseReviews() {
  console.log('\n🔍 DIAGNOSING REVIEW LINKAGE ISSUE\n');

  // Check a sample review
  const sampleReviews = await client.fetch(`
    *[_type == 'review'][0...3] {
      _id,
      wine,
      score,
      reviewText
    }
  `);

  console.log('📄 Sample Reviews:');
  console.log(JSON.stringify(sampleReviews, null, 2));

  // Check if wines have review references
  const winesWithReviewRef = await client.fetch(`
    *[_type == 'wine' && defined(review)][0...3] {
      _id,
      name,
      review
    }
  `);

  console.log('\n🍷 Sample Wines with review field:');
  console.log(JSON.stringify(winesWithReviewRef, null, 2));

  // Count wines by review field status
  const winesWithReview = await client.fetch(`count(*[_type == 'wine' && defined(review._ref)])`);
  const winesWithReviewField = await client.fetch(`count(*[_type == 'wine' && defined(review)])`);

  console.log('\n📊 Wine Review Field Stats:');
  console.log(`Wines with review._ref: ${winesWithReview}`);
  console.log(`Wines with any review field: ${winesWithReviewField}`);
}

diagnoseReviews();
