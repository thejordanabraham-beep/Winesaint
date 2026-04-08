// Auto-generate missing parent regions based on existing child paths
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

// Map region levels based on depth
function getLevelFromDepth(depth: number): string {
  if (depth === 1) return 'country';
  if (depth === 2) return 'region';
  if (depth === 3) return 'subregion';
  if (depth === 4) return 'village';
  return 'vineyard';
}

// Extract country name from slug
function getCountryFromSlug(slug: string): string {
  const country = slug.split('/')[0];
  return country.charAt(0).toUpperCase() + country.slice(1).replace(/-/g, ' ');
}

// Format name from slug part
function formatName(slugPart: string): string {
  return slugPart
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function main() {
  console.log('Finding all unique parent paths...\n');

  // Get all regions with fullSlug
  const allRegions = await client.fetch(`
    *[_type == "region" && defined(fullSlug)] {
      fullSlug
    }
  `);

  // Extract all unique parent paths
  const parentPaths = new Set<string>();
  for (const region of allRegions) {
    const parts = region.fullSlug.split('/');
    // Add all parent paths (australia/barossa-valley -> australia)
    for (let i = 1; i < parts.length; i++) {
      parentPaths.add(parts.slice(0, i).join('/'));
    }
  }

  console.log(`Found ${parentPaths.size} unique parent paths\n`);

  // Check which ones already exist
  const existing = await client.fetch(`
    *[_type == "region" && defined(fullSlug)].fullSlug
  `);
  const existingSet = new Set(existing);

  const missing = Array.from(parentPaths).filter(path => !existingSet.has(path));
  console.log(`${missing.length} parent regions need to be created\n`);

  // Sort by depth (create parents before children)
  missing.sort((a, b) => a.split('/').length - b.split('/').length);

  let created = 0;
  for (const fullSlug of missing) {
    const parts = fullSlug.split('/');
    const slug = parts[parts.length - 1];
    const level = getLevelFromDepth(parts.length);
    const country = getCountryFromSlug(fullSlug);
    const name = formatName(slug);
    const _id = `region-${fullSlug.replace(/\//g, '-')}`;

    const doc: any = {
      _id,
      _type: 'region',
      name,
      slug: { _type: 'slug', current: slug },
      fullSlug,
      level,
      country,
    };

    // Add parent reference if not top-level
    if (parts.length > 1) {
      const parentSlug = parts.slice(0, -1).join('/');
      doc.parentRegion = {
        _type: 'reference',
        _ref: `region-${parentSlug.replace(/\//g, '-')}`,
      };
    }

    try {
      await client.createOrReplace(doc);
      console.log(`✅ Created: ${fullSlug} (${level})`);
      created++;
    } catch (error: any) {
      console.error(`❌ Failed to create ${fullSlug}: ${error.message}`);
    }
  }

  console.log(`\n✨ Done! Created ${created} parent regions`);
}

main().catch(console.error);
