/**
 * CREATE SOUTHERN OREGON SUB-AVA PAGES AND GUIDES
 */

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SOUTHERN_OREGON_AVAS = [
  { name: 'Applegate Valley', slug: 'applegate-valley' },
  { name: 'Red Hill Douglas County', slug: 'red-hill-douglas-county' },
  { name: 'Rogue Valley', slug: 'rogue-valley' },
  { name: 'Umpqua Valley', slug: 'umpqua-valley' },
];

function createPageFile(ava: typeof SOUTHERN_OREGON_AVAS[0]) {
  const avaDir = path.join(
    process.cwd(),
    'app/regions/united-states/oregon/southern-oregon',
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
      parentRegion="united-states/oregon/southern-oregon"
      contentFile="${ava.slug}-guide.md"
    />
  );
}
`;

  fs.writeFileSync(pagePath, pageContent);
  console.log(`   ✅ Created page: ${ava.slug}/page.tsx`);
  return true;
}

async function generateGuide(ava: typeof SOUTHERN_OREGON_AVAS[0]) {
  const guideFile = path.join(process.cwd(), 'guides', `${ava.slug}-guide.md`);

  if (fs.existsSync(guideFile)) {
    console.log(`   ⏭️  Skipping ${ava.name} guide - already exists`);
    return { success: true, cost: 0 };
  }

  const prompt = `Generate a comprehensive guide for the ${ava.name} AVA (American Viticultural Area) in Southern Oregon.

This guide should be 1,500-2,500 words and cover:

1. **Overview & Location**
   - Geographic location within Southern Oregon
   - Size and boundaries
   - When it was designated as an AVA
   - Relationship to other Southern Oregon AVAs

2. **Climate & Geography**
   - Climate characteristics (warmer than Willamette, cooler than California)
   - Rainfall patterns
   - Topography and elevation
   - Unique geographic features

3. **Terroir & Soils**
   - Soil composition and types
   - Geological history
   - How soils impact grape growing
   - Drainage and vineyard sites

4. **Viticulture**
   - Primary grape varieties grown
   - Acreage and production statistics
   - Growing season characteristics
   - Viticultural challenges and advantages

5. **Wine Styles**
   - Signature wines and varieties
   - Typical flavor profiles
   - How wines differ from Willamette Valley or other Oregon regions
   - Quality levels and characteristics

6. **Notable Producers & Vineyards**
   - Leading wineries and vineyards
   - Historic vs newer producers
   - Benchmark wines from the region

7. **Development & Future**
   - Historical development
   - Current trends
   - Future outlook

Format as markdown with proper headings. Write in an authoritative, educational tone suitable for wine professionals and enthusiasts.

DO NOT include sections on food pairing, visiting/tourism, or serving recommendations.`;

  try {
    console.log(`   🔄 Generating ${ava.name} guide...`);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 10000,
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

    console.log(`   ✅ Generated ${ava.name} (${outputTokens.toLocaleString()} tokens, $${cost.toFixed(3)})`);

    return { success: true, cost };
  } catch (error) {
    console.error(`   ❌ Error generating ${ava.name}:`, error);
    return { success: false, cost: 0 };
  }
}

async function createSouthernOregonAVAs() {
  console.log('\n🍷 CREATING SOUTHERN OREGON SUB-AVAs');
  console.log('='.repeat(70));

  let totalCost = 0;
  let pagesCreated = 0;
  let guidesGenerated = 0;

  // Step 1: Create all page files
  console.log('\n📄 Creating page.tsx files...');
  for (const ava of SOUTHERN_OREGON_AVAS) {
    if (createPageFile(ava)) {
      pagesCreated++;
    }
  }

  console.log(`\n✅ Pages: ${pagesCreated} created, ${SOUTHERN_OREGON_AVAS.length - pagesCreated} already existed`);

  // Step 2: Generate all guides
  console.log('\n📚 Generating guides...');
  for (const ava of SOUTHERN_OREGON_AVAS) {
    const result = await generateGuide(ava);
    totalCost += result.cost;
    if (result.success && result.cost > 0) {
      guidesGenerated++;
    }

    // Small delay between requests
    if (result.cost > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n✅ COMPLETE');
  console.log('='.repeat(70));
  console.log(`Pages created: ${pagesCreated}`);
  console.log(`Guides generated: ${guidesGenerated}/${SOUTHERN_OREGON_AVAS.length}`);
  console.log(`Total cost: $${totalCost.toFixed(2)}`);
}

createSouthernOregonAVAs().catch(console.error);
