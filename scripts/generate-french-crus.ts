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

// Process Côte Chalonnaise Premier Crus
async function processCoteChalonnaise() {
  const dataPath = path.join(process.cwd(), 'data', 'burgundy-premier-crus-cote-chalonnaise.json');
  if (!fs.existsSync(dataPath)) {
    console.log('Côte Chalonnaise data not found');
    return 0;
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  let created = 0;

  const byVillage: Record<string, any[]> = {};
  for (const pc of data) {
    const village = pc.appellationName;
    if (!byVillage[village]) byVillage[village] = [];
    byVillage[village].push(pc);
  }

  for (const [villageName, vineyards] of Object.entries(byVillage)) {
    const villageSlug = slugify(villageName);

    for (const vineyard of vineyards) {
      const slug = slugify(vineyard.name);
      const pagePath = path.join(
        process.cwd(),
        'app', 'regions', 'france', 'burgundy', 'cote-chalonnaise',
        villageSlug, slug, 'page.tsx'
      );

      if (fs.existsSync(pagePath)) continue;

      const dirPath = path.dirname(pagePath);
      ensureDir(dirPath);

      const content = generateVineyardPage(
        vineyard.name,
        `france/burgundy/cote-chalonnaise/${villageSlug}`,
        'premier-cru'
      );

      fs.writeFileSync(pagePath, content);
      created++;
    }

    // Create/update village page
    const villagePagePath = path.join(
      process.cwd(),
      'app', 'regions', 'france', 'burgundy', 'cote-chalonnaise',
      villageSlug, 'page.tsx'
    );

    const sidebarLinks = vineyards.map(v => ({
      name: v.name,
      slug: slugify(v.name),
      classification: 'premier-cru' as const
    })).sort((a, b) => a.name.localeCompare(b.name));

    const villageContent = `import RegionLayout from '@/components/RegionLayout';

const ${villageSlug.toUpperCase().replace(/-/g, '_')}_VINEYARDS = ${JSON.stringify(sidebarLinks, null, 2)};

export default function ${villageName.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  return (
    <RegionLayout
      title="${villageName}"
      level="village"
      parentRegion="france/burgundy/cote-chalonnaise"
      sidebarLinks={${villageSlug.toUpperCase().replace(/-/g, '_')}_VINEYARDS}
      contentFile="${villageSlug}-guide.md"
    />
  );
}
`;

    const villageDir = path.dirname(villagePagePath);
    ensureDir(villageDir);
    fs.writeFileSync(villagePagePath, villageContent);
  }

  console.log(`Côte Chalonnaise: Created ${created} pages across ${Object.keys(byVillage).length} villages`);
  return created;
}

// Process Beaujolais Crus
async function processBeaujolais() {
  const dataPath = path.join(process.cwd(), 'data', 'france-beaujolais-crus.json');
  if (!fs.existsSync(dataPath)) {
    console.log('Beaujolais Crus data not found');
    return [];
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  let created = 0;
  const crus = [];

  for (const cru of data) {
    const slug = slugify(cru.name);
    crus.push({
      name: cru.name,
      slug: slug,
      classification: 'cru' as const
    });

    const pagePath = path.join(
      process.cwd(),
      'app', 'regions', 'france', 'beaujolais', slug, 'page.tsx'
    );

    if (fs.existsSync(pagePath)) continue;

    const dirPath = path.dirname(pagePath);
    ensureDir(dirPath);

    const content = generateVineyardPage(
      cru.name,
      'france/beaujolais',
      'cru'
    );

    fs.writeFileSync(pagePath, content);
    created++;
  }

  console.log(`Beaujolais: Created ${created} Cru pages`);

  // Update Beaujolais parent page if it exists
  const beaujolaisPagePath = path.join(process.cwd(), 'app', 'regions', 'france', 'beaujolais', 'page.tsx');
  if (!fs.existsSync(beaujolaisPagePath)) {
    const dir = path.dirname(beaujolaisPagePath);
    ensureDir(dir);
  }

  const sortedCrus = crus.sort((a, b) => a.name.localeCompare(b.name));
  const content = `import RegionLayout from '@/components/RegionLayout';

const BEAUJOLAIS_CRUS = ${JSON.stringify(sortedCrus, null, 2)};

export default function BeaujolaisPage() {
  return (
    <RegionLayout
      title="Beaujolais"
      level="region"
      parentRegion="france"
      sidebarLinks={BEAUJOLAIS_CRUS}
      contentFile="beaujolais-guide.md"
    />
  );
}
`;

  fs.writeFileSync(beaujolaisPagePath, content);
  console.log(`✓ Updated Beaujolais parent page with ${sortedCrus.length} Crus`);

  return crus;
}

// Process Rhône Climats (Hermitage, Cornas, etc.)
async function processRhoneClimats() {
  let totalCreated = 0;

  // Process Hermitage climats
  const hermitageDataPath = path.join(process.cwd(), 'data', 'france-rhone-hermitage-climats.json');
  if (fs.existsSync(hermitageDataPath)) {
    const hermitageData = JSON.parse(fs.readFileSync(hermitageDataPath, 'utf-8'));
    let created = 0;
    const climats = [];

    for (const climat of hermitageData) {
      const slug = slugify(climat.name);
      climats.push({
        name: climat.name,
        slug: slug,
        classification: 'climat' as const
      });

      const pagePath = path.join(
        process.cwd(),
        'app', 'regions', 'france', 'rhone', 'hermitage', slug, 'page.tsx'
      );

      if (fs.existsSync(pagePath)) continue;

      const dirPath = path.dirname(pagePath);
      ensureDir(dirPath);

      const content = generateVineyardPage(
        climat.name,
        'france/rhone/hermitage',
        'climat'
      );

      fs.writeFileSync(pagePath, content);
      created++;
    }

    // Update Hermitage page
    const hermitagePagePath = path.join(process.cwd(), 'app', 'regions', 'france', 'rhone', 'hermitage', 'page.tsx');
    const sortedClimats = climats.sort((a, b) => a.name.localeCompare(b.name));

    const hermitageContent = `import RegionLayout from '@/components/RegionLayout';

const HERMITAGE_CLIMATS = ${JSON.stringify(sortedClimats, null, 2)};

export default function HermitagePage() {
  return (
    <RegionLayout
      title="Hermitage"
      level="sub-region"
      parentRegion="france/rhone"
      sidebarLinks={HERMITAGE_CLIMATS}
      contentFile="hermitage-guide.md"
    />
  );
}
`;

    const hermitageDir = path.dirname(hermitagePagePath);
    ensureDir(hermitageDir);
    fs.writeFileSync(hermitagePagePath, hermitageContent);

    console.log(`Hermitage: Created ${created} climat pages`);
    totalCreated += created;
  }

  // Process Cornas climats
  const cornasDataPath = path.join(process.cwd(), 'data', 'france-rhone-cornas-climats.json');
  if (fs.existsSync(cornasDataPath)) {
    const cornasData = JSON.parse(fs.readFileSync(cornasDataPath, 'utf-8'));
    let created = 0;
    const climats = [];

    for (const climat of cornasData) {
      const slug = slugify(climat.name);
      climats.push({
        name: climat.name,
        slug: slug,
        classification: 'climat' as const
      });

      const pagePath = path.join(
        process.cwd(),
        'app', 'regions', 'france', 'rhone', 'cornas', slug, 'page.tsx'
      );

      if (fs.existsSync(pagePath)) continue;

      const dirPath = path.dirname(pagePath);
      ensureDir(dirPath);

      const content = generateVineyardPage(
        climat.name,
        'france/rhone/cornas',
        'climat'
      );

      fs.writeFileSync(pagePath, content);
      created++;
    }

    // Update Cornas page
    const cornasPagePath = path.join(process.cwd(), 'app', 'regions', 'france', 'rhone', 'cornas', 'page.tsx');
    const sortedClimats = climats.sort((a, b) => a.name.localeCompare(b.name));

    const cornasContent = `import RegionLayout from '@/components/RegionLayout';

const CORNAS_CLIMATS = ${JSON.stringify(sortedClimats, null, 2)};

export default function CornasPage() {
  return (
    <RegionLayout
      title="Cornas"
      level="sub-region"
      parentRegion="france/rhone"
      sidebarLinks={CORNAS_CLIMATS}
      contentFile="cornas-guide.md"
    />
  );
}
`;

    const cornasDir = path.dirname(cornasPagePath);
    ensureDir(cornasDir);
    fs.writeFileSync(cornasPagePath, cornasContent);

    console.log(`Cornas: Created ${created} climat pages`);
    totalCreated += created;
  }

  return totalCreated;
}

// Process Muscadet Crus Communaux
async function processMuscadet() {
  const dataPath = path.join(process.cwd(), 'data', 'france-muscadet-crus-communaux.json');
  if (!fs.existsSync(dataPath)) {
    console.log('Muscadet Crus Communaux data not found');
    return [];
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  let created = 0;
  const crus = [];

  for (const cru of data) {
    const slug = slugify(cru.name);
    crus.push({
      name: cru.name,
      slug: slug,
      classification: 'cru-communal' as const
    });

    const pagePath = path.join(
      process.cwd(),
      'app', 'regions', 'france', 'loire', 'muscadet', slug, 'page.tsx'
    );

    if (fs.existsSync(pagePath)) continue;

    const dirPath = path.dirname(pagePath);
    ensureDir(dirPath);

    const content = generateVineyardPage(
      cru.name,
      'france/loire/muscadet',
      'cru-communal'
    );

    fs.writeFileSync(pagePath, content);
    created++;
  }

  console.log(`Muscadet: Created ${created} Cru Communal pages`);

  // Update Muscadet parent page
  const muscadetPagePath = path.join(process.cwd(), 'app', 'regions', 'france', 'loire', 'muscadet', 'page.tsx');
  const sortedCrus = crus.sort((a, b) => a.name.localeCompare(b.name));

  const content = `import RegionLayout from '@/components/RegionLayout';

const MUSCADET_CRUS = ${JSON.stringify(sortedCrus, null, 2)};

export default function MuscadetPage() {
  return (
    <RegionLayout
      title="Muscadet"
      level="sub-region"
      parentRegion="france/loire"
      sidebarLinks={MUSCADET_CRUS}
      contentFile="muscadet-guide.md"
    />
  );
}
`;

  const muscadetDir = path.dirname(muscadetPagePath);
  ensureDir(muscadetDir);
  fs.writeFileSync(muscadetPagePath, content);
  console.log(`✓ Updated Muscadet parent page with ${sortedCrus.length} Crus Communaux`);

  return crus;
}

async function main() {
  console.log('🍷 Generating French Cru pages...\n');

  const chalonnaise = await processCoteChalonnaise();
  const beaujolais = await processBeaujolais();
  const rhone = await processRhoneClimats();
  const muscadet = await processMuscadet();

  const totalCreated = chalonnaise + beaujolais.length + rhone + muscadet.length;

  console.log(`\n✅ Total: Created ${totalCreated} French Cru/Climat pages`);
  console.log('\n🎉 Done!');
}

main().catch(console.error);
