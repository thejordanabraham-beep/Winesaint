/**
 * GENERATE ALSACE GUIDES
 * - 2 department guides (Bas-Rhin, Haut-Rhin)
 * - 51 Grand Cru guides
 */

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const BAS_RHIN_GRAND_CRUS = [
  { name: 'Altenberg de Bergbieten', slug: 'altenberg-de-bergbieten' },
  { name: 'Altenberg de Wolxheim', slug: 'altenberg-de-wolxheim' },
  { name: 'Bruderthal', slug: 'bruderthal' },
  { name: 'Engelberg', slug: 'engelberg' },
  { name: 'Frankstein', slug: 'frankstein' },
  { name: 'Kastelberg', slug: 'kastelberg' },
  { name: 'Kirchberg de Barr', slug: 'kirchberg-de-barr' },
  { name: 'Moenchberg', slug: 'moenchberg' },
  { name: 'Muenchberg', slug: 'muenchberg' },
  { name: 'Praelatenberg', slug: 'praelatenberg' },
  { name: 'Winzenberg', slug: 'winzenberg' },
  { name: 'Zotzenberg', slug: 'zotzenberg' },
];

const HAUT_RHIN_GRAND_CRUS = [
  { name: 'Altenberg de Bergheim', slug: 'altenberg-de-bergheim' },
  { name: 'Brand', slug: 'brand' },
  { name: 'Eichberg', slug: 'eichberg' },
  { name: 'Florimont', slug: 'florimont' },
  { name: 'Froehn', slug: 'froehn' },
  { name: 'Furstentum', slug: 'furstentum' },
  { name: 'Geisberg', slug: 'geisberg' },
  { name: 'Gloeckelberg', slug: 'gloeckelberg' },
  { name: 'Goldert', slug: 'goldert' },
  { name: 'Hatschbourg', slug: 'hatschbourg' },
  { name: 'Hengst', slug: 'hengst' },
  { name: 'Kaefferkopf', slug: 'kaefferkopf' },
  { name: 'Kanzlerberg', slug: 'kanzlerberg' },
  { name: 'Kessler', slug: 'kessler' },
  { name: 'Kirchberg de Ribeauvillé', slug: 'kirchberg-de-ribeauville' },
  { name: 'Kitterlé', slug: 'kitterle' },
  { name: 'Mambourg', slug: 'mambourg' },
  { name: 'Mandelberg', slug: 'mandelberg' },
  { name: 'Marckrain', slug: 'marckrain' },
  { name: 'Ollwiller', slug: 'ollwiller' },
  { name: 'Osterberg', slug: 'osterberg' },
  { name: 'Pfersigberg', slug: 'pfersigberg' },
  { name: 'Pfingstberg', slug: 'pfingstberg' },
  { name: 'Rangen', slug: 'rangen' },
  { name: 'Rosacker', slug: 'rosacker' },
  { name: 'Saering', slug: 'saering' },
  { name: 'Schlossberg', slug: 'schlossberg' },
  { name: 'Schoenenbourg', slug: 'schoenenbourg' },
  { name: 'Sommerberg', slug: 'sommerberg' },
  { name: 'Sonnenglanz', slug: 'sonnenglanz' },
  { name: 'Spiegel', slug: 'spiegel' },
  { name: 'Sporen', slug: 'sporen' },
  { name: 'Steinert', slug: 'steinert' },
  { name: 'Steingrubler', slug: 'steingrubler' },
  { name: 'Steinklotz', slug: 'steinklotz' },
  { name: 'Vorbourg', slug: 'vorbourg' },
  { name: 'Wiebelsberg', slug: 'wiebelsberg' },
  { name: 'Wineck-Schlossberg', slug: 'wineck-schlossberg' },
  { name: 'Zinnkoepflé', slug: 'zinnkoepfle' },
];

async function generateDepartmentGuide(department: 'Bas-Rhin' | 'Haut-Rhin') {
  const slug = department.toLowerCase().replace(' ', '-');
  const guideFile = path.join(process.cwd(), 'guides', `${slug}-guide.md`);

  if (fs.existsSync(guideFile)) {
    console.log(`   ⏭️  Skipping ${department} guide - already exists`);
    return { success: true, cost: 0 };
  }

  const gcCount = department === 'Bas-Rhin' ? 12 : 39;
  const location = department === 'Bas-Rhin' ? 'northern Alsace' : 'southern Alsace';

  const prompt = `Generate a comprehensive guide for ${department}, the ${location} department of the Alsace wine region in France.

This guide should be 2,500-3,500 words and cover:

1. **Overview & Geography**
   - Location within Alsace
   - Size and boundaries
   - Major towns and villages
   - Landscape characteristics

2. **Climate**
   - Continental climate with rain shadow effect
   - Temperature patterns
   - Precipitation levels
   - Growing season characteristics

3. **Terroir & Soils**
   - Soil diversity (granite, limestone, sandstone, volcanic, etc.)
   - How different soils impact grape varieties
   - Drainage and vineyard sites
   - Slope orientations

4. **Grand Cru System**
   - Overview of the ${gcCount} Grand Crus in ${department}
   - What makes a vineyard eligible for Grand Cru status
   - Quality standards and regulations
   - Notable Grand Crus in this department

5. **Grape Varieties**
   - Riesling dominance in Grand Crus
   - Other noble varieties (Gewurztraminer, Pinot Gris, Muscat)
   - Variety-terroir matching
   - Pinot Noir for reds

6. **Wine Styles**
   - Dry vs. off-dry expressions
   - Vendange Tardive and Sélection de Grains Nobles
   - Aging potential
   - Stylistic differences from ${department === 'Bas-Rhin' ? 'Haut-Rhin' : 'Bas-Rhin'}

7. **Notable Producers**
   - Leading estates and domaines
   - Historic producers
   - Quality standards

8. **Development & Future**
   - Historical evolution of the region
   - Current trends
   - Organic and biodynamic viticulture

Format as markdown with proper headings. Write in an authoritative, educational tone.

DO NOT include sections on food pairing, visiting/tourism, or serving recommendations.`;

  try {
    console.log(`   🔄 Generating ${department} guide...`);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 10000,
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

    console.log(`   ✅ Generated ${department} (${outputTokens.toLocaleString()} tokens, $${cost.toFixed(3)})`);

    return { success: true, cost };
  } catch (error) {
    console.error(`   ❌ Error generating ${department}:`, error);
    return { success: false, cost: 0 };
  }
}

async function generateGrandCruGuide(gc: { name: string; slug: string }, department: string) {
  const guideFile = path.join(process.cwd(), 'guides', `${gc.slug}-guide.md`);

  if (fs.existsSync(guideFile)) {
    console.log(`   ⏭️  Skipping ${gc.name} - already exists`);
    return { success: true, cost: 0 };
  }

  const prompt = `Generate a comprehensive guide for ${gc.name}, an Alsace Grand Cru vineyard in ${department}, France.

This is a real, officially designated Grand Cru vineyard in Alsace. Generate factual content about this specific site.

This guide should be 1,500-2,500 words and cover:

1. **Overview & Location**
   - Location within ${department}
   - Nearest villages
   - Size (hectares)
   - When designated as Grand Cru

2. **Terroir & Geology**
   - Soil composition (granite, limestone, sandstone, volcanic, etc.)
   - Geological history
   - Slope orientation and elevation
   - Drainage characteristics

3. **Climate & Microclimate**
   - Continental climate with rain shadow
   - Site-specific conditions
   - Sun exposure
   - Temperature patterns

4. **Viticulture**
   - Primary grape varieties grown
   - Why certain varieties excel here
   - Vine age and density
   - Viticultural challenges

5. **Wine Character**
   - Typical flavor profiles by variety
   - Minerality and terroir expression
   - Aging potential
   - How wines from this Grand Cru are distinctive

6. **Notable Producers**
   - Leading domaines with parcels here
   - Benchmark wines
   - Different interpretations of the site

7. **Historical & Cultural Significance**
   - Historical viticulture on this site
   - Reputation evolution
   - Place in Alsace wine hierarchy

Format as markdown with proper headings. Write in an authoritative, educational tone.

DO NOT include sections on food pairing, visiting/tourism, or serving recommendations.`;

  try {
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

    console.log(`   ✅ ${gc.name} (${outputTokens.toLocaleString()} tokens, $${cost.toFixed(3)})`);

    return { success: true, cost };
  } catch (error) {
    console.error(`   ❌ Error generating ${gc.name}:`, error);
    return { success: false, cost: 0 };
  }
}

async function generateAlsaceGuides() {
  console.log('\n🍇 GENERATING ALSACE GUIDES');
  console.log('='.repeat(70));

  let totalCost = 0;
  let guidesGenerated = 0;

  // Step 1: Generate department guides
  console.log('\n📚 Generating department guides...');
  for (const dept of ['Bas-Rhin', 'Haut-Rhin'] as const) {
    const result = await generateDepartmentGuide(dept);
    totalCost += result.cost;
    if (result.success && result.cost > 0) {
      guidesGenerated++;
    }
    if (result.cost > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Step 2: Generate Bas-Rhin Grand Cru guides
  console.log('\n📚 Generating Bas-Rhin Grand Cru guides...');
  for (const gc of BAS_RHIN_GRAND_CRUS) {
    const result = await generateGrandCruGuide(gc, 'Bas-Rhin');
    totalCost += result.cost;
    if (result.success && result.cost > 0) {
      guidesGenerated++;
    }
    if (result.cost > 0) {
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }

  // Step 3: Generate Haut-Rhin Grand Cru guides
  console.log('\n📚 Generating Haut-Rhin Grand Cru guides...');
  for (const gc of HAUT_RHIN_GRAND_CRUS) {
    const result = await generateGrandCruGuide(gc, 'Haut-Rhin');
    totalCost += result.cost;
    if (result.success && result.cost > 0) {
      guidesGenerated++;
    }
    if (result.cost > 0) {
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }

  console.log('\n✅ COMPLETE');
  console.log('='.repeat(70));
  console.log(`Department guides: 2`);
  console.log(`Grand Cru guides: 51`);
  console.log(`Total generated: ${guidesGenerated}/53`);
  console.log(`Total cost: $${totalCost.toFixed(2)}`);
}

generateAlsaceGuides().catch(console.error);
