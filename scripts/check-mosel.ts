import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('/Users/jordanabraham/wine-reviews', '.env.local') });

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function run() {
  // Check ALL documents with mosel slug
  const all = await sanity.fetch(`*[_type == 'appellation' && slug.current == 'mosel']{ _id, name, 'geoType': boundaries.geometry.type, 'rings': length(boundaries.geometry.coordinates) }`);
  console.log('All mosel docs:', JSON.stringify(all, null, 2));

  // Check what the children query returns for Germany
  const children = await sanity.fetch(`*[_type == 'appellation' && parentAppellation._ref in *[_type=='appellation' && slug.current=='germany']._id] | order(name asc) { 'slug': slug.current, 'geoType': boundaries.geometry.type, 'rings': length(boundaries.geometry.coordinates) }`);
  console.log('\nGermany children:', JSON.stringify(children, null, 2));
}

run().catch(console.error);
