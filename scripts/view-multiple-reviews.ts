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

async function viewReviews() {
  const reviewIds = process.argv.slice(2);

  for (const reviewId of reviewIds) {
    const review = await client.fetch(`*[_type == 'review' && _id == $id][0]{
      _id,
      score,
      shortSummary,
      tastingNotes,
      flavorProfile,
      drinkThisIf,
      foodPairings,
      drinkingWindowStart,
      drinkingWindowEnd,
      reviewerName,
      'wineName': wine->name,
      'regionName': wine->region->name
    }`, { id: reviewId });

    console.log('\n' + '='.repeat(70));
    console.log(`🍷 ${review.wineName}`);
    console.log(`📍 ${review.regionName}`);
    console.log('='.repeat(70));
    console.log(`\n📊 Score: ${review.score}/100`);
    console.log(`👤 Reviewer: ${review.reviewerName}`);
    console.log(`\n💭 ${review.shortSummary}`);
    console.log(`\n📝 ${review.tastingNotes}`);
    console.log(`\n🎨 Flavors: ${review.flavorProfile.join(', ')}`);
    console.log(`\n🍽️  Pairings: ${review.foodPairings.join(', ')}`);
    console.log(`\n🥂 Drink this if: ${review.drinkThisIf}`);
    console.log(`\n⏰ Window: ${review.drinkingWindowStart}-${review.drinkingWindowEnd}`);
  }
  console.log('\n' + '='.repeat(70) + '\n');
}

viewReviews();
