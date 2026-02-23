/**
 * Fix German regions that were incorrectly created with country "France"
 */

import { createClient } from '@sanity/client';
import path from 'path';
import { config } from 'dotenv';

config({ path: path.join(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
});

const GERMAN_REGIONS = [
  'Mosel',
  'Rheingau',
  'Pfalz',
  'Nahe',
  'Rheinhessen',
  'Franken',
  'Ahr',
  'Baden',
  'Mittelrhein',
  'Württemberg',
  'Saxony',
  'Sachsen',
  'Saale-Unstrut',
];

async function fixGermanRegions() {
  console.log('🔍 Finding German regions with incorrect country...\n');

  const regions = await client.fetch(
    `*[_type == "region" && name in $germanRegions]`,
    { germanRegions: GERMAN_REGIONS }
  );

  console.log(`📊 Found ${regions.length} German regions\n`);

  let updatedCount = 0;

  for (const region of regions) {
    if (region.country !== 'Germany') {
      console.log(`🔧 Updating ${region.name}: "${region.country}" → "Germany"`);

      await client
        .patch(region._id)
        .set({ country: 'Germany' })
        .commit();

      updatedCount++;
    } else {
      console.log(`✅ ${region.name}: Already correct (Germany)`);
    }
  }

  console.log(`\n📈 Summary:`);
  console.log(`   ✅ Updated: ${updatedCount}`);
  console.log(`   ⏭️  Already correct: ${regions.length - updatedCount}`);
  console.log(`   📊 Total: ${regions.length}`);
}

fixGermanRegions()
  .then(() => {
    console.log('\n✅ Fix complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fix failed:', error);
    process.exit(1);
  });
