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

async function test() {
  const wines = [
    '1992-philipponnat-clos-des-goisses-lv-disgorged-072018',
    '1991-domaine-bonneau-du-martray-corton-charlemagne',
    '2016-domaine-pierre-morey-btard-montrachet'
  ];

  console.log('🍷 TESTING VINEYARD/CLIMAT DISPLAY');
  console.log('='.repeat(70));

  for (const slug of wines) {
    const wine = await client.fetch(`*[_type == "wine" && slug.current == $slug][0] {
      name,
      vintage,
      'producerName': producer->name,
      'regionName': region->name,
      vineyard->{
        name
      },
      climat->{
        name
      }
    }`, { slug });

    if (wine) {
      console.log(`\n${wine.name}`);
      console.log(`  Will display box: ${wine.climat?.name || wine.vineyard?.name || 'NONE'}`);
    }
  }
}

test();
