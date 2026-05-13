/**
 * BATCH GENERATE WACHAU VINEYARD GUIDES
 */

import { generateRegionGuide, type GenerationResult } from './wine-region-guide-generator';

const WACHAU_VINEYARDS = [
  'achleiten', 'loibenberg', 'kellerberg', 'klaus', 'singerriedel', 'steinriegl',
  'schlossberg', 'kollmitz', 'pichlpoint', 'ritzling', '1000-eimerberg', 'atzberg',
  'hochrain', 'kollmutz', 'harzenleiten', 'axpoint', 'bruck', 'hinterhaus', 'hohereck',
  'kirchweg', 'liebenberg', 'offenberg', 'point', 'schon', 'steinterrassen',
  'tausendeimerberg', 'terrassen', 'unterloiben', 'vorderseiber', 'zwerithaler',
  'axberg', 'frauengarten', 'hollerin', 'kirnberg', 'kreuzberg', 'kulm', 'muhlpoint',
  'obere-steigen', 'pfaffenberg', 'weitenberg', 'burgberg', 'vorder-atzberg',
  'loibenschenke', 'kammstein', 'durrenberg', 'steinbachberg', 'spitzerberg',
  'maurachberg', 'eichengarten', 'schmeidberg', 'rauhenberg',
];

function slugToName(slug: string): string {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function generateAllWachauGuides() {
  console.log('🍷 WACHAU VINEYARD GUIDE GENERATOR');
  console.log('='.repeat(70));
  console.log(`Total vineyards: ${WACHAU_VINEYARDS.length}`);
  console.log('='.repeat(70));

  const results: GenerationResult[] = [];
  const startTime = Date.now();

  for (let i = 0; i < WACHAU_VINEYARDS.length; i++) {
    const slug = WACHAU_VINEYARDS[i];
    const name = slugToName(slug);
    const outputFile = `${slug}-guide.md`;

    console.log(`\n[${i + 1}/${WACHAU_VINEYARDS.length}] Generating: ${name}`);
    console.log('-'.repeat(70));

    try {
      const result = await generateRegionGuide(name, 'vineyard', 'Wachau', outputFile);
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
  console.log('📊 WACHAU GENERATION SUMMARY');
  console.log('='.repeat(70));
  console.log(`Successful: ${successful.length}/${WACHAU_VINEYARDS.length}`);
  console.log(`Total words: ${totalWords.toLocaleString()}`);
  console.log(`Average: ${Math.round(totalWords / successful.length)} words`);
  console.log(`Total cost: $${totalCost.toFixed(2)}`);
  console.log(`Duration: ${Math.floor(duration / 1000 / 60)}m`);
  console.log('='.repeat(70));
}

generateAllWachauGuides().catch(console.error);
