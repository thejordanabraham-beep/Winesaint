import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'hj3ee4sp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

interface AppellationData {
  name: string;
  slug: string;
  established?: number;
  description?: string;
  color?: string;
  zoom?: number;
  totalAcreage?: number;
  primaryGrapes?: string[];
  geometry: { type: 'Polygon'; coordinates: number[][][] };
}

function calculateCentroid(coordinates: number[][][]): { longitude: number; latitude: number } {
  const ring = coordinates[0];
  let sumLng = 0, sumLat = 0;
  for (const coord of ring) { sumLng += coord[0]; sumLat += coord[1]; }
  return { longitude: sumLng / ring.length, latitude: sumLat / ring.length };
}

async function seedRhoneAOP() {
  console.log('🍷 Setting up Rhône Valley AOP hierarchy...\n');
  console.log('Structure: France → Rhône Valley → Northern/Southern Rhône → AOC Appellations\n');

  const dataDir = path.join(__dirname, '../data');

  // ============================================================
  // 1. ENSURE FRANCE EXISTS
  // ============================================================
  console.log('📍 Verifying France...');

  let france = await client.fetch(
    `*[_type == "appellation" && slug.current == "france"][0]{ _id, name }`
  );

  if (!france) {
    console.log('  ⚠ France not found - creating...');
    france = await client.create({
      _type: 'appellation',
      name: 'France',
      slug: { _type: 'slug', current: 'france' },
      level: 'country',
      description: 'France is the most prestigious wine-producing country in the world.',
      centerPoint: { longitude: 2.2, latitude: 46.6, defaultZoom: 5 },
    });
  }
  console.log(`  ✓ France exists (${france._id})\n`);

  // ============================================================
  // 2. GET OR CREATE RHÔNE VALLEY (state level under France)
  // ============================================================
  console.log('📍 RHÔNE VALLEY');

  let rhoneValley = await client.fetch(
    `*[_type == "appellation" && slug.current == "rhone-valley"][0]{ _id }`
  );

  // Check with alternative slug
  if (!rhoneValley) {
    rhoneValley = await client.fetch(
      `*[_type == "appellation" && slug.current == "rh-ne-valley"][0]{ _id }`
    );
  }

  const rhoneData = {
    name: 'Rhône Valley',
    slug: { _type: 'slug', current: 'rhone-valley' },
    parentAppellation: { _type: 'reference', _ref: france._id },
    level: 'state',
    description: 'The Rhône Valley stretches from Lyon to Avignon, producing renowned Syrah and Grenache-based wines. Divided into Northern and Southern regions with distinct terroirs and styles.',
    centerPoint: { longitude: 4.75, latitude: 44.6, defaultZoom: 7 },
  };

  if (rhoneValley) {
    await client.patch(rhoneValley._id).set(rhoneData).commit();
    console.log(`  ✓ Updated Rhône Valley (${rhoneValley._id})`);
  } else {
    rhoneValley = await client.create({ _type: 'appellation', ...rhoneData });
    console.log(`  ✓ Created Rhône Valley (${rhoneValley._id})`);
  }

  // ============================================================
  // 3. CREATE NORTHERN RHÔNE (sub_region)
  // ============================================================
  console.log('\n📍 NORTHERN RHÔNE');

  const northernDataPath = path.join(dataDir, 'france-sub-regions/rhone/northern-rhone.json');
  const northernData: AppellationData = JSON.parse(fs.readFileSync(northernDataPath, 'utf-8'));
  const northernCenter = calculateCentroid(northernData.geometry.coordinates);

  let northernRhone = await client.fetch(
    `*[_type == "appellation" && slug.current == "northern-rhone"][0]{ _id }`
  );

  const northernDoc = {
    name: northernData.name,
    slug: { _type: 'slug', current: northernData.slug },
    parentAppellation: { _type: 'reference', _ref: rhoneValley._id },
    level: 'sub_region',
    description: northernData.description,
    boundaries: {
      type: 'Feature',
      geometry: northernData.geometry,
      properties: { source: 'AOP boundaries', fillColor: northernData.color },
    },
    centerPoint: { longitude: northernCenter.longitude, latitude: northernCenter.latitude, defaultZoom: northernData.zoom || 9 },
  };

  if (northernRhone) {
    await client.patch(northernRhone._id).set(northernDoc).commit();
    console.log(`  ✓ Updated Northern Rhône (${northernRhone._id})`);
  } else {
    northernRhone = await client.create({ _type: 'appellation', ...northernDoc });
    console.log(`  ✓ Created Northern Rhône (${northernRhone._id})`);
  }

  // ============================================================
  // 4. CREATE SOUTHERN RHÔNE (sub_region)
  // ============================================================
  console.log('\n📍 SOUTHERN RHÔNE');

  const southernDataPath = path.join(dataDir, 'france-sub-regions/rhone/southern-rhone.json');
  const southernData: AppellationData = JSON.parse(fs.readFileSync(southernDataPath, 'utf-8'));
  const southernCenter = calculateCentroid(southernData.geometry.coordinates);

  let southernRhone = await client.fetch(
    `*[_type == "appellation" && slug.current == "southern-rhone"][0]{ _id }`
  );

  const southernDoc = {
    name: southernData.name,
    slug: { _type: 'slug', current: southernData.slug },
    parentAppellation: { _type: 'reference', _ref: rhoneValley._id },
    level: 'sub_region',
    description: southernData.description,
    boundaries: {
      type: 'Feature',
      geometry: southernData.geometry,
      properties: { source: 'AOP boundaries', fillColor: southernData.color },
    },
    centerPoint: { longitude: southernCenter.longitude, latitude: southernCenter.latitude, defaultZoom: southernData.zoom || 9 },
  };

  if (southernRhone) {
    await client.patch(southernRhone._id).set(southernDoc).commit();
    console.log(`  ✓ Updated Southern Rhône (${southernRhone._id})`);
  } else {
    southernRhone = await client.create({ _type: 'appellation', ...southernDoc });
    console.log(`  ✓ Created Southern Rhône (${southernRhone._id})`);
  }

  // ============================================================
  // 5. CREATE NORTHERN RHÔNE APPELLATIONS (8 AOCs)
  // ============================================================
  console.log('\n📍 NORTHERN RHÔNE APPELLATIONS');

  const northernAppDir = path.join(dataDir, 'france-appellations/rhone/northern');
  const northernFiles = fs.readdirSync(northernAppDir).filter(f => f.endsWith('.json'));

  for (const file of northernFiles) {
    const filePath = path.join(northernAppDir, file);
    const appData: AppellationData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const center = calculateCentroid(appData.geometry.coordinates);

    let existing = await client.fetch(
      `*[_type == "appellation" && slug.current == $slug][0]{ _id }`,
      { slug: appData.slug }
    );

    const appDoc = {
      name: appData.name,
      slug: { _type: 'slug', current: appData.slug },
      parentAppellation: { _type: 'reference', _ref: northernRhone._id },
      level: 'major_ava',
      description: appData.description,
      establishedYear: appData.established,
      totalAcreage: appData.totalAcreage,
      boundaries: {
        type: 'Feature',
        geometry: appData.geometry,
        properties: { source: 'AOP boundaries', fillColor: appData.color },
      },
      centerPoint: { longitude: center.longitude, latitude: center.latitude, defaultZoom: appData.zoom || 12 },
    };

    if (existing) {
      await client.patch(existing._id).set(appDoc).commit();
      console.log(`  ✓ Updated ${appData.name}`);
    } else {
      await client.create({ _type: 'appellation', ...appDoc });
      console.log(`  ✓ Created ${appData.name}`);
    }
  }

  // ============================================================
  // 6. CREATE SOUTHERN RHÔNE APPELLATIONS (9 AOCs)
  // ============================================================
  console.log('\n📍 SOUTHERN RHÔNE APPELLATIONS');

  const southernAppDir = path.join(dataDir, 'france-appellations/rhone/southern');
  const southernFiles = fs.readdirSync(southernAppDir).filter(f => f.endsWith('.json'));

  for (const file of southernFiles) {
    const filePath = path.join(southernAppDir, file);
    const appData: AppellationData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const center = calculateCentroid(appData.geometry.coordinates);

    let existing = await client.fetch(
      `*[_type == "appellation" && slug.current == $slug][0]{ _id }`,
      { slug: appData.slug }
    );

    const appDoc = {
      name: appData.name,
      slug: { _type: 'slug', current: appData.slug },
      parentAppellation: { _type: 'reference', _ref: southernRhone._id },
      level: 'major_ava',
      description: appData.description,
      establishedYear: appData.established,
      totalAcreage: appData.totalAcreage,
      boundaries: {
        type: 'Feature',
        geometry: appData.geometry,
        properties: { source: 'AOP boundaries', fillColor: appData.color },
      },
      centerPoint: { longitude: center.longitude, latitude: center.latitude, defaultZoom: appData.zoom || 12 },
    };

    if (existing) {
      await client.patch(existing._id).set(appDoc).commit();
      console.log(`  ✓ Updated ${appData.name}`);
    } else {
      await client.create({ _type: 'appellation', ...appDoc });
      console.log(`  ✓ Created ${appData.name}`);
    }
  }

  // ============================================================
  // 7. CLEAN UP OLD RHÔNE APPELLATIONS (move under correct parent)
  // ============================================================
  console.log('\n📍 CLEANING UP OLD RHÔNE STRUCTURE');

  // Check if there are old appellations directly under Rhône Valley that should be moved
  const oldApps = await client.fetch(`
    *[_type == "appellation" && parentAppellation._ref == $rhoneId && level == "sub_ava"]{ _id, name, slug }
  `, { rhoneId: rhoneValley._id });

  for (const oldApp of oldApps) {
    // Determine if this should be Northern or Southern
    const isNorthern = ['cote-rotie', 'condrieu', 'hermitage', 'crozes-hermitage', 'cornas', 'saint-joseph', 'saint-peray', 'chateau-grillet'].includes(oldApp.slug?.current);
    const newParent = isNorthern ? northernRhone._id : southernRhone._id;

    await client.patch(oldApp._id)
      .set({
        parentAppellation: { _type: 'reference', _ref: newParent },
        level: 'major_ava',
      })
      .commit();
    console.log(`  ✓ Moved ${oldApp.name} to ${isNorthern ? 'Northern' : 'Southern'} Rhône`);
  }

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log('\n✅ Rhône Valley AOP hierarchy complete!\n');
  console.log('Hierarchy:');
  console.log('France');
  console.log('└── Rhône Valley');
  console.log('    ├── Northern Rhône');
  console.log('    │   ├── Côte-Rôtie');
  console.log('    │   ├── Condrieu');
  console.log('    │   ├── Château-Grillet');
  console.log('    │   ├── Saint-Joseph');
  console.log('    │   ├── Hermitage');
  console.log('    │   ├── Crozes-Hermitage');
  console.log('    │   ├── Cornas');
  console.log('    │   └── Saint-Péray');
  console.log('    └── Southern Rhône');
  console.log('        ├── Châteauneuf-du-Pape');
  console.log('        ├── Gigondas');
  console.log('        ├── Vacqueyras');
  console.log('        ├── Beaumes-de-Venise');
  console.log('        ├── Rasteau');
  console.log('        ├── Lirac');
  console.log('        ├── Tavel');
  console.log('        ├── Côtes du Rhône');
  console.log('        └── Côtes du Rhône Villages');
  console.log('\n📍 View at: http://localhost:3000/maps/europe/france/rhone-valley');
}

seedRhoneAOP().catch(console.error);
