/**
 * WINE REGION PAGES AUDIT
 * Crawls all wine region pages to identify:
 * 1. Missing guide files
 * 2. Mislocated guide files
 * 3. Broken content references
 * 4. Pages that need to be completed
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface PageIssue {
  pagePath: string;
  url: string;
  contentFile?: string;
  issues: string[];
  guideLocation?: string;
}

interface AuditReport {
  totalPages: number;
  pagesWithIssues: PageIssue[];
  mislocatedGuides: { guidePath: string; correctPath: string }[];
  orphanedGuides: string[];
  summary: {
    missingGuides: number;
    mislocatedGuides: number;
    workingPages: number;
    orphanedGuides: number;
  };
}

/**
 * Extract contentFile from page.tsx
 */
function extractContentFile(pageContent: string): string | null {
  // Match: contentFile="filename.md"
  const match = pageContent.match(/contentFile=["']([^"']+)["']/);
  return match ? match[1] : null;
}

/**
 * Convert file path to URL path
 */
function filePathToUrl(filePath: string): string {
  return filePath
    .replace('app/regions/', '/regions/')
    .replace('/page.tsx', '')
    .replace(/\\/g, '/');
}

/**
 * Find all page.tsx files
 */
async function findAllPages(): Promise<string[]> {
  const pages = await glob('app/regions/**/page.tsx', {
    ignore: ['**/node_modules/**'],
    cwd: process.cwd()
  });
  return pages;
}

/**
 * Find all guide files
 */
async function findAllGuides(): Promise<string[]> {
  const guides = await glob('**/*-guide.md', {
    ignore: ['**/node_modules/**'],
    cwd: process.cwd()
  });
  return guides;
}

/**
 * Audit a single page
 */
function auditPage(pagePath: string): PageIssue {
  const pageContent = fs.readFileSync(pagePath, 'utf-8');
  const contentFile = extractContentFile(pageContent);
  const url = filePathToUrl(pagePath);
  const issues: string[] = [];
  let guideLocation: string | undefined;

  if (!contentFile) {
    issues.push('No contentFile specified in page component');
  } else {
    // Check if guide exists in correct location (guides/)
    const correctPath = path.join('guides', contentFile);
    const pageDir = path.dirname(pagePath);
    const wrongPath = path.join(pageDir, contentFile);

    if (fs.existsSync(correctPath)) {
      guideLocation = 'correct';
    } else if (fs.existsSync(wrongPath)) {
      guideLocation = 'mislocated';
      issues.push(`Guide file in wrong location: ${wrongPath} (should be in guides/)`);
    } else {
      guideLocation = 'missing';
      issues.push(`Guide file missing: ${contentFile}`);
    }
  }

  return {
    pagePath,
    url,
    contentFile: contentFile || undefined,
    issues,
    guideLocation
  };
}

/**
 * Find orphaned guide files (guides with no corresponding page)
 */
function findOrphanedGuides(pages: PageIssue[], allGuides: string[]): string[] {
  const referencedGuides = new Set(
    pages
      .filter(p => p.contentFile && p.guideLocation === 'correct')
      .map(p => p.contentFile!)
  );

  return allGuides
    .filter(guide => guide.startsWith('guides/'))
    .map(guide => path.basename(guide))
    .filter(guide => !referencedGuides.has(guide));
}

/**
 * Main audit function
 */
async function auditAllPages(): Promise<AuditReport> {
  console.log('🔍 WINE REGION PAGES AUDIT');
  console.log('='.repeat(70));
  console.log('Scanning all wine region pages...\n');

  const allPagePaths = await findAllPages();
  const allGuides = await findAllGuides();

  console.log(`Found ${allPagePaths.length} pages`);
  console.log(`Found ${allGuides.length} guide files\n`);

  const pageAudits = allPagePaths.map(auditPage);
  const pagesWithIssues = pageAudits.filter(p => p.issues.length > 0);
  const mislocatedGuides = pageAudits
    .filter(p => p.guideLocation === 'mislocated')
    .map(p => ({
      guidePath: path.join(path.dirname(p.pagePath), p.contentFile!),
      correctPath: path.join('guides', p.contentFile!)
    }));

  const orphanedGuides = findOrphanedGuides(pageAudits, allGuides);

  const report: AuditReport = {
    totalPages: allPagePaths.length,
    pagesWithIssues,
    mislocatedGuides,
    orphanedGuides,
    summary: {
      missingGuides: pagesWithIssues.filter(p => p.guideLocation === 'missing').length,
      mislocatedGuides: mislocatedGuides.length,
      workingPages: allPagePaths.length - pagesWithIssues.length,
      orphanedGuides: orphanedGuides.length
    }
  };

  return report;
}

/**
 * Print report
 */
function printReport(report: AuditReport) {
  console.log('='.repeat(70));
  console.log('📊 AUDIT SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total pages: ${report.totalPages}`);
  console.log(`✅ Working pages: ${report.summary.workingPages}`);
  console.log(`❌ Pages with issues: ${report.pagesWithIssues.length}`);
  console.log(`  - Missing guides: ${report.summary.missingGuides}`);
  console.log(`  - Mislocated guides: ${report.summary.mislocatedGuides}`);
  console.log(`🗑️  Orphaned guides: ${report.summary.orphanedGuides}`);
  console.log('='.repeat(70));

  if (report.pagesWithIssues.length > 0) {
    console.log('\n❌ PAGES WITH ISSUES:\n');

    // Group by issue type
    const missingGuides = report.pagesWithIssues.filter(p => p.guideLocation === 'missing');
    const mislocatedPages = report.pagesWithIssues.filter(p => p.guideLocation === 'mislocated');
    const noContentFile = report.pagesWithIssues.filter(p => !p.contentFile);

    if (missingGuides.length > 0) {
      console.log('📄 MISSING GUIDE FILES:');
      missingGuides.forEach(page => {
        console.log(`  • ${page.url}`);
        console.log(`    File: ${page.contentFile}`);
      });
      console.log('');
    }

    if (mislocatedPages.length > 0) {
      console.log('📁 MISLOCATED GUIDE FILES:');
      mislocatedPages.forEach(page => {
        console.log(`  • ${page.url}`);
        console.log(`    Current: ${path.join(path.dirname(page.pagePath), page.contentFile!)}`);
        console.log(`    Should be: guides/${page.contentFile}`);
      });
      console.log('');
    }

    if (noContentFile.length > 0) {
      console.log('⚠️  NO CONTENT FILE SPECIFIED:');
      noContentFile.forEach(page => {
        console.log(`  • ${page.url}`);
      });
      console.log('');
    }
  }

  if (report.orphanedGuides.length > 0) {
    console.log('🗑️  ORPHANED GUIDE FILES (no page references them):');
    report.orphanedGuides.forEach(guide => {
      console.log(`  • ${guide}`);
    });
    console.log('');
  }

  // Export detailed report
  const reportPath = 'wine-region-pages-audit.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📋 Detailed report saved to: ${reportPath}`);
}

/**
 * Generate TODO list
 */
function generateTodoList(report: AuditReport) {
  console.log('\n='.repeat(70));
  console.log('📝 TODO LIST - PAGES THAT NEED COMPLETION');
  console.log('='.repeat(70));

  const missingGuides = report.pagesWithIssues.filter(p => p.guideLocation === 'missing');

  if (missingGuides.length === 0) {
    console.log('✅ All pages have guide files!');
    return;
  }

  // Group by region
  const byRegion = new Map<string, PageIssue[]>();

  missingGuides.forEach(page => {
    const parts = page.url.split('/').filter(Boolean);
    const country = parts[1] || 'unknown';
    const region = parts[2] || 'unknown';
    const key = `${country}/${region}`;

    if (!byRegion.has(key)) {
      byRegion.set(key, []);
    }
    byRegion.get(key)!.push(page);
  });

  byRegion.forEach((pages, region) => {
    console.log(`\n${region.toUpperCase()} (${pages.length} missing guides):`);
    pages.forEach(page => {
      const name = page.url.split('/').pop() || 'unknown';
      console.log(`  • ${name} → ${page.contentFile}`);
    });
  });

  console.log('\n');
}

/**
 * Execute audit
 */
async function main() {
  try {
    const report = await auditAllPages();
    printReport(report);
    generateTodoList(report);
  } catch (error) {
    console.error('Error during audit:', error);
    process.exit(1);
  }
}

main();
