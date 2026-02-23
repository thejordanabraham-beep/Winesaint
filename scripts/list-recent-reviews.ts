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

async function listRecentReviews() {
  const limit = parseInt(process.argv[2]) || 25;

  const reviews = await client.fetch(`*[_type == 'review' && reviewerName == 'Wine Saint'] | order(_createdAt desc)[0..${limit - 1}]{
    score,
    'wineName': wine->name,
    'producerName': wine->producer->name,
    'regionName': wine->region->name,
    'vintage': wine->vintage
  }`);

  console.log(`\n🍷 LAST ${reviews.length} WINES REVIEWED (Most Recent First):\n`);
  console.log('='.repeat(80));

  reviews.forEach((r: any, i: number) => {
    console.log(`${String(i + 1).padStart(2)}. [${r.score}] ${r.wineName}`);
    console.log(`    ${r.producerName} | ${r.regionName || 'Region Unknown'}`);
    console.log('');
  });

  // Group by region
  const byRegion: Record<string, any[]> = {};
  reviews.forEach((r: any) => {
    const region = r.regionName || 'Unknown Region';
    if (!byRegion[region]) byRegion[region] = [];
    byRegion[region].push(r);
  });

  console.log('='.repeat(80));
  console.log('\n📍 BY REGION:\n');
  Object.entries(byRegion)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([region, wines]) => {
      console.log(`${region}: ${wines.length} wine${wines.length > 1 ? 's' : ''}`);
    });

  // Score distribution
  console.log('\n📊 SCORE DISTRIBUTION:\n');
  const scoreGroups: Record<string, number> = {
    '98-100': 0,
    '95-97': 0,
    '92-94': 0,
    '90-91': 0,
    '87-89': 0
  };

  reviews.forEach((r: any) => {
    if (r.score >= 98) scoreGroups['98-100']++;
    else if (r.score >= 95) scoreGroups['95-97']++;
    else if (r.score >= 92) scoreGroups['92-94']++;
    else if (r.score >= 90) scoreGroups['90-91']++;
    else scoreGroups['87-89']++;
  });

  Object.entries(scoreGroups).forEach(([range, count]) => {
    if (count > 0) {
      console.log(`${range} points: ${count} wine${count > 1 ? 's' : ''}`);
    }
  });

  console.log('\n' + '='.repeat(80) + '\n');
}

listRecentReviews();
