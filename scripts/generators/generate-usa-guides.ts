/**
 * USA REGION GUIDE GENERATOR
 * (Oregon/Washington regions only - California already complete)
 */

import { generateRegionGuide } from './wine-region-guide-generator';
import * as fs from 'fs';
import * as path from 'path';

const USA_REGIONS = [
  { name: 'Willamette Valley', slug: 'willamette-valley', parent: 'united-states/oregon' },
  { name: 'Columbia Valley', slug: 'columbia-valley', parent: 'united-states/washington' },
  { name: 'Columbia Gorge', slug: 'columbia-gorge', parent: 'united-states/oregon' },
  { name: 'Puget Sound', slug: 'puget-sound', parent: 'united-states/washington' },
  { name: 'Walla Walla Valley', slug: 'walla-walla-valley', parent: 'united-states/oregon' },
  { name: 'Snake River Valley', slug: 'snake-river-valley', parent: 'united-states/oregon' },
  { name: 'Southern Oregon', slug: 'southern-oregon', parent: 'united-states/oregon' },
];

async function main() {
  console.log('🇺🇸 USA REGION GUIDE GENERATOR (OR/WA)');
  console.log('='.repeat(70));

  let totalCost = 0;
  let completed = 0;
  let skipped = 0;

  for (let i = 0; i < USA_REGIONS.length; i++) {
    const region = USA_REGIONS[i];
    const guideFilename = `${region.slug}-guide.md`;
    const fullPath = path.join(process.cwd(), 'guides', guideFilename);

    if (fs.existsSync(fullPath)) {
      console.log(`⏭️  ${region.name} - Already exists\n`);
      skipped++;
      continue;
    }

    console.log(`📝 ${region.name} (${i + 1}/${USA_REGIONS.length})`);

    try {
      const result = await generateRegionGuide(region.name, 'region', region.parent, guideFilename);

      if (result.success && result.metrics) {
        totalCost += result.metrics.totalCost;
        completed++;
        console.log(`✅ ${result.metrics.wordCount} words, $${result.metrics.totalCost.toFixed(2)}\n`);
      }
    } catch (error) {
      console.error(`❌ ${region.name} failed\n`);
    }
  }

  console.log('='.repeat(70));
  console.log(`Completed: ${completed}/${USA_REGIONS.length} | Cost: $${totalCost.toFixed(2)}`);
  console.log('='.repeat(70));
}

main();
