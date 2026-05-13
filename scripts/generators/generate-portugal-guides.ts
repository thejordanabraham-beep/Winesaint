/**
 * PORTUGUESE REGION GUIDE GENERATOR
 */

import { generateRegionGuide } from './wine-region-guide-generator';
import * as fs from 'fs';
import * as path from 'path';

const PORTUGUESE_REGIONS = [
  { name: 'Douro', slug: 'douro' },
  { name: 'Vinho Verde', slug: 'vinho-verde' },
  { name: 'Alentejo', slug: 'alentejo' },
  { name: 'Dão', slug: 'dao' },
  { name: 'Porto', slug: 'porto' },
  { name: 'Madeira', slug: 'madeira' },
  { name: 'Bairrada', slug: 'bairrada' },
  { name: 'Tejo', slug: 'tejo' },
  { name: 'Lisboa', slug: 'lisboa' },
  { name: 'Setúbal', slug: 'setubal' },
  { name: 'Trás-os-Montes', slug: 'tras-os-montes' },
  { name: 'Távora-Varosa', slug: 'tavora-varosa' },
  { name: 'Beira Interior', slug: 'beira-interior' },
  { name: 'Algarve', slug: 'algarve' },
  { name: 'Açores', slug: 'acores' },
];

async function main() {
  console.log('🇵🇹 PORTUGUESE REGION GUIDE GENERATOR');
  console.log('='.repeat(70));

  let totalCost = 0;
  let completed = 0;
  let skipped = 0;

  for (let i = 0; i < PORTUGUESE_REGIONS.length; i++) {
    const region = PORTUGUESE_REGIONS[i];
    const guideFilename = `${region.slug}-guide.md`;
    const fullPath = path.join(process.cwd(), 'guides', guideFilename);

    if (fs.existsSync(fullPath)) {
      console.log(`⏭️  ${region.name} - Already exists\n`);
      skipped++;
      continue;
    }

    console.log(`📝 ${region.name} (${i + 1}/${PORTUGUESE_REGIONS.length})`);

    try {
      const result = await generateRegionGuide(region.name, 'region', 'portugal', guideFilename);

      if (result.success && result.metrics) {
        totalCost += result.metrics.totalCost;
        completed++;
        console.log(`✅ ${result.metrics.wordCount} words, $${result.metrics.totalCost.toFixed(2)}\n`);
      }
    } catch (error) {
      console.error(`❌ ${region.name} failed\n`);
    }
  }

  console.log('='.repeat(70));
  console.log(`Completed: ${completed}/${PORTUGUESE_REGIONS.length} | Cost: $${totalCost.toFixed(2)}`);
  console.log('='.repeat(70));
}

main();
