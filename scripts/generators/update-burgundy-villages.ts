import fs from 'fs';
import path from 'path';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function updateVillagePages() {
  // Process Côte de Nuits villages
  const cdnDataPath = path.join(process.cwd(), 'data', 'burgundy-premier-crus-cote-de-nuits-additional.json');
  const cdnData = JSON.parse(fs.readFileSync(cdnDataPath, 'utf-8'));

  // Group by village
  const cdnByVillage: Record<string, any[]> = {};
  for (const pc of cdnData) {
    const village = pc.appellationName;
    if (!cdnByVillage[village]) cdnByVillage[village] = [];
    cdnByVillage[village].push(pc);
  }

  // Process Côte de Beaune villages
  const cdbDataPath = path.join(process.cwd(), 'data', 'burgundy-premier-crus-cote-de-beaune-additional.json');
  const cdbData = JSON.parse(fs.readFileSync(cdbDataPath, 'utf-8'));

  const cdbByVillage: Record<string, any[]> = {};
  for (const pc of cdbData) {
    const village = pc.appellationName;
    if (!cdbByVillage[village]) cdbByVillage[village] = [];
    cdbByVillage[village].push(pc);
  }

  // Also get Grand Crus
  const gcDataPath = path.join(process.cwd(), 'data', 'burgundy-grand-crus.json');
  const gcData = JSON.parse(fs.readFileSync(gcDataPath, 'utf-8'));

  const gcByVillage: Record<string, any[]> = {};
  for (const gc of gcData) {
    const village = gc.appellationName || gc.villageName || gc.name; // Different formats
    if (!gcByVillage[village]) gcByVillage[village] = [];
    gcByVillage[village].push(gc);
  }

  let updated = 0;

  // Update Côte de Nuits village pages
  for (const [villageName, premierCrus] of Object.entries(cdnByVillage)) {
    const villageSlug = slugify(villageName);
    const pagePath = path.join(
      process.cwd(),
      'app', 'regions', 'france', 'burgundy', 'cote-de-nuits',
      villageSlug, 'page.tsx'
    );

    if (!fs.existsSync(pagePath)) {
      // Create village page if it doesn't exist
      const dirPath = path.dirname(pagePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const grandCrus = gcByVillage[villageName] || [];
      const sidebarLinks = [
        ...grandCrus.map(gc => ({
          name: gc.name,
          slug: slugify(gc.name),
          classification: 'grand-cru' as const
        })).sort((a, b) => a.name.localeCompare(b.name)),
        ...premierCrus.map(pc => ({
          name: pc.name,
          slug: slugify(pc.name),
          classification: 'premier-cru' as const
        })).sort((a, b) => a.name.localeCompare(b.name))
      ];

      const content = `import RegionLayout from '@/components/RegionLayout';

const ${villageSlug.toUpperCase().replace(/-/g, '_')}_VINEYARDS = ${JSON.stringify(sidebarLinks, null, 2)};

export default function ${villageName.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  return (
    <RegionLayout
      title="${villageName}"
      level="village"
      parentRegion="france/burgundy/cote-de-nuits"
      sidebarLinks={${villageSlug.toUpperCase().replace(/-/g, '_')}_VINEYARDS}
      contentFile="${villageSlug}-guide.md"
    />
  );
}
`;

      fs.writeFileSync(pagePath, content);
      updated++;
      console.log(`✓ Created/Updated Côte de Nuits: ${villageName} (${sidebarLinks.length} vineyards)`);
    }
  }

  // Update Côte de Beaune village pages
  for (const [villageName, premierCrus] of Object.entries(cdbByVillage)) {
    const villageSlug = slugify(villageName);
    const pagePath = path.join(
      process.cwd(),
      'app', 'regions', 'france', 'burgundy', 'cote-de-beaune',
      villageSlug, 'page.tsx'
    );

    // Check if page exists and read it
    let existingContent = '';
    if (fs.existsSync(pagePath)) {
      existingContent = fs.readFileSync(pagePath, 'utf-8');
    }

    const grandCrus = gcByVillage[villageName] || [];
    const sidebarLinks = [
      ...grandCrus.map(gc => ({
        name: gc.name,
        slug: slugify(gc.name),
        classification: 'grand-cru' as const
      })).sort((a, b) => a.name.localeCompare(b.name)),
      ...premierCrus.map(pc => ({
        name: pc.name,
        slug: slugify(pc.name),
        classification: 'premier-cru' as const
      })).sort((a, b) => a.name.localeCompare(b.name))
    ];

    // Only update if there are vineyards to add
    if (sidebarLinks.length > 0) {
      const content = `import RegionLayout from '@/components/RegionLayout';

const ${villageSlug.toUpperCase().replace(/-/g, '_')}_VINEYARDS = ${JSON.stringify(sidebarLinks, null, 2)};

export default function ${villageName.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  return (
    <RegionLayout
      title="${villageName}"
      level="village"
      parentRegion="france/burgundy/cote-de-beaune"
      sidebarLinks={${villageSlug.toUpperCase().replace(/-/g, '_')}_VINEYARDS}
      contentFile="${villageSlug}-guide.md"
    />
  );
}
`;

      const dirPath = path.dirname(pagePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      fs.writeFileSync(pagePath, content);
      updated++;
      console.log(`✓ Created/Updated Côte de Beaune: ${villageName} (${sidebarLinks.length} vineyards)`);
    }
  }

  console.log(`\n✅ Updated ${updated} Burgundy village pages`);
}

updateVillagePages().catch(console.error);
