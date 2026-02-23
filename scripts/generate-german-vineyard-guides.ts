/**
 * BATCH GERMAN VINEYARD GUIDE GENERATOR
 *
 * Generates all vineyard guides for Rheingau, Pfalz, and Rheinhessen
 * Uses the wine-region-guide-generator with level="sub-region" for vineyards
 */

import { generateRegionGuide, type GenerationResult } from './wine-region-guide-generator';
import fs from 'fs';
import path from 'path';

// All vineyards organized by region
const VINEYARDS = {
  rheingau: [
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
  ],
  pfalz: [
    'annaberg',
    'burgergarten-im-breumel',
    'felsenberg',
    'freundstuck',
    'gaisbohl',
    'grainhubel',
    'guldenwingert',
    'herrenberg',
    'heydenreich',
    'hohenmorgen',
    'holle-unterer-faulenberg',
    'idig',
    'im-grossen-garten',
    'im-sonnenschein',
    'im-sonnenschein-ganz-horn',
    'jesuitengarten',
    'kalkberg',
    'kalkofen',
    'kalmit',
    'kammerberg',
    'kastanienbusch',
    'kastanienbusch-koppel',
    'kieselberg',
    'kirchberg',
    'kirchenstuck',
    'kirschgarten',
    'kostert',
    'kreuzberg',
    'langenmorgen',
    'mandelberg',
    'mandelberg-am-speyrer-weg',
    'mandelpfad',
    'meerspinne',
    'michelsberg',
    'munzberg',
    'odinstal',
    'olberg-hart',
    'pechstein',
    'philippsbrunnen',
    'radling',
    'reiterpfad-an-den-achtmorgen',
    'reiterpfad-hofstuck',
    'reiterpfad-in-der-hohl',
    'rosenkranz-im-untern-kreuz',
    'rosenkranz-zinkelerde',
    'sankt-paul',
    'saumagen',
    'schawer',
    'schild',
    'schwarzer-herrgott',
    'sonnenberg',
    'steinbuckel',
    'ungeheuer',
    'vogelsang',
    'weilberg',
  ],
  rheinhessen: [
    'aulerde',
    'brudersberg',
    'brunnenhauschen',
    'burgel',
    'burgweg',
    'falkenberg',
    'fenchelberg',
    'frauenberg',
    'geiersberg',
    'glock',
    'heerkretz',
    'herrenberg',
    'hipping',
    'hollberg',
    'hollenbrand',
    'honigberg',
    'horn',
    'hundertgulden',
    'kirchberg',
    'kirchenstuck',
    'kirchspiel',
    'kloppberg',
    'kranzberg',
    'kreuz',
    'leckerberg',
    'liebfrauenstift-kirchenstuck',
    'morstein',
    'oberer-hubacker',
    'olberg',
    'orbel',
    'pares',
    'paterberg',
    'pettenthal',
    'rothenberg',
    'sacktrager',
    'scharlachberg',
    'schloss-westerhaus',
    'steinacker',
    'tafelstein',
    'zehnmorgen',
    'zellerweg-am-schwarzen-herrgott',
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
  region: string;
  total: number;
  successful: number;
  skipped: number;
  failed: number;
  totalCost: number;
  totalWords: number;
  duration: number;
  errors: string[];
}

async function generateRegionVineyards(
  regionName: string,
  vineyards: string[],
  skipExisting: boolean = true
): Promise<BatchResult> {
  const startTime = Date.now();
  const result: BatchResult = {
    region: regionName,
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
  console.log(`🍷 GENERATING ${regionName.toUpperCase()} VINEYARD GUIDES`);
  console.log(`${'='.repeat(70)}`);
  console.log(`Total vineyards: ${vineyards.length}`);
  console.log(`Skip existing: ${skipExisting}`);
  console.log(`${'='.repeat(70)}\n`);

  for (let i = 0; i < vineyards.length; i++) {
    const slug = vineyards[i];
    const vineyardName = slugToName(slug);
    const filename = `${slug}-vineyard-guide.md`;

    console.log(`\n[${ i + 1}/${vineyards.length}] ${vineyardName}`);

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
        `germany/${regionName}`,
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

  // Print region summary
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📊 ${regionName.toUpperCase()} SUMMARY`);
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

  console.log('\n🍷 GERMAN VINEYARD GUIDE BATCH GENERATOR');
  console.log('='.repeat(70));
  console.log(`Mode: ${skipExisting ? 'Skip existing guides' : 'Regenerate all'}`);
  console.log('='.repeat(70));

  const overallStart = Date.now();
  const allResults: BatchResult[] = [];

  // Generate Rheingau vineyards
  const rheingauResult = await generateRegionVineyards(
    'rheingau',
    VINEYARDS.rheingau,
    skipExisting
  );
  allResults.push(rheingauResult);

  // Generate Pfalz vineyards
  const pfalzResult = await generateRegionVineyards(
    'pfalz',
    VINEYARDS.pfalz,
    skipExisting
  );
  allResults.push(pfalzResult);

  // Generate Rheinhessen vineyards
  const rheinhessenResult = await generateRegionVineyards(
    'rheinhessen',
    VINEYARDS.rheinhessen,
    skipExisting
  );
  allResults.push(rheinhessenResult);

  // Overall summary
  const overallDuration = Date.now() - overallStart;
  const totalVineyards = allResults.reduce((sum, r) => sum + r.total, 0);
  const totalSuccessful = allResults.reduce((sum, r) => sum + r.successful, 0);
  const totalSkipped = allResults.reduce((sum, r) => sum + r.skipped, 0);
  const totalFailed = allResults.reduce((sum, r) => sum + r.failed, 0);
  const totalWords = allResults.reduce((sum, r) => sum + r.totalWords, 0);
  const totalCost = allResults.reduce((sum, r) => sum + r.totalCost, 0);

  console.log('\n' + '='.repeat(70));
  console.log('🎉 FINAL SUMMARY - ALL REGIONS');
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

  // Per-region breakdown
  console.log('\n📊 PER-REGION BREAKDOWN:');
  console.log('='.repeat(70));
  allResults.forEach(r => {
    console.log(`\n${r.region.toUpperCase()}:`);
    console.log(`  Guides: ${r.successful}/${r.total} (${r.skipped} skipped, ${r.failed} failed)`);
    console.log(`  Words: ${r.totalWords.toLocaleString()}`);
    console.log(`  Cost: $${r.totalCost.toFixed(2)}`);
  });

  console.log('\n' + '='.repeat(70));
  console.log('✅ BATCH GENERATION COMPLETE');
  console.log('='.repeat(70) + '\n');
}

main().catch(console.error);
