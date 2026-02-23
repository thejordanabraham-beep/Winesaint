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
  const wine = await client.fetch(`*[_type == 'wine' && vintage == 2008 && producer->name == 'Henriot'][0]{
    _id,
    name,
    vintage,
    'producerName': producer->name
  }`);

  console.log('What we STORED in Sanity:');
  console.log('  name:', wine.name);
  console.log('  vintage:', wine.vintage);
  console.log('  producer:', wine.producerName);
  console.log();
  console.log('The name field includes everything, so frontend should just display the NAME field only.');
}

check();
