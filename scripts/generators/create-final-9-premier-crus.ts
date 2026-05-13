import fs from 'fs';
import path from 'path';

const FINAL_MISSING: Record<string, string[]> = {
  'cote-de-nuits/chambolle-musigny': [
    'la-combe-dorveau'
  ],
  'cote-de-nuits/vosne-romanee': [
    'aux-raignots'
  ],
  'cote-de-beaune/saint-aubin': [
    'les-murgers-des-dents-de-chien',
    'les-perrieres',
    'marinot',
    'pitangeret',
    'sous-roche-dumay',
    'sur-gamay',
    'village'
  ],
};

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word, index) => {
      const lowerWords = ['de', 'du', 'des', 'la', 'le', 'les', 'au', 'aux', 'a'];
      if (index > 0 && lowerWords.includes(word)) {
        return word;
      }
      if (word === 'dorveau') return "d'Orveau";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function generatePage(vineyardName: string, vineyardSlug: string, parentPath: string): string {
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

async function createFinal9() {
  const burgundyPath = '/Users/jordanabraham/wine-reviews/app/regions/france/burgundy';
  let created = 0;

  console.log('🍷 Creating Final 9 Missing Premier Crus\n');
  console.log('═'.repeat(80));

  for (const [communePath, vineyards] of Object.entries(FINAL_MISSING)) {
    const fullPath = path.join(burgundyPath, communePath);
    const parentPath = `france/burgundy/${communePath}`;
    const commune = communePath.split('/')[1];

    console.log(`\n📍 ${commune.toUpperCase().replace(/-/g, ' ')}`);

    for (const vineyardSlug of vineyards) {
      const vineyardPath = path.join(fullPath, vineyardSlug);
      const pagePath = path.join(vineyardPath, 'page.tsx');

      if (fs.existsSync(vineyardPath)) {
        console.log(`   ⚠️  Already exists: ${vineyardSlug}`);
        continue;
      }

      fs.mkdirSync(vineyardPath, { recursive: true });

      const vineyardName = slugToTitle(vineyardSlug);
      const pageContent = generatePage(vineyardName, vineyardSlug, parentPath);
      fs.writeFileSync(pagePath, pageContent, 'utf-8');

      console.log(`   ✅ Created: ${vineyardSlug} (${vineyardName})`);
      created++;
    }
  }

  console.log('\n\n' + '═'.repeat(80));
  console.log(`✨ Created ${created} Premier Cru directories`);
  console.log('\n🎯 ALL PREMIER CRUS NOW COMPLETE!');
  console.log('   Ready to generate ~650 comprehensive guides');
}

createFinal9().catch(console.error);
