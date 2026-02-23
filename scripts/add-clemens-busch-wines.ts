/**
 * Add Clemens Busch wines to Sanity (2017-2021)
 * Multiple SKUs across vintages
 */

import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@sanity/client';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function main() {
  console.log('🍷 Adding Clemens Busch Wines to Sanity');
  console.log('='.repeat(50));

  // Create producer
  const producerName = 'Clemens Busch';
  let producer = await sanityClient.fetch(
    `*[_type == "producer" && name == $name][0]`,
    { name: producerName }
  );

  if (!producer) {
    console.log(`Creating producer: ${producerName}`);
    producer = await sanityClient.create({
      _type: 'producer',
      name: producerName,
    });
    console.log(`✅ Producer created: ${producer._id}`);
  } else {
    console.log(`✅ Producer exists: ${producer._id}`);
  }

  // Get or create region (Mosel)
  let region = await sanityClient.fetch(
    `*[_type == "region" && name == "Mosel"][0]`
  );

  if (!region) {
    console.log('Creating region: Mosel');
    region = await sanityClient.create({
      _type: 'region',
      name: 'Mosel',
      country: 'Germany',
    });
    console.log(`✅ Region created: ${region._id}`);
  } else {
    console.log(`✅ Region exists: ${region._id}`);
  }

  // Define wines - multiple SKUs across vintages
  const wines = [
    // Marienburg Grosses Gewächs (GG) - Top dry Riesling
    { name: 'Marienburg Grosses Gewächs', grapes: ['Riesling'], price: 65 },

    // Marienburg Rothenpfad - Single vineyard
    { name: 'Marienburg Rothenpfad', grapes: ['Riesling'], price: 50 },

    // Marienburg Fahrlay - Another single vineyard
    { name: 'Marienburg Fahrlay', grapes: ['Riesling'], price: 50 },

    // Vom Roten Schiefer (From Red Slate) - Estate wine
    { name: 'Vom Roten Schiefer', grapes: ['Riesling'], price: 35 },

    // Pündericher Marienburg Kabinett
    { name: 'Pündericher Marienburg Kabinett', grapes: ['Riesling'], price: 30 },
  ];

  const vintages = [2017, 2018, 2019, 2020, 2021];

  let addedCount = 0;
  let skippedCount = 0;

  for (const wineInfo of wines) {
    for (const vintage of vintages) {
      // Check if wine already exists
      const existingWine = await sanityClient.fetch(
        `*[_type == "wine" && name == $name && vintage == $vintage && producer._ref == $producerId][0]`,
        { name: wineInfo.name, vintage, producerId: producer._id }
      );

      if (existingWine) {
        console.log(`⏭️  Already exists: ${producerName} ${wineInfo.name} ${vintage}`);
        skippedCount++;
        continue;
      }

      // Create wine
      const wine = {
        _type: 'wine',
        name: wineInfo.name,
        vintage: vintage,
        producer: {
          _type: 'reference',
          _ref: producer._id,
        },
        region: {
          _type: 'reference',
          _ref: region._id,
        },
        grapeVarieties: wineInfo.grapes,
        priceUsd: wineInfo.price,
        // Estimated scores
        criticAvg: 92,
        vivinoScore: 4.3,
        hasAiReview: false,
      };

      const created = await sanityClient.create(wine);
      console.log(`✅ Created: ${producerName} ${wineInfo.name} ${vintage} (${created._id})`);
      addedCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Complete!`);
  console.log(`   Added: ${addedCount} wines`);
  console.log(`   Skipped: ${skippedCount} (already exist)`);
  console.log('\nNext step: Generate reviews');
  console.log(`  npx tsx scripts/generate-reviews-v2.ts --limit ${addedCount}`);
}

main().catch(console.error);
