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

async function main() {
  // Update WineSaint AI reviews to clear hasAiReview flag so generate-reviews.ts will pick them up
  const wines = await sanityClient.fetch(`
    *[_type == "review" && reviewerName == "WineSaint AI"][0...3] {
      wine->{_id}
    }
  `);

  console.log(`Found ${wines.length} wines with WineSaint AI reviews`);

  for (const review of wines) {
    await sanityClient.patch(review.wine._id).set({ hasAiReview: false }).commit();
  }

  console.log('Updated wines - they should now be picked up by generate-reviews.ts');
}

main();
