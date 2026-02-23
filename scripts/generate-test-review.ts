import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const WINE_ID = '0pElvDZgNzDHPHc83Gnwvg'; // 2007 Rousseau Gevrey-Chambertin

async function getRagContext(query: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:8000/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        n_results: 10,
        rerank: true
      })
    });

    if (!response.ok) return '';

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results.map((r: any) => r.text).join('\n\n').substring(0, 5000);
    }
    return '';
  } catch (error) {
    return '';
  }
}

async function generateReview() {
  console.log('🍷 GENERATING TEST REVIEW');
  console.log('='.repeat(70));

  // Get wine details
  const wine = await client.fetch(`*[_type == 'wine' && _id == $id][0]{
    _id,
    name,
    vintage,
    'producerName': producer->name,
    'regionName': region->name,
    'vineyardName': vineyard->name,
    grapeVarieties
  }`, { id: WINE_ID });

  console.log(`\nWine: ${wine.name}`);
  console.log(`Producer: ${wine.producerName}`);
  console.log(`Region: ${wine.regionName}`);
  console.log(`Vineyard: ${wine.vineyardName}`);
  console.log(`Vintage: ${wine.vintage}\n`);

  // Get François RAG context
  console.log('📚 Querying François RAG...');
  const ragQuery = `${wine.producerName} ${wine.vineyardName} ${wine.vintage} ${wine.regionName} tasting notes review`;
  const ragContext = await getRagContext(ragQuery);

  if (ragContext) {
    console.log(`✓ Found ${ragContext.length} chars of RAG context\n`);
  } else {
    console.log('⚠️  No RAG context found\n');
  }

  // Generate review with Claude
  console.log('✍️  Generating review with Claude Sonnet 4.5...');

  const prompt = `You are a professional wine critic reviewing this wine:

**Wine:** ${wine.name}
**Producer:** ${wine.producerName}
**Region:** ${wine.regionName}
**Vineyard:** ${wine.vineyardName}
**Vintage:** ${wine.vintage}

${ragContext ? `**Reference Context:**\n${ragContext}\n\n` : ''}

Generate a professional wine review with the following components:

1. **Score** (85-100 scale):
   - 95-100: Extraordinary
   - 90-94: Outstanding
   - 85-89: Very good

2. **Short Summary** (1-2 sentences): Capture the essence of the wine

3. **Tasting Notes** (3-4 sentences): Detailed sensory description covering nose, palate, structure, and finish

4. **Flavor Profile** (5-8 specific flavors): e.g., "dark cherry", "black truffle", "wet stone", "tobacco"

5. **Drink This If** (1 sentence): What type of wine lover would enjoy this

6. **Food Pairings** (3-5 dishes): Specific pairing recommendations

7. **Drinking Window**: Peak drinking years (e.g., "2025-2035")

Format your response as JSON:
{
  "score": 92,
  "shortSummary": "...",
  "tastingNotes": "...",
  "flavorProfile": ["dark cherry", "forest floor", ...],
  "drinkThisIf": "...",
  "foodPairings": ["Duck confit", ...],
  "drinkingWindowStart": 2025,
  "drinkingWindowEnd": 2035
}`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 2000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }]
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

  // Extract JSON from response
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('❌ Failed to parse review JSON');
    return;
  }

  const review = JSON.parse(jsonMatch[0]);

  console.log('✅ Review generated!\n');
  console.log(`Score: ${review.score}/100`);
  console.log(`Summary: ${review.shortSummary}`);
  console.log(`Flavors: ${review.flavorProfile.join(', ')}`);
  console.log(`Drinking window: ${review.drinkingWindowStart}-${review.drinkingWindowEnd}\n`);

  // Create review document in Sanity
  console.log('💾 Saving review to Sanity...');

  const reviewDoc = await client.create({
    _type: 'review',
    wine: { _type: 'reference', _ref: wine._id },
    score: review.score,
    shortSummary: review.shortSummary,
    tastingNotes: review.tastingNotes,
    flavorProfile: review.flavorProfile,
    drinkThisIf: review.drinkThisIf,
    foodPairings: review.foodPairings,
    drinkingWindowStart: review.drinkingWindowStart,
    drinkingWindowEnd: review.drinkingWindowEnd,
    reviewerName: 'Claude Sonnet 4.5',
    reviewDate: new Date().toISOString(),
    isAiGenerated: true
  });

  console.log(`✅ Review saved: ${reviewDoc._id}\n`);
  console.log('='.repeat(70));
  console.log('View the wine with review at:');

  // Get wine slug
  const wineWithSlug = await client.fetch(`*[_type == 'wine' && _id == $id][0]{ 'slug': slug.current }`, { id: WINE_ID });
  console.log(`http://localhost:3000/wines/${wineWithSlug.slug}`);
}

generateReview();
