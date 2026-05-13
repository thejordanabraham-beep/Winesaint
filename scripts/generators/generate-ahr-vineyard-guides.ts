/**
 * BATCH GENERATE AHR VINEYARD GUIDES
 */

import { generateRegionGuide, type GenerationResult } from './wine-region-guide-generator';

const AHR_VINEYARDS = [
  'alte-lay', 'burggarten', 'eck', 'garkammer', 'herrenberg', 'im-kuckstein',
  'krauterberg', 'landskrone', 'monchberg', 'pfarrwingert', 'rosenthal',
  'schieferlay', 'silberberg', 'sonnenberg', 'trotzenberg',
];

function slugToName(slug: string): string {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function generateAllAhrGuides() {
  console.log('🍷 AHR VINEYARD GUIDE GENERATOR');
  console.log('='.repeat(70));
  console.log(`Total vineyards: ${AHR_VINEYARDS.length}`);
  console.log('='.repeat(70));

  const results: GenerationResult[] = [];
  const startTime = Date.now();

  for (let i = 0; i < AHR_VINEYARDS.length; i++) {
    const slug = AHR_VINEYARDS[i];
    const name = slugToName(slug);
    const outputFile = `${slug}-guide.md`;

    console.log(`\n[${i + 1}/${AHR_VINEYARDS.length}] Generating: ${name}`);
    console.log('-'.repeat(70));

    try {
      const result = await generateRegionGuide(name, 'vineyard', 'Ahr', outputFile);
      results.push(result);
      console.log(result.success ? `✅ ${name} - ${result.metrics.wordCount} words - $${result.metrics.totalCost.toFixed(4)}` : `❌ ${name} - FAILED`);
    } catch (error) {
      console.log(`❌ ${name} - ERROR: ${(error as Error).message}`);
    }
  }

  const duration = Date.now() - startTime;
  const successful = results.filter(r => r.success);
  const totalCost = results.reduce((sum, r) => sum + r.metrics.totalCost, 0);
  const totalWords = results.reduce((sum, r) => sum + r.metrics.wordCount, 0);

  console.log('\n\n' + '='.repeat(70));
  console.log('📊 AHR GENERATION SUMMARY');
  console.log('='.repeat(70));
  console.log(`Successful: ${successful.length}/${AHR_VINEYARDS.length}`);
  console.log(`Total words: ${totalWords.toLocaleString()}`);
  console.log(`Average: ${Math.round(totalWords / successful.length)} words`);
  console.log(`Total cost: $${totalCost.toFixed(2)}`);
  console.log(`Duration: ${Math.floor(duration / 1000 / 60)}m`);
  console.log('='.repeat(70));
}

generateAllAhrGuides().catch(console.error);
