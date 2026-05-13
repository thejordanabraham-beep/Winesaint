/**
 * BATCH GENERATE RHEINGAU VINEYARD GUIDES
 *
 * Generates guides for all 54 VDP Rheingau vineyards using the updated
 * wine-region-guide-generator with web search integration.
 *
 * Features:
 * - Auto web search when François data is sparse (<20k chars)
 * - Adaptive word counts: 300-2,500+ words based on available info
 * - No upper limit for famous sites with extensive documentation
 */

import { generateRegionGuide, type GenerationResult } from './wine-region-guide-generator';
import path from 'path';

const RHEINGAU_VINEYARDS = [
  'baikenkopf',
  'berg-kaisersteinfels',
  'berg-roseneck',
  'berg-rottland',
  'berg-schlossberg',
  'domprasenz',
  'doosberg',
  'erbacher-marcobrunn',
  'gehrn-kesselring',
  'grafenberg',
  'greiffenberg',
  'hasensprung',
  'hassel',
  'hohenrain',
  'holle',
  'hollenberg',
  'im-landberg',
  'im-rothenberg',
  'jesuitengarten',
  'jungfer',
  'kapellenberg',
  'kirchenpfad',
  'kirchenstuck-im-stein',
  'klaus',
  'klauserweg',
  'konigin-victoriaberg-dechantenruhe',
  'langenberg',
  'lenchen',
  'lenchen-eiserberg',
  'marcobrunn',
  'mauerchen',
  'morschberg',
  'nonnberg-fuhshohl',
  'nonnberg-vier-morgen',
  'nussbrunnen',
  'pfaffenwies-roder',
  'rauenthaler-baiken',
  'reichestal',
  'rodchen',
  'rosengarten',
  'rothenberg',
  'rudesheimer-berg-schlossberg',
  'sankt-nikolaus',
  'schlenzenberg',
  'schloss-johannisberg',
  'schlossberg',
  'schonhell',
  'seligmacher',
  'siegelsberg',
  'steinberg-goldener-becher',
  'unterer-bischofsberg',
  'walkenberg',
  'weiss-erd',
  'wisselbrunnen',
];

// Convert slug to proper vineyard name
function slugToName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function generateAllRheingauGuides() {
  console.log('🍷 RHEINGAU VINEYARD GUIDE GENERATOR');
  console.log('='.repeat(70));
  console.log(`Total vineyards: ${RHEINGAU_VINEYARDS.length}`);
  console.log(`Region: Rheingau`);
  console.log(`Features: Auto web search, adaptive word counts, no upper limit`);
  console.log('='.repeat(70));

  const results: GenerationResult[] = [];
  const startTime = Date.now();

  for (let i = 0; i < RHEINGAU_VINEYARDS.length; i++) {
    const slug = RHEINGAU_VINEYARDS[i];
    const name = slugToName(slug);
    const outputFile = `${slug}-guide.md`;

    console.log(`\n[${ i + 1}/${RHEINGAU_VINEYARDS.length}] Generating: ${name}`);
    console.log('-'.repeat(70));

    try {
      const result = await generateRegionGuide(
        name,
        'vineyard',
        'Rheingau',
        outputFile
      );
      results.push(result);

      if (result.success) {
        console.log(`✅ ${name} - ${result.metrics.wordCount} words - $${result.metrics.totalCost.toFixed(4)}`);
      } else {
        console.log(`❌ ${name} - FAILED`);
      }
    } catch (error) {
      console.log(`❌ ${name} - ERROR: ${(error as Error).message}`);
      results.push({
        success: false,
        metrics: {
          regionName: name,
          level: 'vineyard',
          wordCount: 0,
          researchQueries: 0,
          claudeTokens: {
            model: 'claude-sonnet-4-5-20250929',
            inputTokens: 0,
            outputTokens: 0,
            inputCost: 0,
            outputCost: 0,
            totalCost: 0,
          },
          totalCost: 0,
          duration: 0,
        },
        validation: {
          valid: false,
          errors: [(error as Error).message],
          warnings: [],
          metrics: {
            wordCount: 0,
            hasRequiredSections: false,
            sectionsFound: [],
            uniqueWordRatio: 0,
          },
        },
        error: error as Error,
      });
    }
  }

  const duration = Date.now() - startTime;

  // Summary Report
  console.log('\n\n');
  console.log('='.repeat(70));
  console.log('📊 GENERATION SUMMARY');
  console.log('='.repeat(70));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const totalCost = results.reduce((sum, r) => sum + r.metrics.totalCost, 0);
  const totalWords = results.reduce((sum, r) => sum + r.metrics.wordCount, 0);
  const avgWords = successful.length > 0 ? Math.round(totalWords / successful.length) : 0;

  console.log(`Total vineyards: ${RHEINGAU_VINEYARDS.length}`);
  console.log(`Successful: ${successful.length}`);
  console.log(`Failed: ${failed.length}`);
  console.log(`Total words: ${totalWords.toLocaleString()}`);
  console.log(`Average words per guide: ${avgWords}`);
  console.log(`Total cost: $${totalCost.toFixed(2)}`);
  console.log(`Total duration: ${Math.floor(duration / 1000 / 60)}m ${Math.floor((duration / 1000) % 60)}s`);

  if (failed.length > 0) {
    console.log('\n❌ Failed vineyards:');
    failed.forEach(r => {
      console.log(`   - ${r.metrics.regionName}: ${r.validation.errors[0]}`);
    });
  }

  // Word count distribution
  console.log('\n📊 Word Count Distribution:');
  const wordCounts = successful.map(r => r.metrics.wordCount).sort((a, b) => a - b);
  if (wordCounts.length > 0) {
    console.log(`   Min: ${wordCounts[0]}`);
    console.log(`   Max: ${wordCounts[wordCounts.length - 1]}`);
    console.log(`   Median: ${wordCounts[Math.floor(wordCounts.length / 2)]}`);
  }

  console.log('='.repeat(70));
}

// Run
generateAllRheingauGuides().catch(console.error);
