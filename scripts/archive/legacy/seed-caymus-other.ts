/**
 * Seed other Caymus bottlings 2000-2020
 * - Caymus Napa Valley Cabernet Sauvignon (flagship)
 * - Caymus Suisun Grand Durif (Petite Sirah, 2016+)
 */

import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@sanity/client';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Caymus Napa Valley Cabernet Sauvignon (flagship wine)
// Generally scores 88-93, slightly below Special Selection
const caymusNapaVintages = [
  { vintage: 2020, criticAvg: 91, vivinoScore: 4.4, priceUsd: 90 },
  { vintage: 2019, criticAvg: 92, vivinoScore: 4.4, priceUsd: 85 },
  { vintage: 2018, criticAvg: 91, vivinoScore: 4.5, priceUsd: 82 },
  { vintage: 2017, criticAvg: 90, vivinoScore: 4.3, priceUsd: 80 },
  { vintage: 2016, criticAvg: 92, vivinoScore: 4.5, priceUsd: 78 },
  { vintage: 2015, criticAvg: 91, vivinoScore: 4.4, priceUsd: 75 },
  { vintage: 2014, criticAvg: 90, vivinoScore: 4.3, priceUsd: 72 },
  { vintage: 2013, criticAvg: 92, vivinoScore: 4.4, priceUsd: 70 },
  { vintage: 2012, criticAvg: 93, vivinoScore: 4.5, priceUsd: 68 },
  { vintage: 2011, criticAvg: 89, vivinoScore: 4.2, priceUsd: 65 },
  { vintage: 2010, criticAvg: 91, vivinoScore: 4.3, priceUsd: 62 },
  { vintage: 2009, criticAvg: 90, vivinoScore: 4.3, priceUsd: 60 },
  { vintage: 2008, criticAvg: 88, vivinoScore: 4.1, priceUsd: 58 },
  { vintage: 2007, criticAvg: 92, vivinoScore: 4.4, priceUsd: 55 },
  { vintage: 2006, criticAvg: 90, vivinoScore: 4.3, priceUsd: 52 },
  { vintage: 2005, criticAvg: 91, vivinoScore: 4.3, priceUsd: 50 },
  { vintage: 2004, criticAvg: 89, vivinoScore: 4.2, priceUsd: 48 },
  { vintage: 2003, criticAvg: 88, vivinoScore: 4.1, priceUsd: 45 },
  { vintage: 2002, criticAvg: 91, vivinoScore: 4.3, priceUsd: 42 },
  { vintage: 2001, criticAvg: 90, vivinoScore: 4.2, priceUsd: 40 },
  { vintage: 2000, criticAvg: 89, vivinoScore: 4.2, priceUsd: 38 },
];

// Caymus Suisun Grand Durif (Petite Sirah) - started production ~2016
const caymusDurifVintages = [
  { vintage: 2020, criticAvg: 91, vivinoScore: 4.3, priceUsd: 35 },
  { vintage: 2019, criticAvg: 90, vivinoScore: 4.3, priceUsd: 32 },
  { vintage: 2018, criticAvg: 91, vivinoScore: 4.4, priceUsd: 30 },
  { vintage: 2017, criticAvg: 89, vivinoScore: 4.2, priceUsd: 28 },
  { vintage: 2016, criticAvg: 90, vivinoScore: 4.3, priceUsd: 26 },
];

async function main() {
  console.log('🍷 Seeding Other Caymus Bottlings');
  console.log('='.repeat(50));

  // Get the producer reference
  const producer = await client.fetch(
    `*[_type == "producer" && name == "Caymus Vineyards"][0]{ _id }`
  );

  // Get region references
  const napaRegion = await client.fetch(
    `*[_type == "region" && name == "Napa Valley"][0]{ _id }`
  );

  if (!producer || !napaRegion) {
    console.error('❌ Producer or Napa region not found.');
    process.exit(1);
  }

  // Check if Suisun Valley region exists, create if not
  let suisunRegion = await client.fetch(
    `*[_type == "region" && name == "Suisun Valley"][0]{ _id }`
  );

  if (!suisunRegion) {
    console.log('Creating Suisun Valley region...');
    const newRegion = await client.create({
      _type: 'region',
      _id: 'region-suisun',
      name: 'Suisun Valley',
      country: 'USA',
      description: 'Located between Napa and the Sacramento River Delta, Suisun Valley is known for Petite Sirah and other warm-climate varietals.',
    });
    suisunRegion = { _id: newRegion._id };
  }

  let created = 0;
  let skipped = 0;

  // Create Caymus Napa Valley Cabernet Sauvignon entries
  console.log('\n📍 Caymus Napa Valley Cabernet Sauvignon');
  console.log('-'.repeat(40));

  for (const vintage of caymusNapaVintages) {
    const slug = `caymus-napa-valley-cabernet-${vintage.vintage}`;

    const existing = await client.fetch(
      `*[_type == "wine" && slug.current == $slug][0]{ _id }`,
      { slug }
    );

    if (existing) {
      console.log(`⏭️  Skipping ${vintage.vintage} - already exists`);
      skipped++;
      continue;
    }

    const wineDoc = {
      _type: 'wine',
      _id: `wine-caymus-napa-cab-${vintage.vintage}`,
      name: 'Caymus Napa Valley Cabernet Sauvignon',
      slug: { _type: 'slug', current: slug },
      vintage: vintage.vintage,
      grapeVarieties: ['Cabernet Sauvignon'],
      priceUsd: vintage.priceUsd,
      criticAvg: vintage.criticAvg,
      vivinoScore: vintage.vivinoScore,
      flavorMentions: [
        'Black Cherry',
        'Cocoa',
        'Vanilla',
        'Blackberry',
        'Oak',
        'Plum',
      ],
      producer: { _type: 'reference', _ref: producer._id },
      region: { _type: 'reference', _ref: napaRegion._id },
      hasAiReview: false,
    };

    await client.createOrReplace(wineDoc);
    console.log(`✅ Created Caymus Napa Valley Cab ${vintage.vintage} (Critic: ${vintage.criticAvg}, Vivino: ${vintage.vivinoScore})`);
    created++;
  }

  // Create Caymus Suisun Grand Durif entries
  console.log('\n📍 Caymus Suisun Grand Durif (Petite Sirah)');
  console.log('-'.repeat(40));

  for (const vintage of caymusDurifVintages) {
    const slug = `caymus-suisun-grand-durif-${vintage.vintage}`;

    const existing = await client.fetch(
      `*[_type == "wine" && slug.current == $slug][0]{ _id }`,
      { slug }
    );

    if (existing) {
      console.log(`⏭️  Skipping ${vintage.vintage} - already exists`);
      skipped++;
      continue;
    }

    const wineDoc = {
      _type: 'wine',
      _id: `wine-caymus-durif-${vintage.vintage}`,
      name: 'Caymus Suisun Grand Durif',
      slug: { _type: 'slug', current: slug },
      vintage: vintage.vintage,
      grapeVarieties: ['Petite Sirah'],
      priceUsd: vintage.priceUsd,
      criticAvg: vintage.criticAvg,
      vivinoScore: vintage.vivinoScore,
      flavorMentions: [
        'Blueberry',
        'Blackberry',
        'Dark Chocolate',
        'Black Pepper',
        'Violet',
        'Licorice',
      ],
      producer: { _type: 'reference', _ref: producer._id },
      region: { _type: 'reference', _ref: suisunRegion._id },
      hasAiReview: false,
    };

    await client.createOrReplace(wineDoc);
    console.log(`✅ Created Caymus Grand Durif ${vintage.vintage} (Critic: ${vintage.criticAvg}, Vivino: ${vintage.vivinoScore})`);
    created++;
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Summary: ${created} created, ${skipped} skipped`);
  console.log('\nRun `npx tsx scripts/generate-reviews.ts --limit 30` to generate reviews.');
}

main().catch(console.error);
