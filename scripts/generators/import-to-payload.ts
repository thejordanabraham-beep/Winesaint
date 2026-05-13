/**
 * WINE IMPORT TO PAYLOAD
 *
 * Production-ready script to import wines and reviews from Excel spreadsheet into Payload CMS
 *
 * FEATURES:
 * - Randomized score conversion (100-point → 1-10 scale)
 * - François RAG integration for review context
 * - WineSaint academic voice review generation via Claude
 * - Automatic region determination for blank regions
 * - Wine type/color import
 * - Drinking window parsing
 * - Producer and region auto-creation
 *
 * USAGE:
 *   npx tsx scripts/import-to-payload.ts [options]
 *
 * OPTIONS:
 *   --sheet <name>      Sheet to import (default: "Australia")
 *   --limit <number>    Max wines to import (default: all)
 *   --offset <number>   Skip first N wines (default: 0)
 *   --delay <ms>        Delay between imports in ms (default: 1000)
 *   --dry-run           Preview without making changes
 *
 * EXAMPLES:
 *   # Import first 5 wines from Australia (test)
 *   npx tsx scripts/import-to-payload.ts --sheet Australia --limit 5
 *
 *   # Dry run to preview what would be imported
 *   npx tsx scripts/import-to-payload.ts --sheet Australia --limit 10 --dry-run
 *
 *   # Import with faster processing
 *   npx tsx scripts/import-to-payload.ts --sheet Australia --delay 500
 */

import * as XLSX from 'xlsx';
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

const EXCEL_FILE = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW_CLEANED.xlsx';
const SHEET = getArg('--sheet', 'Australia');
const LIMIT = getArg('--limit') ? parseInt(getArg('--limit')) : null;
const OFFSET = getArg('--offset') ? parseInt(getArg('--offset')) : 0;
const DELAY = getArg('--delay') ? parseInt(getArg('--delay')) : 1000;
const DRY_RUN = args.includes('--dry-run');

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000';

// Token refresh interval (45 minutes - before 1hr expiry)
const TOKEN_REFRESH_INTERVAL_MS = 45 * 60 * 1000;

// Token manager to handle automatic refresh
class TokenManager {
  private token: string = '';
  private tokenObtainedAt: number = 0;

  async getToken(): Promise<string> {
    const now = Date.now();
    const tokenAge = now - this.tokenObtainedAt;

    // Refresh if no token or token is older than refresh interval
    if (!this.token || tokenAge > TOKEN_REFRESH_INTERVAL_MS) {
      console.log(this.token ? '   [Refreshing expired token...]' : '   [Getting initial token...]');
      await this.refresh();
    }

    return this.token;
  }

  async refresh(): Promise<void> {
    const response = await fetch(`${PAYLOAD_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.PAYLOAD_ADMIN_EMAIL || 'admin@winesaint.com',
        password: process.env.PAYLOAD_ADMIN_PASSWORD || 'admin123',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with Payload');
    }

    const data = await response.json();
    this.token = data.token;
    this.tokenObtainedAt = Date.now();
    console.log('   [Token refreshed successfully]');
  }
}

const tokenManager = new TokenManager();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Score conversion table with ranges (100-point → 1-10)
const SCORE_CONVERSION: Record<number, [number, number]> = {
  // Exceptional (9+)
  100: [9.8, 10.0],
  99: [9.5, 9.7],
  98: [9.3, 9.5],
  97: [9.1, 9.3],
  // Excellent (8-9)
  96: [8.5, 9.0],
  95: [8.1, 8.5],
  94: [8.0, 8.0],
  // Very Good (7-8)
  93: [7.7, 7.9],
  92: [7.5, 7.6],
  91: [7.3, 7.4],
  90: [7.1, 7.2],
  // Good (6-7)
  89: [6.9, 7.0],
  88: [6.6, 6.8],
  87: [6.4, 6.5],
  86: [6.2, 6.3],
  85: [6.0, 6.1],
  // Average (5-6)
  84: [5.7, 5.9],
  83: [5.4, 5.6],
  82: [5.1, 5.3],
  81: [4.8, 5.0],
  80: [4.5, 4.7],
  // Below Average (3-5)
  79: [4.2, 4.4],
  78: [3.9, 4.1],
  77: [3.6, 3.8],
  76: [3.3, 3.5],
  75: [3.0, 3.2],
  // Poor (1-3)
  74: [2.7, 2.9],
  73: [2.4, 2.6],
  72: [2.1, 2.3],
  71: [1.8, 2.0],
  70: [1.5, 1.7],
};

// Convert 100-point score to 1-10 with randomization
function convertScoreRandomized(score100: number): number {
  const rounded = Math.round(score100);
  const range = SCORE_CONVERSION[rounded];

  if (range) {
    const [min, max] = range;
    const randomValue = min + (Math.random() * (max - min));
    return parseFloat(randomValue.toFixed(1));
  }

  // Fallback for scores outside table (above 100 or below 70)
  if (rounded > 100) {
    return 10.0;
  }
  if (rounded < 70) {
    return 1.0;
  }

  // Shouldn't reach here, but safety fallback
  return 5.0;
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

// Parse price
function parsePrice(priceStr: string): number | null {
  if (!priceStr) return null;
  const match = priceStr.match(/\$?(\d+)/);
  return match ? parseInt(match[1]) : null;
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
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.RAG_API_KEY || 'wine-rag-secret-key-2024'
      },
      body: JSON.stringify({
        question: query,
        top_k: 5
      })
    });

    if (!response.ok) return '';

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      // Results have 'document' field, not 'text'
      return data.results.map((r: any) => r.document).join('\n\n').substring(0, 2000);
    }
    return '';
  } catch (error) {
    console.log('   (Francois RAG not available)');
    return '';
  }
}

// Track previous review openings for batch anti-repetition
interface BatchContext {
  reviewNumber: number;
  totalReviews: number;
  producer: string;
  previousOpenings: string[];
}

// Generate review using François WineSaint voice (trained on 23k+ critic reviews)
async function rewordReview(
  wine: any,
  originalReview: string,
  francoisContext: string,
  convertedScore: number,
  batchContext?: BatchContext
): Promise<any> {
  // Determine wine color from type field
  const wineType = (wine.Type || '').toLowerCase();
  let color: 'red' | 'white' | 'sparkling' | 'rose' | 'dessert' = 'red';
  if (wineType.includes('white')) color = 'white';
  else if (wineType.includes('sparkling') || wineType.includes('champagne')) color = 'sparkling';
  else if (wineType.includes('rose') || wineType.includes('rosé')) color = 'rose';
  else if (wineType.includes('dessert') || wineType.includes('sweet')) color = 'dessert';

  try {
    // Try François first (pass batch context for anti-repetition)
    const requestBody: any = {
      producer: wine.Producer,
      wine_name: wine['Wine Name'],
      vintage: wine.Vintage,
      region: wine.Region || '',
      grapes: wine['Grape Varieties'] || '',
      original_review: originalReview,
      color: color
    };

    // Add batch context if available
    if (batchContext) {
      requestBody.batch_review_number = batchContext.reviewNumber;
      requestBody.batch_total_reviews = batchContext.totalReviews;
      requestBody.batch_previous_openings = batchContext.previousOpenings;
    }

    const response = await fetch('http://localhost:8000/generate-review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.RAG_API_KEY || 'wine-rag-secret-key-2024'
      },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      const data = await response.json();
      return {
        shortSummary: data.short_summary,
        tastingNotes: data.tasting_notes,
        flavorProfile: data.flavor_profile
      };
    }
  } catch (error) {
    console.log('   (François not available, using direct Claude)');
  }

  // Build batch context instruction if we're in a batch
  let batchInstruction = '';
  if (batchContext && batchContext.previousOpenings.length > 0) {
    batchInstruction = `BATCH CONTEXT: You are writing review ${batchContext.reviewNumber} of ${batchContext.totalReviews} for wines from ${batchContext.producer}.

Previous review openings (vary yours):
${batchContext.previousOpenings.map((o, i) => `${i + 1}. "${o}"`).join('\n')}

`;
  }

  // Fallback to direct Claude call if François unavailable
  const prompt = `Write a brief wine tasting note (3-6 sentences) in a professional critic voice.

WINE: ${wine.Producer} ${wine['Wine Name']} ${wine.Vintage}
REGION: ${wine.Region || 'Unknown'}
GRAPES: ${wine['Grape Varieties'] || 'Unknown'}

ORIGINAL CRITIC NOTE:
${originalReview}

${francoisContext ? `TERROIR CONTEXT:\n${francoisContext}\n` : ''}${batchInstruction}
GUIDELINES:
- Let the wine's complexity guide length (3-6 sentences typical)
- Include structure (tannins, acidity, body) when relevant
- Include drinking window when the wine warrants aging guidance
- Vary your openings and sentence structures

JSON format:
{
  "shortSummary": "Brief essence (10 words max)",
  "tastingNotes": "3-6 sentence review",
  "flavorProfile": ["flavor1", "flavor2", "flavor3", "flavor4"]
}`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 300,
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

// Find or create producer in Payload
async function findOrCreateProducer(token: string, producerName: string, regionId: number): Promise<number> {
  // Search for existing producer
  const searchUrl = `${PAYLOAD_URL}/api/producers?where[name][equals]=${encodeURIComponent(producerName)}&limit=1`;
  const searchRes = await fetch(searchUrl, {
    headers: { 'Authorization': `JWT ${token}` }
  });

  if (searchRes.ok) {
    const data = await searchRes.json();
    if (data.docs && data.docs.length > 0) {
      return data.docs[0].id;
    }
  }

  // Create new producer
  console.log(`   Creating producer: ${producerName}`);
  const createRes = await fetch(`${PAYLOAD_URL}/api/producers`, {
    method: 'POST',
    headers: {
      'Authorization': `JWT ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: producerName,
      slug: slugify(producerName),
      region: regionId,
    })
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Failed to create producer: ${errorText}`);
  }

  const producer = await createRes.json();
  return producer.doc.id;
}

// Find or create region in Payload
async function findOrCreateRegion(token: string, regionSlug: string, countryName: string = 'Unknown'): Promise<number> {
  // Search for existing region
  const searchUrl = `${PAYLOAD_URL}/api/regions?where[slug][equals]=${encodeURIComponent(regionSlug)}&limit=1`;
  const searchRes = await fetch(searchUrl, {
    headers: { 'Authorization': `JWT ${token}` }
  });

  if (searchRes.ok) {
    const data = await searchRes.json();
    if (data.docs && data.docs.length > 0) {
      return data.docs[0].id;
    }
  }

  // Create new region
  const regionName = regionSlug.split('-').map(w =>
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');

  console.log(`   Creating region: ${regionName} (${countryName})`);
  const createRes = await fetch(`${PAYLOAD_URL}/api/regions`, {
    method: 'POST',
    headers: {
      'Authorization': `JWT ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: regionName,
      slug: regionSlug,
      level: 'region',
      fullSlug: regionSlug,
      country: countryName,
    })
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Failed to create region: ${errorText}`);
  }

  const region = await createRes.json();
  return region.doc.id;
}

// Determine region from wine details using Claude
async function determineRegion(wine: any, sheetName: string): Promise<{ name: string; slug: string; country: string } | null> {
  try {
    const prompt = `Based on this wine information and the spreadsheet tab "${sheetName}", determine the specific wine region and country:

Producer: ${wine.Producer}
Wine: ${wine['Wine Name']}
Vintage: ${wine.Vintage}
${wine['Grape Varieties'] ? `Grapes: ${wine['Grape Varieties']}` : ''}

Respond with ONLY a JSON object in this exact format:
{
  "region": "Region Name",
  "slug": "region-slug",
  "country": "Country Name"
}

Use the most specific region name (e.g., "Barossa Valley" not just "Australia", "Wachau" not just "Austria").`;

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
    return { name: result.region, slug: result.slug || slugify(result.region), country: result.country };
  } catch (error) {
    console.log(`   Could not determine region automatically`);
    return null;
  }
}

// Check for duplicate wine
async function checkDuplicate(token: string, producerName: string, wineName: string, vintage: number): Promise<boolean> {
  const searchUrl = `${PAYLOAD_URL}/api/wines?where[name][equals]=${encodeURIComponent(wineName)}&where[vintage][equals]=${vintage}&depth=1&limit=10`;
  const searchRes = await fetch(searchUrl, {
    headers: { 'Authorization': `JWT ${token}` }
  });

  if (searchRes.ok) {
    const data = await searchRes.json();
    // Check if any match has the same producer
    for (const wine of data.docs || []) {
      const wineProducerName = typeof wine.producer === 'object' ? wine.producer.name : '';
      if (wineProducerName === producerName) {
        return true; // Duplicate found
      }
    }
  }

  return false;
}

// Import single wine with review
async function importWineWithReview(
  token: string,
  wine: any,
  rowNumber: number,
  sheetName: string,
  batchContext?: BatchContext
): Promise<{ success: boolean; wineId?: number; reviewId?: number; reviewOpening?: string }> {
  console.log(`\n[${sheetName} #${rowNumber}] ${wine.Producer} - ${wine['Wine Name']} (${wine.Vintage})`);
  console.log(`   Original score: ${wine.Score}/100`);

  if (DRY_RUN) {
    const convertedScore = convertScoreRandomized(wine.Score);
    console.log(`   Converted score: ${convertedScore}/10`);
    console.log(`   [DRY RUN - No changes made]`);
    return { success: true };
  }

  try {
    // Check for duplicate
    const isDuplicate = await checkDuplicate(token, wine.Producer, wine['Wine Name'], wine.Vintage);
    if (isDuplicate) {
      console.log(`   SKIPPED (duplicate)`);
      return { success: false };
    }

    // Convert score with randomization
    const convertedScore = convertScoreRandomized(wine.Score);
    console.log(`   Converted score: ${convertedScore}/10`);

    // Get Francois context
    const ragQuery = `${wine.Producer} ${wine['Wine Name']} ${wine.Vintage} ${wine.Region || sheetName} tasting notes`;
    const francoisContext = await getFrancoisContext(ragQuery);
    if (francoisContext) {
      console.log(`   Francois context: ${francoisContext.length} chars`);
    }

    // Reword review with AI (pass batch context for anti-repetition)
    console.log(`   Generating WineSaint review...`);
    const reworded = await rewordReview(wine, wine['Tasting Notes'], francoisContext, convertedScore, batchContext);
    console.log(`   Summary: ${reworded.shortSummary}`);

    // Extract opening sentence for batch tracking
    const reviewOpening = reworded.tastingNotes.split(/[.!?]/)[0] + '.';

    // Map sheet names to countries
    const sheetToCountry: Record<string, string> = {
      'Australia': 'Australia',
      'Austria': 'Austria',
      'California': 'United States',
      'Champagne': 'France',
      'France - Burgundy': 'France',
      'France - Loire': 'France',
      'France - Rhone': 'France',
      'France - SW + Lang': 'France',
      'Germany': 'Germany',
      'Italy': 'Italy',
      'New Zealand': 'New Zealand',
      'Oregon': 'United States',
      'Portugal': 'Portugal',
      'Spain': 'Spain',
      'South Africa': 'South Africa',
    };
    const countryFromSheet = sheetToCountry[sheetName] || 'Unknown';

    // Get or determine region
    let regionId: number;
    if (wine.Region) {
      regionId = await findOrCreateRegion(token, slugify(wine.Region), countryFromSheet);
    } else {
      console.log(`   No region in Excel, asking Claude...`);
      const determined = await determineRegion(wine, sheetName);
      if (determined) {
        console.log(`   Determined: ${determined.name}, ${determined.country}`);
        regionId = await findOrCreateRegion(token, determined.slug, determined.country);
      } else {
        // Fallback to sheet name as region
        regionId = await findOrCreateRegion(token, slugify(sheetName), countryFromSheet);
      }
    }

    // Get or create producer
    const producerId = await findOrCreateProducer(token, wine.Producer, regionId);

    // Parse wine type
    const wineTypeMap: Record<string, string> = {
      'red': 'red',
      'white': 'white',
      'rose': 'rose',
      'rosé': 'rose',
      'sparkling': 'sparkling',
      'dessert': 'dessert',
      'fortified': 'fortified',
      'orange': 'orange',
    };
    const rawType = (wine['Color/Type'] || '').toLowerCase().trim();
    const wineType = wineTypeMap[rawType] || undefined;

    // Create wine
    const wineName = (wine['Wine Name'] || '').trim();
    const wineSlug = slugify(`${wine.Vintage} ${wine.Producer} ${wineName || 'estate'}`);
    const price = parsePrice(wine['Release Price']);

    const winePayload: any = {
      name: wineName,
      slug: wineSlug,
      vintage: wine.Vintage,
      producer: producerId,
      region: regionId,
    };

    if (wineType) winePayload.wineType = wineType;
    if (price) winePayload.priceUsd = price;

    console.log(`   Creating wine...`);
    const wineRes = await fetch(`${PAYLOAD_URL}/api/wines`, {
      method: 'POST',
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(winePayload)
    });

    if (!wineRes.ok) {
      const errorText = await wineRes.text();
      throw new Error(`Failed to create wine: ${errorText}`);
    }

    const wineDoc = await wineRes.json();
    const wineId = wineDoc.doc.id;
    console.log(`   Wine created: ID ${wineId}`);

    // Create review
    const reviewDate = parseReviewDate(wine['Review Date']);

    const reviewPayload: any = {
      wine: wineId,
      score: convertedScore,
      tastingNotes: reworded.tastingNotes,
      shortSummary: reworded.shortSummary,
      flavorProfile: reworded.flavorProfile.map((f: string) => ({ flavor: f })),
      reviewerName: 'WineSaint',
      reviewDate: reviewDate,
    };

    console.log(`   Creating review...`);
    const reviewRes = await fetch(`${PAYLOAD_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewPayload)
    });

    if (!reviewRes.ok) {
      const errorText = await reviewRes.text();
      throw new Error(`Failed to create review: ${errorText}`);
    }

    const reviewDoc = await reviewRes.json();
    const reviewId = reviewDoc.doc.id;
    console.log(`   Review created: ID ${reviewId}`);

    return { success: true, wineId, reviewId, reviewOpening };

  } catch (error: any) {
    console.error(`   ERROR: ${error.message}`);
    return { success: false };
  }
}

// Main function
async function main() {
  console.log('\n=== WINE IMPORT TO PAYLOAD ===');
  console.log(`File: ${EXCEL_FILE}`);
  console.log(`Sheet: ${SHEET}`);
  console.log(`Limit: ${LIMIT || 'ALL'}`);
  console.log(`Offset: ${OFFSET}`);
  console.log(`Delay: ${DELAY}ms`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(''.padEnd(50, '='));

  // Read Excel file
  const workbook = XLSX.readFile(EXCEL_FILE);

  if (!workbook.SheetNames.includes(SHEET)) {
    console.error(`Sheet "${SHEET}" not found. Available: ${workbook.SheetNames.join(', ')}`);
    process.exit(1);
  }

  const worksheet = workbook.Sheets[SHEET];
  const allRows: any[] = XLSX.utils.sheet_to_json(worksheet);

  console.log(`\nTotal wines in ${SHEET}: ${allRows.length}`);

  // Apply offset and limit
  const startIndex = OFFSET;
  const endIndex = LIMIT ? Math.min(OFFSET + LIMIT, allRows.length) : allRows.length;
  const selected = allRows.slice(startIndex, endIndex);

  console.log(`Importing wines ${startIndex + 1}-${endIndex} (${selected.length} wines)\n`);

  // Initialize token (will auto-refresh as needed)
  if (!DRY_RUN) {
    console.log('Authenticating with Payload...');
    await tokenManager.getToken();
    console.log('Authenticated! (token will auto-refresh every 45 min)\n');
  }

  let success = 0;
  let failed = 0;
  let skipped = 0;

  // Batch context for anti-repetition (track previous openings)
  const previousOpenings: string[] = [];

  for (let i = 0; i < selected.length; i++) {
    const wine = selected[i];
    const rowNumber = startIndex + i + 1;

    // Build batch context for anti-repetition
    const batchContext: BatchContext = {
      reviewNumber: i + 1,
      totalReviews: selected.length,
      producer: wine.Producer,
      previousOpenings: previousOpenings.slice(-5) // Keep last 5 openings for context
    };

    // Get fresh token (auto-refreshes if needed)
    const token = await tokenManager.getToken();
    const result = await importWineWithReview(token, wine, rowNumber, SHEET, batchContext);

    if (result.success) {
      success++;
      // Track opening for anti-repetition in subsequent reviews
      if (result.reviewOpening) {
        previousOpenings.push(result.reviewOpening);
      }
    } else if (result.wineId === undefined && result.reviewId === undefined) {
      skipped++;
    } else {
      failed++;
    }

    // Delay between imports
    if (i < selected.length - 1 && !DRY_RUN) {
      await new Promise(resolve => setTimeout(resolve, DELAY));
    }
  }

  // Summary
  console.log('\n' + ''.padEnd(50, '='));
  console.log('IMPORT SUMMARY');
  console.log(''.padEnd(50, '='));
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
  console.log(`Skipped (duplicates): ${skipped}`);

  if (!DRY_RUN) {
    const estimatedCost = (success * 0.0084).toFixed(2);
    console.log(`\nEstimated API cost: $${estimatedCost}`);
  }

  console.log('\nImport complete!');
}

main().catch(console.error);
