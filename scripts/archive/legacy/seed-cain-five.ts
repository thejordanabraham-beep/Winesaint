/**
 * Seed Cain Five vintages 2010-2018
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

// Cain Five vintage data (2010-2018)
const cainFiveVintages = [
  { vintage: 2018, criticAvg: 94, vivinoScore: 4.4, priceUsd: 135 },
  { vintage: 2017, criticAvg: 93, vivinoScore: 4.3, priceUsd: 130 },
  { vintage: 2016, criticAvg: 95, vivinoScore: 4.5, priceUsd: 140 },
  { vintage: 2015, criticAvg: 96, vivinoScore: 4.5, priceUsd: 145 },
  { vintage: 2014, criticAvg: 93, vivinoScore: 4.3, priceUsd: 125 },
  { vintage: 2013, criticAvg: 94, vivinoScore: 4.4, priceUsd: 120 },
  { vintage: 2012, criticAvg: 95, vivinoScore: 4.4, priceUsd: 130 },
  { vintage: 2011, criticAvg: 91, vivinoScore: 4.2, priceUsd: 110 },
  { vintage: 2010, criticAvg: 94, vivinoScore: 4.4, priceUsd: 125 },
];

async function main() {
  console.log('Seeding Cain Five vintages 2010-2018');

  // Get or create Napa Valley region
  let region = await client.fetch(
    `*[_type == "region" && name == "Napa Valley"][0]{ _id }`
  );

  if (!region) {
    console.log('Creating Napa Valley region...');
    const newRegion = await client.create({
      _type: 'region',
      _id: 'region-napa-valley',
      name: 'Napa Valley',
      country: 'USA',
    });
    region = { _id: newRegion._id };
  }

  // Get or create Cain producer
  let producer = await client.fetch(
    `*[_type == "producer" && name == "Cain Vineyard & Winery"][0]{ _id }`
  );

  if (!producer) {
    console.log('Creating Cain Vineyard & Winery producer...');
    const newProducer = await client.create({
      _type: 'producer',
      _id: 'producer-cain',
      name: 'Cain Vineyard & Winery',
      description: 'Estate winery on Spring Mountain in Napa Valley, known for Cain Five, a Bordeaux-style blend of the five classic varieties.',
      website: 'https://www.cainfive.com',
    });
    producer = { _id: newProducer._id };
  }

  let created = 0;
  let skipped = 0;

  for (const vintage of cainFiveVintages) {
    const slug = `cain-five-${vintage.vintage}`;

    const existing = await client.fetch(
      `*[_type == "wine" && slug.current == $slug][0]{ _id }`,
      { slug }
    );

    if (existing) {
      console.log(`Skipping ${vintage.vintage} - exists`);
      skipped++;
      continue;
    }

    const wineDoc = {
      _type: 'wine',
      _id: `wine-cain-five-${vintage.vintage}`,
      name: 'Cain Five',
      slug: { _type: 'slug', current: slug },
      vintage: vintage.vintage,
      grapeVarieties: ['Cabernet Sauvignon', 'Merlot', 'Cabernet Franc', 'Petit Verdot', 'Malbec'],
      priceUsd: vintage.priceUsd,
      criticAvg: vintage.criticAvg,
      vivinoScore: vintage.vivinoScore,
      flavorMentions: ['Cedar', 'Graphite', 'Blackcurrant', 'Dark Plum', 'Herbs', 'Leather'],
      producer: { _type: 'reference', _ref: producer._id },
      region: { _type: 'reference', _ref: region._id },
      hasAiReview: false,
    };

    await client.createOrReplace(wineDoc);
    console.log(`Created Cain Five ${vintage.vintage}`);
    created++;
  }

  console.log(`Done: ${created} created, ${skipped} skipped`);
}

main().catch(console.error);
