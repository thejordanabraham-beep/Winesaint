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
});

const SCORE_CONVERSION: Record<number, [number, number]> = {
  100: [9.8, 10.0], 99: [9.5, 9.7], 98: [9.3, 9.5], 97: [9.1, 9.3],
  96: [8.5, 9.0], 95: [8.1, 8.5], 94: [8.0, 8.0], 93: [7.7, 7.9],
  92: [7.5, 7.6], 91: [7.3, 7.4], 90: [7.1, 7.2], 89: [6.9, 7.0],
  88: [6.6, 6.8], 87: [6.4, 6.5],
};

// Use Claude to search and extract scores OR retail descriptions
async function searchAndExtractScore(wine: any): Promise<{ score100: number | null; reviewText: string; isRetailDescription: boolean }> {
  const searchQuery = `${wine.producer?.name} ${wine.name} ${wine.vintage}`;

  const prompt = `Search your knowledge for information about this wine:

Wine: ${searchQuery}

PRIORITY 1 - Look for professional critic scores:
- Wine Advocate, Vinous, Wine Spectator, Decanter, Jancis Robinson, etc.
- 100-point scale scores
- If you find multiple scores, average them

PRIORITY 2 - If NO critic scores found, look for:
- Retail descriptions from wine shops
- Importer notes
- Any professional description of the wine

Return JSON:
{
  "score100": <number 87-100 or null if not found>,
  "reviewText": "<critic tasting notes OR retail description>",
  "isRetailDescription": <true if this is retail/importer description, false if critic notes>,
  "source": "<where you found it>"
}`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1000,
    temperature: 0,
    messages: [{ role: 'user', content: prompt }]
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return { score100: null, reviewText: '', isRetailDescription: false };

  const result = JSON.parse(jsonMatch[0]);
  return {
    score100: result.score100,
    reviewText: result.reviewText || '',
    isRetailDescription: result.isRetailDescription || false
  };
}

// Generate Wine Saint review
async function generateWineSaintReview(wine: any, score10Point: number, foundReview: string): Promise<any> {
  const prompt = `You are Wine Saint. Rewrite this tasting note in Wine Saint technical style.

Wine: ${wine.name}
Producer: ${wine.producer?.name}
Vintage: ${wine.vintage}
Score: ${score10Point}/10

${foundReview ? `Original tasting notes:\n${foundReview}\n\n` : ''}

Write a Wine Saint review (2-3 sentences):
- Technical wine terminology
- Focus on flavor, structure, texture
- NO producer history
- Natural, not templated

JSON:
{
  "score": ${score10Point},
  "tastingNotes": "2-3 sentence Wine Saint review",
  "flavorProfile": ["descriptor1", "descriptor2", "descriptor3", "descriptor4", "descriptor5"]
}`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }]
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse');
  return JSON.parse(jsonMatch[0]);
}

async function main() {
  const total = await sanityClient.fetch(`count(*[_type == "review" && reviewerName == "WineSaint AI"])`);

  // Pick 3 random
  const indices = [
    Math.floor(Math.random() * total),
    Math.floor(Math.random() * total),
    Math.floor(Math.random() * total)
  ];

  console.log('🍷 TESTING GOOGLE SEARCH METHOD');
  console.log('================================');
  console.log(`Total wines: ${total}`);
  console.log(`Testing indices: ${indices.join(', ')}\n`);

  for (let i = 0; i < indices.length; i++) {
    const review = await sanityClient.fetch(`
      *[_type == "review" && reviewerName == "WineSaint AI"] | order(_createdAt asc)[$idx] {
        wine->{ name, vintage, producer->{name} }
      }
    `, { idx: indices[i] });

    const wine = review.wine;

    console.log(`\n${'='.repeat(70)}`);
    console.log(`WINE ${i + 1}:`);
    console.log('='.repeat(70));
    console.log(`${wine.name}`);
    console.log(`Producer: ${wine.producer?.name}`);
    console.log(`Vintage: ${wine.vintage}\n`);

    // Search and extract
    console.log('🔍 Searching for critic scores...');
    const { score100, reviewText, isRetailDescription } = await searchAndExtractScore(wine);

    let finalScore10: number;

    if (score100) {
      console.log(`✅ Found critic score: ${score100}/100`);
      const conversion = SCORE_CONVERSION[score100] || [score100/10, score100/10];
      finalScore10 = parseFloat(((conversion[0] + conversion[1]) / 2).toFixed(1));
      console.log(`   Converts to: ${finalScore10}/10`);

      if (reviewText) {
        console.log(`✅ Found tasting notes (${reviewText.length} chars)\n`);
      } else {
        console.log(`⚠️  No tasting notes found\n`);
      }
    } else {
      // No critic score - generate random score between 7.5 and 8.5
      finalScore10 = parseFloat((7.5 + Math.random() * 1.0).toFixed(1));
      console.log(`⚠️  No critic score found`);
      console.log(`   Generated random score: ${finalScore10}/10 (range: 7.5-8.5)`);

      if (reviewText && isRetailDescription) {
        console.log(`✅ Found retail description (${reviewText.length} chars)\n`);
      } else {
        console.log(`⚠️  No retail description found - will generate from general knowledge\n`);
      }
    }

    // Generate Wine Saint review
    console.log('✍️  Generating Wine Saint review...\n');
    const wineReview = await generateWineSaintReview(wine, finalScore10, reviewText);

    console.log('RESULT:');
    console.log(`Score: ${wineReview.score}/10`);
    console.log(`\nReview:`);
    console.log(wineReview.tastingNotes);
    console.log(`\nFlavors: ${wineReview.flavorProfile.join(', ')}`);
  }

  console.log('\n' + '='.repeat(70));
  console.log('Test complete!');
}

main();
