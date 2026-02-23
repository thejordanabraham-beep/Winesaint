import { createClient } from '@sanity/client';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { convertScore } from './score-conversion';
import { matchRegion } from './weg-region-matcher';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

interface WineRow {
  Producer: string;
  'Wine Name': string;
  Vintage: string;
  Score: string;
  'Color/Type': string;
  'Release Price': string;
  'Drinking Window': string;
  Reviewer: string;
  'Review Date': string;
  'Tasting Notes': string;
  Country?: string;
  Region?: string;
  'Sub-Region'?: string;
  Village?: string;
  Vineyard?: string;
  vineyard_type?: string;
  'Grape Varieties'?: string;
  Appellation?: string;
  'Needs François'?: string;
  Sanity_Wine_ID?: string;
  Sanity_Review_ID?: string;
}

// Known producer → region mappings (from producer_region_map.csv)
const PRODUCER_REGION_MAP: Record<string, string> = {
  // Original mappings
  'Benanti': 'etna',
  'Hirsch': 'kamptal',
  'Prager': 'wachau',
  'Knoll': 'wachau',
  'Donnhoff': 'nahe',
  'Keller': 'rheinhessen',
  'Schäfer-Fröhlich': 'nahe',
  // From Browser Claude's producer_region_map.csv (26 producers)
  'Alzinger': 'wachau',
  'Bedrock': 'sonoma-county',
  'Bernhard Ott': 'wagram',
  'Carlisle': 'sonoma-county',
  'Ceritas': 'sonoma-coast',
  'Corison': 'napa-valley',
  'DuMOL': 'russian-river-valley',
  'Emmerich Knoll': 'wachau',
  'F.X. Pichler': 'wachau',
  'Failla': 'russian-river-valley',
  'Gemstone': 'napa-valley',
  'Kistler': 'russian-river-valley',
  'Kosta Browne': 'russian-river-valley',
  'Liquid Farm': 'santa-barbara-county',
  'Martinelli': 'russian-river-valley',
  'Mayacamas': 'napa-valley',
  'Moric': 'burgenland',
  'Mount Eden': 'santa-cruz-mountains',
  'Paul Lato': 'santa-barbara-county',
  'Philip Togni': 'napa-valley',
  'Ramey': 'russian-river-valley',
  'Rhys': 'sonoma-coast',
  'Robert Biale': 'napa-valley',
  'Rudi Pichler': 'wachau',
  'Shafer': 'napa-valley',
  'Wieninger': 'vienna',
};

// Fantasy/brand names that should NOT create vineyard pages
const FANTASY_NAMES = new Set([
  'Alluvial',
  'Anno Primo',
  'Cuvée',
  'Heritage',
  'Lola',
  'One Point Five',
  'Relentless',
  'Reserve',
  'Selection',
  'Stella',
  'TD-9',
  'Vivien'
]);

// Region → Official Appellation mappings
const APPELLATION_MAP: Record<string, string> = {
  'barbaresco': 'Barbaresco DOCG',
  'barolo': 'Barolo DOCG',
  'burgenland': 'Burgenland',
  'etna': 'Etna DOC',
  'ghemme': 'Ghemme DOCG',
  'kamptal': 'Kamptal DAC',
  'napa-valley': 'Napa Valley AVA',
  'russian-river-valley': 'Russian River Valley AVA',
  'sonoma-coast': 'Sonoma Coast AVA',
  'valtellina': 'Valtellina Superiore DOCG',
  'vienna': 'Wien DAC',
  'wachau': 'Wachau DAC',
  'wagram': 'Wagram DAC',
};

/**
 * Infer region from producer name if region is missing
 */
function inferRegion(wine: WineRow): string {
  if (wine.Region && wine.Region.trim()) {
    return wine.Region;
  }

  // Try producer map
  if (wine.Producer && PRODUCER_REGION_MAP[wine.Producer]) {
    console.log(`  🔍 Inferred region from producer: ${PRODUCER_REGION_MAP[wine.Producer]}`);
    return PRODUCER_REGION_MAP[wine.Producer];
  }

  // Try extracting from wine name
  const wineName = wine['Wine Name'].toLowerCase();
  if (wineName.includes('etna')) return 'etna';
  if (wineName.includes('barolo')) return 'barolo';
  if (wineName.includes('barbaresco')) return 'barbaresco';
  if (wineName.includes('mosel')) return 'mosel';
  if (wineName.includes('wachau') || wineName.includes('smaragd') || wineName.includes('federspiel')) {
    console.log(`  🔍 Inferred wachau from wine name (Smaragd/Federspiel)`);
    return 'wachau';
  }

  return '';
}

/**
 * Check if vineyard should have a page created
 */
function shouldCreateVineyardPage(vineyardName: string, vineyardType: string | undefined): boolean {
  // Skip if vineyard_type explicitly says fantasy or brand
  if (vineyardType === 'fantasy' || vineyardType === 'brand') {
    return false;
  }

  // Skip if in fantasy names list
  if (FANTASY_NAMES.has(vineyardName)) {
    return false;
  }

  // Create page for real vineyards
  if (vineyardType === 'real') {
    return true;
  }

  // For unknown, default to creating (can query François later to refine)
  return true;
}

/**
 * Find or create producer in Sanity
 */
async function findOrCreateProducer(producerName: string): Promise<string> {
  const existing = await sanityClient.fetch(
    `*[_type == "producer" && name == $name][0]._id`,
    { name: producerName }
  );

  if (existing) return existing;

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

/**
 * Find or create vineyard in Sanity
 */
async function findOrCreateVineyard(vineyardName: string, regionSlug: string): Promise<string> {
  const existing = await sanityClient.fetch(
    `*[_type == "vineyard" && name == $name][0]._id`,
    { name: vineyardName }
  );

  if (existing) return existing;

  const newVineyard = await sanityClient.create({
    _type: 'vineyard',
    name: vineyardName,
    slug: {
      current: vineyardName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .substring(0, 96)
    },
    // TODO: Link to region when we have region reference
  });

  return newVineyard._id;
}

/**
 * Use François to fill in missing data for a wine
 */
async function fillMissingData(wine: WineRow): Promise<Partial<WineRow>> {
  const prompt = `You are a wine expert. Fill in missing information for this wine:

Wine: ${wine['Wine Name']}
Producer: ${wine.Producer}
Region: ${wine.Region || 'Unknown'}
Vineyard: ${wine.Vineyard || 'Unknown'}

Please provide:
1. Grape varieties (comma-separated)
2. Official appellation (DOC, DOCG, AOC, etc.)
3. Sub-region if applicable
4. Village if applicable

Return JSON:
{
  "grapes": "Grape variety/varieties",
  "appellation": "Official appellation",
  "subRegion": "Sub-region or null",
  "village": "Village or null"
}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 500,
      temperature: 0,
      messages: [{ role: 'user', content: prompt }]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return {};

    const result = JSON.parse(jsonMatch[0]);
    return {
      Grapes: result.grapes || wine.Grapes,
      Appellation: result.appellation || wine.Appellation,
      'Sub-Region': result.subRegion || wine['Sub-Region'],
      Village: result.village || wine.Village,
    };
  } catch (error) {
    console.error('François error:', error);
    return {};
  }
}

/**
 * Generate Wine Saint review from existing review
 */
async function generateWineSaintReview(wine: WineRow, score10: number | null): Promise<string> {
  const scoreText = score10 ? `Score: ${score10}/10` : 'Score: Not yet rated';

  const prompt = `You are Wine Saint. Rewrite this tasting note in Wine Saint technical style.

Wine: ${wine['Wine Name']}
Producer: ${wine.Producer}
${scoreText}

Original review:
${wine['Tasting Notes']}

Write a Wine Saint review (2-3 sentences):
- Technical wine terminology
- Focus on flavor, structure, texture
- NO producer history
- Natural, not templated`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 300,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    });

    return message.content[0].type === 'text' ? message.content[0].text : wine['Tasting Notes'];
  } catch (error) {
    console.error('Review generation error:', error);
    return wine['Tasting Notes'];
  }
}

/**
 * Import wines from CSV
 */
async function importWines(csvPath: string, dryRun: boolean = true) {
  console.log('🍷 WINE IMPORT PIPELINE');
  console.log('='.repeat(70));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE IMPORT'}\n`);

  // Read CSV
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const wines: WineRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  });

  console.log(`Found ${wines.length} wines to import\n`);

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;
  let vineyardsCreated = 0;
  let vineyardsSkipped = 0;

  for (let i = 0; i < wines.length; i++) {
    const wine = wines[i];
    console.log(`\n[${i + 1}/${wines.length}] ${wine['Wine Name']}`);

    // Skip if already imported
    if (wine.Sanity_Wine_ID) {
      console.log('  ⏭️  Already imported');
      skippedCount++;
      continue;
    }

    // Infer region if missing
    const regionToMatch = inferRegion(wine);
    wine.Region = regionToMatch; // Update wine object

    // Match region to WEG
    const wegRegion = matchRegion(regionToMatch);
    if (!wegRegion) {
      console.log(`  ⚠️  Region "${regionToMatch}" not found in WEG`);
    } else {
      console.log(`  ✅ Region matched: ${wegRegion.url}`);
    }

    // Convert score (handle ranges like "(96-98)")
    let score100: number;
    let score10: number | null = null;

    if (!wine.Score || wine.Score.trim() === '') {
      console.log(`  ⚠️  Missing score - will need manual review`);
    } else if (wine.Score.includes('-')) {
      // Handle score ranges: "(96-98)" → use midpoint
      const match = wine.Score.match(/(\d+)-(\d+)/);
      if (match) {
        const low = parseInt(match[1]);
        const high = parseInt(match[2]);
        score100 = Math.round((low + high) / 2);
        score10 = convertScore(score100);
        console.log(`  Score: ${wine.Score} (using ${score100}) → ${score10}/10`);
      } else {
        console.log(`  ⚠️  Could not parse score range: ${wine.Score}`);
      }
    } else {
      score100 = parseInt(wine.Score);
      if (isNaN(score100)) {
        console.log(`  ⚠️  Invalid score format: ${wine.Score}`);
      } else {
        score10 = convertScore(score100);
        console.log(`  Score: ${score100}/100 → ${score10}/10`);
      }
    }

    // Fill missing data if needed
    if (wine['Needs François'] === 'TRUE') {
      console.log('  🤖 Using François to fill missing data...');
      const filled = await fillMissingData(wine);
      Object.assign(wine, filled);
    }

    // Generate Wine Saint review
    console.log('  ✍️  Generating Wine Saint review...');
    const wineSaintReview = await generateWineSaintReview(wine, score10);

    if (dryRun) {
      console.log('  [DRY RUN] Would create:');
      console.log(`    - Producer: ${wine.Producer}`);
      console.log(`    - Wine: ${wine['Wine Name']}`);
      if (wine.Vineyard) console.log(`    - Vineyard: ${wine.Vineyard}`);
      console.log(`    - Review: ${wineSaintReview.substring(0, 80)}...`);
    } else {
      // Create actual Sanity documents
      try {
        // 1. Create/find producer
        console.log('  📝 Creating producer...');
        const producerId = await findOrCreateProducer(wine.Producer);

        // 2. Create/find vineyard if exists and should have page
        let vineyardId: string | null = null;
        if (wine.Vineyard && wine.Vineyard.trim()) {
          if (shouldCreateVineyardPage(wine.Vineyard, wine.vineyard_type)) {
            console.log(`  🍇 Creating vineyard: ${wine.Vineyard} (${wine.vineyard_type || 'unknown'})`);
            vineyardId = await findOrCreateVineyard(wine.Vineyard, regionToMatch);
            vineyardsCreated++;
          } else {
            console.log(`  ⚪ Skipping vineyard page: ${wine.Vineyard} (${wine.vineyard_type})`);
            vineyardsSkipped++;
          }
        }

        // 3. Populate appellation if not present
        if (!wine.Appellation && wegRegion && APPELLATION_MAP[wegRegion.slug]) {
          wine.Appellation = APPELLATION_MAP[wegRegion.slug];
        }

        // 4. Create wine document
        console.log('  🍷 Creating wine...');
        const wineDoc: any = {
          _type: 'wine',
          name: wine['Wine Name'],
          slug: {
            current: wine['Wine Name']
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/g, '')
              .substring(0, 96)
          },
          vintage: parseInt(wine.Vintage) || null,
          producer: { _type: 'reference', _ref: producerId },
          grapeVarieties: wine['Grape Varieties'] ? wine['Grape Varieties'].split(',').map(g => g.trim()) : [],
          wineType: wine['Color/Type'] || null,
          appellation: wine.Appellation || null,
          releasePrice: wine['Release Price'] || null,
        };

        // Add region reference if WEG match found
        if (wegRegion) {
          // Note: This would require finding the actual Sanity region document
          // For now, we'll skip this and handle region linking separately
          // wineDoc.region = { _type: 'reference', _ref: regionId };
        }

        // Add vineyard reference if exists
        if (vineyardId) {
          wineDoc.vineyard = { _type: 'reference', _ref: vineyardId };
        }

        const createdWine = await sanityClient.create(wineDoc);
        console.log(`  ✅ Wine created: ${createdWine._id}`);

        // 5. Create review document
        console.log('  📝 Creating review...');
        const reviewDoc = {
          _type: 'review',
          wine: {
            _type: 'reference',
            _ref: createdWine._id,
          },
          score: score10 || null,
          shortSummary: wineSaintReview.split('.')[0] + '.', // First sentence
          tastingNotes: wineSaintReview,
          reviewerName: wine.Reviewer || 'Wine Saint',
          reviewDate: wine['Review Date'] || new Date().toISOString().split('T')[0],
          isAiGenerated: true,
          originalReviewer: wine.Reviewer,
          originalScore: wine.Score,
          drinkingWindow: wine['Drinking Window'] || null,
        };

        const createdReview = await sanityClient.create(reviewDoc);
        console.log(`  ✅ Review created: ${createdReview._id}`);

        // 6. Write IDs back to wine object for CSV tracking
        wine.Sanity_Wine_ID = createdWine._id;
        wine.Sanity_Review_ID = createdReview._id;

        console.log('  ✅ Import complete for this wine');
        successCount++;

        // No delay - import as fast as possible
        // await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error: any) {
        console.error(`  ❌ Error creating Sanity documents: ${error.message}`);
        errorCount++;
      }
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total wines processed: ${wines.length}`);
  console.log(`✅ Successfully imported: ${successCount}`);
  console.log(`⏭️  Skipped (already imported): ${skippedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`🍇 Vineyards created: ${vineyardsCreated}`);
  console.log(`⚪ Vineyards skipped (fantasy/brand): ${vineyardsSkipped}`);
  console.log('='.repeat(70));

  // Write updated CSV with Sanity IDs (if live run)
  if (!dryRun) {
    console.log('\n📝 Updating CSV with Sanity IDs...');
    const updatedCsv = stringify(wines, {
      header: true,
      columns: Object.keys(wines[0])
    });
    const backupPath = csvPath.replace('.csv', '_backup.csv');
    fs.writeFileSync(backupPath, fs.readFileSync(csvPath));
    fs.writeFileSync(csvPath, updatedCsv);
    console.log(`✅ CSV updated with tracking IDs`);
    console.log(`📋 Backup saved to: ${backupPath}`);
  }
}

// Main
const csvPath = process.argv[2] || '/Users/jordanabraham/Desktop/wine_test_set_50.csv';
const dryRun = !process.argv.includes('--live');

importWines(csvPath, dryRun).catch(console.error);
