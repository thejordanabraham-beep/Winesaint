/**
 * Add vineyard data to Clemens Busch wines
 */

import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@sanity/client';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Map wine names to vineyards
const vineyardMapping: Record<string, string> = {
  'Marienburg Grosses Gewächs': 'Marienburg',
  'Marienburg Rothenpfad': 'Marienburg Rothenpfad',
  'Marienburg Fahrlay': 'Marienburg Fahrlay-Terrassen',
  'Vom Roten Schiefer': 'Estate',
  'Pündericher Marienburg Kabinett': 'Marienburg',
};

async function main() {
  console.log('🍇 Adding vineyard data to Clemens Busch wines');
  console.log('='.repeat(50));

  const wines = await sanityClient.fetch(`
    *[_type == "wine" && producer->name == "Clemens Busch"] {
      _id,
      name,
      vintage,
      vineyard
    }
  `);

  let updatedCount = 0;

  for (const wine of wines) {
    const vineyard = vineyardMapping[wine.name];

    if (!vineyard) {
      console.log(`⚠️  No vineyard mapping for: ${wine.name}`);
      continue;
    }

    if (wine.vineyard === vineyard) {
      console.log(`⏭️  Already set: ${wine.name} ${wine.vintage} → ${vineyard}`);
      continue;
    }

    await sanityClient
      .patch(wine._id)
      .set({ vineyard })
      .commit();

    console.log(`✅ Updated: ${wine.name} ${wine.vintage} → ${vineyard}`);
    updatedCount++;
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Complete! Updated ${updatedCount} wines`);
}

main().catch(console.error);
