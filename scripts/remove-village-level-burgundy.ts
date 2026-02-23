import fs from 'fs';
import path from 'path';

/**
 * REMOVE VILLAGE-LEVEL VINEYARDS FROM BURGUNDY
 *
 * Focus only on Grand Crus and Premier Crus for now.
 * Village-level lieux-dits can be added later.
 */

const BURGUNDY_PATH = '/Users/jordanabraham/wine-reviews/app/regions/france/burgundy';

// First, fix misclassifications (these are actually Premier Crus)
const FIX_TO_PREMIER_CRU: Record<string, string[]> = {
  'vosne-romanee': ['la-croix-rameau', 'les-rouges'],
  'volnay': ['caillerets'], // Les Caillerets is a famous Premier Cru
};

// These are true village-level - remove them for now
const REMOVE_VILLAGE_LEVEL: Record<string, string[]> = {
  'volnay': ['santenots'], // Actually in Meursault appellation
  'gevrey-chambertin': ['la-petite-chapelle'], // True village-level
  'morey-saint-denis': ['bonnes-mares-morey', 'la-riotte'],
  'vougeot': ['le-clos-blanc'],
};

function fixAndRemoveVillageLevel(communeSlug: string, subRegion: string) {
  const communePath = path.join(BURGUNDY_PATH, subRegion, communeSlug);
  const pagePath = path.join(communePath, 'page.tsx');

  if (!fs.existsSync(pagePath)) {
    console.log(`⚠️  ${communeSlug}: page.tsx not found`);
    return;
  }

  let content = fs.readFileSync(pagePath, 'utf-8');
  let changes = 0;

  // Step 1: Fix misclassifications
  const toFix = FIX_TO_PREMIER_CRU[communeSlug] || [];
  for (const slug of toFix) {
    const wrongPattern = new RegExp(
      `{ name: '([^']+)', slug: '${slug}', classification: 'village' as const }`,
      'g'
    );

    if (content.match(wrongPattern)) {
      content = content.replace(
        wrongPattern,
        `{ name: '$1', slug: '${slug}', classification: 'premier-cru' as const }`
      );
      console.log(`   ✅ Fixed ${slug}: village → premier-cru`);
      changes++;
    }
  }

  // Step 2: Remove village-level entries
  const toRemove = REMOVE_VILLAGE_LEVEL[communeSlug] || [];
  for (const slug of toRemove) {
    const removePattern = new RegExp(
      `\\s*{ name: '[^']+', slug: '${slug}', classification: 'village' as const },?\\n`,
      'g'
    );

    if (content.match(removePattern)) {
      content = content.replace(removePattern, '');
      console.log(`   🗑️  Removed village-level: ${slug}`);
      changes++;
    }
  }

  if (changes > 0) {
    fs.writeFileSync(pagePath, content, 'utf-8');
    console.log(`   💾 Saved ${communeSlug}: ${changes} changes\n`);
  } else {
    console.log(`   ✓ ${communeSlug}: No changes needed\n`);
  }
}

function processAllCommunes() {
  console.log('🔧 REMOVING VILLAGE-LEVEL VINEYARDS FROM BURGUNDY\n');
  console.log('Focus: Grand Crus and Premier Crus only');
  console.log('═'.repeat(80));

  const communes = [
    { slug: 'gevrey-chambertin', subRegion: 'cote-de-nuits' },
    { slug: 'vosne-romanee', subRegion: 'cote-de-nuits' },
    { slug: 'morey-saint-denis', subRegion: 'cote-de-nuits' },
    { slug: 'vougeot', subRegion: 'cote-de-nuits' },
    { slug: 'volnay', subRegion: 'cote-de-beaune' },
  ];

  for (const commune of communes) {
    console.log(`\n📍 ${commune.slug.toUpperCase().replace(/-/g, ' ')}`);
    fixAndRemoveVillageLevel(commune.slug, commune.subRegion);
  }

  console.log('═'.repeat(80));
  console.log('✨ Village-level removal complete!');
  console.log('\n📊 Summary:');
  console.log('   - Fixed misclassified Premier Crus');
  console.log('   - Removed true village-level lieux-dits');
  console.log('   - Ready to generate guides for Grand Crus + Premier Crus only');
}

processAllCommunes();
