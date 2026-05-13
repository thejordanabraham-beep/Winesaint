/**
 * NEW ZEALAND REGION GUIDE GENERATOR
 *
 * Generates guides for 4 missing New Zealand wine regions
 */

import { generateRegionGuide } from './wine-region-guide-generator';
import * as fs from 'fs';
import * as path from 'path';

const NEW_ZEALAND_REGIONS = [
  { name: 'Marlborough', slug: 'marlborough' },  // May exist
  { name: 'Central Otago', slug: 'central-otago' },  // May exist
  { name: 'Hawke\'s Bay', slug: 'hawkes-bay' },  // May exist
  { name: 'Martinborough', slug: 'martinborough' },
  { name: 'Waipara Valley', slug: 'waipara-valley' },
  { name: 'Nelson', slug: 'nelson' },
  { name: 'Gisborne', slug: 'gisborne' },
];

async function main() {
  console.log('🇳🇿 NEW ZEALAND REGION GUIDE GENERATOR');
  console.log('='.repeat(70));
  console.log(`Total regions: ${NEW_ZEALAND_REGIONS.length}`);
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

  for (let i = 0; i < NEW_ZEALAND_REGIONS.length; i++) {
    const region = NEW_ZEALAND_REGIONS[i];
    const guideFilename = `${region.slug}-guide.md`;
    const fullPath = path.join(process.cwd(), 'guides', guideFilename);

    if (fs.existsSync(fullPath)) {
      console.log(`⏭️  ${region.name} - Already exists\n`);
      skipped++;
      continue;
    }

    console.log(`📝 ${region.name} (${i + 1}/${NEW_ZEALAND_REGIONS.length})`);

    try {
      const result = await generateRegionGuide(
        region.name,
        'region',
        'new-zealand',
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
  console.log('📊 NEW ZEALAND SUMMARY');
  console.log('='.repeat(70));
  console.log(`Completed: ${completed}/${NEW_ZEALAND_REGIONS.length}`);
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
