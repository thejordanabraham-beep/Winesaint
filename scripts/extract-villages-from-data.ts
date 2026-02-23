#!/usr/bin/env tsx
/**
 * Extract unique village/appellation names from German Grosses Gewächs data files
 *
 * Usage:
 *   npx tsx scripts/extract-villages-from-data.ts --region mosel
 *   npx tsx scripts/extract-villages-from-data.ts --region rheingau
 *   npx tsx scripts/extract-villages-from-data.ts --region alsace
 */

import * as fs from 'fs';
import * as path from 'path';

interface VineyardData {
  name: string;
  appellationName: string;
  regionName: string;
  classification: string;
}

interface VillageEntry {
  name: string;
  slug: string;
  type: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ä/g, 'a')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

function extractVillages(regionSlug: string): VillageEntry[] {
  const dataDir = path.join(process.cwd(), 'data');
  const villages = new Set<string>();

  // Map region slug to file pattern
  const regionFilePatterns: Record<string, string[]> = {
    'mosel': [
      'german-grosses-gewachs-mosel-additional.json',
      'german-grosses-gewachs.json' // Main file may also contain Mosel data
    ],
    'rheingau': [
      'german-grosses-gewachs-rheingau-additional.json',
      'german-grosses-gewachs.json'
    ],
    'alsace': [
      'france-alsace-grand-crus.json'
    ],
    'pfalz': [
      'german-grosses-gewachs-pfalz-additional.json',
      'german-grosses-gewachs.json'
    ],
    'rheinhessen': [
      'german-grosses-gewachs-rheinhessen-additional.json',
      'german-grosses-gewachs-rheinhessen.json'
    ],
    'nahe': [
      'german-grosses-gewachs-nahe-additional.json',
      'german-grosses-gewachs-nahe.json'
    ],
    'ahr': [
      'german-grosses-gewachs-ahr-additional.json',
      'german-grosses-gewachs-ahr.json'
    ],
    'baden': [
      'german-grosses-gewachs-baden-additional.json',
      'german-grosses-gewachs-baden.json'
    ],
    'franken': [
      'german-grosses-gewachs-franken-additional.json',
      'german-grosses-gewachs-franken.json'
    ]
  };

  const filePatterns = regionFilePatterns[regionSlug];
  if (!filePatterns) {
    console.error(`Unknown region: ${regionSlug}`);
    console.log('Available regions:', Object.keys(regionFilePatterns).join(', '));
    process.exit(1);
  }

  // Read all matching files
  for (const pattern of filePatterns) {
    const filePath = path.join(dataDir, pattern);
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping non-existent file: ${pattern}`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const data: VineyardData[] = JSON.parse(content);

    // Extract unique appellationName values for the specified region
    for (const item of data) {
      // Filter by region name if it's in the main file
      const regionMatch =
        item.regionName?.toLowerCase().includes(regionSlug) ||
        regionSlug === 'alsace' && item.regionName?.toLowerCase() === 'alsace';

      if (item.appellationName && (regionMatch || pattern.includes(regionSlug) || pattern.includes('alsace'))) {
        villages.add(item.appellationName);
      }
    }
  }

  // Convert to sorted array of objects
  const sortedVillages = Array.from(villages)
    .sort((a, b) => a.localeCompare(b))
    .map(name => ({
      name,
      slug: slugify(name),
      type: 'village'
    }));

  return sortedVillages;
}

function formatAsTypeScriptArray(villages: VillageEntry[]): string {
  const lines = villages.map(v =>
    `  { name: '${v.name}', slug: '${v.slug}', type: '${v.type}' }`
  );
  return `[\n${lines.join(',\n')}\n]`;
}

// Main execution
const args = process.argv.slice(2);
const regionArg = args.find(arg => arg.startsWith('--region=') || args[args.indexOf(arg) - 1] === '--region');
const region = regionArg?.startsWith('--region=')
  ? regionArg.split('=')[1]
  : args[args.indexOf('--region') + 1];

if (!region) {
  console.error('Usage: npx tsx scripts/extract-villages-from-data.ts --region <region-name>');
  console.error('Example: npx tsx scripts/extract-villages-from-data.ts --region mosel');
  process.exit(1);
}

console.log(`\nExtracting villages for: ${region}\n`);

const villages = extractVillages(region.toLowerCase());

console.log(`Found ${villages.length} villages in ${region} data:\n`);
console.log('Villages:', villages.map(v => v.name).join(', '));
console.log('\n--- Copy the array below ---\n');
console.log(formatAsTypeScriptArray(villages));
console.log('\n--- End of array ---\n');
