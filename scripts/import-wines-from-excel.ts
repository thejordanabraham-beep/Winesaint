/**
 * WINE IMPORT FROM EXCEL
 *
 * Production-ready script to import wines and reviews from Excel spreadsheet
 *
 * FEATURES:
 * - Randomized score conversion (100-point → 1-10 scale)
 * - François RAG integration for review context
 * - WineSaint academic voice review generation
 * - Automatic region determination for blank regions
 * - Wine type/color import
 * - Drinking window parsing
 * - Producer and region auto-creation
 *
 * USAGE:
 *   npx tsx scripts/import-wines-from-excel.ts [options]
 *
 * OPTIONS:
 *   --sheets <names>    Comma-separated sheet names (default: "Austria,California,Italy")
 *   --limit <number>    Max wines per sheet (default: all)
 *   --offset <number>   Skip first N wines per sheet (default: 0)
 *   --delay <ms>        Delay between imports in ms (default: 1000)
 *
 * EXAMPLES:
 *   # Import all wines from all sheets
 *   npx tsx scripts/import-wines-from-excel.ts
 *
 *   # Import first 50 wines from California only
 *   npx tsx scripts/import-wines-from-excel.ts --sheets California --limit 50
 *
 *   # Import wines 100-200 from Austria
 *   npx tsx scripts/import-wines-from-excel.ts --sheets Austria --offset 100 --limit 100
 *
 *   # Import all with faster processing (500ms delay)
 *   npx tsx scripts/import-wines-from-excel.ts --delay 500
 */

import * as XLSX from 'xlsx';
import { createClient } from '@sanity/client';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Parse command-line arguments
const args = process.argv.slice(2);
const getArg = (name: string, defaultValue: string = '') => {
  const index = args.indexOf(name);
  return index !== -1 && args[index + 1] ? args[index + 1] : defaultValue;
};

const EXCEL_FILE = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW.xlsx';
const SHEETS = getArg('--sheets', 'Austria,California,Italy').split(',').map(s => s.trim());
const LIMIT = getArg('--limit') ? parseInt(getArg('--limit')) : null;
const OFFSET = getArg('--offset') ? parseInt(getArg('--offset')) : 0;
const DELAY = getArg('--delay') ? parseInt(getArg('--delay')) : 1000;

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Score conversion table with ranges
const SCORE_CONVERSION: Record<number, [number, number]> = {
  100: [9.8, 10.0],
  99: [9.5, 9.7],
  98: [9.3, 9.5],
  97: [9.1, 9.3],
  96: [8.5, 9.0],
  95: [8.1, 8.5],
  94: [8.0, 8.0],
  93: [7.7, 7.9],
  92: [7.5, 7.6],
  91: [7.3, 7.4],
  90: [7.1, 7.2],
  89: [6.9, 7.0],
  88: [6.6, 6.8],
  87: [6.4, 6.5],
};

// Convert 100-point score to 1-10 with randomization
function convertScoreRandomized(score100: number): number {
  const range = SCORE_CONVERSION[Math.round(score100)];

  if (range) {
    const [min, max] = range;
    const randomValue = min + (Math.random() * (max - min));
    return parseFloat(randomValue.toFixed(1));
  }

  // Fallback for scores outside table
  if (score100 >= 87) {
    return parseFloat((score100 / 10).toFixed(1));
  }
  return 6.0;
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

// Parse drinking window "2025 - 2033"
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

// Parse review date to ISO format
function parseReviewDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];

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

// Query François RAG for context
async function getFrancoisContext(query: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:8000/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        n_results: 5,
        rerank: true
      })
    });

    if (!response.ok) return '';

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results.map((r: any) => r.text).join('\n\n').substring(0, 2000);
    }
    return '';
  } catch (error) {
    console.log('   ⚠️  François RAG not available, continuing without context');
    return '';
  }
}

// Reword review in WineSaint academic voice
async function rewordReview(wine: any, originalReview: string, francoisContext: string): Promise<any> {
  const prompt = `You are WineSaint, a wine critic who writes in an academic, technical style.

## WINE DETAILS:
- Producer: ${wine.Producer}
- Wine: ${wine['Wine Name']}
- Vintage: ${wine.Vintage}
- Region: ${wine.Region || 'Unknown'}
- Grapes: ${wine['Grape Varieties'] || 'Unknown'}

## ORIGINAL PROFESSIONAL REVIEW:
${originalReview}

${francoisContext ? `## ADDITIONAL CONTEXT (François Knowledge Base):\n${francoisContext}\n` : ''}

## YOUR TASK:
Rewrite this review in WineSaint's academic voice:
- Technical and precise language
- Natural, educational tone (not flowery or marketing-speak)
- 2-3 sentences maximum
- Use wine terminology: structure, tannins, acidity, minerality, texture, terroir
- Vary your technical details - don't be formulaic
- Mention pH sparingly (only if truly relevant)
- Keep the core observations from the original review
- Add context from François knowledge if it enhances the review

Also provide:
1. **Short Summary**: One sentence (15 words max) capturing the wine's essence
2. **Flavor Profile**: 4-6 specific flavor descriptors from the review
3. **10-Point Score**: The score has already been converted to ${wine.convertedScore}/10

Generate JSON:
{
  "shortSummary": "One sentence wine essence",
  "tastingNotes": "2-3 sentences in WineSaint academic voice",
  "flavorProfile": ["flavor1", "flavor2", "flavor3", "flavor4", "flavor5", "flavor6"]
}`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }]
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error('Failed to parse review JSON');
  }

  return JSON.parse(jsonMatch[0]);
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

// Determine region from wine details using Claude
async function determineRegion(wine: any): Promise<{ name: string; country: string } | null> {
  try {
    const prompt = `Based on this wine information, determine the specific wine region and country:

Producer: ${wine.Producer}
Wine: ${wine['Wine Name']}
Vintage: ${wine.Vintage}
${wine['Grape Varieties'] ? `Grapes: ${wine['Grape Varieties']}` : ''}

Respond with ONLY a JSON object in this exact format:
{
  "region": "Region Name",
  "country": "Country Name"
}

Use the most specific region name (e.g., "Sonoma Coast" not just "California", "Wachau" not just "Austria").`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 200,
      temperature: 0,
      messages: [{ role: 'user', content: prompt }]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return null;
    }

    const result = JSON.parse(jsonMatch[0]);
    return { name: result.region, country: result.country };
  } catch (error) {
    console.log(`   ⚠️  Could not determine region automatically`);
    return null;
  }
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

  console.log(`   📝 Creating region: ${regionSlug} (${country})`);
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

// Import single wine with review
async function importWineWithReview(wine: any, rowNumber: number, sheetName: string): Promise<boolean> {
  console.log(`\n[${sheetName} #${rowNumber}] 🍷 ${wine.Producer} - ${wine['Wine Name']} (${wine.Vintage})`);
  console.log(`   Original score: ${wine.Score}/100`);

  try {
    // Convert score with randomization
    const convertedScore = convertScoreRandomized(wine.Score);
    wine.convertedScore = convertedScore;
    console.log(`   Converted score: ${convertedScore}/10`);

    // Get François context
    const ragQuery = `${wine.Producer} ${wine['Wine Name']} ${wine.Vintage} ${wine.Region || ''} tasting notes`;
    const francoisContext = await getFrancoisContext(ragQuery);
    if (francoisContext) {
      console.log(`   ✓ François context: ${francoisContext.length} chars`);
    }

    // Reword review
    console.log(`   ✍️  Rewording review...`);
    const reworded = await rewordReview(wine, wine['Tasting Notes'], francoisContext);
    console.log(`   ✅ Review reworded`);
    console.log(`   Summary: ${reworded.shortSummary}`);

    // Create wine document
    const producerId = await findOrCreateProducer(wine.Producer);

    // Determine region - use Excel data if available, otherwise ask Claude
    let regionId = null;
    if (wine.Region) {
      regionId = await findOrCreateRegion(wine.Region);
    } else {
      console.log(`   🤔 No region in Excel, asking Claude...`);
      const determined = await determineRegion(wine);
      if (determined) {
        console.log(`   ✓ Determined: ${determined.name}, ${determined.country}`);
        regionId = await findOrCreateRegion(slugify(determined.name), determined.country);
      }
    }

    const wineSlug = slugify(`${wine.Vintage} ${wine.Producer} ${wine['Wine Name']}`);
    const grapeVarieties = wine['Grape Varieties']
      ? wine['Grape Varieties'].split(',').map((g: string) => g.trim()).filter((g: string) => g)
      : undefined;

    // Parse wine type from Color/Type column
    const wineType = wine['Color/Type']
      ? wine['Color/Type'].toLowerCase().replace('é', 'e').trim()
      : undefined;

    const wineDoc: any = {
      _type: 'wine',
      name: wine['Wine Name'],
      slug: { current: wineSlug },
      vintage: wine.Vintage,
      producer: { _type: 'reference', _ref: producerId },
      grapeVarieties: grapeVarieties,
    };

    if (wineType) {
      wineDoc.wineType = wineType;
    }

    if (regionId) {
      wineDoc.region = { _type: 'reference', _ref: regionId };
    }

    console.log(`   📝 Creating wine document...`);
    const wineCreated = await client.create(wineDoc);
    console.log(`   ✅ Wine created: ${wineCreated._id}`);

    // Create review document
    const { start, end } = parseDrinkingWindow(wine['Drinking Window']);
    const reviewDate = parseReviewDate(wine['Review Date']);

    const reviewDoc: any = {
      _type: 'review',
      wine: { _type: 'reference', _ref: wineCreated._id },
      score: convertedScore,
      shortSummary: reworded.shortSummary,
      tastingNotes: reworded.tastingNotes,
      flavorProfile: reworded.flavorProfile,
      reviewerName: 'WineSaint',
      reviewDate: reviewDate,
      isAiGenerated: true,
    };

    if (start) reviewDoc.drinkingWindowStart = start;
    if (end) reviewDoc.drinkingWindowEnd = end;

    console.log(`   📝 Creating review document...`);
    const reviewCreated = await client.create(reviewDoc);
    console.log(`   ✅ Review created: ${reviewCreated._id}`);

    return true;

  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('\n🍷 WINE IMPORT FROM EXCEL');
  console.log('='.repeat(70));
  console.log(`File: ${EXCEL_FILE}`);
  console.log(`Sheets: ${SHEETS.join(', ')}`);
  console.log(`Limit per sheet: ${LIMIT || 'ALL'}`);
  console.log(`Offset: ${OFFSET}`);
  console.log(`Delay: ${DELAY}ms`);
  console.log('='.repeat(70));

  // Read Excel file
  const workbook = XLSX.readFile(EXCEL_FILE);

  const results: { sheet: string; success: number; failed: number; skipped: number }[] = [];
  let grandTotal = { success: 0, failed: 0, skipped: 0 };

  for (const sheetName of SHEETS) {
    console.log(`\n\n📋 SHEET: ${sheetName}`);
    console.log('='.repeat(70));

    if (!workbook.Sheets[sheetName]) {
      console.log(`   ⚠️  Sheet "${sheetName}" not found in workbook, skipping...`);
      continue;
    }

    const worksheet = workbook.Sheets[sheetName];
    const allRows: any[] = XLSX.utils.sheet_to_json(worksheet);

    console.log(`Total wines in ${sheetName}: ${allRows.length}`);

    // Apply offset and limit
    const startIndex = OFFSET;
    const endIndex = LIMIT ? Math.min(OFFSET + LIMIT, allRows.length) : allRows.length;
    const selected = allRows.slice(startIndex, endIndex);

    console.log(`Importing wines ${startIndex + 1}-${endIndex} (${selected.length} wines)\n`);

    let success = 0;
    let failed = 0;

    for (let i = 0; i < selected.length; i++) {
      const wine = selected[i];
      const rowNumber = startIndex + i + 1;
      const imported = await importWineWithReview(wine, rowNumber, sheetName);

      if (imported) {
        success++;
      } else {
        failed++;
      }

      // Delay between imports to avoid rate limiting
      if (i < selected.length - 1) {
        await new Promise(resolve => setTimeout(resolve, DELAY));
      }
    }

    const skipped = allRows.length - endIndex;
    results.push({ sheet: sheetName, success, failed, skipped });
    grandTotal.success += success;
    grandTotal.failed += failed;
    grandTotal.skipped += skipped;
  }

  // Final summary
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(70));

  for (const result of results) {
    console.log(`\n${result.sheet}:`);
    console.log(`  ✅ Success: ${result.success}`);
    console.log(`  ❌ Failed: ${result.failed}`);
    if (result.skipped > 0) {
      console.log(`  ⏭️  Skipped: ${result.skipped}`);
    }
  }

  console.log('\nGrand Total:');
  console.log(`  ✅ Success: ${grandTotal.success}`);
  console.log(`  ❌ Failed: ${grandTotal.failed}`);
  if (grandTotal.skipped > 0) {
    console.log(`  ⏭️  Skipped: ${grandTotal.skipped}`);
  }

  const estimatedCost = (grandTotal.success * 0.0084).toFixed(2);
  console.log(`\n💰 Estimated API cost: $${estimatedCost}`);
  console.log('\n✅ Import complete!');
}

main().catch(console.error);
