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

async function countReviews() {
  const totalWines = await client.fetch(`count(*[_type == 'wine'])`);
  const winesWithReviews = await client.fetch(`count(*[_type == 'wine' && defined(review._ref)])`);
  const totalReviews = await client.fetch(`count(*[_type == 'review'])`);

  console.log('📊 DATABASE STATS:');
  console.log('==================');
  console.log(`Total wines: ${totalWines}`);
  console.log(`Wines with reviews: ${winesWithReviews} (${Math.round(winesWithReviews/totalWines*100)}%)`);
  console.log(`Total review documents: ${totalReviews}`);
  console.log(`Wines still needing reviews: ${totalWines - winesWithReviews}`);
}

countReviews();
