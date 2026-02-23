/**
 * Seed Sample Wine Data
 *
 * This script populates Sanity with sample wines for testing the review generator.
 *
 * Usage: npx tsx scripts/seed-sample-data.ts
 *
 * Environment variables required:
 * - SANITY_PROJECT_ID: Your Sanity project ID
 * - SANITY_DATASET: Your Sanity dataset (default: production)
 * - SANITY_API_TOKEN: Sanity API token with write access
 */

import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@sanity/client';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('🌱 Seeding Sample Wine Data');
  console.log('===========================\n');

  // Validate environment variables
  if (!process.env.SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing required environment variables:');
    console.error('   - SANITY_PROJECT_ID');
    console.error('   - SANITY_API_TOKEN');
    console.error('\nSet these in your .env.local file.');
    process.exit(1);
  }

  const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
  });

  // Sample Regions
  const regions = [
    {
      _type: 'region',
      _id: 'region-bordeaux',
      name: 'Bordeaux',
      slug: { _type: 'slug', current: 'bordeaux' },
      country: 'France',
      description: 'One of the most famous wine regions in the world, known for its prestigious red blends.',
    },
    {
      _type: 'region',
      _id: 'region-burgundy',
      name: 'Burgundy',
      slug: { _type: 'slug', current: 'burgundy' },
      country: 'France',
      description: 'Home to some of the finest Pinot Noir and Chardonnay in the world.',
    },
    {
      _type: 'region',
      _id: 'region-napa',
      name: 'Napa Valley',
      slug: { _type: 'slug', current: 'napa-valley' },
      country: 'USA',
      description: 'California\'s premier wine region, famous for world-class Cabernet Sauvignon.',
    },
    {
      _type: 'region',
      _id: 'region-tuscany',
      name: 'Tuscany',
      slug: { _type: 'slug', current: 'tuscany' },
      country: 'Italy',
      description: 'Italy\'s most celebrated wine region, home to Chianti and Super Tuscans.',
    },
    {
      _type: 'region',
      _id: 'region-rioja',
      name: 'Rioja',
      slug: { _type: 'slug', current: 'rioja' },
      country: 'Spain',
      description: 'Spain\'s most famous wine region, known for age-worthy Tempranillo.',
    },
  ];

  // Sample Producers
  const producers = [
    {
      _type: 'producer',
      _id: 'producer-margaux',
      name: 'Château Margaux',
      slug: { _type: 'slug', current: 'chateau-margaux' },
      region: { _type: 'reference', _ref: 'region-bordeaux' },
      description: 'First Growth Bordeaux estate producing legendary wines since the 16th century.',
    },
    {
      _type: 'producer',
      _id: 'producer-drc',
      name: 'Domaine de la Romanée-Conti',
      slug: { _type: 'slug', current: 'domaine-romanee-conti' },
      region: { _type: 'reference', _ref: 'region-burgundy' },
      description: 'The most prestigious estate in Burgundy, producing some of the rarest wines on Earth.',
    },
    {
      _type: 'producer',
      _id: 'producer-opus',
      name: 'Opus One',
      slug: { _type: 'slug', current: 'opus-one' },
      region: { _type: 'reference', _ref: 'region-napa' },
      description: 'Iconic Napa Valley winery, a joint venture between Robert Mondavi and Baron Philippe de Rothschild.',
    },
    {
      _type: 'producer',
      _id: 'producer-antinori',
      name: 'Marchesi Antinori',
      slug: { _type: 'slug', current: 'antinori' },
      region: { _type: 'reference', _ref: 'region-tuscany' },
      description: 'One of Italy\'s oldest wine dynasties, producing wine for over 600 years.',
    },
    {
      _type: 'producer',
      _id: 'producer-muga',
      name: 'Bodegas Muga',
      slug: { _type: 'slug', current: 'bodegas-muga' },
      region: { _type: 'reference', _ref: 'region-rioja' },
      description: 'Traditional Rioja producer known for exceptional oak-aged wines.',
    },
    {
      _type: 'producer',
      _id: 'producer-caymus',
      name: 'Caymus Vineyards',
      slug: { _type: 'slug', current: 'caymus-vineyards' },
      region: { _type: 'reference', _ref: 'region-napa' },
      description: 'Napa Valley producer famous for rich, opulent Cabernet Sauvignon.',
    },
    {
      _type: 'producer',
      _id: 'producer-sassicaia',
      name: 'Tenuta San Guido',
      slug: { _type: 'slug', current: 'tenuta-san-guido' },
      region: { _type: 'reference', _ref: 'region-tuscany' },
      description: 'Producer of Sassicaia, the original and most famous Super Tuscan.',
    },
  ];

  // Sample Wines with critic scores and Vivino data for testing
  const wines = [
    {
      _type: 'wine',
      _id: 'wine-margaux-2019',
      name: 'Château Margaux',
      slug: { _type: 'slug', current: 'chateau-margaux-2019' },
      producer: { _type: 'reference', _ref: 'producer-margaux' },
      region: { _type: 'reference', _ref: 'region-bordeaux' },
      appellation: 'Margaux',
      grapeVarieties: ['Cabernet Sauvignon', 'Merlot', 'Petit Verdot', 'Cabernet Franc'],
      vintage: 2019,
      priceUsd: 850,
      priceRange: 'luxury',
      alcoholPercentage: 13.5,
      criticAvg: 98,
      vivinoScore: 4.7,
      flavorMentions: ['blackcurrant', 'violet', 'graphite', 'cedar', 'silk', 'mineral'],
      hasAiReview: false,
    },
    {
      _type: 'wine',
      _id: 'wine-opus-2020',
      name: 'Opus One',
      slug: { _type: 'slug', current: 'opus-one-2020' },
      producer: { _type: 'reference', _ref: 'producer-opus' },
      region: { _type: 'reference', _ref: 'region-napa' },
      appellation: 'Oakville',
      grapeVarieties: ['Cabernet Sauvignon', 'Merlot', 'Cabernet Franc', 'Petit Verdot', 'Malbec'],
      vintage: 2020,
      priceUsd: 450,
      priceRange: 'luxury',
      alcoholPercentage: 14.5,
      criticAvg: 96,
      vivinoScore: 4.5,
      flavorMentions: ['cassis', 'dark cherry', 'espresso', 'vanilla', 'tobacco', 'leather'],
      hasAiReview: false,
    },
    {
      _type: 'wine',
      _id: 'wine-sassicaia-2019',
      name: 'Sassicaia',
      slug: { _type: 'slug', current: 'sassicaia-2019' },
      producer: { _type: 'reference', _ref: 'producer-sassicaia' },
      region: { _type: 'reference', _ref: 'region-tuscany' },
      appellation: 'Bolgheri Sassicaia',
      grapeVarieties: ['Cabernet Sauvignon', 'Cabernet Franc'],
      vintage: 2019,
      priceUsd: 280,
      priceRange: 'premium',
      alcoholPercentage: 14,
      criticAvg: 97,
      vivinoScore: 4.6,
      flavorMentions: ['black cherry', 'mediterranean herbs', 'pencil shavings', 'licorice', 'iron'],
      hasAiReview: false,
    },
    {
      _type: 'wine',
      _id: 'wine-tignanello-2020',
      name: 'Tignanello',
      slug: { _type: 'slug', current: 'tignanello-2020' },
      producer: { _type: 'reference', _ref: 'producer-antinori' },
      region: { _type: 'reference', _ref: 'region-tuscany' },
      appellation: 'Toscana IGT',
      grapeVarieties: ['Sangiovese', 'Cabernet Sauvignon', 'Cabernet Franc'],
      vintage: 2020,
      priceUsd: 120,
      priceRange: 'premium',
      alcoholPercentage: 14,
      criticAvg: 94,
      vivinoScore: 4.4,
      flavorMentions: ['cherry', 'plum', 'spice', 'tobacco', 'earth', 'dried herbs'],
      hasAiReview: false,
    },
    {
      _type: 'wine',
      _id: 'wine-muga-reserva-2019',
      name: 'Muga Reserva',
      slug: { _type: 'slug', current: 'muga-reserva-2019' },
      producer: { _type: 'reference', _ref: 'producer-muga' },
      region: { _type: 'reference', _ref: 'region-rioja' },
      appellation: 'Rioja',
      grapeVarieties: ['Tempranillo', 'Garnacha', 'Mazuelo', 'Graciano'],
      vintage: 2019,
      priceUsd: 28,
      priceRange: 'mid-range',
      alcoholPercentage: 14,
      criticAvg: 92,
      vivinoScore: 4.2,
      flavorMentions: ['red fruit', 'vanilla', 'coconut', 'baking spices', 'leather', 'smoke'],
      hasAiReview: false,
    },
    {
      _type: 'wine',
      _id: 'wine-caymus-special-2020',
      name: 'Caymus Special Selection',
      slug: { _type: 'slug', current: 'caymus-special-selection-2020' },
      producer: { _type: 'reference', _ref: 'producer-caymus' },
      region: { _type: 'reference', _ref: 'region-napa' },
      appellation: 'Napa Valley',
      grapeVarieties: ['Cabernet Sauvignon'],
      vintage: 2020,
      priceUsd: 200,
      priceRange: 'premium',
      alcoholPercentage: 15.2,
      criticAvg: 93,
      vivinoScore: 4.5,
      flavorMentions: ['blackberry', 'chocolate', 'coffee', 'oak', 'caramel', 'ripe fruit'],
      hasAiReview: false,
    },
    {
      _type: 'wine',
      _id: 'wine-drc-echezeaux-2018',
      name: 'Échézeaux Grand Cru',
      slug: { _type: 'slug', current: 'drc-echezeaux-2018' },
      producer: { _type: 'reference', _ref: 'producer-drc' },
      region: { _type: 'reference', _ref: 'region-burgundy' },
      appellation: 'Échézeaux',
      grapeVarieties: ['Pinot Noir'],
      vintage: 2018,
      priceUsd: 1500,
      priceRange: 'luxury',
      alcoholPercentage: 13,
      criticAvg: 96,
      vivinoScore: 4.6,
      flavorMentions: ['red cherry', 'rose petal', 'exotic spice', 'forest floor', 'silk', 'ethereal'],
      hasAiReview: false,
    },
    {
      _type: 'wine',
      _id: 'wine-muga-prado-enea-2016',
      name: 'Prado Enea Gran Reserva',
      slug: { _type: 'slug', current: 'prado-enea-gran-reserva-2016' },
      producer: { _type: 'reference', _ref: 'producer-muga' },
      region: { _type: 'reference', _ref: 'region-rioja' },
      appellation: 'Rioja',
      grapeVarieties: ['Tempranillo', 'Garnacha', 'Mazuelo', 'Graciano'],
      vintage: 2016,
      priceUsd: 75,
      priceRange: 'premium',
      alcoholPercentage: 14,
      criticAvg: 95,
      vivinoScore: 4.4,
      flavorMentions: ['dried cherry', 'fig', 'tobacco', 'cedar', 'vanilla', 'dried flowers'],
      hasAiReview: false,
    },
  ];

  // Create documents
  console.log('📍 Creating regions...');
  for (const region of regions) {
    try {
      await client.createOrReplace(region);
      console.log(`   ✅ ${region.name}`);
    } catch (error: any) {
      console.log(`   ⚠️ ${region.name}: ${error.message}`);
    }
  }

  console.log('\n🏭 Creating producers...');
  for (const producer of producers) {
    try {
      await client.createOrReplace(producer);
      console.log(`   ✅ ${producer.name}`);
    } catch (error: any) {
      console.log(`   ⚠️ ${producer.name}: ${error.message}`);
    }
  }

  console.log('\n🍷 Creating wines...');
  for (const wine of wines) {
    try {
      await client.createOrReplace(wine);
      console.log(`   ✅ ${wine.name} ${wine.vintage}`);
    } catch (error: any) {
      console.log(`   ⚠️ ${wine.name}: ${error.message}`);
    }
  }

  console.log('\n===========================');
  console.log('✅ Seeding complete!');
  console.log(`   ${regions.length} regions`);
  console.log(`   ${producers.length} producers`);
  console.log(`   ${wines.length} wines`);
  console.log('\nYou can now run: npm run generate-reviews');
}

main().catch(console.error);
