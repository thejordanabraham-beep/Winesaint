import fs from 'fs';
import path from 'path';

const grapesPath = path.join(process.cwd(), 'app/data/grapes.json');
const regionsPath = path.join(process.cwd(), 'scripts/pinot-noir-regions-expanded.json');

const grapesData = JSON.parse(fs.readFileSync(grapesPath, 'utf-8'));
const regionsData = JSON.parse(fs.readFileSync(regionsPath, 'utf-8'));

// Find Pinot Noir
const pinotIndex = grapesData.grapes.findIndex((g: { name: string }) => g.name === 'PINOT NOIR');

if (pinotIndex === -1) {
  console.error('Pinot Noir not found!');
  process.exit(1);
}

// Add regional_expressions to level_3
grapesData.grapes[pinotIndex].level_3.regional_expressions = regionsData.regional_expressions;

// Write back
fs.writeFileSync(grapesPath, JSON.stringify(grapesData, null, 2));

console.log(`Updated Pinot Noir with ${regionsData.regional_expressions.length} regional expressions`);
