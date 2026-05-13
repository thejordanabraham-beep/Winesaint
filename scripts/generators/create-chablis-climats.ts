/**
 * CREATE CHABLIS GRAND CRU AND PREMIER CRU PAGES AND GUIDES
 *
 * Creates page.tsx files and guides for all Chablis climats
 */

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const CHABLIS_GRAND_CRUS = [
  { name: 'Blanchot', slug: 'blanchot' },
  { name: 'Bougros', slug: 'bougros' },
  { name: 'Les Clos', slug: 'les-clos' },
  { name: 'Grenouilles', slug: 'grenouilles' },
  { name: 'Preuses', slug: 'preuses' },
  { name: 'Valmur', slug: 'valmur' },
  { name: 'Vaudésir', slug: 'vaudesir' }
];

const CHABLIS_PREMIER_CRUS = [
  { name: 'Beauroy', slug: 'beauroy' },
  { name: 'Berdiot', slug: 'berdiot' },
  { name: 'Butteaux', slug: 'butteaux' },
  { name: 'Côte de Jouan', slug: 'cote-de-jouan' },
  { name: 'Côte de Savant', slug: 'cote-de-savant' },
  { name: 'Côte de Vaubarousse', slug: 'cote-de-vaubarousse' },
  { name: 'Forêt', slug: 'foret' },
  { name: 'Fourchaume', slug: 'fourchaume' },
  { name: 'Les Beauregards', slug: 'les-beauregards' },
  { name: 'Les Fourneaux', slug: 'les-fourneaux' },
  { name: 'Mont de Milieu', slug: 'mont-de-milieu' },
  { name: 'Montée de Tonnerre', slug: 'montee-de-tonnerre' },
  { name: 'Montmains', slug: 'montmains' },
  { name: 'Vaillons', slug: 'vaillons' },
  { name: 'Vaucoupin', slug: 'vaucoupin' },
  { name: 'Vaudevey', slug: 'vaudevey' },
  { name: 'Vosgros', slug: 'vosgros' }
];

function createPageFile(climat: { name: string; slug: string }, classification: 'grand-cru' | 'premier-cru') {
  const climatDir = path.join(
    process.cwd(),
    'app/regions/france/burgundy/chablis',
    climat.slug
  );
  const pagePath = path.join(climatDir, 'page.tsx');

  // Create directory
  if (!fs.existsSync(climatDir)) {
    fs.mkdirSync(climatDir, { recursive: true });
  }

  // Skip if page already exists
  if (fs.existsSync(pagePath)) {
    console.log(`   ⏭️  Skipping ${climat.name} page - already exists`);
    return false;
  }

  // Generate function name from slug
  const functionName = climat.slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');

  const pageContent = `import RegionLayout from '@/components/RegionLayout';

export default function ${functionName}Page() {
  return (
    <RegionLayout
      title="${climat.name}"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      contentFile="${climat.slug}-guide.md"
    />
  );
}
`;

  fs.writeFileSync(pagePath, pageContent);
  console.log(`   ✅ Created page: ${climat.slug}/page.tsx`);
  return true;
}

async function generateGuide(climat: { name: string; slug: string }, classification: 'grand-cru' | 'premier-cru') {
  const guideFile = path.join(process.cwd(), 'guides', `${climat.slug}-guide.md`);

  if (fs.existsSync(guideFile)) {
    console.log(`   ⏭️  Skipping ${climat.name} guide - already exists`);
    return { success: true, cost: 0 };
  }

  const classificationLabel = classification === 'grand-cru' ? 'Grand Cru' : 'Premier Cru';
  const wordCount = classification === 'grand-cru' ? '2,000-2,500' : '1,500-2,000';

  const prompt = `Generate a comprehensive guide for ${climat.name}, a Chablis ${classificationLabel} climat in Burgundy, France.

This guide should be ${wordCount} words and cover:

1. **Overview & Classification**
   - Location within Chablis
   - ${classificationLabel} designation
   - Size and boundaries
   - Historical significance

2. **Terroir & Geology**
   - Specific soil types (Kimmeridgian marl, limestone, etc.)
   - Vineyard exposition and slope
   - Altitude and drainage
   - Unique terroir characteristics

3. **Climate & Viticulture**
   - Microclimate within Chablis
   - Frost risk and protection methods
   - Chardonnay expressions
   - Viticultural practices

4. **Wine Character & Style**
   - Typical flavor profiles and aromas
   - Comparison to other Chablis ${classificationLabel}s
   - Minerality, acidity, body characteristics
   - How terroir shapes the wine

5. **Aging & Evolution**
   - Aging potential
   - Evolution in bottle
   - Optimal drinking windows
   - Vintage variations

6. **Notable Producers**
   - Leading domaines with holdings in ${climat.name}
   - Benchmark bottlings
   - Winemaking approaches

7. **Food Pairing & Service**
   - Classic pairings (oysters, seafood, etc.)
   - Serving temperature
   - Decanting recommendations

Format as markdown with proper headings. Write in an authoritative, educational tone suitable for wine professionals and enthusiasts. Include specific details about what makes ${climat.name} unique within Chablis.`;

  try {
    console.log(`   🔄 Generating ${climat.name} (${classificationLabel}) guide...`);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 12000,
      thinking: {
        type: 'enabled',
        budget_tokens: 8000
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

    console.log(`   ✅ Generated ${climat.name} (${outputTokens.toLocaleString()} tokens, $${cost.toFixed(3)})`);

    return { success: true, cost };
  } catch (error) {
    console.error(`   ❌ Error generating ${climat.name}:`, error);
    return { success: false, cost: 0 };
  }
}

async function createChablisClimats() {
  console.log('\n🍇 CREATING CHABLIS GRAND CRU & PREMIER CRU PAGES AND GUIDES');
  console.log('='.repeat(70));

  let totalCost = 0;
  let pagesCreated = 0;
  let guidesGenerated = 0;

  // Step 1: Grand Crus
  console.log('\n🏆 GRAND CRUS (7 climats)');
  console.log('-'.repeat(70));

  for (const climat of CHABLIS_GRAND_CRUS) {
    if (createPageFile(climat, 'grand-cru')) {
      pagesCreated++;
    }
  }

  for (const climat of CHABLIS_GRAND_CRUS) {
    const result = await generateGuide(climat, 'grand-cru');
    totalCost += result.cost;
    if (result.success && result.cost > 0) {
      guidesGenerated++;
    }
    if (result.cost > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Step 2: Premier Crus
  console.log('\n⭐ PREMIER CRUS (17 climats)');
  console.log('-'.repeat(70));

  for (const climat of CHABLIS_PREMIER_CRUS) {
    if (createPageFile(climat, 'premier-cru')) {
      pagesCreated++;
    }
  }

  for (const climat of CHABLIS_PREMIER_CRUS) {
    const result = await generateGuide(climat, 'premier-cru');
    totalCost += result.cost;
    if (result.success && result.cost > 0) {
      guidesGenerated++;
    }
    if (result.cost > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n✅ COMPLETE');
  console.log('='.repeat(70));
  console.log(`Pages created: ${pagesCreated}`);
  console.log(`Guides generated: ${guidesGenerated}/24`);
  console.log(`Total cost: $${totalCost.toFixed(2)}`);
}

createChablisClimats().catch(console.error);
