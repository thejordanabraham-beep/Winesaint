import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Conversion table from generate-reviews.ts
const SCORE_CONVERSION: Record<number, [number, number]> = {
  100: [9.8, 10.0],
  99: [9.5, 9.7],
  98: [9.3, 9.5],
  97: [9.1, 9.3],
  96: [8.5, 9.0],
  95: [8.1, 8.5],
  94: [8.0, 8.0],
  93: [7.7, 7.9],
  92: [7.5, 7.6],
  91: [7.3, 7.4],
  90: [7.1, 7.2],
  89: [6.9, 7.0],
  88: [6.6, 6.8],
  87: [6.4, 6.5],
};

async function main() {
  // Find an Opus One wine (has K&L notes in the original system)
  const wine = await sanityClient.fetch(`
    *[_type == 'wine' && producer->name match 'Opus One*'][0] {
      name,
      vintage,
      producer->{name},
      criticAvg,
      vivinoScore
    }
  `);

  if (!wine) {
    console.log('No Opus One found - trying other wines with scores...');
    const altWine = await sanityClient.fetch(`
      *[_type == 'wine' && defined(criticAvg) && defined(vivinoScore)][0] {
        name,
        vintage,
        producer->{name},
        criticAvg,
        vivinoScore
      }
    `);

    if (altWine) {
      testWine(altWine);
    }
    return;
  }

  testWine(wine);
}

function testWine(wine: any) {
  console.log('Testing K&L Wine Scoring & Conversion:');
  console.log('======================================');
  console.log(`Wine: ${wine.name}`);
  console.log(`Producer: ${wine.producer?.name}`);
  console.log(`Vintage: ${wine.vintage}`);
  console.log('');
  console.log('Database Scores:');
  console.log(`  criticAvg: ${wine.criticAvg || 'NULL'}`);
  console.log(`  vivinoScore: ${wine.vivinoScore || 'NULL'}`);
  console.log('');

  if (wine.criticAvg || wine.vivinoScore) {
    // Apply formula (from wine-saint-unified-system.ts)
    const critic = wine.criticAvg || 88;
    const vivino = wine.vivinoScore ? Math.round(wine.vivinoScore * 20 + 10) : 88;
    const weighted = (critic * 0.85) + (vivino * 0.15);
    const boosted = weighted + 2;
    const final100 = Math.max(Math.round(boosted), 87);

    console.log('Formula Calculation (100-point scale):');
    console.log(`  Critic score: ${critic}`);
    console.log(`  Vivino converted to 100-point: ${vivino} (from ${wine.vivinoScore})`);
    console.log(`  Weighted average: ${weighted.toFixed(1)}`);
    console.log(`  + 2 boost: ${boosted.toFixed(1)}`);
    console.log(`  Final score (100-point): ${final100}`);
    console.log('');

    // Convert to 10-point using the conversion table
    const conversion = SCORE_CONVERSION[final100];
    if (conversion) {
      const tenPointAvg = (conversion[0] + conversion[1]) / 2;
      console.log('Conversion to 10-point scale:');
      console.log(`  100-point score ${final100} maps to range: ${conversion[0]} - ${conversion[1]}`);
      console.log(`  Average 10-point score: ${tenPointAvg.toFixed(1)}`);
    } else {
      console.log(`No conversion mapping for score ${final100}`);
      console.log(`Simple division: ${(final100 / 10).toFixed(1)}`);
    }
  } else {
    console.log('No scores available - would default to 90/100');
    const conversion = SCORE_CONVERSION[90];
    const tenPointAvg = (conversion[0] + conversion[1]) / 2;
    console.log(`Default 90/100 converts to: ${tenPointAvg.toFixed(1)}/10`);
  }
}

main();
