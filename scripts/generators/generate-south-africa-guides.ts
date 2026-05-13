/**
 * SOUTH AFRICAN REGION GUIDE GENERATOR
 *
 * Generates guides for 7 missing South African wine regions
 */

import { generateRegionGuide } from './wine-region-guide-generator';
import * as fs from 'fs';
import * as path from 'path';

const SOUTH_AFRICAN_REGIONS = [
  { name: 'Stellenbosch', slug: 'stellenbosch', priority: 'high' },  // May exist
  { name: 'Swartland', slug: 'swartland', priority: 'high' },  // May exist
  { name: 'Franschhoek', slug: 'franschhoek', priority: 'high' },  // May exist
  { name: 'Walker Bay', slug: 'walker-bay', priority: 'medium' },
  { name: 'Constantia', slug: 'constantia', priority: 'medium' },
  { name: 'Paarl', slug: 'paarl', priority: 'medium' },
  { name: 'Hemel-en-Aarde', slug: 'hemel-en-aarde', priority: 'medium' },
  { name: 'Elgin', slug: 'elgin', priority: 'low' },
  { name: 'Robertson', slug: 'robertson', priority: 'low' },
  { name: 'Tulbagh', slug: 'tulbagh', priority: 'low' },
];

async function main() {
  console.log('🇿🇦 SOUTH AFRICAN REGION GUIDE GENERATOR');
  console.log('='.repeat(70));
  console.log(`Total regions: ${SOUTH_AFRICAN_REGIONS.length}`);
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

  for (let i = 0; i < SOUTH_AFRICAN_REGIONS.length; i++) {
    const region = SOUTH_AFRICAN_REGIONS[i];
    const guideFilename = `${region.slug}-guide.md`;
    const fullPath = path.join(process.cwd(), 'guides', guideFilename);

    if (fs.existsSync(fullPath)) {
      console.log(`⏭️  ${region.name} - Already exists\n`);
      skipped++;
      continue;
    }

    console.log(`📝 ${region.name} (${i + 1}/${SOUTH_AFRICAN_REGIONS.length})`);

    try {
      const result = await generateRegionGuide(
        region.name,
        'region',
        'south-africa',
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
  console.log('📊 SOUTH AFRICA SUMMARY');
  console.log('='.repeat(70));
  console.log(`Completed: ${completed}/${SOUTH_AFRICAN_REGIONS.length}`);
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
