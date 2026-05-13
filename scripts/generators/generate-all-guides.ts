/**
 * BATCH GUIDE GENERATOR
 *
 * Generates multiple wine region guides with:
 * - Parallel execution (2-3 concurrent guides)
 * - Cost tracking and estimation
 * - Content validation
 * - Real-time progress
 * - Comprehensive dashboard
 */

import { generateRegionGuide, type GenerationResult } from './wine-region-guide-generator';
import { getAllRegions, getRegionConfig, type RegionConfig } from '../lib/guide-config';
import { estimateCost, formatCost, calculateStatistics } from '../lib/api-costs';
import { ParallelQueue, formatDuration, type QueueTask, type QueueResult } from '../lib/queue/parallel-queue';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// Guide generation queue
interface GuideConfig {
  name: string;
  slug: string;
  level: 'country' | 'region' | 'sub-region';
  parent?: string;
  priority: number; // 1 = highest priority
}

/**
 * Build guide queue from REGION_HIERARCHY
 */
function buildGuideQueue(): GuideConfig[] {
  const queue: GuideConfig[] = [];
  const allRegions = getAllRegions();

  for (const region of allRegions) {
    const priority = region.level === 'country' ? 1
      : region.level === 'region' ? 2
      : 3;

    queue.push({
      name: region.name,
      slug: region.slug,
      level: region.level,
      parent: region.parent,
      priority,
    });
  }

  return queue;
}

/**
 * Ask user for confirmation
 */
async function askConfirmation(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(`${message} (y/n): `, answer => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * Generate guides with parallel execution, cost tracking, and validation
 */
async function generateAllGuides(options: {
  maxGuides?: number;
  level?: 'country' | 'region' | 'sub-region';
  force?: boolean;
  onlyGuides?: string[];
  concurrency?: number;
  generatePages?: boolean;
  dryRun?: boolean;
}) {
  const startTime = Date.now();

  console.log('\n🍷 BATCH WINE REGION GUIDE GENERATOR');
  console.log('='.repeat(70));

  // Build queue from config
  let queue = buildGuideQueue();

  // Filter by level
  if (options.level) {
    queue = queue.filter(g => g.level === options.level);
  }

  // Filter by --only flag
  if (options.onlyGuides && options.onlyGuides.length > 0) {
    queue = queue.filter(g =>
      options.onlyGuides!.some(slug =>
        g.slug === slug || g.name.toLowerCase() === slug.toLowerCase()
      )
    );
  }

  if (options.maxGuides) {
    queue = queue.slice(0, options.maxGuides);
  }

  // Skip existing guides unless --force
  const guidesDir = path.join(process.cwd(), 'guides');
  if (!fs.existsSync(guidesDir)) {
    fs.mkdirSync(guidesDir, { recursive: true });
  }

  const filteredQueue: GuideConfig[] = [];

  for (const guide of queue) {
    const filename = `${guide.slug}-guide.md`;
    const guidePath = path.join(guidesDir, filename);

    if (!options.force && fs.existsSync(guidePath)) {
      console.log(`⏭️  Skipping ${guide.name} - already exists (use --force to regenerate)`);
      continue;
    }
    filteredQueue.push(guide);
  }

  if (filteredQueue.length === 0) {
    console.log('\n✅ All guides already exist. Use --force to regenerate.');
    return;
  }

  // Cost estimation
  console.log('\n💰 COST ESTIMATE');
  console.log('='.repeat(70));

  const estimate = estimateCost(filteredQueue.map(g => ({ level: g.level })));
  console.log(`Expected cost: ${formatCost(estimate.estimatedCost)}`);
  console.log(`${filteredQueue.length} guides × avg ${formatCost(estimate.estimatedCost / filteredQueue.length)}/guide`);

  estimate.breakdown.forEach(b => {
    console.log(`   ${b.level}: ${formatCost(b.subtotal)} (${b.numGuides} guides)`);
  });

  console.log('\n📋 GUIDES TO GENERATE:');
  filteredQueue.forEach((g, i) => {
    console.log(`  ${i + 1}. ${g.name} (${g.level})${g.parent ? ` - part of ${g.parent}` : ''}`);
  });

  // Dry run exit
  if (options.dryRun) {
    console.log('\n🏁 DRY RUN - No guides generated');
    console.log('='.repeat(70));
    return;
  }

  // User confirmation
  console.log('\n' + '='.repeat(70));
  const confirmed = await askConfirmation(`Generate ${filteredQueue.length} guides for ~${formatCost(estimate.estimatedCost)}?`);

  if (!confirmed) {
    console.log('\n❌ Cancelled by user');
    return;
  }

  console.log('\n🚀 STARTING GENERATION');
  console.log('='.repeat(70));

  // Setup parallel queue
  const parallelQueue = new ParallelQueue<GenerationResult>({
    concurrency: options.concurrency ?? 2,
    rateLimit: 50,
    timeout: 600000, // 10 minutes per guide
  });

  // Add tasks to queue
  for (const guide of filteredQueue) {
    parallelQueue.add({
      id: guide.slug,
      name: guide.name,
      fn: async () => {
        const filename = `${guide.slug}-guide.md`;
        return await generateRegionGuide(
          guide.name,
          guide.level,
          guide.parent,
          filename
        );
      },
      priority: guide.priority,
    });
  }

  // Progress tracking
  let lastProgress = '';
  parallelQueue.onProgress(progress => {
    const progressLine = `📊 [${progress.completed}/${progress.total}] ` +
      `✅ ${progress.successful} | ❌ ${progress.failed} | ` +
      `🔄 ${progress.inProgress} in progress`;

    if (progressLine !== lastProgress) {
      process.stdout.write('\r' + ' '.repeat(100) + '\r'); // Clear line
      process.stdout.write(progressLine);
      lastProgress = progressLine;
    }

    if (progress.currentTasks.length > 0) {
      process.stdout.write(` (${progress.currentTasks.join(', ')})`);
    }
  });

  // Run queue
  const queueResults = await parallelQueue.run();
  console.log('\n'); // New line after progress

  // Generate comprehensive dashboard
  generateDashboard(queueResults, startTime);

  // Generate pages if requested
  if (options.generatePages) {
    console.log('\n📄 GENERATING PAGE TEMPLATES');
    console.log('='.repeat(70));
    console.log('(Page generation will be implemented in Phase 3)');
  }
}

/**
 * Generate comprehensive dashboard
 */
function generateDashboard(results: QueueResult<GenerationResult>[], startTime: number) {
  console.log('\n' + '='.repeat(70));
  console.log('📊 GENERATION SUMMARY DASHBOARD');
  console.log('='.repeat(70));

  const successful = results.filter(r => r.success && r.result);
  const failed = results.filter(r => !r.success);

  console.log(`\n✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);

  // Quality warnings
  const warnings = successful.filter(r => r.result!.validation.warnings.length > 0);
  if (warnings.length > 0) {
    console.log(`\n⚠️  QUALITY WARNINGS (${warnings.length})`);
    warnings.forEach(r => {
      console.log(`   ${r.name}:`);
      r.result!.validation.warnings.forEach(w => console.log(`      ⚠️  ${w}`));
    });
  }

  // Validation errors
  const errors = successful.filter(r => !r.result!.validation.valid);
  if (errors.length > 0) {
    console.log(`\n❌ VALIDATION ERRORS (${errors.length})`);
    errors.forEach(r => {
      console.log(`   ${r.name}:`);
      r.result!.validation.errors.forEach(e => console.log(`      ❌ ${e}`));
    });
  }

  // Cost breakdown
  if (successful.length > 0) {
    const costsWithLevels = successful.map(r => ({
      level: r.result!.metrics.level,
      cost: r.result!.metrics.claudeTokens,
    }));

    const stats = calculateStatistics(costsWithLevels);

    console.log(`\n💰 COST BREAKDOWN`);
    console.log(`   Total spent: ${formatCost(stats.totalCost)}`);
    console.log(`   Avg per guide: ${formatCost(stats.avgCostPerGuide)}`);
    console.log(`   By level:`);
    Object.entries(stats.byLevel).forEach(([level, data]) => {
      console.log(`      ${level}: ${formatCost(data.totalCost)} (${data.count} guides)`);
    });
  }

  // Word count stats
  if (successful.length > 0) {
    const wordCounts = successful.map(r => r.result!.metrics.wordCount);
    const avgWordCount = wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length;
    const minWordCount = Math.min(...wordCounts);
    const maxWordCount = Math.max(...wordCounts);

    console.log(`\n📝 WORD COUNT STATS`);
    console.log(`   Average: ${Math.round(avgWordCount).toLocaleString()} words`);
    console.log(`   Range: ${minWordCount.toLocaleString()} - ${maxWordCount.toLocaleString()}`);
  }

  // Performance stats
  const totalDuration = Date.now() - startTime;
  const avgDuration = successful.length > 0
    ? successful.reduce((sum, r) => sum + r.duration, 0) / successful.length
    : 0;

  console.log(`\n⏱️  PERFORMANCE`);
  console.log(`   Total time: ${formatDuration(totalDuration)}`);
  if (successful.length > 0) {
    console.log(`   Avg per guide: ${formatDuration(avgDuration)}`);
  }

  // Failed guides
  if (failed.length > 0) {
    console.log(`\n❌ FAILED GUIDES`);
    failed.forEach(r => {
      console.log(`   ${r.name}: ${r.error?.message || 'Unknown error'}`);
    });
  }

  // Successful guides
  if (successful.length > 0) {
    console.log(`\n✅ GENERATED GUIDES`);
    successful.forEach(r => {
      const metrics = r.result!.metrics;
      console.log(`   ${r.name}: ${metrics.wordCount.toLocaleString()} words, ${formatCost(metrics.totalCost)}`);
    });
  }

  console.log('\n' + '='.repeat(70));

  // Save detailed JSON report
  const summaryPath = path.join(process.cwd(), 'guides', 'generation-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`📄 Detailed report saved to: ${summaryPath}`);
  console.log('='.repeat(70));
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: npx tsx scripts/generate-all-guides.ts [options]

Options:
  --max <number>       Maximum number of guides to generate
  --level <level>      Only generate guides of specific level (country/region/sub-region)
  --force              Regenerate guides even if they already exist
  --only <slugs>       Only generate specific guides (comma-separated slugs or names)
  --concurrency <n>    Number of parallel guides (default: 2)
  --generate-pages     Auto-create page.tsx files after generation
  --dry-run            Show what would happen without generating
  --help, -h           Show this help message

Examples:
  # Generate only new Italian region guides
  npx tsx scripts/generate-all-guides.ts --only "piedmont,tuscany,veneto,sicily"

  # Generate all region-level guides (skips existing)
  npx tsx scripts/generate-all-guides.ts --level region

  # Force regenerate country guides with 3 parallel workers
  npx tsx scripts/generate-all-guides.ts --level country --force --concurrency 3

  # Generate first 5 guides
  npx tsx scripts/generate-all-guides.ts --max 5

  # Dry run to see what would be generated
  npx tsx scripts/generate-all-guides.ts --level region --dry-run

  # Generate guides and auto-create pages
  npx tsx scripts/generate-all-guides.ts --only "burgundy,piedmont" --generate-pages

Guide Levels:
  country     - Overview of major regions, wine culture (2,500-3,500 words)
  region      - Deep dive: geology, climate, grapes, wines (3,500-5,000 words)
  sub-region  - Focused: terroir, producers, specific styles (1,500-2,500 words)
`);
    process.exit(0);
  }

  const maxIndex = args.indexOf('--max');
  const maxGuides = maxIndex !== -1 ? parseInt(args[maxIndex + 1]) : undefined;

  const levelIndex = args.indexOf('--level');
  const level = levelIndex !== -1
    ? args[levelIndex + 1] as 'country' | 'region' | 'sub-region'
    : undefined;

  const concurrencyIndex = args.indexOf('--concurrency');
  const concurrency = concurrencyIndex !== -1 ? parseInt(args[concurrencyIndex + 1]) : undefined;

  const force = args.includes('--force');
  const generatePages = args.includes('--generate-pages');
  const dryRun = args.includes('--dry-run');

  const onlyIndex = args.indexOf('--only');
  const onlyGuides = onlyIndex !== -1
    ? args[onlyIndex + 1].split(',').map(s => s.trim())
    : undefined;

  generateAllGuides({
    maxGuides,
    level,
    force,
    onlyGuides,
    concurrency,
    generatePages,
    dryRun,
  });
}

export { generateAllGuides };
