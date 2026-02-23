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

async function generateReview(wine: any): Promise<any> {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🍷 ${wine.name}`);
  console.log(`   Producer: ${wine.producerName}`);
  console.log(`   Region: ${wine.regionName}`);
  if (wine.vineyardName) {
    console.log(`   Vineyard: ${wine.vineyardName}`);
  }

  // Get François RAG context
  const ragQuery = `${wine.producerName} ${wine.name} ${wine.vintage} ${wine.regionName} ${wine.vineyardName || ''} tasting notes review vintage`;
  const ragContext = await getRagContext(ragQuery);

  if (ragContext) {
    console.log(`   ✓ Found ${ragContext.length} chars of RAG context`);
  } else {
    console.log(`   ⚠️  No RAG context found`);
  }

  // Generate review with Claude
  const prompt = `You are a professional wine critic reviewing this wine:

**Wine:** ${wine.name}
**Producer:** ${wine.producerName}
**Region:** ${wine.regionName}
${wine.vineyardName ? `**Vineyard:** ${wine.vineyardName}\n` : ''}**Vintage:** ${wine.vintage || 'NV'}

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
    console.log('   ❌ Failed to parse review JSON');
    return null;
  }

  const review = JSON.parse(jsonMatch[0]);

  console.log(`   ✅ Generated review - Score: ${review.score}/100`);

  // Create review document in Sanity
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
    reviewerName: 'François AI',
    reviewDate: new Date().toISOString(),
    isAiGenerated: true
  });

  console.log(`   💾 Saved to Sanity: ${reviewDoc._id}`);

  return {
    wine,
    review,
    reviewDoc
  };
}

async function main() {
  console.log('🍷 GENERATING 5 RANDOM RED WINE REVIEWS');
  console.log('='.repeat(70));

  // Get red wines (filter by name containing red wine regions/varieties)
  const wines = await client.fetch(`*[_type == 'wine' && defined(region) && !defined(*[_type == 'review' && wine._ref == ^._id][0]._id) && (
    region->name match '*Burgundy*' ||
    region->name match '*Bordeaux*' ||
    region->name match '*Rhone*' ||
    region->name match '*Barolo*' ||
    region->name match '*Barbaresco*' ||
    region->name match '*Chianti*' ||
    region->name match '*Napa*' ||
    region->name match '*Sonoma*' ||
    region->name match '*Rioja*' ||
    region->name match '*Priorat*' ||
    name match '*Pinot Noir*' ||
    name match '*Cabernet*' ||
    name match '*Syrah*' ||
    name match '*Shiraz*' ||
    name match '*Nebbiolo*' ||
    name match '*Sangiovese*' ||
    name match '*Merlot*' ||
    name match '*Grenache*' ||
    name match '*Tempranillo*'
  ) && !(
    name match '*Blanc*' ||
    name match '*Chardonnay*' ||
    name match '*Riesling*' ||
    name match '*Sauvignon Blanc*'
  )] | order(_createdAt desc)[0...200] {
    _id,
    name,
    vintage,
    'slug': slug.current,
    'producerName': producer->name,
    'regionName': region->name,
    'vineyardName': vineyard->name
  }`);

  console.log(`Found ${wines.length} red wines without reviews\n`);

  // Pick 5 random from the results
  const selectedWines = [];
  const usedIndices = new Set();
  while (selectedWines.length < 5 && usedIndices.size < wines.length) {
    const randomIndex = Math.floor(Math.random() * wines.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      selectedWines.push(wines[randomIndex]);
    }
  }

  console.log(`Selected ${selectedWines.length} red wines for review:\n`);

  const results = [];

  for (const wine of selectedWines) {
    try {
      const result = await generateReview(wine);
      if (result) {
        results.push(result);
      }

      // Rate limit
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ REVIEW GENERATION COMPLETE');
  console.log(`Generated ${results.length}/5 reviews\n`);

  console.log('View wines at:');
  results.forEach((r, i) => {
    console.log(`${i + 1}. http://localhost:3000/wines/${r.wine.slug}`);
  });
}

main();
