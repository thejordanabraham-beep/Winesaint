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
  // Get 3 sample reviews with full text
  const samples = await sanityClient.fetch(`
    *[_type == "review" && reviewerName == "WineSaint AI"] | order(_createdAt desc)[0...3] {
      _id,
      reviewerName,
      score,
      tastingNotes,
      wine->{
        name,
        vintage
      }
    }
  `);

  console.log('📝 SAMPLE REVIEW TEXTS:\n');
  console.log('='.repeat(70));

  samples.forEach((review: any, i: number) => {
    console.log(`\n${i + 1}. ${review.wine?.name} ${review.wine?.vintage || 'NV'}`);
    console.log(`   Score: ${review.score}`);
    console.log(`   Reviewer: ${review.reviewerName}`);
    console.log(`\n   Full Review Text:`);
    console.log(`   ${review.tastingNotes || '[NO TEXT]'}`);
    console.log('\n' + '='.repeat(70));
  });
}

main();
