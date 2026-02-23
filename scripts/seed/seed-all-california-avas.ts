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
  established?: string;
  color?: string;
  slug?: string;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

// Color palette for sub-AVAs
const SUB_AVA_COLORS = [
  '#e63946', '#457b9d', '#2a9d8f', '#e9c46a', '#f4a261',
  '#6d597a', '#b5838d', '#588157', '#bc6c25', '#219ebc',
  '#8338ec', '#ff006e', '#3a86ff', '#fb5607', '#06d6a0',
  '#9b5de5', '#00bbf9', '#00f5d4', '#fee440', '#f15bb5',
];

// Major AVAs configuration with zoom levels
const MAJOR_AVAS = [
  { slug: 'napa-valley', file: 'napa_valley', zoom: 10, subDir: 'napa-valley-avas' },
  { slug: 'sonoma-county', file: null, zoom: 9, subDir: 'sonoma-county-avas', useSonomaCoast: true },
  { slug: 'mendocino', file: 'mendocino', zoom: 9, subDir: 'mendocino-avas' },
  { slug: 'paso-robles', file: 'paso_robles', zoom: 10, subDir: 'paso-robles-avas' },
  { slug: 'santa-barbara-county', file: null, zoom: 10, subDir: 'santa-barbara-county-avas', useSantaYnez: true },
  { slug: 'monterey', file: 'monterey', zoom: 9, subDir: 'monterey-avas' },
  { slug: 'central-coast', file: 'central_coast', zoom: 7, subDir: null },
  { slug: 'livermore-valley', file: 'livermore_valley', zoom: 11, subDir: null },
  { slug: 'santa-cruz-mountains', file: 'santa_cruz_mountains', zoom: 9, subDir: 'santa-cruz-mountains-avas' },
  { slug: 'lodi', file: 'lodi', zoom: 10, subDir: 'lodi-avas' },
  { slug: 'sierra-foothills', file: 'sierra_foothills', zoom: 9, subDir: 'sierra-foothills-avas' },
  { slug: 'lake-county', file: null, zoom: 10, subDir: 'lake-county-avas', useClearLake: true },
  { slug: 'temecula-valley', file: 'temecula_valley', zoom: 11, subDir: null },
];

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

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function seedAllAVAs() {
  console.log('🍇 Seeding all California AVAs to Sanity...\n');

  const dataDir = path.join(__dirname, '../data');
  const majorsDir = path.join(dataDir, 'major-avas');

  // Get California region reference
  let californiaRegion = await client.fetch(
    `*[_type == "region" && slug.current == "california"][0]{ _id }`
  );

  if (!californiaRegion) {
    console.log('Creating California region...');
    californiaRegion = await client.create({
      _type: 'region',
      name: 'California',
      slug: { _type: 'slug', current: 'california' },
      country: 'USA',
      description: 'California is the largest wine-producing state in the United States.',
    });
  }

  let majorCount = 0;
  let subCount = 0;

  // Process each major AVA
  for (const majorConfig of MAJOR_AVAS) {
    console.log(`\n📍 Processing ${majorConfig.slug}...`);

    let majorData: AVAData | null = null;
    let majorBoundarySource = majorConfig.file;

    // Try to load major AVA boundary
    if (majorConfig.file) {
      const majorPath = path.join(majorsDir, `${majorConfig.file}.json`);
      if (fs.existsSync(majorPath)) {
        majorData = JSON.parse(fs.readFileSync(majorPath, 'utf-8'));
      }
    }

    // For regions without a main boundary file, use a sub-AVA as reference
    if (!majorData && majorConfig.useSonomaCoast && majorConfig.subDir) {
      const sonomaCoastPath = path.join(dataDir, majorConfig.subDir, 'sonoma_coast.json');
      if (fs.existsSync(sonomaCoastPath)) {
        const data = JSON.parse(fs.readFileSync(sonomaCoastPath, 'utf-8'));
        data.name = 'Sonoma County';
        majorData = data;
        majorBoundarySource = 'sonoma_coast (approximation)';
      }
    }

    if (!majorData && majorConfig.useSantaYnez && majorConfig.subDir) {
      const santaYnezPath = path.join(dataDir, majorConfig.subDir, 'santa_ynez_valley.json');
      if (fs.existsSync(santaYnezPath)) {
        const data = JSON.parse(fs.readFileSync(santaYnezPath, 'utf-8'));
        data.name = 'Santa Barbara County';
        majorData = data;
        majorBoundarySource = 'santa_ynez_valley (approximation)';
      }
    }

    if (!majorData && majorConfig.useClearLake && majorConfig.subDir) {
      const clearLakePath = path.join(dataDir, majorConfig.subDir, 'clear_lake.json');
      if (fs.existsSync(clearLakePath)) {
        const data = JSON.parse(fs.readFileSync(clearLakePath, 'utf-8'));
        data.name = 'Lake County';
        majorData = data;
        majorBoundarySource = 'clear_lake (approximation)';
      }
    }

    if (!majorData) {
      console.log(`  ⚠️  No boundary data found for ${majorConfig.slug}, skipping...`);
      continue;
    }

    const center = calculateCentroid(majorData.geometry.coordinates);

    // Check if major AVA exists
    let majorAva = await client.fetch(
      `*[_type == "appellation" && slug.current == $slug][0]{ _id }`,
      { slug: majorConfig.slug }
    );

    const majorAvaData = {
      name: majorData.name,
      slug: { _type: 'slug', current: majorConfig.slug },
      parentRegion: { _type: 'reference', _ref: californiaRegion._id },
      level: 'major_ava',
      establishedYear: majorData.established ? new Date(majorData.established).getFullYear() : undefined,
      boundaries: {
        type: 'Feature',
        geometry: majorData.geometry,
        properties: {
          source: `UC Davis AVA Project (${majorBoundarySource})`,
          fillColor: majorData.color || '#666666',
        },
      },
      centerPoint: {
        longitude: center.longitude,
        latitude: center.latitude,
        defaultZoom: majorConfig.zoom,
      },
    };

    if (majorAva) {
      await client.patch(majorAva._id).set(majorAvaData).commit();
      console.log(`  ✓ Updated major AVA: ${majorData.name}`);
    } else {
      majorAva = await client.create({ _type: 'appellation', ...majorAvaData });
      console.log(`  ✓ Created major AVA: ${majorData.name}`);
    }
    majorCount++;

    // Process sub-AVAs if directory exists
    if (majorConfig.subDir) {
      const subDir = path.join(dataDir, majorConfig.subDir);
      if (fs.existsSync(subDir)) {
        const subFiles = fs.readdirSync(subDir).filter(f => f.endsWith('.json'));
        console.log(`  Processing ${subFiles.length} sub-AVAs...`);

        for (let i = 0; i < subFiles.length; i++) {
          const filename = subFiles[i];
          const subPath = path.join(subDir, filename);
          const subData: AVAData = JSON.parse(fs.readFileSync(subPath, 'utf-8'));

          const subSlug = nameToSlug(subData.name);
          const subCenter = calculateCentroid(subData.geometry.coordinates);
          const color = SUB_AVA_COLORS[i % SUB_AVA_COLORS.length];

          // Check if sub-AVA exists
          let subAva = await client.fetch(
            `*[_type == "appellation" && slug.current == $slug][0]{ _id }`,
            { slug: subSlug }
          );

          const subAvaData = {
            name: subData.name,
            slug: { _type: 'slug', current: subSlug },
            parentAppellation: { _type: 'reference', _ref: majorAva._id },
            level: 'sub_ava',
            establishedYear: subData.established ? new Date(subData.established).getFullYear() : undefined,
            boundaries: {
              type: 'Feature',
              geometry: subData.geometry,
              properties: {
                source: 'UC Davis AVA Project',
                fillColor: color,
              },
            },
            centerPoint: {
              longitude: subCenter.longitude,
              latitude: subCenter.latitude,
              defaultZoom: 12,
            },
          };

          if (subAva) {
            await client.patch(subAva._id).set(subAvaData).commit();
          } else {
            await client.create({ _type: 'appellation', ...subAvaData });
          }
          subCount++;
        }
        console.log(`  ✓ Processed ${subFiles.length} sub-AVAs`);
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Seeding complete!');
  console.log(`   Major AVAs: ${majorCount}`);
  console.log(`   Sub-AVAs: ${subCount}`);
  console.log(`   Total: ${majorCount + subCount}`);
  console.log('\n📍 View at: http://localhost:3000/maps');
}

seedAllAVAs().catch(console.error);
