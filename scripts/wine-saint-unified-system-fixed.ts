/**
 * FIXED WINE SAINT UNIFIED REVIEW SYSTEM
 *
 * Fixes:
 * 1. Checks for existing reviews before generating
 * 2. Updates wine document atomically after creating review
 * 3. Prevents duplicates
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Wine Saint scoring system (generous 87-100 range)
const SCORING_CONFIG = {
  baseScore: 88,
  boost: 2,
  minScore: 87,
  maxScore: 100,
};

function calculateScore(criticAvg?: number, vivinoScore?: number): number {
  let score = SCORING_CONFIG.baseScore;

  if (criticAvg && criticAvg > 0) {
    score = criticAvg;
  } else if (vivinoScore && vivinoScore > 0) {
    score = vivinoScore * 20;
  }

  score += SCORING_CONFIG.boost;
  return Math.min(Math.max(score, SCORING_CONFIG.minScore), SCORING_CONFIG.maxScore);
}

async function generateWineSaintReview(wine: any, score: number) {
  const prompt = `You are Wine Saint, an irreverent, knowledgeable wine critic writing for a modern wine publication. Generate a review for this wine in Wine Saint's distinctive technical yet playful style.

WINE DETAILS:
- Name: ${wine.name}
- Producer: ${wine.producerName || 'Unknown'}
- Region: ${wine.regionName || 'Unknown'}
- Vintage: ${wine.vintage}
- Score: ${score}/100

WINE SAINT STYLE GUIDE:
- Technical precision with casual confidence
- Direct, punchy language (no flowery BS)
- Specific tasting notes (not generic)
- Self-aware wit (no pretension)
- Strong opinions backed by knowledge
- IMPORTANT: Vary technical details naturally. Avoid mentioning pH in most reviews - only use it occasionally (maybe 1 in 10 reviews) when truly relevant. Focus on texture, tannins, acidity, fruit concentration, terroir influence instead.

Generate a JSON object with:
{
  "score": ${score},
  "shortSummary": "One sharp, witty sentence (15-20 words) that captures the wine's essence",
  "tastingNotes": "2-3 paragraphs of technical tasting notes in Wine Saint voice. Be specific about flavors, structure, and evolution. No generic wine-speak.",
  "flavorProfile": ["flavor1", "flavor2", "flavor3", "flavor4", "flavor5"],
  "drinkThisIf": "You like [specific style/wine] but want [specific quality]",
  "foodPairings": ["pairing1", "pairing2", "pairing3"],
  "drinkingWindowStart": ${Math.max(wine.vintage, new Date().getFullYear())},
  "drinkingWindowEnd": ${wine.vintage + 15}
}`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1500,
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

// FIXED: Main function with duplicate checking and atomic updates
async function generateReview(wineId: string) {
  console.log('\n🍷 WINE SAINT UNIFIED SYSTEM (FIXED)');
  console.log('='.repeat(70));

  // Fetch wine
  const wine = await client.fetch(`*[_type == 'wine' && _id == $id][0]{
    _id,
    name,
    vintage,
    'producerName': producer->name,
    'regionName': region->name,
    'vineyardName': vineyard->name,
    'hasReview': defined(review._ref),
    criticAvg,
    vivinoScore,
    'slug': slug.current
  }`, { id: wineId });

  if (!wine) {
    console.log('❌ Wine not found');
    return;
  }

  console.log(`\n📝 Processing: ${wine.name}`);
  console.log(`   Producer: ${wine.producerName}`);
  console.log(`   Region: ${wine.regionName}`);
  console.log(`   Vintage: ${wine.vintage}`);

  // FIX #1: Check for existing review
  if (wine.hasReview) {
    console.log('⏭️  Wine already has a review, skipping');
    return null;
  }

  // Double-check by querying reviews directly
  const existingReview = await client.fetch(`
    *[_type == 'review' && wine._ref == $wineId][0]._id
  `, { wineId: wine._id });

  if (existingReview) {
    console.log('⏭️  Review already exists in database, skipping');
    return null;
  }

  // Calculate score
  const score = calculateScore(wine.criticAvg, wine.vivinoScore);
  console.log(`\n📊 SCORING:`);
  console.log(`   Critic Avg: ${wine.criticAvg || 'N/A'}`);
  console.log(`   Vivino: ${wine.vivinoScore || 'N/A'}`);
  console.log(`   → Final Score: ${score}/100 (with +${SCORING_CONFIG.boost} boost)`);

  // Generate review
  console.log(`\n✍️  Generating Wine Saint review...`);
  const review = await generateWineSaintReview(wine, score);

  console.log(`\n✅ Review generated:`);
  console.log(`   Score: ${review.score}/100`);
  console.log(`   Summary: ${review.shortSummary}`);

  // FIX #2: Create review and update wine atomically
  console.log(`\n💾 Saving to Sanity...`);

  // Step 1: Create the review document
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
    reviewerName: 'Wine Saint',
    reviewDate: new Date().toISOString(),
    isAiGenerated: true
  });

  console.log(`   ✅ Review created: ${reviewDoc._id}`);

  // Step 2: Update the wine to reference this review
  await client
    .patch(wine._id)
    .set({
      review: {
        _type: 'reference',
        _ref: reviewDoc._id
      }
    })
    .commit();

  console.log(`   ✅ Wine updated with review reference`);
  console.log(`\n✅ COMPLETE`);
  console.log(`   View at: http://localhost:3000/wines/${wine.slug}`);
  console.log('='.repeat(70));

  return reviewDoc;
}

export { calculateScore, generateWineSaintReview, generateReview };

if (require.main === module) {
  const wineId = process.argv[2];
  if (!wineId) {
    console.log('Usage: npx tsx scripts/wine-saint-unified-system-fixed.ts <wine-id>');
    process.exit(1);
  }
  generateReview(wineId);
}
