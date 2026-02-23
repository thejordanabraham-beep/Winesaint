/**
 * Geranium Import with Vineyard Detection
 *
 * Auto-detects vineyards in wine names using François RAG
 */

import * as XLSX from 'xlsx';
import dotenv from 'dotenv';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@sanity/client';
import { getReferenceNotes } from './lib/reference-sources';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const EXCEL_FILE = '/Users/jordanabraham/Desktop/Geranium_Wine_List.xlsx';
const PROGRESS_FILE = '/tmp/geranium-vineyard-import-progress.json';
const BATCH_SIZE = 10;
const DELAY_MS = 2000;

interface Wine {
  rowNumber: number;
  originalEntry: string;
  vintage: string;
  producer: string;
  wineName: string;
  region: string;
  category: string;
}

interface Progress {
  lastProcessedRow: number;
  successCount: number;
  errorCount: number;
  vineyardsFound: number;
  errors: Array<{ row: number; wine: string; error: string }>;
}

function loadProgress(): Progress {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
  }
  return { lastProcessedRow: 1, successCount: 0, errorCount: 0, vineyardsFound: 0, errors: [] };
}

function saveProgress(progress: Progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function readAllWines(startRow: number = 2, limit?: number): Wine[] {
  const workbook = XLSX.readFile(EXCEL_FILE);
  const worksheet = workbook.Sheets['Geranium Wine List'];
  const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  const wines: Wine[] = [];
  const endRow = limit ? Math.min(startRow + limit, data.length) : data.length;

  for (let i = startRow - 1; i < endRow; i++) {
    const row = data[i];
    if (!row || !row[0]) continue;

    wines.push({
      rowNumber: i + 1,
      originalEntry: row[0] || '',
      vintage: row[1] || '',
      producer: row[2] || '',
      wineName: row[3] || '',
      region: row[4] || '',
      category: row[5] || ''
    });
  }

  return wines;
}

// Detect vineyard in wine name using François
async function detectVineyard(wineName: string, producer: string): Promise<string | null> {
  // Clean the wine name - remove size notes like "1500 ml", "3000 ml", etc.
  const cleanedName = wineName.replace(/\d+\s*ml/gi, '').trim();

  // First check for common vineyard keywords (faster and more reliable)
  // IMPORTANT: Order matters! More specific names must come before general ones
  const vineyardKeywords = [
    // Champagne clos
    'Clos d\'Ambonnay', 'Clos du Mesnil', 'Clos des Goisses',

    // California vineyards
    'Bien Nacido', 'To Kalon', 'Hirsch Vineyards', 'Hirsch', 'Durell', 'Pisoni',

    // Burgundy - Montrachet family (specific before general)
    'Criots-Bâtard-Montrachet', 'Bienvenues-Bâtard-Montrachet', 'Bâtard-Montrachet',
    'Chevalier-Montrachet', 'Le Montrachet', 'Montrachet',

    // Burgundy - Romanée family
    'Romanée-Conti', 'Romanée-Saint-Vivant', 'La Romanée', 'Romanée',

    // Burgundy - Corton family (specific before general)
    'Corton-Charlemagne', 'Corton-Bressandes', 'Corton-Renardes', 'Corton-Pougets', 'Corton',

    // Other Burgundy Grand Crus and Premier Crus
    'La Tâche', 'Richebourg', 'Les Amoureuses',
    'Clos de la Roche', 'Clos Saint-Denis', 'Clos de Tart', 'Clos de Bèze',
    'Clos Vougeot', 'Clos de Vougeot', 'Clos des Varoilles',
    'Bonnes-Mares', 'Chambertin', 'Échezeaux', 'Grands-Échezeaux'
  ];

  for (const keyword of vineyardKeywords) {
    if (cleanedName.includes(keyword)) {
      return keyword;
    }
  }

  // Then check François vineyard database for lesser-known vineyards
  try {
    const response = await fetch('http://localhost:8000/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `${wineName} ${producer} vineyard`,
        n_results: 5
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    const results = data.results || [];

    // Look for vineyard_profile content type
    for (const result of results) {
      const metadata = result.metadata || {};

      if (metadata.content_type === 'vineyard_profile') {
        const vineyardName = metadata.vineyard_name || metadata.title;

        // Check if vineyard name appears in wine name
        if (vineyardName && wineName.toLowerCase().includes(vineyardName.toLowerCase())) {
          return vineyardName;
        }
      }
    }

    return null;

  } catch (error) {
    return null;
  }
}

// Find or create vineyard in Sanity
async function findOrCreateVineyard(sanityClient: any, vineyardName: string, region: string): Promise<string | null> {
  try {
    const existing = await sanityClient.fetch(
      `*[_type == "vineyard" && name == $name][0]`,
      { name: vineyardName }
    );

    if (existing) {
      return existing._id;
    }

    // Create new vineyard
    const newVineyard = await sanityClient.create({
      _type: 'vineyard',
      name: vineyardName,
      region: region,
      slug: {
        current: vineyardName
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .substring(0, 96)
      },
    });

    console.log(`     ✨ Created vineyard: ${vineyardName}`);
    return newVineyard._id;

  } catch (error: any) {
    console.log(`     ⚠️  Could not create vineyard: ${error.message}`);
    return null;
  }
}

async function findOrCreateProducer(sanityClient: any, producerName: string): Promise<string> {
  const existing = await sanityClient.fetch(
    `*[_type == "producer" && name == $name][0]`,
    { name: producerName }
  );

  if (existing) return existing._id;

  const newProducer = await sanityClient.create({
    _type: 'producer',
    name: producerName,
    slug: {
      current: producerName
        .toLowerCase()
        .replace(/^(domaine|château|weingut|estate)\s+/i, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .substring(0, 96)
    },
  });

  return newProducer._id;
}

async function findOrCreateRegion(sanityClient: any, regionName: string): Promise<string> {
  const existing = await sanityClient.fetch(
    `*[_type == "region" && name == $name][0]`,
    { name: regionName }
  );

  if (existing) return existing._id;

  const country = regionName.includes('Champagne') ? 'France' :
                  regionName.includes('Burgundy') ? 'France' :
                  regionName.includes('Bordeaux') ? 'France' :
                  regionName.includes('Rhône') || regionName.includes('Rhone') ? 'France' :
                  regionName.includes('Italy') ? 'Italy' :
                  regionName.includes('Spain') ? 'Spain' :
                  regionName.includes('Germany') ? 'Germany' :
                  regionName.includes('California') || regionName.includes('Napa') || regionName.includes('Sonoma') ? 'USA' :
                  'Unknown';

  const newRegion = await sanityClient.create({
    _type: 'region',
    name: regionName,
    country: country,
    slug: { current: regionName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
  });

  return newRegion._id;
}

async function generateProfile(anthropic: Anthropic, wine: Wine, francoisContext: string): Promise<string> {
  const prompt = `You are a wine expert writing a concise profile for a restaurant wine list.

WINE: ${wine.originalEntry}
Producer: ${wine.producer}
Region: ${wine.region}
Category: ${wine.category}

EDUCATIONAL CONTEXT:
${francoisContext || 'Use general wine knowledge.'}

Write a 75-100 word wine profile that:
- Describes the producer's style and reputation
- Mentions key characteristics of this region/wine
- Is educational but accessible
- Uses specific wine terminology

Profile:`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 300,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }]
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

async function main() {
  const args = process.argv.slice(2);
  const limitIndex = args.indexOf('--limit');
  const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : undefined;
  const startRowArg = args.indexOf('--start-row');
  const dryRun = args.includes('--dry-run');

  console.log('🍷 GERANIUM IMPORT WITH VINEYARD DETECTION');
  console.log('='.repeat(70));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE IMPORT'}`);
  console.log(`Batch size: ${BATCH_SIZE} wines`);
  console.log(`Vineyard detection: ENABLED\n`);

  const progress = loadProgress();
  const startRow = startRowArg !== -1 ? parseInt(args[startRowArg + 1], 10) : progress.lastProcessedRow + 1;

  console.log(`📊 Progress:`);
  console.log(`   Previously completed: ${progress.successCount} wines`);
  console.log(`   Vineyards found: ${progress.vineyardsFound}`);
  console.log(`   Starting from row: ${startRow}\n`);

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const sanityClient = createClient({
    projectId: process.env.SANITY_PROJECT_ID!,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
  });

  const wines = readAllWines(startRow, limit);
  console.log(`📋 Loaded ${wines.length} wines to process\n`);

  if (wines.length === 0) {
    console.log('✅ No wines to process!');
    return;
  }

  for (let i = 0; i < wines.length; i += BATCH_SIZE) {
    const batch = wines.slice(i, Math.min(i + BATCH_SIZE, wines.length));
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(wines.length / BATCH_SIZE);

    console.log(`\n${'='.repeat(70)}`);
    console.log(`📦 BATCH ${batchNum}/${totalBatches} (Rows ${batch[0].rowNumber}-${batch[batch.length - 1].rowNumber})`);
    console.log('='.repeat(70));

    for (const wine of batch) {
      const wineNum = wines.indexOf(wine) + 1;
      console.log(`\n[${wineNum}/${wines.length}] Row ${wine.rowNumber}: ${wine.originalEntry}`);

      try {
        // 1. Detect vineyard
        console.log('  🔍 Checking for vineyard...');
        const vineyardName = await detectVineyard(wine.wineName, wine.producer);

        let vineyardId: string | null = null;
        if (vineyardName) {
          console.log(`  🍇 VINEYARD DETECTED: ${vineyardName}`);
          if (!dryRun) {
            vineyardId = await findOrCreateVineyard(sanityClient, vineyardName, wine.region);
            if (vineyardId) {
              progress.vineyardsFound++;
            }
          }
        } else {
          console.log('  ⚪ No vineyard (regional/cuvée)');
        }

        // 2. Query François for context
        let context: any = [];
        try {
          context = await getReferenceNotes(
            wine.producer,
            wine.region,
            wine.wineName.split(/\s+/).filter(w => w.length > 3)
          );
        } catch (err) {
          // Silent fail
        }

        const contextText = Array.isArray(context) && context.length > 0
          ? context.map((c: any) => c.text).join('\n\n').substring(0, 2000)
          : '';

        // 3. Generate profile
        const profile = await generateProfile(anthropic, wine, contextText);
        console.log(`  ✅ Generated profile (${profile.length} chars)`);

        if (dryRun) {
          progress.successCount++;
          continue;
        }

        // 4. Import to Sanity
        const producerId = await findOrCreateProducer(sanityClient, wine.producer);
        const regionId = wine.region ? await findOrCreateRegion(sanityClient, wine.region) : null;

        const wineDoc: any = {
          _type: 'wine',
          name: wine.originalEntry,
          slug: {
            current: wine.originalEntry
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/g, '')
              .substring(0, 96)
          },
          vintage: parseInt(wine.vintage) || null,
          producer: { _type: 'reference', _ref: producerId },
          hasAiReview: true,
          aiReview: profile,
        };

        if (regionId) {
          wineDoc.region = { _type: 'reference', _ref: regionId };
        }

        if (vineyardId) {
          wineDoc.vineyard = { _type: 'reference', _ref: vineyardId };
        }

        const result = await sanityClient.create(wineDoc);
        console.log(`  ✅ Published: ${result._id}${vineyardId ? ' (WITH VINEYARD)' : ''}`);

        progress.successCount++;
        progress.lastProcessedRow = wine.rowNumber;

      } catch (error: any) {
        console.error(`  ❌ Error: ${error.message}`);
        progress.errorCount++;
        progress.errors.push({
          row: wine.rowNumber,
          wine: wine.originalEntry,
          error: error.message
        });
      }
    }

    saveProgress(progress);
    console.log(`\n💾 Progress saved (${progress.successCount} wines, ${progress.vineyardsFound} with vineyards)`);

    if (i + BATCH_SIZE < wines.length) {
      console.log(`⏳ Waiting ${DELAY_MS}ms...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Successful: ${progress.successCount}`);
  console.log(`🍇 Vineyards detected: ${progress.vineyardsFound}`);
  console.log(`❌ Errors: ${progress.errorCount}`);
}

main()
  .then(() => {
    console.log('\n✅ Import complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  });
