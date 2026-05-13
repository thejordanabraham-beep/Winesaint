/**
 * CREATE WASHINGTON COLUMBIA VALLEY SUB-AVA PAGES AND GUIDES
 *
 * Creates page.tsx files and guides for all Columbia Valley nested AVAs
 */

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const COLUMBIA_VALLEY_AVAS = [
  { name: 'Ancient Lakes', slug: 'ancient-lakes' },
  { name: 'Candy Mountain', slug: 'candy-mountain' },
  { name: 'Goose Gap', slug: 'goose-gap' },
  { name: 'Horse Heaven Hills', slug: 'horse-heaven-hills' },
  { name: 'Lake Chelan', slug: 'lake-chelan' },
  { name: 'Lewis-Clark Valley', slug: 'lewis-clark-valley' },
  { name: 'Naches Heights', slug: 'naches-heights' },
  { name: 'Rattlesnake Hills', slug: 'rattlesnake-hills' },
  { name: 'Red Mountain', slug: 'red-mountain' },
  { name: 'Royal Slope', slug: 'royal-slope' },
  { name: 'Snipes Mountain', slug: 'snipes-mountain' },
  { name: 'The Burn of Columbia Valley', slug: 'burn-of-columbia-valley' },
  { name: 'Wahluke Slope', slug: 'wahluke-slope' },
  { name: 'Walla Walla Valley', slug: 'walla-walla-valley' },
  { name: 'White Bluffs', slug: 'white-bluffs' },
  { name: 'Yakima Valley', slug: 'yakima-valley' },
];

function createPageFile(ava: typeof COLUMBIA_VALLEY_AVAS[0]) {
  const avaDir = path.join(
    process.cwd(),
    'app/regions/united-states/washington/columbia-valley',
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
      parentRegion="united-states/washington/columbia-valley"
      contentFile="${ava.slug}-guide.md"
    />
  );
}
`;

  fs.writeFileSync(pagePath, pageContent);
  console.log(`   ✅ Created page: ${ava.slug}/page.tsx`);
  return true;
}

async function generateGuide(ava: typeof COLUMBIA_VALLEY_AVAS[0]) {
  const guideFile = path.join(process.cwd(), 'guides', `${ava.slug}-guide.md`);

  if (fs.existsSync(guideFile)) {
    console.log(`   ⏭️  Skipping ${ava.name} guide - already exists`);
    return { success: true, cost: 0 };
  }

  const prompt = `Generate a comprehensive guide for the ${ava.name} AVA (American Viticultural Area) in Washington State's Columbia Valley.

This guide should be 1,500-2,500 words and cover:

1. **Overview & Location**
   - Geographic location within Columbia Valley
   - Size and boundaries
   - When it was designated as an AVA
   - Proximity to major cities/landmarks

2. **Climate & Geography**
   - Climate characteristics (desert continental, diurnal shift, etc.)
   - Rainfall and irrigation needs
   - Topography and elevation
   - Unique geographic features

3. **Terroir & Soils**
   - Soil composition and types
   - Glacial influence (Missoula Floods if relevant)
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
   - How wines differ from other Columbia Valley sub-AVAs
   - Quality levels and price points

6. **Notable Producers & Vineyards**
   - Leading wineries and vineyards
   - Historic vs newer producers
   - Benchmark wines from the region

7. **Wine Tourism & Future**
   - Visiting the region
   - Development and trends
   - Future outlook

Format as markdown with proper headings. Write in an authoritative, educational tone suitable for wine professionals and enthusiasts. Include specific details about what makes ${ava.name} unique within Washington wine country.`;

  try {
    console.log(`   🔄 Generating ${ava.name} guide...`);

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

    console.log(`   ✅ Generated ${ava.name} (${outputTokens.toLocaleString()} tokens, $${cost.toFixed(3)})`);

    return { success: true, cost };
  } catch (error) {
    console.error(`   ❌ Error generating ${ava.name}:`, error);
    return { success: false, cost: 0 };
  }
}

async function createWashingtonColumbiaValleyAVAs() {
  console.log('\n🍷 CREATING WASHINGTON COLUMBIA VALLEY SUB-AVAs');
  console.log('='.repeat(70));

  // Step 1: Create all page files
  console.log('\n📄 Creating page.tsx files...');
  let pagesCreated = 0;
  for (const ava of COLUMBIA_VALLEY_AVAS) {
    if (createPageFile(ava)) {
      pagesCreated++;
    }
  }

  console.log(`\n✅ Pages: ${pagesCreated} created, ${COLUMBIA_VALLEY_AVAS.length - pagesCreated} already existed`);

  // Step 2: Generate all guides
  console.log('\n📚 Generating guides...');
  let totalCost = 0;
  let guidesGenerated = 0;

  for (const ava of COLUMBIA_VALLEY_AVAS) {
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
  console.log(`Guides generated: ${guidesGenerated}/${COLUMBIA_VALLEY_AVAS.length}`);
  console.log(`Total cost: $${totalCost.toFixed(2)}`);
}

createWashingtonColumbiaValleyAVAs().catch(console.error);
