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
  geometry: { type: 'Polygon'; coordinates: number[][][] };
}

const SUB_AVA_COLORS = [
  '#e63946', '#457b9d', '#2a9d8f', '#e9c46a', '#f4a261',
  '#6d597a', '#b5838d', '#588157', '#bc6c25', '#219ebc',
  '#8338ec', '#ff006e', '#3a86ff', '#fb5607', '#06d6a0',
];

function calculateCentroid(coordinates: number[][][]): { longitude: number; latitude: number } {
  const ring = coordinates[0];
  let sumLng = 0, sumLat = 0;
  for (const coord of ring) { sumLng += coord[0]; sumLat += coord[1]; }
  return { longitude: sumLng / ring.length, latitude: sumLat / ring.length };
}

function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function seedWashington() {
  console.log('🍇 Setting up Washington wine regions...\n');

  const dataDir = path.join(__dirname, '../data');

  // Get United States reference
  const unitedStates = await client.fetch(
    `*[_type == "appellation" && slug.current == "united-states"][0]{ _id }`
  );

  if (!unitedStates) {
    console.log('❌ United States not found. Run seed-us-oregon.ts first.');
    return;
  }

  // ============================================================
  // 1. CREATE WASHINGTON STATE
  // ============================================================
  console.log('📍 WASHINGTON STATE');

  const washingtonBoundary = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'washington_state.json'), 'utf-8')
  );
  const waCenter = calculateCentroid(washingtonBoundary.coordinates);

  let washington = await client.fetch(
    `*[_type == "appellation" && slug.current == "washington"][0]{ _id }`
  );

  if (!washington) {
    washington = await client.create({
      _type: 'appellation',
      name: 'Washington',
      slug: { _type: 'slug', current: 'washington' },
      parentAppellation: { _type: 'reference', _ref: unitedStates._id },
      level: 'state',
      description: 'Washington is the second-largest wine-producing state in the US, known for Cabernet Sauvignon, Merlot, Syrah, and Riesling. The Columbia Valley dominates production.',
      boundaries: {
        type: 'Feature',
        geometry: washingtonBoundary,
        properties: { source: 'US Census', fillColor: '#4A5568' },
      },
      centerPoint: { longitude: waCenter.longitude, latitude: waCenter.latitude, defaultZoom: 6 },
    });
    console.log(`  ✓ Created Washington (${washington._id})`);
  } else {
    await client.patch(washington._id)
      .set({
        parentAppellation: { _type: 'reference', _ref: unitedStates._id },
        level: 'state',
        boundaries: {
          type: 'Feature',
          geometry: washingtonBoundary,
          properties: { source: 'US Census', fillColor: '#4A5568' },
        },
        centerPoint: { longitude: waCenter.longitude, latitude: waCenter.latitude, defaultZoom: 6 },
      })
      .commit();
    console.log(`  ✓ Washington exists, updated`);
  }

  // ============================================================
  // 2. CREATE WASHINGTON MAJOR AVAs
  // ============================================================
  console.log('\n📍 WASHINGTON MAJOR AVAs');

  const majorDir = path.join(dataDir, 'washington-major-avas');
  const washingtonMajorAvas = [
    { file: 'columbia_valley.json', color: '#5B8C5A', zoom: 7 },
    { file: 'puget_sound.json', color: '#4682B4', zoom: 9 },
    { file: 'columbia_gorge.json', color: '#8B7355', zoom: 10 },
  ];

  const majorAvaIds: Record<string, string> = {};

  for (const config of washingtonMajorAvas) {
    const filePath = path.join(majorDir, config.file);
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠️ ${config.file} not found`);
      continue;
    }

    const data: AVAData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const slug = nameToSlug(data.name);
    const center = calculateCentroid(data.geometry.coordinates);

    let existing = await client.fetch(
      `*[_type == "appellation" && slug.current == $slug][0]{ _id }`,
      { slug }
    );

    const avaData = {
      name: data.name,
      slug: { _type: 'slug', current: slug },
      parentAppellation: { _type: 'reference', _ref: washington._id },
      level: 'major_ava',
      establishedYear: data.established ? new Date(data.established).getFullYear() : undefined,
      boundaries: {
        type: 'Feature',
        geometry: data.geometry,
        properties: { source: 'UC Davis AVA Project', fillColor: config.color },
      },
      centerPoint: { longitude: center.longitude, latitude: center.latitude, defaultZoom: config.zoom },
    };

    if (existing) {
      await client.patch(existing._id).set(avaData).commit();
      majorAvaIds[slug] = existing._id;
      console.log(`  ✓ Updated ${data.name}`);
    } else {
      const created = await client.create({ _type: 'appellation', ...avaData });
      majorAvaIds[slug] = created._id;
      console.log(`  ✓ Created ${data.name}`);
    }
  }

  // ============================================================
  // 3. CREATE COLUMBIA VALLEY SUB-AVAs
  // ============================================================
  console.log('\n📍 COLUMBIA VALLEY SUB-AVAs');

  const columbiaDir = path.join(dataDir, 'columbia-valley-avas');
  if (fs.existsSync(columbiaDir) && majorAvaIds['columbia-valley']) {
    const files = fs.readdirSync(columbiaDir).filter(f => f.endsWith('.json'));

    for (let i = 0; i < files.length; i++) {
      const filePath = path.join(columbiaDir, files[i]);
      const data: AVAData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const slug = nameToSlug(data.name);
      const center = calculateCentroid(data.geometry.coordinates);
      const color = SUB_AVA_COLORS[i % SUB_AVA_COLORS.length];

      let existing = await client.fetch(
        `*[_type == "appellation" && slug.current == $slug][0]{ _id }`,
        { slug }
      );

      const subData = {
        name: data.name,
        slug: { _type: 'slug', current: slug },
        parentAppellation: { _type: 'reference', _ref: majorAvaIds['columbia-valley'] },
        level: 'sub_ava',
        establishedYear: data.established ? new Date(data.established).getFullYear() : undefined,
        boundaries: {
          type: 'Feature',
          geometry: data.geometry,
          properties: { source: 'UC Davis AVA Project', fillColor: color },
        },
        centerPoint: { longitude: center.longitude, latitude: center.latitude, defaultZoom: 11 },
      };

      if (existing) {
        await client.patch(existing._id).set(subData).commit();
      } else {
        await client.create({ _type: 'appellation', ...subData });
      }
      console.log(`  ✓ ${data.name}`);
    }
  }

  console.log('\n✅ Washington complete!');
  console.log('\nWashington hierarchy:');
  console.log('Washington');
  console.log('├── Columbia Valley (14+ sub-AVAs)');
  console.log('│   ├── Yakima Valley');
  console.log('│   ├── Walla Walla Valley');
  console.log('│   ├── Red Mountain');
  console.log('│   └── ...');
  console.log('├── Puget Sound');
  console.log('└── Columbia Gorge');
  console.log('\n📍 View at: http://localhost:3000/maps/united-states/washington');
}

seedWashington().catch(console.error);
