/**
 * TEST VINEYARD GUIDE GENERATOR
 *
 * Generates a small sample of vineyard guides for user review
 */

import { generateRegionGuide } from './wine-region-guide-generator';

// Convert slug to display name
function slugToName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function main() {
  console.log('\n🍷 TEST VINEYARD GUIDE GENERATOR');
  console.log('='.repeat(70));
  console.log('Generating 4 sample Rheingau vineyard guides for review\n');

  // Sample vineyards - mix of famous and less famous
  const samples = [
    'schloss-johannisberg',  // Very famous
    'erbacher-marcobrunn',   // Famous
    'hollenberg',            // Less famous
    'siegelsberg',           // Less famous
  ];

  for (let i = 0; i < samples.length; i++) {
    const slug = samples[i];
    const vineyardName = slugToName(slug);
    const filename = `${slug}-vineyard-guide.md`;

    console.log(`\n[${i + 1}/${samples.length}] ${vineyardName}`);
    console.log('-'.repeat(70));

    try {
      const result = await generateRegionGuide(
        vineyardName,
        'sub-region',
        'germany/rheingau',
        filename
      );

      if (result.success) {
        console.log(`   ✅ Generated: ${result.metrics.wordCount} words, $${result.metrics.totalCost.toFixed(4)}`);
      } else {
        console.log(`   ❌ Failed: ${result.error?.message}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${(error as Error).message}`);
    }

    // Small delay between requests
    if (i < samples.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ SAMPLE GENERATION COMPLETE');
  console.log('Review the guides in /guides/ directory');
  console.log('='.repeat(70) + '\n');
}

main().catch(console.error);
