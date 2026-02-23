/**
 * François Review Generator for Geranium Wines
 *
 * Takes the 2,610 wines with basic WineSaint AI reviews and upgrades them
 * with François-powered reviews and proper scores
 */

import { createClient } from '@sanity/client';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';
import { getReferenceNotes } from './lib/reference-sources';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const BATCH_SIZE = 10;
const DELAY_MS = 2000;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

interface Wine {
  _id: string;
  name: string;
  vintage: number;
  producer: { name: string };
  region: { name: string };
  reviewId: string;
}

async function generateFrancoisReview(wine: Wine): Promise<{ review: string; score: number }> {
  try {
    // Query François for context
    const searchTerms = [
      wine.producer?.name || '',
      wine.region?.name || '',
      ...wine.name.split(/\s+/).filter(w => w.length > 3)
    ].filter(Boolean);

    let francoisContext = '';
    try {
      const context = await getReferenceNotes(
        wine.producer?.name || '',
        wine.region?.name || '',
        searchTerms
      );
      francoisContext = Array.isArray(context) && context.length > 0
        ? context.map((c: any) => c.text).join('\n\n').substring(0, 3000)
        : '';
    } catch (err) {
      // Silent fail - will use general knowledge
    }

    // Generate review with Claude using François context
    const prompt = `You are a wine expert writing a professional tasting note and score for a wine database.

WINE: ${wine.name}
VINTAGE: ${wine.vintage || 'NV'}
PRODUCER: ${wine.producer?.name || 'Unknown'}
REGION: ${wine.region?.name || 'Unknown'}

${francoisContext ? `EDUCATIONAL CONTEXT FROM WINE DATABASE:\n${francoisContext}\n` : ''}

Write a detailed wine review (300-500 words) that includes:
1. Producer background and reputation
2. Vineyard/terroir details (if applicable)
3. Winemaking style and techniques
4. Expected flavor profile and characteristics
5. Drinking window and aging potential
6. Overall quality assessment

Then assign a score on a 10-point scale:
- 9.5-10.0: Exceptional, world-class
- 9.0-9.4: Outstanding, top tier
- 8.5-8.9: Excellent, highly recommended
- 8.0-8.4: Very good, solid quality
- 7.5-7.9: Good, above average
- 7.0-7.4: Decent, acceptable
- Below 7.0: Flawed or poor

Format your response as:
REVIEW: [your review text]
SCORE: [numeric score]`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1500,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    });

    const response = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse review and score
    const reviewMatch = response.match(/REVIEW:\s*([\s\S]*?)(?=SCORE:)/);
    const scoreMatch = response.match(/SCORE:\s*(\d+\.?\d*)/);

    const review = reviewMatch ? reviewMatch[1].trim() : response;
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : 7.5;

    return { review, score };

  } catch (error: any) {
    console.error(`Error generating review: ${error.message}`);
    throw error;
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const limitArg = process.argv.indexOf('--limit');
  const limit = limitArg !== -1 ? parseInt(process.argv[limitArg + 1], 10) : undefined;

  console.log('🍷 FRANÇOIS REVIEW GENERATOR FOR GERANIUM WINES');
  console.log('='.repeat(70));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}`);
  console.log(`Batch size: ${BATCH_SIZE} wines\n`);

  // Find all wines with WineSaint AI reviews (the ones we just created)
  const query = `
    *[_type == "review" && reviewerName == "WineSaint AI"] {
      _id,
      wine->{
        _id,
        name,
        vintage,
        producer->{name},
        region->{name}
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
    reviewId: r._id
  }));

  console.log(`Found ${wines.length} wines to review\n`);

  if (wines.length === 0) {
    console.log('No wines found!');
    return;
  }

  if (dryRun) {
    console.log('DRY RUN - Sample wines that would be reviewed:\n');
    wines.slice(0, 5).forEach((wine, i) => {
      console.log(`${i + 1}. ${wine.name} ${wine.vintage || 'NV'}`);
      console.log(`   Producer: ${wine.producer?.name}`);
      console.log(`   Region: ${wine.region?.name}\n`);
    });
    console.log(`Run without --dry-run to generate ${wines.length} François reviews`);
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < wines.length; i += BATCH_SIZE) {
    const batch = wines.slice(i, Math.min(i + BATCH_SIZE, wines.length));
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(wines.length / BATCH_SIZE);

    console.log(`\n📦 BATCH ${batchNum}/${totalBatches} (${batch.length} wines)`);
    console.log('='.repeat(70));

    for (const wine of batch) {
      const wineNum = i + batch.indexOf(wine) + 1;
      console.log(`\n[${wineNum}/${wines.length}] ${wine.name} ${wine.vintage || 'NV'}`);

      try {
        // Generate François-powered review
        const { review, score } = await generateFrancoisReview(wine);
        console.log(`  📝 Generated review (${review.length} chars, score: ${score})`);

        // Update review document
        await sanityClient
          .patch(wine.reviewId)
          .set({
            tastingNotes: review,
            score: score,
            reviewerName: 'Wine Saint', // Match existing reviews
            isAiGenerated: true
          })
          .commit();

        console.log(`  ✅ Updated review document`);
        successCount++;

      } catch (error: any) {
        console.error(`  ❌ Error: ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n  Batch complete: ${successCount} updated, ${errorCount} errors`);

    // Delay between batches
    if (i + BATCH_SIZE < wines.length) {
      console.log(`  ⏳ Waiting ${DELAY_MS}ms...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Reviews updated: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
}

main()
  .then(() => {
    console.log('\n✅ François review generation complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Generation failed:', error);
    process.exit(1);
  });
