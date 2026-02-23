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
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

const SUB_AVA_COLORS = [
  '#e63946', '#457b9d', '#2a9d8f', '#e9c46a', '#f4a261',
  '#6d597a', '#b5838d', '#588157', '#bc6c25', '#219ebc',
  '#8338ec', '#ff006e', '#3a86ff', '#fb5607', '#06d6a0',
];

function calculateCentroid(coordinates: number[][][]): { longitude: number; latitude: number } {
  const ring = coordinates[0];
  let sumLng = 0;
  let sumLat = 0;
  for (const coord of ring) {
    sumLng += coord[0];
    sumLat += coord[1];
  }
  return { longitude: sumLng / ring.length, latitude: sumLat / ring.length };
}

function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function getOrCreateAppellation(
  name: string,
  slug: string,
  data: AVAData,
  parentRef: string | null,
  level: 'major_ava' | 'sub_ava',
  color: string,
  zoom: number = 12
): Promise<string> {
  const center = calculateCentroid(data.geometry.coordinates);

  let existing = await client.fetch(
    `*[_type == "appellation" && slug.current == $slug][0]{ _id }`,
    { slug }
  );

  const appellationData: any = {
    name,
    slug: { _type: 'slug', current: slug },
    level,
    establishedYear: data.established ? new Date(data.established).getFullYear() : undefined,
    boundaries: {
      type: 'Feature',
      geometry: data.geometry,
      properties: { source: 'UC Davis AVA Project', fillColor: color },
    },
    centerPoint: { longitude: center.longitude, latitude: center.latitude, defaultZoom: zoom },
  };

  if (parentRef) {
    appellationData.parentAppellation = { _type: 'reference', _ref: parentRef };
  }

  if (existing) {
    await client.patch(existing._id).set(appellationData).commit();
    return existing._id;
  } else {
    const created = await client.create({ _type: 'appellation', ...appellationData });
    return created._id;
  }
}

async function seedMissingAVAs() {
  console.log('🍇 Seeding missing AVAs and fixing issues...\n');

  const dataDir = path.join(__dirname, '../data');

  // Get California region
  const californiaRegion = await client.fetch(
    `*[_type == "region" && slug.current == "california"][0]{ _id }`
  );

  // ============================================================
  // 1. CREATE SOUTH COAST REGION
  // ============================================================
  console.log('📍 SOUTH COAST REGION');

  const southCoastDir = path.join(dataDir, 'south-coast-avas');
  const southCoastFile = path.join(southCoastDir, 'south_coast.json');

  if (fs.existsSync(southCoastFile)) {
    const southCoastData: AVAData = JSON.parse(fs.readFileSync(southCoastFile, 'utf-8'));

    // Create South Coast as a major AVA (top-level)
    let southCoast = await client.fetch(
      `*[_type == "appellation" && slug.current == "south-coast"][0]{ _id }`
    );

    if (!southCoast) {
      const center = calculateCentroid(southCoastData.geometry.coordinates);
      southCoast = await client.create({
        _type: 'appellation',
        name: 'South Coast',
        slug: { _type: 'slug', current: 'south-coast' },
        parentRegion: { _type: 'reference', _ref: californiaRegion._id },
        level: 'major_ava',
        description: 'The South Coast AVA covers the wine regions of Southern California, including areas near Los Angeles and San Diego.',
        boundaries: {
          type: 'Feature',
          geometry: southCoastData.geometry,
          properties: { source: 'UC Davis AVA Project', fillColor: '#C41E3A' },
        },
        centerPoint: { longitude: center.longitude, latitude: center.latitude, defaultZoom: 8 },
      });
      console.log(`  ✓ Created South Coast (${southCoast._id})`);
    } else {
      console.log(`  ✓ South Coast exists (${southCoast._id})`);
    }

    // Update Temecula Valley to be under South Coast
    const temecula = await client.fetch(
      `*[_type == "appellation" && slug.current == "temecula-valley"][0]{ _id }`
    );
    if (temecula) {
      await client.patch(temecula._id)
        .set({ parentAppellation: { _type: 'reference', _ref: southCoast._id } })
        .commit();
      console.log('  ✓ Temecula Valley → South Coast');
    }

    // Add other South Coast sub-AVAs
    const southCoastSubs = [
      { file: 'malibu_coast.json', color: '#FF6B6B' },
      { file: 'san_pasqual_valley.json', color: '#4ECDC4' },
      { file: 'ramona_valley.json', color: '#45B7D1' },
      { file: 'cucamonga_valley.json', color: '#96CEB4' },
      { file: 'antelope_valley_of_the_california_high_desert.json', color: '#FFEAA7' },
      { file: 'leona_valley.json', color: '#DDA0DD' },
    ];

    for (const sub of southCoastSubs) {
      const filePath = path.join(southCoastDir, sub.file);
      if (fs.existsSync(filePath)) {
        const subData: AVAData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const slug = nameToSlug(subData.name);
        await getOrCreateAppellation(subData.name, slug, subData, southCoast._id, 'sub_ava', sub.color, 11);
        console.log(`  ✓ ${subData.name} → South Coast`);
      }
    }
  }

  // ============================================================
  // 2. CREATE INLAND / DELTA REGION
  // ============================================================
  console.log('\n📍 INLAND / DELTA REGION');

  const inlandDir = path.join(dataDir, 'inland-avas');

  // Clarksburg is significant enough to be a top-level major AVA
  const clarksburgFile = path.join(inlandDir, 'clarksburg.json');
  if (fs.existsSync(clarksburgFile)) {
    const clarksburgData: AVAData = JSON.parse(fs.readFileSync(clarksburgFile, 'utf-8'));
    const center = calculateCentroid(clarksburgData.geometry.coordinates);

    let clarksburg = await client.fetch(
      `*[_type == "appellation" && slug.current == "clarksburg"][0]{ _id }`
    );

    if (!clarksburg) {
      clarksburg = await client.create({
        _type: 'appellation',
        name: 'Clarksburg',
        slug: { _type: 'slug', current: 'clarksburg' },
        parentRegion: { _type: 'reference', _ref: californiaRegion._id },
        level: 'major_ava',
        description: 'Clarksburg AVA is located in the Sacramento River Delta, known for Chenin Blanc and Petite Sirah.',
        boundaries: {
          type: 'Feature',
          geometry: clarksburgData.geometry,
          properties: { source: 'UC Davis AVA Project', fillColor: '#3498DB' },
        },
        centerPoint: { longitude: center.longitude, latitude: center.latitude, defaultZoom: 10 },
      });
      console.log(`  ✓ Created Clarksburg (${clarksburg._id})`);
    } else {
      console.log(`  ✓ Clarksburg exists`);
    }

    // Add Merritt Island as sub-AVA of Clarksburg
    const merrittFile = path.join(inlandDir, 'merritt_island.json');
    if (fs.existsSync(merrittFile)) {
      const merrittData: AVAData = JSON.parse(fs.readFileSync(merrittFile, 'utf-8'));
      await getOrCreateAppellation('Merritt Island', 'merritt-island', merrittData, clarksburg._id, 'sub_ava', '#5DADE2', 12);
      console.log('  ✓ Merritt Island → Clarksburg');
    }
  }

  // Suisun Valley - standalone major AVA
  const suisunFile = path.join(inlandDir, 'suisun_valley.json');
  if (fs.existsSync(suisunFile)) {
    const suisunData: AVAData = JSON.parse(fs.readFileSync(suisunFile, 'utf-8'));
    const center = calculateCentroid(suisunData.geometry.coordinates);

    const existing = await client.fetch(
      `*[_type == "appellation" && slug.current == "suisun-valley"][0]{ _id }`
    );

    if (!existing) {
      await client.create({
        _type: 'appellation',
        name: 'Suisun Valley',
        slug: { _type: 'slug', current: 'suisun-valley' },
        parentRegion: { _type: 'reference', _ref: californiaRegion._id },
        level: 'major_ava',
        description: 'Suisun Valley is located between Napa Valley and the Sacramento Delta, known for Petite Sirah and Cabernet Sauvignon.',
        boundaries: {
          type: 'Feature',
          geometry: suisunData.geometry,
          properties: { source: 'UC Davis AVA Project', fillColor: '#27AE60' },
        },
        centerPoint: { longitude: center.longitude, latitude: center.latitude, defaultZoom: 11 },
      });
      console.log('  ✓ Created Suisun Valley');
    } else {
      console.log('  ✓ Suisun Valley exists');
    }
  }

  // Solano County Green Valley - standalone
  const greenValleyFile = path.join(inlandDir, 'solano_county_green_valley.json');
  if (fs.existsSync(greenValleyFile)) {
    const greenValleyData: AVAData = JSON.parse(fs.readFileSync(greenValleyFile, 'utf-8'));
    const center = calculateCentroid(greenValleyData.geometry.coordinates);

    const existing = await client.fetch(
      `*[_type == "appellation" && slug.current == "solano-county-green-valley"][0]{ _id }`
    );

    if (!existing) {
      await client.create({
        _type: 'appellation',
        name: 'Solano County Green Valley',
        slug: { _type: 'slug', current: 'solano-county-green-valley' },
        parentRegion: { _type: 'reference', _ref: californiaRegion._id },
        level: 'major_ava',
        boundaries: {
          type: 'Feature',
          geometry: greenValleyData.geometry,
          properties: { source: 'UC Davis AVA Project', fillColor: '#16A085' },
        },
        centerPoint: { longitude: center.longitude, latitude: center.latitude, defaultZoom: 11 },
      });
      console.log('  ✓ Created Solano County Green Valley');
    }
  }

  // Capay Valley and Dunnigan Hills - Yolo County
  for (const avaName of ['capay_valley', 'dunnigan_hills']) {
    const file = path.join(inlandDir, `${avaName}.json`);
    if (fs.existsSync(file)) {
      const data: AVAData = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const slug = nameToSlug(data.name);
      const center = calculateCentroid(data.geometry.coordinates);

      const existing = await client.fetch(
        `*[_type == "appellation" && slug.current == $slug][0]{ _id }`,
        { slug }
      );

      if (!existing) {
        await client.create({
          _type: 'appellation',
          name: data.name,
          slug: { _type: 'slug', current: slug },
          parentRegion: { _type: 'reference', _ref: californiaRegion._id },
          level: 'major_ava',
          boundaries: {
            type: 'Feature',
            geometry: data.geometry,
            properties: { source: 'UC Davis AVA Project', fillColor: '#F39C12' },
          },
          centerPoint: { longitude: center.longitude, latitude: center.latitude, defaultZoom: 11 },
        });
        console.log(`  ✓ Created ${data.name}`);
      }
    }
  }

  // ============================================================
  // 3. FIX LAKE COUNTY - ADD MISSING SUB-AVAs
  // ============================================================
  console.log('\n📍 LAKE COUNTY - Adding missing sub-AVAs');

  const lakeCounty = await client.fetch(
    `*[_type == "appellation" && slug.current == "lake-county"][0]{ _id }`
  );

  if (lakeCounty) {
    const retryDir = path.join(dataDir, 'retry-avas');
    const lakeCountySubs = [
      { file: 'big_valley_district_lake_county.json', color: '#3498DB' },
      { file: 'kelsey_bench_lake_county.json', color: '#9B59B6' },
    ];

    for (const sub of lakeCountySubs) {
      const filePath = path.join(retryDir, sub.file);
      if (fs.existsSync(filePath)) {
        const subData: AVAData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const slug = nameToSlug(subData.name);
        await getOrCreateAppellation(subData.name, slug, subData, lakeCounty._id, 'sub_ava', sub.color);
        console.log(`  ✓ ${subData.name} → Lake County`);
      }
    }
  }

  // ============================================================
  // 4. FIX SONOMA - ADD PINE MOUNTAIN-CLOVERDALE PEAK
  // ============================================================
  console.log('\n📍 SONOMA COUNTY - Adding Pine Mountain-Cloverdale Peak');

  const sonomaCounty = await client.fetch(
    `*[_type == "appellation" && slug.current == "sonoma-county"][0]{ _id }`
  );

  if (sonomaCounty) {
    const retryDir = path.join(dataDir, 'retry-avas');
    const pineFile = path.join(retryDir, 'pine_mountain_cloverdale_peak.json');
    if (fs.existsSync(pineFile)) {
      const pineData: AVAData = JSON.parse(fs.readFileSync(pineFile, 'utf-8'));
      await getOrCreateAppellation(pineData.name, 'pine-mountain-cloverdale-peak', pineData, sonomaCounty._id, 'sub_ava', '#8E44AD');
      console.log(`  ✓ ${pineData.name} → Sonoma County`);
    }
  }

  // ============================================================
  // 5. FIX LOS CARNEROS - SHOW UNDER BOTH NAPA AND SONOMA
  // ============================================================
  console.log('\n📍 FIXING LOS CARNEROS (spans Napa & Sonoma)');

  // Get Los Carneros data
  const losCarnerosNapa = await client.fetch(
    `*[_type == "appellation" && slug.current == "los-carneros"][0]{ _id, boundaries, centerPoint }`
  );

  const napaValley = await client.fetch(
    `*[_type == "appellation" && slug.current == "napa-valley"][0]{ _id }`
  );

  if (losCarnerosNapa && sonomaCounty) {
    // Los Carneros already exists under Napa, create a reference for Sonoma side
    // We'll update the description to note it spans both regions
    await client.patch(losCarnerosNapa._id)
      .set({
        description: 'Los Carneros spans both Napa and Sonoma counties, known for cool-climate Pinot Noir and Chardonnay. This AVA straddles the county line at the southern end of both valleys.',
      })
      .commit();
    console.log('  ✓ Updated Los Carneros description');

    // Create a duplicate entry for Sonoma with a different slug
    const existingSonomaCarneros = await client.fetch(
      `*[_type == "appellation" && slug.current == "carneros-sonoma"][0]{ _id }`
    );

    if (!existingSonomaCarneros && losCarnerosNapa.boundaries) {
      await client.create({
        _type: 'appellation',
        name: 'Los Carneros (Sonoma)',
        slug: { _type: 'slug', current: 'carneros-sonoma' },
        parentAppellation: { _type: 'reference', _ref: sonomaCounty._id },
        level: 'sub_ava',
        description: 'The Sonoma County portion of Los Carneros AVA, known for cool-climate Pinot Noir and Chardonnay.',
        boundaries: losCarnerosNapa.boundaries,
        centerPoint: losCarnerosNapa.centerPoint,
      });
      console.log('  ✓ Created Los Carneros (Sonoma) → Sonoma County');
    } else {
      console.log('  ✓ Los Carneros (Sonoma) already exists');
    }

    // Rename original to clarify it's Napa side
    await client.patch(losCarnerosNapa._id)
      .set({ name: 'Los Carneros (Napa)' })
      .commit();
    console.log('  ✓ Renamed original to Los Carneros (Napa)');
  }

  console.log('\n✅ All missing AVAs seeded and issues fixed!');
}

seedMissingAVAs().catch(console.error);
