/**
 * GERMAN VINEYARD ANALYZER
 *
 * Analyzes all vineyard directories and page files to build VDP classification data
 * for Rheingau, Pfalz, and Rheinhessen
 */

import fs from 'fs';
import path from 'path';

interface Vineyard {
  name: string;
  slug: string;
  classification: 'grosse-lage' | 'erste-lage' | 'vineyard';
}

interface RegionData {
  regionName: string;
  totalVineyards: number;
  vineyards: Vineyard[];
  classifications: {
    grosseLage: Vineyard[];
    ersteLage: Vineyard[];
    other: Vineyard[];
  };
}

// Convert slug to display name
function slugToName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Extract classification from page.tsx file
function getClassification(pagePath: string): 'grosse-lage' | 'erste-lage' | 'vineyard' {
  try {
    const content = fs.readFileSync(pagePath, 'utf-8');

    if (content.includes('classification="grosses-gewachs"')) {
      return 'grosse-lage';
    } else if (content.includes('classification="erste-lage"')) {
      return 'erste-lage';
    }

    // Default to vineyard if no classification found
    return 'vineyard';
  } catch (error) {
    console.error(`Error reading ${pagePath}:`, error);
    return 'vineyard';
  }
}

// Analyze a region directory
function analyzeRegion(regionPath: string, regionName: string): RegionData {
  const vineyardDirs = fs.readdirSync(regionPath)
    .filter(item => {
      const itemPath = path.join(regionPath, item);
      return fs.statSync(itemPath).isDirectory() && !item.startsWith('.');
    })
    .sort();

  const vineyards: Vineyard[] = vineyardDirs.map(slug => {
    const pagePath = path.join(regionPath, slug, 'page.tsx');
    const classification = getClassification(pagePath);
    const name = slugToName(slug);

    return { name, slug, classification };
  });

  const classifications = {
    grosseLage: vineyards.filter(v => v.classification === 'grosse-lage'),
    ersteLage: vineyards.filter(v => v.classification === 'erste-lage'),
    other: vineyards.filter(v => v.classification === 'vineyard'),
  };

  return {
    regionName,
    totalVineyards: vineyards.length,
    vineyards,
    classifications,
  };
}

// Generate TypeScript sidebar data
function generateSidebarData(data: RegionData): string {
  const { grosseLage, ersteLage, other } = data.classifications;

  let output = `// ${data.regionName} Vineyards by VDP Classification\n`;
  output += `const ${data.regionName.toUpperCase()}_VINEYARDS = {\n`;

  if (grosseLage.length > 0) {
    output += `  grosseLage: [\n`;
    grosseLage.forEach(v => {
      output += `    { name: '${v.name}', slug: '${v.slug}' },\n`;
    });
    output += `  ],\n`;
  }

  if (ersteLage.length > 0) {
    output += `  ersteLage: [\n`;
    ersteLage.forEach(v => {
      output += `    { name: '${v.name}', slug: '${v.slug}' },\n`;
    });
    output += `  ],\n`;
  }

  if (other.length > 0) {
    output += `  other: [\n`;
    other.forEach(v => {
      output += `    { name: '${v.name}', slug: '${v.slug}' },\n`;
    });
    output += `  ],\n`;
  }

  output += `};\n`;

  return output;
}

// Main analysis
async function main() {
  console.log('\n🍷 GERMAN VINEYARD ANALYZER');
  console.log('='.repeat(70));

  const baseDir = path.join(process.cwd(), 'app', 'regions', 'germany');

  const regions = [
    { path: path.join(baseDir, 'rheingau'), name: 'Rheingau' },
    { path: path.join(baseDir, 'pfalz'), name: 'Pfalz' },
    { path: path.join(baseDir, 'rheinhessen'), name: 'Rheinhessen' },
  ];

  const allData: RegionData[] = [];

  for (const region of regions) {
    console.log(`\n📍 Analyzing ${region.name}...`);
    const data = analyzeRegion(region.path, region.name);

    console.log(`   Total vineyards: ${data.totalVineyards}`);
    console.log(`   Grosse Lage: ${data.classifications.grosseLage.length}`);
    console.log(`   Erste Lage: ${data.classifications.ersteLage.length}`);
    console.log(`   Other: ${data.classifications.other.length}`);

    allData.push(data);

    // Generate sidebar data
    const sidebarCode = generateSidebarData(data);
    console.log(`\n${sidebarCode}`);
  }

  // Summary
  console.log('\n📊 SUMMARY');
  console.log('='.repeat(70));
  const totalVineyards = allData.reduce((sum, d) => sum + d.totalVineyards, 0);
  const totalGrosse = allData.reduce((sum, d) => sum + d.classifications.grosseLage.length, 0);
  const totalErste = allData.reduce((sum, d) => sum + d.classifications.ersteLage.length, 0);
  const totalOther = allData.reduce((sum, d) => sum + d.classifications.other.length, 0);

  console.log(`Total vineyards across all regions: ${totalVineyards}`);
  console.log(`Grosse Lage: ${totalGrosse}`);
  console.log(`Erste Lage: ${totalErste}`);
  console.log(`Other: ${totalOther}`);
  console.log('='.repeat(70));

  // Generate vineyard list for guide generation
  console.log('\n📋 VINEYARD LISTS FOR GUIDE GENERATION\n');

  for (const data of allData) {
    console.log(`\n${data.regionName.toUpperCase()} (${data.totalVineyards} vineyards):`);
    data.vineyards.forEach(v => {
      console.log(`  ${v.slug}`);
    });
  }
}

main().catch(console.error);
