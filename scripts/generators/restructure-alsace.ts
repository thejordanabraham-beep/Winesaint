/**
 * RESTRUCTURE ALSACE - Move Grand Crus into Bas-Rhin and Haut-Rhin subdirectories
 */

import fs from 'fs';
import path from 'path';

const alsaceDir = path.join(process.cwd(), 'app/regions/france/alsace');

// Bas-Rhin Grand Crus (12 total)
const BAS_RHIN_GRAND_CRUS = [
  'altenberg-de-bergbieten',
  'altenberg-de-wolxheim',
  'bruderthal',
  'engelberg',
  'frankstein',
  'kastelberg',
  'kirchberg-de-barr',
  'moenchberg',
  'muenchberg',
  'praelatenberg',
  'winzenberg',
  'zotzenberg',
];

// Haut-Rhin Grand Crus (39 total)
const HAUT_RHIN_GRAND_CRUS = [
  'altenberg-de-bergheim',
  'brand',
  'eichberg',
  'florimont',
  'froehn',
  'furstentum',
  'geisberg',
  'gloeckelberg',
  'goldert',
  'hatschbourg',
  'hengst',
  'kaefferkopf',
  'kanzlerberg',
  'kessler',
  'kirchberg-de-ribeauville',
  'kitterle',
  'mambourg',
  'mandelberg',
  'marckrain',
  'ollwiller',
  'osterberg',
  'pfersigberg',
  'pfingstberg',
  'rangen',
  'rosacker',
  'saering',
  'schlossberg',
  'schoenenbourg',
  'sommerberg',
  'sonnenglanz',
  'spiegel',
  'sporen',
  'steinert',
  'steingrubler',
  'steinklotz',
  'vorbourg',
  'wiebelsberg',
  'wineck-schlossberg',
  'zinnkoepfle',
];

function moveGrandCruToDepartment(gcSlug: string, department: 'bas-rhin' | 'haut-rhin') {
  const currentPath = path.join(alsaceDir, gcSlug);
  const newPath = path.join(alsaceDir, department, gcSlug);

  // Check if already moved
  if (!fs.existsSync(currentPath)) {
    console.log(`   ⏭️  ${gcSlug} already in ${department}`);
    return false;
  }

  // Move directory
  fs.renameSync(currentPath, newPath);

  // Update page.tsx parentRegion
  const pagePath = path.join(newPath, 'page.tsx');
  let pageContent = fs.readFileSync(pagePath, 'utf-8');

  pageContent = pageContent.replace(
    /parentRegion="france\/alsace"/,
    `parentRegion="france/alsace/${department}"`
  );

  fs.writeFileSync(pagePath, pageContent);
  console.log(`   ✅ Moved ${gcSlug} to ${department}/`);
  return true;
}

function restructureAlsace() {
  console.log('\n🍷 RESTRUCTURING ALSACE GRAND CRUS');
  console.log('='.repeat(70));

  let movedCount = 0;

  // Move Bas-Rhin Grand Crus
  console.log('\n📍 Moving Bas-Rhin Grand Crus...');
  for (const gc of BAS_RHIN_GRAND_CRUS) {
    if (moveGrandCruToDepartment(gc, 'bas-rhin')) {
      movedCount++;
    }
  }

  // Move Haut-Rhin Grand Crus
  console.log('\n📍 Moving Haut-Rhin Grand Crus...');
  for (const gc of HAUT_RHIN_GRAND_CRUS) {
    if (moveGrandCruToDepartment(gc, 'haut-rhin')) {
      movedCount++;
    }
  }

  console.log('\n✅ RESTRUCTURE COMPLETE');
  console.log('='.repeat(70));
  console.log(`Moved: ${movedCount}/51 Grand Crus`);
  console.log(`Bas-Rhin: ${BAS_RHIN_GRAND_CRUS.length} Grand Crus`);
  console.log(`Haut-Rhin: ${HAUT_RHIN_GRAND_CRUS.length} Grand Crus`);
}

restructureAlsace();
