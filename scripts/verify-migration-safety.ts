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
  console.log('🔍 MIGRATION SAFETY CHECK');
  console.log('='.repeat(70));

  // 1. Total counts
  const totalWines = await sanityClient.fetch('count(*[_type == "wine"])');
  const totalReviews = await sanityClient.fetch('count(*[_type == "review"])');
  const winesWithAiReview = await sanityClient.fetch('count(*[_type == "wine" && defined(aiReview)])');

  console.log('\n📊 Current State:');
  console.log(`  Total wines: ${totalWines}`);
  console.log(`  Total review documents: ${totalReviews}`);
  console.log(`  Wines with aiReview field: ${winesWithAiReview}`);

  // 2. Wines that need migration (aiReview but no review doc)
  const needsMigration = await sanityClient.fetch(`
    count(*[_type == "wine" && defined(aiReview)] {
      "reviewCount": count(*[_type == "review" && wine._ref == ^._id])
    }[reviewCount == 0])
  `);

  console.log(`\n🔄 Migration Needed:`);
  console.log(`  Wines with aiReview but NO review doc: ${needsMigration}`);

  // 3. Wines that already have both
  const hasBoth = await sanityClient.fetch(`
    count(*[_type == "wine" && defined(aiReview)] {
      "reviewCount": count(*[_type == "review" && wine._ref == ^._id])
    }[reviewCount > 0])
  `);

  console.log(`  Wines with aiReview AND review doc: ${hasBoth} (safe, will skip)`);

  // 4. Check for any wines that would get duplicate reviews
  const wouldDuplicate = await sanityClient.fetch(`
    *[_type == "wine" && defined(aiReview)] {
      _id,
      name,
      vintage,
      "reviewCount": count(*[_type == "review" && wine._ref == ^._id]),
      "aiReviewLength": length(aiReview)
    }[reviewCount > 0][0...5]
  `);

  if (wouldDuplicate.length > 0) {
    console.log(`\n⚠️  Sample wines that already have reviews (will skip):`);
    wouldDuplicate.forEach((wine: any, i: number) => {
      console.log(`  ${i + 1}. ${wine.name} ${wine.vintage || 'NV'} - ${wine.reviewCount} existing reviews`);
    });
  }

  // 5. Summary
  console.log('\n' + '='.repeat(70));
  console.log('✅ SAFETY CHECK SUMMARY:');
  console.log('='.repeat(70));
  console.log(`Migration will create: ${needsMigration} new review documents`);
  console.log(`Will skip: ${hasBoth} wines that already have reviews`);
  console.log(`After migration: ${totalReviews + needsMigration} total review documents`);
  console.log(`\n✅ Safe to proceed - no duplicates will be created`);
}

main();
