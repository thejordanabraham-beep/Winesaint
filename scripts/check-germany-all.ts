import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function run() {
  const slugs = ['franken', 'rheingau', 'hessische-bergstrasse', 'saale-unstrut', 'sachsen-wine', 'wurttemberg', 'baden'];
  const results = await sanity.fetch(
    `*[_type == 'appellation' && slug.current in $slugs] | order(name asc) {
      name,
      'slug': slug.current,
      'geoType': boundaries.geometry.type,
      'rings': length(boundaries.geometry.coordinates),
      'ring0len': length(boundaries.geometry.coordinates[0]),
      'ring0x0type': select(
        boundaries.geometry.type == 'MultiPolygon' => 'mp',
        'poly'
      )
    }`,
    { slugs }
  );
  console.log(JSON.stringify(results, null, 2));
}

run().catch(console.error);
