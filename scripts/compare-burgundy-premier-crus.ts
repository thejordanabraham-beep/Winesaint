import fs from 'fs';
import path from 'path';

// Official Premier Cru counts from INAO and authoritative sources
const OFFICIAL_COUNTS: Record<string, { commune: string; premierCrus: number; source: string }> = {
  // Côte de Nuits
  'gevrey-chambertin': { commune: 'Gevrey-Chambertin', premierCrus: 26, source: 'INAO' },
  'morey-saint-denis': { commune: 'Morey-Saint-Denis', premierCrus: 20, source: 'INAO' },
  'chambolle-musigny': { commune: 'Chambolle-Musigny', premierCrus: 24, source: 'INAO' },
  'vougeot': { commune: 'Vougeot', premierCrus: 4, source: 'INAO' },
  'vosne-romanee': { commune: 'Vosne-Romanée', premierCrus: 14, source: 'INAO' },
  'nuits-saint-georges': { commune: 'Nuits-Saint-Georges', premierCrus: 41, source: 'INAO' },
  'fixin': { commune: 'Fixin', premierCrus: 7, source: 'INAO' },
  'marsannay': { commune: 'Marsannay', premierCrus: 3, source: 'INAO (since 2020)' },

  // Côte de Beaune
  'aloxe-corton': { commune: 'Aloxe-Corton', premierCrus: 14, source: 'INAO' },
  'pernand-vergelesses': { commune: 'Pernand-Vergelesses', premierCrus: 6, source: 'INAO' },
  'ladoix': { commune: 'Ladoix', premierCrus: 11, source: 'INAO' },
  'savigny-les-beaune': { commune: 'Savigny-lès-Beaune', premierCrus: 22, source: 'INAO' },
  'beaune': { commune: 'Beaune', premierCrus: 44, source: 'INAO' },
  'pommard': { commune: 'Pommard', premierCrus: 28, source: 'INAO' },
  'volnay': { commune: 'Volnay', premierCrus: 29, source: 'INAO' },
  'monthélie': { commune: 'Monthélie', premierCrus: 9, source: 'INAO' },
  'auxey-duresses': { commune: 'Auxey-Duresses', premierCrus: 9, source: 'INAO' },
  'meursault': { commune: 'Meursault', premierCrus: 0, source: 'No official PC (lieux-dits only)' },
  'puligny-montrachet': { commune: 'Puligny-Montrachet', premierCrus: 17, source: 'INAO' },
  'chassagne-montrachet': { commune: 'Chassagne-Montrachet', premierCrus: 55, source: 'INAO' },
  'saint-aubin': { commune: 'Saint-Aubin', premierCrus: 29, source: 'INAO' },
  'santenay': { commune: 'Santenay', premierCrus: 12, source: 'INAO' },
};

function extractClassification(vineyardPath: string): 'grand-cru' | 'premier-cru' | 'village' | null {
  const pagePath = path.join(vineyardPath, 'page.tsx');
  if (!fs.existsSync(pagePath)) return null;

  const content = fs.readFileSync(pagePath, 'utf-8');
  const classificationMatch = content.match(/classification=["']([^"']+)["']/);
  if (classificationMatch) {
    return classificationMatch[1] as 'grand-cru' | 'premier-cru' | 'village';
  }

  return null;
}

function scanCommune(communePath: string, communeSlug: string): { premierCrus: number; total: number } {
  const entries = fs.readdirSync(communePath, { withFileTypes: true });
  let premierCrus = 0;
  let total = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const classification = extractClassification(path.join(communePath, entry.name));
    if (classification === 'premier-cru') premierCrus++;
    if (classification) total++;
  }

  return { premierCrus, total };
}

async function main() {
  const burgundyPath = '/Users/jordanabraham/wine-reviews/app/regions/france/burgundy';

  console.log('🍷 BURGUNDY PREMIER CRU AUDIT');
  console.log('Comparing directories vs. official INAO classifications\n');
  console.log('═'.repeat(100));

  const subRegions = ['cote-de-nuits', 'cote-de-beaune'];

  let totalMissing = 0;
  let totalExtra = 0;

  for (const subRegionSlug of subRegions) {
    const subRegionPath = path.join(burgundyPath, subRegionSlug);
    if (!fs.existsSync(subRegionPath)) continue;

    console.log(`\n📍 ${subRegionSlug.toUpperCase().replace(/-/g, ' ')}`);
    console.log('─'.repeat(100));

    const communes = fs.readdirSync(subRegionPath, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);

    for (const communeSlug of communes) {
      const communePath = path.join(subRegionPath, communeSlug);
      const scanned = scanCommune(communePath, communeSlug);
      const official = OFFICIAL_COUNTS[communeSlug];

      if (!official) {
        console.log(`  ⚠️  ${communeSlug}: NO OFFICIAL DATA (found ${scanned.premierCrus} PC)`);
        continue;
      }

      const diff = scanned.premierCrus - official.premierCrus;
      const status = diff === 0 ? '✅' : diff > 0 ? '⚠️ ' : '❌';

      console.log(`  ${status} ${official.commune}:`);
      console.log(`      Official: ${official.premierCrus} Premier Crus`);
      console.log(`      Found:    ${scanned.premierCrus} Premier Crus`);

      if (diff !== 0) {
        if (diff < 0) {
          console.log(`      ❌ MISSING ${Math.abs(diff)} Premier Crus`);
          totalMissing += Math.abs(diff);
        } else {
          console.log(`      ⚠️  EXTRA ${diff} (may be village-level or duplicates)`);
          totalExtra += diff;
        }
      }
    }
  }

  console.log('\n\n═'.repeat(100));
  console.log('SUMMARY');
  console.log('═'.repeat(100));
  console.log(`Total Premier Crus MISSING: ${totalMissing}`);
  console.log(`Total entries needing verification: ${totalExtra}`);
  console.log('\n📋 RECOMMENDATION:');
  if (totalMissing > 0) {
    console.log('   Before generating guides, we should:');
    console.log('   1. Research official INAO Premier Cru lists for each commune');
    console.log('   2. Create missing Premier Cru directories');
    console.log('   3. Verify village-level vs. Premier Cru classifications');
    console.log('   4. Then proceed with guide generation');
  } else {
    console.log('   ✅ All Premier Crus appear to be accounted for!');
  }
}

main().catch(console.error);
