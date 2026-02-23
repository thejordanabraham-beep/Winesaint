/**
 * Fix regions that were incorrectly created with country "France"
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

const REGION_COUNTRY_FIXES = [
  // Spanish regions
  { name: 'Catalonia', correctCountry: 'Spain' },
  { name: 'Andalusia', correctCountry: 'Spain' },
  // Portuguese regions
  { name: 'Minho', correctCountry: 'Portugal' },
  { name: 'Alentejo', correctCountry: 'Portugal' },
  // Austrian regions
  { name: 'Lower Austria', correctCountry: 'Austria' },
  { name: 'Vienna', correctCountry: 'Austria' },
  // Italian regions
  { name: 'Veneto', correctCountry: 'Italy' },
  { name: 'Tuscany', correctCountry: 'Italy' },
  { name: 'Piedmont', correctCountry: 'Italy' },
  { name: 'Trentino-Alto Adige', correctCountry: 'Italy' },
  // US regions
  { name: 'California', correctCountry: 'United States' },
];

async function fixRegionCountries() {
  console.log('🔍 Finding regions with incorrect country...\n');

  const regionNames = REGION_COUNTRY_FIXES.map(r => r.name);

  const regions = await client.fetch(
    `*[_type == "region" && name in $regionNames]`,
    { regionNames }
  );

  console.log(`📊 Found ${regions.length} regions to check\n`);

  let updatedCount = 0;

  for (const region of regions) {
    const correctEntry = REGION_COUNTRY_FIXES.find(r => r.name === region.name);

    if (!correctEntry) continue;

    if (region.country !== correctEntry.correctCountry) {
      console.log(`🔧 Updating ${region.name}: "${region.country}" → "${correctEntry.correctCountry}"`);

      await client
        .patch(region._id)
        .set({ country: correctEntry.correctCountry })
        .commit();

      updatedCount++;
    } else {
      console.log(`✅ ${region.name}: Already correct (${correctEntry.correctCountry})`);
    }
  }

  console.log(`\n📈 Summary:`);
  console.log(`   ✅ Updated: ${updatedCount}`);
  console.log(`   ⏭️  Already correct: ${regions.length - updatedCount}`);
  console.log(`   📊 Total checked: ${regions.length}`);
}

fixRegionCountries()
  .then(() => {
    console.log('\n✅ Fix complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fix failed:', error);
    process.exit(1);
  });
