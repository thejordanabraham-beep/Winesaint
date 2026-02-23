import { createClient } from '@sanity/client';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Conversion table from generate-reviews.ts
const SCORE_CONVERSION: Record<number, [number, number]> = {
  100: [9.8, 10.0],
  99: [9.5, 9.7],
  98: [9.3, 9.5],
  97: [9.1, 9.3],
  96: [8.5, 9.0],
  95: [8.1, 8.5],
  94: [8.0, 8.0],
  93: [7.7, 7.9],
  92: [7.5, 7.6],
  91: [7.3, 7.4],
  90: [7.1, 7.2],
  89: [6.9, 7.0],
  88: [6.6, 6.8],
  87: [6.4, 6.5],
};

// Get François RAG context
async function getFrancoisContext(query: string): Promise<string> {
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
      return data.results.map((r: any) => r.text).join('\n\n').substring(0, 3000);
    }
    return '';
  } catch (error) {
    return '';
  }
}

// Generate Wine Saint review
async function generateWineSaintReview(wine: any, score10Point: number, existingReview: string, francoisContext: string): Promise<any> {
  const prompt = `You are Wine Saint, writing a technical wine review.

## WINE DETAILS:
- Wine: ${wine.name}
- Producer: ${wine.producer?.name || 'Unknown'}
- Vintage: ${wine.vintage || 'NV'}
- Region: ${wine.region?.name || 'Unknown'}

## EXISTING PROFILE (use ONLY to determine if red/white and grape varieties):
${existingReview}

## FRANÇOIS CONTEXT:
${francoisContext || 'Limited context available.'}

## YOUR TASK:
Write a Wine Saint review (2-3 sentences) that:
- FOCUSES ON: Flavor profile, structure, texture
- INCLUDES IF RELEVANT: Vintage character or unique bottling details
- DO NOT INCLUDE: Producer history, educational background
- Use precise wine terminology (tannins, acidity, minerality, texture, balance)
- Make sure you use correct red/white wine descriptors based on the existing profile

The score has already been determined: ${score10Point}/10

Generate JSON:
{
  "score": ${score10Point},
  "tastingNotes": "2-3 sentence tasting note focusing on flavors and structure",
  "flavorProfile": ["descriptor1", "descriptor2", "descriptor3", "descriptor4", "descriptor5"]
}

Return ONLY valid JSON.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }]
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse review JSON');
  }

  return JSON.parse(jsonMatch[0]);
}

async function main() {
  // Get 3 random WineSaint AI wines
  const wines = await sanityClient.fetch(`
    *[_type == "review" && reviewerName == "WineSaint AI"] | order(_createdAt asc) {
      _id,
      tastingNotes,
      wine->{
        _id,
        name,
        vintage,
        criticAvg,
        producer->{name},
        region->{name}
      }
    }[10...13]
  `);

  console.log('🍷 TESTING SIMPLIFIED SCORING SYSTEM');
  console.log('====================================');
  console.log('Approach: criticAvg → Conversion Table → 10-point score\n');

  for (let i = 0; i < wines.length; i++) {
    const review = wines[i];
    const wine = review.wine;

    console.log(`\n${'='.repeat(70)}`);
    console.log(`WINE ${i + 1}:`);
    console.log('='.repeat(70));
    console.log(`Name: ${wine.name}`);
    console.log(`Producer: ${wine.producer?.name || 'Unknown'}`);
    console.log(`Vintage: ${wine.vintage || 'NV'}`);
    console.log(`Region: ${wine.region?.name || 'Unknown'}`);
    console.log();

    // Check for criticAvg
    console.log('SCORING:');
    console.log(`  criticAvg in database: ${wine.criticAvg || 'NULL'}`);

    let score100: number;
    let score10Point: number;

    if (wine.criticAvg) {
      score100 = wine.criticAvg;
      const conversion = SCORE_CONVERSION[score100];
      if (conversion) {
        score10Point = (conversion[0] + conversion[1]) / 2;
        console.log(`  Conversion: ${score100}/100 → ${conversion[0]}-${conversion[1]} (avg: ${score10Point.toFixed(1)})/10`);
      } else {
        score10Point = score100 / 10;
        console.log(`  No exact conversion, using: ${score100}/100 → ${score10Point.toFixed(1)}/10`);
      }
    } else {
      score100 = 89; // Default
      const conversion = SCORE_CONVERSION[score100];
      score10Point = (conversion[0] + conversion[1]) / 2;
      console.log(`  No criticAvg - using default: ${score100}/100 → ${score10Point.toFixed(1)}/10`);
    }

    console.log();

    // Get François context
    const ragQuery = `${wine.producer?.name || ''} ${wine.name} ${wine.vintage || ''} ${wine.region?.name || ''} vintage review tasting`;
    console.log('CONTEXT:');
    const francoisContext = await getFrancoisContext(ragQuery);
    console.log(`  François RAG: ${francoisContext ? francoisContext.length + ' chars' : 'None found'}`);
    console.log();

    // Generate review
    console.log('GENERATING REVIEW...');
    const generatedReview = await generateWineSaintReview(wine, parseFloat(score10Point.toFixed(1)), review.tastingNotes, francoisContext);

    console.log();
    console.log('RESULT:');
    console.log(`  Final Score: ${generatedReview.score}/10`);
    console.log();
    console.log('  Tasting Notes:');
    console.log(`  ${generatedReview.tastingNotes}`);
    console.log();
    console.log(`  Flavor Profile: ${generatedReview.flavorProfile.join(', ')}`);
  }

  console.log('\n' + '='.repeat(70));
  console.log('Test complete!');
}

main();
