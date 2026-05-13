/**
 * REGENERATE THE BURN OF COLUMBIA VALLEY GUIDE
 */

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

async function regenerateBurnGuide() {
  const guideFile = path.join(process.cwd(), 'guides', 'burn-of-columbia-valley-guide.md');

  const prompt = `Generate a comprehensive guide for The Burn of Columbia Valley AVA in Washington State.

The Burn of Columbia Valley was approved as an AVA in 2021, making it one of the newest sub-AVAs within the Columbia Valley. It's located in the eastern portion of the Columbia Valley.

This guide should be 1,500-2,000 words and cover:

1. **Overview & Location**
   - Geographic location within Columbia Valley
   - Size and boundaries
   - AVA approval date (2021)
   - Name origin and significance

2. **Climate & Geography**
   - Desert continental climate
   - Rainfall and irrigation
   - Elevation range
   - Topography

3. **Terroir & Soils**
   - Soil composition
   - Glacial and volcanic influences
   - Drainage characteristics
   - How soils impact viticulture

4. **Viticulture**
   - Primary grape varieties
   - Growing season characteristics
   - Vineyard practices
   - Challenges and advantages

5. **Wine Styles**
   - Signature wines
   - Flavor profiles
   - How wines differ from other Columbia Valley sub-AVAs
   - Notable characteristics

6. **Producers & Development**
   - Current wineries and vineyards
   - Development status (newer AVA)
   - Future potential

Format as markdown with proper headings. Write in an authoritative, educational tone.`;

  try {
    console.log('🔄 Regenerating The Burn of Columbia Valley guide...');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    let guideContent = '';
    for (const block of response.content) {
      if (block.type === 'text') {
        guideContent += block.text;
      }
    }

    if (!guideContent.trim()) {
      throw new Error('No content generated');
    }

    fs.writeFileSync(guideFile, guideContent);

    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const cost = (inputTokens / 1000000) * 3 + (outputTokens / 1000000) * 15;

    console.log(`✅ Regenerated The Burn of Columbia Valley (${outputTokens.toLocaleString()} tokens, $${cost.toFixed(3)})`);

    return { success: true, cost };
  } catch (error) {
    console.error('❌ Error regenerating guide:', error);
    return { success: false, cost: 0 };
  }
}

regenerateBurnGuide().catch(console.error);
