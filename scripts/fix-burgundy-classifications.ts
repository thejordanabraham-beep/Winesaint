import fs from 'fs';
import path from 'path';

/**
 * FIX BURGUNDY VINEYARD CLASSIFICATIONS
 *
 * The audit script incorrectly classified many vineyards as 'village'
 * because it couldn't extract classification from Sanity CMS-based pages.
 *
 * This script fixes them using official INAO data.
 */

const BURGUNDY_PATH = '/Users/jordanabraham/wine-reviews/app/regions/france/burgundy';

// Official INAO classifications
const CORRECT_CLASSIFICATIONS: Record<string, Record<string, 'grand-cru' | 'premier-cru'>> = {
  'gevrey-chambertin': {
    // Grand Crus
    'chambertin-clos-de-beze': 'grand-cru',

    // Premier Crus
    'champeaux': 'premier-cru',
    'estournelles-saint-jacques': 'premier-cru',
    'fonteny': 'premier-cru',
    'lavaux-saint-jacques': 'premier-cru',
    'poissenot': 'premier-cru',
  },
  'vosne-romanee': {
    // All Vosne Grand Crus
    'romanee-conti': 'grand-cru',
    'la-romanee': 'grand-cru',
    'la-tache': 'grand-cru',
    'romanee-saint-vivant': 'grand-cru',
    'richebourg': 'grand-cru',
    'la-grande-rue': 'grand-cru',
    'echezeaux': 'grand-cru',
    'grands-echezeaux': 'grand-cru',
  },
  'morey-saint-denis': {
    // Grand Crus
    'clos-de-tart': 'grand-cru',
    'clos-de-la-roche': 'grand-cru',
    'clos-saint-denis': 'grand-cru',
    'clos-des-lambrays': 'grand-cru',
    'bonnes-mares': 'grand-cru', // part
  },
  'vougeot': {
    // Grand Cru
    'clos-de-vougeot': 'grand-cru',
  },
  'chambolle-musigny': {
    // Grand Crus
    'musigny': 'grand-cru',
    'bonnes-mares': 'grand-cru', // part

    // Top Premier Crus often miscategorized
    'les-amoureuses': 'premier-cru',
    'les-charmes': 'premier-cru',
    'les-fuees': 'premier-cru',
    'les-cras': 'premier-cru',
    'les-baudes': 'premier-cru',
  },
  'volnay': {
    // No Grand Crus in Volnay, all are Premier Crus or village
  },
};

interface VineyardEntry {
  name: string;
  slug: string;
  classification: string;
}

function fixCommunePage(communeSlug: string, subRegion: string) {
  const subRegionPath = path.join(BURGUNDY_PATH, subRegion, communeSlug);
  const pagePath = path.join(subRegionPath, 'page.tsx');

  if (!fs.existsSync(pagePath)) {
    console.log(`⚠️  ${communeSlug}: page.tsx not found`);
    return;
  }

  let content = fs.readFileSync(pagePath, 'utf-8');

  // Extract the array name
  const arrayMatch = content.match(/const ([A-Z_]+)_VINEYARDS = \[/);
  if (!arrayMatch) {
    console.log(`⚠️  ${communeSlug}: Could not find VINEYARDS array`);
    return;
  }

  const corrections = CORRECT_CLASSIFICATIONS[communeSlug] || {};
  let fixed = 0;
  let duplicatesRemoved = 0;

  // Fix misclassifications
  for (const [slug, correctClassification] of Object.entries(corrections)) {
    const wrongPattern = new RegExp(
      `{ name: '([^']+)', slug: '${slug}', classification: 'village' as const }`,
      'g'
    );

    const matches = content.match(wrongPattern);
    if (matches) {
      content = content.replace(
        wrongPattern,
        `{ name: '$1', slug: '${slug}', classification: '${correctClassification}' as const }`
      );
      fixed += matches.length;
      console.log(`   ✅ Fixed ${slug}: village → ${correctClassification}`);
    }
  }

  // Remove duplicates (keep premier-cru version, remove village version)
  const lines = content.split('\n');
  const seenSlugs = new Set<string>();
  const filteredLines: string[] = [];

  for (const line of lines) {
    const slugMatch = line.match(/slug: '([^']+)'/);
    if (slugMatch) {
      const slug = slugMatch[1];

      // If we've seen this slug before
      if (seenSlugs.has(slug)) {
        // Only keep if it's NOT classified as village
        if (!line.includes("classification: 'village'")) {
          // Remove the previous one if it was village
          const lastIndex = filteredLines.length - 1;
          if (filteredLines[lastIndex].includes(`slug: '${slug}'`) &&
              filteredLines[lastIndex].includes("classification: 'village'")) {
            filteredLines.pop(); // Remove the village version
            filteredLines.push(line); // Add the better classified version
            duplicatesRemoved++;
            console.log(`   🗑️  Removed duplicate village entry for: ${slug}`);
          }
        } else {
          // Skip this village version
          duplicatesRemoved++;
          console.log(`   🗑️  Removed duplicate village entry for: ${slug}`);
          continue;
        }
      } else {
        seenSlugs.add(slug);
        filteredLines.push(line);
      }
    } else {
      filteredLines.push(line);
    }
  }

  content = filteredLines.join('\n');

  // Write back
  if (fixed > 0 || duplicatesRemoved > 0) {
    fs.writeFileSync(pagePath, content, 'utf-8');
    console.log(`   💾 Saved ${communeSlug}: ${fixed} fixed, ${duplicatesRemoved} duplicates removed\n`);
  } else {
    console.log(`   ✓ ${communeSlug}: No changes needed\n`);
  }
}

function fixAllCommunes() {
  console.log('🔧 FIXING BURGUNDY VINEYARD CLASSIFICATIONS\n');
  console.log('═'.repeat(80));

  const communes = [
    { slug: 'gevrey-chambertin', subRegion: 'cote-de-nuits' },
    { slug: 'vosne-romanee', subRegion: 'cote-de-nuits' },
    { slug: 'morey-saint-denis', subRegion: 'cote-de-nuits' },
    { slug: 'vougeot', subRegion: 'cote-de-nuits' },
    { slug: 'chambolle-musigny', subRegion: 'cote-de-nuits' },
    { slug: 'volnay', subRegion: 'cote-de-beaune' },
  ];

  for (const commune of communes) {
    console.log(`\n📍 ${commune.slug.toUpperCase().replace(/-/g, ' ')}`);
    fixCommunePage(commune.slug, commune.subRegion);
  }

  console.log('═'.repeat(80));
  console.log('✨ Classification fixes complete!');
  console.log('\n🎯 Next step: Re-run audit to ensure all vineyards properly categorized');
}

fixAllCommunes();
