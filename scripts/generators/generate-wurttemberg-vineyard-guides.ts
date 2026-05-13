/**
 * BATCH GENERATE WURTTEMBERG VINEYARD GUIDES
 */

import { generateRegionGuide, type GenerationResult } from './wine-region-guide-generator';

const WURTTEMBERG_VINEYARDS = [
  'altenberg', 'berg', 'berge', 'brotwasser-steingrube', 'burghalde',
  'eilfingerberg-klosterstuck', 'forstberg', 'gei-berg', 'gips', 'gips-marienglas',
  'gotzenberg', 'herrschaftsberg', 'herzogenberg', 'himmelreich', 'hungerberg',
  'kasberg', 'lammler', 'linnenbrunnen', 'michaelsberg', 'monchberg',
  'monchberg-berge', 'monchberg-gehrnhalde', 'monchberg-ode-halde',
  'monchberg-schalksberg', 'muhlberg', 'oberer-berg', 'pulvermacher', 'roter-berg',
  'ruthe', 'schemelsberg', 'scheuerberg-orthgang', 'scheuerberg-steinkreuz',
  'schlipshalde', 'schlossberg', 'schlosswengert', 'schupen', 'spitzenberg',
  'stahlbuhl', 'steingruben', 'stiftsberg-klinge', 'sussmund', 'verrenberg',
  'wartberg-sonnenstrahl',
];

function slugToName(slug: string): string {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function generateAllWurttembergGuides() {
  console.log('🍷 WURTTEMBERG VINEYARD GUIDE GENERATOR');
  console.log('='.repeat(70));
  console.log(`Total vineyards: ${WURTTEMBERG_VINEYARDS.length}`);
  console.log('='.repeat(70));

  const results: GenerationResult[] = [];
  const startTime = Date.now();

  for (let i = 0; i < WURTTEMBERG_VINEYARDS.length; i++) {
    const slug = WURTTEMBERG_VINEYARDS[i];
    const name = slugToName(slug);
    const outputFile = `${slug}-guide.md`;

    console.log(`\n[${i + 1}/${WURTTEMBERG_VINEYARDS.length}] Generating: ${name}`);
    console.log('-'.repeat(70));

    try {
      const result = await generateRegionGuide(name, 'vineyard', 'Wurttemberg', outputFile);
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
  console.log('📊 WURTTEMBERG GENERATION SUMMARY');
  console.log('='.repeat(70));
  console.log(`Successful: ${successful.length}/${WURTTEMBERG_VINEYARDS.length}`);
  console.log(`Total words: ${totalWords.toLocaleString()}`);
  console.log(`Average: ${Math.round(totalWords / successful.length)} words`);
  console.log(`Total cost: $${totalCost.toFixed(2)}`);
  console.log(`Duration: ${Math.floor(duration / 1000 / 60)}m`);
  console.log('='.repeat(70));
}

generateAllWurttembergGuides().catch(console.error);
