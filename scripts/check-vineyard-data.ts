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

async function check() {
  // Check the Clos des Goisses wine
  const wine = await client.fetch(`*[_type == 'wine' && name match '*Clos des Goisses*'][0]{
    _id,
    name,
    vintage,
    'producerName': producer->name,
    'regionName': region->name,
    'vineyardRef': vineyard,
    'vineyardName': vineyard->name,
    'climatRef': climat,
    'climatName': climat->name
  }`);

  console.log('🍇 CLOS DES GOISSES DATA:');
  console.log('='.repeat(70));
  console.log(JSON.stringify(wine, null, 2));

  // Also check what the page query returns
  console.log('\n\n📄 TESTING PAGE QUERY:');
  console.log('='.repeat(70));

  const pageQuery = `*[_type == "wine" && name match "*Clos des Goisses*"][0] {
    _id,
    name,
    "slug": slug.current,
    vintage,
    vineyard->{
      _id,
      name,
      "slug": slug.current,
      region
    },
    climat->{
      _id,
      name,
      "slug": slug.current,
      classification
    }
  }`;

  const pageData = await client.fetch(pageQuery);
  console.log(JSON.stringify(pageData, null, 2));
}

check();
