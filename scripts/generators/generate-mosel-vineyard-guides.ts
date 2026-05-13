/**
 * MOSEL VINEYARD GUIDE GENERATOR
 *
 * Generates all missing vineyard guides for Mosel sub-regions
 */

import { generateRegionGuide, type GenerationResult } from './wine-region-guide-generator';
import fs from 'fs';
import path from 'path';

// All Mosel vineyards organized by sub-region
const MOSEL_VINEYARDS = {
  mittelmosel: [
    'bernkasteler-doctor',
    'bernkasteler-lay',
    'brauneberger-juffer',
    'brauneberger-juffer-sonnenuhr',
    'erdener-busslay',
    'erdener-pralat',
    'erdener-treppchen',
    'graacher-abtsberg',
    'graacher-domprobst',
    'graacher-himmelreich',
    'kestener-paulinshofberg',
    'lieser-niederberg-helden',
    'piesporter-domherr',
    'piesporter-goldtropfchen',
    'trittenheimer-apotheke',
    'urziger-goldwingert',
    'urziger-wurzgarten',
    'wehlener-sonnenuhr',
    'wintricher-ohligsberg',
    'zeltinger-sonnenuhr',
  ],
  saar: [
    'ayler-herrenberger',
    'ayler-kupp',
    'kanzemer-altenberg',
    'kanzemer-sonnenberg',
    'ockfener-bockstein',
    'ockfener-geisberg',
    'scharzhofberg',
    'serriger-schloss-saarfelser-schlossberg',
    'wiltinger-braune-kupp',
    'wiltinger-braunfels',
    'wiltinger-gottesfuss',
  ],
  ruwer: [
    'eitelsbacher-marienholz',
    'karthauserhofberg',
    'kaseler-kehrnagel',
    'kaseler-nieschen',
    'maximin-grunhauser-abtsberg',
    'maximin-grunhauser-bruderberg',
    'maximin-grunhauser-herrenberg',
  ],
  terrassenmosel: [
    'koberner-uhlen',
    'pundericher-marienburg',
    'pundericher-nonnenberg',
    'winninger-hamm',
    'winninger-rottgen',
    'winninger-uhlen-blaufusser-lay',
    'winninger-uhlen-laubach',
    'winninger-uhlen-roth-lay',
  ],
  obermosel: [
    'nitteler-leiterchen',
    'palzemer-lay',
  ],
};

// Convert slug to display name
function slugToName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Check if guide already exists
function guideExists(filename: string): boolean {
  const guidesDir = path.join(process.cwd(), 'guides');
  const filePath = path.join(guidesDir, filename);
  return fs.existsSync(filePath);
}

interface BatchResult {
  subRegion: string;
  total: number;
  successful: number;
  skipped: number;
  failed: number;
  totalCost: number;
  totalWords: number;
  duration: number;
  errors: string[];
}

async function generateSubRegionVineyards(
  subRegionName: string,
  vineyards: string[],
  skipExisting: boolean = true
): Promise<BatchResult> {
  const startTime = Date.now();
  const result: BatchResult = {
    subRegion: subRegionName,
    total: vineyards.length,
    successful: 0,
    skipped: 0,
    failed: 0,
    totalCost: 0,
    totalWords: 0,
    duration: 0,
    errors: [],
  };

  console.log(`\n${'='.repeat(70)}`);
  console.log(`🍷 GENERATING ${subRegionName.toUpperCase()} VINEYARD GUIDES`);
  console.log(`${'='.repeat(70)}`);
  console.log(`Total vineyards: ${vineyards.length}`);
  console.log(`Skip existing: ${skipExisting}`);
  console.log(`${'='.repeat(70)}\n`);

  for (let i = 0; i < vineyards.length; i++) {
    const slug = vineyards[i];
    const vineyardName = slugToName(slug);
    const filename = `${slug}-guide.md`;

    console.log(`\n[${i + 1}/${vineyards.length}] ${vineyardName}`);

    // Check if guide exists
    if (skipExisting && guideExists(filename)) {
      console.log(`   ⏭️  Guide already exists, skipping...`);
      result.skipped++;
      continue;
    }

    try {
      const generationResult = await generateRegionGuide(
        vineyardName,
        'sub-region',
        `germany/mosel/${subRegionName}`,
        filename
      );

      if (generationResult.success) {
        result.successful++;
        result.totalCost += generationResult.metrics.totalCost;
        result.totalWords += generationResult.metrics.wordCount;
      } else {
        result.failed++;
        result.errors.push(`${vineyardName}: ${generationResult.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      result.failed++;
      result.errors.push(`${vineyardName}: ${(error as Error).message}`);
      console.error(`   ❌ Error: ${(error as Error).message}`);
    }

    // Small delay between requests to avoid overwhelming the API
    if (i < vineyards.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  result.duration = Date.now() - startTime;

  // Print sub-region summary
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📊 ${subRegionName.toUpperCase()} SUMMARY`);
  console.log(`${'='.repeat(70)}`);
  console.log(`Total: ${result.total}`);
  console.log(`Successful: ${result.successful}`);
  console.log(`Skipped: ${result.skipped}`);
  console.log(`Failed: ${result.failed}`);
  console.log(`Total words: ${result.totalWords.toLocaleString()}`);
  console.log(`Total cost: $${result.totalCost.toFixed(2)}`);
  console.log(`Duration: ${Math.floor(result.duration / 1000 / 60)}m ${Math.floor((result.duration / 1000) % 60)}s`);

  if (result.errors.length > 0) {
    console.log(`\n❌ Errors:`);
    result.errors.forEach(err => console.log(`   ${err}`));
  }

  console.log(`${'='.repeat(70)}\n`);

  return result;
}

async function main() {
  const args = process.argv.slice(2);
  const skipExisting = !args.includes('--force');

  console.log('\n🍷 MOSEL VINEYARD GUIDE BATCH GENERATOR');
  console.log('='.repeat(70));
  console.log(`Mode: ${skipExisting ? 'Skip existing guides' : 'Regenerate all'}`);
  console.log('='.repeat(70));

  const overallStart = Date.now();
  const allResults: BatchResult[] = [];

  // Generate all sub-region vineyards
  for (const [subRegion, vineyards] of Object.entries(MOSEL_VINEYARDS)) {
    const result = await generateSubRegionVineyards(
      subRegion,
      vineyards,
      skipExisting
    );
    allResults.push(result);
  }

  // Overall summary
  const overallDuration = Date.now() - overallStart;
  const totalVineyards = allResults.reduce((sum, r) => sum + r.total, 0);
  const totalSuccessful = allResults.reduce((sum, r) => sum + r.successful, 0);
  const totalSkipped = allResults.reduce((sum, r) => sum + r.skipped, 0);
  const totalFailed = allResults.reduce((sum, r) => sum + r.failed, 0);
  const totalWords = allResults.reduce((sum, r) => sum + r.totalWords, 0);
  const totalCost = allResults.reduce((sum, r) => sum + r.totalCost, 0);

  console.log('\n' + '='.repeat(70));
  console.log('🎉 FINAL SUMMARY - ALL MOSEL SUB-REGIONS');
  console.log('='.repeat(70));
  console.log(`Total vineyards: ${totalVineyards}`);
  console.log(`Successful: ${totalSuccessful}`);
  console.log(`Skipped: ${totalSkipped}`);
  console.log(`Failed: ${totalFailed}`);
  console.log(`\nTotal words: ${totalWords.toLocaleString()}`);
  console.log(`Average per guide: ${Math.round(totalWords / totalSuccessful)} words`);
  console.log(`\nTotal cost: $${totalCost.toFixed(2)}`);
  console.log(`Average per guide: $${(totalCost / totalSuccessful).toFixed(4)}`);
  console.log(`\nTotal duration: ${Math.floor(overallDuration / 1000 / 60)}m ${Math.floor((overallDuration / 1000) % 60)}s`);
  console.log('='.repeat(70));

  // Per-sub-region breakdown
  console.log('\n📊 PER-SUB-REGION BREAKDOWN:');
  console.log('='.repeat(70));
  allResults.forEach(r => {
    console.log(`\n${r.subRegion.toUpperCase()}:`);
    console.log(`  Guides: ${r.successful}/${r.total} (${r.skipped} skipped, ${r.failed} failed)`);
    console.log(`  Words: ${r.totalWords.toLocaleString()}`);
    console.log(`  Cost: $${r.totalCost.toFixed(2)}`);
  });

  console.log('\n' + '='.repeat(70));
  console.log('✅ BATCH GENERATION COMPLETE');
  console.log('='.repeat(70) + '\n');
}

main().catch(console.error);
