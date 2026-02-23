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
  // Get wines with vineyard
  const withVineyard = await client.fetch(`*[_type == 'wine' && defined(vineyard)][0...3]{
    _id,
    name,
    vintage,
    'producer': producer->name,
    'region': region->name,
    'vineyard': vineyard->name,
    aiReview
  } | order(_createdAt desc)`);

  console.log('🍇 WINES WITH VINEYARD TAG:');
  console.log('='.repeat(70));
  withVineyard.forEach((wine: any, i: number) => {
    console.log(`\n${i + 1}. ${wine.name}`);
    console.log(`   Producer: ${wine.producer}`);
    console.log(`   Region: ${wine.region}`);
    console.log(`   🍇 VINEYARD: ${wine.vineyard || 'N/A'}`);
    if (wine.aiReview) {
      console.log(`   \n   Profile: ${wine.aiReview.substring(0, 150)}...`);
    }
  });

  // Get wines without vineyard
  const withoutVineyard = await client.fetch(`*[_type == 'wine' && !defined(vineyard) && producer->name == 'Krug'][0...3]{
    _id,
    name,
    vintage,
    'producer': producer->name,
    'region': region->name,
    'vineyard': vineyard->name,
    aiReview
  } | order(_createdAt desc)`);

  console.log('\n\n⚪ WINES WITHOUT VINEYARD (Regional/Cuvée):');
  console.log('='.repeat(70));
  withoutVineyard.forEach((wine: any, i: number) => {
    console.log(`\n${i + 1}. ${wine.name}`);
    console.log(`   Producer: ${wine.producer}`);
    console.log(`   Region: ${wine.region}`);
    console.log(`   Vineyard: NONE (regional cuvée)`);
    if (wine.aiReview) {
      console.log(`   \n   Profile: ${wine.aiReview.substring(0, 150)}...`);
    }
  });

  // Check all vineyards created
  const vineyards = await client.fetch(`*[_type == 'vineyard']{
    _id,
    name,
    region,
    'wineCount': count(*[_type == 'wine' && vineyard._ref == ^._id])
  } | order(wineCount desc)`);

  console.log('\n\n📊 VINEYARDS AUTO-CREATED:');
  console.log('='.repeat(70));
  vineyards.forEach((v: any) => {
    console.log(`${v.name.padEnd(35)} - ${v.wineCount} wines - ${v.region}`);
  });

  // Total stats
  const stats = await client.fetch(`{
    "total": count(*[_type == 'wine']),
    "withVineyard": count(*[_type == 'wine' && defined(vineyard)]),
    "withoutVineyard": count(*[_type == 'wine' && !defined(vineyard)])
  }`);

  console.log('\n\n📈 IMPORT STATS:');
  console.log('='.repeat(70));
  console.log(`Total wines imported: ${stats.total}`);
  console.log(`With vineyard tag: ${stats.withVineyard} (${((stats.withVineyard / stats.total) * 100).toFixed(1)}%)`);
  console.log(`Without vineyard tag: ${stats.withoutVineyard} (${((stats.withoutVineyard / stats.total) * 100).toFixed(1)}%)`);
}

show();
