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
  // Check the Burgundy wines from the test set
  const wines = await client.fetch(`*[_type == 'wine' && (
    name match '*Corton*' ||
    name match '*Montrachet*' ||
    name match '*Romanée*'
  )][0...5]{
    _id,
    name,
    'producerName': producer->name,
    'regionName': region->name,
    'vineyardRef': vineyard,
    'vineyardName': vineyard->name,
    'climatRef': climat,
    'climatName': climat->name,
    'climatClassification': climat->classification
  }`);

  console.log('🍷 BURGUNDY WINES - VINEYARD VS CLIMAT DATA:');
  console.log('='.repeat(70));
  wines.forEach((wine: any) => {
    console.log(`\n${wine.name}`);
    console.log(`  Vineyard: ${wine.vineyardName || 'NONE'}`);
    console.log(`  Climat: ${wine.climatName || 'NONE'}`);
    console.log(`  Classification: ${wine.climatClassification || 'NONE'}`);
  });
}

check();
