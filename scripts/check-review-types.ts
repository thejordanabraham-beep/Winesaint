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
  // Count separate review documents
  const reviewDocs = await sanityClient.fetch('count(*[_type == "review"])');
  console.log('Separate review documents:', reviewDocs);

  // Count wines with aiReview field
  const winesWithAiReview = await sanityClient.fetch('count(*[_type == "wine" && defined(aiReview)])');
  console.log('Wines with aiReview field:', winesWithAiReview);

  // Sample wine with aiReview but no review doc
  const sampleWithAi = await sanityClient.fetch(`
    *[_type == "wine" && defined(aiReview)][0] {
      _id,
      name,
      vintage,
      hasAiReview,
      aiReview,
      "reviewDocCount": count(*[_type == "review" && wine._ref == ^._id])
    }
  `);

  console.log('\nSample wine with aiReview:');
  console.log('Name:', sampleWithAi.name);
  console.log('Vintage:', sampleWithAi.vintage);
  console.log('Has AI Review flag:', sampleWithAi.hasAiReview);
  console.log('AI Review length:', sampleWithAi.aiReview?.length, 'chars');
  console.log('Review documents for this wine:', sampleWithAi.reviewDocCount);
}

main();
