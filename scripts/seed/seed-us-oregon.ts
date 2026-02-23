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

async function seedUSAndOregon() {
  console.log('🍇 Setting up United States → California/Oregon structure...\n');

  const dataDir = path.join(__dirname, '../data');

  // ============================================================
  // 1. CREATE UNITED STATES (top-level)
  // ============================================================
  console.log('📍 UNITED STATES');

  let unitedStates = await client.fetch(
    `*[_type == "appellation" && slug.current == "united-states"][0]{ _id }`
  );

  if (!unitedStates) {
    unitedStates = await client.create({
      _type: 'appellation',
      name: 'United States',
      slug: { _type: 'slug', current: 'united-states' },
      description: 'American Viticultural Areas (AVAs) - the official wine grape-growing regions of the United States.',
      centerPoint: { longitude: -98.5, latitude: 39.8, defaultZoom: 4 },
    });
    console.log(`  ✓ Created United States (${unitedStates._id})`);
  } else {
    console.log(`  ✓ United States exists (${unitedStates._id})`);
  }

  // ============================================================
  // 2. SET UP CALIFORNIA AS STATE
  // ============================================================
  console.log('\n📍 CALIFORNIA STATE');

  // Get California appellation and update it to be a state under US
  let california = await client.fetch(
    `*[_type == "appellation" && slug.current == "california"][0]{ _id }`
  );

  const californiaData = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'california_simplified.json'), 'utf-8')
  );

  if (california) {
    await client.patch(california._id)
      .set({
        name: 'California',
        parentAppellation: { _type: 'reference', _ref: unitedStates._id },
        level: 'state',
        boundaries: {
          type: 'Feature',
          geometry: californiaData,
          properties: { source: 'Natural Earth', fillColor: '#C5A572' },
        },
        centerPoint: { longitude: -119.4, latitude: 37.5, defaultZoom: 6 },
      })
      .unset(['parentRegion'])
      .commit();
    console.log(`  ✓ Updated California as state under US`);
  } else {
    california = await client.create({
      _type: 'appellation',
      name: 'California',
      slug: { _type: 'slug', current: 'california' },
      parentAppellation: { _type: 'reference', _ref: unitedStates._id },
      level: 'state',
      description: 'California is the largest wine-producing state in the United States, with over 150 AVAs.',
      boundaries: {
        type: 'Feature',
        geometry: californiaData,
        properties: { source: 'Natural Earth', fillColor: '#C5A572' },
      },
      centerPoint: { longitude: -119.4, latitude: 37.5, defaultZoom: 6 },
    });
    console.log(`  ✓ Created California as state`);
  }

  // Update all California major AVAs to point to California as parent
  console.log('  Updating California major AVAs...');
  const californiaMajorAvas = await client.fetch(
    `*[_type == "appellation" && level == "major_ava" && !defined(parentAppellation)]{ _id, name }`
  );

  for (const ava of californiaMajorAvas) {
    await client.patch(ava._id)
      .set({ parentAppellation: { _type: 'reference', _ref: california._id } })
      .commit();
  }
  console.log(`  ✓ Updated ${californiaMajorAvas.length} major AVAs to reference California`);

  // ============================================================
  // 3. CREATE OREGON STATE
  // ============================================================
  console.log('\n📍 OREGON STATE');

  const oregonMajorDir = path.join(dataDir, 'oregon-major-avas');
  const willametteFile = path.join(oregonMajorDir, 'willamette_valley.json');

  if (!fs.existsSync(willametteFile)) {
    console.log('  ⚠️ Oregon AVA data not found. Run download-oregon-avas.ts first.');
    return;
  }

  // Use Willamette Valley boundary as approximation for Oregon wine region
  const willametteData: AVAData = JSON.parse(fs.readFileSync(willametteFile, 'utf-8'));
  const oregonCenter = calculateCentroid(willametteData.geometry.coordinates);

  let oregon = await client.fetch(
    `*[_type == "appellation" && slug.current == "oregon"][0]{ _id }`
  );

  if (!oregon) {
    oregon = await client.create({
      _type: 'appellation',
      name: 'Oregon',
      slug: { _type: 'slug', current: 'oregon' },
      parentAppellation: { _type: 'reference', _ref: unitedStates._id },
      level: 'state',
      description: 'Oregon is renowned for its Pinot Noir, particularly from the Willamette Valley. The state has a cool climate ideal for Burgundian varietals.',
      boundaries: {
        type: 'Feature',
        geometry: willametteData.geometry,
        properties: { source: 'Approximation from Willamette Valley', fillColor: '#2E5A1C' },
      },
      centerPoint: { longitude: oregonCenter.longitude, latitude: oregonCenter.latitude, defaultZoom: 7 },
    });
    console.log(`  ✓ Created Oregon (${oregon._id})`);
  } else {
    await client.patch(oregon._id)
      .set({
        parentAppellation: { _type: 'reference', _ref: unitedStates._id },
        level: 'state',
      })
      .commit();
    console.log(`  ✓ Oregon exists, updated parent`);
  }

  // ============================================================
  // 4. CREATE OREGON MAJOR AVAs
  // ============================================================
  console.log('\n📍 OREGON MAJOR AVAs');

  const oregonMajorAvas = [
    { file: 'willamette_valley.json', color: '#4A7C2F', zoom: 8 },
    { file: 'southern_oregon.json', color: '#8B4513', zoom: 9 },
    { file: 'columbia_gorge.json', color: '#4682B4', zoom: 10 },
    { file: 'columbia_valley.json', color: '#6B8E23', zoom: 8 },
    { file: 'walla_walla_valley.json', color: '#B8860B', zoom: 10 },
    { file: 'snake_river_valley.json', color: '#CD853F', zoom: 9 },
  ];

  const majorAvaIds: Record<string, string> = {};

  for (const config of oregonMajorAvas) {
    const filePath = path.join(oregonMajorDir, config.file);
    if (!fs.existsSync(filePath)) continue;

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
      parentAppellation: { _type: 'reference', _ref: oregon._id },
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
  // 5. CREATE WILLAMETTE VALLEY SUB-AVAs
  // ============================================================
  console.log('\n📍 WILLAMETTE VALLEY SUB-AVAs');

  const willametteDir = path.join(dataDir, 'willamette-valley-avas');
  if (fs.existsSync(willametteDir) && majorAvaIds['willamette-valley']) {
    const files = fs.readdirSync(willametteDir).filter(f => f.endsWith('.json'));

    for (let i = 0; i < files.length; i++) {
      const filePath = path.join(willametteDir, files[i]);
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
        parentAppellation: { _type: 'reference', _ref: majorAvaIds['willamette-valley'] },
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

  // ============================================================
  // 6. CREATE SOUTHERN OREGON SUB-AVAs
  // ============================================================
  console.log('\n📍 SOUTHERN OREGON SUB-AVAs');

  const southernDir = path.join(dataDir, 'southern-oregon-avas');
  if (fs.existsSync(southernDir) && majorAvaIds['southern-oregon']) {
    const files = fs.readdirSync(southernDir).filter(f => f.endsWith('.json'));

    for (let i = 0; i < files.length; i++) {
      const filePath = path.join(southernDir, files[i]);
      const data: AVAData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const slug = nameToSlug(data.name);
      const center = calculateCentroid(data.geometry.coordinates);
      const color = SUB_AVA_COLORS[(i + 10) % SUB_AVA_COLORS.length];

      let existing = await client.fetch(
        `*[_type == "appellation" && slug.current == $slug][0]{ _id }`,
        { slug }
      );

      const subData = {
        name: data.name,
        slug: { _type: 'slug', current: slug },
        parentAppellation: { _type: 'reference', _ref: majorAvaIds['southern-oregon'] },
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

  console.log('\n✅ Complete!');
  console.log('\nNew hierarchy:');
  console.log('United States');
  console.log('├── California (112+ AVAs)');
  console.log('│   ├── North Coast → Napa, Sonoma, etc.');
  console.log('│   ├── Central Coast → Paso Robles, etc.');
  console.log('│   └── ...');
  console.log('└── Oregon (24+ AVAs)');
  console.log('    ├── Willamette Valley → Dundee Hills, etc.');
  console.log('    ├── Southern Oregon → Rogue Valley, etc.');
  console.log('    └── ...');
  console.log('\n📍 View at: http://localhost:3000/maps');
}

seedUSAndOregon().catch(console.error);
