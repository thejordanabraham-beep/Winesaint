import fs from 'fs';
import path from 'path';

// Official INAO Premier Cru lists (COMPLETE)
const OFFICIAL_LISTS: Record<string, string[]> = {
  'gevrey-chambertin': [
    'au-closeau', 'aux-combottes', 'bel-air', 'champeaux', 'champonnet',
    'cherbaudes', 'clos-prieur', 'clos-saint-jacques', 'clos-des-varoilles',
    'clos-du-chapitre', 'combe-au-moine', 'craipillot', 'en-ergot',
    'estournelles-saint-jacques', 'fonteny', 'issarts', 'la-bossiere',
    'la-perriere', 'la-romanee', 'lavaut-saint-jacques', 'les-cazetiers',
    'les-corbeaux', 'les-goulots', 'petite-chapelle', 'petits-cazetiers',
    'poissenot'
  ],
  'morey-saint-denis': [
    'aux-charmes', 'aux-cheseaux', 'clos-baulet', 'clos-des-ormes', 'clos-sorbe',
    'cote-rotie', 'la-bussiere', 'la-riotte', 'le-village', 'les-blanchards',
    'les-chaffots', 'les-charrieres', 'les-chenevery', 'les-faconnieres',
    'les-genavrieres', 'les-gruenchers', 'les-millandes', 'les-ruchots',
    'les-sorbes', 'monts-luisants'
  ],
  'chambolle-musigny': [
    'aux-beaux-bruns', 'aux-combottes', 'aux-echanges', 'derriere-la-grange',
    'la-combe-dorveau', 'les-amoureuses', 'les-baudes', 'les-borniques',
    'les-carrieres', 'les-chabiots', 'les-charmes', 'les-chatelots',
    'les-combottes', 'les-cras', 'les-feusselottes', 'les-fuees',
    'les-grands-murs', 'les-groseilles', 'les-gruenchers', 'les-hauts-doix',
    'les-lavrottes', 'les-noirots', 'les-plantes', 'les-sentiers',
    'les-veroilles'
  ],
  'vougeot': [
    'clos-de-la-perriere', 'la-vigne-blanche', 'les-cras', 'les-petits-vougeots'
  ],
  'vosne-romanee': [
    'aux-brulees', 'aux-malconsorts', 'aux-raignots', 'clos-des-reas',
    'cros-parantoux', 'en-orveaux', 'la-croix-rameau', 'les-beaux-monts',
    'les-chaumes', 'les-gaudichots', 'les-petits-monts', 'les-rouges',
    'les-suchots', 'au-dessus-des-malconsorts'
  ],
  'saint-aubin': [
    'bas-de-vermarain-a-lest', 'derriere-chez-edouard', 'derriere-la-tour',
    'echaille', 'en-creot', 'en-la-ranche', 'en-montceau', 'en-remilly',
    'en-vollon-a-lest', 'es-champs', 'la-chateniere', 'le-bas-de-gamay-a-lest',
    'le-charmois', 'le-puits', 'les-castets', 'les-champlots', 'les-combes',
    'les-combes-au-sud', 'les-cortons', 'les-frionnes',
    'les-murgers-des-dents-de-chien', 'les-perrieres', 'les-travers-de-marinot',
    'marinot', 'pitangeret', 'sous-roche-dumay', 'sur-gamay',
    'sur-le-sentier-du-clou', 'vignes-moingeon', 'village'
  ],
  'chassagne-montrachet': [
    'abbaye-de-morgeot', 'blanchot-dessus', 'bois-de-chassagne', 'cailleret',
    'champs-jendreau', 'chassagne', 'chassagne-du-clos-saint-jean', 'clos-chareau',
    'clos-de-la-boudriotte', 'clos-pitois', 'clos-saint-jean', 'dent-de-chien',
    'en-cailleret', 'en-remilly', 'en-virondot', 'ez-crets', 'ez-crottes',
    'francemont', 'grande-montagne', 'grandes-ruchottes', 'guerchere',
    'la-boudriotte', 'la-cardeuse', 'la-chapelle', 'la-grande-borne',
    'la-maltroie', 'la-romanee', 'la-roquemaure', 'les-baudines', 'les-boirettes',
    'les-bondues', 'les-brussonnes', 'les-caillerets', 'les-champs-gain',
    'les-chaumees', 'les-chaumes', 'les-chenevottes', 'les-combards',
    'les-commes', 'les-embrazees', 'les-fairendes', 'les-grands-clos',
    'les-macherelles', 'les-murees', 'les-pasquelles', 'les-ruchottes',
    'les-ruchottes-chassagne', 'les-vergers', 'morgeot', 'vide-bourse',
    'vigne-blanche', 'vigne-derriere'
  ],
};

function listExistingVineyards(communePath: string): string[] {
  if (!fs.existsSync(communePath)) return [];
  return fs.readdirSync(communePath, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
}

async function findMissing() {
  const burgundyPath = '/Users/jordanabraham/wine-reviews/app/regions/france/burgundy';

  console.log('🔍 FINDING EXACT MISSING PREMIER CRUS\n');
  console.log('═'.repeat(80));

  const allMissing: Record<string, string[]> = {};
  let totalMissing = 0;

  for (const [commune, officialList] of Object.entries(OFFICIAL_LISTS)) {
    // Find commune directory
    let communePath = '';
    for (const subRegion of ['cote-de-nuits', 'cote-de-beaune']) {
      const testPath = path.join(burgundyPath, subRegion, commune);
      if (fs.existsSync(testPath)) {
        communePath = testPath;
        break;
      }
    }

    if (!communePath) continue;

    const existing = listExistingVineyards(communePath);
    const missing = officialList.filter(pc => !existing.includes(pc));

    if (missing.length > 0) {
      allMissing[commune] = missing;
      totalMissing += missing.length;

      console.log(`\n📍 ${commune.toUpperCase().replace(/-/g, ' ')}`);
      console.log(`   Official: ${officialList.length} | Have: ${existing.length} | Missing: ${missing.length}`);
      console.log(`   Missing Premier Crus:`);
      missing.forEach(m => console.log(`      - ${m}`));
    } else {
      console.log(`\n✅ ${commune.toUpperCase().replace(/-/g, ' ')}: COMPLETE (${existing.length}/${officialList.length})`);
    }
  }

  console.log('\n\n' + '═'.repeat(80));
  console.log(`📊 SUMMARY: ${totalMissing} Premier Crus still missing`);

  if (totalMissing > 0) {
    console.log('\n📋 TypeScript array for script:');
    console.log('const FINAL_MISSING = {');
    for (const [commune, missing] of Object.entries(allMissing)) {
      console.log(`  '${commune}': [`);
      missing.forEach((m, i) => {
        console.log(`    '${m}'${i < missing.length - 1 ? ',' : ''}`);
      });
      console.log(`  ],`);
    }
    console.log('};');
  }
}

findMissing().catch(console.error);
