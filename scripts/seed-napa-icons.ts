/**
 * Seed Iconic Napa Valley Wines
 *
 * Creates producers and wines for iconic Napa wineries,
 * fetches data from wine.com, then generates AI reviews.
 *
 * Usage: npx tsx scripts/seed-napa-icons.ts [--dry-run]
 */

import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@sanity/client';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PRODUCERS = [
  'Screaming Eagle',
  'Harlan Estate',
  'Opus One',
  'Dominus Estate',
  'BOND',
  'Scarecrow',
  'Colgin Cellars',
  'Hundred Acre',
  'Bryant Family Vineyard',
  'Dalla Valle Vineyards',
  'Promontory',
  'Schrader Cellars',
  'Realm Cellars',
  'Abreu Vineyards',
  'Eisele Vineyard Estate',
  'Joseph Phelps Vineyards',
  "Stag's Leap Wine Cellars",
  'Caymus Vineyards',
  'Far Niente',
  'Spottswoode',
  'Heitz Cellar',
  'Chateau Montelena',
  'Quintessa',
  'Duckhorn Vineyards',
  "Stags' Leap Winery",
  'Nickel & Nickel',
  'Grgich Hills Estate',
  'Pride Mountain Vineyards',
  'Corison Winery',
  'Diamond Creek Vineyards',
  'Dunn Vineyards',
  'Shafer Vineyards',
  'Peter Michael Winery',
  'Grace Family Vineyards',
  'Schramsberg Vineyards',
  'Castello di Amorosa',
  'Sterling Vineyards',
  'Hall Wines',
  'Alpha Omega Winery',
  'Louis M. Martini Winery',
  "Frog's Leap Winery",
  'St. Supéry Estate',
  'Artesa Vineyards',
  'Etude Wines',
  'Rombauer Vineyards',
  'Pine Ridge Vineyards',
  'Silverado Vineyards',
  'Cliff Lede Vineyards',
  'ZD Wines',
  'Raymond Vineyards',
  'Peju Province Winery',
  'Freemark Abbey',
  'Rutherford Hill Winery',
  'Cade Estate Winery',
  "O'Shaughnessy Estate Winery",
  'Ladera Vineyards',
  'Chappellet Winery',
  'Honig Vineyard & Winery',
  'Round Pond Estate',
  'Sequoia Grove Winery',
  'Merryvale Vineyards',
  'Markham Vineyards',
  'Whitehall Lane Winery',
  'Flora Springs Winery',
  'Darioush',
  'Swanson Vineyards',
  'Frank Family Vineyards',
  'Bennett Lane Winery',
  'Tamber Bey Vineyards',
  'Vincent Arroyo Winery',
  'Baldacci Family Vineyards',
  'Reynolds Family Winery',
  'Crocker & Starr',
  'Elizabeth Spencer Wines',
  'Robert Sinskey Vineyards',
];

const VINTAGES = [2015, 2016, 2017, 2018, 2019, 2020];

// Wine data fetched from wine.com
interface WineComData {
  name: string;
  price: number;
  rating: number;
  description: string;
  grapes: string[];
}

async function searchWineCom(producer: string, vintage: number): Promise<WineComData | null> {
  try {
    const searchQuery = encodeURIComponent(`${producer} ${vintage} Cabernet`);
    const searchUrl = `https://www.wine.com/search/${searchQuery}/1`;

    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) return null;

    const html = await response.text();

    // Extract first product
    const productMatch = html.match(/href="(\/product\/[^"]+)"/);
    if (!productMatch) return null;

    const productUrl = `https://www.wine.com${productMatch[1]}`;
    const productResponse = await fetch(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    if (!productResponse.ok) return null;

    const productHtml = await productResponse.text();

    // Extract price
    const priceMatch = productHtml.match(/\$(\d+(?:\.\d{2})?)/);
    const price = priceMatch ? parseFloat(priceMatch[1]) : 75;

    // Extract rating (out of 100)
    const ratingMatch = productHtml.match(/(\d{2,3})\s*(?:points?|pts)/i);
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : 90;

    // Extract wine name
    const nameMatch = productHtml.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const name = nameMatch ? nameMatch[1].trim() : `${producer} Cabernet Sauvignon`;

    return {
      name,
      price,
      rating,
      description: '',
      grapes: ['Cabernet Sauvignon'],
    };
  } catch {
    return null;
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  console.log('🍷 Seeding Iconic Napa Valley Wines');
  console.log('====================================');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Producers: ${PRODUCERS.length}`);
  console.log(`Vintages: ${VINTAGES.join(', ')}`);
  console.log(`Total wines to create: ${PRODUCERS.length * VINTAGES.length}`);
  console.log();

  if (!process.env.SANITY_API_TOKEN && !dryRun) {
    console.error('❌ SANITY_API_TOKEN required for live mode');
    process.exit(1);
  }

  const sanityClient = createClient({
    projectId: process.env.SANITY_PROJECT_ID!,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
  });

  // Get or create Napa Valley region
  let napaRegionId: string;
  const existingNapa = await sanityClient.fetch(
    `*[_type == "region" && name == "Napa Valley"][0]._id`
  );

  if (existingNapa) {
    napaRegionId = existingNapa;
    console.log('✓ Found existing Napa Valley region');
  } else if (!dryRun) {
    const napaRegion = await sanityClient.create({
      _type: 'region',
      name: 'Napa Valley',
      country: 'USA',
      slug: { current: 'napa-valley' },
    });
    napaRegionId = napaRegion._id;
    console.log('✓ Created Napa Valley region');
  } else {
    napaRegionId = 'dry-run-napa-id';
    console.log('[DRY RUN] Would create Napa Valley region');
  }

  let producersCreated = 0;
  let winesCreated = 0;
  let winesSkipped = 0;

  for (const producerName of PRODUCERS) {
    console.log(`\n📍 ${producerName}`);

    // Get or create producer
    let producerId: string;
    const existingProducer = await sanityClient.fetch(
      `*[_type == "producer" && name == $name][0]._id`,
      { name: producerName }
    );

    if (existingProducer) {
      producerId = existingProducer;
      console.log('   ✓ Producer exists');
    } else if (!dryRun) {
      const producer = await sanityClient.create({
        _type: 'producer',
        name: producerName,
        slug: { current: slugify(producerName) },
        region: { _type: 'reference', _ref: napaRegionId },
      });
      producerId = producer._id;
      producersCreated++;
      console.log('   ✓ Created producer');
    } else {
      producerId = `dry-run-${slugify(producerName)}`;
      producersCreated++;
      console.log('   [DRY RUN] Would create producer');
    }

    // Create wines for each vintage
    for (const vintage of VINTAGES) {
      // Check if wine exists
      const existingWine = await sanityClient.fetch(
        `*[_type == "wine" && producer._ref == $producerId && vintage == $vintage][0]._id`,
        { producerId, vintage }
      );

      if (existingWine) {
        winesSkipped++;
        continue;
      }

      // Fetch data from wine.com (with rate limiting)
      console.log(`   Fetching ${vintage}...`);
      const wineData = await searchWineCom(producerName, vintage);
      await new Promise(r => setTimeout(r, 500)); // Rate limit

      const wineName = wineData?.name || `${producerName} Cabernet Sauvignon`;
      const price = wineData?.price || 100;
      const rating = wineData?.rating || 92;

      if (!dryRun) {
        await sanityClient.create({
          _type: 'wine',
          name: wineName,
          slug: { current: `${slugify(producerName)}-${vintage}` },
          vintage,
          producer: { _type: 'reference', _ref: producerId },
          region: { _type: 'reference', _ref: napaRegionId },
          grapeVarieties: ['Cabernet Sauvignon'],
          priceUsd: price,
          criticAvg: rating,
          vivinoScore: 4.2 + (rating - 90) * 0.05, // Estimate Vivino from critic score
          hasAiReview: false,
        });
        winesCreated++;
        console.log(`   ✓ ${vintage}: $${price}, ${rating}pts`);
      } else {
        winesCreated++;
        console.log(`   [DRY RUN] Would create ${vintage}: $${price}, ${rating}pts`);
      }
    }
  }

  console.log('\n====================================');
  console.log('📊 Summary');
  console.log('====================================');
  console.log(`Producers created: ${producersCreated}`);
  console.log(`Wines created: ${winesCreated}`);
  console.log(`Wines skipped (existing): ${winesSkipped}`);
  console.log();

  if (!dryRun) {
    console.log('✅ Seeding complete!');
    console.log('Now run: npx tsx scripts/generate-reviews.ts --limit 500');
  } else {
    console.log('[DRY RUN] No changes made.');
    console.log('Run without --dry-run to create wines.');
  }
}

main().catch(console.error);
