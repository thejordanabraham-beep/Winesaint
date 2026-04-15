/**
 * Comprehensive audit of ALL region pages
 * Checks every level: country, region, subregion, village, vineyard
 * Identifies what's missing or broken
 */

import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'app/(main)/data/region-configs.json');
const GUIDES_DIR = path.join(process.cwd(), 'guides');
const BACKUP_DIR = path.join(process.cwd(), 'regions-pages-backup');

interface RegionConfig {
  title: string;
  level: string;
  contentFile?: string;
  parentRegion?: string;
  sidebarLinks?: Array<{ name: string; slug: string; classification?: string }>;
  sidebarTitle?: string;
  classification?: string;
}

const configs: Record<string, RegionConfig> = JSON.parse(
  fs.readFileSync(CONFIG_PATH, 'utf-8')
);

// Group configs by level
const byLevel: Record<string, string[]> = {
  country: [],
  region: [],
  subregion: [],
  village: [],
  vineyard: [],
};

for (const [slug, config] of Object.entries(configs)) {
  const level = config.level === 'sub-region' ? 'subregion' : config.level;
  if (byLevel[level]) {
    byLevel[level].push(slug);
  }
}

console.log('='.repeat(60));
console.log('COMPREHENSIVE PAGE AUDIT');
console.log('='.repeat(60));

// Stats
const issues: {
  missingGuide: string[];
  missingSidebarLinks: string[];
  emptyTitle: string[];
  noParent: string[];
  backupHadDataWeDoNot: string[];
} = {
  missingGuide: [],
  missingSidebarLinks: [],
  emptyTitle: [],
  noParent: [],
  backupHadDataWeDoNot: [],
};

// Check each level
for (const level of ['country', 'region', 'subregion', 'village', 'vineyard']) {
  const slugs = byLevel[level] || [];
  console.log(`\n${'='.repeat(60)}`);
  console.log(`LEVEL: ${level.toUpperCase()} (${slugs.length} pages)`);
  console.log('='.repeat(60));

  let withSidebar = 0;
  let withoutSidebar = 0;
  let withGuide = 0;
  let withoutGuide = 0;

  for (const slug of slugs) {
    const config = configs[slug];

    // Check guide file
    const guideFile = config.contentFile || `${slug.split('/').pop()}-guide.md`;
    const guidePath = path.join(GUIDES_DIR, guideFile);
    const hasGuide = fs.existsSync(guidePath);

    if (hasGuide) {
      withGuide++;
    } else {
      withoutGuide++;
      issues.missingGuide.push(`${level}: ${slug} (expected: ${guideFile})`);
    }

    // Check sidebar links (not needed for vineyard level)
    if (level !== 'vineyard') {
      if (config.sidebarLinks && config.sidebarLinks.length > 0) {
        withSidebar++;
      } else {
        withoutSidebar++;
        // Only flag as issue if it's a level that SHOULD have children
        if (level === 'village') {
          issues.missingSidebarLinks.push(slug);
        }
      }
    }

    // Check parent (not needed for country level)
    if (level !== 'country' && !config.parentRegion) {
      issues.noParent.push(`${level}: ${slug}`);
    }

    // Check if backup had more data
    const backupPath = path.join(BACKUP_DIR, slug, 'page.tsx');
    if (fs.existsSync(backupPath)) {
      const backupContent = fs.readFileSync(backupPath, 'utf-8');

      // Check if backup had vineyardData or fetched from Sanity
      if (backupContent.includes('vineyardData') || backupContent.includes('getClimatData') || backupContent.includes('sanity')) {
        if (level === 'vineyard') {
          issues.backupHadDataWeDoNot.push(slug);
        }
      }
    }
  }

  console.log(`  With guide file: ${withGuide}`);
  console.log(`  Missing guide: ${withoutGuide}`);
  if (level !== 'vineyard') {
    console.log(`  With sidebarLinks: ${withSidebar}`);
    console.log(`  Without sidebarLinks: ${withoutSidebar}`);
  }
}

// Summary of issues
console.log('\n' + '='.repeat(60));
console.log('ISSUES FOUND');
console.log('='.repeat(60));

console.log(`\n❌ MISSING GUIDE FILES: ${issues.missingGuide.length}`);
if (issues.missingGuide.length > 0 && issues.missingGuide.length <= 20) {
  issues.missingGuide.forEach(s => console.log(`   - ${s}`));
} else if (issues.missingGuide.length > 20) {
  issues.missingGuide.slice(0, 10).forEach(s => console.log(`   - ${s}`));
  console.log(`   ... and ${issues.missingGuide.length - 10} more`);
}

console.log(`\n❌ VILLAGES WITHOUT SIDEBAR LINKS: ${issues.missingSidebarLinks.length}`);
if (issues.missingSidebarLinks.length > 0 && issues.missingSidebarLinks.length <= 20) {
  issues.missingSidebarLinks.forEach(s => console.log(`   - ${s}`));
} else if (issues.missingSidebarLinks.length > 20) {
  issues.missingSidebarLinks.slice(0, 10).forEach(s => console.log(`   - ${s}`));
  console.log(`   ... and ${issues.missingSidebarLinks.length - 10} more`);
}

console.log(`\n❌ PAGES WITHOUT PARENT: ${issues.noParent.length}`);
if (issues.noParent.length > 0 && issues.noParent.length <= 20) {
  issues.noParent.forEach(s => console.log(`   - ${s}`));
} else if (issues.noParent.length > 20) {
  issues.noParent.slice(0, 10).forEach(s => console.log(`   - ${s}`));
  console.log(`   ... and ${issues.noParent.length - 10} more`);
}

console.log(`\n⚠️ VINEYARDS THAT HAD SANITY DATA (now missing): ${issues.backupHadDataWeDoNot.length}`);
if (issues.backupHadDataWeDoNot.length > 0) {
  issues.backupHadDataWeDoNot.slice(0, 20).forEach(s => console.log(`   - ${s}`));
  if (issues.backupHadDataWeDoNot.length > 20) {
    console.log(`   ... and ${issues.backupHadDataWeDoNot.length - 20} more`);
  }
}

// Check specific patterns that might indicate problems
console.log('\n' + '='.repeat(60));
console.log('CHECKING SPECIFIC PATTERNS');
console.log('='.repeat(60));

// Countries without sidebar
const countriesWithoutSidebar = byLevel.country.filter(slug => {
  const config = configs[slug];
  return !config.sidebarLinks || config.sidebarLinks.length === 0;
});
console.log(`\n⚠️ COUNTRIES WITHOUT SIDEBAR LINKS: ${countriesWithoutSidebar.length}`);
countriesWithoutSidebar.slice(0, 10).forEach(s => console.log(`   - ${s}`));

// Regions without sidebar
const regionsWithoutSidebar = byLevel.region.filter(slug => {
  const config = configs[slug];
  return !config.sidebarLinks || config.sidebarLinks.length === 0;
});
console.log(`\n⚠️ REGIONS WITHOUT SIDEBAR LINKS: ${regionsWithoutSidebar.length}`);
regionsWithoutSidebar.slice(0, 10).forEach(s => console.log(`   - ${s}`));

// Subregions without sidebar
const subregionsWithoutSidebar = byLevel.subregion.filter(slug => {
  const config = configs[slug];
  return !config.sidebarLinks || config.sidebarLinks.length === 0;
});
console.log(`\n⚠️ SUBREGIONS WITHOUT SIDEBAR LINKS: ${subregionsWithoutSidebar.length}`);
subregionsWithoutSidebar.slice(0, 10).forEach(s => console.log(`   - ${s}`));

console.log('\n' + '='.repeat(60));
console.log('AUDIT COMPLETE');
console.log('='.repeat(60));
