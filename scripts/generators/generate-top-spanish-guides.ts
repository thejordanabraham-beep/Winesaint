/**
 * TOP 5 SPANISH REGION GUIDE GENERATOR
 *
 * Generates comprehensive guides for Spain's 5 most important regions:
 * - Rías Baixas (Albariño)
 * - Jerez (Sherry)
 * - Rueda (Verdejo)
 * - Toro (Tinta de Toro)
 * - Navarra (Rosado & diverse styles)
 */

import { generateRegionGuide } from './wine-region-guide-generator';
import * as fs from 'fs';
import * as path from 'path';

const TOP_5_REGIONS = [
  { name: 'Rías Baixas', slug: 'rias-baixas' },
  { name: 'Jerez', slug: 'jerez' },
  { name: 'Rueda', slug: 'rueda' },
  { name: 'Toro', slug: 'toro' },
  { name: 'Navarra', slug: 'navarra' },
];

async function main() {
  console.log('🇪🇸 GENERATING TOP 5 SPANISH REGION GUIDES');
  console.log('='.repeat(70));
  console.log(`Total regions: ${TOP_5_REGIONS.length}`);
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

  for (let i = 0; i < TOP_5_REGIONS.length; i++) {
    const region = TOP_5_REGIONS[i];
    const guideFilename = `${region.slug}-guide.md`;
    const fullPath = path.join(process.cwd(), 'guides', guideFilename);

    // Skip if guide already exists
    if (fs.existsSync(fullPath)) {
      console.log(`⏭️  ${region.name} - Guide already exists`);
      console.log(`   Path: ${fullPath}\n`);
      skipped++;
      continue;
    }

    console.log(`📝 Generating: ${region.name} (${i + 1}/${TOP_5_REGIONS.length})`);
    console.log('─'.repeat(70));

    try {
      // Pass just the filename (not full path) - generator will prepend guides directory
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
  console.log('📊 GENERATION SUMMARY');
  console.log('='.repeat(70));
  console.log(`Completed: ${completed}/${TOP_5_REGIONS.length}`);
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
    console.log('INDIVIDUAL RESULTS:');
    results.forEach(r => {
      console.log(`  • ${r.region}: ${r.wordCount.toLocaleString()} words, $${r.cost.toFixed(2)}`);
    });
  }

  console.log('='.repeat(70));
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
