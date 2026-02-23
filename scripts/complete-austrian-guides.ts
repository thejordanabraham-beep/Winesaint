/**
 * COMPLETE MISSING AUSTRIAN VINEYARD GUIDES
 * Only generates guides that don't already exist
 */

import { generateRegionGuide, type GenerationResult } from './wine-region-guide-generator';
import * as fs from 'fs';
import * as path from 'path';

// Region mapping
const REGION_MAP: Record<string, string> = {
  'carnuntum-erste-lage': 'Carnuntum',
  'kamptal-erste-lage': 'Kamptal',
  'kremstal-erste-lage': 'Kremstal',
  'mittelburgenland': 'Mittelburgenland',
  'neusiedlersee': 'Neusiedlersee',
  'sudsteiermark': 'Südsteiermark',
  'thermenregion-erste-lage': 'Thermenregion',
  'traisental-erste-lage': 'Traisental',
  'vienna-erste-lage': 'Wien',
  'wachau-rieda': 'Wachau',
  'wagram-erste-lage': 'Wagram',
};

function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface MissingGuide {
  name: string;
  slug: string;
  region: string;
}

async function findMissingGuides(): Promise<MissingGuide[]> {
  const missing: MissingGuide[] = [];
  const dataDir = path.join(process.cwd(), 'data');
  const guidesDir = path.join(process.cwd(), 'guides');

  const dataFiles = fs.readdirSync(dataDir).filter(f => f.startsWith('austria-') && f.endsWith('.json'));

  for (const file of dataFiles) {
    const filePath = path.join(dataDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const regionKey = file.replace('austria-', '').replace('.json', '');
    const regionName = REGION_MAP[regionKey];

    for (const vineyard of data) {
      const slug = slugify(vineyard.name);
      const guidePath = path.join(guidesDir, `${slug}-guide.md`);

      if (!fs.existsSync(guidePath)) {
        missing.push({
          name: vineyard.name,
          slug,
          region: regionName
        });
      }
    }
  }

  return missing;
}

async function generateMissingGuides() {
  console.log('🔍 FINDING MISSING AUSTRIAN VINEYARD GUIDES');
  console.log('='.repeat(70));

  const missing = await findMissingGuides();

  console.log(`Found ${missing.length} missing guides`);
  console.log('='.repeat(70));

  if (missing.length === 0) {
    console.log('✅ All Austrian guides already exist!');
    return;
  }

  const allResults: GenerationResult[] = [];
  const startTime = Date.now();

  for (let i = 0; i < missing.length; i++) {
    const guide = missing[i];
    console.log(`\n[${i + 1}/${missing.length}] ${guide.name} (${guide.region})`);
    console.log('-'.repeat(70));

    try {
      const result = await generateRegionGuide(
        guide.name,
        'vineyard',
        guide.region,
        `${guide.slug}-guide.md`
      );
      allResults.push(result);
      console.log(result.success ? `✅ ${guide.name} - ${result.metrics.wordCount} words - $${result.metrics.totalCost.toFixed(4)}` : `❌ ${guide.name} - FAILED`);
    } catch (error) {
      console.log(`❌ ${guide.name} - ERROR: ${(error as Error).message}`);
    }
  }

  const duration = Date.now() - startTime;
  const successful = allResults.filter(r => r.success);
  const totalCost = allResults.reduce((sum, r) => sum + r.metrics.totalCost, 0);
  const totalWords = allResults.reduce((sum, r) => sum + r.metrics.wordCount, 0);

  console.log('\n\n' + '='.repeat(70));
  console.log('🇦🇹 MISSING AUSTRIAN GUIDES - COMPLETION SUMMARY');
  console.log('='.repeat(70));
  console.log(`Successful: ${successful.length}/${missing.length}`);
  console.log(`Total words: ${totalWords.toLocaleString()}`);
  console.log(`Average: ${Math.round(totalWords / (successful.length || 1))} words`);
  console.log(`Total cost: $${totalCost.toFixed(2)}`);
  console.log(`Duration: ${Math.floor(duration / 1000 / 60)}m ${Math.floor((duration / 1000) % 60)}s`);
  console.log('='.repeat(70));
}

generateMissingGuides().catch(console.error);
