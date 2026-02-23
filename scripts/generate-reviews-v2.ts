/**
 * Wine Review Generator v2
 *
 * Two-pass generation with academic, concise tasting notes.
 *
 * Pipeline:
 * 1. Reference lookup: K&L → François RAG
 * 2. Flavor palette: Build vocabulary from Flavor Wheel
 * 3. Keyword extraction: First pass extracts specific descriptors
 * 4. Review generation: Second pass writes prose using keywords
 * 5. Template variation: Random selection from 5 templates
 *
 * Usage: npx tsx scripts/generate-reviews-v2.ts [--limit N] [--dry-run] [--regenerate]
 */

import dotenv from 'dotenv';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@sanity/client';

import { getReferenceNotes } from './lib/reference-sources';
import { buildFlavorPalette } from './lib/flavor-descriptors';
import { getRandomTemplate, buildKeywordPrompt, WineContext, ReviewOutput } from './lib/prompt-templates';
import { buildSystemPromptWithExamples } from './lib/few-shot-examples';

// Load environment
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Score conversion: 100-point to 10-point scale
const SCORE_CONVERSION: Record<number, [number, number]> = {
  100: [9.8, 10.0], 99: [9.5, 9.7], 98: [9.3, 9.5], 97: [9.1, 9.3],
  96: [8.5, 9.0], 95: [8.1, 8.5], 94: [8.0, 8.0], 93: [7.7, 7.9],
  92: [7.5, 7.6], 91: [7.3, 7.4], 90: [7.1, 7.2], 89: [6.9, 7.0],
  88: [6.6, 6.8], 87: [6.4, 6.5], 86: [6.2, 6.3],
};

function vivinoTo100(vivinoScore: number): number {
  return Math.round(vivinoScore * 20 + 10);
}

function calculateFinalScore(criticAvg: number, vivinoScore: number): number {
  const vivinoAs100 = vivinoTo100(vivinoScore);
  return Math.round((criticAvg * 0.9) + (vivinoAs100 * 0.1));
}

interface SanityWine {
  _id: string;
  name: string;
  vintage: number;
  producer: { name: string } | null;
  region: { name: string; country: string } | null;
  grapeVarieties: string[] | null;
  priceUsd: number | null;
  criticAvg: number | null;
  vivinoScore: number | null;
  hasAiReview: boolean | null;
}

async function main() {
  const args = process.argv.slice(2);
  const limitIndex = args.indexOf('--limit');
  const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : 10;
  const dryRun = args.includes('--dry-run');
  const regenerate = args.includes('--regenerate');

  console.log('🍷 Wine Review Generator v2');
  console.log('============================');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Regenerate: ${regenerate ? 'YES' : 'NO'}`);
  console.log(`Limit: ${limit} wines\n`);

  // Validate environment
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY required');
    process.exit(1);
  }
  if (!dryRun && !process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN required for live mode');
    process.exit(1);
  }

  // Initialize clients
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const sanityClient = createClient({
    projectId: process.env.SANITY_PROJECT_ID!,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
  });

  // Fetch wines
  const queryFilter = regenerate
    ? `*[_type == "wine" && defined(criticAvg) && defined(vivinoScore)]`
    : `*[_type == "wine" && (hasAiReview != true) && defined(criticAvg) && defined(vivinoScore)]`;

  const query = `${queryFilter}[0...${limit}]{
    _id, name, vintage,
    producer->{name},
    region->{name, country},
    grapeVarieties, priceUsd, criticAvg, vivinoScore, hasAiReview
  }`;

  const wines: SanityWine[] = await sanityClient.fetch(query);

  if (wines.length === 0) {
    console.log('✅ No wines need reviews');
    return;
  }

  console.log(`Found ${wines.length} wines to process.\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const wine of wines) {
    console.log(`\n🍷 ${wine.producer?.name || 'Unknown'} ${wine.name} ${wine.vintage}`);

    try {
      const producer = wine.producer?.name || 'Unknown Producer';
      const region = wine.region?.name || 'Unknown Region';
      const grapes = wine.grapeVarieties?.join(', ') || 'Unknown';
      const priceUsd = wine.priceUsd || 50;
      const criticAvg = wine.criticAvg || 85;
      const vivinoScore = wine.vivinoScore || 4.0;
      const baseScore = calculateFinalScore(criticAvg, vivinoScore);
      // Use base score directly - it already matches Vitaly scoring
      const finalScore = baseScore;
      console.log(`   📊 Score: ${finalScore}/100`);
      const currentYear = new Date().getFullYear();
      const ageYears = currentYear - wine.vintage;

      // Step 1: Get reference notes (K&L → RAG waterfall)
      const reference = await getReferenceNotes(wine.name, producer, wine.vintage, region);

      // Step 2: Build flavor palette from Flavor Wheel vocabulary
      const wineType = grapes.toLowerCase().includes('chardonnay') ||
                       grapes.toLowerCase().includes('sauvignon blanc') ||
                       grapes.toLowerCase().includes('riesling')
        ? 'white' : 'red';
      const flavorPalette = buildFlavorPalette(wineType, ageYears);

      // Build wine context
      const wineContext: WineContext = {
        name: wine.name,
        producer,
        vintage: wine.vintage,
        region,
        grapes,
        priceUsd,
        criticAvg: finalScore,
        vivinoScore,
        referenceNotes: reference.notes,
        vintageContext: reference.vintageContext,
        producerStyle: reference.producerStyle,
        flavorPalette,
      };

      // Step 3: First pass - Extract keywords
      console.log('   Pass 1: Extracting keywords...');
      const keywordPrompt = buildKeywordPrompt(wineContext);

      const keywordResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 256,
        messages: [{ role: 'user', content: keywordPrompt }],
      });

      const keywords = keywordResponse.content[0].type === 'text'
        ? keywordResponse.content[0].text.trim()
        : flavorPalette.primaryFruits.join(', ');

      console.log(`   Keywords: ${keywords.substring(0, 60)}...`);

      // Step 4: Select random template
      const template = getRandomTemplate();
      console.log(`   Template: ${template.name}`);

      // Step 5: Second pass - Generate review with few-shot examples
      console.log('   Pass 2: Generating review...');
      const systemPrompt = buildSystemPromptWithExamples();
      const userPrompt = template.fn(wineContext, keywords);

      const reviewResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const responseText = reviewResponse.content[0].type === 'text'
        ? reviewResponse.content[0].text
        : '';

      // Parse JSON
      let reviewData: ReviewOutput;
      try {
        // Clean up potential markdown wrapping
        const cleanJson = responseText
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        reviewData = JSON.parse(cleanJson);
      } catch (parseError) {
        console.error('   ❌ Failed to parse JSON');
        console.error('   Response:', responseText.substring(0, 200));
        errorCount++;
        continue;
      }

      console.log(`   Score: ${reviewData.scores.final_score}/100`);
      console.log(`   Summary: ${reviewData.review.short_summary}`);
      console.log(`   Review: "${reviewData.review.full_review.substring(0, 80)}..."`);

      if (dryRun) {
        console.log('   [DRY RUN] Would create review');
        successCount++;
        continue;
      }

      // Delete existing reviews if regenerating
      if (regenerate) {
        const existingReviews = await sanityClient.fetch(
          `*[_type == "review" && wine._ref == $wineId]._id`,
          { wineId: wine._id }
        );
        if (existingReviews.length > 0) {
          console.log(`   Deleting ${existingReviews.length} existing review(s)...`);
          for (const reviewId of existingReviews) {
            await sanityClient.delete(reviewId);
          }
        }
      }

      // Create review in Sanity
      const reviewDoc = {
        _type: 'review',
        wine: { _type: 'reference', _ref: wine._id },
        score: reviewData.scores.final_score,
        shortSummary: reviewData.review.short_summary,
        tastingNotes: reviewData.review.full_review,
        flavorProfile: reviewData.review.flavor_profile,
        drinkThisIf: reviewData.review.drink_this_if,
        foodPairings: reviewData.review.food_pairings,
        reviewerName: 'Wine Saint',
        reviewDate: new Date().toISOString().split('T')[0],
        isAiGenerated: true,
        scoreJustification: reviewData.scores.score_justification,
        templateUsed: template.name,
      };

      const createdReview = await sanityClient.create(reviewDoc);
      console.log(`   ✅ Created: ${createdReview._id}`);

      await sanityClient.patch(wine._id).set({ hasAiReview: true }).commit();

      successCount++;

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1500));

    } catch (error) {
      console.error(`   ❌ Error:`, error);
      errorCount++;
    }
  }

  console.log('\n============================');
  console.log('📊 Summary');
  console.log('============================');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📝 Total: ${wines.length}`);
}

main().catch(console.error);
