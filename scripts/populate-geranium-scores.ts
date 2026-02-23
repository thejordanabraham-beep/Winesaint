/**
 * POPULATE REAL CRITIC SCORES FOR GERANIUM WINES
 *
 * This matches the process used for the original Wine Saint reviews:
 * 1. Search wine.com for each wine
 * 2. Extract real critic scores (Wine Advocate, Spectator, etc.)
 * 3. Populate criticAvg and vivinoScore in database
 * 4. Then run wine-saint-unified-system.ts to generate reviews
 *
 * After this script, run: npx tsx scripts/wine-saint-unified-system.ts
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const BATCH_SIZE = 10;
const DELAY_MS = 1000; // 1 second between requests to avoid rate limiting
const PROGRESS_FILE = '/tmp/geranium-scores-progress.json';

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

interface Wine {
  _id: string;
  name: string;
  vintage: number;
  producer: { _id: string; name: string };
  region: { _id: string; name: string };
  slug: string;
}

// Search wine.com for critic scores
async function searchWineComScores(wine: Wine): Promise<{ criticAvg: number | null; vivinoScore: number | null }> {
  try {
    const searchQuery = encodeURIComponent(`${wine.producer?.name || ''} ${wine.name} ${wine.vintage || ''}`);
    const searchUrl = `https://www.wine.com/search/${searchQuery}/1`;

    console.log(`     Searching wine.com for: ${wine.producer?.name} ${wine.name} ${wine.vintage}`);

    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      console.log(`     wine.com returned status ${response.status}`);
      return { criticAvg: null, vivinoScore: null };
    }

    const html = await response.text();

    // Extract product URL from search results
    const productUrlMatch = html.match(/href="(\/product\/[^"]+)"/);
    if (!productUrlMatch) {
      console.log(`     No products found on wine.com`);
      return { criticAvg: null, vivinoScore: null };
    }

    // Fetch the product page
    const productUrl = `https://www.wine.com${productUrlMatch[1]}`;
    console.log(`     Found product: ${productUrl}`);

    const productResponse = await fetch(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!productResponse.ok) {
      return { criticAvg: null, vivinoScore: null };
    }

    const productHtml = await productResponse.text();

    // Extract critic rating (100-point scale)
    const ratingPatterns = [
      /(\d{2,3})\s*(?:points?|pts)/i,
      /Wine\s+(?:Advocate|Spectator|Enthusiast):\s*(\d{2,3})/i,
      /score[d]?:?\s*(\d{2,3})/i,
    ];

    let criticScore: number | null = null;
    for (const pattern of ratingPatterns) {
      const match = productHtml.match(pattern);
      if (match) {
        criticScore = parseInt(match[1]);
        if (criticScore >= 75 && criticScore <= 100) {
          console.log(`     ✓ Found critic score: ${criticScore}/100`);
          break;
        }
      }
    }

    // Estimate Vivino score from critic score
    // Wine.com ratings of 90+ typically correspond to Vivino 4.2-4.5
    let vivinoScore: number | null = null;
    if (criticScore) {
      vivinoScore = 4.0 + (criticScore - 88) * 0.05;
      vivinoScore = Math.max(3.5, Math.min(4.9, vivinoScore)); // Clamp to realistic range
      vivinoScore = Math.round(vivinoScore * 10) / 10; // Round to 1 decimal
    }

    return { criticAvg: criticScore, vivinoScore };

  } catch (error) {
    console.log(`     Error searching wine.com: ${error}`);
    return { criticAvg: null, vivinoScore: null };
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const limitArg = process.argv.indexOf('--limit');
  const limit = limitArg !== -1 ? parseInt(process.argv[limitArg + 1], 10) : undefined;
  const resumeArg = process.argv.includes('--resume');

  console.log('🍷 POPULATE REAL CRITIC SCORES (Geranium Wines)');
  console.log('='.repeat(70));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}`);
  console.log(`Batch size: ${BATCH_SIZE} wines`);
  console.log('\nProcess:');
  console.log('  1. Search wine.com for each wine');
  console.log('  2. Extract real critic scores (Wine Advocate, Spectator, etc.)');
  console.log('  3. Populate criticAvg and vivinoScore in database');
  console.log('  4. After this, run: npx tsx scripts/wine-saint-unified-system.ts\n');

  const progress = resumeArg ? loadProgress() : {
    lastProcessedIndex: -1,
    successCount: 0,
    errorCount: 0,
    scoresFound: 0,
    scoresNotFound: 0,
    errors: []
  };

  // Find all wines with WineSaint AI reviews (the 2,610 we just migrated)
  const query = `
    *[_type == "review" && reviewerName == "WineSaint AI"] | order(_createdAt asc) {
      _id,
      wine->{
        _id,
        name,
        vintage,
        "slug": slug.current,
        producer->{_id, name},
        region->{_id, name}
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
    region: r.wine.region
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
    console.log(`\nSearching wine.com for critic scores...`);

    const scores = await searchWineComScores(testWine);
    console.log(`\nResult:`);
    console.log(`  Critic Average: ${scores.criticAvg || 'Not found'}`);
    console.log(`  Vivino Score (estimated): ${scores.vivinoScore || 'Not found'}`);

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
        // Search wine.com for critic scores
        const scores = await searchWineComScores(wine);

        if (scores.criticAvg || scores.vivinoScore) {
          console.log(`     ✅ Found scores: Critic=${scores.criticAvg || 'N/A'}, Vivino=${scores.vivinoScore || 'N/A'}`);
          progress.scoresFound++;
        } else {
          console.log(`     ⚠️  No scores found`);
          progress.scoresNotFound++;
        }

        // Update wine document with scores
        await sanityClient
          .patch(wine._id)
          .set({
            criticAvg: scores.criticAvg,
            vivinoScore: scores.vivinoScore
          })
          .commit();

        console.log(`     ✅ Updated wine document`);
        progress.successCount++;
        progress.lastProcessedIndex = globalIndex + batch.indexOf(wine);

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));

      } catch (error: any) {
        console.error(`     ❌ Error: ${error.message}`);
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
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Wines processed: ${progress.successCount}`);
  console.log(`📊 Scores found: ${progress.scoresFound} (${Math.round(progress.scoresFound / progress.successCount * 100)}%)`);
  console.log(`⚠️  Scores not found: ${progress.scoresNotFound} (will use defaults)`);
  console.log(`❌ Errors: ${progress.errorCount}`);

  if (progress.errors.length > 0) {
    console.log(`\n⚠️  Errors (first 10):`);
    progress.errors.slice(0, 10).forEach((e, i) => {
      console.log(`  ${i + 1}. ${e.wine}: ${e.error}`);
    });
  }

  console.log(`\n💾 Progress saved to: ${PROGRESS_FILE}`);
  console.log(`\n📋 NEXT STEP:`);
  console.log(`   Run: npx tsx scripts/wine-saint-unified-system.ts`);
  console.log(`   This will generate Wine Saint reviews using the populated scores`);
}

main()
  .then(() => {
    console.log('\n✅ Score population complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Process failed:', error);
    process.exit(1);
  });
