/**
 * Add slugs to wines that don't have them
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

function generateSlug(name: string, vintage: number, producerName: string): string {
  const combined = `${vintage} ${producerName} ${name}`;
  return combined
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('🔗 Adding slugs to wines without slugs');
  console.log('='.repeat(50));

  // Get all wines without slugs
  const wines = await sanityClient.fetch(`
    *[_type == "wine"] {
      _id,
      name,
      vintage,
      "slug": slug.current,
      "producerName": producer->name
    }
  `);

  let updatedCount = 0;
  let skippedCount = 0;

  for (const wine of wines) {
    if (wine.slug) {
      console.log(`⏭️  Has slug: ${wine.producerName} ${wine.name} ${wine.vintage}`);
      skippedCount++;
      continue;
    }

    const slug = generateSlug(wine.name, wine.vintage, wine.producerName);

    await sanityClient
      .patch(wine._id)
      .set({
        slug: {
          _type: 'slug',
          current: slug,
        },
      })
      .commit();

    console.log(`✅ Added slug: ${wine.producerName} ${wine.name} ${wine.vintage} → ${slug}`);
    updatedCount++;
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Complete!`);
  console.log(`   Updated: ${updatedCount} wines`);
  console.log(`   Skipped: ${skippedCount} (already had slugs)`);
}

main().catch(console.error);
