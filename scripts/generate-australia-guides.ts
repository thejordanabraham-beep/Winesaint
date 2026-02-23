/**
 * AUSTRALIAN REGION GUIDE GENERATOR
 */

import { generateRegionGuide } from './wine-region-guide-generator';
import * as fs from 'fs';
import * as path from 'path';

const AUSTRALIAN_REGIONS = [
  { name: 'Barossa Valley', slug: 'barossa-valley' },
  { name: 'McLaren Vale', slug: 'mclaren-vale' },
  { name: 'Yarra Valley', slug: 'yarra-valley' },
  { name: 'Margaret River', slug: 'margaret-river' },
  { name: 'Hunter Valley', slug: 'hunter-valley' },
  { name: 'Adelaide Hills', slug: 'adelaide-hills' },
  { name: 'Clare Valley', slug: 'clare-valley' },
  { name: 'Coonawarra', slug: 'coonawarra' },
  { name: 'Eden Valley', slug: 'eden-valley' },
  { name: 'Mornington Peninsula', slug: 'mornington-peninsula' },
  { name: 'Tasmania', slug: 'tasmania' },
  { name: 'Orange', slug: 'orange' },
  { name: 'Mudgee', slug: 'mudgee' },
  { name: 'Great Southern', slug: 'great-southern' },
  { name: 'Heathcote', slug: 'heathcote' },
  { name: 'Geelong', slug: 'geelong' },
  { name: 'Beechworth', slug: 'beechworth' },
  { name: 'Pemberton', slug: 'pemberton' },
  { name: 'Hilltops', slug: 'hilltops' },
  { name: 'Gippsland', slug: 'gippsland' },
];

async function main() {
  console.log('🇦🇺 AUSTRALIAN REGION GUIDE GENERATOR');
  console.log('='.repeat(70));

  let totalCost = 0;
  let completed = 0;
  let skipped = 0;

  for (let i = 0; i < AUSTRALIAN_REGIONS.length; i++) {
    const region = AUSTRALIAN_REGIONS[i];
    const guideFilename = `${region.slug}-guide.md`;
    const fullPath = path.join(process.cwd(), 'guides', guideFilename);

    if (fs.existsSync(fullPath)) {
      console.log(`⏭️  ${region.name} - Already exists\n`);
      skipped++;
      continue;
    }

    console.log(`📝 ${region.name} (${i + 1}/${AUSTRALIAN_REGIONS.length})`);

    try {
      const result = await generateRegionGuide(region.name, 'region', 'australia', guideFilename);

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
  console.log(`Completed: ${completed}/${AUSTRALIAN_REGIONS.length} | Cost: $${totalCost.toFixed(2)}`);
  console.log('='.repeat(70));
}

main();
