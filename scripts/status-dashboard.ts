/**
 * STATUS DASHBOARD
 *
 * Shows what guides exist, what's missing, and overall coverage statistics
 */

import { getAllRegions, REGION_HIERARCHY } from '../lib/guide-config';
import * as fs from 'fs';
import * as path from 'path';

interface StatusReport {
  total: number;
  existing: number;
  missing: number;
  coverage: number;
  byLevel: Record<string, { total: number; existing: number; missing: number }>;
  missingGuides: Array<{ name: string; slug: string; level: string; parent?: string }>;
}

/**
 * Check if a guide file exists
 */
function guideExists(slug: string): boolean {
  const guidesDir = path.join(process.cwd(), 'guides');
  const guidePath = path.join(guidesDir, `${slug}-guide.md`);
  return fs.existsSync(guidePath);
}

/**
 * Generate status report
 */
function generateStatusReport(): StatusReport {
  const allRegions = getAllRegions();

  const report: StatusReport = {
    total: allRegions.length,
    existing: 0,
    missing: 0,
    coverage: 0,
    byLevel: {
      country: { total: 0, existing: 0, missing: 0 },
      region: { total: 0, existing: 0, missing: 0 },
      'sub-region': { total: 0, existing: 0, missing: 0 },
    },
    missingGuides: [],
  };

  for (const region of allRegions) {
    const exists = guideExists(region.slug);

    // Overall stats
    if (exists) {
      report.existing++;
    } else {
      report.missing++;
      report.missingGuides.push({
        name: region.name,
        slug: region.slug,
        level: region.level,
        parent: region.parent,
      });
    }

    // By level stats
    report.byLevel[region.level].total++;
    if (exists) {
      report.byLevel[region.level].existing++;
    } else {
      report.byLevel[region.level].missing++;
    }
  }

  report.coverage = (report.existing / report.total) * 100;

  return report;
}

/**
 * Display status dashboard
 */
function displayDashboard(report: StatusReport) {
  console.log('\n📊 WINE REGION GUIDE STATUS DASHBOARD');
  console.log('='.repeat(70));

  // Overall stats
  console.log('\n📈 OVERALL COVERAGE');
  console.log(`   Total regions: ${report.total}`);
  console.log(`   ✅ Guides exist: ${report.existing} (${report.coverage.toFixed(1)}%)`);
  console.log(`   ❌ Missing guides: ${report.missing}`);

  // Coverage by level
  console.log('\n📊 BY LEVEL');
  for (const [level, stats] of Object.entries(report.byLevel)) {
    const coverage = stats.total > 0 ? (stats.existing / stats.total) * 100 : 0;
    console.log(`   ${level}:`);
    console.log(`      Total: ${stats.total}`);
    console.log(`      Existing: ${stats.existing} (${coverage.toFixed(1)}%)`);
    console.log(`      Missing: ${stats.missing}`);
  }

  // Missing guides grouped by level
  if (report.missingGuides.length > 0) {
    console.log('\n❌ MISSING GUIDES');

    const byLevel = {
      country: report.missingGuides.filter(g => g.level === 'country'),
      region: report.missingGuides.filter(g => g.level === 'region'),
      'sub-region': report.missingGuides.filter(g => g.level === 'sub-region'),
    };

    for (const [level, guides] of Object.entries(byLevel)) {
      if (guides.length === 0) continue;

      console.log(`\n   ${level.toUpperCase()} (${guides.length}):`);
      guides.forEach(g => {
        const parentText = g.parent ? ` (${g.parent})` : '';
        console.log(`      • ${g.name}${parentText} → ${g.slug}-guide.md`);
      });
    }
  }

  // Estimated cost to complete
  if (report.missing > 0) {
    const avgCosts = {
      country: 0.45,
      region: 0.65,
      'sub-region': 0.35,
    };

    let estimatedCost = 0;
    for (const [level, stats] of Object.entries(report.byLevel)) {
      estimatedCost += stats.missing * avgCosts[level as keyof typeof avgCosts];
    }

    console.log('\n💰 ESTIMATED COST TO COMPLETE');
    console.log(`   ${report.missing} guides × avg cost = $${estimatedCost.toFixed(2)}`);
  }

  console.log('\n' + '='.repeat(70));
}

// CLI usage
if (require.main === module) {
  const report = generateStatusReport();
  displayDashboard(report);

  // Export JSON if requested
  const args = process.argv.slice(2);
  if (args.includes('--json')) {
    console.log(JSON.stringify(report, null, 2));
  }
}

export { generateStatusReport, displayDashboard };
