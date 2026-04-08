// Fix parent references for regions that were orphaned during migration
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

async function main() {
  console.log('Finding orphaned regions...\n');

  // Get all regions that look like file paths and don't have parents (null or undefined)
  const orphanedRegions = await client.fetch(`
    *[_type == "region" && (parentRegion == null || !defined(parentRegion)) && defined(fullSlug) && fullSlug match "*/*"] {
      _id,
      name,
      fullSlug
    }
  `);

  console.log(`Found ${orphanedRegions.length} regions without parent references\n`);

  let fixed = 0;
  let failed = 0;
  let skipped = 0;

  for (const region of orphanedRegions) {
    if (!region.fullSlug || !region.fullSlug.includes('/')) {
      skipped++;
      continue;
    }

    // Extract parent slug from fullSlug (everything before the last /)
    const parts = region.fullSlug.split('/');

    // Skip if only one level (should be top-level region)
    if (parts.length < 2) {
      skipped++;
      continue;
    }

    const parentSlug = parts.slice(0, -1).join('/');
    const parentId = `region-${parentSlug.replace(/\//g, '-')}`;

    try {
      // Check if parent exists first
      const parentExists = await client.fetch(
        `*[_type == "region" && _id == $parentId][0]._id`,
        { parentId }
      );

      if (!parentExists) {
        console.log(`⚠️  Parent not found: ${parentSlug} for ${region.fullSlug}`);
        skipped++;
        continue;
      }

      // Update the region to reference its parent
      await client
        .patch(region._id)
        .set({
          parentRegion: {
            _type: 'reference',
            _ref: parentId,
          },
        })
        .commit();

      console.log(`✅ ${region.fullSlug} -> ${parentSlug}`);
      fixed++;
    } catch (error: any) {
      console.error(`❌ Failed to fix ${region.fullSlug}: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n✨ Done! Fixed: ${fixed}, Skipped: ${skipped}, Failed: ${failed}`);
}

main().catch(console.error);
