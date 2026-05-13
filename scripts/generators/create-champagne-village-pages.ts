import fs from 'fs';
import path from 'path';

// Montagne de Reims villages
const MONTAGNE_DE_REIMS = {
  grandCrus: [
    'ambonnay', 'beaumont-sur-vesle', 'bouzy', 'louvois', 'mailly-champagne',
    'puisieulx', 'sillery', 'verzenay', 'verzy'
  ],
  premierCrus: [
    'bezannes', 'chamery', 'chigny-les-roses', 'coligny', 'cormontreuil',
    'coulommes-la-montagne', 'ecueil', 'jouy-les-reims', 'les-mesneux', 'ludes',
    'montbre', 'pargny-les-reims', 'rilly-la-montagne', 'sacy', 'sermiers',
    'taissy', 'tauxieres-mutry', 'trepail', 'trois-puits', 'vaudemange',
    'villedommange', 'villers-allerand', 'villers-aux-noeuds', 'villers-marmery', 'vrigny'
  ]
};

// Côte des Blancs villages
const COTE_DES_BLANCS = {
  grandCrus: ['avize', 'chouilly', 'cramant', 'le-mesnil-sur-oger', 'oger', 'oiry'],
  premierCrus: ['bergeres-les-vertus', 'cuis', 'etrechy', 'grauves', 'vertus', 'villeneuve-renneville', 'voipreux']
};

// Vallée de la Marne villages
const VALLEE_DE_LA_MARNE = {
  grandCrus: ['ay'],
  premierCrus: ['avenay-val-dor', 'bisseuil', 'champillon', 'cumieres', 'dizy', 'hautvillers', 'mareuil-sur-ay', 'mutigny']
};

// Côte de Sézanne villages
const COTE_DE_SEZANNE = [
  'allemant', 'barbonne-fayel', 'bethon', 'broyes', 'chantemerle',
  'fontaine-denis-nuisy', 'la-celle-sous-chantemerle', 'montgenost',
  'saudoy', 'sezanne', 'villenauxe-la-grande', 'vindey'
];

// Côte des Bar villages
const COTE_DES_BAR = [
  'bar-sur-aube', 'bar-sur-seine', 'buxeuil', 'celles-sur-ource',
  'essoyes', 'gye-sur-seine', 'landreville', 'les-riceys',
  'mussy-sur-seine', 'polisot', 'urville'
];

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/\bDe\b/g, 'de')
    .replace(/\bDes\b/g, 'des')
    .replace(/\bLa\b/g, 'la')
    .replace(/\bLe\b/g, 'le')
    .replace(/\bLes\b/g, 'les')
    .replace(/\bSur\b/g, 'sur')
    .replace(/\bSous\b/g, 'sous')
    .replace(/\bAux\b/g, 'aux')
    .replace(/D'or/g, 'd\'Or');
}

function createVillagePage(subRegion: string, villageSlug: string, guideFileName: string) {
  const villageTitle = slugToTitle(villageSlug);
  const subRegionTitle = slugToTitle(subRegion);

  const pageContent = `import RegionLayout from '@/components/RegionLayout';

export default async function ${villageSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Page() {
  return (
    <RegionLayout
      title="${villageTitle}"
      level="village"
      parentRegion="france/champagne/${subRegion}"
      contentFile="${guideFileName}"
    />
  );
}
`;

  const villagePath = path.join(
    process.cwd(),
    'app/regions/france/champagne',
    subRegion,
    villageSlug
  );

  // Create directory if it doesn't exist
  if (!fs.existsSync(villagePath)) {
    fs.mkdirSync(villagePath, { recursive: true });
  }

  // Write page.tsx file
  const pageFilePath = path.join(villagePath, 'page.tsx');
  fs.writeFileSync(pageFilePath, pageContent);

  console.log(`✓ Created: ${subRegion}/${villageSlug}/page.tsx`);
}

// Create all village pages
console.log('Creating Montagne de Reims Grand Cru pages...');
MONTAGNE_DE_REIMS.grandCrus.forEach(slug => {
  createVillagePage('montagne-de-reims', slug, `${slug}-guide.md`);
});

console.log('\nCreating Montagne de Reims Premier Cru pages...');
MONTAGNE_DE_REIMS.premierCrus.forEach(slug => {
  createVillagePage('montagne-de-reims', slug, `${slug}-guide.md`);
});

console.log('\nCreating Côte des Blancs Grand Cru pages...');
COTE_DES_BLANCS.grandCrus.forEach(slug => {
  createVillagePage('cote-des-blancs', slug, `${slug}-guide.md`);
});

console.log('\nCreating Côte des Blancs Premier Cru pages...');
COTE_DES_BLANCS.premierCrus.forEach(slug => {
  createVillagePage('cote-des-blancs', slug, `${slug}-guide.md`);
});

console.log('\nCreating Vallée de la Marne Grand Cru pages...');
VALLEE_DE_LA_MARNE.grandCrus.forEach(slug => {
  createVillagePage('vallee-de-la-marne', slug, `${slug}-guide.md`);
});

console.log('\nCreating Vallée de la Marne Premier Cru pages...');
VALLEE_DE_LA_MARNE.premierCrus.forEach(slug => {
  createVillagePage('vallee-de-la-marne', slug, `${slug}-guide.md`);
});

console.log('\nCreating Côte de Sézanne village pages...');
COTE_DE_SEZANNE.forEach(slug => {
  createVillagePage('cote-de-sezanne', slug, `${slug}-guide.md`);
});

console.log('\nCreating Côte des Bar village pages...');
COTE_DES_BAR.forEach(slug => {
  createVillagePage('cote-des-bar', slug, `${slug}-guide.md`);
});

console.log('\n✅ All village pages created!');
