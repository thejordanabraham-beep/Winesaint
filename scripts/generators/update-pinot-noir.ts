import fs from 'fs';
import path from 'path';

const grapesPath = path.join(process.cwd(), 'app/data/grapes.json');
const updatePath = path.join(process.cwd(), 'scripts/pinot-noir-update.json');

const grapesData = JSON.parse(fs.readFileSync(grapesPath, 'utf-8'));
const updateData = JSON.parse(fs.readFileSync(updatePath, 'utf-8'));

// Find Pinot Noir
const pinotIndex = grapesData.grapes.findIndex((g: { name: string }) => g.name === 'PINOT NOIR');

if (pinotIndex === -1) {
  console.error('Pinot Noir not found!');
  process.exit(1);
}

// Update the entry
grapesData.grapes[pinotIndex].level_1.description = updateData.level_1.description;
grapesData.grapes[pinotIndex].level_2 = updateData.level_2;
grapesData.grapes[pinotIndex].level_3 = updateData.level_3;

// Write back
fs.writeFileSync(grapesPath, JSON.stringify(grapesData, null, 2));

console.log('Pinot Noir updated successfully!');
console.log('Level 2 sections:', Object.keys(updateData.level_2));
console.log('Level 3 sections:', Object.keys(updateData.level_3));
