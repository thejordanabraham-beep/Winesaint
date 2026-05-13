import fs from 'fs';
import path from 'path';

// Official Premier Cru lists from INAO
const OFFICIAL_PREMIER_CRUS: Record<string, string[]> = {
  'gevrey-chambertin': [
    'au-closeau',
    'aux-combottes',
    'bel-air',
    'champeaux',
    'champonnet',
    'cherbaudes',
    'clos-prieur',
    'clos-saint-jacques',
    'clos-des-varoilles',
    'clos-du-chapitre',
    'combe-au-moine',
    'craipillot',
    'en-ergot',
    'estournelles-saint-jacques',
    'fonteny',
    'issarts',
    'la-bossiere',
    'la-perriere',
    'la-romanee', // Note: This exists in Gevrey, different from Vosne's La Romanée GC
    'lavaut-saint-jacques',
    'les-cazetiers',
    'les-corbeaux',
    'les-goulots',
    'petite-chapelle',
    'petits-cazetiers',
    'poissenot',
  ],
  'meursault': [
    'blagny',
    'charmes',
    'clos-des-perrieres',
    'genevrieres',
    'la-jeunellotte',
    'la-piece-sous-le-bois',
    'le-porusot',
    'les-boucheres',
    'les-caillerets',
    'les-cras',
    'les-gouttes-dor',
    'les-plures',
    'les-ravelles',
    'les-santenots-blancs',
    'les-santenots-du-milieu',
    'perrieres',
    'porusot',
    'sous-blagny',
    'sous-le-dos-dane',
  ],
};

function listExistingVineyards(communePath: string): string[] {
  if (!fs.existsSync(communePath)) return [];

  return fs.readdirSync(communePath, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
}

async function main() {
  const burgundyPath = '/Users/jordanabraham/wine-reviews/app/regions/france/burgundy';

  console.log('🔍 DETAILED PREMIER CRU VERIFICATION\n');
  console.log('Comparing existing directories against official INAO lists\n');
  console.log('═'.repeat(100));

  for (const [communeSlug, officialList] of Object.entries(OFFICIAL_PREMIER_CRUS)) {
    // Find the commune directory
    let communePath = '';
    for (const subRegion of ['cote-de-nuits', 'cote-de-beaune', 'cote-chalonnaise']) {
      const testPath = path.join(burgundyPath, subRegion, communeSlug);
      if (fs.existsSync(testPath)) {
        communePath = testPath;
        break;
      }
    }

    if (!communePath) {
      console.log(`\n❌ ${communeSlug}: Directory not found`);
      continue;
    }

    const existing = listExistingVineyards(communePath);

    console.log(`\n📍 ${communeSlug.toUpperCase().replace(/-/g, ' ')}`);
    console.log(`   Official Premier Crus: ${officialList.length}`);
    console.log(`   Existing directories: ${existing.length}`);
    console.log('─'.repeat(100));

    // Find missing
    const missing = officialList.filter(pc => !existing.includes(pc));
    if (missing.length > 0) {
      console.log(`\n   ❌ MISSING ${missing.length} Premier Crus:`);
      missing.forEach(pc => console.log(`      - ${pc}`));
    }

    // Find extra (might be village-level or duplicates)
    const extra = existing.filter(dir => !officialList.includes(dir));
    if (extra.length > 0) {
      console.log(`\n   ⚠️  EXTRA ${extra.length} directories (verify if village-level or alternate names):`);
      extra.forEach(dir => console.log(`      - ${dir}`));
    }

    if (missing.length === 0 && extra.length === 0) {
      console.log(`\n   ✅ Perfect match!`);
    }
  }

  console.log('\n\n' + '═'.repeat(100));
  console.log('📋 RECOMMENDATION:');
  console.log('   We need comprehensive official lists for ALL communes before proceeding.');
  console.log('   Should we search for complete INAO data for each commune?');
}

main().catch(console.error);
