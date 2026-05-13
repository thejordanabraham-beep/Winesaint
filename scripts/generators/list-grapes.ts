#!/usr/bin/env node
/**
 * Helper script to list all grapes with their IDs and essential status
 * Usage:
 *   npx tsx scripts/list-grapes.ts                 # List all grapes
 *   npx tsx scripts/list-grapes.ts --essential     # List only essential grapes
 *   npx tsx scripts/list-grapes.ts --non-essential # List only non-essential grapes
 *   npx tsx scripts/list-grapes.ts --search cab    # Search for grapes matching "cab"
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

const args = process.argv.slice(2);
const showOnlyEssential = args.includes('--essential');
const showOnlyNonEssential = args.includes('--non-essential');
const searchIndex = args.indexOf('--search');
const searchTerm = searchIndex >= 0 ? args[searchIndex + 1]?.toLowerCase() : null;

// Load grapes data
const dataPath = join(process.cwd(), 'app/data/grapes.json');
const grapesData: GrapesData = JSON.parse(readFileSync(dataPath, 'utf-8'));

// Filter grapes based on arguments
let filteredGrapes = grapesData.grapes;

if (showOnlyEssential) {
  filteredGrapes = filteredGrapes.filter(g => g.is_essential);
} else if (showOnlyNonEssential) {
  filteredGrapes = filteredGrapes.filter(g => !g.is_essential);
}

if (searchTerm) {
  filteredGrapes = filteredGrapes.filter(g =>
    g.name.toLowerCase().includes(searchTerm) ||
    g.id.toLowerCase().includes(searchTerm)
  );
}

// Sort alphabetically
filteredGrapes.sort((a, b) => a.name.localeCompare(b.name));

// Display results
console.log('\n=== Wine Grape Varieties ===\n');
console.log(`Total grapes: ${grapesData.total_grapes}`);
console.log(`Essential grapes: ${grapesData.essential_grapes}`);
console.log(`Showing: ${filteredGrapes.length} grapes\n`);

// Table header
console.log('─'.repeat(80));
console.log(
  'NAME'.padEnd(30) +
  'ID'.padEnd(30) +
  'COLOR'.padEnd(10) +
  'ESSENTIAL'
);
console.log('─'.repeat(80));

// Table rows
filteredGrapes.forEach(grape => {
  console.log(
    grape.name.padEnd(30) +
    grape.id.padEnd(30) +
    grape.berry_color.padEnd(10) +
    (grape.is_essential ? '✓' : '')
  );
});

console.log('─'.repeat(80));
console.log(`\nTotal: ${filteredGrapes.length} grapes\n`);

// Usage examples
if (filteredGrapes.length === 0) {
  console.log('No grapes found matching your criteria.\n');
}

if (!searchTerm && !showOnlyEssential && !showOnlyNonEssential) {
  console.log('Examples:');
  console.log('  npx tsx scripts/list-grapes.ts --essential     # List only essential grapes');
  console.log('  npx tsx scripts/list-grapes.ts --non-essential # List only non-essential grapes');
  console.log('  npx tsx scripts/list-grapes.ts --search cab    # Search for grapes matching "cab"');
  console.log('');
}
