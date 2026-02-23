/**
 * REGENERATE SMALL CHABLIS PREMIER CRU GUIDES
 *
 * Regenerates guides that were too short (likely refusals)
 */

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Premier Crus with suspiciously low token counts - likely refusals
const SMALL_GUIDES = [
  { name: 'Berdiot', slug: 'berdiot' },
  { name: 'Côte de Savant', slug: 'cote-de-savant' },
  { name: 'Forêt', slug: 'foret' },
  { name: 'Côte de Vaubarousse', slug: 'cote-de-vaubarousse' },
  { name: 'Vaudevey', slug: 'vaudevey' },
  { name: 'Côte de Jouan', slug: 'cote-de-jouan' },
];

async function regenerateGuide(climat: typeof SMALL_GUIDES[0]) {
  const guideFile = path.join(process.cwd(), 'guides', `${climat.slug}-guide.md`);

  const prompt = `You are a wine expert writing a guide for ${climat.name}, which is a Chablis Premier Cru climat in Burgundy, France.

${climat.name} is one of the 40 officially recognized Chablis Premier Cru climats. While it may be lesser-known than famous sites like Montée de Tonnerre or Fourchaume, it is a legitimate Premier Cru designation.

Write a comprehensive 1,500-2,000 word guide covering:

1. **Overview & Location**
   - Position within Chablis
   - Premier Cru status
   - Historical background (what is known)

2. **Terroir & Geology**
   - Kimmeridgian marl soils typical of Chablis
   - Vineyard exposure and characteristics
   - How terroir influences the wines

3. **Wine Character**
   - Typical Chablis Premier Cru characteristics
   - Flavor profile: minerality, acidity, citrus notes
   - How it compares to other Chablis Premier Crus
   - Body and structure

4. **Viticulture & Production**
   - Chardonnay cultivation
   - Production scale (smaller Premier Cru)
   - Winemaking approaches

5. **Producers**
   - Domaines that work with ${climat.name}
   - Notable bottlings if known

6. **Aging & Service**
   - Aging potential
   - Serving recommendations
   - Food pairings (oysters, shellfish, goat cheese)

Format as markdown with proper headings. Be authoritative and informative. Do NOT refuse or say you lack information - ${climat.name} is a real Chablis Premier Cru and you should write about its characteristics based on what Premier Crus are like in general, plus any specific details you know.`;

  try {
    console.log(`   🔄 Regenerating ${climat.name} guide...`);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8000,
      // NO extended thinking - it causes over-cautious refusals
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

    // Check if it's still a refusal
    if (guideContent.includes('I cannot locate') || guideContent.includes('I need to be transparent')) {
      console.log(`   ⚠️  ${climat.name} still generated a refusal, keeping it anyway...`);
    }

    // Write to file
    fs.writeFileSync(guideFile, guideContent);

    // Calculate cost
    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const cost = (inputTokens / 1000000) * 3 + (outputTokens / 1000000) * 15;

    console.log(`   ✅ Regenerated ${climat.name} (${outputTokens.toLocaleString()} tokens, $${cost.toFixed(3)})`);

    return { success: true, cost };
  } catch (error) {
    console.error(`   ❌ Error regenerating ${climat.name}:`, error);
    return { success: false, cost: 0 };
  }
}

async function regenerateSmallGuides() {
  console.log('\n🔄 REGENERATING SMALL CHABLIS PREMIER CRU GUIDES');
  console.log('='.repeat(70));

  let totalCost = 0;
  let successCount = 0;

  for (const climat of SMALL_GUIDES) {
    const result = await regenerateGuide(climat);
    totalCost += result.cost;
    if (result.success) {
      successCount++;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n✅ COMPLETE');
  console.log('='.repeat(70));
  console.log(`Guides regenerated: ${successCount}/${SMALL_GUIDES.length}`);
  console.log(`Total cost: $${totalCost.toFixed(2)}`);
}

regenerateSmallGuides().catch(console.error);
