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

async function checkDuplicates() {
  console.log('\n🔍 CHECKING FOR DUPLICATE REVIEWS\n');

  // Find wines with multiple reviews
  const duplicates = await client.fetch(`
    *[_type == 'review'] {
      'wineId': wine._ref
    } | order(wineId asc)
  `);

  const wineCounts: Record<string, number> = {};

  duplicates.forEach((review: any) => {
    wineCounts[review.wineId] = (wineCounts[review.wineId] || 0) + 1;
  });

  const winesWithMultipleReviews = Object.entries(wineCounts)
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1]);

  console.log(`📊 Statistics:`);
  console.log(`   Total reviews: ${duplicates.length}`);
  console.log(`   Unique wines with reviews: ${Object.keys(wineCounts).length}`);
  console.log(`   Wines with multiple reviews: ${winesWithMultipleReviews.length}`);

  if (winesWithMultipleReviews.length > 0) {
    console.log(`\n🔴 Top wines with most duplicate reviews:`);
    winesWithMultipleReviews.slice(0, 10).forEach(([wineId, count]) => {
      console.log(`   Wine ${wineId}: ${count} reviews`);
    });
  }

  console.log('\n');
}

checkDuplicates();
