/**
 * BATCH GENERATE NAHE VINEYARD GUIDES
 */

import { generateRegionGuide, type GenerationResult } from './wine-region-guide-generator';

const NAHE_VINEYARDS = [
  'auf-der-ley', 'bastei', 'brucke', 'burgberg', 'dautenpflanzer', 'dellchen',
  'felsenberg', 'felseneck', 'fruhlingsplatzchen', 'goldloch', 'halenberg',
  'hermannsberg', 'hermannshohle', 'im-kahlenberg', 'im-langenberg', 'im-muhlenberg',
  'im-pitterberg', 'in-der-rossel', 'johannisberg', 'kirschheck', 'klamm',
  'krotenpfuhl', 'kupfergrube', 'leistenberg', 'muhlberg', 'pittermannchen',
  'rotenberg', 'steinberg', 'stromberg',
];

function slugToName(slug: string): string {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function generateAllNaheGuides() {
  console.log('🍷 NAHE VINEYARD GUIDE GENERATOR');
  console.log('='.repeat(70));
  console.log(`Total vineyards: ${NAHE_VINEYARDS.length}`);
  console.log('='.repeat(70));

  const results: GenerationResult[] = [];
  const startTime = Date.now();

  for (let i = 0; i < NAHE_VINEYARDS.length; i++) {
    const slug = NAHE_VINEYARDS[i];
    const name = slugToName(slug);
    const outputFile = `${slug}-guide.md`;

    console.log(`\n[${i + 1}/${NAHE_VINEYARDS.length}] Generating: ${name}`);
    console.log('-'.repeat(70));

    try {
      const result = await generateRegionGuide(name, 'vineyard', 'Nahe', outputFile);
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
  console.log('📊 NAHE GENERATION SUMMARY');
  console.log('='.repeat(70));
  console.log(`Successful: ${successful.length}/${NAHE_VINEYARDS.length}`);
  console.log(`Total words: ${totalWords.toLocaleString()}`);
  console.log(`Average: ${Math.round(totalWords / successful.length)} words`);
  console.log(`Total cost: $${totalCost.toFixed(2)}`);
  console.log(`Duration: ${Math.floor(duration / 1000 / 60)}m`);
  console.log('='.repeat(70));
}

generateAllNaheGuides().catch(console.error);
