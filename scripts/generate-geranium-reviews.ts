/**
 * GENERATE WINE SAINT REVIEWS FOR GERANIUM WINES
 *
 * Enhanced multi-source system:
 * 1. Query François RAG for context
 * 2. Web search for any reviews/descriptions/scores
 * 3. Combine all sources
 * 4. Claude reads everything and assigns intelligent score
 * 5. Generate Wine Saint review
 */

import { createClient } from '@sanity/client';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const BATCH_SIZE = 10;
const DELAY_MS = 2000;
const PROGRESS_FILE = '/tmp/geranium-reviews-progress.json';

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
  producer: { _id: string; name: string };
  region: { _id: string; name: string };
  vineyard?: { _id: string; name: string };
  reviewId: string;
  slug: string;
  existingReview: string;
}

// Generate Wine Saint review with multi-source context
async function generateWineSaintReview(wine: Wine, francoisContext: string, existingReview: string): Promise<any> {
  const prompt = `You are Wine Saint, writing a technical wine review.

## WINE DETAILS:
- Wine: ${wine.name}
- Producer: ${wine.producer?.name || 'Unknown'}
- Vintage: ${wine.vintage || 'NV'}
- Region: ${wine.region?.name || 'Unknown'}
${wine.vineyard ? `- Vineyard: ${wine.vineyard.name}\n` : ''}

## EXISTING PROFILE (use ONLY to determine if red/white and grape varieties):
${existingReview}

## AVAILABLE CONTEXT (from François knowledge base and other sources):
${francoisContext || 'Limited context available - use general wine knowledge and producer reputation.'}

## YOUR TASK:
1. **Analyze the quality tier** based on:
   - Producer reputation and prestige
   - Region/appellation quality
   - Vineyard classification (if applicable)
   - Any scores or reviews mentioned in context

2. **Assign an appropriate score (90-100 point scale)**:
   - 96-100: Legendary (Grand Cru from top producers, First Growths, cult wines)
   - 92-95: Outstanding (Premier Cru, excellent producers, great vintages)
   - 89-91: Very Good/Excellent (Village level from good producers, quality wines)
   - 87-88: Good/Solid (Well-made wines from reputable sources)
   - Use the FULL range - don't default to middle scores

3. **Write a Wine Saint review** (2-3 sentences):
   - FOCUS ON: Flavor profile, structure, texture
   - INCLUDE IF RELEVANT: Vintage character or unique bottling details
   - DO NOT INCLUDE: Producer history, educational background, founding dates
   - Use precise wine terminology (tannins, acidity, minerality, texture, balance)
   - Technical but natural tone - vary your approach
   - Make sure you use correct red/white wine descriptors based on the existing profile

## OUTPUT FORMAT (JSON):
{
  "score": <your score 87-100>,
  "tastingNotes": "2-3 sentence tasting note focusing on flavors and structure",
  "flavorProfile": ["descriptor1", "descriptor2", "descriptor3", "descriptor4", "descriptor5"],
  "drinkingWindowStart": ${Math.max(wine.vintage || new Date().getFullYear(), new Date().getFullYear())},
  "drinkingWindowEnd": ${(wine.vintage || new Date().getFullYear()) + 15}
}

Return ONLY valid JSON.`;

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

  console.log('🍷 WINE SAINT REVIEW GENERATOR (Multi-Source Enhanced)');
  console.log('='.repeat(70));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}`);
  console.log(`Batch size: ${BATCH_SIZE} wines`);
  console.log('\nSources: François RAG + Web Context + Producer Knowledge\n');

  const progress = resumeArg ? loadProgress() : {
    lastProcessedIndex: -1,
    successCount: 0,
    errorCount: 0,
    errors: []
  };

  // Find all wines with WineSaint AI reviews
  const query = `
    *[_type == "review" && reviewerName == "WineSaint AI"] | order(_createdAt asc) {
      _id,
      tastingNotes,
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
    reviewId: r._id,
    existingReview: r.tastingNotes || ''
  }));

  console.log(`Found ${wines.length} wines to process`);

  if (resumeArg && progress.lastProcessedIndex >= 0) {
    console.log(`Resuming from wine ${progress.lastProcessedIndex + 1}`);
    console.log(`Already completed: ${progress.successCount} wines\n`);
  }

  if (wines.length === 0) {
    console.log('No wines found!');
    return;
  }

  if (dryRun) {
    console.log('\nDRY RUN - Sample review generation for first wine:\n');
    const testWine = wines[0];
    console.log(`Testing: ${testWine.name} ${testWine.vintage || 'NV'}`);
    console.log(`Producer: ${testWine.producer?.name}`);
    console.log(`Region: ${testWine.region?.name}`);

    const ragQuery = `${testWine.producer?.name || ''} ${testWine.name} ${testWine.vintage || ''} ${testWine.region?.name || ''} vintage review tasting`;
    const francoisContext = await getFrancoisContext(ragQuery);

    console.log(`\nFrançois context: ${francoisContext.length > 0 ? francoisContext.length + ' chars' : 'None found'}`);

    const review = await generateWineSaintReview(testWine, francoisContext, testWine.existingReview);
    console.log(`\nGenerated Review:`);
    console.log(`  Score: ${review.score}/100`);
    console.log(`  Review: ${review.tastingNotes}`);
    console.log(`  Flavors: ${review.flavorProfile.join(', ')}`);

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
        // 1. Query François for context
        const ragQuery = `${wine.producer?.name || ''} ${wine.name} ${wine.vintage || ''} ${wine.region?.name || ''} ${wine.vineyard?.name || ''} vintage review tasting notes quality`;
        console.log('  🔍 Querying François + sources...');
        const francoisContext = await getFrancoisContext(ragQuery);

        if (francoisContext) {
          console.log(`  ✓ Found context (${francoisContext.length} chars)`);
        } else {
          console.log('  ⚠️  No context - using general knowledge');
        }

        // 2. Generate Wine Saint review with intelligent score
        console.log('  ✍️  Generating Wine Saint review...');
        const review = await generateWineSaintReview(wine, francoisContext, wine.existingReview);
        console.log(`  📝 Review: ${review.tastingNotes.substring(0, 80)}...`);
        console.log(`  📊 Score: ${review.score}/100`);

        // 3. Update review document in Sanity
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
  console.log(`✅ Reviews generated: ${progress.successCount}`);
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
    console.log('\n✅ Wine Saint review generation complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Generation failed:', error);
    process.exit(1);
  });
