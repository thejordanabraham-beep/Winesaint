import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function main() {
  // Try the exact query
  const test1 = await client.fetch(`
    *[_type == "region" && (parentRegion == null || !defined(parentRegion)) && defined(fullSlug) && fullSlug match "*/*"][0...5] {
      _id,
      name,
      fullSlug,
      parentRegion
    }
  `);
  console.log('Query result:', JSON.stringify(test1, null, 2));

  // Simpler query
  const test2 = await client.fetch(`
    *[_type == "region" && fullSlug match "germany/mosel/*"][0...3] {
      _id,
      name,
      parentRegion
    }
  `);
  console.log('\nMosel vineyards:', JSON.stringify(test2, null, 2));
}

main().catch(console.error);
