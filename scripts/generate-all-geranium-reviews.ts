import { createClient } from '@sanity/client';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const BATCH_SIZE = 10;
const DELAY_MS = 2000;
const PROGRESS_FILE = '/tmp/geranium-all-reviews-progress.json';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Conversion table
const SCORE_CONVERSION: Record<number, [number, number]> = {
  100: [9.8, 10.0], 99: [9.5, 9.7], 98: [9.3, 9.5], 97: [9.1, 9.3],
  96: [8.5, 9.0], 95: [8.1, 8.5], 94: [8.0, 8.0], 93: [7.7, 7.9],
  92: [7.5, 7.6], 91: [7.3, 7.4], 90: [7.1, 7.2], 89: [6.9, 7.0],
  88: [6.6, 6.8], 87: [6.4, 6.5],
};

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

async function getFrancoisContext(query: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:8000/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, n_results: 10, rerank: true })
    });
    if (!response.ok) return '';
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results.map((r: any) => r.text).join('\n\n').substring(0, 3000);
    }
    return '';
  } catch { return ''; }
}

async function generateReview(wine: any, score10Point: number, existingReview: string, francoisContext: string): Promise<any> {
  const prompt = `You are Wine Saint, writing a technical wine review.

## WINE DETAILS:
- Wine: ${wine.name}
- Producer: ${wine.producer?.name || 'Unknown'}
- Vintage: ${wine.vintage || 'NV'}
- Region: ${wine.region?.name || 'Unknown'}

## EXISTING PROFILE (to determine red/white and grapes):
${existingReview}

## FRANÇOIS CONTEXT:
${francoisContext || 'Limited context.'}

## TASK:
Write Wine Saint review (2-3 sentences):
- Focus on flavor, structure, texture
- Include vintage/bottling details if relevant
- NO producer history
- Use correct red/white descriptors
- Technical wine terminology

Score: ${score10Point}/10

JSON:
{
  "score": ${score10Point},
  "tastingNotes": "2-3 sentences",
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
  if (!jsonMatch) throw new Error('Failed to parse JSON');
  return JSON.parse(jsonMatch[0]);
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const resumeArg = process.argv.includes('--resume');

  console.log('🍷 GERANIUM WINE REVIEWS - FULL BATCH');
  console.log('=====================================');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`System: criticAvg → Conversion Table → 10-point score\n`);

  const progress = resumeArg ? loadProgress() : {
    lastProcessedIndex: -1, successCount: 0, errorCount: 0, errors: []
  };

  const wines = await sanityClient.fetch(`
    *[_type == "review" && reviewerName == "WineSaint AI"] | order(_createdAt asc) {
      _id,
      tastingNotes,
      wine->{
        _id, name, vintage, criticAvg,
        producer->{name},
        region->{name}
      }
    }
  `);

  console.log(`Found ${wines.length} wines`);
  if (resumeArg && progress.lastProcessedIndex >= 0) {
    console.log(`Resuming from ${progress.lastProcessedIndex + 1}`);
    console.log(`Completed: ${progress.successCount}\n`);
  }

  const startIndex = progress.lastProcessedIndex + 1;
  const winesToProcess = wines.slice(startIndex);

  for (let i = 0; i < winesToProcess.length; i += BATCH_SIZE) {
    const batch = winesToProcess.slice(i, Math.min(i + BATCH_SIZE, winesToProcess.length));
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(winesToProcess.length / BATCH_SIZE);
    const globalIndex = startIndex + i;

    console.log(`\n📦 BATCH ${batchNum}/${totalBatches}`);
    console.log('='.repeat(70));

    for (const review of batch) {
      const wine = review.wine;
      const wineNum = globalIndex + batch.indexOf(review) + 1;
      console.log(`\n[${wineNum}/${wines.length}] ${wine.name} ${wine.vintage || 'NV'}`);

      try {
        // Calculate score
        const score100 = wine.criticAvg || 89;
        const conversion = SCORE_CONVERSION[score100] || [score100/10, score100/10];
        const score10Point = parseFloat(((conversion[0] + conversion[1]) / 2).toFixed(1));

        console.log(`  Score: ${score100}/100 → ${score10Point}/10`);

        if (dryRun) {
          console.log('  [DRY RUN] Skipping...');
          progress.successCount++;
          continue;
        }

        // Get context
        const ragQuery = `${wine.producer?.name} ${wine.name} ${wine.vintage} ${wine.region?.name} vintage review`;
        const francoisContext = await getFrancoisContext(ragQuery);

        // Generate
        const generated = await generateReview(wine, score10Point, review.tastingNotes, francoisContext);

        // Update
        await sanityClient.patch(review._id).set({
          score: generated.score,
          tastingNotes: generated.tastingNotes,
          flavorProfile: generated.flavorProfile,
          reviewerName: 'Wine Saint',
          isAiGenerated: true
        }).commit();

        console.log(`  ✅ Updated`);
        progress.successCount++;
        progress.lastProcessedIndex = globalIndex + batch.indexOf(review);

      } catch (error: any) {
        console.error(`  ❌ Error: ${error.message}`);
        progress.errorCount++;
        progress.errors.push({ wine: `${wine.name} ${wine.vintage}`, error: error.message });
      }
    }

    saveProgress(progress);
    console.log(`\nBatch done: ${progress.successCount} total, ${progress.errorCount} errors`);

    if (i + BATCH_SIZE < winesToProcess.length) {
      console.log(`⏳ Waiting ${DELAY_MS}ms...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('FINAL SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Success: ${progress.successCount}`);
  console.log(`❌ Errors: ${progress.errorCount}`);
  if (progress.errors.length > 0) {
    console.log(`\nFirst 10 errors:`);
    progress.errors.slice(0, 10).forEach((e, i) => {
      console.log(`  ${i + 1}. ${e.wine}: ${e.error}`);
    });
  }
}

main();
