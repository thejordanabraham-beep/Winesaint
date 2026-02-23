/**
 * Add Jolie Laide Trousseau wines to Sanity (2015-2021)
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
  console.log('🍷 Adding Jolie Laide Trousseau Wines to Sanity');
  console.log('='.repeat(50));

  // First, create or get producer
  const producerName = 'Jolie Laide';
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

  // Get or create region (California)
  let region = await sanityClient.fetch(
    `*[_type == "region" && name == "California"][0]`
  );

  if (!region) {
    console.log('Creating region: California');
    region = await sanityClient.create({
      _type: 'region',
      name: 'California',
      country: 'United States',
    });
    console.log(`✅ Region created: ${region._id}`);
  } else {
    console.log(`✅ Region exists: ${region._id}`);
  }

  // Add wines for vintages 2015-2021
  const vintages = [2015, 2016, 2017, 2018, 2019, 2020, 2021];

  for (const vintage of vintages) {
    // Check if wine already exists
    const existingWine = await sanityClient.fetch(
      `*[_type == "wine" && name == $name && vintage == $vintage && producer._ref == $producerId][0]`,
      { name: 'Trousseau', vintage, producerId: producer._id }
    );

    if (existingWine) {
      console.log(`⏭️  Wine already exists: ${producerName} Trousseau ${vintage}`);
      continue;
    }

    // Create wine
    const wine = {
      _type: 'wine',
      name: 'Trousseau',
      vintage: vintage,
      producer: {
        _type: 'reference',
        _ref: producer._id,
      },
      region: {
        _type: 'reference',
        _ref: region._id,
      },
      grapeVarieties: ['Trousseau'],
      priceUsd: 35, // Estimated price
      // Add placeholder scores (will be updated by review generation)
      criticAvg: 90,
      vivinoScore: 4.2,
      hasAiReview: false,
    };

    const created = await sanityClient.create(wine);
    console.log(`✅ Created: ${producerName} Trousseau ${vintage} (${created._id})`);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ All wines added successfully!');
  console.log('\nNext step: Run review generation script');
  console.log('  npx tsx scripts/generate-reviews-v2.ts --limit 7');
}

main().catch(console.error);
