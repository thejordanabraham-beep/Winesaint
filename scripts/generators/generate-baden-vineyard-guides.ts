/**
 * BATCH GENERATE BADEN VINEYARD GUIDES
 */

import { generateRegionGuide, type GenerationResult } from './wine-region-guide-generator';

const BADEN_VINEYARDS = [
  'abtsberg-tannweg', 'alte-burg', 'altenberg-weingarten', 'bassgeige-kahner',
  'bassgeige-steinriese', 'bienenberg', 'bienenberg-wildenstein', 'chorherrnhalde',
  'dicker-franz', 'eichberg', 'eichelberg', 'feuerberg-haslen', 'feuerberg-kesselberg',
  'frauenberg', 'goldenes-loch', 'heinberg', 'henkenberg', 'herrenberg-lange-wingert',
  'herrenberg-oberklam', 'herrenberg-spermen', 'herrentisch', 'husarenkappe',
  'kapellenberg', 'kirchberg', 'kirchgasse', 'konigsbecher', 'kronenbuhl-gottsacker',
  'leopoldsberg-buchberg', 'lochle', 'mauerberg-mauerwein', 'neugesetz', 'oberer-first',
  'pagode', 'plauelrain-am-buhl', 'plauelrain-stollenberg', 'schellenbrunnen',
  'schellenbrunnen-wormsberg', 'schloss-staufenberg-klingelberg',
  'schloss-staufenberg-sophienberg', 'schlossberg', 'schlossgarten-villinger',
  'sommerhalde', 'sonnenstuck', 'spiegelberg', 'steingrubenberg', 'vorderer-winklerberg',
  'winklerberg-hinter-winklen', 'winklerberg-wanne', 'winklerberg-winklen',
  'winklerberg-winklerfeld',
];

function slugToName(slug: string): string {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function generateAllBadenGuides() {
  console.log('🍷 BADEN VINEYARD GUIDE GENERATOR');
  console.log('='.repeat(70));
  console.log(`Total vineyards: ${BADEN_VINEYARDS.length}`);
  console.log('='.repeat(70));

  const results: GenerationResult[] = [];
  const startTime = Date.now();

  for (let i = 0; i < BADEN_VINEYARDS.length; i++) {
    const slug = BADEN_VINEYARDS[i];
    const name = slugToName(slug);
    const outputFile = `${slug}-guide.md`;

    console.log(`\n[${i + 1}/${BADEN_VINEYARDS.length}] Generating: ${name}`);
    console.log('-'.repeat(70));

    try {
      const result = await generateRegionGuide(name, 'vineyard', 'Baden', outputFile);
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
  console.log('📊 BADEN GENERATION SUMMARY');
  console.log('='.repeat(70));
  console.log(`Successful: ${successful.length}/${BADEN_VINEYARDS.length}`);
  console.log(`Total words: ${totalWords.toLocaleString()}`);
  console.log(`Average: ${Math.round(totalWords / successful.length)} words`);
  console.log(`Total cost: $${totalCost.toFixed(2)}`);
  console.log(`Duration: ${Math.floor(duration / 1000 / 60)}m`);
  console.log('='.repeat(70));
}

generateAllBadenGuides().catch(console.error);
