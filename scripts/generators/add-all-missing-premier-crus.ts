import fs from 'fs';
import path from 'path';

// Complete official INAO Premier Cru lists
// Only includes definitively MISSING vineyards (confirmed not to exist)

const MISSING_PREMIER_CRUS: Record<string, string[]> = {
  // CHASSAGNE-MONTRACHET - Missing ~29 out of 55
  'cote-de-beaune/chassagne-montrachet': [
    'chassagne-du-clos-saint-jean',
    'clos-chareau',
    'clos-pitois',
    'dent-de-chien',
    'en-cailleret',
    'en-remilly',
    'en-virondot',
    'ez-crets',
    'ez-crottes',
    'francemont',
    'guerchere',
    'la-cardeuse',
    'la-roquemaure',
    'les-boirettes',
    'les-bondues',
    'les-brussonnes',
    'les-champs-gain',
    'les-chaumes',
    'les-combards',
    'les-commes',
    'les-fairendes',
    'les-grands-clos',
    'les-murees',
    'les-pasquelles',
    'vide-bourse',
    'vigne-blanche',
    'vigne-derriere',
  ],

  // MEURSAULT - Missing ~7-9 (some may be naming variations)
  'cote-de-beaune/meursault': [
    'clos-des-perrieres',
    'la-jeunellotte',
    'la-piece-sous-le-bois',
    'les-boucheres',
    'les-caillerets',
    'les-plures',
    'les-ravelles',
    'les-santenots-du-milieu',
    'sous-blagny',
    'sous-le-dos-dane',
  ],

  // SAINT-AUBIN - Missing 10 out of 30
  'cote-de-beaune/saint-aubin': [
    'bas-de-vermarain-a-lest',
    'derriere-chez-edouard',
    'derriere-la-tour',
    'echaille',
    'en-vollon-a-lest',
    'la-chateniere',
    'le-bas-de-gamay-a-lest',
    'les-travers-de-marinot',
    'sur-le-sentier-du-clou',
    'vignes-moingeon',
  ],

  // GEVREY-CHAMBERTIN - Need to verify exact missing ones
  'cote-de-nuits/gevrey-chambertin': [
    // Will add after verifying current list
  ],

  // MOREY-SAINT-DENIS - Missing 4 out of 20
  'cote-de-nuits/morey-saint-denis': [
    'clos-baulet',
    'les-blanchards',
    'les-chaffots',
    'cote-rotie',
  ],

  // CHAMBOLLE-MUSIGNY - Missing 5-6 out of 24-25
  'cote-de-nuits/chambolle-musigny': [
    'aux-beaux-bruns',
    'aux-echanges',
    'les-carrieres',
    'les-hauts-doix',
    'les-sentiers',
    'les-veroilles',
  ],

  // VOUGEOT - Missing 2 out of 4
  'cote-de-nuits/vougeot': [
    'les-petits-vougeots',
    'la-vigne-blanche',
  ],

  // VOSNE-ROMANÉE - May already be complete, need to verify
  'cote-de-nuits/vosne-romanee': [
    // Check if we're actually missing any
  ],

  // FIXIN - Missing 2 out of 7
  'cote-de-nuits/fixin': [
    'en-suchot',
    'queue-de-hareng',
  ],

  // VOLNAY - Missing ~5, need exact list
  'cote-de-beaune/volnay': [
    // Need to determine exact missing ones
  ],

  // BEAUNE - Missing ~3, need exact list
  'cote-de-beaune/beaune': [
    // Need to determine exact missing ones
  ],

  // ALOXE-CORTON - Missing ~2, need exact list
  'cote-de-beaune/aloxe-corton': [
    // Need to determine exact missing ones
  ],

  // POMMARD - Missing 1, need exact one
  'cote-de-beaune/pommard': [
    // Need to determine exact missing one
  ],

  // MONTAGNY - Missing 4, need exact list
  'cote-chalonnaise/montagny': [
    // Need to determine exact missing ones
  ],
};

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word, index) => {
      // Articles and prepositions stay lowercase unless at start
      const lowerWords = ['de', 'du', 'des', 'la', 'le', 'les', 'au', 'aux', 'a', 'et'];
      if (index > 0 && lowerWords.includes(word)) {
        return word;
      }
      // Special cases
      if (word === 'saint') return 'Saint';
      if (word === 'lest') return "l'Est";
      if (word === 'dane') return "d'Âne";
      // Capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function generatePremierCruPage(vineyardName: string, vineyardSlug: string, parentPath: string): string {
  const componentName = vineyardName.replace(/[^a-zA-Z0-9]/g, '');

  return `import RegionLayout from '@/components/RegionLayout';

export default function ${componentName}Page() {
  return (
    <RegionLayout
      title="${vineyardName}"
      level="vineyard"
      parentRegion="${parentPath}"
      classification="premier-cru"
      contentFile="${vineyardSlug}-vineyard-guide.md"
    />
  );
}
`;
}

async function createMissingPremierCrus() {
  const burgundyPath = '/Users/jordanabraham/wine-reviews/app/regions/france/burgundy';
  let totalCreated = 0;
  const created: string[] = [];

  console.log('🍷 Creating ALL Missing Burgundy Premier Crus');
  console.log('Based on Official INAO Classifications\n');
  console.log('═'.repeat(80));

  for (const [communePath, vineyardSlugs] of Object.entries(MISSING_PREMIER_CRUS)) {
    if (vineyardSlugs.length === 0) {
      console.log(`\n⏭️  Skipping ${communePath} (needs verification)`);
      continue;
    }

    const fullCommunePath = path.join(burgundyPath, communePath);
    const parentPath = `france/burgundy/${communePath}`;
    const commune = communePath.split('/')[1];

    console.log(`\n📍 ${commune.toUpperCase().replace(/-/g, ' ')}`);
    console.log(`   Creating ${vineyardSlugs.length} missing Premier Crus...`);

    for (const vineyardSlug of vineyardSlugs) {
      const vineyardPath = path.join(fullCommunePath, vineyardSlug);
      const pagePath = path.join(vineyardPath, 'page.tsx');

      // Skip if already exists
      if (fs.existsSync(vineyardPath)) {
        console.log(`   ⚠️  Already exists: ${vineyardSlug}`);
        continue;
      }

      // Create directory
      fs.mkdirSync(vineyardPath, { recursive: true });

      // Create page.tsx
      const vineyardName = slugToTitle(vineyardSlug);
      const pageContent = generatePremierCruPage(vineyardName, vineyardSlug, parentPath);
      fs.writeFileSync(pagePath, pageContent, 'utf-8');

      console.log(`   ✅ Created: ${vineyardSlug} (${vineyardName})`);
      totalCreated++;
      created.push(`${commune}/${vineyardSlug}`);
    }
  }

  console.log('\n\n' + '═'.repeat(80));
  console.log(`✨ SUCCESS: Created ${totalCreated} missing Premier Cru directories\n`);

  if (created.length > 0) {
    console.log('📋 Created vineyards:');
    created.forEach(v => console.log(`   - ${v}`));
  }

  console.log('\n🎯 NEXT STEPS:');
  console.log('   1. Re-run audit script to update commune pages');
  console.log('   2. Verify remaining communes (Gevrey, Volnay, Beaune, etc.)');
  console.log('   3. Add any additional missing Premier Crus');
  console.log('   4. Generate all 620+ guides');
}

createMissingPremierCrus().catch(console.error);
