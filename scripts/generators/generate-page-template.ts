/**
 * PAGE TEMPLATE GENERATOR
 *
 * Auto-generates page.tsx files from templates using guide config.
 * Creates correct directory structure and uses sidebar links from config.
 */

import { getRegionConfig, getAllRegions, getSidebarLinks, getRegionPath, getParentRegion } from '../lib/guide-config';
import fs from 'fs';
import path from 'path';

/**
 * Generate page.tsx content from template
 */
function generatePageTemplate(
  regionName: string,
  regionSlug: string,
  level: 'country' | 'region' | 'sub-region',
  parentRegion: string | undefined,
  sidebarLinks: Array<{ name: string; slug: string }>,
  guideFile: string
): string {
  const hasSubRegions = sidebarLinks.length > 0;

  // Component name: "Burgundy" -> "BurgundyPage"
  // Sanitize: remove special chars, accents, hyphens, apostrophes
  const componentName = regionName
    .normalize('NFD')  // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '')  // Remove diacritics
    .replace(/['-]/g, '')  // Remove hyphens and apostrophes
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Page';

  // Sidebar links constant name: "Burgundy" -> "BURGUNDY_SUB_REGIONS"
  const linksConstName = regionSlug
    .toUpperCase()
    .replace(/-/g, '_') + '_SUB_REGIONS';

  const template = `import RegionLayout from '@/components/RegionLayout';

${hasSubRegions ? `const ${linksConstName} = [
${sidebarLinks.map(link => `  { name: '${link.name.replace(/'/g, "\\'")}', slug: '${link.slug}' },`).join('\n')}
];

` : ''}export default function ${componentName}() {
  return (
    <RegionLayout
      title="${regionName}"
      level="${level}"${parentRegion ? `\n      parentRegion="${parentRegion}"` : ''}${hasSubRegions ? `\n      sidebarLinks={${linksConstName}}` : ''}
      contentFile="${guideFile}"
    />
  );
}
`;

  return template;
}

/**
 * Generate page.tsx file for a region
 */
function generatePage(
  regionSlug: string,
  options: {
    force?: boolean;
    dryRun?: boolean;
    backup?: boolean;
  } = {}
): { success: boolean; path?: string; message: string } {
  const region = getRegionConfig(regionSlug);

  if (!region) {
    return {
      success: false,
      message: `Region "${regionSlug}" not found in config`,
    };
  }

  // Get region details
  const regionPath = getRegionPath(regionSlug);
  const parentRegion = getParentRegion(regionSlug);
  const sidebarLinks = getSidebarLinks(regionSlug);
  const guideFile = region.guideFile || `${regionSlug}-guide.md`;

  // Determine output path
  const appDir = path.join(process.cwd(), 'app', 'regions');
  const pagePath = path.join(appDir, regionPath, 'page.tsx');
  const pageDir = path.dirname(pagePath);

  // Check if file exists
  if (fs.existsSync(pagePath) && !options.force) {
    return {
      success: false,
      path: pagePath,
      message: `Page already exists (use --force to overwrite)`,
    };
  }

  // Dry run - just show what would happen
  if (options.dryRun) {
    const content = generatePageTemplate(
      region.name,
      regionSlug,
      region.level,
      parentRegion?.name,
      sidebarLinks,
      guideFile
    );

    return {
      success: true,
      path: pagePath,
      message: `Would create:\n${content}`,
    };
  }

  // Create backup if file exists
  if (fs.existsSync(pagePath) && options.backup) {
    const backupDir = path.join(process.cwd(), '.backup', 'pages');
    fs.mkdirSync(backupDir, { recursive: true });

    const backupPath = path.join(
      backupDir,
      `${regionSlug}-page-${Date.now()}.tsx.bak`
    );
    fs.copyFileSync(pagePath, backupPath);
  }

  // Create directory structure
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  // Generate and write file
  const content = generatePageTemplate(
    region.name,
    regionSlug,
    region.level,
    parentRegion?.name,
    sidebarLinks,
    guideFile
  );

  fs.writeFileSync(pagePath, content, 'utf-8');

  return {
    success: true,
    path: pagePath,
    message: `Created page template`,
  };
}

/**
 * Generate pages for all regions
 */
function generateAllPages(options: {
  force?: boolean;
  dryRun?: boolean;
  backup?: boolean;
  level?: 'country' | 'region' | 'sub-region';
}) {
  console.log('\n📄 PAGE TEMPLATE GENERATOR');
  console.log('='.repeat(70));

  let regions = getAllRegions(options.level);

  if (regions.length === 0) {
    console.log('No regions found in config.');
    return;
  }

  console.log(`Generating pages for ${regions.length} regions...`);
  if (options.dryRun) {
    console.log('DRY RUN - No files will be created\n');
  }

  const results: Array<{
    region: string;
    success: boolean;
    path?: string;
    message: string;
  }> = [];

  for (const region of regions) {
    const result = generatePage(region.slug, options);
    results.push({
      region: region.name,
      success: result.success,
      path: result.path,
      message: result.message,
    });

    if (result.success) {
      console.log(`✅ ${region.name}: ${result.path}`);
      if (options.dryRun) {
        console.log(result.message);
        console.log('');
      }
    } else {
      console.log(`⏭️  ${region.name}: ${result.message}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 SUMMARY');
  console.log('='.repeat(70));

  const created = results.filter(r => r.success && !options.dryRun);
  const skipped = results.filter(r => !r.success);

  console.log(`✅ ${options.dryRun ? 'Would create' : 'Created'}: ${created.length}`);
  console.log(`⏭️  Skipped: ${skipped.length}`);

  console.log('\n' + '='.repeat(70));
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: npx tsx scripts/generate-page-template.ts [region-slug] [options]

Arguments:
  region-slug          Slug of the region (e.g., "burgundy", "piedmont")
                       Omit to show help

Options:
  --all                Generate pages for all regions in config
  --level <level>      With --all, only generate for specific level
  --force              Overwrite existing pages
  --dry-run            Preview what would be created without writing files
  --backup             Create backup before overwriting
  --help, -h           Show this help message

Examples:
  # Generate single page
  npx tsx scripts/generate-page-template.ts burgundy

  # Generate all missing pages
  npx tsx scripts/generate-page-template.ts --all

  # Generate all region-level pages
  npx tsx scripts/generate-page-template.ts --all --level region

  # Dry run to preview
  npx tsx scripts/generate-page-template.ts --all --dry-run

  # Force overwrite existing with backup
  npx tsx scripts/generate-page-template.ts burgundy --force --backup
`);
    process.exit(0);
  }

  const force = args.includes('--force');
  const dryRun = args.includes('--dry-run');
  const backup = args.includes('--backup');
  const all = args.includes('--all');

  const levelIndex = args.indexOf('--level');
  const level = levelIndex !== -1
    ? args[levelIndex + 1] as 'country' | 'region' | 'sub-region'
    : undefined;

  if (all) {
    generateAllPages({ force, dryRun, backup, level });
  } else {
    const regionSlug = args.find(arg => !arg.startsWith('--'));

    if (!regionSlug) {
      console.log('Error: Please provide a region slug or use --all');
      console.log('Run with --help for usage information');
      process.exit(1);
    }

    const result = generatePage(regionSlug, { force, dryRun, backup });

    console.log('\n📄 PAGE TEMPLATE GENERATOR');
    console.log('='.repeat(70));

    if (result.success) {
      console.log(`✅ ${result.message}`);
      console.log(`   Path: ${result.path}`);
      if (dryRun) {
        console.log('\n' + result.message);
      }
    } else {
      console.log(`❌ ${result.message}`);
      if (result.path) {
        console.log(`   Path: ${result.path}`);
      }
    }

    console.log('='.repeat(70));

    process.exit(result.success ? 0 : 1);
  }
}

export { generatePage, generateAllPages };
