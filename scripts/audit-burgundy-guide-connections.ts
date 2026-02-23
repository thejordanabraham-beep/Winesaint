import fs from 'fs';
import path from 'path';

/**
 * AUDIT BURGUNDY GUIDE CONNECTIONS
 *
 * Check that all vineyard pages correctly reference guide files,
 * and that all guide files exist.
 */

const BURGUNDY_PATH = '/Users/jordanabraham/wine-reviews/app/regions/france/burgundy';
const GUIDES_PATH = '/Users/jordanabraham/wine-reviews/guides';

const SUB_REGIONS = [
  { name: 'Côte de Nuits', slug: 'cote-de-nuits' },
  { name: 'Côte de Beaune', slug: 'cote-de-beaune' },
  { name: 'Côte Chalonnaise', slug: 'cote-chalonnaise' },
];

interface Issue {
  type: 'missing-guide' | 'wrong-reference' | 'no-content-file';
  vineyard: string;
  commune: string;
  subRegion: string;
  expected?: string;
  actual?: string;
}

const issues: Issue[] = [];
let totalVineyards = 0;
let connected = 0;

function extractContentFile(pageContent: string): string | null {
  const match = pageContent.match(/contentFile=["']([^"']+)["']/);
  return match ? match[1] : null;
}

function checkVineyard(vineyardSlug: string, communeSlug: string, subRegionSlug: string) {
  totalVineyards++;

  const vineyardPath = path.join(BURGUNDY_PATH, subRegionSlug, communeSlug, vineyardSlug);
  const pagePath = path.join(vineyardPath, 'page.tsx');

  if (!fs.existsSync(pagePath)) {
    console.log(`⚠️  No page.tsx: ${subRegionSlug}/${communeSlug}/${vineyardSlug}`);
    return;
  }

  const pageContent = fs.readFileSync(pagePath, 'utf-8');
  const contentFile = extractContentFile(pageContent);

  if (!contentFile) {
    issues.push({
      type: 'no-content-file',
      vineyard: vineyardSlug,
      commune: communeSlug,
      subRegion: subRegionSlug,
    });
    return;
  }

  // Expected guide filename (use what page.tsx actually references)
  const expectedGuideFile = contentFile;
  const guidePath = path.join(GUIDES_PATH, contentFile);

  // Check if guide exists
  if (!fs.existsSync(guidePath)) {
    issues.push({
      type: 'missing-guide',
      vineyard: vineyardSlug,
      commune: communeSlug,
      subRegion: subRegionSlug,
      expected: expectedGuideFile,
      actual: contentFile,
    });
  } else if (contentFile !== expectedGuideFile) {
    issues.push({
      type: 'wrong-reference',
      vineyard: vineyardSlug,
      commune: communeSlug,
      subRegion: subRegionSlug,
      expected: expectedGuideFile,
      actual: contentFile,
    });
  } else {
    connected++;
  }
}

function auditSubRegion(subRegion: typeof SUB_REGIONS[0]) {
  const subRegionPath = path.join(BURGUNDY_PATH, subRegion.slug);
  if (!fs.existsSync(subRegionPath)) return;

  const communes = fs.readdirSync(subRegionPath, { withFileTypes: true });

  for (const commune of communes) {
    if (!commune.isDirectory()) continue;

    const communePath = path.join(subRegionPath, commune.name);
    const vineyards = fs.readdirSync(communePath, { withFileTypes: true });

    for (const vineyard of vineyards) {
      if (!vineyard.isDirectory()) continue;
      checkVineyard(vineyard.name, commune.name, subRegion.slug);
    }
  }
}

function printReport() {
  console.log('🔍 BURGUNDY GUIDE CONNECTION AUDIT\n');
  console.log('═'.repeat(80));

  console.log(`\n📊 SUMMARY:`);
  console.log(`   Total vineyards: ${totalVineyards}`);
  console.log(`   Connected: ${connected}`);
  console.log(`   Issues: ${issues.length}\n`);

  if (issues.length === 0) {
    console.log('✅ All guides properly connected!');
    return;
  }

  console.log('═'.repeat(80));
  console.log('\n❌ ISSUES FOUND:\n');

  // Group by type
  const byType: Record<string, Issue[]> = {
    'missing-guide': [],
    'wrong-reference': [],
    'no-content-file': [],
  };

  issues.forEach(issue => byType[issue.type].push(issue));

  if (byType['no-content-file'].length > 0) {
    console.log(`\n🚫 NO CONTENT FILE REFERENCE (${byType['no-content-file'].length}):`);
    byType['no-content-file'].forEach(issue => {
      console.log(`   ${issue.subRegion}/${issue.commune}/${issue.vineyard}`);
    });
  }

  if (byType['missing-guide'].length > 0) {
    console.log(`\n📄 GUIDE FILE MISSING (${byType['missing-guide'].length}):`);
    byType['missing-guide'].forEach(issue => {
      console.log(`   ${issue.vineyard} → expects: ${issue.expected}`);
    });
  }

  if (byType['wrong-reference'].length > 0) {
    console.log(`\n🔗 WRONG REFERENCE (${byType['wrong-reference'].length}):`);
    byType['wrong-reference'].forEach(issue => {
      console.log(`   ${issue.vineyard}`);
      console.log(`      Expected: ${issue.expected}`);
      console.log(`      Actual:   ${issue.actual}`);
    });
  }

  console.log('\n═'.repeat(80));
  console.log('\n💡 Next step: Fix issues to ensure all guides display properly');
}

console.log('Starting audit...\n');
SUB_REGIONS.forEach(auditSubRegion);
printReport();
