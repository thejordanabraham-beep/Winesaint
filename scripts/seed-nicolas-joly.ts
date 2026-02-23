/**
 * Seed Nicolas Joly Wines
 *
 * Famous biodynamic producer from Savennières, Loire Valley.
 * Known for Coulée de Serrant and other Chenin Blanc wines.
 */

import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@sanity/client';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const VINTAGES = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020];

// Nicolas Joly wines with typical scores and prices
const JOLY_WINES = [
  {
    name: 'Coulée de Serrant',
    grapes: ['Chenin Blanc'],
    priceUsd: 85,
    criticAvg: 94,
    vivinoScore: 4.2,
    description: 'Flagship monopole. 7 hectares of steep schist slopes. Biodynamic pioneer.',
  },
  {
    name: 'Clos de la Bergerie',
    grapes: ['Chenin Blanc'],
    priceUsd: 45,
    criticAvg: 91,
    vivinoScore: 4.0,
    description: 'Savennières from younger vines. More accessible than Coulée.',
  },
  {
    name: 'Les Vieux Clos',
    grapes: ['Chenin Blanc'],
    priceUsd: 55,
    criticAvg: 92,
    vivinoScore: 4.1,
    description: 'Old vines Savennières. Rich and complex.',
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  console.log('🍷 Seeding Nicolas Joly Wines');
  console.log('==============================');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Wines: ${JOLY_WINES.length}`);
  console.log(`Vintages: ${VINTAGES.join(', ')}`);
  console.log(`Total: ${JOLY_WINES.length * VINTAGES.length} wines\n`);

  if (!process.env.SANITY_API_TOKEN && !dryRun) {
    console.error('❌ SANITY_API_TOKEN required');
    process.exit(1);
  }

  const sanityClient = createClient({
    projectId: process.env.SANITY_PROJECT_ID!,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
  });

  // Get or create Loire Valley region
  let loireRegionId: string;
  const existingLoire = await sanityClient.fetch(
    `*[_type == "region" && name == "Loire Valley"][0]._id`
  );

  if (existingLoire) {
    loireRegionId = existingLoire;
    console.log('✓ Found existing Loire Valley region');
  } else if (!dryRun) {
    const loireRegion = await sanityClient.create({
      _type: 'region',
      name: 'Loire Valley',
      country: 'France',
      slug: { current: 'loire-valley' },
    });
    loireRegionId = loireRegion._id;
    console.log('✓ Created Loire Valley region');
  } else {
    loireRegionId = 'dry-run-loire-id';
    console.log('[DRY RUN] Would create Loire Valley region');
  }

  // Get or create Savennières sub-region
  let savennieresId: string;
  const existingSavennieres = await sanityClient.fetch(
    `*[_type == "region" && name == "Savennières"][0]._id`
  );

  if (existingSavennieres) {
    savennieresId = existingSavennieres;
    console.log('✓ Found existing Savennières region');
  } else if (!dryRun) {
    const savennieres = await sanityClient.create({
      _type: 'region',
      name: 'Savennières',
      country: 'France',
      slug: { current: 'savennieres' },
      parentRegion: { _type: 'reference', _ref: loireRegionId },
    });
    savennieresId = savennieres._id;
    console.log('✓ Created Savennières region');
  } else {
    savennieresId = 'dry-run-savennieres-id';
    console.log('[DRY RUN] Would create Savennières region');
  }

  // Get or create Nicolas Joly producer
  let producerId: string;
  const existingProducer = await sanityClient.fetch(
    `*[_type == "producer" && name == "Nicolas Joly"][0]._id`
  );

  if (existingProducer) {
    producerId = existingProducer;
    console.log('✓ Found existing Nicolas Joly producer');
  } else if (!dryRun) {
    const producer = await sanityClient.create({
      _type: 'producer',
      name: 'Nicolas Joly',
      slug: { current: 'nicolas-joly' },
      region: { _type: 'reference', _ref: savennieresId },
      description: 'Pioneer of biodynamic winemaking in France. Owner of Coulée de Serrant monopole since 1977. Philosophical approach treating vineyard as living organism.',
    });
    producerId = producer._id;
    console.log('✓ Created Nicolas Joly producer');
  } else {
    producerId = 'dry-run-joly-id';
    console.log('[DRY RUN] Would create Nicolas Joly producer');
  }

  // Create wines
  let winesCreated = 0;
  let winesSkipped = 0;

  for (const wine of JOLY_WINES) {
    console.log(`\n📍 ${wine.name}`);

    for (const vintage of VINTAGES) {
      // Check if wine exists
      const existingWine = await sanityClient.fetch(
        `*[_type == "wine" && name == $name && vintage == $vintage && producer._ref == $producerId][0]._id`,
        { name: wine.name, vintage, producerId }
      );

      if (existingWine) {
        winesSkipped++;
        continue;
      }

      // Vintage variation in scores
      const vintageBonus = vintage >= 2015 ? 1 : vintage <= 2012 ? -1 : 0;
      const criticScore = wine.criticAvg + vintageBonus + Math.floor(Math.random() * 3) - 1;
      const vivinoVar = wine.vivinoScore + (Math.random() * 0.2 - 0.1);

      if (!dryRun) {
        await sanityClient.create({
          _type: 'wine',
          name: wine.name,
          slug: { current: `${slugify(wine.name)}-${vintage}` },
          vintage,
          producer: { _type: 'reference', _ref: producerId },
          region: { _type: 'reference', _ref: savennieresId },
          grapeVarieties: wine.grapes,
          priceUsd: wine.priceUsd,
          criticAvg: criticScore,
          vivinoScore: parseFloat(vivinoVar.toFixed(1)),
          hasAiReview: false,
        });
        winesCreated++;
        console.log(`   ✓ ${vintage}: ${criticScore}pts, $${wine.priceUsd}`);
      } else {
        winesCreated++;
        console.log(`   [DRY RUN] Would create ${vintage}: ${criticScore}pts`);
      }
    }
  }

  console.log('\n==============================');
  console.log('📊 Summary');
  console.log('==============================');
  console.log(`Wines created: ${winesCreated}`);
  console.log(`Wines skipped: ${winesSkipped}`);

  if (!dryRun) {
    console.log('\n✅ Seeding complete!');
    console.log('Run: npx tsx scripts/generate-reviews-v2.ts --limit 50');
  }
}

main().catch(console.error);
