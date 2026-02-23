import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'hj3ee4sp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function fixUnitedStatesLevel() {
  console.log('Fixing United States level...');

  const us = await client.fetch(
    `*[_type == "appellation" && slug.current == "united-states"][0]{ _id }`
  );

  if (us) {
    await client.patch(us._id)
      .set({ level: 'continent' })
      .commit();
    console.log('✓ Updated United States to level: continent');
  } else {
    console.log('United States not found');
  }
}

fixUnitedStatesLevel().catch(console.error);
