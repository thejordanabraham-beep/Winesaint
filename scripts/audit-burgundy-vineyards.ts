import fs from 'fs';
import path from 'path';

interface Vineyard {
  name: string;
  slug: string;
  classification: 'grand-cru' | 'premier-cru' | 'village';
}

interface CommuneInfo {
  name: string;
  slug: string;
  subRegion: string;
  path: string;
  vineyards: Vineyard[];
}

const SUB_REGIONS = {
  'cote-de-nuits': 'Côte de Nuits',
  'cote-de-beaune': 'Côte de Beaune',
  'cote-chalonnaise': 'Côte Chalonnaise',
};

// Helper to convert slug to proper title case
function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => {
      // Handle special cases
      if (word === 'de' || word === 'du' || word === 'des' || word === 'la' || word === 'le' || word === 'les') {
        return word;
      }
      if (word === 'saint') return 'Saint';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('-')
    .replace(/-De-/g, '-de-')
    .replace(/-Du-/g, '-du-')
    .replace(/-Des-/g, '-des-')
    .replace(/-La-/g, '-la-')
    .replace(/-Le-/g, '-le-')
    .replace(/-Les-/g, '-les-');
}

// Extract classification from vineyard page.tsx
function extractClassification(vineyardPath: string, slug: string): 'grand-cru' | 'premier-cru' | 'village' | null {
  const pagePath = path.join(vineyardPath, 'page.tsx');

  if (!fs.existsSync(pagePath)) {
    return null;
  }

  const content = fs.readFileSync(pagePath, 'utf-8');

  // Look for classification prop
  const classificationMatch = content.match(/classification=["']([^"']+)["']/);
  if (classificationMatch) {
    return classificationMatch[1] as 'grand-cru' | 'premier-cru' | 'village';
  }

  // Check contentFile name for hints
  const contentFileMatch = content.match(/contentFile=["']([^"']+)["']/);
  if (contentFileMatch) {
    const fileName = contentFileMatch[1];
    if (fileName.includes('grand-cru')) return 'grand-cru';
    if (fileName.includes('premier-cru')) return 'premier-cru';
  }

  // Known Grand Crus by name pattern
  const grandCruPatterns = [
    'chambertin',
    'clos-de-beze',
    'chapelle-chambertin',
    'charmes-chambertin',
    'griotte-chambertin',
    'latricieres-chambertin',
    'mazis-chambertin',
    'mazoyeres-chambertin',
    'ruchottes-chambertin',
    'musigny',
    'bonnes-mares',
    'clos-de-tart',
    'clos-de-la-roche',
    'clos-saint-denis',
    'clos-des-lambrays',
    'grands-echezeaux',
    'echezeaux',
    'richebourg',
    'romanee-conti',
    'la-romanee',
    'romanee-saint-vivant',
    'la-tache',
    'la-grande-rue',
    'corton',
    'montrachet',
    'batard-montrachet',
    'bienvenues-batard-montrachet',
    'chevalier-montrachet',
    'criots-batard-montrachet',
  ];

  if (grandCruPatterns.some(pattern => slug.includes(pattern) && slug === pattern)) {
    return 'grand-cru';
  }

  // Check for "Clos" or "Les" prefix which often indicates Premier Cru
  if (slug.startsWith('clos-') || slug.startsWith('les-') || slug.startsWith('aux-') || slug.startsWith('en-')) {
    return 'premier-cru';
  }

  // Default to village level
  return 'village';
}

// Scan a commune directory and get all vineyards
function scanCommune(communePath: string, communeSlug: string, subRegionSlug: string): CommuneInfo {
  const vineyards: Vineyard[] = [];

  const entries = fs.readdirSync(communePath, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const vineyardSlug = entry.name;
    const vineyardPath = path.join(communePath, vineyardSlug);

    const classification = extractClassification(vineyardPath, vineyardSlug);
    if (!classification) continue;

    const vineyardName = slugToTitle(vineyardSlug);

    vineyards.push({
      name: vineyardName,
      slug: vineyardSlug,
      classification,
    });
  }

  // Sort: Grand Crus first, then Premier Crus, then village, alphabetically within each group
  vineyards.sort((a, b) => {
    const order = { 'grand-cru': 0, 'premier-cru': 1, 'village': 2 };
    if (order[a.classification] !== order[b.classification]) {
      return order[a.classification] - order[b.classification];
    }
    return a.name.localeCompare(b.name);
  });

  return {
    name: slugToTitle(communeSlug),
    slug: communeSlug,
    subRegion: SUB_REGIONS[subRegionSlug as keyof typeof SUB_REGIONS],
    path: communePath,
    vineyards,
  };
}

// Update commune page.tsx with complete vineyard list
function updateCommunePage(commune: CommuneInfo): void {
  const pagePath = path.join(commune.path, 'page.tsx');

  if (!fs.existsSync(pagePath)) {
    console.log(`⚠️  Page not found: ${pagePath}`);
    return;
  }

  const content = fs.readFileSync(pagePath, 'utf-8');

  // Generate new vineyards array
  const constantName = commune.slug.toUpperCase().replace(/-/g, '');
  const vineyardsList = commune.vineyards
    .map(v => `  { name: '${v.name}', slug: '${v.slug}', classification: '${v.classification}' as const },`)
    .join('\n');

  const newArray = `const ${constantName}_VINEYARDS = [\n${vineyardsList}\n] as const;`;

  // Replace the existing array
  const arrayPattern = new RegExp(`const ${constantName}_VINEYARDS = \\[[\\s\\S]*?\\] as const;`);

  if (arrayPattern.test(content)) {
    const newContent = content.replace(arrayPattern, newArray);
    fs.writeFileSync(pagePath, newContent, 'utf-8');
    console.log(`✅ Updated ${commune.name}: ${commune.vineyards.length} vineyards`);
  } else {
    console.log(`⚠️  Could not find array pattern in ${commune.name}`);
  }
}

// Main execution
async function main() {
  const burgundyPath = '/Users/jordanabraham/wine-reviews/app/regions/france/burgundy';

  console.log('🍷 Burgundy Vineyard Audit Starting...\n');

  for (const [subRegionSlug, subRegionName] of Object.entries(SUB_REGIONS)) {
    const subRegionPath = path.join(burgundyPath, subRegionSlug);

    if (!fs.existsSync(subRegionPath)) {
      console.log(`⚠️  Sub-region not found: ${subRegionSlug}`);
      continue;
    }

    console.log(`\n📍 ${subRegionName}`);
    console.log('─'.repeat(60));

    const communes = fs.readdirSync(subRegionPath, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);

    for (const communeSlug of communes) {
      const communePath = path.join(subRegionPath, communeSlug);
      const communeInfo = scanCommune(communePath, communeSlug, subRegionSlug);

      const grandCrus = communeInfo.vineyards.filter(v => v.classification === 'grand-cru').length;
      const premierCrus = communeInfo.vineyards.filter(v => v.classification === 'premier-cru').length;
      const village = communeInfo.vineyards.filter(v => v.classification === 'village').length;

      console.log(`\n  ${communeInfo.name}:`);
      console.log(`    Grand Crus: ${grandCrus}`);
      console.log(`    Premier Crus: ${premierCrus}`);
      console.log(`    Village: ${village}`);
      console.log(`    Total: ${communeInfo.vineyards.length}`);

      updateCommunePage(communeInfo);
    }
  }

  console.log('\n\n✨ Audit complete!\n');
}

main().catch(console.error);
