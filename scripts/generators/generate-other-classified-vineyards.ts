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

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function generateVineyardPage(
  vineyardName: string,
  parentPath: string,
  classification: string,
): string {
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

// Process German Grosses Gewächs
async function processGermanGG() {
  const ggFiles = [
    'german-grosses-gewachs-mosel-additional.json',
    'german-grosses-gewachs-rheingau-additional.json',
    'german-grosses-gewachs-rheinhessen-additional.json',
    'german-grosses-gewachs-pfalz-additional.json',
    'german-grosses-gewachs-nahe-additional.json',
    'german-grosses-gewachs-ahr-additional.json',
    'german-grosses-gewachs-baden-additional.json',
    'german-grosses-gewachs-franken-additional.json',
    'german-grosses-gewachs-mittelrhein-additional.json',
    'german-grosses-gewachs-wurttemberg.json',
    'german-grosses-gewachs-saale-unstrut.json',
    'german-grosses-gewachs-sachsen.json',
  ];

  let totalCreated = 0;
  const byRegion: Record<string, any[]> = {};

  for (const file of ggFiles) {
    const dataPath = path.join(process.cwd(), 'data', file);
    if (!fs.existsSync(dataPath)) continue;

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    for (const gg of data) {
      const regionName = gg.regionName || gg.appellationName;
      const vineyardName = gg.name;

      if (!regionName || !vineyardName) continue;

      const regionSlug = slugify(regionName);
      if (!byRegion[regionSlug]) byRegion[regionSlug] = [];
      byRegion[regionSlug].push({
        name: vineyardName,
        slug: slugify(vineyardName),
        classification: 'grosses-gewachs'
      });

      const pagePath = path.join(
        process.cwd(),
        'app', 'regions', 'germany', regionSlug, slugify(vineyardName), 'page.tsx'
      );

      if (fs.existsSync(pagePath)) continue;

      const dirPath = path.dirname(pagePath);
      ensureDir(dirPath);

      const content = generateVineyardPage(
        vineyardName,
        `germany/${regionSlug}`,
        'grosses-gewachs'
      );

      fs.writeFileSync(pagePath, content);
      totalCreated++;
    }
  }

  console.log(`German Grosses Gewächs: Created ${totalCreated} pages across ${Object.keys(byRegion).length} regions`);
  return byRegion;
}

// Process Alsace Grand Crus
async function processAlsaceGrandCrus() {
  const dataPath = path.join(process.cwd(), 'data', 'france-alsace-grand-crus.json');
  if (!fs.existsSync(dataPath)) {
    console.log('Alsace Grand Crus data not found');
    return [];
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  let created = 0;

  const vineyards = [];

  for (const gc of data) {
    const slug = slugify(gc.name);
    vineyards.push({
      name: gc.name,
      slug: slug,
      classification: 'grand-cru'
    });

    const pagePath = path.join(
      process.cwd(),
      'app', 'regions', 'france', 'alsace', slug, 'page.tsx'
    );

    if (fs.existsSync(pagePath)) continue;

    const dirPath = path.dirname(pagePath);
    ensureDir(dirPath);

    const content = generateVineyardPage(
      gc.name,
      'france/alsace',
      'grand-cru'
    );

    fs.writeFileSync(pagePath, content);
    created++;
  }

  console.log(`Alsace Grand Crus: Created ${created} pages`);

  // Update Alsace parent page
  const alsacePagePath = path.join(process.cwd(), 'app', 'regions', 'france', 'alsace', 'page.tsx');
  const sortedGCs = vineyards.sort((a, b) => a.name.localeCompare(b.name));

  const content = `import RegionLayout from '@/components/RegionLayout';

const ALSACE_GRAND_CRUS = ${JSON.stringify(sortedGCs, null, 2)};

export default function AlsacePage() {
  return (
    <RegionLayout
      title="Alsace"
      level="region"
      parentRegion="france"
      sidebarLinks={ALSACE_GRAND_CRUS}
      contentFile="alsace-guide.md"
    />
  );
}
`;

  fs.writeFileSync(alsacePagePath, content);
  console.log(`✓ Updated Alsace parent page with ${sortedGCs.length} Grand Crus`);

  return vineyards;
}

// Process Champagne Grand/Premier Cru villages
async function processChampagne() {
  const gcPath = path.join(process.cwd(), 'data', 'france-champagne-grand-cru-villages.json');
  const pcPath = path.join(process.cwd(), 'data', 'france-champagne-premier-cru-villages.json');

  let created = 0;
  const villages = [];

  if (fs.existsSync(gcPath)) {
    const gcData = JSON.parse(fs.readFileSync(gcPath, 'utf-8'));
    for (const village of gcData) {
      const slug = slugify(village.name);
      villages.push({
        name: village.name,
        slug: slug,
        classification: 'grand-cru'
      });

      const pagePath = path.join(
        process.cwd(),
        'app', 'regions', 'france', 'champagne', slug, 'page.tsx'
      );

      if (fs.existsSync(pagePath)) continue;

      const dirPath = path.dirname(pagePath);
      ensureDir(dirPath);

      const content = generateVineyardPage(
        village.name,
        'france/champagne',
        'grand-cru'
      );

      fs.writeFileSync(pagePath, content);
      created++;
    }
  }

  if (fs.existsSync(pcPath)) {
    const pcData = JSON.parse(fs.readFileSync(pcPath, 'utf-8'));
    for (const village of pcData) {
      const slug = slugify(village.name);
      villages.push({
        name: village.name,
        slug: slug,
        classification: 'premier-cru'
      });

      const pagePath = path.join(
        process.cwd(),
        'app', 'regions', 'france', 'champagne', slug, 'page.tsx'
      );

      if (fs.existsSync(pagePath)) continue;

      const dirPath = path.dirname(pagePath);
      ensureDir(dirPath);

      const content = generateVineyardPage(
        village.name,
        'france/champagne',
        'premier-cru'
      );

      fs.writeFileSync(pagePath, content);
      created++;
    }
  }

  console.log(`Champagne: Created ${created} village pages`);

  // Update Champagne parent page
  const champagnePagePath = path.join(process.cwd(), 'app', 'regions', 'france', 'champagne', 'page.tsx');
  const sortedVillages = villages.sort((a, b) => {
    // Sort by classification first (Grand Cru before Premier Cru), then by name
    if (a.classification !== b.classification) {
      return a.classification === 'grand-cru' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  const content = `import RegionLayout from '@/components/RegionLayout';

const CHAMPAGNE_VILLAGES = ${JSON.stringify(sortedVillages, null, 2)};

export default function ChampagnePage() {
  return (
    <RegionLayout
      title="Champagne"
      level="region"
      parentRegion="france"
      sidebarLinks={CHAMPAGNE_VILLAGES}
      contentFile="champagne-guide.md"
    />
  );
}
`;

  fs.writeFileSync(champagnePagePath, content);
  console.log(`✓ Updated Champagne parent page with ${sortedVillages.length} villages`);

  return villages;
}

// Process Chablis Grand Crus
async function processChablis() {
  // Chablis Grand Crus are typically in the main burgundy-grand-crus.json file
  const gcDataPath = path.join(process.cwd(), 'data', 'burgundy-grand-crus.json');
  const data = JSON.parse(fs.readFileSync(gcDataPath, 'utf-8'));

  const chablisGCs = data.filter((gc: any) =>
    gc.appellationName === 'Chablis' || gc.regionName?.includes('Chablis')
  );

  let created = 0;

  for (const gc of chablisGCs) {
    const slug = slugify(gc.name);
    const pagePath = path.join(
      process.cwd(),
      'app', 'regions', 'france', 'burgundy', 'chablis', slug, 'page.tsx'
    );

    if (fs.existsSync(pagePath)) continue;

    const dirPath = path.dirname(pagePath);
    ensureDir(dirPath);

    const content = generateVineyardPage(
      gc.name,
      'france/burgundy/chablis',
      'grand-cru'
    );

    fs.writeFileSync(pagePath, content);
    created++;
  }

  // Also process Premier Crus
  const pcDataPath = path.join(process.cwd(), 'data', 'burgundy-premier-crus-chablis.json');
  if (fs.existsSync(pcDataPath)) {
    const pcData = JSON.parse(fs.readFileSync(pcDataPath, 'utf-8'));

    for (const pc of pcData) {
      const slug = slugify(pc.name);
      const pagePath = path.join(
        process.cwd(),
        'app', 'regions', 'france', 'burgundy', 'chablis', slug, 'page.tsx'
      );

      if (fs.existsSync(pagePath)) continue;

      const dirPath = path.dirname(pagePath);
      ensureDir(dirPath);

      const content = generateVineyardPage(
        pc.name,
        'france/burgundy/chablis',
        'premier-cru'
      );

      fs.writeFileSync(pagePath, content);
      created++;
    }
  }

  console.log(`Chablis: Created ${created} pages`);
  return created;
}

async function main() {
  console.log('🍷 Generating other classified vineyard pages...\n');

  await processGermanGG();
  await processAlsaceGrandCrus();
  await processChampagne();
  await processChablis();

  console.log('\n🎉 Done!');
}

main().catch(console.error);
