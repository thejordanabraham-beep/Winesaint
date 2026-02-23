/**
 * Seed Opus One vintages 2000-2019
 * (2020 already exists in database)
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

// Opus One vintage data (2000-2019)
// Opus One is consistently highly rated, typically 93-98 range
const opusOneVintages = [
  { vintage: 2019, criticAvg: 97, vivinoScore: 4.6, priceUsd: 420 },
  { vintage: 2018, criticAvg: 98, vivinoScore: 4.7, priceUsd: 400 },
  { vintage: 2017, criticAvg: 95, vivinoScore: 4.5, priceUsd: 380 },
  { vintage: 2016, criticAvg: 97, vivinoScore: 4.6, priceUsd: 375 },
  { vintage: 2015, criticAvg: 98, vivinoScore: 4.7, priceUsd: 370 },
  { vintage: 2014, criticAvg: 96, vivinoScore: 4.5, priceUsd: 350 },
  { vintage: 2013, criticAvg: 97, vivinoScore: 4.6, priceUsd: 340 },
  { vintage: 2012, criticAvg: 96, vivinoScore: 4.6, priceUsd: 330 },
  { vintage: 2011, criticAvg: 93, vivinoScore: 4.4, priceUsd: 310 },
  { vintage: 2010, criticAvg: 96, vivinoScore: 4.6, priceUsd: 320 },
  { vintage: 2009, criticAvg: 94, vivinoScore: 4.5, priceUsd: 300 },
  { vintage: 2008, criticAvg: 93, vivinoScore: 4.4, priceUsd: 290 },
  { vintage: 2007, criticAvg: 97, vivinoScore: 4.6, priceUsd: 350 },
  { vintage: 2006, criticAvg: 95, vivinoScore: 4.5, priceUsd: 280 },
  { vintage: 2005, criticAvg: 94, vivinoScore: 4.5, priceUsd: 270 },
  { vintage: 2004, criticAvg: 93, vivinoScore: 4.4, priceUsd: 260 },
  { vintage: 2003, criticAvg: 92, vivinoScore: 4.3, priceUsd: 250 },
  { vintage: 2002, criticAvg: 96, vivinoScore: 4.6, priceUsd: 300 },
  { vintage: 2001, criticAvg: 94, vivinoScore: 4.5, priceUsd: 280 },
  { vintage: 2000, criticAvg: 93, vivinoScore: 4.4, priceUsd: 270 },
];

async function main() {
  console.log('🍷 Seeding Opus One vintages 2000-2019');
  console.log('='.repeat(50));

  // Get or create the producer
  let producer = await client.fetch(
    `*[_type == "producer" && name == "Opus One"][0]{ _id }`
  );

  if (!producer) {
    console.log('Creating Opus One producer...');
    const newProducer = await client.create({
      _type: 'producer',
      _id: 'producer-opus-one',
      name: 'Opus One',
      description: 'A legendary joint venture between Robert Mondavi and Baron Philippe de Rothschild, Opus One produces one of Napa Valley\'s most prestigious Bordeaux-style blends.',
      website: 'https://www.opusonewinery.com',
    });
    producer = { _id: newProducer._id };
  }

  // Get region reference
  const region = await client.fetch(
    `*[_type == "region" && name == "Napa Valley"][0]{ _id }`
  );

  if (!region) {
    console.error('❌ Napa Valley region not found.');
    process.exit(1);
  }

  console.log(`Producer ID: ${producer._id}`);
  console.log(`Region ID: ${region._id}\n`);

  let created = 0;
  let skipped = 0;

  for (const vintage of opusOneVintages) {
    const slug = `opus-one-${vintage.vintage}`;

    // Check if wine already exists
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
      _id: `wine-opus-one-${vintage.vintage}`,
      name: 'Opus One',
      slug: { _type: 'slug', current: slug },
      vintage: vintage.vintage,
      grapeVarieties: ['Cabernet Sauvignon', 'Merlot', 'Cabernet Franc', 'Petit Verdot', 'Malbec'],
      priceUsd: vintage.priceUsd,
      criticAvg: vintage.criticAvg,
      vivinoScore: vintage.vivinoScore,
      flavorMentions: [
        'Cassis',
        'Black Cherry',
        'Espresso',
        'Vanilla',
        'Cedar',
        'Tobacco',
        'Dark Chocolate',
      ],
      producer: { _type: 'reference', _ref: producer._id },
      region: { _type: 'reference', _ref: region._id },
      hasAiReview: false,
    };

    await client.createOrReplace(wineDoc);
    console.log(`✅ Created Opus One ${vintage.vintage} (Critic: ${vintage.criticAvg}, Vivino: ${vintage.vivinoScore})`);
    created++;
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Summary: ${created} created, ${skipped} skipped`);
  console.log('\nRun `npx tsx scripts/generate-reviews.ts --limit 25` to generate reviews.');
}

main().catch(console.error);
