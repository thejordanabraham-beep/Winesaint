import fs from 'fs';
import path from 'path';

// Missing Premier Crus by commune (from INAO master list)
const MISSING_PREMIER_CRUS = {
  // CÔTE DE NUITS
  'cote-de-nuits/gevrey-chambertin': [
    // Missing 8 - need to verify which ones we don't have
    'lavaux-saint-jacques', // We have 'lavaut-saint-jacques' - need to check if same
  ],
  'cote-de-nuits/morey-saint-denis': [
    'clos-baulet',
    'les-blanchards',
    'les-chaffots',
    'cote-rotie',
  ],
  'cote-de-nuits/chambolle-musigny': [
    'aux-beaux-bruns',
    'aux-echanges',
    'les-carrieres',
    'les-hauts-doix',
    'les-sentiers',
    'les-veroilles',
  ],
  'cote-de-nuits/vougeot': [
    'les-petits-vougeots',
    'la-vigne-blanche',
  ],
  'cote-de-nuits/vosne-romanee': [
    'au-dessus-des-malconsorts', // Already added in earlier update
    'cros-parentoux', // Duplicate of cros-parantoux?
  ],
  'cote-de-nuits/fixin': [
    'en-suchot',
    'queue-de-hareng',
  ],

  // CÔTE DE BEAUNE - CHASSAGNE-MONTRACHET (33 missing!)
  'cote-de-beaune/chassagne-montrachet': [
    'clos-chareau',
    'clos-pitois',
    'dent-de-chien',
    'en-cailleret',
    'en-remilly',
    'en-virondot',
    'ez-crets',
    'ez-crottes',
    'francemont',
    'guerch ere',
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
    // Plus more - need complete list
  ],

  // MEURSAULT (11 missing)
  'cote-de-beaune/meursault': [
    'blagny',
    'clos-des-perrieres',
    'la-jeunellotte',
    'la-piece-sous-le-bois',
    'le-porusot',
    'les-boucheres',
    'les-plures',
    'les-ravelles',
    'les-santenots-blancs',
    'les-santenots-du-milieu',
    'sous-blagny',
    'sous-le-dos-dane',
  ],

  // SAINT-AUBIN (10 missing)
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

  // VOLNAY (5 missing - need exact list)
  'cote-de-beaune/volnay': [
    // Need to determine which 5 are missing
  ],

  // BEAUNE (3 missing - need exact list)
  'cote-de-beaune/beaune': [
    // Need to determine which 3 are missing
  ],

  // ALOXE-CORTON (2 missing - need exact list)
  'cote-de-beaune/aloxe-corton': [
    // Need to determine which 2 are missing
  ],

  // POMMARD (1 missing - need exact list)
  'cote-de-beaune/pommard': [
    // Need to determine which 1 is missing
  ],

  // MONTAGNY (4 missing - need exact list)
  'cote-chalonnaise/montagny': [
    // Need to determine which 4 are missing
  ],
};

// Template for Premier Cru page.tsx
function generatePremierCruPageTemplate(vineyardName: string, vineyardSlug: string, communeSlug: string, parentPath: string): string {
  return `import RegionLayout from '@/components/RegionLayout';

export default function ${vineyardName.replace(/[^a-zA-Z0-9]/g, '')}Page() {
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

// Helper to convert slug to title case
function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => {
      // Handle special cases
      if (word === 'de' || word === 'du' || word === 'des' || word === 'la' || word === 'le' || word === 'les') {
        return word;
      }
      if (word === 'saint') return 'Saint';
      if (word === 'a') return 'à';
      if (word === 'lest') return "l'Est";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ')
    .replace(/ De /g, ' de ')
    .replace(/ Du /g, ' du ')
    .replace(/ Des /g, ' des ')
    .replace(/ La /g, ' la ')
    .replace(/ Le /g, ' le ')
    .replace(/ Les /g, ' Les ');
}

async function createMissingPremierCrus() {
  const burgundyPath = '/Users/jordanabraham/wine-reviews/app/regions/france/burgundy';
  let totalCreated = 0;

  console.log('🍷 Creating Missing Burgundy Premier Crus\n');
  console.log('═'.repeat(80));

  for (const [communePath, vineyardSlugs] of Object.entries(MISSING_PREMIER_CRUS)) {
    if (vineyardSlugs.length === 0) continue;

    const fullCommunePath = path.join(burgundyPath, communePath);
    const [subRegion, commune] = communePath.split('/');
    const parentPath = `france/burgundy/${communePath}`;

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
      const pageContent = generatePremierCruPageTemplate(vineyardName, vineyardSlug, commune, parentPath);
      fs.writeFileSync(pagePath, pageContent, 'utf-8');

      console.log(`   ✅ Created: ${vineyardSlug}`);
      totalCreated++;
    }
  }

  console.log('\n\n' + '═'.repeat(80));
  console.log(`✨ Created ${totalCreated} missing Premier Cru directories`);
  console.log('\nNext steps:');
  console.log('1. Re-run audit script to update commune pages with new vineyards');
  console.log('2. Generate guides for all 620 pages');
}

createMissingPremierCrus().catch(console.error);
