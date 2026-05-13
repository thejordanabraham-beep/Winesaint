import fs from 'fs';
import path from 'path';

/**
 * RENAME BURGUNDY VINEYARD GUIDES
 *
 * Rename from {slug}-vineyard-guide.md to {slug}-guide.md
 * to match what the page.tsx files expect.
 */

const BURGUNDY_PATH = '/Users/jordanabraham/wine-reviews/app/regions/france/burgundy';
const GUIDES_PATH = '/Users/jordanabraham/wine-reviews/guides';

const SUB_REGIONS = [
  { name: 'Côte de Nuits', slug: 'cote-de-nuits' },
  { name: 'Côte de Beaune', slug: 'cote-de-beaune' },
  { name: 'Côte Chalonnaise', slug: 'cote-chalonnaise' },
];

const vineyardSlugs: string[] = [];
let renamed = 0;
let notFound = 0;

function collectVineyardSlugs() {
  for (const subRegion of SUB_REGIONS) {
    const subRegionPath = path.join(BURGUNDY_PATH, subRegion.slug);
    if (!fs.existsSync(subRegionPath)) continue;

    const communes = fs.readdirSync(subRegionPath, { withFileTypes: true });

    for (const commune of communes) {
      if (!commune.isDirectory()) continue;

      const communePath = path.join(subRegionPath, commune.name);
      const vineyards = fs.readdirSync(communePath, { withFileTypes: true });

      for (const vineyard of vineyards) {
        if (!vineyard.isDirectory()) continue;
        vineyardSlugs.push(vineyard.name);
      }
    }
  }
}

function renameGuides() {
  console.log('🔄 RENAMING BURGUNDY VINEYARD GUIDES\n');
  console.log(`Found ${vineyardSlugs.length} Burgundy vineyards`);
  console.log('═'.repeat(80));

  for (const slug of vineyardSlugs) {
    const oldName = `${slug}-vineyard-guide.md`;
    const newName = `${slug}-guide.md`;
    const oldPath = path.join(GUIDES_PATH, oldName);
    const newPath = path.join(GUIDES_PATH, newName);

    if (!fs.existsSync(oldPath)) {
      // Check if already renamed
      if (fs.existsSync(newPath)) {
        // Already correct name
        continue;
      }
      notFound++;
      continue;
    }

    // Check if newName already exists (shouldn't happen, but be safe)
    if (fs.existsSync(newPath)) {
      console.log(`⚠️  ${newName} already exists, skipping ${oldName}`);
      continue;
    }

    fs.renameSync(oldPath, newPath);
    renamed++;

    if (renamed % 50 === 0) {
      console.log(`   ✅ Renamed ${renamed} guides...`);
    }
  }

  console.log('\n' + '═'.repeat(80));
  console.log(`✨ Renaming complete!`);
  console.log(`   Renamed: ${renamed} guides`);
  console.log(`   Not found: ${notFound} guides (need to be generated)`);
}

collectVineyardSlugs();
renameGuides();
