/**
 * BATCH GENERATE ALL AUSTRIAN VINEYARD GUIDES
 * Launches all Austrian regions sequentially
 */

import { generateRegionGuide, type GenerationResult } from './wine-region-guide-generator';
import * as fs from 'fs';
import * as path from 'path';

// Load all Austrian data files
const dataDir = path.join(process.cwd(), 'data');

const regionFiles = [
  { file: 'austria-wachau-rieda.json', region: 'Wachau' },
  { file: 'austria-kamptal-erste-lage.json', region: 'Kamptal' },
  { file: 'austria-kremstal-erste-lage.json', region: 'Kremstal' },
  { file: 'austria-wagram-erste-lage.json', region: 'Wagram' },
  { file: 'austria-thermenregion-erste-lage.json', region: 'Thermenregion' },
  { file: 'austria-traisental-erste-lage.json', region: 'Traisental' },
  { file: 'austria-vienna-erste-lage.json', region: 'Wien' },
  { file: 'austria-carnuntum-erste-lage.json', region: 'Carnuntum' },
  { file: 'austria-neusiedlersee.json', region: 'Neusiedlersee' },
  { file: 'austria-mittelburgenland.json', region: 'Mittelburgenland' },
  { file: 'austria-sudsteiermark.json', region: 'Südsteiermark' },
];

function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function generateAllAustrianGuides() {
  console.log('🇦🇹 AUSTRIAN VINEYARD GUIDE GENERATOR - ALL REGIONS');
  console.log('='.repeat(70));

  const allResults: GenerationResult[] = [];
  const startTime = Date.now();

  for (const { file, region } of regionFiles) {
    const filePath = path.join(dataDir, file);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${region} - file not found: ${file}`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`\n📍 ${region.toUpperCase()} - ${data.length} vineyards`);
    console.log('='.repeat(70));

    for (let i = 0; i < data.length; i++) {
      const vineyard = data[i];
      const slug = slugify(vineyard.name);
      const outputFile = `${slug}-guide.md`;

      console.log(`[${i + 1}/${data.length}] Generating: ${vineyard.name}`);

      try {
        const result = await generateRegionGuide(
          vineyard.name,
          'vineyard',
          region,
          outputFile
        );
        allResults.push(result);
        console.log(result.success ? `✅ ${vineyard.name} - ${result.metrics.wordCount} words - $${result.metrics.totalCost.toFixed(4)}` : `❌ ${vineyard.name} - FAILED`);
      } catch (error) {
        console.log(`❌ ${vineyard.name} - ERROR: ${(error as Error).message}`);
      }
    }
  }

  const duration = Date.now() - startTime;
  const successful = allResults.filter(r => r.success);
  const totalCost = allResults.reduce((sum, r) => sum + r.metrics.totalCost, 0);
  const totalWords = allResults.reduce((sum, r) => sum + r.metrics.wordCount, 0);

  console.log('\n\n' + '='.repeat(70));
  console.log('🇦🇹 AUSTRIAN VINEYARD GUIDES - FINAL SUMMARY');
  console.log('='.repeat(70));
  console.log(`Successful: ${successful.length}/${allResults.length}`);
  console.log(`Total words: ${totalWords.toLocaleString()}`);
  console.log(`Average: ${Math.round(totalWords / successful.length)} words`);
  console.log(`Total cost: $${totalCost.toFixed(2)}`);
  console.log(`Duration: ${Math.floor(duration / 1000 / 60)}m ${Math.floor((duration / 1000) % 60)}s`);
  console.log('='.repeat(70));
}

generateAllAustrianGuides().catch(console.error);
