import fs from 'fs';
import path from 'path';

// Utility to convert name to slug
function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Utility to convert classification to proper format
function formatClassification(classification: string): string {
  const map: Record<string, string> = {
    'mga': 'mga',
    'premier_cru': 'premier-cru',
    'grand_cru': 'grand-cru',
    'gg': 'grosses-gewachs',
    'grand-cru': 'grand-cru',
    'premier-cru': 'premier-cru',
  };
  return map[classification] || classification;
}

// Check if page exists
function pageExists(pagePath: string): boolean {
  return fs.existsSync(pagePath);
}

// Create directory if it doesn't exist
function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Generate page.tsx content for a vineyard
function generateVineyardPage(
  vineyardName: string,
  parentPath: string,
  classification: string,
  regionSlug: string
): string {
  const classificationDisplay = classification === 'mga' ? 'MGA' :
                                 classification === 'premier-cru' ? 'Premier Cru' :
                                 classification === 'grand-cru' ? 'Grand Cru' :
                                 classification === 'grosses-gewachs' ? 'Grosses Gewächs' :
                                 classification;

  return `import RegionLayout from '@/components/RegionLayout';

export default function ${vineyardName.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  return (
    <RegionLayout
      title="${vineyardName}"
      level="vineyard"
      parentRegion="${parentPath}"
      classification="${classification}"
      contentFile="${slugify(vineyardName)}-guide.md"
    />
  );
}
`;
}

// Process Barolo MGAs
async function processBarolo() {
  const dataPath = path.join(process.cwd(), 'data', 'piedmont-barolo-mgas.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  let created = 0;
  let skipped = 0;

  for (const mga of data) {
    const slug = slugify(mga.name);
    const pagePath = path.join(process.cwd(), 'app', 'regions', 'italy', 'piedmont', 'barolo', slug, 'page.tsx');

    if (pageExists(pagePath)) {
      skipped++;
      continue;
    }

    const dirPath = path.dirname(pagePath);
    ensureDir(dirPath);

    const content = generateVineyardPage(
      mga.name,
      'italy/piedmont/barolo',
      'mga',
      'barolo'
    );

    fs.writeFileSync(pagePath, content);
    created++;
  }

  console.log(`Barolo: Created ${created}, Skipped ${skipped}`);
  return { created, skipped, vineyards: data };
}

// Process Barbaresco MGAs
async function processBarbaresco() {
  const dataPath = path.join(process.cwd(), 'data', 'piedmont-barbaresco-mgas.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  let created = 0;
  let skipped = 0;

  for (const mga of data) {
    const slug = slugify(mga.name);
    const pagePath = path.join(process.cwd(), 'app', 'regions', 'italy', 'piedmont', 'barbaresco', slug, 'page.tsx');

    if (pageExists(pagePath)) {
      skipped++;
      continue;
    }

    const dirPath = path.dirname(pagePath);
    ensureDir(dirPath);

    const content = generateVineyardPage(
      mga.name,
      'italy/piedmont/barbaresco',
      'mga',
      'barbaresco'
    );

    fs.writeFileSync(pagePath, content);
    created++;
  }

  console.log(`Barbaresco: Created ${created}, Skipped ${skipped}`);
  return { created, skipped, vineyards: data };
}

// Process Burgundy Premier Crus (Côte de Nuits)
async function processBurgundyPremierCrusCdN() {
  const dataPath = path.join(process.cwd(), 'data', 'burgundy-premier-crus-cote-de-nuits-additional.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  let created = 0;
  let skipped = 0;

  // Group by appellation (village)
  const byVillage: Record<string, any[]> = {};
  for (const pc of data) {
    const village = pc.appellationName;
    if (!byVillage[village]) byVillage[village] = [];
    byVillage[village].push(pc);
  }

  for (const [village, vineyards] of Object.entries(byVillage)) {
    const villageSlug = slugify(village);

    for (const vineyard of vineyards) {
      const slug = slugify(vineyard.name);
      const pagePath = path.join(
        process.cwd(),
        'app', 'regions', 'france', 'burgundy', 'cote-de-nuits',
        villageSlug, slug, 'page.tsx'
      );

      if (pageExists(pagePath)) {
        skipped++;
        continue;
      }

      const dirPath = path.dirname(pagePath);
      ensureDir(dirPath);

      const content = generateVineyardPage(
        vineyard.name,
        `france/burgundy/cote-de-nuits/${villageSlug}`,
        'premier-cru',
        villageSlug
      );

      fs.writeFileSync(pagePath, content);
      created++;
    }
  }

  console.log(`Burgundy Côte de Nuits Premier Crus: Created ${created}, Skipped ${skipped}`);
  return { created, skipped, byVillage };
}

// Process Burgundy Premier Crus (Côte de Beaune)
async function processBurgundyPremierCrusCdB() {
  const dataPath = path.join(process.cwd(), 'data', 'burgundy-premier-crus-cote-de-beaune-additional.json');
  if (!fs.existsSync(dataPath)) {
    console.log('Côte de Beaune Premier Crus data not found');
    return { created: 0, skipped: 0, byVillage: {} };
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  let created = 0;
  let skipped = 0;

  // Group by appellation (village)
  const byVillage: Record<string, any[]> = {};
  for (const pc of data) {
    const village = pc.appellationName;
    if (!byVillage[village]) byVillage[village] = [];
    byVillage[village].push(pc);
  }

  for (const [village, vineyards] of Object.entries(byVillage)) {
    const villageSlug = slugify(village);

    for (const vineyard of vineyards) {
      const slug = slugify(vineyard.name);
      const pagePath = path.join(
        process.cwd(),
        'app', 'regions', 'france', 'burgundy', 'cote-de-beaune',
        villageSlug, slug, 'page.tsx'
      );

      if (pageExists(pagePath)) {
        skipped++;
        continue;
      }

      const dirPath = path.dirname(pagePath);
      ensureDir(dirPath);

      const content = generateVineyardPage(
        vineyard.name,
        `france/burgundy/cote-de-beaune/${villageSlug}`,
        'premier-cru',
        villageSlug
      );

      fs.writeFileSync(pagePath, content);
      created++;
    }
  }

  console.log(`Burgundy Côte de Beaune Premier Crus: Created ${created}, Skipped ${skipped}`);
  return { created, skipped, byVillage };
}

// Main execution
async function main() {
  console.log('🍷 Generating missing vineyard pages...\n');

  const results = {
    barolo: await processBarolo(),
    barbaresco: await processBarbaresco(),
    burgundyCdN: await processBurgundyPremierCrusCdN(),
    burgundyCdB: await processBurgundyPremierCrusCdB(),
  };

  const totalCreated =
    results.barolo.created +
    results.barbaresco.created +
    results.burgundyCdN.created +
    results.burgundyCdB.created;

  const totalSkipped =
    results.barolo.skipped +
    results.barbaresco.skipped +
    results.burgundyCdN.skipped +
    results.burgundyCdB.skipped;

  console.log(`\n✅ Total: Created ${totalCreated} pages, Skipped ${totalSkipped} existing pages`);

  // Now update parent pages with sidebar links
  console.log('\n📝 Updating parent pages with sidebar links...');

  await updateBaroloParent(results.barolo.vineyards);
  await updateBarbarescoParent(results.barbaresco.vineyards);

  console.log('\n🎉 Done!');
}

// Update Barolo parent page with all MGAs
async function updateBaroloParent(vineyards: any[]) {
  const baroloPagePath = path.join(process.cwd(), 'app', 'regions', 'italy', 'piedmont', 'barolo', 'page.tsx');

  const sortedMGAs = vineyards
    .map(v => ({ name: v.name, slug: slugify(v.name), classification: 'mga' }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const content = `import RegionLayout from '@/components/RegionLayout';

const BAROLO_MGAS = ${JSON.stringify(sortedMGAs, null, 2)};

export default function BaroloPage() {
  return (
    <RegionLayout
      title="Barolo"
      level="sub-region"
      parentRegion="italy/piedmont"
      sidebarLinks={BAROLO_MGAS}
      contentFile="barolo-guide.md"
    />
  );
}
`;

  fs.writeFileSync(baroloPagePath, content);
  console.log(`✓ Updated Barolo parent page with ${sortedMGAs.length} MGAs`);
}

// Update Barbaresco parent page with all MGAs
async function updateBarbarescoParent(vineyards: any[]) {
  const barbarescoPagePath = path.join(process.cwd(), 'app', 'regions', 'italy', 'piedmont', 'barbaresco', 'page.tsx');

  const sortedMGAs = vineyards
    .map(v => ({ name: v.name, slug: slugify(v.name), classification: 'mga' }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const content = `import RegionLayout from '@/components/RegionLayout';

const BARBARESCO_MGAS = ${JSON.stringify(sortedMGAs, null, 2)};

export default function BarbarescoPage() {
  return (
    <RegionLayout
      title="Barbaresco"
      level="sub-region"
      parentRegion="italy/piedmont"
      sidebarLinks={BARBARESCO_MGAS}
      contentFile="barbaresco-guide.md"
    />
  );
}
`;

  fs.writeFileSync(barbarescoPagePath, content);
  console.log(`✓ Updated Barbaresco parent page with ${sortedMGAs.length} MGAs`);
}

main().catch(console.error);
