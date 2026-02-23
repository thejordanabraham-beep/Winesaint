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
  // Get 10 sample wines to see structure
  const wines = await sanityClient.fetch(`
    *[_type == "wine"][0...10] {
      name,
      vintage,
      producer->{name},
      region->{name}
    }
  `);

  console.log('EXISTING WINE NAME FORMAT:\n');
  wines.forEach((w: any) => {
    console.log(`Name: "${w.name}"`);
    console.log(`Vintage: ${w.vintage}`);
    console.log(`Producer: ${w.producer?.name}`);
    console.log(`Region: ${w.region?.name}`);
    console.log('---');
  });
}

main();
