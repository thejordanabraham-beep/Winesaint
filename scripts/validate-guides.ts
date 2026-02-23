/**
 * GUIDE VALIDATION CLI TOOL
 *
 * Validates existing wine region guides for quality standards.
 * Reports errors, warnings, and metrics.
 */

import { validateGuide, formatValidationResult, type ValidationResult } from '../lib/validators/guide-validator';
import { getRegionConfig } from '../lib/guide-config';
import fs from 'fs';
import path from 'path';

interface ValidationReport {
  file: string;
  regionName: string;
  level: 'country' | 'region' | 'sub-region' | 'unknown';
  result: ValidationResult;
}

/**
 * Infer region level from filename or content
 */
function inferLevel(filename: string, content: string): 'country' | 'region' | 'sub-region' | 'unknown' {
  // Try to get from config
  const slug = filename.replace('-guide.md', '');
  const region = getRegionConfig(slug);
  if (region) {
    return region.level;
  }

  // Infer from word count
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 2000) return 'sub-region';
  if (wordCount < 4000) return 'region';
  if (wordCount < 6000) return 'country';

  return 'unknown';
}

/**
 * Validate a single guide file
 */
function validateGuideFile(filePath: string): ValidationReport {
  const filename = path.basename(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');

  const level = inferLevel(filename, content);
  const regionName = filename
    .replace('-guide.md', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Validate
  const result = level === 'unknown'
    ? {
        valid: false,
        errors: ['Could not determine guide level'],
        warnings: [],
        metrics: {
          wordCount: content.split(/\s+/).length,
          hasRequiredSections: false,
          sectionsFound: [],
          uniqueWordRatio: 0,
        },
      }
    : validateGuide(content, level);

  return {
    file: filePath,
    regionName,
    level,
    result,
  };
}

/**
 * Validate all guides in a directory
 */
function validateAllGuides(
  guidesDir: string,
  options: {
    errorsOnly?: boolean;
    json?: boolean;
  } = {}
): ValidationReport[] {
  if (!fs.existsSync(guidesDir)) {
    console.log(`❌ Guides directory not found: ${guidesDir}`);
    return [];
  }

  const files = fs.readdirSync(guidesDir)
    .filter(file => file.endsWith('.md') && file !== 'README.md')
    .map(file => path.join(guidesDir, file));

  const reports = files.map(file => validateGuideFile(file));

  // Filter if errors-only
  if (options.errorsOnly) {
    return reports.filter(r => !r.result.valid);
  }

  return reports;
}

/**
 * Display validation reports
 */
function displayReports(reports: ValidationReport[], options: { json?: boolean } = {}) {
  if (options.json) {
    console.log(JSON.stringify(reports, null, 2));
    return;
  }

  console.log('\n🔍 GUIDE VALIDATION REPORT');
  console.log('='.repeat(70));
  console.log('');

  const pass = reports.filter(r => r.result.valid);
  const warnings = reports.filter(r => r.result.valid && r.result.warnings.length > 0);
  const fail = reports.filter(r => !r.result.valid);

  // Show all reports
  for (const report of reports) {
    const filename = path.basename(report.file);
    console.log(formatValidationResult(report.result, filename));
    console.log('');
  }

  // Summary
  console.log('='.repeat(70));
  console.log('📊 SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Pass: ${pass.length}`);
  console.log(`⚠️  Warnings: ${warnings.length}`);
  console.log(`❌ Fail: ${fail.length}`);
  console.log(`📝 Total: ${reports.length}`);

  // Quality metrics
  if (reports.length > 0) {
    const avgWordCount = reports.reduce((sum, r) => sum + r.result.metrics.wordCount, 0) / reports.length;
    const avgUniqueness = reports.reduce((sum, r) => sum + r.result.metrics.uniqueWordRatio, 0) / reports.length;

    console.log('');
    console.log('📈 QUALITY METRICS');
    console.log(`   Avg word count: ${Math.round(avgWordCount).toLocaleString()}`);
    console.log(`   Avg uniqueness: ${(avgUniqueness * 100).toFixed(1)}%`);
  }

  // By level
  const byLevel: Record<string, number> = {};
  for (const report of reports) {
    byLevel[report.level] = (byLevel[report.level] || 0) + 1;
  }

  console.log('');
  console.log('📊 BY LEVEL');
  for (const [level, count] of Object.entries(byLevel)) {
    console.log(`   ${level}: ${count}`);
  }

  console.log('='.repeat(70));

  // Exit code
  if (fail.length > 0) {
    process.exit(1);
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: npx tsx scripts/validate-guides.ts [file] [options]

Arguments:
  file                 Path to a single guide file to validate
                       Omit to validate all guides

Options:
  --all                Validate all guides in guides/ directory
  --errors-only        Show only guides with errors
  --json               Output results as JSON
  --help, -h           Show this help message

Examples:
  # Validate single guide
  npx tsx scripts/validate-guides.ts guides/burgundy-guide.md

  # Validate all guides
  npx tsx scripts/validate-guides.ts --all

  # Show only errors
  npx tsx scripts/validate-guides.ts --all --errors-only

  # Export JSON report
  npx tsx scripts/validate-guides.ts --all --json > validation-report.json

Exit Codes:
  0 - All guides pass validation
  1 - One or more guides fail validation
`);
    process.exit(0);
  }

  const errorsOnly = args.includes('--errors-only');
  const json = args.includes('--json');
  const all = args.includes('--all');

  const guidesDir = path.join(process.cwd(), 'guides');

  if (all) {
    // Validate all guides
    const reports = validateAllGuides(guidesDir, { errorsOnly, json });

    if (reports.length === 0) {
      console.log('No guides found to validate.');
      process.exit(0);
    }

    displayReports(reports, { json });
  } else {
    // Validate single file
    const filePath = args.find(arg => !arg.startsWith('--'));

    if (!filePath) {
      console.log('Error: Please provide a guide file path or use --all');
      console.log('Run with --help for usage information');
      process.exit(1);
    }

    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filePath}`);
      process.exit(1);
    }

    const report = validateGuideFile(filePath);
    displayReports([report], { json });
  }
}

export { validateGuideFile, validateAllGuides };
