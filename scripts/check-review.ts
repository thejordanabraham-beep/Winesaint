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

async function checkReview() {
  const reviewId = process.argv[2];

  const review = await client.fetch(`*[_type == 'review' && _id == $id][0]{
    score,
    shortSummary,
    tastingNotes,
    flavorProfile,
    drinkThisIf,
    foodPairings,
    drinkingWindowStart,
    drinkingWindowEnd,
    reviewerName,
    reviewDate,
    isAiGenerated
  }`, { id: reviewId });

  console.log('\n🍷 WINE SAINT REVIEW DETAILS');
  console.log('='.repeat(70));
  console.log(`\n📊 Score: ${review.score}/100`);
  console.log(`\n👤 Reviewer: ${review.reviewerName}`);
  console.log(`📅 Review Date: ${review.reviewDate} (not displayed to users)`);
  console.log(`🤖 AI Generated: ${review.isAiGenerated}`);
  console.log(`\n💭 Short Summary:\n${review.shortSummary}`);
  console.log(`\n📝 Tasting Notes:\n${review.tastingNotes}`);
  console.log(`\n🎨 Flavor Profile:\n${review.flavorProfile.join(', ')}`);
  console.log(`\n🍽️  Food Pairings:\n${review.foodPairings.join(', ')}`);
  console.log(`\n🥂 Drink This If:\n${review.drinkThisIf}`);
  console.log(`\n⏰ Drinking Window:\n${review.drinkingWindowStart} - ${review.drinkingWindowEnd}`);
  console.log('\n' + '='.repeat(70));
}

checkReview();
