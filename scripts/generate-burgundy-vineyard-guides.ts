import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface VineyardInfo {
  name: string;
  slug: string;
  commune: string;
  communeSlug: string;
  subRegion: string;
  classification: 'grand-cru' | 'premier-cru' | 'village';
}

const BURGUNDY_PATH = '/Users/jordanabraham/wine-reviews/app/regions/france/burgundy';
const GUIDES_PATH = '/Users/jordanabraham/wine-reviews/guides';

const SUB_REGIONS = [
  { name: 'Côte de Nuits', slug: 'cote-de-nuits' },
  { name: 'Côte de Beaune', slug: 'cote-de-beaune' },
  { name: 'Côte Chalonnaise', slug: 'cote-chalonnaise' },
];

// Official Burgundy Grand Crus (hardcoded list for identification)
const GRAND_CRU_SLUGS = new Set([
  // Gevrey-Chambertin Grand Crus
  'chambertin',
  'chambertin-clos-de-beze',
  'chapelle-chambertin',
  'charmes-chambertin',
  'griotte-chambertin',
  'latricieres-chambertin',
  'mazis-chambertin',
  'mazoyeres-chambertin',
  'ruchottes-chambertin',
  // Morey-Saint-Denis Grand Crus
  'clos-de-tart',
  'clos-de-la-roche',
  'clos-saint-denis',
  'clos-des-lambrays',
  // Chambolle-Musigny Grand Crus
  'musigny',
  'bonnes-mares',
  // Vougeot Grand Crus
  'clos-de-vougeot',
  // Vosne-Romanée Grand Crus
  'romanee-conti',
  'la-tache',
  'romanee-saint-vivant',
  'richebourg',
  'la-grande-rue',
  'echezeaux',
  'grands-echezeaux',
  // Flagey-Echézeaux Grand Crus (same as above)
  // Côte de Beaune Grand Crus
  'corton',
  'corton-charlemagne',
  'charlemagne',
  'montrachet',
  'chevalier-montrachet',
  'batard-montrachet',
  'bienvenues-batard-montrachet',
  'criots-batard-montrachet',
]);

function extractVineyardName(pageContent: string): string {
  const titleMatch = pageContent.match(/title=["']([^"']+)["']/);
  return titleMatch ? titleMatch[1] : '';
}

function extractClassification(pageContent: string, slug: string): 'grand-cru' | 'premier-cru' | 'village' {
  // Check hardcoded Grand Cru list first
  if (GRAND_CRU_SLUGS.has(slug)) {
    return 'grand-cru';
  }

  // Try to extract from page content
  const classificationMatch = pageContent.match(/classification=["']([^"']+)["']/);
  if (classificationMatch) {
    return classificationMatch[1] as 'grand-cru' | 'premier-cru' | 'village';
  }

  return 'village';
}

function scanCommune(communePath: string, communeSlug: string, communeName: string, subRegion: string): VineyardInfo[] {
  const vineyards: VineyardInfo[] = [];

  if (!fs.existsSync(communePath)) return vineyards;

  const entries = fs.readdirSync(communePath, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const vineyardSlug = entry.name;
    const vineyardPath = path.join(communePath, vineyardSlug);
    const pagePath = path.join(vineyardPath, 'page.tsx');

    if (!fs.existsSync(pagePath)) continue;

    const pageContent = fs.readFileSync(pagePath, 'utf-8');
    const vineyardName = extractVineyardName(pageContent);
    const classification = extractClassification(pageContent, vineyardSlug);

    vineyards.push({
      name: vineyardName,
      slug: vineyardSlug,
      commune: communeName,
      communeSlug: communeSlug,
      subRegion: subRegion,
      classification: classification,
    });
  }

  return vineyards;
}

function getAllVineyards(): VineyardInfo[] {
  const allVineyards: VineyardInfo[] = [];

  for (const subRegion of SUB_REGIONS) {
    const subRegionPath = path.join(BURGUNDY_PATH, subRegion.slug);
    if (!fs.existsSync(subRegionPath)) continue;

    const communes = fs.readdirSync(subRegionPath, { withFileTypes: true });

    for (const commune of communes) {
      if (!commune.isDirectory()) continue;

      const communePath = path.join(subRegionPath, commune.name);
      const communeName = commune.name
        .split('-')
        .map((word, index) => {
          const lowerWords = ['de', 'du', 'des', 'la', 'le', 'les', 'au', 'aux'];
          if (index > 0 && lowerWords.includes(word)) return word;
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join('-');

      const vineyards = scanCommune(communePath, commune.name, communeName, subRegion.name);
      // Filter out village-level vineyards - focus on Grand Crus and Premier Crus only
      const filtered = vineyards.filter(v => v.classification !== 'village');
      allVineyards.push(...filtered);
    }
  }

  return allVineyards;
}

function getPromptByClassification(vineyard: VineyardInfo): { prompt: string; targetWords: string } {
  const baseContext = `Generate a comprehensive guide for ${vineyard.name}, a ${vineyard.classification === 'grand-cru' ? 'Grand Cru' : vineyard.classification === 'premier-cru' ? 'Premier Cru' : 'village-level climat'} vineyard in ${vineyard.commune}, ${vineyard.subRegion}, Burgundy, France.

This is an official Burgundy appellation. Burgundy is the world's most complex and information-rich wine region, with centuries of documented history.`;

  if (vineyard.classification === 'grand-cru') {
    return {
      targetWords: '2,500-3,500 words',
      prompt: `${baseContext}

This is one of the world's most prestigious vineyards. This guide should be 2,500-3,500 words and provide exceptionally deep, authoritative coverage including:

1. **Overview & Location**: Precise location within ${vineyard.commune}, relationship to the ${vineyard.subRegion}, geographical context
2. **Size & Parcellation**: Total hectares/acres, how the vineyard is divided among producers, major parcel owners
3. **Terroir & Geology**: Detailed soil composition (limestone types, depth, drainage), slope angles, precise aspect (direction), elevation, underlying geology and formation
4. **Climate & Microclimate**: Specific mesoclimate characteristics of this site, how it differs from surrounding vineyards
5. **Viticulture**: Grape varieties grown (Pinot Noir and/or Chardonnay), typical vine age, planting density, training methods, viticultural challenges specific to this site
6. **Wine Character & Style**: Detailed flavor profiles, aromatic signatures, structural characteristics, textural qualities, what makes this Grand Cru distinctive
7. **Comparison to Surrounding Grand Crus and Premier Crus**: Critical for Burgundy understanding - how wines from ${vineyard.name} differ in character from neighboring climats in ${vineyard.commune} and nearby communes
8. **Notable Producers & Their Parcels**: Specific producers who own parcels, approximate parcel sizes where known, stylistic differences among producers
9. **Historical Significance & Evolution**: Centuries of history, monastic origins if applicable, how reputation has evolved, famous vintages
10. **Aging Potential & Quality Levels**: How wines evolve over decades, longevity expectations, quality differences by vintage and producer
11. **Market Position & Collectibility**: Rarity, pricing tiers, collector demand

DO NOT include food pairing sections, visiting/tourism information, or serving temperature recommendations. Focus entirely on the vineyard, terroir, viticulture, and wine character.

Write in an authoritative, educational tone. This is factual wine education content.`
    };
  } else if (vineyard.classification === 'premier-cru') {
    return {
      targetWords: '2,000-2,800 words',
      prompt: `${baseContext}

This is a highly regarded climat in Burgundy's classification system. This guide should be 2,000-2,800 words and provide thorough, authoritative coverage including:

1. **Overview & Location**: Position within ${vineyard.commune}, relation to the ${vineyard.subRegion}, geographical context
2. **Size**: Total hectares/acres of the climat
3. **Terroir & Geology**: Soil composition (types of limestone, clay content, depth), slope characteristics, aspect (orientation), elevation, geological formation
4. **Climate & Microclimate**: Specific climatic characteristics, mesoclimate effects, how it compares to surrounding sites
5. **Viticulture**: Grape varieties (Pinot Noir and/or Chardonnay), typical vine age, planting density, common viticultural practices, site-specific challenges
6. **Wine Character & Style**: Detailed flavor profiles, aromatic characteristics, structural qualities, textural elements, what distinguishes this Premier Cru
7. **Comparison to Surrounding Crus**: How wines from ${vineyard.name} differ from neighboring Premier Crus in ${vineyard.commune}, and how they compare to any Grand Crus in the commune if applicable
8. **Notable Producers**: Who makes wine from this climat, parcel information where available, stylistic variations among producers
9. **Historical Background & Classification**: History of the climat, when it was classified as Premier Cru, historical reputation
10. **Aging Potential & Quality Level**: Evolution trajectory, aging expectations, quality consistency

DO NOT include food pairing sections, visiting/tourism information, or serving temperature recommendations. Focus entirely on the vineyard, terroir, viticulture, and wine character.

Write in an authoritative, educational tone. This is factual wine education content.`
    };
  } else {
    return {
      targetWords: '1,500-2,000 words',
      prompt: `${baseContext}

This is a village-level climat in ${vineyard.commune}. This guide should be 1,500-2,000 words and provide solid coverage including:

1. **Overview & Location**: Position within ${vineyard.commune}, relation to the ${vineyard.subRegion}
2. **Size**: Approximate hectares/acres if known
3. **Terroir & Geology**: Soil composition, slope, aspect, elevation, geological context
4. **Climate & Microclimate**: Climatic characteristics of the site
5. **Viticulture**: Grape varieties grown, typical viticultural practices, any site-specific characteristics
6. **Wine Character & Style**: Flavor profiles, aromatic qualities, structural characteristics, typical qualities
7. **Comparison to the Commune's Premier Crus and Grand Crus**: How this village-level wine compares in character and quality to ${vineyard.commune}'s classified vineyards
8. **Notable Producers**: Who produces wine from this climat, if known
9. **Historical Context**: Background of the lieu-dit, historical use
10. **Quality Level & Value**: Quality expectations, value proposition compared to higher classifications

DO NOT include food pairing sections, visiting/tourism information, or serving temperature recommendations. Focus entirely on the vineyard, terroir, viticulture, and wine character.

Write in an authoritative, educational tone. This is factual wine education content.`
    };
  }
}

async function generateVineyardGuide(vineyard: VineyardInfo): Promise<{ success: boolean; cost: number; skipped: boolean }> {
  const guideFile = path.join(GUIDES_PATH, `${vineyard.slug}-vineyard-guide.md`);

  // Skip if already exists
  if (fs.existsSync(guideFile)) {
    console.log(`   ⏭️  Skipped: ${vineyard.name} (guide exists)`);
    return { success: true, cost: 0, skipped: true };
  }

  const { prompt, targetWords } = getPromptByClassification(vineyard);

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      temperature: 1,
      thinking: {
        type: 'disabled',
      },
      messages: [{
        role: 'user',
        content: prompt,
      }],
    });

    const content = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map(block => block.text)
      .join('\n\n');

    fs.writeFileSync(guideFile, content, 'utf-8');

    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const estimatedCost = (inputTokens * 0.003 + outputTokens * 0.015) / 1000;

    console.log(`   ✅ Generated ${vineyard.name} (${content.length} chars, ${targetWords})`);
    console.log(`   💰 Cost: $${estimatedCost.toFixed(3)}`);

    return { success: true, cost: estimatedCost, skipped: false };
  } catch (error) {
    console.log(`   ❌ Error generating ${vineyard.name}:`, error);
    return { success: false, cost: 0, skipped: false };
  }
}

async function generateAllVineyardGuides() {
  console.log('🍷 BURGUNDY VINEYARD GUIDE GENERATION');
  console.log('Generating comprehensive guides for all vineyards\n');
  console.log('═'.repeat(80));

  const startTime = Date.now();

  const allVineyards = getAllVineyards();

  // Group by sub-region and classification
  const grandCrus = allVineyards.filter(v => v.classification === 'grand-cru');
  const premierCrus = allVineyards.filter(v => v.classification === 'premier-cru');
  const village = allVineyards.filter(v => v.classification === 'village');

  console.log(`\n📊 VINEYARD INVENTORY:`);
  console.log(`   Grand Crus: ${grandCrus.length}`);
  console.log(`   Premier Crus: ${premierCrus.length}`);
  console.log(`   Village-level: ${village.length}`);
  console.log(`   TOTAL: ${allVineyards.length} vineyards\n`);
  console.log('═'.repeat(80));

  let totalCost = 0;
  let generated = 0;
  let skipped = 0;
  let errors = 0;

  // Process all vineyards
  for (let i = 0; i < allVineyards.length; i++) {
    const vineyard = allVineyards[i];
    const classEmoji = vineyard.classification === 'grand-cru' ? '👑' : vineyard.classification === 'premier-cru' ? '⭐' : '🍇';

    console.log(`\n${classEmoji} [${i + 1}/${allVineyards.length}] ${vineyard.name} (${vineyard.commune})`);
    console.log(`   Classification: ${vineyard.classification}`);

    const result = await generateVineyardGuide(vineyard);

    if (result.skipped) {
      skipped++;
    } else if (result.success) {
      generated++;
      totalCost += result.cost;
    } else {
      errors++;
    }

    // Rate limiting - 0.9 second delay between requests
    if (i < allVineyards.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 900));
    }
  }

  const endTime = Date.now();
  const totalMinutes = ((endTime - startTime) / 1000 / 60).toFixed(1);

  console.log('\n\n' + '═'.repeat(80));
  console.log('✨ VINEYARD GUIDE GENERATION COMPLETE!');
  console.log(`   Time: ${totalMinutes} minutes`);
  console.log(`   Generated: ${generated} new guides`);
  console.log(`   Skipped: ${skipped} existing guides`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Total Cost: $${totalCost.toFixed(2)}`);
  console.log('\n🎯 Burgundy guide generation fully complete!');
  console.log(`   Total guides: ${26 + generated} (26 communes + ${generated} vineyards)`);
}

generateAllVineyardGuides().catch(console.error);
