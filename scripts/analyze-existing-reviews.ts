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

async function main() {
  console.log('🔍 ANALYZING EXISTING REVIEWS');
  console.log('='.repeat(70));

  // Sample existing reviews to understand their source
  const sampleReviews = await sanityClient.fetch(`
    *[_type == "review"][0...10] {
      _id,
      reviewerName,
      isAiGenerated,
      score,
      reviewDate,
      "noteLength": length(tastingNotes),
      "tastingNotesPreview": tastingNotes[0...100],
      wine->{
        _id,
        name,
        vintage,
        hasAiReview,
        "aiReviewLength": length(aiReview),
        "aiReviewPreview": aiReview[0...100]
      }
    }
  `);

  console.log('\n📋 Sample of existing review documents:\n');
  sampleReviews.forEach((review: any, i: number) => {
    console.log(`${i + 1}. ${review.wine?.name} ${review.wine?.vintage || 'NV'}`);
    console.log(`   Reviewer: ${review.reviewerName || 'Unknown'}`);
    console.log(`   AI Generated: ${review.isAiGenerated || false}`);
    console.log(`   Score: ${review.score}`);
    console.log(`   Note length: ${review.noteLength} chars`);
    console.log(`   Wine hasAiReview: ${review.wine?.hasAiReview}`);
    console.log(`   Wine aiReview length: ${review.wine?.aiReviewLength} chars`);

    // Compare review text to aiReview text
    if (review.tastingNotesPreview && review.wine?.aiReviewPreview) {
      const match = review.tastingNotesPreview === review.wine.aiReviewPreview;
      console.log(`   Text matches: ${match ? '✅ YES' : '❌ NO'}`);
    }
    console.log('');
  });

  // Check reviewerName distribution
  const reviewerStats = await sanityClient.fetch(`
    {
      "byReviewer": *[_type == "review"] | group(reviewerName) {
        "reviewer": @.reviewerName,
        "count": count(@)
      }
    }
  `);

  console.log('📊 Reviews by Reviewer:\n');
  reviewerStats.byReviewer.forEach((stat: any) => {
    console.log(`  ${stat.reviewer || 'Unknown'}: ${stat.count} reviews`);
  });

  // Check if reviews match aiReview field
  const matchingReviews = await sanityClient.fetch(`
    *[_type == "review"][0...100] {
      _id,
      wine->{
        _id,
        hasAiReview,
        aiReview
      },
      tastingNotes,
      "textMatches": tastingNotes == ^.wine->aiReview
    }
  `);

  const matchCount = matchingReviews.filter((r: any) => r.textMatches).length;
  console.log(`\n🔄 Review vs aiReview comparison (first 100):`);
  console.log(`  Reviews matching aiReview field: ${matchCount}/100`);
  console.log(`  Reviews NOT matching aiReview: ${100 - matchCount}/100`);
}

main();
