import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// More precise spirit detection using regex patterns
function isActualSpirit(wine: any): boolean {
  const name = wine.name.toLowerCase();
  const producer = wine.producer?.name?.toLowerCase() || '';

  // Specific spirit patterns - must be more precise to avoid false positives
  const spiritPatterns = [
    /\beau-de-vie\b/,
    /\bbirnenbrand\b/,
    /\bschnaps\b/,
    /\bgrappa\b/,
    /\bmarc de (bourgogne|champagne)\b/,  // Only "marc de X", not just "marc"
    /\bkirsch\b/,
    /\bpoire williams\b/,  // Full phrase
    /\b(la )?poire\b/,  // Poire but not as part of other words
    /\bmirabelle\b/,
    /\bquitte\b/,
    /\bframboise\b/,
    /\bcalvados\b/,
  ];

  // Special exclusions
  const isWilliamsSelyem = name.includes('williams selyem') || producer.includes('williams selyem');
  if (isWilliamsSelyem) return false;

  // Don't flag if "marc" is just part of a producer name
  const hasMarc = name.includes('marc') || producer.includes('marc');
  const hasActualMarc = /\bmarc de (bourgogne|champagne)\b/.test(name) || /\bmarc de (bourgogne|champagne)\b/.test(producer);

  // If contains "marc" but not "marc de X", it's likely a producer name
  if (hasMarc && !hasActualMarc) return false;

  return spiritPatterns.some(pattern =>
    pattern.test(name) || pattern.test(producer)
  );
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  console.log('🥃 REMOVING SPIRITS FROM DATABASE');
  console.log('==================================');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE DELETE'}\n`);

  // Find potential spirits
  const reviews = await sanityClient.fetch(`
    *[_type == "review" && reviewerName == "WineSaint AI"] {
      _id,
      wine->{
        _id,
        name,
        producer->{name}
      }
    }
  `);

  console.log(`Checking ${reviews.length} reviews for spirits...\n`);

  const spiritsToRemove: any[] = [];

  for (const review of reviews) {
    if (isActualSpirit(review.wine)) {
      spiritsToRemove.push(review);
    }
  }

  console.log(`Found ${spiritsToRemove.length} spirits to remove:\n`);

  spiritsToRemove.forEach((r, i) => {
    console.log(`${i + 1}. ${r.wine.name}`);
    console.log(`   Producer: ${r.wine.producer?.name || 'Unknown'}`);
    console.log(`   Wine ID: ${r.wine._id}`);
    console.log(`   Review ID: ${r._id}\n`);
  });

  if (dryRun) {
    console.log('[DRY RUN] Run without --dry-run to delete these spirits');
    return;
  }

  console.log('Deleting spirits...\n');

  let deletedWines = 0;
  let deletedReviews = 0;

  for (const spirit of spiritsToRemove) {
    try {
      // Delete review first
      await sanityClient.delete(spirit._id);
      deletedReviews++;
      console.log(`✅ Deleted review: ${spirit._id}`);

      // Delete wine
      await sanityClient.delete(spirit.wine._id);
      deletedWines++;
      console.log(`✅ Deleted wine: ${spirit.wine._id}`);
    } catch (error: any) {
      console.error(`❌ Error deleting ${spirit.wine.name}: ${error.message}`);
    }
  }

  console.log('\n==================================');
  console.log('SUMMARY:');
  console.log(`Deleted ${deletedReviews} reviews`);
  console.log(`Deleted ${deletedWines} wines`);
}

main();
