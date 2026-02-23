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

async function checkNames() {
  const wines = await client.fetch(`*[_type == 'wine' && producer->name == 'Henriot'][0...3]{
    _id,
    name,
    vintage,
    'producerName': producer->name,
    'regionName': region->name
  }`);

  console.log('Sample Henriot wines in Sanity:\n');
  wines.forEach((w: any) => {
    console.log(`Name: ${w.name}`);
    console.log(`Producer: ${w.producerName}`);
    console.log(`Region: ${w.regionName}`);
    console.log(`Vintage: ${w.vintage}\n`);
  });
}

checkNames();
