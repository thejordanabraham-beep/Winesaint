#!/usr/bin/env node
/**
 * Helper script to generate grape-overrides.json templates
 *
 * Usage:
 *   npx tsx scripts/generate-override-template.ts --title-case
 *     Generates name overrides to convert all UPPERCASE names to Title Case
 *
 *   npx tsx scripts/generate-override-template.ts --remove-non-essential
 *     Generates essential overrides to remove all non-essential grapes
 *
 *   npx tsx scripts/generate-override-template.ts --add-essential <grape_id> <grape_id> ...
 *     Generates essential overrides to add specific grapes to essential list
 */

import { readFileSync } from 'fs';
import { join } from 'path';

interface Grape {
  id: string;
  name: string;
  berry_color: string;
  is_essential: boolean;
}

interface GrapesData {
  total_grapes: number;
  essential_grapes: number;
  grapes: Grape[];
}

// Helper function to convert to title case
function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

// Load grapes data
const dataPath = join(process.cwd(), 'app/data/grapes.json');
const grapesData: GrapesData = JSON.parse(readFileSync(dataPath, 'utf-8'));

const args = process.argv.slice(2);

if (args.includes('--title-case')) {
  console.log('\n=== Title Case Name Overrides Template ===\n');
  console.log('Copy and paste this into /app/data/grape-overrides.json under "name_overrides":\n');

  const nameOverrides: Record<string, string> = {};
  grapesData.grapes.forEach(grape => {
    if (grape.name === grape.name.toUpperCase()) {
      nameOverrides[grape.name] = toTitleCase(grape.name);
    }
  });

  console.log(JSON.stringify(nameOverrides, null, 2));
  console.log(`\n${Object.keys(nameOverrides).length} grapes will be converted to title case.\n`);
}

else if (args.includes('--remove-non-essential')) {
  console.log('\n=== Remove All Non-Essential Grapes Template ===\n');
  console.log('Copy and paste this into /app/data/grape-overrides.json under "essential_overrides":\n');

  const essentialOverrides: Record<string, boolean> = {};
  grapesData.grapes.forEach(grape => {
    if (!grape.is_essential) {
      essentialOverrides[grape.id] = false;
    }
  });

  console.log(JSON.stringify(essentialOverrides, null, 2));
  console.log(`\n${Object.keys(essentialOverrides).length} non-essential grapes will be removed.\n`);
  console.log('Note: This won\'t actually remove them from the database, just hide them from the Essential toggle.\n');
}

else if (args.includes('--add-essential')) {
  console.log('\n=== Add Grapes to Essential List Template ===\n');

  const grapeIds = args.slice(args.indexOf('--add-essential') + 1);

  if (grapeIds.length === 0) {
    console.log('Please provide grape IDs to add to the essential list.');
    console.log('\nExample: npx tsx scripts/generate-override-template.ts --add-essential grape_pinotage grape_gruner_veltliner\n');
    console.log('Use "npx tsx scripts/list-grapes.ts" to find grape IDs.\n');
    process.exit(1);
  }

  const essentialOverrides: Record<string, boolean> = {};
  const notFound: string[] = [];

  grapeIds.forEach(id => {
    const grape = grapesData.grapes.find(g => g.id === id);
    if (grape) {
      essentialOverrides[id] = true;
      console.log(`✓ ${grape.name} (${id}) ${grape.is_essential ? '[already essential]' : ''}`);
    } else {
      notFound.push(id);
    }
  });

  if (notFound.length > 0) {
    console.log('\n⚠️  Not found:', notFound.join(', '));
  }

  console.log('\nCopy and paste this into /app/data/grape-overrides.json under "essential_overrides":\n');
  console.log(JSON.stringify(essentialOverrides, null, 2));
  console.log('');
}

else if (args.includes('--remove-essential')) {
  console.log('\n=== Remove Grapes from Essential List Template ===\n');

  const grapeIds = args.slice(args.indexOf('--remove-essential') + 1);

  if (grapeIds.length === 0) {
    console.log('Please provide grape IDs to remove from the essential list.');
    console.log('\nExample: npx tsx scripts/generate-override-template.ts --remove-essential grape_aglianico grape_grenache\n');
    console.log('Use "npx tsx scripts/list-grapes.ts --essential" to find essential grape IDs.\n');
    process.exit(1);
  }

  const essentialOverrides: Record<string, boolean> = {};
  const notFound: string[] = [];

  grapeIds.forEach(id => {
    const grape = grapesData.grapes.find(g => g.id === id);
    if (grape) {
      essentialOverrides[id] = false;
      console.log(`✓ ${grape.name} (${id}) ${!grape.is_essential ? '[already non-essential]' : ''}`);
    } else {
      notFound.push(id);
    }
  });

  if (notFound.length > 0) {
    console.log('\n⚠️  Not found:', notFound.join(', '));
  }

  console.log('\nCopy and paste this into /app/data/grape-overrides.json under "essential_overrides":\n');
  console.log(JSON.stringify(essentialOverrides, null, 2));
  console.log('');
}

else {
  console.log('\n=== Grape Override Template Generator ===\n');
  console.log('Usage:');
  console.log('  npx tsx scripts/generate-override-template.ts --title-case');
  console.log('    Generate name overrides to convert all UPPERCASE names to Title Case\n');
  console.log('  npx tsx scripts/generate-override-template.ts --remove-non-essential');
  console.log('    Generate template to hide all non-essential grapes\n');
  console.log('  npx tsx scripts/generate-override-template.ts --add-essential <grape_id> ...');
  console.log('    Generate template to add specific grapes to essential list\n');
  console.log('  npx tsx scripts/generate-override-template.ts --remove-essential <grape_id> ...');
  console.log('    Generate template to remove specific grapes from essential list\n');
  console.log('Examples:');
  console.log('  npx tsx scripts/generate-override-template.ts --add-essential grape_pinotage grape_gruner_veltliner');
  console.log('  npx tsx scripts/generate-override-template.ts --remove-essential grape_aglianico grape_grenache\n');
}
