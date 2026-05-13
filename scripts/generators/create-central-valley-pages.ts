/**
 * CREATE CENTRAL VALLEY PAGES AND MAIN GUIDE
 */

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const CENTRAL_VALLEY_AVAS = [
  { name: 'Clarksburg', slug: 'clarksburg' },
  { name: 'Cosumnes River', slug: 'cosumnes-river' },
  { name: 'Diablo Grande', slug: 'diablo-grande' },
  { name: 'Jahant', slug: 'jahant' },
  { name: 'Lodi', slug: 'lodi' },
  { name: 'Madera', slug: 'madera' },
  { name: 'Merritt Island', slug: 'merritt-island' },
  { name: 'Mokelumne River', slug: 'mokelumne-river' },
  { name: 'River Junction', slug: 'river-junction' },
  { name: 'Salado Creek', slug: 'salado-creek' },
  { name: 'Sloughhouse', slug: 'sloughhouse' },
  { name: 'Tracy Hills', slug: 'tracy-hills' },
];

function createPageFile(ava: typeof CENTRAL_VALLEY_AVAS[0]) {
  const avaDir = path.join(
    process.cwd(),
    'app/regions/united-states/california/central-valley',
    ava.slug
  );
  const pagePath = path.join(avaDir, 'page.tsx');

  // Create directory
  if (!fs.existsSync(avaDir)) {
    fs.mkdirSync(avaDir, { recursive: true });
  }

  // Skip if page already exists
  if (fs.existsSync(pagePath)) {
    console.log(`   ⏭️  Skipping ${ava.name} page - already exists`);
    return false;
  }

  // Generate function name from slug
  const functionName = ava.slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');

  const pageContent = `import RegionLayout from '@/components/RegionLayout';

export default function ${functionName}Page() {
  return (
    <RegionLayout
      title="${ava.name}"
      level="sub-region"
      parentRegion="united-states/california/central-valley"
      contentFile="${ava.slug}-guide.md"
    />
  );
}
`;

  fs.writeFileSync(pagePath, pageContent);
  console.log(`   ✅ Created page: ${ava.slug}/page.tsx`);
  return true;
}

async function generateCentralValleyGuide() {
  const guideFile = path.join(process.cwd(), 'guides', 'central-valley-guide.md');

  if (fs.existsSync(guideFile)) {
    console.log('   ⏭️  Skipping Central Valley main guide - already exists');
    return { success: true, cost: 0 };
  }

  const prompt = `Generate a comprehensive guide for California's Central Valley wine region.

This guide should be 2,500-3,500 words and cover:

1. **Overview & Geography**
   - Location in California (Sacramento Valley + San Joaquin Valley)
   - Size and scale
   - Relationship to other California wine regions
   - Major cities and landmarks

2. **History**
   - Historical wine production
   - Evolution from bulk wine to quality production
   - Current renaissance and quality focus

3. **Climate**
   - Hot Mediterranean climate
   - Growing degree days
   - Diurnal temperature variation
   - Irrigation needs

4. **Terroir & Soils**
   - Soil diversity (alluvial, sandy, clay)
   - Delta influence in northern areas
   - River systems and their impact

5. **Viticulture**
   - Major grape varieties (Zinfandel, Cabernet, Chardonnay, etc.)
   - Old vine heritage
   - Production volume
   - Quality vs quantity evolution

6. **Sub-AVAs**
   - Overview of the 12 nested AVAs
   - Brief mention of Lodi, Clarksburg, and other key areas
   - Diversity within Central Valley

7. **Wine Styles**
   - Traditional bulk wine production
   - Emerging quality wines
   - Old vine Zinfandel importance
   - Value proposition

8. **Producers**
   - Leading quality-focused producers
   - Historic estates
   - Innovation and investment

9. **Future & Trends**
   - Quality movement
   - Sustainable practices
   - Market positioning

Format as markdown with proper headings. Write in an authoritative, educational tone.

DO NOT include sections on food pairing, visiting/tourism, or serving recommendations.`;

  try {
    console.log('   🔄 Generating Central Valley main guide...');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 12000,
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

    console.log(`   ✅ Generated Central Valley guide (${outputTokens.toLocaleString()} tokens, $${cost.toFixed(3)})`);

    return { success: true, cost };
  } catch (error) {
    console.error('   ❌ Error generating Central Valley guide:', error);
    return { success: false, cost: 0 };
  }
}

async function createCentralValleyPages() {
  console.log('\n🍇 CREATING CENTRAL VALLEY PAGES AND GUIDE');
  console.log('='.repeat(70));

  let pagesCreated = 0;
  let totalCost = 0;

  // Step 1: Create main guide
  console.log('\n📚 Generating main Central Valley guide...');
  const guideResult = await generateCentralValleyGuide();
  totalCost += guideResult.cost;

  // Step 2: Create all sub-AVA page files
  console.log('\n📄 Creating sub-AVA page.tsx files...');
  for (const ava of CENTRAL_VALLEY_AVAS) {
    if (createPageFile(ava)) {
      pagesCreated++;
    }
  }

  console.log('\n✅ COMPLETE');
  console.log('='.repeat(70));
  console.log(`Main guide: ${guideResult.success ? 'Created' : 'Already existed'}`);
  console.log(`Pages created: ${pagesCreated}/${CENTRAL_VALLEY_AVAS.length}`);
  console.log(`Total cost: $${totalCost.toFixed(2)}`);
}

createCentralValleyPages().catch(console.error);
