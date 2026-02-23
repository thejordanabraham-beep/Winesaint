/**
 * COMPLETE SPANISH REGION GUIDES
 *
 * Generates remaining 17 Spanish region guides to complete Spain coverage
 */

import { generateRegionGuide } from './wine-region-guide-generator';
import * as fs from 'fs';
import * as path from 'path';

const REMAINING_SPANISH_REGIONS = [
  // Tier 1 - Major regions not in top 5
  { name: 'Bierzo', slug: 'bierzo' },
  { name: 'Montsant', slug: 'montsant' },
  { name: 'Penedès', slug: 'penedes' },

  // Tier 2 - Significant regions
  { name: 'Cava', slug: 'cava' },
  { name: 'Jumilla', slug: 'jumilla' },
  { name: 'Valdeorras', slug: 'valdeorras' },
  { name: 'Txakoli', slug: 'txakoli' },
  { name: 'Ribeiro', slug: 'ribeiro' },
  { name: 'Somontano', slug: 'somontano' },
  { name: 'La Mancha', slug: 'la-mancha' },

  // Tier 3 - Specialized regions
  { name: 'Yecla', slug: 'yecla' },
  { name: 'Montilla-Moriles', slug: 'montilla-moriles' },
  { name: 'Calatayud', slug: 'calatayud' },
  { name: 'Cigales', slug: 'cigales' },
  { name: 'Málaga', slug: 'malaga' },
  { name: 'Valencia', slug: 'valencia' },
  { name: 'Alicante', slug: 'alicante' },
];

async function main() {
  console.log('🇪🇸 COMPLETING SPANISH REGION GUIDES');
  console.log('='.repeat(70));
  console.log(`Remaining regions: ${REMAINING_SPANISH_REGIONS.length}`);
  console.log(`Target: 4,000-5,000 words per guide`);
  console.log('='.repeat(70));
  console.log('');

  let totalCost = 0;
  let completed = 0;
  let skipped = 0;
  const results: Array<{
    region: string;
    wordCount: number;
    cost: number;
    duration: number;
  }> = [];

  for (let i = 0; i < REMAINING_SPANISH_REGIONS.length; i++) {
    const region = REMAINING_SPANISH_REGIONS[i];
    const guideFilename = `${region.slug}-guide.md`;
    const fullPath = path.join(process.cwd(), 'guides', guideFilename);

    // Skip if guide already exists
    if (fs.existsSync(fullPath)) {
      console.log(`⏭️  ${region.name} - Guide already exists\n`);
      skipped++;
      continue;
    }

    console.log(`📝 Generating: ${region.name} (${i + 1}/${REMAINING_SPANISH_REGIONS.length})`);
    console.log('─'.repeat(70));

    try {
      const result = await generateRegionGuide(
        region.name,
        'region',
        'spain',
        guideFilename
      );

      if (result.success && result.metrics) {
        totalCost += result.metrics.totalCost;
        completed++;

        results.push({
          region: region.name,
          wordCount: result.metrics.wordCount,
          cost: result.metrics.totalCost,
          duration: result.metrics.duration,
        });

        console.log(`✅ ${region.name} - Complete!`);
        console.log(`   Words: ${result.metrics.wordCount.toLocaleString()}`);
        console.log(`   Cost: $${result.metrics.totalCost.toFixed(2)}`);
        console.log(`   Duration: ${(result.metrics.duration / 1000 / 60).toFixed(1)} min`);
        console.log('');
      } else {
        console.error(`❌ ${region.name} - Generation failed`);
        if (result.error) {
          console.error(`   Error: ${result.error.message}`);
        }
        console.log('');
      }
    } catch (error) {
      console.error(`❌ ${region.name} - Unexpected error:`, error);
      console.log('');
    }
  }

  // Final summary
  console.log('');
  console.log('='.repeat(70));
  console.log('📊 SPAIN COMPLETION SUMMARY');
  console.log('='.repeat(70));
  console.log(`Completed: ${completed}/${REMAINING_SPANISH_REGIONS.length}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total Cost: $${totalCost.toFixed(2)}`);

  if (results.length > 0) {
    const totalWords = results.reduce((sum, r) => sum + r.wordCount, 0);
    const avgWords = totalWords / results.length;
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`Total Words: ${totalWords.toLocaleString()}`);
    console.log(`Average Words/Guide: ${Math.round(avgWords).toLocaleString()}`);
    console.log(`Total Duration: ${(totalDuration / 1000 / 60).toFixed(1)} minutes`);

    console.log('');
    console.log('TOP WORD COUNTS:');
    const sorted = [...results].sort((a, b) => b.wordCount - a.wordCount);
    sorted.slice(0, 5).forEach(r => {
      console.log(`  • ${r.region}: ${r.wordCount.toLocaleString()} words`);
    });
  }

  console.log('='.repeat(70));
  console.log('🎉 SPAIN IS NOW COMPLETE - All 24 Spanish regions have guides!');
  console.log('='.repeat(70));
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
