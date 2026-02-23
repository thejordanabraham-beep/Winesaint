import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const BURGUNDY_PATH = '/Users/jordanabraham/wine-reviews/app/regions/france/burgundy';
const GUIDES_PATH = '/Users/jordanabraham/wine-reviews/guides';

const SUB_REGIONS = [
  { name: 'Côte de Nuits', slug: 'cote-de-nuits' },
  { name: 'Côte de Beaune', slug: 'cote-de-beaune' },
  { name: 'Côte Chalonnaise', slug: 'cote-chalonnaise' },
];

// Grand Cru list
const GRAND_CRU_SLUGS = new Set([
  'chambertin', 'chambertin-clos-de-beze', 'chapelle-chambertin', 'charmes-chambertin',
  'griotte-chambertin', 'latricieres-chambertin', 'mazis-chambertin', 'mazoyeres-chambertin',
  'ruchottes-chambertin', 'clos-de-tart', 'clos-de-la-roche', 'clos-saint-denis',
  'clos-des-lambrays', 'musigny', 'bonnes-mares', 'clos-de-vougeot', 'romanee-conti',
  'la-tache', 'romanee-saint-vivant', 'richebourg', 'la-grande-rue', 'echezeaux',
  'grands-echezeaux', 'corton', 'corton-charlemagne', 'charlemagne', 'montrachet',
  'chevalier-montrachet', 'batard-montrachet', 'bienvenues-batard-montrachet',
  'criots-batard-montrachet',
]);

interface MissingGuide {
  slug: string;
  commune: string;
  subRegion: string;
  expectedFile: string;
  classification: 'grand-cru' | 'premier-cru' | 'village';
}

function extractContentFile(pageContent: string): string | null {
  const match = pageContent.match(/contentFile=["']([^"']+)["']/);
  return match ? match[1] : null;
}

function extractVineyardName(pageContent: string): string {
  const titleMatch = pageContent.match(/title=["']([^"']+)["']/);
  return titleMatch ? titleMatch[1] : '';
}

function getClassification(slug: string): 'grand-cru' | 'premier-cru' | 'village' {
  if (GRAND_CRU_SLUGS.has(slug)) return 'grand-cru';
  return 'premier-cru'; // Default for Burgundy
}

function findMissingGuides(): MissingGuide[] {
  const missing: MissingGuide[] = [];

  for (const subRegion of SUB_REGIONS) {
    const subRegionPath = path.join(BURGUNDY_PATH, subRegion.slug);
    if (!fs.existsSync(subRegionPath)) continue;

    const communes = fs.readdirSync(subRegionPath, { withFileTypes: true });

    for (const commune of communes) {
      if (!commune.isDirectory()) continue;

      const communePath = path.join(subRegionPath, commune.name);
      const vineyards = fs.readdirSync(communePath, { withFileTypes: true });

      for (const vineyard of vineyards) {
        if (!vineyard.isDirectory()) continue;

        const pagePath = path.join(communePath, vineyard.name, 'page.tsx');
        if (!fs.existsSync(pagePath)) continue;

        const pageContent = fs.readFileSync(pagePath, 'utf-8');
        const contentFile = extractContentFile(pageContent);

        if (!contentFile) continue;

        const guidePath = path.join(GUIDES_PATH, contentFile);
        if (!fs.existsSync(guidePath)) {
          missing.push({
            slug: vineyard.name,
            commune: commune.name,
            subRegion: subRegion.name,
            expectedFile: contentFile,
            classification: getClassification(vineyard.name),
          });
        }
      }
    }
  }

  return missing;
}

async function generateGuide(guide: MissingGuide): Promise<{ success: boolean; cost: number }> {
  const prompt = guide.classification === 'grand-cru' ? `Generate a comprehensive guide for ${guide.slug.replace(/-/g, ' ')}, a Grand Cru vineyard in ${guide.commune.replace(/-/g, ' ')}, ${guide.subRegion}, Burgundy, France.

This is one of the world's most prestigious vineyards. This guide should be 2,500-3,500 words and provide exceptionally deep, authoritative coverage including:

1. Overview & Location
2. Size & Parcellation
3. Terroir & Geology
4. Climate & Microclimate
5. Viticulture
6. Wine Character & Style
7. Comparison to Surrounding Crus
8. Notable Producers & Their Parcels
9. Historical Significance & Evolution
10. Aging Potential & Quality Levels
11. Market Position & Collectibility

DO NOT include food pairing, visiting/tourism, or serving recommendations. Focus entirely on the vineyard, terroir, viticulture, and wine character.

Write in an authoritative, educational tone. This is factual wine education content.` : `Generate a comprehensive guide for ${guide.slug.replace(/-/g, ' ')}, a Premier Cru vineyard in ${guide.commune.replace(/-/g, ' ')}, ${guide.subRegion}, Burgundy, France.

This guide should be 2,000-2,800 words and provide thorough coverage including:

1. Overview & Location
2. Size
3. Terroir & Geology
4. Climate & Microclimate
5. Viticulture
6. Wine Character & Style
7. Comparison to Surrounding Crus
8. Notable Producers
9. Historical Background & Classification
10. Aging Potential & Quality Level

DO NOT include food pairing, visiting/tourism, or serving recommendations. Focus entirely on the vineyard, terroir, viticulture, and wine character.

Write in an authoritative, educational tone. This is factual wine education content.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      temperature: 1,
      thinking: { type: 'disabled' },
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map(block => block.text)
      .join('\n\n');

    const guidePath = path.join(GUIDES_PATH, guide.expectedFile);
    fs.writeFileSync(guidePath, content, 'utf-8');

    const cost = (response.usage.input_tokens * 0.003 + response.usage.output_tokens * 0.015) / 1000;

    console.log(`   ✅ ${guide.slug} (${content.length} chars)`);
    console.log(`   💰 Cost: $${cost.toFixed(3)}`);

    return { success: true, cost };
  } catch (error) {
    console.log(`   ❌ Error: ${guide.slug}:`, error);
    return { success: false, cost: 0 };
  }
}

async function generateAll() {
  console.log('🍷 GENERATING MISSING BURGUNDY GUIDES\n');
  console.log('═'.repeat(80));

  const missing = findMissingGuides();
  console.log(`\nFound ${missing.length} missing guides\n`);

  const grandCrus = missing.filter(g => g.classification === 'grand-cru');
  const premierCrus = missing.filter(g => g.classification === 'premier-cru');

  console.log(`   Grand Crus: ${grandCrus.length}`);
  console.log(`   Premier Crus: ${premierCrus.length}\n`);
  console.log('═'.repeat(80));

  let totalCost = 0;
  let generated = 0;

  for (let i = 0; i < missing.length; i++) {
    const guide = missing[i];
    const emoji = guide.classification === 'grand-cru' ? '👑' : '⭐';

    console.log(`\n${emoji} [${i + 1}/${missing.length}] ${guide.slug} (${guide.commune})`);

    const result = await generateGuide(guide);
    if (result.success) {
      generated++;
      totalCost += result.cost;
    }

    // Rate limiting
    if (i < missing.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 900));
    }
  }

  console.log('\n\n' + '═'.repeat(80));
  console.log('✨ GENERATION COMPLETE!');
  console.log(`   Generated: ${generated}/${missing.length}`);
  console.log(`   Total Cost: $${totalCost.toFixed(2)}`);
}

generateAll().catch(console.error);
