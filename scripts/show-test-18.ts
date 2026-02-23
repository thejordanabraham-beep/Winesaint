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

async function show() {
  // Get the 18 most recently created wines
  const wines = await client.fetch(`*[_type == 'wine'] | order(_createdAt desc)[0...18]{
    _id,
    name,
    vintage,
    'producer': producer->name,
    'region': region->name,
    'vineyard': vineyard->name,
    aiReview
  }`);

  console.log('🎲 18 TEST WINES IMPORTED TO SANITY');
  console.log('='.repeat(70));
  console.log('Review these to verify they look correct:\n');

  wines.reverse().forEach((wine: any, i: number) => {
    console.log(`${i + 1}. ${wine.name}`);
    console.log(`   Producer: ${wine.producer}`);
    console.log(`   Region: ${wine.region}`);
    console.log(`   ${wine.vineyard ? `🍇 VINEYARD: ${wine.vineyard}` : '⚪ No vineyard'}`);
    console.log(`   Profile: ${wine.aiReview?.substring(0, 120)}...`);
    console.log();
  });

  console.log('='.repeat(70));
  console.log('📊 SUMMARY:');
  const withVineyard = wines.filter((w: any) => w.vineyard);
  console.log(`With vineyard: ${withVineyard.length}/18`);
  console.log(`Vineyards found: ${[...new Set(withVineyard.map((w: any) => w.vineyard))].join(', ')}`);
}

show();
