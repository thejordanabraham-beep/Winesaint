import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const csvPath = path.join(process.env.HOME!, 'Desktop', 'geranium-wines.csv');

  console.log('🗑️  DELETE MARKED WINES');
  console.log('='.repeat(70));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE DELETE'}\n`);

  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found at:', csvPath);
    return;
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n');

  // Skip header
  const dataLines = lines.slice(1);

  const toDelete: Array<{ name: string; producer: string; wineId: string; reviewId: string; note: string }> = [];

  for (const line of dataLines) {
    if (!line.trim()) continue;

    // Simple CSV split (Numbers export doesn't use quotes anymore)
    const fields = line.split(',');
    if (fields.length < 8) continue;

    const wineName = fields[1];
    const producer = fields[2];
    const wineId = fields[5];
    const reviewId = fields[6];
    const deleteNote = fields[7] ? fields[7].trim() : '';

    // If column H has content, mark for deletion
    if (deleteNote) {
      toDelete.push({
        name: wineName,
        producer: producer,
        wineId: wineId,
        reviewId: reviewId,
        note: deleteNote
      });
    }
  }

  console.log(`Found ${toDelete.length} wines marked for deletion:\n`);

  toDelete.forEach((item, i) => {
    console.log(`${i + 1}. ${item.name}`);
    console.log(`   Producer: ${item.producer}`);
    console.log(`   Note: ${item.note}`);
    console.log(`   Wine ID: ${item.wineId}`);
    console.log(`   Review ID: ${item.reviewId}\n`);
  });

  if (dryRun) {
    console.log('[DRY RUN] Run without --dry-run to delete these wines');
    return;
  }

  console.log('Deleting wines...\n');

  let deletedReviews = 0;
  let deletedWines = 0;

  for (const item of toDelete) {
    try {
      // Delete review first
      await sanityClient.delete(item.reviewId);
      deletedReviews++;
      console.log(`✅ Deleted review: ${item.reviewId}`);

      // Delete wine
      await sanityClient.delete(item.wineId);
      deletedWines++;
      console.log(`✅ Deleted wine: ${item.wineId}`);
    } catch (error: any) {
      console.error(`❌ Error deleting ${item.name}: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('SUMMARY:');
  console.log(`Deleted ${deletedReviews} reviews`);
  console.log(`Deleted ${deletedWines} wines`);
}

main();
