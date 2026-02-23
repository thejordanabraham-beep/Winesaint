/**
 * GENERATE ALTO PIEMONTE GUIDES
 *
 * Generates comprehensive guides for Alto Piemonte and its 6 appellations
 */

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const GUIDES = [
  {
    slug: 'alto-piemonte',
    name: 'Alto Piemonte',
    wordCount: '3,000-4,000',
    isMain: true,
    description: 'Overview of the entire Alto Piemonte region'
  },
  {
    slug: 'gattinara',
    name: 'Gattinara',
    wordCount: '2,500-3,500',
    isMain: false,
    description: 'Gattinara DOCG appellation'
  },
  {
    slug: 'ghemme',
    name: 'Ghemme',
    wordCount: '2,500-3,500',
    isMain: false,
    description: 'Ghemme DOCG appellation'
  },
  {
    slug: 'lessona',
    name: 'Lessona',
    wordCount: '2,000-2,500',
    isMain: false,
    description: 'Lessona DOC appellation'
  },
  {
    slug: 'bramaterra',
    name: 'Bramaterra',
    wordCount: '2,000-2,500',
    isMain: false,
    description: 'Bramaterra DOC appellation'
  },
  {
    slug: 'boca',
    name: 'Boca',
    wordCount: '2,000-2,500',
    isMain: false,
    description: 'Boca DOC appellation'
  },
  {
    slug: 'carema',
    name: 'Carema',
    wordCount: '2,000-2,500',
    isMain: false,
    description: 'Carema DOC appellation'
  }
];

async function generateGuide(guide: typeof GUIDES[0]) {
  const guideFile = path.join(process.cwd(), 'guides', `${guide.slug}-guide.md`);

  if (fs.existsSync(guideFile)) {
    console.log(`   ⏭️  Skipping ${guide.name} - guide already exists`);
    return { success: true, cost: 0 };
  }

  let prompt = '';

  if (guide.isMain) {
    prompt = `Generate a comprehensive guide for the Alto Piemonte wine region in Piedmont, Italy.

This guide should be ${guide.wordCount} words and cover:

1. **Overview & Geography**
   - Location in northern Piedmont
   - Historical significance as one of Italy's oldest wine regions
   - Relationship to other Piedmont regions (Barolo, Barbaresco)

2. **History**
   - Ancient winemaking heritage (pre-Roman)
   - Golden age in the 19th century
   - Decline and recent renaissance
   - Modern revival and emerging producers

3. **Climate & Terroir**
   - Alpine influence and continental climate
   - Unique volcanic and glacial soils (porphyry)
   - High-altitude vineyards
   - Diurnal temperature variation

4. **Grape Varieties**
   - Nebbiolo (local name: Spanna)
   - Supporting varieties (Vespolina, Uva Rara/Bonarda)
   - Clonal differences from Langhe Nebbiolo
   - Winemaking traditions

5. **Appellations**
   - Gattinara DOCG (largest, most prestigious)
   - Ghemme DOCG
   - Lessona DOC
   - Bramaterra DOC
   - Boca DOC
   - Carema DOC
   - How they differ in style and terroir

6. **Wine Styles & Characteristics**
   - Nebbiolo expression in Alto Piemonte vs Barolo/Barbaresco
   - Aging potential and evolution
   - Food pairing traditions

7. **Leading Producers**
   - Historic estates and modern pioneers
   - Quality levels and investment opportunities

Format as markdown with proper headings. Write in an authoritative, educational tone suitable for wine professionals and enthusiasts.`;
  } else {
    prompt = `Generate a comprehensive guide for the ${guide.name} appellation in Alto Piemonte, Piedmont, Italy.

This guide should be ${guide.wordCount} words and cover:

1. **Overview**
   - Location within Alto Piemonte
   - Historical significance and development
   - DOCG/DOC status and regulations

2. **Terroir & Geology**
   - Specific soil types (volcanic porphyry, glacial, etc.)
   - Vineyard sites and exposure
   - Altitude and microclimate
   - How terroir shapes wine character

3. **Viticulture**
   - Grape varieties and percentages required
   - Nebbiolo (Spanna) clones and characteristics
   - Blending regulations (if applicable)
   - Vineyard practices and traditions

4. **Wine Production**
   - Production volume and statistics
   - Winemaking styles and techniques
   - Aging requirements
   - Quality tiers within the appellation

5. **Wine Character & Style**
   - Typical flavor profiles
   - Comparison to other Alto Piemonte appellations
   - Comparison to Barolo/Barbaresco if relevant
   - Aging potential and evolution

6. **Notable Producers**
   - Leading estates and winemakers
   - Historic vs modern producers
   - Standout bottlings

7. **Food Pairing & Service**
   - Traditional local cuisine pairings
   - Serving recommendations
   - Vintage considerations

Format as markdown with proper headings. Write in an authoritative, educational tone suitable for wine professionals and enthusiasts. Include specific details that distinguish ${guide.name} from other Alto Piemonte appellations.`;
  }

  try {
    console.log(`   🔄 Generating ${guide.name} guide...`);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 16000,
      thinking: {
        type: 'enabled',
        budget_tokens: 10000
      },
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    // Extract text content from response
    let guideContent = '';
    for (const block of response.content) {
      if (block.type === 'text') {
        guideContent += block.text;
      }
    }

    if (!guideContent.trim()) {
      throw new Error('No content generated');
    }

    // Write to file
    fs.writeFileSync(guideFile, guideContent);

    // Calculate cost
    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const cost = (inputTokens / 1000000) * 3 + (outputTokens / 1000000) * 15;

    console.log(`   ✅ Generated ${guide.name} (${outputTokens.toLocaleString()} tokens, $${cost.toFixed(3)})`);

    return { success: true, cost };
  } catch (error) {
    console.error(`   ❌ Error generating ${guide.name}:`, error);
    return { success: false, cost: 0 };
  }
}

async function generateAllGuides() {
  console.log('\n🏔️  GENERATING ALTO PIEMONTE GUIDES');
  console.log('='.repeat(70));

  let totalCost = 0;
  let successCount = 0;

  for (const guide of GUIDES) {
    const result = await generateGuide(guide);
    totalCost += result.cost;
    if (result.success) successCount++;

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n✅ COMPLETE');
  console.log('='.repeat(70));
  console.log(`Guides generated: ${successCount}/${GUIDES.length}`);
  console.log(`Total cost: $${totalCost.toFixed(2)}`);
}

generateAllGuides().catch(console.error);
