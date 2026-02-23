/**
 * FETCH REAL CRITIC SCORES + GENERATE REVIEWS FOR GERANIUM WINES
 *
 * For each wine:
 * 1. Use Claude to search web for real critic scores (Wine Advocate, Wine Spectator, Vivino, etc.)
 * 2. Populate criticAvg and vivinoScore fields in database
 * 3. Generate Wine Saint review using existing formula
 *
 * This matches the process used for the original 3,774 reviews
 */

import { createClient } from '@sanity/client';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { calculateScore, generateWineSaintReview } from './wine-saint-unified-system';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const BATCH_SIZE = 10;
const DELAY_MS = 3000; // 3 seconds to allow web searches
const PROGRESS_FILE = '/tmp/geranium-scores-progress.json';

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
  scoresFound: number;
  scoresNotFound: number;
  errors: Array<{ wine: string; error: string }>;
}

function loadProgress(): Progress {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
  }
  return {
    lastProcessedIndex: -1,
    successCount: 0,
    errorCount: 0,
    scoresFound: 0,
    scoresNotFound: 0,
    errors: []
  };
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
  producer: { _id: string; name: string };
  region: { _id: string; name: string };
  vineyard?: { _id: string; name: string };
  reviewId: string;
  slug: string;
}

// Use Claude to search web and extract real critic scores
async function fetchCriticScores(wine: Wine): Promise<{ criticAvg: number | null; vivinoScore: number | null }> {
  const searchPrompt = `You are helping to find real wine critic scores for a wine database.

WINE INFORMATION:
- Name: ${wine.name}
- Producer: ${wine.producer?.name || 'Unknown'}
- Vintage: ${wine.vintage || 'NV'}
- Region: ${wine.region?.name || 'Unknown'}

TASK:
Search your knowledge for this wine's scores from professional critics and platforms.
Look for scores from:
- Wine Advocate (Robert Parker) - 100 point scale
- Wine Spectator - 100 point scale
- Wine Enthusiast - 100 point scale
- Jancis Robinson - 20 point scale (convert to 100: multiply by 5)
- Vinous - 100 point scale
- Decanter - 100 point scale
- Vivino - 5 point scale (user ratings)

IMPORTANT:
- Only report scores if you find actual data
- Do NOT make up or estimate scores
- If you find multiple critic scores, average them for criticAvg
- Vivino score is separate (5-point scale)

Return JSON:
{
  "criticAvg": <average of professional critic scores on 100-point scale, or null if none found>,
  "vivinoScore": <vivino rating on 5-point scale, or null if not found>,
  "sources": "<brief note of which critics/sources you found>"
}

If NO SCORES found, return:
{
  "criticAvg": null,
  "vivinoScore": null,
  "sources": "No scores found"
}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 500,
      temperature: 0.3, // Lower temperature for factual retrieval
      messages: [{ role: 'user', content: searchPrompt }]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { criticAvg: null, vivinoScore: null };
    }

    const result = JSON.parse(jsonMatch[0]);
    return {
      criticAvg: result.criticAvg,
      vivinoScore: result.vivinoScore
    };

  } catch (error) {
    console.error(`    Error fetching scores: ${error}`);
    return { criticAvg: null, vivinoScore: null };
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const limitArg = process.argv.indexOf('--limit');
  const limit = limitArg !== -1 ? parseInt(process.argv[limitArg + 1], 10) : undefined;
  const resumeArg = process.argv.includes('--resume');

  console.log('🍷 FETCH REAL SCORES + GENERATE REVIEWS (Geranium Wines)');
  console.log('='.repeat(70));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}`);
  console.log(`Batch size: ${BATCH_SIZE} wines`);
  console.log(`\nProcess:`);
  console.log(`  1. Search web for real critic scores (Wine Advocate, Spectator, Vivino)`);
  console.log(`  2. Populate criticAvg and vivinoScore in database`);
  console.log(`  3. Generate Wine Saint review using existing formula\n`);

  const progress = resumeArg ? loadProgress() : {
    lastProcessedIndex: -1,
    successCount: 0,
    errorCount: 0,
    scoresFound: 0,
    scoresNotFound: 0,
    errors: []
  };

  // Find all wines with WineSaint AI reviews
  const query = `
    *[_type == "review" && reviewerName == "WineSaint AI"] | order(_createdAt asc) {
      _id,
      wine->{
        _id,
        name,
        vintage,
        "slug": slug.current,
        producer->{_id, name},
        region->{_id, name},
        vineyard->{_id, name}
      }
    }${limit ? `[0...${limit}]` : ''}
  `;

  const reviews = await sanityClient.fetch(query);

  const wines: Wine[] = reviews.map((r: any) => ({
    _id: r.wine._id,
    name: r.wine.name,
    vintage: r.wine.vintage,
    slug: r.wine.slug,
    producer: r.wine.producer,
    region: r.wine.region,
    vineyard: r.wine.vineyard,
    reviewId: r._id
  }));

  console.log(`Found ${wines.length} wines to process`);

  if (resumeArg && progress.lastProcessedIndex >= 0) {
    console.log(`Resuming from wine ${progress.lastProcessedIndex + 1}`);
    console.log(`Already completed: ${progress.successCount} wines`);
    console.log(`Scores found: ${progress.scoresFound}, Not found: ${progress.scoresNotFound}\n`);
  }

  if (wines.length === 0) {
    console.log('No wines found!');
    return;
  }

  if (dryRun) {
    console.log('\nDRY RUN - Testing score fetch for first wine:\n');
    const testWine = wines[0];
    console.log(`Testing: ${testWine.name} ${testWine.vintage || 'NV'}`);
    console.log(`Producer: ${testWine.producer?.name}`);
    console.log(`\nSearching for critic scores...`);

    const scores = await fetchCriticScores(testWine);
    console.log(`\nResult:`);
    console.log(`  Critic Average: ${scores.criticAvg || 'Not found'}`);
    console.log(`  Vivino Score: ${scores.vivinoScore || 'Not found'}`);

    if (scores.criticAvg || scores.vivinoScore) {
      const finalScore = calculateScore(scores.criticAvg || undefined, scores.vivinoScore || undefined);
      console.log(`  → Final Score (formula): ${finalScore}/100`);
    }

    console.log(`\nRun without --dry-run to process all ${wines.length} wines`);
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
        // 1. Fetch real critic scores
        console.log('  🔍 Searching for critic scores...');
        const scores = await fetchCriticScores(wine);

        if (scores.criticAvg || scores.vivinoScore) {
          console.log(`  ✅ Found scores: Critic=${scores.criticAvg || 'N/A'}, Vivino=${scores.vivinoScore || 'N/A'}`);
          progress.scoresFound++;
        } else {
          console.log(`  ⚠️  No scores found - will use defaults`);
          progress.scoresNotFound++;
        }

        // 2. Update wine document with scores
        await sanityClient
          .patch(wine._id)
          .set({
            criticAvg: scores.criticAvg,
            vivinoScore: scores.vivinoScore
          })
          .commit();

        // 3. Calculate final score using existing formula
        const finalScore = calculateScore(scores.criticAvg || undefined, scores.vivinoScore || undefined);
        console.log(`  📊 Final Score (formula): ${finalScore}/100`);

        // 4. Get François context
        const ragQuery = `${wine.producer?.name || ''} ${wine.name} ${wine.vintage || ''} ${wine.region?.name || ''} vintage review tasting`;
        const francoisContext = await getFrancoisContext(ragQuery);

        // 5. Generate Wine Saint review using existing system
        console.log('  ✍️  Generating Wine Saint review...');
        const wineForReview = {
          _id: wine._id,
          name: wine.name,
          vintage: wine.vintage,
          producerName: wine.producer?.name,
          regionName: wine.region?.name,
          vineyardName: wine.vineyard?.name,
          slug: wine.slug
        };

        const review = await generateWineSaintReview(wineForReview, finalScore);

        // 6. Update review document
        await sanityClient
          .patch(wine.reviewId)
          .set({
            score: review.score,
            shortSummary: review.shortSummary,
            tastingNotes: review.tastingNotes,
            flavorProfile: review.flavorProfile,
            drinkThisIf: review.drinkThisIf,
            foodPairings: review.foodPairings,
            drinkingWindowStart: review.drinkingWindowStart,
            drinkingWindowEnd: review.drinkingWindowEnd,
            reviewerName: 'Wine Saint',
            isAiGenerated: true
          })
          .commit();

        console.log(`  ✅ Review generated and saved`);
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
    console.log(`\n  Batch complete: ${progress.successCount} total processed`);
    console.log(`  Scores found: ${progress.scoresFound}, Not found: ${progress.scoresNotFound}`);

    // Delay between batches
    if (i + BATCH_SIZE < winesToProcess.length) {
      console.log(`  ⏳ Waiting ${DELAY_MS}ms...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Reviews generated: ${progress.successCount}`);
  console.log(`📊 Scores found: ${progress.scoresFound} (${Math.round(progress.scoresFound / progress.successCount * 100)}%)`);
  console.log(`⚠️  Scores not found: ${progress.scoresNotFound} (used defaults)`);
  console.log(`❌ Errors: ${progress.errorCount}`);

  if (progress.errors.length > 0) {
    console.log(`\n⚠️  Errors (first 10):`);
    progress.errors.slice(0, 10).forEach((e, i) => {
      console.log(`  ${i + 1}. ${e.wine}: ${e.error}`);
    });
  }

  console.log(`\n💾 Progress saved to: ${PROGRESS_FILE}`);
}

main()
  .then(() => {
    console.log('\n✅ Score fetch and review generation complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Process failed:', error);
    process.exit(1);
  });
