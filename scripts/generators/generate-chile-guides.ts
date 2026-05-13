/**
 * CHILEAN REGION GUIDE GENERATOR
 */

import { generateRegionGuide } from './wine-region-guide-generator';
import * as fs from 'fs';
import * as path from 'path';

const CHILEAN_REGIONS = [
  { name: 'Maipo Valley', slug: 'maipo-valley' },
  { name: 'Colchagua Valley', slug: 'colchagua-valley' },
  { name: 'Casablanca Valley', slug: 'casablanca-valley' },
  { name: 'Cachapoal Valley', slug: 'cachapoal-valley' },
  { name: 'Curicó Valley', slug: 'curico-valley' },
  { name: 'Maule Valley', slug: 'maule-valley' },
  { name: 'San Antonio Valley', slug: 'san-antonio-valley' },
  { name: 'Leyda Valley', slug: 'leyda-valley' },
  { name: 'Limarí Valley', slug: 'limari-valley' },
  { name: 'Elqui Valley', slug: 'elqui-valley' },
  { name: 'Itata Valley', slug: 'itata-valley' },
  { name: 'Bío-Bío Valley', slug: 'bio-bio-valley' },
];

async function main() {
  console.log('🇨🇱 CHILEAN REGION GUIDE GENERATOR');
  console.log('='.repeat(70));

  let totalCost = 0;
  let completed = 0;
  let skipped = 0;

  for (let i = 0; i < CHILEAN_REGIONS.length; i++) {
    const region = CHILEAN_REGIONS[i];
    const guideFilename = `${region.slug}-guide.md`;
    const fullPath = path.join(process.cwd(), 'guides', guideFilename);

    if (fs.existsSync(fullPath)) {
      console.log(`⏭️  ${region.name} - Already exists\n`);
      skipped++;
      continue;
    }

    console.log(`📝 ${region.name} (${i + 1}/${CHILEAN_REGIONS.length})`);

    try {
      const result = await generateRegionGuide(region.name, 'region', 'chile', guideFilename);

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
  console.log(`Completed: ${completed}/${CHILEAN_REGIONS.length} | Cost: $${totalCost.toFixed(2)}`);
  console.log('='.repeat(70));
}

main();
