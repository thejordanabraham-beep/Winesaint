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

async function fixFranceTopLevel() {
  console.log('Moving France to top level alongside United States...\n');

  // Get France
  const france = await client.fetch(
    `*[_type == "appellation" && slug.current == "france"][0]{ _id }`
  );

  if (france) {
    // Remove parent (Europe) and set as top-level continent
    await client.patch(france._id)
      .unset(['parentAppellation'])
      .set({ level: 'country' })
      .commit();
    console.log('✓ France is now a top-level region');
  }

  // Update United States to be 'country' level for consistency
  const us = await client.fetch(
    `*[_type == "appellation" && slug.current == "united-states"][0]{ _id }`
  );

  if (us) {
    await client.patch(us._id)
      .set({ level: 'country' })
      .commit();
    console.log('✓ United States set to country level');
  }

  // Delete Europe (no longer needed)
  const europe = await client.fetch(
    `*[_type == "appellation" && slug.current == "europe"][0]{ _id }`
  );

  if (europe) {
    await client.delete(europe._id);
    console.log('✓ Removed Europe (no longer needed)');
  }

  console.log('\n✅ Done! Top-level regions are now:');
  console.log('  - United States → California, Oregon, Washington');
  console.log('  - France → Bordeaux, Burgundy, Champagne, etc.');
}

fixFranceTopLevel().catch(console.error);
