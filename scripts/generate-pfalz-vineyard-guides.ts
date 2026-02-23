/**
 * BATCH GENERATE PFALZ VINEYARD GUIDES
 */

import { generateRegionGuide, type GenerationResult } from './wine-region-guide-generator';

const PFALZ_VINEYARDS = [
  'annaberg', 'burgergarten-im-breumel', 'felsenberg', 'freundstuck', 'gaisbohl',
  'grainhubel', 'guldenwingert', 'herrenberg', 'heydenreich', 'hohenmorgen',
  'holle-unterer-faulenberg', 'idig', 'im-grossen-garten', 'im-sonnenschein',
  'im-sonnenschein-ganz-horn', 'jesuitengarten', 'kalkberg', 'kalkofen', 'kalmit',
  'kammerberg', 'kastanienbusch', 'kastanienbusch-koppel', 'kieselberg', 'kirchberg',
  'kirchenstuck', 'kirschgarten', 'kostert', 'kreuzberg', 'langenmorgen', 'mandelberg',
  'mandelberg-am-speyrer-weg', 'mandelpfad', 'meerspinne', 'michelsberg', 'munzberg',
  'odinstal', 'olberg-hart', 'pechstein', 'philippsbrunnen', 'radling',
  'reiterpfad-an-den-achtmorgen', 'reiterpfad-hofstuck', 'reiterpfad-in-der-hohl',
  'rosenkranz-im-untern-kreuz', 'rosenkranz-zinkelerde', 'sankt-paul', 'saumagen',
  'schawer', 'schild', 'schwarzer-herrgott', 'sonnenberg', 'steinbuckel', 'ungeheuer',
  'vogelsang', 'weilberg',
];

function slugToName(slug: string): string {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function generateAllPfalzGuides() {
  console.log('🍷 PFALZ VINEYARD GUIDE GENERATOR');
  console.log('='.repeat(70));
  console.log(`Total vineyards: ${PFALZ_VINEYARDS.length}`);
  console.log('='.repeat(70));

  const results: GenerationResult[] = [];
  const startTime = Date.now();

  for (let i = 0; i < PFALZ_VINEYARDS.length; i++) {
    const slug = PFALZ_VINEYARDS[i];
    const name = slugToName(slug);
    const outputFile = `${slug}-guide.md`;

    console.log(`\n[${i + 1}/${PFALZ_VINEYARDS.length}] Generating: ${name}`);
    console.log('-'.repeat(70));

    try {
      const result = await generateRegionGuide(name, 'vineyard', 'Pfalz', outputFile);
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
  console.log('📊 PFALZ GENERATION SUMMARY');
  console.log('='.repeat(70));
  console.log(`Successful: ${successful.length}/${PFALZ_VINEYARDS.length}`);
  console.log(`Total words: ${totalWords.toLocaleString()}`);
  console.log(`Average: ${Math.round(totalWords / successful.length)} words`);
  console.log(`Total cost: $${totalCost.toFixed(2)}`);
  console.log(`Duration: ${Math.floor(duration / 1000 / 60)}m`);
  console.log('='.repeat(70));
}

generateAllPfalzGuides().catch(console.error);
