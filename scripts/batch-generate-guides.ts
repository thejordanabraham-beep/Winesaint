/**
 * BATCH GUIDE GENERATION SCRIPT
 *
 * Generates all missing region guides in priority order
 * Tracks progress, costs, and provides detailed statistics
 */

import { generateRegionGuide, type GenerationResult } from './wine-region-guide-generator';
import fs from 'fs';
import path from 'path';

interface RegionTask {
  regionName: string;
  level: 'country' | 'region' | 'sub-region';
  parentRegion?: string;
  outputFile: string;
  priority: string;
}

// Define all regions to generate
const REGIONS_TO_GENERATE: RegionTask[] = [
  // PRIORITY 1 - GREECE (15 guides)
  { regionName: 'Greece', level: 'country', outputFile: 'greece-guide.md', priority: 'P1-Greece' },
  { regionName: 'Santorini', level: 'region', parentRegion: 'Greece', outputFile: 'santorini-guide.md', priority: 'P1-Greece' },
  { regionName: 'Crete', level: 'region', parentRegion: 'Greece', outputFile: 'crete-guide.md', priority: 'P1-Greece' },
  { regionName: 'Cephalonia', level: 'region', parentRegion: 'Greece', outputFile: 'cephalonia-guide.md', priority: 'P1-Greece' },
  { regionName: 'Samos', level: 'region', parentRegion: 'Greece', outputFile: 'samos-guide.md', priority: 'P1-Greece' },
  { regionName: 'Rapsani', level: 'region', parentRegion: 'Greece', outputFile: 'rapsani-guide.md', priority: 'P1-Greece' },
  { regionName: 'Attica', level: 'region', parentRegion: 'Greece', outputFile: 'attica-guide.md', priority: 'P1-Greece' },
  { regionName: 'Northern Greece', level: 'region', parentRegion: 'Greece', outputFile: 'northern-greece-guide.md', priority: 'P1-Greece' },
  { regionName: 'Naoussa', level: 'sub-region', parentRegion: 'Northern Greece', outputFile: 'naoussa-guide.md', priority: 'P1-Greece' },
  { regionName: 'Amyndeon', level: 'sub-region', parentRegion: 'Northern Greece', outputFile: 'amyndeon-guide.md', priority: 'P1-Greece' },
  { regionName: 'Drama', level: 'sub-region', parentRegion: 'Northern Greece', outputFile: 'drama-guide.md', priority: 'P1-Greece' },
  { regionName: 'Peloponnese', level: 'region', parentRegion: 'Greece', outputFile: 'peloponnese-guide.md', priority: 'P1-Greece' },
  { regionName: 'Nemea', level: 'sub-region', parentRegion: 'Peloponnese', outputFile: 'nemea-guide.md', priority: 'P1-Greece' },
  { regionName: 'Mantinia', level: 'sub-region', parentRegion: 'Peloponnese', outputFile: 'mantinia-guide.md', priority: 'P1-Greece' },
  { regionName: 'Patras', level: 'sub-region', parentRegion: 'Peloponnese', outputFile: 'patras-guide.md', priority: 'P1-Greece' },

  // PRIORITY 2 - SPAIN RIOJA SUB-REGIONS (3 guides)
  { regionName: 'Rioja Alta', level: 'sub-region', parentRegion: 'Rioja', outputFile: 'rioja-alta-guide.md', priority: 'P2-Rioja' },
  { regionName: 'Rioja Alavesa', level: 'sub-region', parentRegion: 'Rioja', outputFile: 'rioja-alavesa-guide.md', priority: 'P2-Rioja' },
  { regionName: 'Rioja Oriental', level: 'sub-region', parentRegion: 'Rioja', outputFile: 'rioja-oriental-guide.md', priority: 'P2-Rioja' },

  // PRIORITY 3 - ITALIAN REGIONAL OVERVIEWS (12 guides)
  { regionName: 'Abruzzo', level: 'region', parentRegion: 'Italy', outputFile: 'abruzzo-guide.md', priority: 'P3-Italy-Regions' },
  { regionName: 'Basilicata', level: 'region', parentRegion: 'Italy', outputFile: 'basilicata-guide.md', priority: 'P3-Italy-Regions' },
  { regionName: 'Calabria', level: 'region', parentRegion: 'Italy', outputFile: 'calabria-guide.md', priority: 'P3-Italy-Regions' },
  { regionName: 'Emilia-Romagna', level: 'region', parentRegion: 'Italy', outputFile: 'emilia-romagna-guide.md', priority: 'P3-Italy-Regions' },
  { regionName: 'Friuli-Venezia Giulia', level: 'region', parentRegion: 'Italy', outputFile: 'friuli-venezia-giulia-guide.md', priority: 'P3-Italy-Regions' },
  { regionName: 'Liguria', level: 'region', parentRegion: 'Italy', outputFile: 'liguria-guide.md', priority: 'P3-Italy-Regions' },
  { regionName: 'Molise', level: 'region', parentRegion: 'Italy', outputFile: 'molise-guide.md', priority: 'P3-Italy-Regions' },
  { regionName: 'Sardinia', level: 'region', parentRegion: 'Italy', outputFile: 'sardinia-guide.md', priority: 'P3-Italy-Regions' },
  { regionName: 'Lombardy', level: 'region', parentRegion: 'Italy', outputFile: 'lombardy-guide.md', priority: 'P3-Italy-Regions' },
  { regionName: 'Marche', level: 'region', parentRegion: 'Italy', outputFile: 'marche-guide.md', priority: 'P3-Italy-Regions' },
  { regionName: 'Puglia', level: 'region', parentRegion: 'Italy', outputFile: 'puglia-guide.md', priority: 'P3-Italy-Regions' },
  { regionName: 'Umbria', level: 'region', parentRegion: 'Italy', outputFile: 'umbria-guide.md', priority: 'P3-Italy-Regions' },

  // PRIORITY 4 - ITALIAN SUB-REGIONS (28 guides)
  // Sicily
  { regionName: 'Etna', level: 'sub-region', parentRegion: 'Sicily', outputFile: 'etna-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Marsala', level: 'sub-region', parentRegion: 'Sicily', outputFile: 'marsala-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Cerasuolo di Vittoria', level: 'sub-region', parentRegion: 'Sicily', outputFile: 'cerasuolo-di-vittoria-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Pantelleria', level: 'sub-region', parentRegion: 'Sicily', outputFile: 'pantelleria-guide.md', priority: 'P4-Italy-SubRegions' },

  // Campania
  { regionName: 'Taurasi', level: 'sub-region', parentRegion: 'Campania', outputFile: 'taurasi-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Fiano di Avellino', level: 'sub-region', parentRegion: 'Campania', outputFile: 'fiano-di-avellino-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Greco di Tufo', level: 'sub-region', parentRegion: 'Campania', outputFile: 'greco-di-tufo-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Aglianico del Taburno', level: 'sub-region', parentRegion: 'Campania', outputFile: 'aglianico-del-taburno-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Falerno del Massico', level: 'sub-region', parentRegion: 'Campania', outputFile: 'falerno-del-massico-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Lacryma Christi del Vesuvio', level: 'sub-region', parentRegion: 'Campania', outputFile: 'lacryma-christi-del-vesuvio-guide.md', priority: 'P4-Italy-SubRegions' },

  // Lombardy
  { regionName: 'Franciacorta', level: 'sub-region', parentRegion: 'Lombardy', outputFile: 'franciacorta-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Valtellina', level: 'sub-region', parentRegion: 'Lombardy', outputFile: 'valtellina-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Oltrepo Pavese', level: 'sub-region', parentRegion: 'Lombardy', outputFile: 'oltrepo-pavese-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Lugana', level: 'sub-region', parentRegion: 'Lombardy', outputFile: 'lugana-guide.md', priority: 'P4-Italy-SubRegions' },

  // Marche
  { regionName: 'Verdicchio dei Castelli di Jesi', level: 'sub-region', parentRegion: 'Marche', outputFile: 'verdicchio-dei-castelli-di-jesi-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Verdicchio di Matelica', level: 'sub-region', parentRegion: 'Marche', outputFile: 'verdicchio-di-matelica-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Conero', level: 'sub-region', parentRegion: 'Marche', outputFile: 'conero-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: "Lacrima di Morro d'Alba", level: 'sub-region', parentRegion: 'Marche', outputFile: 'lacrima-di-morro-d-alba-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Rosso Piceno', level: 'sub-region', parentRegion: 'Marche', outputFile: 'rosso-piceno-guide.md', priority: 'P4-Italy-SubRegions' },

  // Puglia
  { regionName: 'Primitivo di Manduria', level: 'sub-region', parentRegion: 'Puglia', outputFile: 'primitivo-di-manduria-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Salice Salentino', level: 'sub-region', parentRegion: 'Puglia', outputFile: 'salice-salentino-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Castel del Monte', level: 'sub-region', parentRegion: 'Puglia', outputFile: 'castel-del-monte-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Gioia del Colle', level: 'sub-region', parentRegion: 'Puglia', outputFile: 'gioia-del-colle-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Locorotondo', level: 'sub-region', parentRegion: 'Puglia', outputFile: 'locorotondo-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Copertino', level: 'sub-region', parentRegion: 'Puglia', outputFile: 'copertino-guide.md', priority: 'P4-Italy-SubRegions' },

  // Umbria
  { regionName: 'Montefalco', level: 'sub-region', parentRegion: 'Umbria', outputFile: 'montefalco-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Orvieto', level: 'sub-region', parentRegion: 'Umbria', outputFile: 'orvieto-guide.md', priority: 'P4-Italy-SubRegions' },
  { regionName: 'Torgiano', level: 'sub-region', parentRegion: 'Umbria', outputFile: 'torgiano-guide.md', priority: 'P4-Italy-SubRegions' },

  // PRIORITY 5 - GERMAN REGIONS (8 guides)
  { regionName: 'Nahe', level: 'region', parentRegion: 'Germany', outputFile: 'nahe-guide.md', priority: 'P5-Germany' },
  { regionName: 'Baden', level: 'region', parentRegion: 'Germany', outputFile: 'baden-guide.md', priority: 'P5-Germany' },
  { regionName: 'Franken', level: 'region', parentRegion: 'Germany', outputFile: 'franken-guide.md', priority: 'P5-Germany' },
  { regionName: 'Ahr', level: 'region', parentRegion: 'Germany', outputFile: 'ahr-guide.md', priority: 'P5-Germany' },
  { regionName: 'Mittelrhein', level: 'region', parentRegion: 'Germany', outputFile: 'mittelrhein-guide.md', priority: 'P5-Germany' },
  { regionName: 'Saale-Unstrut', level: 'region', parentRegion: 'Germany', outputFile: 'saale-unstrut-guide.md', priority: 'P5-Germany' },
  { regionName: 'Sachsen', level: 'region', parentRegion: 'Germany', outputFile: 'sachsen-guide.md', priority: 'P5-Germany' },
  { regionName: 'Wurttemberg', level: 'region', parentRegion: 'Germany', outputFile: 'wurttemberg-guide.md', priority: 'P5-Germany' },
];

interface BatchStats {
  totalRegions: number;
  successCount: number;
  failureCount: number;
  totalCost: number;
  totalWords: number;
  totalDuration: number;
  results: GenerationResult[];
}

async function batchGenerateGuides(): Promise<BatchStats> {
  const stats: BatchStats = {
    totalRegions: REGIONS_TO_GENERATE.length,
    successCount: 0,
    failureCount: 0,
    totalCost: 0,
    totalWords: 0,
    totalDuration: 0,
    results: [],
  };

  console.log('\n🍷 BATCH GUIDE GENERATION');
  console.log('='.repeat(70));
  console.log(`Total regions to generate: ${stats.totalRegions}`);
  console.log('='.repeat(70));

  const guidesDir = path.join(process.cwd(), 'guides');
  const existingGuides = fs.existsSync(guidesDir)
    ? fs.readdirSync(guidesDir).filter(f => f.endsWith('.md'))
    : [];

  let currentPriority = '';

  for (let i = 0; i < REGIONS_TO_GENERATE.length; i++) {
    const task = REGIONS_TO_GENERATE[i];

    // Print priority header
    if (task.priority !== currentPriority) {
      currentPriority = task.priority;
      console.log('\n' + '='.repeat(70));
      console.log(`📍 ${currentPriority}`);
      console.log('='.repeat(70));
    }

    // Check if guide already exists
    if (existingGuides.includes(task.outputFile)) {
      console.log(`\n⏭️  [${i + 1}/${stats.totalRegions}] SKIPPING: ${task.regionName} (guide already exists)`);
      continue;
    }

    console.log(`\n▶️  [${i + 1}/${stats.totalRegions}] GENERATING: ${task.regionName}`);
    console.log(`    Level: ${task.level}${task.parentRegion ? ` | Parent: ${task.parentRegion}` : ''}`);

    const result = await generateRegionGuide(
      task.regionName,
      task.level,
      task.parentRegion,
      task.outputFile
    );

    stats.results.push(result);

    if (result.success) {
      stats.successCount++;
      stats.totalCost += result.metrics.totalCost;
      stats.totalWords += result.metrics.wordCount;
      stats.totalDuration += result.metrics.duration;
      console.log(`✅ SUCCESS: ${task.regionName} (${result.metrics.wordCount} words, $${result.metrics.totalCost.toFixed(4)})`);
    } else {
      stats.failureCount++;
      console.log(`❌ FAILED: ${task.regionName} - ${result.error?.message}`);
    }

    // Progress update
    console.log(`\n📊 PROGRESS: ${stats.successCount}/${stats.totalRegions} complete | Cost so far: $${stats.totalCost.toFixed(2)}`);

    // Small delay between generations to avoid rate limits
    if (i < REGIONS_TO_GENERATE.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return stats;
}

async function main() {
  const startTime = Date.now();

  console.log('\n🚀 Starting batch guide generation...\n');

  const stats = await batchGenerateGuides();

  const totalTime = Date.now() - startTime;
  const avgTimePerGuide = stats.successCount > 0 ? totalTime / stats.successCount : 0;
  const avgCostPerGuide = stats.successCount > 0 ? stats.totalCost / stats.successCount : 0;
  const avgWordsPerGuide = stats.successCount > 0 ? stats.totalWords / stats.successCount : 0;

  console.log('\n' + '='.repeat(70));
  console.log('📈 FINAL STATISTICS');
  console.log('='.repeat(70));
  console.log(`Total regions processed: ${stats.totalRegions}`);
  console.log(`✅ Successful: ${stats.successCount}`);
  console.log(`❌ Failed: ${stats.failureCount}`);
  console.log(`\n💰 COST ANALYSIS:`);
  console.log(`   Total cost: $${stats.totalCost.toFixed(2)}`);
  console.log(`   Average per guide: $${avgCostPerGuide.toFixed(4)}`);
  console.log(`\n📝 CONTENT METRICS:`);
  console.log(`   Total words: ${stats.totalWords.toLocaleString()}`);
  console.log(`   Average per guide: ${Math.round(avgWordsPerGuide).toLocaleString()}`);
  console.log(`\n⏱️  TIME METRICS:`);
  console.log(`   Total time: ${Math.floor(totalTime / 1000 / 60)}m ${Math.floor((totalTime / 1000) % 60)}s`);
  console.log(`   Average per guide: ${Math.floor(avgTimePerGuide / 1000)}s`);
  console.log('='.repeat(70));

  // Save detailed report
  const reportPath = path.join(process.cwd(), 'guides', '_batch-generation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    stats,
    totalTime,
    avgTimePerGuide,
    avgCostPerGuide,
    avgWordsPerGuide,
  }, null, 2));

  console.log(`\n📄 Detailed report saved to: ${reportPath}`);

  if (stats.failureCount > 0) {
    console.log('\n⚠️  Some guides failed to generate. Check the report for details.');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
}

export { batchGenerateGuides, REGIONS_TO_GENERATE };
