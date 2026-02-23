import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function main() {
  const wine = await sanityClient.fetch(`
    *[_type == 'wine' && producer->name match 'Opus One*' && vintage == 2020][0] {
      _id,
      name,
      vintage,
      producer->{name}
    }
  `);

  if (!wine) {
    console.log('Wine not found');
    return;
  }

  console.log('Wine:', wine.name, wine.vintage);
  console.log('Producer:', wine.producer.name);
  console.log();

  const review = await sanityClient.fetch(`
    *[_type == 'review' && wine._ref == $wineId][0] {
      _id,
      score,
      reviewerName,
      tastingNotes,
      shortSummary,
      flavorProfile
    }
  `, { wineId: wine._id });

  if (review) {
    console.log('EXISTING REVIEW:');
    console.log('================');
    console.log('Reviewer:', review.reviewerName);
    console.log('Score:', review.score);
    console.log('Summary:', review.shortSummary || 'N/A');
    console.log();
    console.log('Tasting Notes:');
    console.log(review.tastingNotes);
    console.log();
    console.log('Flavor Profile:', review.flavorProfile?.join(', ') || 'N/A');
  } else {
    console.log('No review found for this wine');
  }
}

main();
