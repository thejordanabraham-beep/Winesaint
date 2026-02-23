/**
 * Excel Wine List Importer with François RAG Integration
 *
 * Pipeline:
 * 1. Read Excel wine list
 * 2. Extract wine data (producer, vintage, region, notes, score)
 * 3. Import wine into Sanity (create producer, region refs)
 * 4. Query François for educational context
 * 5. Generate AI review combining personal notes + François knowledge
 * 6. Publish to WineSaint
 *
 * Usage:
 *   npx tsx scripts/import-from-excel.ts [--limit N] [--dry-run] [--start-row N]
 */

import * as XLSX from 'xlsx';
import dotenv from 'dotenv';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@sanity/client';
import { getReferenceNotes } from './lib/reference-sources';

// Load environment
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const EXCEL_FILE = '/Users/jordanabraham/Desktop/Master Drink Note Sheet.xlsx';

interface ExcelWineRow {
  producer: string;  // Column B: Full wine name
  region: string;    // Column C
  country: string;   // Column D
  vintage: number;   // Column E
  price: number;     // Column F
  description: string; // Column G: Personal tasting notes
  score: string | number; // Column H: 0-10 scale
  situation: string; // Column I
  drinkingWindow: string; // Column J
}

interface ParsedWine {
  fullName: string;
  producerName: string;
  wineName: string;
  vintage: number;
  region: string;
  country: string;
  price: number;
  personalNotes: string;
  score: number;
  context: string;
}

// Parse wine name to extract components
function parseWineName(fullText: string): { producer: string; wineName: string } {
  // Try to split on newlines first (producer on first line)
  const lines = fullText.split(/[\r\n]+/).map(l => l.trim()).filter(l => l);

  if (lines.length >= 2) {
    return {
      producer: lines[0],
      wineName: lines.slice(1).join(' ')
    };
  }

  // Fallback: assume everything is wine name
  return {
    producer: lines[0] || fullText,
    wineName: fullText
  };
}

// Parse score (handle strings like "7.4" or "6.8\nPrice: - 1.0\nAdjusted: 5.8")
function parseScore(scoreText: any): number {
  if (typeof scoreText === 'number') return scoreText;
  if (!scoreText) return 0;

  const str = String(scoreText);
  // Look for first decimal number
  const match = str.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 0;
}

// Convert 0-10 score to 100-point scale
function scoreTo100(score: number): number {
  // 0-10 scale to 100-point (rough conversion)
  return Math.round(score * 10 + 10);
}

// Read Excel file
function readExcelWines(filePath: string, startRow: number = 2, limit?: number): ParsedWine[] {
  console.log(`📊 Reading Excel file: ${filePath}`);

  const workbook = XLSX.readFile(filePath);
  const sheetName = 'WINE';
  const worksheet = workbook.Sheets[sheetName];
  const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  console.log(`   Total rows: ${data.length}`);
  console.log(`   Starting from row: ${startRow}`);

  const wines: ParsedWine[] = [];
  const endRow = limit ? Math.min(startRow + limit, data.length) : data.length;

  for (let i = startRow - 1; i < endRow; i++) {
    const row = data[i];
    if (!row || !row[1]) continue; // Skip empty rows

    const producerText = row[1] || '';
    const { producer, wineName } = parseWineName(producerText);

    const region = row[2] || '';
    const country = row[3] || '';
    const vintage = typeof row[4] === 'number' ? row[4] : 0;
    const price = typeof row[5] === 'number' ? row[5] : 0;
    const description = row[6] || '';
    const score = parseScore(row[7]);
    const situation = row[8] || '';
    const drinkingWindow = row[9] || '';

    // Skip if missing critical data
    if (!producer || vintage === 0 || score === 0) {
      console.log(`   ⚠️  Skipping row ${i + 1}: Missing data`);
      continue;
    }

    wines.push({
      fullName: producerText,
      producerName: producer,
      wineName: wineName || producer,
      vintage,
      region,
      country,
      price,
      personalNotes: description,
      score,
      context: [situation, drinkingWindow].filter(Boolean).join('\\n\\n')
    });
  }

  console.log(`   ✅ Parsed ${wines.length} wines\\n`);
  return wines;
}

// Find or create producer in Sanity
async function findOrCreateProducer(sanityClient: any, producerName: string): Promise<string> {
  const existing = await sanityClient.fetch(
    `*[_type == "producer" && name == $name][0]`,
    { name: producerName }
  );

  if (existing) {
    return existing._id;
  }

  const newProducer = await sanityClient.create({
    _type: 'producer',
    name: producerName,
    slug: {
      current: producerName
        .toLowerCase()
        .replace(/^(domaine|château|weingut|estate)\\s+/i, '')
        .replace(/[\\s\\r\\n]+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .substring(0, 96)
    },
  });

  console.log(`     ✅ Created producer: ${producerName}`);
  return newProducer._id;
}

// Find or create region in Sanity
async function findOrCreateRegion(sanityClient: any, regionName: string, country: string): Promise<string> {
  const existing = await sanityClient.fetch(
    `*[_type == "region" && name == $name][0]`,
    { name: regionName }
  );

  if (existing) {
    return existing._id;
  }

  const newRegion = await sanityClient.create({
    _type: 'region',
    name: regionName,
    country: country || 'Unknown',
    slug: { current: regionName.toLowerCase().replace(/[\\s\\r\\n]+/g, '-').replace(/[^a-z0-9-]/g, '') },
  });

  console.log(`     ✅ Created region: ${regionName}`);
  return newRegion._id;
}

// Generate review using François + personal notes
async function generateReview(
  anthropic: Anthropic,
  wine: ParsedWine,
  francoisContext: string
): Promise<string> {

  const score100 = scoreTo100(wine.score);

  const prompt = `You are a sophisticated wine critic writing a review for WineSaint.

WINE:
${wine.fullName}
Vintage: ${wine.vintage}
Region: ${wine.region}, ${wine.country}
Score: ${wine.score}/10 (${score100}/100)

PERSONAL TASTING NOTES (from sommelier):
${wine.personalNotes}

EDUCATIONAL CONTEXT (from François RAG):
${francoisContext}

Write a professional wine review that:
1. Incorporates the personal tasting notes naturally
2. Adds educational context about the producer, region, or style from François
3. Is 100-150 words
4. Maintains an academic yet accessible tone
5. Uses specific wine terminology
6. Does NOT repeat the score (it will be displayed separately)

Review:`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 500,
    temperature: 0.7,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  const review = message.content[0].type === 'text' ? message.content[0].text : '';
  return review.trim();
}

async function main() {
  const args = process.argv.slice(2);
  const limitIndex = args.indexOf('--limit');
  const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : undefined;
  const startIndex = args.indexOf('--start-row');
  const startRow = startIndex !== -1 ? parseInt(args[startIndex + 1], 10) : 2;
  const dryRun = args.includes('--dry-run');

  console.log('🍷 Excel Wine List Importer + François RAG');
  console.log('=' .repeat(60));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Start row: ${startRow}`);
  console.log(`Limit: ${limit || 'ALL'}\\n`);

  // Validate environment
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY required');
    process.exit(1);
  }
  if (!dryRun && !process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN required for live mode');
    process.exit(1);
  }

  // Initialize clients
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const sanityClient = createClient({
    projectId: process.env.SANITY_PROJECT_ID!,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
  });

  // Read Excel
  const wines = readExcelWines(EXCEL_FILE, startRow, limit);

  if (wines.length === 0) {
    console.log('❌ No wines found in Excel');
    process.exit(1);
  }

  console.log(`📋 Processing ${wines.length} wines...\\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const [index, wine] of wines.entries()) {
    console.log(`[${index + 1}/${wines.length}] ${wine.fullName}`);

    try {
      // 1. Query François for context
      console.log('  🤖 Querying François RAG...');
      const francoisContext = await getReferenceNotes(
        wine.producerName,
        wine.region,
        wine.wineName.split(/[\\s\\r\\n]+/).filter(w => w.length > 3)
      );

      if (francoisContext.length === 0) {
        console.log('     ⚠️  No François context found');
      } else {
        console.log(`     ✅ Found ${francoisContext.length} context chunks`);
      }

      // 2. Generate review
      console.log('  ✍️  Generating review...');
      const contextText = francoisContext.map(c => c.text).join('\\n\\n');
      const review = await generateReview(anthropic, wine, contextText);
      console.log(`     ✅ Generated ${review.length} char review`);

      if (dryRun) {
        console.log('\\n     --- PREVIEW ---');
        console.log(`     ${review.substring(0, 200)}...`);
        console.log('     --- END ---\\n');
        successCount++;
        continue;
      }

      // 3. Import to Sanity
      console.log('  📝 Importing to Sanity...');

      // Find/create references
      const producerId = await findOrCreateProducer(sanityClient, wine.producerName);
      const regionId = wine.region ? await findOrCreateRegion(sanityClient, wine.region, wine.country) : null;

      // Create wine document
      const score100 = scoreTo100(wine.score);

      const wineDoc: any = {
        _type: 'wine',
        name: wine.fullName,
        slug: {
          current: wine.fullName
            .toLowerCase()
            .replace(/[\\s\\r\\n]+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .substring(0, 96)
        },
        vintage: wine.vintage,
        producer: { _type: 'reference', _ref: producerId },
        priceUsd: wine.price > 0 ? wine.price : null,
        criticAvg: score100,
        hasAiReview: true,
        aiReview: review,
        personalNotes: wine.personalNotes, // Store original notes
      };

      if (regionId) {
        wineDoc.region = { _type: 'reference', _ref: regionId };
      }

      const result = await sanityClient.create(wineDoc);

      console.log(`     ✅ Created wine: ${result._id}`);
      console.log(`     🌐 URL: https://winesaint.com/wines/${result.slug.current}\\n`);

      successCount++;

    } catch (error: any) {
      console.error(`     ❌ Error: ${error.message}\\n`);
      errorCount++;
    }
  }

  // Summary
  console.log('='.repeat(60));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📊 Total: ${wines.length}`);
}

main()
  .then(() => {
    console.log('\\n✅ Import complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\\n❌ Import failed:', error);
    process.exit(1);
  });
