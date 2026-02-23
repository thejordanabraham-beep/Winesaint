/**
 * GENERATE AUSTRIAN REGION GUIDES
 *
 * Generates comprehensive guides for Austrian wine regions
 */

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const REGIONS = [
  { slug: 'kamptal', name: 'Kamptal', vineyardCount: 19 },
  { slug: 'kremstal', name: 'Kremstal', vineyardCount: 29 },
  { slug: 'wagram', name: 'Wagram', vineyardCount: 40 },
  { slug: 'thermenregion', name: 'Thermenregion', vineyardCount: 21 },
  { slug: 'traisental', name: 'Traisental', vineyardCount: 6 },
  { slug: 'wien', name: 'Wien (Vienna)', vineyardCount: 12 },
  { slug: 'carnuntum', name: 'Carnuntum', vineyardCount: 9 },
];

async function generateRegionGuide(region: typeof REGIONS[0]) {
  const guideFile = path.join(process.cwd(), 'guides', `${region.slug}-guide.md`);

  if (fs.existsSync(guideFile)) {
    console.log(`   ⏭️  Skipping ${region.name} - guide already exists`);
    return { success: true, cost: 0 };
  }

  const prompt = `Generate a comprehensive guide for the ${region.name} wine region in Austria.

This guide should be 2,500-3,500 words and cover:

1. **Overview & History**
   - Geographic location in Austria
   - Historical significance and development
   - Climate and general terroir characteristics

2. **Grape Varieties**
   - Primary grape varieties (Grüner Veltliner, Riesling, etc.)
   - Regional specialties and clones
   - Winemaking styles

3. **Terroir & Geology**
   - Soil types and their distribution
   - Topography and vineyard sites
   - How terroir influences wine styles

4. **Classification System**
   - Erste Lage (First Growth) or Rieda vineyards in the region
   - DAC (Districtus Austriae Controllatus) regulations if applicable
   - Quality levels and distinctions

5. **Notable Vineyards & Sites**
   - Key vineyards and their characteristics
   - Mention that the region has ${region.vineyardCount} classified vineyards
   - Site-specific terroir differences

6. **Producers & Wine Styles**
   - Leading producers and estates
   - Typical wine profiles and characteristics
   - Aging potential and drinking windows

7. **Food Pairing & Serving**
   - Traditional Austrian food pairings
   - Serving temperatures and glassware
   - Vintage variations to consider

Format as markdown with proper headings. Write in an authoritative, educational tone suitable for wine professionals and enthusiasts. Include specific details about the region's unique characteristics that distinguish it from other Austrian wine regions.`;

  try {
    console.log(`   🔄 Generating ${region.name} guide...`);

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

    console.log(`   ✅ Generated ${region.name} (${outputTokens.toLocaleString()} tokens, $${cost.toFixed(3)})`);

    return { success: true, cost };
  } catch (error) {
    console.error(`   ❌ Error generating ${region.name}:`, error);
    return { success: false, cost: 0 };
  }
}

async function generateAllRegionGuides() {
  console.log('\n🇦🇹 GENERATING AUSTRIAN REGION GUIDES');
  console.log('='.repeat(70));

  let totalCost = 0;
  let successCount = 0;

  for (const region of REGIONS) {
    const result = await generateRegionGuide(region);
    totalCost += result.cost;
    if (result.success) successCount++;

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n✅ COMPLETE');
  console.log('='.repeat(70));
  console.log(`Guides generated: ${successCount}/${REGIONS.length}`);
  console.log(`Total cost: $${totalCost.toFixed(2)}`);
}

generateAllRegionGuides().catch(console.error);
