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

interface RegionData {
  name: string;
  established?: string;
  description?: string;
  color?: string;
  zoom?: number;
  geometry: { type: 'Polygon'; coordinates: number[][][] };
}

function calculateCentroid(coordinates: number[][][]): { longitude: number; latitude: number } {
  const ring = coordinates[0];
  let sumLng = 0, sumLat = 0;
  for (const coord of ring) { sumLng += coord[0]; sumLat += coord[1]; }
  return { longitude: sumLng / ring.length, latitude: sumLat / ring.length };
}

function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function seedEuropeAndFrance() {
  console.log('🍷 Setting up Europe → France wine region structure...\n');

  const dataDir = path.join(__dirname, '../data');

  // ============================================================
  // 1. CREATE EUROPE (top-level continent)
  // ============================================================
  console.log('📍 EUROPE');

  let europe = await client.fetch(
    `*[_type == "appellation" && slug.current == "europe"][0]{ _id }`
  );

  if (!europe) {
    europe = await client.create({
      _type: 'appellation',
      name: 'Europe',
      slug: { _type: 'slug', current: 'europe' },
      level: 'continent',
      description: 'The birthplace of wine culture, home to France, Italy, Spain, and many other renowned wine-producing nations.',
      centerPoint: { longitude: 5, latitude: 47, defaultZoom: 4 },
    });
    console.log(`  ✓ Created Europe (${europe._id})`);
  } else {
    console.log(`  ✓ Europe exists (${europe._id})`);
  }

  // ============================================================
  // 2. CREATE FRANCE (country under Europe)
  // ============================================================
  console.log('\n📍 FRANCE');

  const franceBoundaryPath = path.join(dataDir, 'france_country.json');
  let franceBoundary = null;
  let franceCenter = { longitude: 2.2, latitude: 46.6 };

  if (fs.existsSync(franceBoundaryPath)) {
    franceBoundary = JSON.parse(fs.readFileSync(franceBoundaryPath, 'utf-8'));
    franceCenter = calculateCentroid(franceBoundary.coordinates);
  }

  let france = await client.fetch(
    `*[_type == "appellation" && slug.current == "france"][0]{ _id }`
  );

  if (!france) {
    france = await client.create({
      _type: 'appellation',
      name: 'France',
      slug: { _type: 'slug', current: 'france' },
      parentAppellation: { _type: 'reference', _ref: europe._id },
      level: 'country',
      description: 'France is the most prestigious wine-producing country in the world, with regions like Bordeaux, Burgundy, Champagne, and the Rhône Valley.',
      boundaries: franceBoundary ? {
        type: 'Feature',
        geometry: franceBoundary,
        properties: { source: 'Natural Earth', fillColor: '#002395' },
      } : undefined,
      centerPoint: { longitude: franceCenter.longitude, latitude: franceCenter.latitude, defaultZoom: 5 },
    });
    console.log(`  ✓ Created France (${france._id})`);
  } else {
    await client.patch(france._id)
      .set({
        parentAppellation: { _type: 'reference', _ref: europe._id },
        level: 'country',
        boundaries: franceBoundary ? {
          type: 'Feature',
          geometry: franceBoundary,
          properties: { source: 'Natural Earth', fillColor: '#002395' },
        } : undefined,
        centerPoint: { longitude: franceCenter.longitude, latitude: franceCenter.latitude, defaultZoom: 5 },
      })
      .commit();
    console.log(`  ✓ France exists, updated`);
  }

  // ============================================================
  // 3. CREATE FRENCH MAJOR WINE REGIONS
  // ============================================================
  console.log('\n📍 FRENCH WINE REGIONS');

  const majorDir = path.join(dataDir, 'france-major-regions');
  const majorRegionIds: Record<string, string> = {};

  if (fs.existsSync(majorDir)) {
    const files = fs.readdirSync(majorDir).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(majorDir, file);
      const data: RegionData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const slug = nameToSlug(data.name);
      const center = calculateCentroid(data.geometry.coordinates);

      let existing = await client.fetch(
        `*[_type == "appellation" && slug.current == $slug][0]{ _id }`,
        { slug }
      );

      const regionData = {
        name: data.name,
        slug: { _type: 'slug', current: slug },
        parentAppellation: { _type: 'reference', _ref: france._id },
        level: 'major_ava',
        description: data.description,
        establishedYear: data.established ? new Date(data.established).getFullYear() : undefined,
        boundaries: {
          type: 'Feature',
          geometry: data.geometry,
          properties: { source: 'Approximate boundaries', fillColor: data.color || '#722F37' },
        },
        centerPoint: { longitude: center.longitude, latitude: center.latitude, defaultZoom: data.zoom || 9 },
      };

      if (existing) {
        await client.patch(existing._id).set(regionData).commit();
        majorRegionIds[slug] = existing._id;
        console.log(`  ✓ Updated ${data.name}`);
      } else {
        const created = await client.create({ _type: 'appellation', ...regionData });
        majorRegionIds[slug] = created._id;
        console.log(`  ✓ Created ${data.name}`);
      }
    }
  }

  // ============================================================
  // 4. CREATE BORDEAUX SUB-APPELLATIONS
  // ============================================================
  console.log('\n📍 BORDEAUX APPELLATIONS');

  const bordeauxDir = path.join(dataDir, 'bordeaux-appellations');
  if (fs.existsSync(bordeauxDir) && majorRegionIds['bordeaux']) {
    const files = fs.readdirSync(bordeauxDir).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(bordeauxDir, file);
      const data: RegionData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const slug = nameToSlug(data.name);
      const center = calculateCentroid(data.geometry.coordinates);

      let existing = await client.fetch(
        `*[_type == "appellation" && slug.current == $slug][0]{ _id }`,
        { slug }
      );

      const subData = {
        name: data.name,
        slug: { _type: 'slug', current: slug },
        parentAppellation: { _type: 'reference', _ref: majorRegionIds['bordeaux'] },
        level: 'sub_ava',
        description: data.description,
        establishedYear: data.established ? new Date(data.established).getFullYear() : undefined,
        boundaries: {
          type: 'Feature',
          geometry: data.geometry,
          properties: { source: 'Approximate boundaries', fillColor: data.color || '#8B0000' },
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
  // 5. CREATE BURGUNDY SUB-APPELLATIONS
  // ============================================================
  console.log('\n📍 BURGUNDY APPELLATIONS');

  const burgundyDir = path.join(dataDir, 'burgundy-appellations');
  if (fs.existsSync(burgundyDir) && majorRegionIds['burgundy']) {
    const files = fs.readdirSync(burgundyDir).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(burgundyDir, file);
      const data: RegionData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const slug = nameToSlug(data.name);
      const center = calculateCentroid(data.geometry.coordinates);

      let existing = await client.fetch(
        `*[_type == "appellation" && slug.current == $slug][0]{ _id }`,
        { slug }
      );

      const subData = {
        name: data.name,
        slug: { _type: 'slug', current: slug },
        parentAppellation: { _type: 'reference', _ref: majorRegionIds['burgundy'] },
        level: 'sub_ava',
        description: data.description,
        establishedYear: data.established ? new Date(data.established).getFullYear() : undefined,
        boundaries: {
          type: 'Feature',
          geometry: data.geometry,
          properties: { source: 'Approximate boundaries', fillColor: data.color || '#800020' },
        },
        centerPoint: { longitude: center.longitude, latitude: center.latitude, defaultZoom: 10 },
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
  // 6. CREATE RHÔNE SUB-APPELLATIONS
  // ============================================================
  console.log('\n📍 RHÔNE APPELLATIONS');

  const rhoneDir = path.join(dataDir, 'rhone-appellations');
  if (fs.existsSync(rhoneDir) && majorRegionIds['rh-ne-valley']) {
    const files = fs.readdirSync(rhoneDir).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(rhoneDir, file);
      const data: RegionData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const slug = nameToSlug(data.name);
      const center = calculateCentroid(data.geometry.coordinates);

      let existing = await client.fetch(
        `*[_type == "appellation" && slug.current == $slug][0]{ _id }`,
        { slug }
      );

      const subData = {
        name: data.name,
        slug: { _type: 'slug', current: slug },
        parentAppellation: { _type: 'reference', _ref: majorRegionIds['rh-ne-valley'] },
        level: 'sub_ava',
        description: data.description,
        establishedYear: data.established ? new Date(data.established).getFullYear() : undefined,
        boundaries: {
          type: 'Feature',
          geometry: data.geometry,
          properties: { source: 'Approximate boundaries', fillColor: data.color || '#5D3A3A' },
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

  console.log('\n✅ Europe & France complete!');
  console.log('\nFrance hierarchy:');
  console.log('Europe');
  console.log('└── France');
  console.log('    ├── Bordeaux');
  console.log('    │   ├── Médoc');
  console.log('    │   ├── Saint-Émilion');
  console.log('    │   ├── Pomerol');
  console.log('    │   └── ...');
  console.log('    ├── Burgundy');
  console.log('    │   ├── Côte de Nuits');
  console.log('    │   ├── Côte de Beaune');
  console.log('    │   ├── Chablis');
  console.log('    │   └── ...');
  console.log('    ├── Champagne');
  console.log('    ├── Rhône Valley');
  console.log('    │   ├── Côte-Rôtie');
  console.log('    │   ├── Hermitage');
  console.log('    │   └── Châteauneuf-du-Pape');
  console.log('    ├── Loire Valley');
  console.log('    ├── Alsace');
  console.log('    ├── Provence');
  console.log('    └── Languedoc-Roussillon');
  console.log('\n📍 View at: http://localhost:3000/maps/europe/france');
}

seedEuropeAndFrance().catch(console.error);
