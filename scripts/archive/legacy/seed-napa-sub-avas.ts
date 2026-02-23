import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'hj3ee4sp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

interface AVAData {
  name: string;
  established: string;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

// Color palette for sub-AVAs
const COLORS = [
  '#e63946', '#457b9d', '#2a9d8f', '#e9c46a', '#f4a261',
  '#6d597a', '#b5838d', '#588157', '#bc6c25', '#219ebc',
  '#8338ec', '#ff006e', '#3a86ff', '#fb5607', '#06d6a0',
  '#9b5de5',
];

// Calculate centroid from polygon coordinates
function calculateCentroid(coordinates: number[][][]): { longitude: number; latitude: number } {
  const ring = coordinates[0];
  let sumLng = 0;
  let sumLat = 0;

  for (const coord of ring) {
    sumLng += coord[0];
    sumLat += coord[1];
  }

  return {
    longitude: sumLng / ring.length,
    latitude: sumLat / ring.length,
  };
}

// Convert filename to readable name (as backup)
function filenameToName(filename: string): string {
  return filename
    .replace('.json', '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Convert name to slug
function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function seedNapaSubAVAs() {
  console.log('🍇 Seeding all Napa Valley sub-AVAs...\n');

  // First, get the Napa Valley appellation ID
  const napaValley = await client.fetch(
    `*[_type == "appellation" && slug.current == "napa-valley"][0]{ _id, name }`
  );

  if (!napaValley) {
    console.error('❌ Napa Valley appellation not found. Run seed-california-hierarchy.ts first.');
    process.exit(1);
  }

  console.log(`✓ Found Napa Valley appellation (${napaValley._id})\n`);

  // Read all AVA files
  const avaDir = path.join(__dirname, '../data/napa-avas');
  const files = fs.readdirSync(avaDir).filter(f => f.endsWith('.json'));

  console.log(`Found ${files.length} sub-AVA files to process:\n`);

  let created = 0;
  let updated = 0;

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const filePath = path.join(avaDir, filename);
    const data: AVAData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const name = data.name || filenameToName(filename);
    const slug = nameToSlug(name);
    const center = calculateCentroid(data.geometry.coordinates);
    const establishedYear = data.established ? new Date(data.established).getFullYear() : undefined;
    const color = COLORS[i % COLORS.length];

    console.log(`Processing ${name}...`);

    // Check if this appellation already exists
    const existing = await client.fetch(
      `*[_type == "appellation" && slug.current == $slug][0]{ _id }`,
      { slug }
    );

    const appellationData = {
      name,
      slug: { _type: 'slug', current: slug },
      parentAppellation: { _type: 'reference', _ref: napaValley._id },
      level: 'sub_ava',
      establishedYear,
      boundaries: {
        type: 'Feature',
        geometry: data.geometry,
        properties: {
          source: 'UC Davis AVA Project',
          fillColor: color,
        },
      },
      centerPoint: {
        longitude: center.longitude,
        latitude: center.latitude,
        defaultZoom: 12,
      },
    };

    if (existing) {
      await client.patch(existing._id)
        .set(appellationData)
        .commit();
      console.log(`  ✓ Updated (${existing._id})`);
      updated++;
    } else {
      const created_doc = await client.create({
        _type: 'appellation',
        ...appellationData,
      });
      console.log(`  ✓ Created (${created_doc._id})`);
      created++;
    }
  }

  console.log('\n✅ Sub-AVA seeding complete!');
  console.log(`   Created: ${created}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Total: ${files.length}`);

  console.log('\nNapa Valley sub-AVAs:');
  for (const file of files) {
    const data: AVAData = JSON.parse(fs.readFileSync(path.join(avaDir, file), 'utf-8'));
    console.log(`  └── ${data.name}`);
  }

  console.log('\n📍 View: http://localhost:3000/maps/california/napa-valley');
}

seedNapaSubAVAs().catch(console.error);
