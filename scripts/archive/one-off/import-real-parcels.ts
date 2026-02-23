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

// Color palette for vineyard parcels
const COLORS = [
  '#e63946', '#457b9d', '#2a9d8f', '#e9c46a', '#f4a261',
  '#6d597a', '#b5838d', '#588157', '#bc6c25', '#219ebc',
  '#8338ec', '#ff006e', '#3a86ff', '#fb5607', '#06d6a0',
];

// Load parcel data
const parcelsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/howell_mountain_vineyard_parcels.geojson'), 'utf-8')
);

function calculateCentroid(geometry: any): { longitude: number; latitude: number } {
  const coords = geometry.type === 'MultiPolygon'
    ? geometry.coordinates[0][0]
    : geometry.coordinates[0];

  let sumLng = 0, sumLat = 0;
  for (const [lng, lat] of coords) {
    sumLng += lng;
    sumLat += lat;
  }
  return {
    longitude: sumLng / coords.length,
    latitude: sumLat / coords.length,
  };
}

function generateSlug(address: string, index: number): string {
  if (!address) return `parcel-${index}`;
  return address
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateName(address: string, descr: string, index: number): string {
  if (address) {
    // Clean up address for display
    return address
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }
  return `Vineyard Parcel ${index + 1}`;
}

async function importRealParcels() {
  console.log('🍇 Importing real vineyard parcels from Napa County GIS...\n');

  // Get Howell Mountain appellation
  const appellation = await client.fetch(
    `*[_type == "appellation" && slug.current == "howell-mountain"][0]{ _id, name }`
  );

  if (!appellation) {
    console.error('❌ Howell Mountain appellation not found');
    return;
  }

  // Delete existing vineyards (we're replacing with real data)
  const existingVineyards = await client.fetch(
    `*[_type == "vineyard" && appellation._ref == $id]{ _id }`,
    { id: appellation._id }
  );

  if (existingVineyards.length > 0) {
    console.log(`Removing ${existingVineyards.length} existing placeholder vineyards...`);
    for (const v of existingVineyards) {
      await client.delete(v._id);
    }
    console.log('Done.\n');
  }

  const features = parcelsData.features || [];
  console.log(`Importing ${features.length} real vineyard parcels...\n`);

  let created = 0;

  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    const props = feature.properties;
    const geometry = feature.geometry;

    const address = props.streetaddr || '';
    const name = generateName(address, props.descr, i);
    const slug = generateSlug(address, i);
    const acres = props.gis_acres || props.acres;
    const centroid = calculateCentroid(geometry);
    const color = COLORS[i % COLORS.length];

    // Determine primary grapes based on land use
    const isWinery = props.descr?.includes('WINERY');
    const primaryGrapes = isWinery
      ? ['Cabernet Sauvignon'] // Most common in Howell Mountain
      : ['Cabernet Sauvignon'];

    await client.create({
      _type: 'vineyard',
      name,
      slug: { _type: 'slug', current: slug },
      appellation: { _type: 'reference', _ref: appellation._id },
      description: `${props.descr || 'Vineyard parcel'} in Howell Mountain AVA. ${acres ? `${acres.toFixed(1)} acres.` : ''}`,
      acreage: acres ? Math.round(acres * 10) / 10 : undefined,
      primaryGrapes,
      labelPosition: centroid,
      boundaries: {
        type: 'Feature',
        geometry: {
          type: geometry.type,
          coordinates: geometry.coordinates,
        },
        properties: {
          fillColor: color,
          strokeColor: '#1a1a1a',
          source: 'Napa County GIS',
          parcelId: props.asmt,
          landUse: props.landuse1,
        },
      },
    });

    created++;
    if (created % 10 === 0) {
      console.log(`  Created ${created}/${features.length} parcels...`);
    }
  }

  console.log(`\n✅ Imported ${created} real vineyard parcels`);
  console.log('\n📍 View: http://localhost:3000/maps/howell-mountain');
}

importRealParcels().catch(console.error);
