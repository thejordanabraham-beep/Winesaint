/**
 * ARGENTINIAN REGION GUIDE GENERATOR
 *
 * Generates guides for 4 missing Argentinian wine regions
 */

import { generateRegionGuide } from './wine-region-guide-generator';
import * as fs from 'fs';
import * as path from 'path';

const ARGENTINIAN_REGIONS = [
  { name: 'Mendoza', slug: 'mendoza' },  // May exist
  { name: 'Salta', slug: 'salta' },  // May exist
  { name: 'Patagonia', slug: 'patagonia' },
  { name: 'San Juan', slug: 'san-juan' },
  { name: 'La Rioja', slug: 'la-rioja' },
  { name: 'Catamarca', slug: 'catamarca' },
];

async function main() {
  console.log('🇦🇷 ARGENTINIAN REGION GUIDE GENERATOR');
  console.log('='.repeat(70));
  console.log(`Total regions: ${ARGENTINIAN_REGIONS.length}`);
  console.log('='.repeat(70));
  console.log('');

  let totalCost = 0;
  let completed = 0;
  let skipped = 0;
  const results: Array<{
    region: string;
    wordCount: number;
    cost: number;
  }> = [];

  for (let i = 0; i < ARGENTINIAN_REGIONS.length; i++) {
    const region = ARGENTINIAN_REGIONS[i];
    const guideFilename = `${region.slug}-guide.md`;
    const fullPath = path.join(process.cwd(), 'guides', guideFilename);

    if (fs.existsSync(fullPath)) {
      console.log(`⏭️  ${region.name} - Already exists\n`);
      skipped++;
      continue;
    }

    console.log(`📝 ${region.name} (${i + 1}/${ARGENTINIAN_REGIONS.length})`);

    try {
      const result = await generateRegionGuide(
        region.name,
        'region',
        'argentina',
        guideFilename
      );

      if (result.success && result.metrics) {
        totalCost += result.metrics.totalCost;
        completed++;

        results.push({
          region: region.name,
          wordCount: result.metrics.wordCount,
          cost: result.metrics.totalCost,
        });

        console.log(`✅ Complete - ${result.metrics.wordCount} words, $${result.metrics.totalCost.toFixed(2)}\n`);
      }
    } catch (error) {
      console.error(`❌ ${region.name} failed:`, error);
    }
  }

  console.log('='.repeat(70));
  console.log('📊 ARGENTINA SUMMARY');
  console.log('='.repeat(70));
  console.log(`Completed: ${completed}/${ARGENTINIAN_REGIONS.length}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total Cost: $${totalCost.toFixed(2)}`);
  if (results.length > 0) {
    const totalWords = results.reduce((sum, r) => sum + r.wordCount, 0);
    console.log(`Total Words: ${totalWords.toLocaleString()}`);
    console.log(`Average: ${Math.round(totalWords / results.length).toLocaleString()} words/guide`);
  }
  console.log('='.repeat(70));
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
