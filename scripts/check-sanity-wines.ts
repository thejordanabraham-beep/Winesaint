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
  const count = await sanityClient.fetch('count(*[_type == "wine"])');
  console.log('Total wines in Sanity:', count);

  const withAI = await sanityClient.fetch('count(*[_type == "wine" && hasAiReview == true])');
  console.log('Wines with AI reviews:', withAI);

  const withVineyards = await sanityClient.fetch('count(*[_type == "wine" && defined(vineyard)])');
  console.log('Wines linked to vineyards:', withVineyards);
}

main();
