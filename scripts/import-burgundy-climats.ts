/**
 * Import Burgundy Climats into Sanity
 *
 * This script imports Burgundy climats (Grand Cru, Premier Cru, Village)
 * from a CSV/JSON file into your Sanity database.
 *
 * Usage:
 *   npm run import-climats
 *
 * Data format expected (CSV or JSON):
 *   name, appellation, classification, region, acreage, soil_types, aspect, description
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: path.join(__dirname, '../.env.local') });

// Sanity client setup
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN, // Create a token with write access
  useCdn: false,
  apiVersion: '2024-01-01',
});

interface ClimatData {
  name: string;
  appellationName: string;
  classification: string;
  regionName: string;
  acreage?: number;
  soilTypes?: string[];
  aspect?: string;
  slope?: string;
  elevationRange?: { min: number; max: number };
  elevationMin?: number;
  elevationMax?: number;
  description?: string;
  historicalNotes?: string;
  primaryGrapes?: string[];
  officialDesignationYear?: number;
}

async function findOrCreateRegion(regionName: string, country?: string) {
  const existing = await client.fetch(
    `*[_type == "region" && name == $name][0]`,
    { name: regionName }
  );

  if (existing) return existing._id;

  // Infer country from region name if not provided
  let regionCountry = country || 'France';
  if (regionName.includes('Mosel') || regionName.includes('Rheingau') || regionName.includes('Pfalz')) {
    regionCountry = 'Germany';
  } else if (regionName.includes('Piedmont')) {
    regionCountry = 'Italy';
  }

  const newRegion = await client.create({
    _type: 'region',
    name: regionName,
    country: regionCountry,
    slug: { current: regionName.toLowerCase().replace(/\s+/g, '-') },
  });

  console.log(`✅ Created region: ${regionName} (${regionCountry})`);
  return newRegion._id;
}

async function findOrCreateAppellation(appellationName: string, regionId: string) {
  const existing = await client.fetch(
    `*[_type == "appellation" && name == $name][0]`,
    { name: appellationName }
  );

  if (existing) return existing._id;

  const newAppellation = await client.create({
    _type: 'appellation',
    name: appellationName,
    slug: { current: appellationName.toLowerCase().replace(/\s+/g, '-') },
    parentRegion: { _type: 'reference', _ref: regionId },
    level: 'major_ava', // Burgundy village appellations
  });

  console.log(`✅ Created appellation: ${appellationName}`);
  return newAppellation._id;
}

async function importClimat(data: ClimatData) {
  // Check if climat already exists
  const existing = await client.fetch(
    `*[_type == "climat" && name == $name && appellation->name == $appellation][0]`,
    { name: data.name, appellation: data.appellationName }
  );

  if (existing) {
    console.log(`⏭️  Skipping existing climat: ${data.name} (${data.appellationName})`);
    return existing._id;
  }

  // Find or create region
  const regionId = await findOrCreateRegion(data.regionName);

  // Find or create appellation
  const appellationId = await findOrCreateAppellation(data.appellationName, regionId);

  // Create climat document
  const climatDoc: any = {
    _type: 'climat',
    name: data.name,
    slug: {
      current: `${data.appellationName}-${data.name}`
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
    },
    appellation: { _type: 'reference', _ref: appellationId },
    region: { _type: 'reference', _ref: regionId },
    classification: data.classification,
  };

  // Optional fields
  if (data.acreage) climatDoc.acreage = data.acreage;
  if (data.soilTypes) climatDoc.soilTypes = data.soilTypes;
  if (data.aspect) climatDoc.aspect = data.aspect;
  if (data.slope) climatDoc.slope = data.slope;
  if (data.description) climatDoc.description = data.description;
  if (data.historicalNotes) climatDoc.historicalNotes = data.historicalNotes;
  if (data.primaryGrapes) climatDoc.primaryGrapes = data.primaryGrapes;
  if (data.officialDesignationYear) climatDoc.officialDesignationYear = data.officialDesignationYear;

  if (data.elevationRange) {
    climatDoc.elevationRange = data.elevationRange;
  } else if (data.elevationMin && data.elevationMax) {
    climatDoc.elevationRange = {
      min: data.elevationMin,
      max: data.elevationMax,
    };
  }

  const result = await client.create(climatDoc);
  console.log(`✅ Created climat: ${data.name} (${data.classification}) in ${data.appellationName}`);
  return result._id;
}

async function importFromJSON(filePath: string) {
  console.log(`📂 Reading data from: ${filePath}`);

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const climatsData: ClimatData[] = JSON.parse(fileContent);

  console.log(`📊 Found ${climatsData.length} climats to import`);
  console.log('🚀 Starting import...\n');

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const climat of climatsData) {
    try {
      await importClimat(climat);
      successCount++;
    } catch (error) {
      console.error(`❌ Error importing ${climat.name}:`, error);
      errorCount++;
    }
  }

  console.log('\n📈 Import Summary:');
  console.log(`   ✅ Successfully imported: ${successCount}`);
  console.log(`   ⏭️  Skipped (already exists): ${skipCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📊 Total: ${climatsData.length}`);
}

// Main execution
const dataFilePath = process.argv[2] || path.join(__dirname, '../data/burgundy-climats.json');

if (!fs.existsSync(dataFilePath)) {
  console.error(`❌ Data file not found: ${dataFilePath}`);
  console.log('\n💡 Usage: npm run import-climats [path/to/data.json]');
  console.log('   Or place your data at: data/burgundy-climats.json');
  process.exit(1);
}

importFromJSON(dataFilePath)
  .then(() => {
    console.log('\n✅ Import complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  });
