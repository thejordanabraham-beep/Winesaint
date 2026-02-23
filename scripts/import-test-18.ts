/**
 * Import specific 18 test wines
 */

import * as XLSX from 'xlsx';
import dotenv from 'dotenv';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@sanity/client';
import { getReferenceNotes } from './lib/reference-sources';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const EXCEL_FILE = '/Users/jordanabraham/Desktop/Geranium_Wine_List.xlsx';
const TEST_ROWS = [42, 127, 233, 389, 512, 678, 891, 1023, 1234, 1567, 1899, 2134, 2456, 2789, 3012, 3456, 3789, 4123];

// Vineyard detection
async function detectVineyard(wineName: string, producer: string): Promise<string | null> {
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
    if (wineName.includes(keyword)) {
      return keyword;
    }
  }
  return null;
}

async function findOrCreateVineyard(sanityClient: any, vineyardName: string, region: string): Promise<string | null> {
  try {
    const existing = await sanityClient.fetch(
      `*[_type == "vineyard" && name == $name][0]`,
      { name: vineyardName }
    );

    if (existing) return existing._id;

    const newVineyard = await sanityClient.create({
      _type: 'vineyard',
      name: vineyardName,
      region: region,
      slug: {
        current: vineyardName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').substring(0, 96)
      },
    });

    console.log(`     ✨ Created vineyard: ${vineyardName}`);
    return newVineyard._id;
  } catch (error: any) {
    return null;
  }
}

async function findOrCreateProducer(sanityClient: any, producerName: string): Promise<string> {
  const existing = await sanityClient.fetch(`*[_type == "producer" && name == $name][0]`, { name: producerName });
  if (existing) return existing._id;

  const newProducer = await sanityClient.create({
    _type: 'producer',
    name: producerName,
    slug: { current: producerName.toLowerCase().replace(/^(domaine|château|weingut|estate)\s+/i, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').substring(0, 96) },
  });
  return newProducer._id;
}

async function findOrCreateRegion(sanityClient: any, regionName: string): Promise<string> {
  const existing = await sanityClient.fetch(`*[_type == "region" && name == $name][0]`, { name: regionName });
  if (existing) return existing._id;

  const country = regionName.includes('Champagne') ? 'France' :
                  regionName.includes('Burgundy') ? 'France' :
                  regionName.includes('Loire') ? 'France' :
                  regionName.includes('Bordeaux') ? 'France' :
                  regionName.includes('Jura') ? 'France' :
                  regionName.includes('Germany') ? 'Germany' :
                  regionName.includes('Italy') ? 'Italy' :
                  regionName.includes('California') ? 'USA' : 'Unknown';

  const newRegion = await sanityClient.create({
    _type: 'region',
    name: regionName,
    country: country,
    slug: { current: regionName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
  });
  return newRegion._id;
}

async function generateProfile(anthropic: Anthropic, wine: any, francoisContext: string): Promise<string> {
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
  console.log('🎲 TEST IMPORT: 18 Random Wines');
  console.log('='.repeat(70));

  const workbook = XLSX.readFile(EXCEL_FILE);
  const worksheet = workbook.Sheets['Geranium Wine List'];
  const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const sanityClient = createClient({
    projectId: process.env.SANITY_PROJECT_ID!,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
  });

  let successCount = 0;
  let vineyardCount = 0;

  for (const [index, rowNum] of TEST_ROWS.entries()) {
    const row = data[rowNum];
    if (!row || !row[0]) continue;

    const wine = {
      rowNumber: rowNum + 1,
      originalEntry: row[0] || '',
      vintage: row[1] || '',
      producer: row[2] || '',
      wineName: row[3] || '',
      region: row[4] || '',
      category: row[5] || ''
    };

    console.log(`\n[${index + 1}/18] Row ${wine.rowNumber}: ${wine.originalEntry}`);

    try {
      // Detect vineyard
      const vineyardName = await detectVineyard(wine.wineName, wine.producer);
      let vineyardId: string | null = null;

      if (vineyardName) {
        console.log(`  🍇 VINEYARD DETECTED: ${vineyardName}`);
        vineyardId = await findOrCreateVineyard(sanityClient, vineyardName, wine.region);
        if (vineyardId) vineyardCount++;
      } else {
        console.log('  ⚪ No vineyard');
      }

      // Get François context
      let context: any = [];
      try {
        context = await getReferenceNotes(wine.producer, wine.region, wine.wineName.split(/\s+/).filter((w: string) => w.length > 3));
      } catch (err) {}

      const contextText = Array.isArray(context) && context.length > 0 ? context.map((c: any) => c.text).join('\n\n').substring(0, 2000) : '';

      // Generate profile
      const profile = await generateProfile(anthropic, wine, contextText);

      // Import to Sanity
      const producerId = await findOrCreateProducer(sanityClient, wine.producer);
      const regionId = wine.region ? await findOrCreateRegion(sanityClient, wine.region) : null;

      const wineDoc: any = {
        _type: 'wine',
        name: wine.originalEntry,
        slug: { current: wine.originalEntry.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').substring(0, 96) },
        vintage: parseInt(wine.vintage) || null,
        producer: { _type: 'reference', _ref: producerId },
        hasAiReview: true,
        aiReview: profile,
      };

      if (regionId) wineDoc.region = { _type: 'reference', _ref: regionId };
      if (vineyardId) wineDoc.vineyard = { _type: 'reference', _ref: vineyardId };

      const result = await sanityClient.create(wineDoc);
      console.log(`  ✅ Published: ${result._id}${vineyardId ? ' (WITH VINEYARD)' : ''}`);

      successCount++;
      await new Promise(resolve => setTimeout(resolve, 1500));

    } catch (error: any) {
      console.error(`  ❌ Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ TEST COMPLETE');
  console.log(`Imported: ${successCount}/18 wines`);
  console.log(`Vineyards detected: ${vineyardCount}`);
}

main();
