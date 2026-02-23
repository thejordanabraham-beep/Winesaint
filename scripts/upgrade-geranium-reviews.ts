/**
 * SPECIAL SCRIPT: Upgrade Geranium Wine Reviews
 *
 * One-time upgrade for the 2,610 Geranium wines with basic reviews.
 * Uses François + Claude to generate:
 * - Wine Saint style reviews (2-3 sentences, technical)
 * - Intelligent scores based on context (not formula)
 *
 * After this batch, continue using wine-saint-unified-system.ts
 */

import { createClient } from '@sanity/client';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const BATCH_SIZE = 10;
const DELAY_MS = 2000;
const PROGRESS_FILE = '/tmp/geranium-upgrade-progress.json';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

interface Progress {
  lastProcessedIndex: number;
  successCount: number;
  errorCount: number;
  errors: Array<{ wine: string; error: string }>;
}

function loadProgress(): Progress {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
  }
  return { lastProcessedIndex: -1, successCount: 0, errorCount: 0, errors: [] };
}

function saveProgress(progress: Progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
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

interface Wine {
  _id: string;
  name: string;
  vintage: number;
  producer: { name: string };
  region: { name: string };
  vineyard?: { name: string };
  reviewId: string;
}

async function generateWineSaintReviewWithScore(wine: Wine, francoisContext: string): Promise<any> {
  const prompt = `You are Wine Saint, a technical wine critic who writes academic, natural reviews.

## YOUR WRITING STYLE:
- Academic and technical
- Use precise wine terminology (structure, tannins, acidity, minerality, texture, balance)
- Vary your technical details - don't default to the same metrics every time
- Educational tone, not flowery or marketing-speak
- 2-3 sentences maximum
- Write naturally - vary your approach, don't follow a rigid template

## SCORING GUIDELINES (100-point scale):
You must assign an intelligent score based on the wine's quality tier:

**95-100: Legendary/Exceptional**
- Grand Cru Burgundy from top producers (DRC, Rousseau, Roumier, Leroy)
- First Growth Bordeaux (Lafite, Latour, Margaux, Haut-Brion, Mouton)
- Cult California (Screaming Eagle, Harlan, Schrader)
- Top Champagne prestige cuvées (Krug, Salon, Selosse)
- Legendary German GGs and TBAs
- Super Tuscans icons (Sassicaia, Ornellaia, Masseto)

**90-94: Outstanding/Excellent**
- Premier Cru Burgundy from excellent producers
- Second/Third Growth Bordeaux, top Right Bank
- High-end California from proven producers
- Top Champagne Blanc de Blancs/vintage
- German Grosses Gewächs from great sites
- Top Italian DOCG (Barolo, Barbaresco MGAs)
- Renowned Rhône (Hermitage, Côte-Rôtie from top names)

**87-89: Very Good/Recommended**
- Village-level Burgundy from good producers
- Cru Classé Bordeaux
- Well-made California from reputable wineries
- Grower Champagne
- Quality German Kabinett/Spätlese
- Solid Italian DOC/DOCG
- Good regional wines from known producers

**85-86: Good/Solid**
- Basic regional wines from decent producers
- Entry-level offerings from quality estates
- Well-made everyday wines

**Below 85: Only if seriously flawed**

## WINE DETAILS:
- Wine: ${wine.name}
- Producer: ${wine.producer?.name || 'Unknown'}
- Vintage: ${wine.vintage || 'NV'}
- Region: ${wine.region?.name || 'Unknown'}
${wine.vineyard ? `- Vineyard: ${wine.vineyard.name}\n` : ''}

## FRANÇOIS KNOWLEDGE BASE:
${francoisContext || 'Limited context - use general wine knowledge and producer reputation.'}

## INSTRUCTIONS:
1. Analyze the wine's quality tier based on producer, region, vineyard, vintage
2. Assign an appropriate score (use full range 85-100, not defaulting to 90)
3. Write a technical Wine Saint review (2-3 sentences)
4. Include relevant details: structure, acidity, tannins/minerality, terroir

Generate a JSON response:
{
  "score": <your intelligent score 85-100>,
  "tastingNotes": "2-3 sentences in Wine Saint technical style",
  "flavorProfile": ["descriptor1", "descriptor2", "descriptor3", "descriptor4", "descriptor5"],
  "drinkingWindowStart": ${Math.max(wine.vintage || new Date().getFullYear(), new Date().getFullYear())},
  "drinkingWindowEnd": ${(wine.vintage || new Date().getFullYear()) + 15}
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

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const limitArg = process.argv.indexOf('--limit');
  const limit = limitArg !== -1 ? parseInt(process.argv[limitArg + 1], 10) : undefined;
  const resumeArg = process.argv.includes('--resume');

  console.log('🍷 GERANIUM WINE REVIEW UPGRADE (François + Intelligent Scoring)');
  console.log('='.repeat(70));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}`);
  console.log(`Batch size: ${BATCH_SIZE} wines\n`);

  const progress = resumeArg ? loadProgress() : { lastProcessedIndex: -1, successCount: 0, errorCount: 0, errors: [] };

  // Find all wines with WineSaint AI reviews (the ones we just created)
  const query = `
    *[_type == "review" && reviewerName == "WineSaint AI"] | order(_createdAt asc) {
      _id,
      wine->{
        _id,
        name,
        vintage,
        producer->{name},
        region->{name},
        vineyard->{name}
      }
    }${limit ? `[0...${limit}]` : ''}
  `;

  const reviews = await sanityClient.fetch(query);

  const wines: Wine[] = reviews.map((r: any) => ({
    _id: r.wine._id,
    name: r.wine.name,
    vintage: r.wine.vintage,
    producer: r.wine.producer,
    region: r.wine.region,
    vineyard: r.wine.vineyard,
    reviewId: r._id
  }));

  console.log(`Found ${wines.length} wines to upgrade`);

  if (resumeArg && progress.lastProcessedIndex >= 0) {
    console.log(`Resuming from wine ${progress.lastProcessedIndex + 1}`);
    console.log(`Already completed: ${progress.successCount} wines\n`);
  }

  if (wines.length === 0) {
    console.log('No wines found!');
    return;
  }

  if (dryRun) {
    console.log('\nDRY RUN - Sample wines that would be upgraded:\n');
    wines.slice(0, 5).forEach((wine, i) => {
      console.log(`${i + 1}. ${wine.name} ${wine.vintage || 'NV'}`);
      console.log(`   Producer: ${wine.producer?.name}`);
      console.log(`   Region: ${wine.region?.name}\n`);
    });
    console.log(`Run without --dry-run to upgrade ${wines.length} reviews with François-powered scoring`);
    return;
  }

  // Start from where we left off
  const startIndex = progress.lastProcessedIndex + 1;
  const winesToProcess = wines.slice(startIndex);

  for (let i = 0; i < winesToProcess.length; i += BATCH_SIZE) {
    const batch = winesToProcess.slice(i, Math.min(i + BATCH_SIZE, winesToProcess.length));
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(winesToProcess.length / BATCH_SIZE);
    const globalIndex = startIndex + i;

    console.log(`\n📦 BATCH ${batchNum}/${totalBatches} (${batch.length} wines)`);
    console.log('='.repeat(70));

    for (const wine of batch) {
      const wineNum = globalIndex + batch.indexOf(wine) + 1;
      console.log(`\n[${wineNum}/${wines.length}] ${wine.name} ${wine.vintage || 'NV'}`);

      try {
        // Query François for context
        const ragQuery = `${wine.producer?.name || ''} ${wine.name} ${wine.vintage || ''} ${wine.region?.name || ''} ${wine.vineyard?.name || ''} vintage review tasting notes quality`;
        console.log('  🔍 Querying François...');
        const francoisContext = await getFrancoisContext(ragQuery);

        if (francoisContext) {
          console.log(`  ✓ Found François context (${francoisContext.length} chars)`);
        } else {
          console.log('  ⚠️  No François context - using general knowledge');
        }

        // Generate Wine Saint review with intelligent score
        console.log('  ✍️  Generating review with intelligent score...');
        const review = await generateWineSaintReviewWithScore(wine, francoisContext);
        console.log(`  📝 Generated: ${review.tastingNotes.substring(0, 80)}...`);
        console.log(`  📊 Score: ${review.score}/100`);

        // Update review document in Sanity
        await sanityClient
          .patch(wine.reviewId)
          .set({
            tastingNotes: review.tastingNotes,
            score: review.score,
            flavorProfile: review.flavorProfile,
            drinkingWindowStart: review.drinkingWindowStart,
            drinkingWindowEnd: review.drinkingWindowEnd,
            reviewerName: 'Wine Saint', // Match existing reviews
            isAiGenerated: true
          })
          .commit();

        console.log(`  ✅ Updated review document`);
        progress.successCount++;
        progress.lastProcessedIndex = globalIndex + batch.indexOf(wine);

      } catch (error: any) {
        console.error(`  ❌ Error: ${error.message}`);
        progress.errorCount++;
        progress.errors.push({
          wine: `${wine.name} ${wine.vintage || 'NV'}`,
          error: error.message
        });
      }
    }

    // Save progress after each batch
    saveProgress(progress);
    console.log(`\n  Batch complete: ${progress.successCount} total updated, ${progress.errorCount} errors`);

    // Delay between batches
    if (i + BATCH_SIZE < winesToProcess.length) {
      console.log(`  ⏳ Waiting ${DELAY_MS}ms...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Reviews upgraded: ${progress.successCount}`);
  console.log(`❌ Errors: ${progress.errorCount}`);

  if (progress.errors.length > 0) {
    console.log(`\n⚠️  Errors (first 10):`);
    progress.errors.slice(0, 10).forEach((e, i) => {
      console.log(`  ${i + 1}. ${e.wine}: ${e.error}`);
    });
  }

  console.log(`\n💾 Progress saved to: ${PROGRESS_FILE}`);
  console.log('\n✅ Future wines should use wine-saint-unified-system.ts for formula-based scoring');
}

main()
  .then(() => {
    console.log('\n✅ Geranium review upgrade complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Upgrade failed:', error);
    process.exit(1);
  });
