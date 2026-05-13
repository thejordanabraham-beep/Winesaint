import fs from 'fs';
import path from 'path';

const grapesPath = path.join(process.cwd(), 'app/data/grapes.json');
const geneticsPath = path.join(process.cwd(), 'scripts/pinot-noir-genetics-expanded.json');

const grapesData = JSON.parse(fs.readFileSync(grapesPath, 'utf-8'));
const geneticsData = JSON.parse(fs.readFileSync(geneticsPath, 'utf-8'));

// Find Pinot Noir
const pinotIndex = grapesData.grapes.findIndex((g: { name: string }) => g.name === 'PINOT NOIR');

if (pinotIndex === -1) {
  console.error('Pinot Noir not found!');
  process.exit(1);
}

// Update the genetic lineage
grapesData.grapes[pinotIndex].level_3.genetic_lineage = geneticsData.genetic_lineage;

// Write back
fs.writeFileSync(grapesPath, JSON.stringify(grapesData, null, 2));

console.log(`Updated Pinot Noir genetics:`);
console.log(`- ${geneticsData.genetic_lineage.parents.length} parents`);
console.log(`- ${geneticsData.genetic_lineage.offspring.length} offspring`);
console.log(`- ${geneticsData.genetic_lineage.mutations.length} mutations`);
console.log(`- ${geneticsData.genetic_lineage.modern_crosses.length} modern crosses`);
