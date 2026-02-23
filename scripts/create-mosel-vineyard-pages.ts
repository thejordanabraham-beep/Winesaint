#!/usr/bin/env tsx
/**
 * Create vineyard pages for Mosel VDP sites
 */

import fs from 'fs';
import path from 'path';

// VDP Vineyard data by sub-region
const VINEYARD_DATA = {
  mittelmosel: {
    grosseLage: [
      { name: 'Wehlener Sonnenuhr', slug: 'wehlener-sonnenuhr' },
      { name: 'Erdener Prälat', slug: 'erdener-pralat' },
      { name: 'Erdener Treppchen', slug: 'erdener-treppchen' },
      { name: 'Ürziger Würzgarten', slug: 'urziger-wurzgarten' },
      { name: 'Graacher Domprobst', slug: 'graacher-domprobst' },
      { name: 'Graacher Himmelreich', slug: 'graacher-himmelreich' },
      { name: 'Bernkasteler Doctor', slug: 'bernkasteler-doctor' },
      { name: 'Brauneberger Juffer-Sonnenuhr', slug: 'brauneberger-juffer-sonnenuhr' },
      { name: 'Piesporter Goldtröpfchen', slug: 'piesporter-goldtropfchen' },
      { name: 'Trittenheimer Apotheke', slug: 'trittenheimer-apotheke' },
    ],
    ersteLage: [
      { name: 'Ürziger Goldwingert', slug: 'urziger-goldwingert' },
      { name: 'Erdener Busslay', slug: 'erdener-busslay' },
      { name: 'Zeltinger Sonnenuhr', slug: 'zeltinger-sonnenuhr' },
      { name: 'Graacher Abtsberg', slug: 'graacher-abtsberg' },
      { name: 'Bernkasteler Lay', slug: 'bernkasteler-lay' },
      { name: 'Lieser Niederberg Helden', slug: 'lieser-niederberg-helden' },
      { name: 'Brauneberger Juffer', slug: 'brauneberger-juffer' },
      { name: 'Piesporter Domherr', slug: 'piesporter-domherr' },
      { name: 'Wintricher Ohligsberg', slug: 'wintricher-ohligsberg' },
      { name: 'Kestener Paulinshofberg', slug: 'kestener-paulinshofberg' },
    ],
  },
  saar: {
    grosseLage: [
      { name: 'Scharzhofberg', slug: 'scharzhofberg' },
      { name: 'Wiltinger Gottesfuß', slug: 'wiltinger-gottesfuss' },
      { name: 'Ayler Kupp', slug: 'ayler-kupp' },
      { name: 'Ockfener Bockstein', slug: 'ockfener-bockstein' },
      { name: 'Kanzemer Altenberg', slug: 'kanzemer-altenberg' },
    ],
    ersteLage: [
      { name: 'Wiltinger Braune Kupp', slug: 'wiltinger-braune-kupp' },
      { name: 'Wiltinger Braunfels', slug: 'wiltinger-braunfels' },
      { name: 'Ayler Herrenberger', slug: 'ayler-herrenberger' },
      { name: 'Ockfener Geisberg', slug: 'ockfener-geisberg' },
      { name: 'Serriger Schloss Saarfelser Schlossberg', slug: 'serriger-schloss-saarfelser-schlossberg' },
      { name: 'Kanzemer Sonnenberg', slug: 'kanzemer-sonnenberg' },
    ],
  },
  ruwer: {
    grosseLage: [
      { name: 'Karthäuserhofberg', slug: 'karthauserhofberg' },
      { name: "Kaseler Nies'chen", slug: 'kaseler-nieschen' },
      { name: 'Maximin Grünhäuser Abtsberg', slug: 'maximin-grunhauser-abtsberg' },
    ],
    ersteLage: [
      { name: 'Maximin Grünhäuser Herrenberg', slug: 'maximin-grunhauser-herrenberg' },
      { name: 'Maximin Grünhäuser Bruderberg', slug: 'maximin-grunhauser-bruderberg' },
      { name: 'Kaseler Kehrnagel', slug: 'kaseler-kehrnagel' },
      { name: 'Eitelsbacher Marienholz', slug: 'eitelsbacher-marienholz' },
    ],
  },
  terrassenmosel: {
    grosseLage: [
      { name: 'Winninger Uhlen Blaufüsser Lay', slug: 'winninger-uhlen-blaufusser-lay' },
      { name: 'Winninger Uhlen Laubach', slug: 'winninger-uhlen-laubach' },
      { name: 'Winninger Uhlen Roth Lay', slug: 'winninger-uhlen-roth-lay' },
      { name: 'Pündericher Marienburg', slug: 'pundericher-marienburg' },
    ],
    ersteLage: [
      { name: 'Winninger Röttgen', slug: 'winninger-rottgen' },
      { name: 'Winninger Hamm', slug: 'winninger-hamm' },
      { name: 'Koberner Uhlen', slug: 'koberner-uhlen' },
      { name: 'Pündericher Nonnenberg', slug: 'pundericher-nonnenberg' },
    ],
  },
  obermosel: {
    grosseLage: [],
    ersteLage: [
      { name: 'Nitteler Leiterchen', slug: 'nitteler-leiterchen' },
      { name: 'Palzemer Lay', slug: 'palzemer-lay' },
    ],
  },
};

// Template for vineyard page
const createVineyardPageContent = (vineyardName: string, slug: string, subRegion: string) => `import RegionLayout from '@/components/RegionLayout';
import { client } from '@/lib/sanity/client';

async function getClimatData(slug: string) {
  const query = \`*[_type == "climat" && slug.current == $slug][0] {
    _id,
    name,
    classification,
    acreage,
    soilTypes,
    aspect,
    slope,
    elevationRange,
    producers[]->{
      name,
      "slug": slug.current
    }
  }\`;

  return await client.fetch(query, { slug });
}

export default async function ${slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}VineyardPage() {
  const climatData = await getClimatData('${slug}');

  return (
    <RegionLayout
      title="${vineyardName}"
      level="vineyard"
      parentRegion="germany/mosel/${subRegion}"
      contentFile="${slug}-guide.md"
      vineyardData={climatData ? {
        classification: climatData.classification,
        acreage: climatData.acreage,
        soilTypes: climatData.soilTypes,
        aspect: climatData.aspect,
        slope: climatData.slope,
        elevationRange: climatData.elevationRange,
        producers: climatData.producers || []
      } : undefined}
    />
  );
}
`;

// Main execution
const appDir = path.join(process.cwd(), 'app', 'regions', 'germany', 'mosel');
let totalCreated = 0;
let totalSkipped = 0;

console.log('Creating Mosel VDP vineyard pages...\n');

for (const [subRegion, vineyards] of Object.entries(VINEYARD_DATA)) {
  console.log(`\n${subRegion.toUpperCase()}:`);

  const allVineyards = [...vineyards.grosseLage, ...vineyards.ersteLage];

  for (const vineyard of allVineyards) {
    const vineyardDir = path.join(appDir, subRegion, vineyard.slug);
    const pagePath = path.join(vineyardDir, 'page.tsx');

    // Check if page already exists
    if (fs.existsSync(pagePath)) {
      console.log(`  ⊘ ${vineyard.name} - already exists`);
      totalSkipped++;
      continue;
    }

    // Create directory
    if (!fs.existsSync(vineyardDir)) {
      fs.mkdirSync(vineyardDir, { recursive: true });
    }

    // Create page
    const content = createVineyardPageContent(vineyard.name, vineyard.slug, subRegion);
    fs.writeFileSync(pagePath, content, 'utf-8');

    console.log(`  ✓ ${vineyard.name}`);
    totalCreated++;
  }
}

console.log('\n' + '='.repeat(70));
console.log(`COMPLETE: Created ${totalCreated} pages, skipped ${totalSkipped} existing`);
console.log('='.repeat(70));
