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
  console.log('🔍 CHECKING FOR DUPLICATE REVIEWS');
  console.log('='.repeat(70));

  // Find wines with multiple review documents
  const winesWithMultipleReviews = await sanityClient.fetch(`
    *[_type == "wine"] {
      _id,
      name,
      vintage,
      "reviewCount": count(*[_type == "review" && wine._ref == ^._id]),
      "reviews": *[_type == "review" && wine._ref == ^._id] {
        _id,
        reviewerName,
        isAiGenerated,
        reviewDate,
        "noteLength": length(tastingNotes)
      }
    }[reviewCount > 1]
  `);

  console.log(`\nWines with multiple reviews: ${winesWithMultipleReviews.length}\n`);

  if (winesWithMultipleReviews.length > 0) {
    console.log('⚠️  DUPLICATES FOUND:\n');
    winesWithMultipleReviews.slice(0, 10).forEach((wine: any, i: number) => {
      console.log(`${i + 1}. ${wine.name} ${wine.vintage || 'NV'} - ${wine.reviewCount} reviews`);
      wine.reviews.forEach((review: any, j: number) => {
        console.log(`   Review ${j + 1}: ${review.reviewerName} (${review.isAiGenerated ? 'AI' : 'Human'}) - ${review.noteLength} chars`);
      });
      console.log('');
    });
  } else {
    console.log('✅ No duplicate reviews found');
  }

  // Check for wines with AI reviews that might have been migrated already
  const aiReviewDocs = await sanityClient.fetch(`
    count(*[_type == "review" && reviewerName == "WineSaint AI"])
  `);

  console.log(`\nReviews from "WineSaint AI": ${aiReviewDocs}`);

  // Check total review distribution
  const distribution = await sanityClient.fetch(`
    {
      "winesWith0Reviews": count(*[_type == "wine"]{
        "reviewCount": count(*[_type == "review" && wine._ref == ^._id])
      }[reviewCount == 0]),
      "winesWith1Review": count(*[_type == "wine"]{
        "reviewCount": count(*[_type == "review" && wine._ref == ^._id])
      }[reviewCount == 1]),
      "winesWith2Plus": count(*[_type == "wine"]{
        "reviewCount": count(*[_type == "review" && wine._ref == ^._id])
      }[reviewCount > 1])
    }
  `);

  console.log('\n📊 Review Distribution:');
  console.log(`  Wines with 0 reviews: ${distribution.winesWith0Reviews}`);
  console.log(`  Wines with 1 review: ${distribution.winesWith1Review}`);
  console.log(`  Wines with 2+ reviews: ${distribution.winesWith2Plus}`);

  console.log('\n' + '='.repeat(70));
  console.log('RECOMMENDATION:');
  console.log('='.repeat(70));

  if (winesWithMultipleReviews.length > 10) {
    console.log('⚠️  WARNING: Many wines have duplicate reviews!');
    console.log('   This might indicate previous migrations ran multiple times.');
    console.log('   Review the duplicates above before proceeding.');
  } else if (distribution.winesWith0Reviews > 1000) {
    console.log('✅ Safe to proceed with migration');
    console.log(`   ${distribution.winesWith0Reviews} wines need review documents created`);
  } else {
    console.log('✅ Most wines already have reviews');
    console.log(`   Only ${distribution.winesWith0Reviews} wines need review documents`);
  }
}

main();
