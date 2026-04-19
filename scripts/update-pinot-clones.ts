import fs from 'fs';
import path from 'path';

const grapesPath = path.join(process.cwd(), 'app/data/grapes.json');
const clonesPath = path.join(process.cwd(), 'scripts/pinot-noir-clones-expanded.json');

const grapesData = JSON.parse(fs.readFileSync(grapesPath, 'utf-8'));
const clonesData = JSON.parse(fs.readFileSync(clonesPath, 'utf-8'));

// Find Pinot Noir
const pinotIndex = grapesData.grapes.findIndex((g: { name: string }) => g.name === 'PINOT NOIR');

if (pinotIndex === -1) {
  console.error('Pinot Noir not found!');
  process.exit(1);
}

// Update the clones
grapesData.grapes[pinotIndex].level_3.clones = clonesData.clones;

// Write back
fs.writeFileSync(grapesPath, JSON.stringify(grapesData, null, 2));

console.log(`Updated Pinot Noir with ${clonesData.clones.length} clones`);
