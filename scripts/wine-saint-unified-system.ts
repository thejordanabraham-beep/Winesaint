/**
 * WINE SAINT UNIFIED REVIEW SYSTEM
 *
 * This is the standardized review generation system.
 * All reviews use "Wine Saint" as the reviewer name.
 *
 * STYLE: Technical, vintage-focused, academic
 *
 * REFERENCE SOURCES (priority order):
 * 1. K&L Wine Merchants notes (hardcoded)
 * 2. François RAG API (vineyard data, vintage charts)
 * 3. Wine.com (web scraping - if needed)
 * 4. Vivino (if needed)
 *
 * SCORING: Adjusted to be more generous
 * - Base formula: criticAvg * 0.85 + vivinoScore * 0.15
 * - Boost: +2 points for all wines
 * - Floor: Minimum 87 points
 *
 * GENERATION: Two-pass Wine Saint style
 * - Pass 1: Extract vintage context + keywords
 * - Pass 2: Generate academic prose
 */

import dotenv from 'dotenv';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@sanity/client';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// SCORING CONFIGURATION
const SCORING_CONFIG = {
  criticWeight: 0.85,      // Increased from 0.9
  vivinoWeight: 0.15,      // Increased from 0.1
  boost: 2,                // Add 2 points to all scores
  minimumScore: 87,        // Floor at 87
};

// Convert Vivino 5-point to 100-point
function vivinoTo100(vivinoScore: number): number {
  return Math.round(vivinoScore * 20 + 10);
}

// Calculate final score with new generous formula
function calculateScore(criticAvg?: number, vivinoScore?: number): number {
  // If no scores, default to 90
  if (!criticAvg && !vivinoScore) return 90;

  const critic = criticAvg || 88;
  const vivino = vivinoScore ? vivinoTo100(vivinoScore) : 88;

  // Weighted calculation
  const weighted = (critic * SCORING_CONFIG.criticWeight) +
                   (vivino * SCORING_CONFIG.vivinoWeight);

  // Add boost
  const boosted = weighted + SCORING_CONFIG.boost;

  // Apply floor
  const final = Math.max(boosted, SCORING_CONFIG.minimumScore);

  return Math.round(final);
}

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

// K&L reference notes (abbreviated - add more as needed)
const KL_NOTES: Record<string, Record<number, string>> = {
  'Opus One': {
    2019: 'Beautifully expressive nose with ripe blackberries, dark cherries, luscious dark plums, fresh violets, tobacco, fresh herbs. Juicy, balanced, succulent.',
    2018: 'Nothing short of fantastic. Fresh crushed blackberries, dark currants, hints of blueberries, fresh florals, dark chocolate, graphite.',
  },
  // Add more as needed
};

// Get K&L notes if available
function getKLNotes(wineName: string, vintage: number): string | null {
  for (const name of Object.keys(KL_NOTES)) {
    if (wineName.includes(name) || name.includes(wineName)) {
      if (KL_NOTES[name][vintage]) {
        return KL_NOTES[name][vintage];
      }
    }
  }
  return null;
}

// Generate Wine Saint style review
async function generateWineSaintReview(wine: any, score: number): Promise<any> {
  const ragQuery = `${wine.producerName} ${wine.name} ${wine.vintage} ${wine.regionName} vintage review tasting`;

  // Try reference sources in priority order
  const klNotes = getKLNotes(wine.name, wine.vintage);
  const ragContext = await getFrancoisContext(ragQuery);

  const hasReference = klNotes || ragContext;

  console.log(klNotes ? '   ✓ Found K&L notes' :
              ragContext ? '   ✓ Found François RAG context' :
              '   ⚠️  No reference found, using pure AI generation');

  // Build reference context
  let referenceSection = '';
  if (klNotes) {
    referenceSection = `\n## K&L Wine Merchants Reference:\n${klNotes}\n(Use as inspiration, reword completely)`;
  } else if (ragContext) {
    referenceSection = `\n## François Knowledge Base:\n${ragContext}\n`;
  }

  // WINE SAINT STYLE PROMPT
  const prompt = `You are Wine Saint, a technical wine critic who writes academic, natural reviews.

## YOUR WRITING STYLE:
- Academic and technical
- Use precise wine terminology (structure, tannins, acidity, minerality, texture, balance)
- Vary your technical details - don't default to the same metrics every time
- Educational tone, not flowery or marketing-speak
- 2-3 sentences maximum
- Write naturally - vary your approach, don't follow a rigid template

## TECHNICAL DETAILS - USE STRATEGICALLY:
- Vary your technical language across reviews - don't use the same details every time
- pH: Use sparingly - only mention in roughly 10% of reviews when truly adding value
  * When mentioning: "Vibrant acidity (pH ~3.3)", "laser-like acidity around pH 3.0", "balanced at pH 3.5"
  * Most of the time: Use descriptive terms instead (bright acidity, taut structure, vibrant tension, crisp, electric, laser-like)
- Other technical details to rotate through (prefer these over pH):
  * Tannin structure (fine-grained, resolved, grippy, silky, chewy)
  * Acidity descriptors (bright, vibrant, laser-like, taut, elevated, balanced)
  * Soil types and terroir (calcareous, volcanic, ponca, schist, limestone, clay, marl)
  * Texture and mouthfeel (density, tension, weight, persistence, grip, finesse)
  * Concentration and extraction levels
  * Aging potential indicators (structure, tannin integration, acidity backbone)

## VINTAGE CONTEXT - USE NATURALLY:
- Weave vintage conditions into the review when they meaningfully shaped the wine
- Sometimes open with vintage, sometimes mention mid-paragraph, sometimes at end
- Sometimes focus on terroir or wine character instead
- Only discuss vintage if it's relevant or notable - not every wine needs vintage discussion
- Examples of natural integration:
  * "Pronounced chalky minerality dominates, with the small yields from ${wine.vintage}'s frost concentrating flavor."
  * "The cool spring preserved delicate aromatics while warm summer allowed complete ripeness."
  * "Medium-bodied with silky tannins and bright acidity, showing red cherry and violet." (no vintage mention - fine!)

## WINE DETAILS:
- Wine: ${wine.name}
- Producer: ${wine.producerName}
- Vintage: ${wine.vintage}
- Region: ${wine.regionName}
${wine.vineyardName ? `- Vineyard: ${wine.vineyardName}\n` : ''}
${referenceSection}

## INSTRUCTIONS:
Write a short, technical Wine Saint review that:
1. Describes the wine's key characteristics (structure, acidity, tannins/minerality, terroir)
2. Integrates vintage or terroir context naturally where relevant (not as formulaic opening)
3. Uses precise technical language and specific details
4. Sounds like a knowledgeable critic writing naturally, not following a template

Generate a JSON response:
{
  "score": ${score},
  "shortSummary": "One sentence capturing the wine's essence",
  "tastingNotes": "2-3 sentences in Wine Saint technical style with natural vintage/terroir integration",
  "flavorProfile": ["descriptor1", "descriptor2", "descriptor3", "descriptor4", "descriptor5"],
  "drinkThisIf": "One sentence recommendation",
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

  // Extract JSON
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse review JSON');
  }

  return JSON.parse(jsonMatch[0]);
}

// Main function to generate review for a wine
async function generateReview(wineId: string) {
  console.log('\n🍷 WINE SAINT UNIFIED SYSTEM');
  console.log('='.repeat(70));

  // Fetch wine
  const wine = await client.fetch(`*[_type == 'wine' && _id == $id][0]{
    _id,
    name,
    vintage,
    'producerName': producer->name,
    'regionName': region->name,
    'vineyardName': vineyard->name,
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
  console.log(`   Style: ${review.tastingNotes.substring(0, 100)}...`);

  // Save to Sanity
  console.log(`\n💾 Saving to Sanity...`);
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
    reviewerName: 'Wine Saint',  // ← STANDARDIZED
    reviewDate: new Date().toISOString(),
    isAiGenerated: true
  });

  console.log(`\n✅ COMPLETE`);
  console.log(`   Review ID: ${reviewDoc._id}`);
  console.log(`   View at: http://localhost:3000/wines/${wine.slug}`);
  console.log('='.repeat(70));

  return reviewDoc;
}

// Export for use in other scripts
export { calculateScore, generateWineSaintReview, generateReview };

// CLI usage
if (require.main === module) {
  const wineId = process.argv[2];
  if (!wineId) {
    console.log('Usage: npx tsx scripts/wine-saint-unified-system.ts <wine-id>');
    process.exit(1);
  }
  generateReview(wineId);
}
