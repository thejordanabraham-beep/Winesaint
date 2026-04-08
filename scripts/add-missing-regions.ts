// Add missing parent regions that don't have page.tsx files
import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const missingRegions = [
  {
    _id: 'region-germany-mosel',
    _type: 'region',
    name: 'Mosel',
    slug: { _type: 'slug', current: 'mosel' },
    fullSlug: 'germany/mosel',
    level: 'region',
    country: 'Germany',
    parentRegion: { _type: 'reference', _ref: 'region-germany' },
  },
  {
    _id: 'region-germany-rheingau',
    _type: 'region',
    name: 'Rheingau',
    slug: { _type: 'slug', current: 'rheingau' },
    fullSlug: 'germany/rheingau',
    level: 'region',
    country: 'Germany',
    parentRegion: { _type: 'reference', _ref: 'region-germany' },
  },
  {
    _id: 'region-germany-rheinhessen',
    _type: 'region',
    name: 'Rheinhessen',
    slug: { _type: 'slug', current: 'rheinhessen' },
    fullSlug: 'germany/rheinhessen',
    level: 'region',
    country: 'Germany',
    parentRegion: { _type: 'reference', _ref: 'region-germany' },
  },
  {
    _id: 'region-germany-pfalz',
    _type: 'region',
    name: 'Pfalz',
    slug: { _type: 'slug', current: 'pfalz' },
    fullSlug: 'germany/pfalz',
    level: 'region',
    country: 'Germany',
    parentRegion: { _type: 'reference', _ref: 'region-germany' },
  },
];

async function main() {
  console.log('Adding missing German regions...\n');

  for (const region of missingRegions) {
    try {
      await client.createOrReplace(region);
      console.log(`✅ Created: ${region.name}`);
    } catch (error) {
      console.error(`❌ Failed to create ${region.name}:`, error);
    }
  }

  console.log('\n✨ Done!');
}

main().catch(console.error);
