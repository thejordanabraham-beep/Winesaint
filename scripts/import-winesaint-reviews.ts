/**
 * WineSaint Master Review Importer
 *
 * Imports professional wine reviews from WINESAINT_MSTR_RVW.xlsx into Sanity
 *
 * Usage:
 *   npx tsx scripts/import-winesaint-reviews.ts --sheet Italy --limit 10 --dry-run
 *   npx tsx scripts/import-winesaint-reviews.ts --sheet California --limit 100
 *   npx tsx scripts/import-winesaint-reviews.ts --all
 */

import * as XLSX from 'xlsx';
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const EXCEL_FILE = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW.xlsx';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

interface WineRow {
  Producer: string;
  'Wine Name': string;
  Vintage: number;
  Score: number;
  'Color/Type': string;
  'Release Price': string;
  'Drinking Window': string;
  Reviewer: string;
  'Review Date': string;
  'Tasting Notes': string;
  'Grape Varieties': string;
  Region: string;
  Sanity_Wine_ID?: string;
  Sanity_Review_ID?: string;
  Import_Date?: string;
}

// Slugify helper
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 96);
}

// Parse drinking window
function parseDrinkingWindow(window: string): { start?: number; end?: number } {
  if (!window) return {};

  const match = window.match(/(\d{4})\s*-\s*(\d{4})/);
  if (match) {
    return {
      start: parseInt(match[1]),
      end: parseInt(match[2])
    };
  }
  return {};
}

// Parse price
function parsePrice(priceStr: string): number | null {
  if (!priceStr) return null;
  const match = priceStr.match(/\$?(\d+)/);
  return match ? parseInt(match[1]) : null;
}

// Parse review date to ISO format
function parseReviewDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];

  // "May 2025" -> "2025-05-01"
  const monthMap: { [key: string]: string } = {
    'january': '01', 'february': '02', 'march': '03', 'april': '04',
    'may': '05', 'june': '06', 'july': '07', 'august': '08',
    'september': '09', 'october': '10', 'november': '11', 'december': '12'
  };

  const match = dateStr.toLowerCase().match(/(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})/);
  if (match) {
    const month = monthMap[match[1]];
    const year = match[2];
    return `${year}-${month}-01`;
  }

  return new Date().toISOString().split('T')[0];
}

// Find or create producer
async function findOrCreateProducer(producerName: string): Promise<string> {
  const existing = await client.fetch(
    `*[_type == "producer" && name == $name][0]`,
    { name: producerName }
  );

  if (existing) {
    return existing._id;
  }

  console.log(`   📝 Creating producer: ${producerName}`);
  const newProducer = await client.create({
    _type: 'producer',
    name: producerName,
    slug: { current: slugify(producerName) },
  });

  return newProducer._id;
}

// Find or create region
async function findOrCreateRegion(regionSlug: string, country: string = 'Unknown'): Promise<string | null> {
  if (!regionSlug) return null;

  const existing = await client.fetch(
    `*[_type == "region" && slug.current == $slug][0]`,
    { slug: regionSlug }
  );

  if (existing) {
    return existing._id;
  }

  console.log(`   📝 Creating region: ${regionSlug}`);
  const regionName = regionSlug.split('-').map(w =>
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');

  const newRegion = await client.create({
    _type: 'region',
    name: regionName,
    slug: { current: regionSlug },
    country: country,
  });

  return newRegion._id;
}

// Import single wine
async function importWine(row: WineRow, dryRun: boolean = false): Promise<{ wineId?: string; reviewId?: string }> {
  const wineName = row['Wine Name'];
  const producerName = row.Producer;
  const vintage = row.Vintage;
  const score = row.Score;

  console.log(`\n🍷 ${producerName} - ${wineName} (${vintage}) - ${score}pts`);

  if (dryRun) {
    console.log('   [DRY RUN - No changes will be made]');
    return {};
  }

  try {
    // 1. Get or create producer
    const producerId = await findOrCreateProducer(producerName);

    // 2. Get or create region
    let regionId: string | null = null;
    if (row.Region) {
      regionId = await findOrCreateRegion(row.Region);
    }

    // 3. Parse grape varieties
    const grapeVarieties = row['Grape Varieties']
      ? row['Grape Varieties'].split(',').map(g => g.trim()).filter(g => g)
      : undefined;

    // 4. Create wine document
    const wineSlug = slugify(`${vintage} ${producerName} ${wineName}`);
    const price = parsePrice(row['Release Price']);

    const wineDoc: any = {
      _type: 'wine',
      name: wineName,
      slug: { current: wineSlug },
      vintage: vintage,
      producer: { _type: 'reference', _ref: producerId },
      grapeVarieties: grapeVarieties,
      criticAvg: score, // Store the score on wine document too
    };

    if (regionId) {
      wineDoc.region = { _type: 'reference', _ref: regionId };
    }

    if (price) {
      wineDoc.priceUsd = price;
    }

    console.log(`   📝 Creating wine document...`);
    const wine = await client.create(wineDoc);
    console.log(`   ✅ Wine created: ${wine._id}`);

    // 5. Create review document
    const { start, end } = parseDrinkingWindow(row['Drinking Window']);
    const reviewDate = parseReviewDate(row['Review Date']);

    const reviewDoc: any = {
      _type: 'review',
      wine: { _type: 'reference', _ref: wine._id },
      score: score,
      tastingNotes: row['Tasting Notes'],
      reviewerName: row.Reviewer,
      reviewDate: reviewDate,
      isAiGenerated: false,
    };

    if (start) reviewDoc.drinkingWindowStart = start;
    if (end) reviewDoc.drinkingWindowEnd = end;

    console.log(`   📝 Creating review document...`);
    const review = await client.create(reviewDoc);
    console.log(`   ✅ Review created: ${review._id}`);

    return {
      wineId: wine._id,
      reviewId: review._id,
    };

  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`);
    return {};
  }
}

// Main import function
async function importWines(options: {
  sheet: string;
  limit?: number;
  dryRun?: boolean;
  startRow?: number;
}) {
  console.log('\n🍷 WINESAINT MASTER REVIEW IMPORTER');
  console.log('='.repeat(70));
  console.log(`Sheet: ${options.sheet}`);
  console.log(`Limit: ${options.limit || 'ALL'}`);
  console.log(`Mode: ${options.dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Start row: ${options.startRow || 1}`);
  console.log('='.repeat(70));

  // Read Excel file
  const workbook = XLSX.readFile(EXCEL_FILE);

  if (!workbook.SheetNames.includes(options.sheet)) {
    console.error(`❌ Sheet "${options.sheet}" not found. Available: ${workbook.SheetNames.join(', ')}`);
    process.exit(1);
  }

  const worksheet = workbook.Sheets[options.sheet];
  const rows: WineRow[] = XLSX.utils.sheet_to_json(worksheet);

  console.log(`\n📊 Found ${rows.length} wines in ${options.sheet} sheet`);

  // Filter rows
  const startIdx = (options.startRow || 1) - 1;
  const endIdx = options.limit ? startIdx + options.limit : rows.length;
  const wineRows = rows.slice(startIdx, endIdx);

  console.log(`📋 Processing ${wineRows.length} wines (rows ${startIdx + 1}-${endIdx})\n`);

  let successCount = 0;
  let errorCount = 0;
  const results: Array<{ row: number; wineId?: string; reviewId?: string }> = [];

  for (let i = 0; i < wineRows.length; i++) {
    const row = wineRows[i];
    const rowNumber = startIdx + i + 2; // +2 for header and 0-index

    console.log(`\n[${i + 1}/${wineRows.length}] Row ${rowNumber}`);

    const result = await importWine(row, options.dryRun);

    if (result.wineId && result.reviewId) {
      successCount++;
      results.push({ row: rowNumber, ...result });
    } else {
      errorCount++;
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📊 Total processed: ${wineRows.length}`);

  if (!options.dryRun && results.length > 0) {
    console.log('\n📝 Updating Excel with Sanity IDs...');
    // TODO: Write back to Excel with IDs
    console.log('   (Excel update not yet implemented - IDs printed above)');
  }

  console.log('\n✅ Import complete!');
}

// Parse CLI arguments
const args = process.argv.slice(2);
const sheetIdx = args.indexOf('--sheet');
const limitIdx = args.indexOf('--limit');
const startIdx = args.indexOf('--start-row');
const dryRun = args.includes('--dry-run');
const all = args.includes('--all');

if (!all && sheetIdx === -1) {
  console.log('Usage:');
  console.log('  npx tsx scripts/import-winesaint-reviews.ts --sheet Italy --limit 10 --dry-run');
  console.log('  npx tsx scripts/import-winesaint-reviews.ts --sheet California --limit 100');
  console.log('  npx tsx scripts/import-winesaint-reviews.ts --all');
  console.log('\nOptions:');
  console.log('  --sheet <name>    Sheet to import (Italy, California, Austria)');
  console.log('  --limit <n>       Number of wines to import');
  console.log('  --start-row <n>   Start from row N (default: 1)');
  console.log('  --dry-run         Preview without making changes');
  console.log('  --all             Import all sheets');
  process.exit(0);
}

if (all) {
  // Import all sheets sequentially
  (async () => {
    for (const sheet of ['Italy', 'California', 'Austria']) {
      await importWines({ sheet, dryRun });
    }
  })();
} else {
  const sheet = args[sheetIdx + 1];
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) : undefined;
  const startRow = startIdx !== -1 ? parseInt(args[startIdx + 1]) : undefined;

  importWines({ sheet, limit, dryRun, startRow });
}
