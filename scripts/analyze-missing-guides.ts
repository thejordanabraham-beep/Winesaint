/**
 * Analyze missing guides by country from audit report
 */

import * as fs from 'fs';
import * as path from 'path';

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
  summary: {
    missingGuides: number;
    mislocatedGuides: number;
    workingPages: number;
    orphanedGuides: number;
  };
}

const auditPath = path.join(process.cwd(), 'wine-region-pages-audit.json');
const data: AuditReport = JSON.parse(fs.readFileSync(auditPath, 'utf-8'));

const missingByCountry: Record<string, string[]> = {};

// Group missing guides by country
data.pagesWithIssues
  .filter(p => p.guideLocation === 'missing')
  .forEach(page => {
    const parts = page.url.split('/').filter(Boolean);
    const country = parts[1] || 'unknown';

    if (!missingByCountry[country]) {
      missingByCountry[country] = [];
    }
    missingByCountry[country].push(page.url);
  });

// Sort by count
const sorted = Object.entries(missingByCountry)
  .map(([country, pages]) => ({ country, count: pages.length, pages }))
  .sort((a, b) => b.count - a.count);

console.log('COUNTRIES WITH MISSING GUIDES:');
console.log('='.repeat(70));
console.log('');

sorted.forEach(({ country, count, pages }) => {
  console.log(`${country.toUpperCase().padEnd(25)} ${count} missing guides`);

  // Show first 5 examples for major countries
  if (count > 5) {
    pages.slice(0, 5).forEach(url => {
      const regionName = url.split('/').pop();
      console.log(`  • ${regionName}`);
    });
    if (count > 5) {
      console.log(`  ... and ${count - 5} more`);
    }
  } else {
    pages.forEach(url => {
      const regionName = url.split('/').pop();
      console.log(`  • ${regionName}`);
    });
  }
  console.log('');
});

console.log('='.repeat(70));
console.log(`Total: ${data.summary.missingGuides} missing guides across ${sorted.length} countries`);
