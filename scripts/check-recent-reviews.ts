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
  console.log('🔍 CHECKING RECENTLY CREATED REVIEWS');
  console.log('='.repeat(70));

  // Get reviews from WineSaint AI (just created)
  const recentReviews = await sanityClient.fetch(`
    *[_type == "review" && reviewerName == "WineSaint AI"] | order(_createdAt desc)[0...10] {
      _id,
      _createdAt,
      reviewerName,
      score,
      "noteLength": length(tastingNotes),
      "tastingNotesPreview": tastingNotes[0...150],
      wine->{
        _id,
        name,
        vintage,
        "hasMultipleReviews": count(*[_type == "review" && wine._ref == ^._id]) > 1,
        "reviewCount": count(*[_type == "review" && wine._ref == ^._id])
      }
    }
  `);

  console.log(`\nFound ${recentReviews.length} recent "WineSaint AI" reviews\n`);

  recentReviews.forEach((review: any, i: number) => {
    console.log(`${i + 1}. ${review.wine?.name} ${review.wine?.vintage || 'NV'}`);
    console.log(`   Review ID: ${review._id}`);
    console.log(`   Created: ${new Date(review._createdAt).toLocaleString()}`);
    console.log(`   Score: ${review.score}`);
    console.log(`   Length: ${review.noteLength} chars`);
    console.log(`   Wine has ${review.wine?.reviewCount} review(s) total`);
    if (review.wine?.hasMultipleReviews) {
      console.log(`   ⚠️  MULTIPLE REVIEWS DETECTED!`);
    }
    console.log(`   Preview: ${review.tastingNotesPreview}...`);
    console.log('');
  });

  // Check for any duplicates created
  const duplicateCheck = await sanityClient.fetch(`
    *[_type == "wine"] {
      _id,
      name,
      vintage,
      "reviewCount": count(*[_type == "review" && wine._ref == ^._id]),
      "aiReviews": *[_type == "review" && wine._ref == ^._id && reviewerName == "WineSaint AI"],
      "otherReviews": *[_type == "review" && wine._ref == ^._id && reviewerName != "WineSaint AI"]
    }[reviewCount > 1][0...5]
  `);

  if (duplicateCheck.length > 0) {
    console.log('\n⚠️  WINES WITH MULTIPLE REVIEWS:\n');
    duplicateCheck.forEach((wine: any, i: number) => {
      console.log(`${i + 1}. ${wine.name} ${wine.vintage || 'NV'}`);
      console.log(`   Total reviews: ${wine.reviewCount}`);
      console.log(`   WineSaint AI reviews: ${wine.aiReviews.length}`);
      console.log(`   Other reviews: ${wine.otherReviews.length}`);
      console.log('');
    });
  } else {
    console.log('\n✅ No wines with multiple reviews found (no duplicates!)');
  }

  // Total counts
  const totalAI = await sanityClient.fetch(`count(*[_type == "review" && reviewerName == "WineSaint AI"])`);
  const totalOther = await sanityClient.fetch(`count(*[_type == "review" && reviewerName != "WineSaint AI"])`);

  console.log('\n📊 SUMMARY:');
  console.log(`   WineSaint AI reviews: ${totalAI}`);
  console.log(`   Other reviews: ${totalOther}`);
  console.log(`   Total reviews: ${totalAI + totalOther}`);
}

main();
