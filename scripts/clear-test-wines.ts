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

async function clear() {
  console.log('🗑️  CLEARING ALL WINES');
  console.log('='.repeat(70));

  // Delete all wines
  const wines = await client.fetch(`*[_type == 'wine']{_id}`);
  console.log(`Found ${wines.length} wines to delete`);

  for (const wine of wines) {
    await client.delete(wine._id);
  }

  console.log(`✅ Deleted ${wines.length} wines`);

  // Delete all vineyards
  const vineyards = await client.fetch(`*[_type == 'vineyard']{_id}`);
  console.log(`\nFound ${vineyards.length} vineyards to delete`);

  for (const vineyard of vineyards) {
    await client.delete(vineyard._id);
  }

  console.log(`✅ Deleted ${vineyards.length} vineyards`);

  console.log('\n✅ CLEAN SLATE READY');
}

clear();
