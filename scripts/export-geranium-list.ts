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
});

async function main() {
  const reviews = await sanityClient.fetch(`
    *[_type == "review" && reviewerName == "WineSaint AI"] | order(wine->producer->name asc, wine->name asc) {
      _id,
      wine->{
        _id,
        name,
        vintage,
        producer->{name},
        region->{name}
      }
    }
  `);

  console.log(`Found ${reviews.length} wines\n`);

  // TXT format
  let txtContent = `GERANIUM WINES - ${reviews.length} total\n`;
  txtContent += `Generated: ${new Date().toISOString()}\n`;
  txtContent += '='.repeat(80) + '\n\n';

  reviews.forEach((r: any, i: number) => {
    txtContent += `${i + 1}. ${r.wine.name}\n`;
    txtContent += `   Producer: ${r.wine.producer?.name || 'Unknown'}\n`;
    txtContent += `   Vintage: ${r.wine.vintage || 'NV'}\n`;
    txtContent += `   Region: ${r.wine.region?.name || 'Unknown'}\n`;
    txtContent += `   Wine ID: ${r.wine._id}\n`;
    txtContent += `   Review ID: ${r._id}\n\n`;
  });

  fs.writeFileSync('/tmp/geranium-wines.txt', txtContent);
  console.log('✅ Created: /tmp/geranium-wines.txt');

  // CSV format
  let csvContent = 'Number,Wine Name,Producer,Vintage,Region,Wine ID,Review ID\n';

  reviews.forEach((r: any, i: number) => {
    const escape = (str: any) => `"${String(str || '').replace(/"/g, '""')}"`;
    const vintage = r.wine.vintage ? String(r.wine.vintage) : 'NV';
    csvContent += `${i + 1},${escape(r.wine.name)},${escape(r.wine.producer?.name || 'Unknown')},${escape(vintage)},${escape(r.wine.region?.name || 'Unknown')},${r.wine._id},${r._id}\n`;
  });

  fs.writeFileSync('/tmp/geranium-wines.csv', csvContent);
  console.log('✅ Created: /tmp/geranium-wines.csv');
}

main();
