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

async function selectRedWines() {
  // Get all wines without reviews
  const wines = await client.fetch(`
    *[_type == 'wine' &&
      !defined(*[_type == 'review' && wine._ref == ^._id][0]._id)] {
      _id,
      name,
      vintage,
      grapeVarieties,
      'regionName': region->name,
      'regionCountry': region->country,
      'producerName': producer->name
    }
  `);

  // Filter for likely red wines based on name or grapes
  const redWines = wines.filter((w: any) => {
    const nameMatch = w.name?.toLowerCase().match(/rouge|rosso|tinto|red|barolo|barbaresco|brunello|chianti|rioja|tempranillo|pinot noir|cabernet|merlot|syrah|grenache|nebbiolo|sangiovese|malbec|zinfandel|barbera|trousseau|gamay|cotes du rhone|chateauneuf|hermitage|cornas|cote rotie|pomerol|margaux|pauillac|napa red/);
    const grapeMatch = w.grapeVarieties?.some((g: string) =>
      g.match(/Pinot Noir|Cabernet|Merlot|Syrah|Grenache|Nebbiolo|Sangiovese|Tempranillo|Malbec|Zinfandel|Barbera|Trousseau|Gamay|Mourvèdre|Carignan|Cinsault/i)
    );
    return nameMatch || grapeMatch;
  });

  // Group by region, take first wine from each region
  const regions = new Map();
  for (const wine of redWines) {
    const key = wine.regionName;
    if (!regions.has(key) && regions.size < 5) {
      regions.set(key, wine);
    }
  }

  const selected = Array.from(regions.values());

  console.log('\n🍷 SELECTED 5 RED WINES FROM DIFFERENT REGIONS:\n');
  selected.forEach((w, i) => {
    console.log(`${i + 1}. ${w.name}`);
    console.log(`   Grapes: ${w.grapeVarieties?.join(', ') || 'Unknown'}`);
    console.log(`   Region: ${w.regionName}, ${w.regionCountry}`);
    console.log(`   ID: ${w._id}\n`);
  });

  return selected;
}

selectRedWines();
