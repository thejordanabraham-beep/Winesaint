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

async function selectTestWines() {
  // Get wines from different regions without reviews
  const wines = await client.fetch(`
    *[_type == 'wine' && !defined(*[_type == 'review' && wine._ref == ^._id][0]._id)] {
      _id,
      name,
      vintage,
      'regionName': region->name,
      'regionCountry': region->country,
      'producerName': producer->name
    } | order(regionName asc)
  `);

  // Group by region, take first wine from each region
  const regions = new Map();
  for (const wine of wines) {
    const key = wine.regionName;
    if (!regions.has(key) && regions.size < 5) {
      regions.set(key, wine);
    }
  }

  const selected = Array.from(regions.values());

  console.log('\n🍷 SELECTED 5 WINES FROM DIFFERENT REGIONS:\n');
  selected.forEach((w, i) => {
    console.log(`${i + 1}. ${w.name}`);
    console.log(`   Region: ${w.regionName}, ${w.regionCountry}`);
    console.log(`   ID: ${w._id}\n`);
  });

  return selected;
}

selectTestWines();
