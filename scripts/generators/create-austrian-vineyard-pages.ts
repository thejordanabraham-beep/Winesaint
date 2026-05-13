/**
 * CREATE AUSTRIAN VINEYARD PAGES
 *
 * Creates page.tsx files for all Austrian vineyards and updates region pages with sidebar links
 */

import fs from 'fs';
import path from 'path';

const DATA_FILES = [
  { file: 'austria-wachau-rieda.json', region: 'wachau', regionName: 'Wachau' },
  { file: 'austria-kamptal-erste-lage.json', region: 'kamptal', regionName: 'Kamptal' },
  { file: 'austria-kremstal-erste-lage.json', region: 'kremstal', regionName: 'Kremstal' },
  { file: 'austria-wagram-erste-lage.json', region: 'wagram', regionName: 'Wagram' },
  { file: 'austria-thermenregion-erste-lage.json', region: 'thermenregion', regionName: 'Thermenregion' },
  { file: 'austria-traisental-erste-lage.json', region: 'traisental', regionName: 'Traisental' },
  { file: 'austria-vienna-erste-lage.json', region: 'wien', regionName: 'Wien' },
  { file: 'austria-carnuntum-erste-lage.json', region: 'carnuntum', regionName: 'Carnuntum' },
];

function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function createVineyardPages() {
  console.log('\n🇦🇹 CREATING AUSTRIAN VINEYARD PAGES');
  console.log('='.repeat(70));

  let totalCreated = 0;
  let totalSkipped = 0;

  for (const { file, region, regionName } of DATA_FILES) {
    const dataPath = path.join(process.cwd(), 'data', file);

    if (!fs.existsSync(dataPath)) {
      console.log(`⚠️  Skipping ${regionName} - data file not found`);
      continue;
    }

    const vineyards = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`\n📍 ${regionName} (${vineyards.length} vineyards)`);

    const regionDir = path.join(process.cwd(), 'app', 'regions', 'austria', region);
    const sidebarLinks: Array<{ name: string; slug: string; classification: string }> = [];

    for (const vineyard of vineyards) {
      const slug = slugify(vineyard.name);
      const vineyardDir = path.join(regionDir, slug);
      const pagePath = path.join(vineyardDir, 'page.tsx');

      // Always add to sidebar links (even if page exists)
      sidebarLinks.push({
        name: vineyard.name,
        slug,
        classification: vineyard.classification || 'vineyard'
      });

      // Create directory
      if (!fs.existsSync(vineyardDir)) {
        fs.mkdirSync(vineyardDir, { recursive: true });
      }

      // Skip if page already exists
      if (fs.existsSync(pagePath)) {
        totalSkipped++;
        continue;
      }

      // Create page.tsx
      // Generate function name, prepend 'Vineyard' if it starts with a number
      let functionName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
      if (/^\d/.test(functionName)) {
        functionName = 'Vineyard' + functionName;
      }

      const pageContent = `import RegionLayout from '@/components/RegionLayout';

export default function ${functionName}Page() {
  return (
    <RegionLayout
      title="${vineyard.name}"
      level="vineyard"
      parentRegion="austria/${region}"
      contentFile="${slug}-guide.md"
    />
  );
}
`;

      fs.writeFileSync(pagePath, pageContent);
      totalCreated++;
      console.log(`   ✓ Created: ${slug}/page.tsx`);
    }

    // Update region page with sidebar links
    const regionPagePath = path.join(regionDir, 'page.tsx');
    const regionPageContent = `import RegionLayout from '@/components/RegionLayout';

const ${region.toUpperCase().replace(/-/g, '_')}_VINEYARDS = ${JSON.stringify(sidebarLinks, null, 2)} as const;

export default function ${regionName.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  return (
    <RegionLayout
      title="${regionName}"
      level="region"
      parentRegion="austria"
      sidebarLinks={${region.toUpperCase().replace(/-/g, '_')}_VINEYARDS}
      contentFile="${region}-guide.md"
    />
  );
}
`;

    fs.writeFileSync(regionPagePath, regionPageContent);
    console.log(`   ✓ Updated ${region}/page.tsx with ${sidebarLinks.length} vineyards`);
  }

  console.log('\n✅ COMPLETE');
  console.log('='.repeat(70));
  console.log(`Pages created: ${totalCreated}`);
  console.log(`Already existed: ${totalSkipped}`);
}

createVineyardPages().catch(console.error);
