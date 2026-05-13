import fs from 'fs';
import path from 'path';

const grapesPath = path.join(process.cwd(), 'app/data/grapes.json');
const dataDir = path.join(process.cwd(), 'scripts/grape-data');

// Read main grapes data
const grapesData = JSON.parse(fs.readFileSync(grapesPath, 'utf-8'));

// Get all grape data files
const grapeFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

console.log(`Found ${grapeFiles.length} grape data files to process\n`);

for (const file of grapeFiles) {
  const updateData = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
  const grapeName = updateData.name;

  // Find the grape in the main data
  const grapeIndex = grapesData.grapes.findIndex((g: { name: string }) => g.name === grapeName);

  if (grapeIndex === -1) {
    console.log(`❌ ${grapeName} not found in grapes.json`);
    continue;
  }

  // Update level_2 if provided
  if (updateData.level_2) {
    grapesData.grapes[grapeIndex].level_2 = {
      ...grapesData.grapes[grapeIndex].level_2,
      ...updateData.level_2
    };
  }

  // Update level_3
  if (updateData.level_3) {
    grapesData.grapes[grapeIndex].level_3 = updateData.level_3;
  }

  // Count sections
  const l3 = updateData.level_3 || {};
  const sections = [];
  if (l3.genetic_lineage) sections.push('genetics');
  if (l3.clones?.length) sections.push(`${l3.clones.length} clones`);
  if (l3.terroir?.length) sections.push(`${l3.terroir.length} terroirs`);
  if (l3.disease_profile) sections.push('disease');
  if (l3.regional_expressions?.length) sections.push(`${l3.regional_expressions.length} regions`);

  console.log(`✓ ${grapeName}: ${sections.join(', ')}`);
}

// Write back
fs.writeFileSync(grapesPath, JSON.stringify(grapesData, null, 2));

console.log(`\n✅ Updated ${grapeFiles.length} grapes in grapes.json`);
