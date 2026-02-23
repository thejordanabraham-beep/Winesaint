#!/usr/bin/env tsx
/**
 * Auto-generate all missing village and vineyard page files from guide-config.ts
 *
 * Usage: npx tsx scripts/generate-all-region-pages.ts [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { REGION_HIERARCHY, type RegionConfig } from '../lib/guide-config';

const isDryRun = process.argv.includes('--dry-run');

interface PageToCreate {
  filePath: string;
  config: RegionConfig;
  fullPath: string[];
  parentPath: string;
}

const pagesToCreate: PageToCreate[] = [];
const skippedExisting: string[] = [];

// Recursively traverse the hierarchy to find villages and vineyards
function traverseHierarchy(
  region: RegionConfig,
  ancestors: string[] = []
): void {
  const currentPath = [...ancestors, region.slug];

  // Only create pages for village and vineyard levels
  if (region.level === 'village' || region.level === 'vineyard') {
    // Build file path: app/regions/country/region/subregion/village/vineyard
    const filePath = path.join(
      process.cwd(),
      'app',
      'regions',
      ...currentPath,
      'page.tsx'
    );

    // Build parent path (all ancestors joined with /)
    const parentPath = currentPath.slice(0, -1).join('/');

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      skippedExisting.push(filePath);
    } else {
      pagesToCreate.push({
        filePath,
        config: region,
        fullPath: currentPath,
        parentPath,
      });
    }
  }

  // Recurse into children
  if (region.subRegions) {
    region.subRegions.forEach((child) => {
      traverseHierarchy(child, currentPath);
    });
  }
}

// Generate page content for village
function generateVillagePageContent(config: RegionConfig, parentPath: string): string {
  const componentName = config.name.replace(/[^a-zA-Z]/g, '');

  // Build sidebar links from subRegions
  const sidebarLinks = config.sidebarLinks || [];
  const sidebarLinksCode = sidebarLinks.length > 0
    ? `const ${componentName.toUpperCase()}_VINEYARDS = [
${sidebarLinks.map(link =>
  `  { name: '${link.name}', slug: '${link.slug}'${link.classification ? `, classification: '${link.classification}' as const` : ''} },`
).join('\n')}
];

`
    : '';

  return `import RegionLayout from '@/components/RegionLayout';

${sidebarLinksCode}export default function ${componentName}Page() {
  return (
    <RegionLayout
      title="${config.name}"
      level="village"
      parentRegion="${parentPath}"
      ${sidebarLinks.length > 0 ? `sidebarLinks={${componentName.toUpperCase()}_VINEYARDS}` : ''}
      contentFile="${config.guideFile || config.slug + '-guide.md'}"
    />
  );
}
`;
}

// Generate page content for vineyard
function generateVineyardPageContent(config: RegionConfig, parentPath: string): string {
  const componentName = config.name.replace(/[^a-zA-Z]/g, '');
  const sanitySlug = config.sanityRef || config.slug;

  return `import RegionLayout from '@/components/RegionLayout';
import { client } from '@/lib/sanity/client';

async function getClimatData(slug: string) {
  const query = \`*[_type == "climat" && slug.current == $slug][0] {
    _id,
    name,
    classification,
    acreage,
    soilTypes,
    aspect,
    slope,
    elevationRange,
    producers[]->{
      name,
      "slug": slug.current
    }
  }\`;

  return await client.fetch(query, { slug });
}

export default async function ${componentName}VineyardPage() {
  const climatData = await getClimatData('${sanitySlug}');

  return (
    <RegionLayout
      title="${config.name}"
      level="vineyard"
      parentRegion="${parentPath}"
      contentFile="${config.guideFile || config.slug + '-vineyard-guide.md'}"
      vineyardData={climatData ? {
        classification: climatData.classification,
        acreage: climatData.acreage,
        soilTypes: climatData.soilTypes,
        aspect: climatData.aspect,
        slope: climatData.slope,
        elevationRange: climatData.elevationRange,
        producers: climatData.producers || []
      } : undefined}
    />
  );
}
`;
}

// Main execution
console.log('🔍 Scanning guide-config.ts for villages and vineyards...\n');

// Traverse the entire hierarchy
REGION_HIERARCHY.forEach((country) => {
  traverseHierarchy(country);
});

console.log(`📊 Summary:`);
console.log(`   Found ${pagesToCreate.length} missing pages`);
console.log(`   Skipped ${skippedExisting.length} existing pages\n`);

if (pagesToCreate.length === 0) {
  console.log('✅ All pages already exist! Nothing to do.\n');
  process.exit(0);
}

if (isDryRun) {
  console.log('🔍 DRY RUN - No files will be created\n');
  console.log('Pages that would be created:\n');
  pagesToCreate.forEach((page) => {
    console.log(`   ${page.config.level}: ${page.config.name}`);
    console.log(`   → ${page.filePath}\n`);
  });
  process.exit(0);
}

// Create the pages
console.log('📝 Creating pages...\n');

let created = 0;
let errors = 0;

pagesToCreate.forEach((page) => {
  try {
    // Ensure directory exists
    const dir = path.dirname(page.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Generate content based on level
    const content = page.config.level === 'village'
      ? generateVillagePageContent(page.config, page.parentPath)
      : generateVineyardPageContent(page.config, page.parentPath);

    // Write file
    fs.writeFileSync(page.filePath, content);

    console.log(`   ✓ Created ${page.config.level}: ${page.config.name}`);
    console.log(`     ${page.filePath}`);
    created++;
  } catch (error) {
    console.error(`   ✗ Failed to create ${page.config.name}:`, error);
    errors++;
  }
});

console.log(`\n✅ Done! Created ${created} pages${errors > 0 ? `, ${errors} errors` : ''}\n`);

if (created > 0) {
  console.log('💡 Next steps:');
  console.log('   1. Restart your dev server to pick up new pages');
  console.log('   2. Test navigation to verify all links work');
  console.log('   3. Generate guide content with wine-region-guide-generator.ts\n');
}
