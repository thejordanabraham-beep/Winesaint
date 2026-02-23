/**
 * Auto-Categorize Wines
 *
 * This script processes existing wines in Sanity and automatically
 * links them to climats based on their names.
 *
 * Usage:
 *   npm run auto-categorize       # Preview only (dry run)
 *   npm run auto-categorize:apply # Actually update the wines
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.join(__dirname, '../.env.local') });

// Sanity client setup
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
});

interface Wine {
  _id: string;
  name: string;
  vintage?: number;
  producer?: { name: string };
  region?: { name: string };
  climat?: any;
}

interface Climat {
  _id: string;
  name: string;
  appellation: { name: string };
  classification: string;
}

interface Match {
  wineId: string;
  wineName: string;
  climatId: string;
  climatName: string;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

/**
 * Fetch all wines from Sanity
 */
async function fetchWines(): Promise<Wine[]> {
  try {
    const wines = await client.fetch(`
      *[_type == "wine"] {
        _id,
        name,
        vintage,
        producer->{name},
        region->{name},
        climat
      }
    `);
    return wines;
  } catch (error) {
    console.error('Error fetching wines:', error);
    return [];
  }
}

/**
 * Fetch all climats from Sanity
 */
async function fetchClimats(): Promise<Climat[]> {
  try {
    const climats = await client.fetch(`
      *[_type == "climat"] {
        _id,
        name,
        appellation->{name},
        classification
      }
    `);
    return climats;
  } catch (error) {
    console.error('Error fetching climats:', error);
    return [];
  }
}

/**
 * Try to match a wine to a climat
 */
function findClimatMatch(wine: Wine, climats: Climat[]): Match | null {
  const wineName = wine.name.toLowerCase();

  // Try exact climat name match
  for (const climat of climats) {
    const climatName = climat.name.toLowerCase();

    // Exact match
    if (wineName.includes(climatName)) {
      return {
        wineId: wine._id,
        wineName: wine.name,
        climatId: climat._id,
        climatName: climat.name,
        confidence: 'high',
        reason: `Exact match: wine name contains "${climat.name}"`,
      };
    }

    // Try without "Les" / "Le" / "La"
    const climatBase = climatName
      .replace(/^les?\s+/i, '')
      .replace(/^la\s+/i, '')
      .replace(/^le\s+/i, '');

    if (climatBase && wineName.includes(climatBase)) {
      return {
        wineId: wine._id,
        wineName: wine.name,
        climatId: climat._id,
        climatName: climat.name,
        confidence: 'medium',
        reason: `Partial match: wine name contains base "${climatBase}" from "${climat.name}"`,
      };
    }
  }

  // Try appellation match (less confident)
  for (const climat of climats) {
    const appellationName = climat.appellation?.name?.toLowerCase();
    if (appellationName && wineName.includes(appellationName)) {
      // But only if it's a Grand Cru with same name as appellation
      if (climat.classification === 'grand_cru' && wineName.includes(climat.name.toLowerCase())) {
        return {
          wineId: wine._id,
          wineName: wine.name,
          climatId: climat._id,
          climatName: climat.name,
          confidence: 'medium',
          reason: `Appellation + Grand Cru match`,
        };
      }
    }
  }

  return null;
}

/**
 * Apply matches to Sanity
 */
async function applyMatches(matches: Match[], dryRun: boolean = true): Promise<void> {
  console.log(`\n${dryRun ? '🔍 DRY RUN MODE' : '✏️  APPLYING CHANGES'} - Processing ${matches.length} matches\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const match of matches) {
    try {
      if (!dryRun) {
        await client
          .patch(match.wineId)
          .set({ climat: { _type: 'reference', _ref: match.climatId } })
          .commit();
      }

      console.log(`${dryRun ? '📋' : '✅'} ${match.wineName}`);
      console.log(`   → Climat: ${match.climatName}`);
      console.log(`   → Confidence: ${match.confidence}`);
      console.log(`   → Reason: ${match.reason}\n`);

      successCount++;
    } catch (error) {
      console.error(`❌ Error updating ${match.wineName}:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ ${successCount} wines ${dryRun ? 'would be' : 'were'} updated`);
  console.log(`   ❌ ${errorCount} errors`);

  if (dryRun) {
    console.log('\n💡 To apply these changes, run: npm run auto-categorize:apply');
  }
}

/**
 * Main execution
 */
async function main() {
  const dryRun = !process.argv.includes('--apply');

  console.log('🍷 Auto-Categorize Wines by Climat\n');

  // Fetch data
  console.log('📥 Fetching wines from Sanity...');
  const wines = await fetchWines();
  console.log(`   Found ${wines.length} wines\n`);

  console.log('📥 Fetching climats from Sanity...');
  const climats = await fetchClimats();
  console.log(`   Found ${climats.length} climats\n`);

  if (wines.length === 0 || climats.length === 0) {
    console.error('❌ No wines or climats found. Make sure you have:');
    console.error('   1. Imported climats (npm run import-climats)');
    console.error('   2. Created some wines in Sanity');
    return;
  }

  // Find matches
  console.log('🔍 Finding climat matches...\n');
  const matches: Match[] = [];
  const winesToUpdate = wines.filter(w => !w.climat); // Only wines without climats

  for (const wine of winesToUpdate) {
    const match = findClimatMatch(wine, climats);
    if (match) {
      matches.push(match);
    }
  }

  console.log(`\n📈 Found ${matches.length} potential matches out of ${winesToUpdate.length} wines without climats\n`);

  // Group by confidence
  const highConfidence = matches.filter(m => m.confidence === 'high');
  const mediumConfidence = matches.filter(m => m.confidence === 'medium');
  const lowConfidence = matches.filter(m => m.confidence === 'low');

  console.log(`   🟢 High confidence: ${highConfidence.length}`);
  console.log(`   🟡 Medium confidence: ${mediumConfidence.length}`);
  console.log(`   🟠 Low confidence: ${lowConfidence.length}\n`);

  if (matches.length === 0) {
    console.log('No matches found. This could mean:');
    console.log('  - Wine names don\'t match any imported climats');
    console.log('  - All wines already have climats assigned');
    console.log('  - Wine names need different patterns (non-Burgundy wines?)');
    return;
  }

  // Apply matches
  await applyMatches(matches, dryRun);
}

// Run
main()
  .then(() => {
    console.log('\n✅ Auto-categorization complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
