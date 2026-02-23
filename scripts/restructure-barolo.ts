/**
 * RESTRUCTURE BAROLO DIRECTORY
 *
 * Transforms flat MGA structure into hierarchical commune-based structure:
 * barolo/[177 MGAs] → barolo/[11 communes]/[MGAs per commune]
 *
 * Steps:
 * 1. Create commune directories
 * 2. Move MGA directories to their communes
 * 3. Update MGA page.tsx files (parentRegion paths)
 * 4. Create commune page.tsx files
 * 5. Update barolo/page.tsx to show communes
 */

import fs from 'fs';
import path from 'path';

const BAROLO_DIR = path.join(process.cwd(), 'app', 'regions', 'italy', 'piedmont', 'barolo');
const MAPPING_FILE = path.join(process.cwd(), 'data', 'barolo-commune-mapping.json');

interface MgaMapping {
  mgaName: string;
  mgaSlug: string;
  commune: string;
  communeName: string;
}

// Commune data with display names
const COMMUNE_DATA: Record<string, { name: string; slug: string }> = {
  'la-morra': { name: 'La Morra', slug: 'la-morra' },
  'serralunga-d-alba': { name: "Serralunga d'Alba", slug: 'serralunga-d-alba' },
  'barolo': { name: 'Barolo', slug: 'barolo' },
  'monforte-d-alba': { name: "Monforte d'Alba", slug: 'monforte-d-alba' },
  'castiglione-falletto': { name: 'Castiglione Falletto', slug: 'castiglione-falletto' },
  'verduno': { name: 'Verduno', slug: 'verduno' },
  'novello': { name: 'Novello', slug: 'novello' },
  'cherasco': { name: 'Cherasco', slug: 'cherasco' },
  'diano-d-alba': { name: "Diano d'Alba", slug: 'diano-d-alba' },
  'grinzane-cavour': { name: 'Grinzane Cavour', slug: 'grinzane-cavour' },
  'roddi': { name: 'Roddi', slug: 'roddi' },
};

async function main() {
  console.log('\n🍷 RESTRUCTURING BAROLO DIRECTORY');
  console.log('='.repeat(70));

  // Load mapping
  console.log('\n📖 Loading commune mapping...');
  const mapping: MgaMapping[] = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
  console.log(`   Loaded ${mapping.length} MGA mappings`);

  // Group MGAs by commune
  const mgasByCommune = new Map<string, MgaMapping[]>();
  for (const mga of mapping) {
    if (!mgasByCommune.has(mga.commune)) {
      mgasByCommune.set(mga.commune, []);
    }
    mgasByCommune.get(mga.commune)!.push(mga);
  }

  console.log(`\n📁 Found ${mgasByCommune.size} communes:`);
  for (const [commune, mgas] of mgasByCommune.entries()) {
    console.log(`   - ${COMMUNE_DATA[commune]?.name || commune}: ${mgas.length} MGAs`);
  }

  // Step 1: Create commune directories
  console.log('\n📂 Step 1: Creating commune directories...');
  let created = 0;
  for (const communeSlug of mgasByCommune.keys()) {
    const communeDir = path.join(BAROLO_DIR, communeSlug);
    if (!fs.existsSync(communeDir)) {
      fs.mkdirSync(communeDir, { recursive: true });
      console.log(`   ✓ Created: ${communeSlug}/`);
      created++;
    } else {
      console.log(`   - Already exists: ${communeSlug}/`);
    }
  }
  console.log(`   Created ${created} new commune directories`);

  // Step 2: Move MGA directories
  console.log('\n📦 Step 2: Moving MGA directories to communes...');
  let moved = 0;
  let errors = 0;

  for (const mga of mapping) {
    const mgaDir = path.join(BAROLO_DIR, mga.mgaSlug);
    const targetDir = path.join(BAROLO_DIR, mga.commune, mga.mgaSlug);

    if (!fs.existsSync(mgaDir)) {
      console.log(`   ⚠️  MGA directory not found: ${mga.mgaSlug}`);
      errors++;
      continue;
    }

    if (fs.existsSync(targetDir)) {
      console.log(`   - Already moved: ${mga.commune}/${mga.mgaSlug}`);
      continue;
    }

    try {
      fs.renameSync(mgaDir, targetDir);
      console.log(`   ✓ Moved: ${mga.mgaSlug} → ${mga.commune}/${mga.mgaSlug}`);
      moved++;
    } catch (error) {
      console.log(`   ❌ Failed to move ${mga.mgaSlug}:`, error);
      errors++;
    }
  }
  console.log(`   Moved ${moved} MGA directories (${errors} errors)`);

  // Step 3: Update MGA page.tsx files
  console.log('\n✏️  Step 3: Updating MGA page.tsx files...');
  let updated = 0;

  for (const mga of mapping) {
    const mgaPageFile = path.join(BAROLO_DIR, mga.commune, mga.mgaSlug, 'page.tsx');

    if (!fs.existsSync(mgaPageFile)) {
      console.log(`   ⚠️  Page file not found: ${mga.commune}/${mga.mgaSlug}/page.tsx`);
      continue;
    }

    try {
      let content = fs.readFileSync(mgaPageFile, 'utf-8');
      const oldParentRegion = 'italy/piedmont/barolo';
      const newParentRegion = `italy/piedmont/barolo/${mga.commune}`;

      if (content.includes(oldParentRegion)) {
        content = content.replace(
          new RegExp(`parentRegion="${oldParentRegion}"`, 'g'),
          `parentRegion="${newParentRegion}"`
        );

        fs.writeFileSync(mgaPageFile, content);
        updated++;
      }
    } catch (error) {
      console.log(`   ❌ Failed to update ${mga.mgaSlug}:`, error);
    }
  }
  console.log(`   Updated ${updated} MGA page files`);

  // Step 4: Create commune page.tsx files
  console.log('\n📄 Step 4: Creating commune page.tsx files...');
  let communePagesCreated = 0;

  for (const [communeSlug, mgas] of mgasByCommune.entries()) {
    const communePageFile = path.join(BAROLO_DIR, communeSlug, 'page.tsx');

    if (fs.existsSync(communePageFile)) {
      console.log(`   - Already exists: ${communeSlug}/page.tsx`);
      continue;
    }

    const communeData = COMMUNE_DATA[communeSlug];
    if (!communeData) {
      console.log(`   ⚠️  No commune data for: ${communeSlug}`);
      continue;
    }

    // Sort MGAs alphabetically
    const sortedMgas = mgas.sort((a, b) => a.mgaName.localeCompare(b.mgaName));

    const communePageContent = `import RegionLayout from '@/components/RegionLayout';

const ${communeSlug.toUpperCase().replace(/-/g, '_')}_MGAS = ${JSON.stringify(
      sortedMgas.map(mga => ({
        name: mga.mgaName,
        slug: mga.mgaSlug,
        classification: 'mga'
      })),
      null,
      2
    )} as const;

export default function ${communeData.name.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  return (
    <RegionLayout
      title="${communeData.name}"
      level="commune"
      parentRegion="italy/piedmont/barolo"
      sidebarLinks={${communeSlug.toUpperCase().replace(/-/g, '_')}_MGAS}
      contentFile="${communeSlug}-guide.md"
    />
  );
}
`;

    fs.writeFileSync(communePageFile, communePageContent);
    console.log(`   ✓ Created: ${communeSlug}/page.tsx (${mgas.length} MGAs)`);
    communePagesCreated++;
  }
  console.log(`   Created ${communePagesCreated} commune page files`);

  // Step 5: Update main barolo/page.tsx
  console.log('\n📝 Step 5: Updating barolo/page.tsx...');

  const baroloPageFile = path.join(BAROLO_DIR, 'page.tsx');
  const communes = Array.from(mgasByCommune.keys())
    .filter(slug => COMMUNE_DATA[slug])
    .sort()
    .map(slug => ({
      name: COMMUNE_DATA[slug].name,
      slug,
      classification: 'commune'
    }));

  const baroloPageContent = `import RegionLayout from '@/components/RegionLayout';

const BAROLO_COMMUNES = ${JSON.stringify(communes, null, 2)} as const;

export default function BaroloPage() {
  return (
    <RegionLayout
      title="Barolo"
      level="sub-region"
      parentRegion="italy/piedmont"
      sidebarLinks={BAROLO_COMMUNES}
      contentFile="barolo-guide.md"
    />
  );
}
`;

  fs.writeFileSync(baroloPageFile, baroloPageContent);
  console.log(`   ✓ Updated barolo/page.tsx (now shows ${communes.length} communes)`);

  // Summary
  console.log('\n✅ RESTRUCTURING COMPLETE');
  console.log('='.repeat(70));
  console.log(`Communes created: ${created}`);
  console.log(`MGAs moved: ${moved}`);
  console.log(`MGA pages updated: ${updated}`);
  console.log(`Commune pages created: ${communePagesCreated}`);
  console.log(`\nNew structure:`);
  console.log(`  barolo/ (shows ${communes.length} communes)`);
  for (const [commune, mgas] of mgasByCommune.entries()) {
    console.log(`  └─ ${commune}/ (${mgas.length} MGAs)`);
  }

  console.log('\n⚠️  Note: You still need to generate the commune guide markdown files:');
  for (const commune of communes) {
    console.log(`  - guides/${commune.slug}-guide.md`);
  }
}

main().catch(console.error);
