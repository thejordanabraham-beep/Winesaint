import fs from 'fs';
import path from 'path';

const grapesPath = path.join(process.cwd(), 'app/data/grapes.json');
const diseasePath = path.join(process.cwd(), 'scripts/pinot-noir-disease-expanded.json');

const grapesData = JSON.parse(fs.readFileSync(grapesPath, 'utf-8'));
const diseaseData = JSON.parse(fs.readFileSync(diseasePath, 'utf-8'));

// Find Pinot Noir
const pinotIndex = grapesData.grapes.findIndex((g: { name: string }) => g.name === 'PINOT NOIR');

if (pinotIndex === -1) {
  console.error('Pinot Noir not found!');
  process.exit(1);
}

// Update the disease profile
grapesData.grapes[pinotIndex].level_3.disease_profile = diseaseData.disease_profile;

// Write back
fs.writeFileSync(grapesPath, JSON.stringify(grapesData, null, 2));

console.log(`Updated Pinot Noir with ${diseaseData.disease_profile.susceptibilities.length} disease susceptibilities`);
