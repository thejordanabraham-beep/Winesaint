/**
 * Generate California AVA Landing Pages
 * Creates page.tsx and guide.md for all missing California AVAs
 *
 * Regions covered:
 * - Central Coast (11 AVAs)
 * - Santa Barbara (6 AVAs)
 * - Paso Robles (11 sub-districts)
 * - Mendocino (10 AVAs)
 * - Sierra Foothills (7 AVAs)
 *
 * Total: 45 AVA pages
 */

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

interface AVA {
  name: string;
  slug: string;
  parentRegion: string;
  parentPath: string;
}

const CENTRAL_COAST_AVAS: AVA[] = [
  { name: 'Arroyo Seco', slug: 'arroyo-seco', parentRegion: 'Central Coast', parentPath: 'united-states/california/central-coast' },
  { name: 'Carmel Valley', slug: 'carmel-valley', parentRegion: 'Central Coast', parentPath: 'united-states/california/central-coast' },
  { name: 'Chalone', slug: 'chalone', parentRegion: 'Central Coast', parentPath: 'united-states/california/central-coast' },
  { name: 'Cienega Valley', slug: 'cienega-valley', parentRegion: 'Central Coast', parentPath: 'united-states/california/central-coast' },
  { name: 'Lime Kiln Valley', slug: 'lime-kiln-valley', parentRegion: 'Central Coast', parentPath: 'united-states/california/central-coast' },
  { name: 'Mount Harlan', slug: 'mount-harlan', parentRegion: 'Central Coast', parentPath: 'united-states/california/central-coast' },
  { name: 'Paicines', slug: 'paicines', parentRegion: 'Central Coast', parentPath: 'united-states/california/central-coast' },
  { name: 'San Benito', slug: 'san-benito', parentRegion: 'Central Coast', parentPath: 'united-states/california/central-coast' },
  { name: 'San Ysidro District', slug: 'san-ysidro-district', parentRegion: 'Central Coast', parentPath: 'united-states/california/central-coast' },
  { name: 'Santa Cruz Mountains', slug: 'santa-cruz-mountains', parentRegion: 'Central Coast', parentPath: 'united-states/california/central-coast' },
  { name: 'Santa Lucia Highlands', slug: 'santa-lucia-highlands', parentRegion: 'Central Coast', parentPath: 'united-states/california/central-coast' },
];

const SANTA_BARBARA_AVAS: AVA[] = [
  { name: 'Ballard Canyon', slug: 'ballard-canyon', parentRegion: 'Santa Barbara', parentPath: 'united-states/california/santa-barbara' },
  { name: 'Happy Canyon of Santa Barbara', slug: 'happy-canyon', parentRegion: 'Santa Barbara', parentPath: 'united-states/california/santa-barbara' },
  { name: 'Los Olivos District', slug: 'los-olivos-district', parentRegion: 'Santa Barbara', parentPath: 'united-states/california/santa-barbara' },
  { name: 'Santa Maria Valley', slug: 'santa-maria-valley', parentRegion: 'Santa Barbara', parentPath: 'united-states/california/santa-barbara' },
  { name: 'Santa Rita Hills', slug: 'santa-rita-hills', parentRegion: 'Santa Barbara', parentPath: 'united-states/california/santa-barbara' },
  { name: 'Santa Ynez Valley', slug: 'santa-ynez-valley', parentRegion: 'Santa Barbara', parentPath: 'united-states/california/santa-barbara' },
];

const PASO_ROBLES_AVAS: AVA[] = [
  { name: 'Adelaida District', slug: 'adelaida-district', parentRegion: 'Paso Robles', parentPath: 'united-states/california/paso-robles' },
  { name: 'Creston District', slug: 'creston-district', parentRegion: 'Paso Robles', parentPath: 'united-states/california/paso-robles' },
  { name: 'El Pomar District', slug: 'el-pomar-district', parentRegion: 'Paso Robles', parentPath: 'united-states/california/paso-robles' },
  { name: 'Estrella District', slug: 'estrella-district', parentRegion: 'Paso Robles', parentPath: 'united-states/california/paso-robles' },
  { name: 'Geneseo District', slug: 'geneseo-district', parentRegion: 'Paso Robles', parentPath: 'united-states/california/paso-robles' },
  { name: 'Highlands District', slug: 'highlands-district', parentRegion: 'Paso Robles', parentPath: 'united-states/california/paso-robles' },
  { name: 'Paso Robles Willow Creek District', slug: 'willow-creek-district', parentRegion: 'Paso Robles', parentPath: 'united-states/california/paso-robles' },
  { name: 'San Juan Creek', slug: 'san-juan-creek', parentRegion: 'Paso Robles', parentPath: 'united-states/california/paso-robles' },
  { name: 'San Miguel District', slug: 'san-miguel-district', parentRegion: 'Paso Robles', parentPath: 'united-states/california/paso-robles' },
  { name: 'Santa Margarita Ranch', slug: 'santa-margarita-ranch', parentRegion: 'Paso Robles', parentPath: 'united-states/california/paso-robles' },
  { name: 'Templeton Gap District', slug: 'templeton-gap-district', parentRegion: 'Paso Robles', parentPath: 'united-states/california/paso-robles' },
];

const MENDOCINO_AVAS: AVA[] = [
  { name: 'Anderson Valley', slug: 'anderson-valley', parentRegion: 'Mendocino', parentPath: 'united-states/california/mendocino' },
  { name: 'Cole Ranch', slug: 'cole-ranch', parentRegion: 'Mendocino', parentPath: 'united-states/california/mendocino' },
  { name: 'Covelo', slug: 'covelo', parentRegion: 'Mendocino', parentPath: 'united-states/california/mendocino' },
  { name: 'Dos Rios', slug: 'dos-rios', parentRegion: 'Mendocino', parentPath: 'united-states/california/mendocino' },
  { name: 'Eagle Peak Mendocino County', slug: 'eagle-peak', parentRegion: 'Mendocino', parentPath: 'united-states/california/mendocino' },
  { name: 'McDowell Valley', slug: 'mcdowell-valley', parentRegion: 'Mendocino', parentPath: 'united-states/california/mendocino' },
  { name: 'Mendocino Ridge', slug: 'mendocino-ridge', parentRegion: 'Mendocino', parentPath: 'united-states/california/mendocino' },
  { name: 'Potter Valley', slug: 'potter-valley', parentRegion: 'Mendocino', parentPath: 'united-states/california/mendocino' },
  { name: 'Redwood Valley', slug: 'redwood-valley', parentRegion: 'Mendocino', parentPath: 'united-states/california/mendocino' },
  { name: 'Yorkville Highlands', slug: 'yorkville-highlands', parentRegion: 'Mendocino', parentPath: 'united-states/california/mendocino' },
];

const SIERRA_FOOTHILLS_AVAS: AVA[] = [
  { name: 'California Shenandoah Valley', slug: 'california-shenandoah-valley', parentRegion: 'Sierra Foothills', parentPath: 'united-states/california/sierra-foothills' },
  { name: 'El Dorado', slug: 'el-dorado', parentRegion: 'Sierra Foothills', parentPath: 'united-states/california/sierra-foothills' },
  { name: 'Fair Play', slug: 'fair-play', parentRegion: 'Sierra Foothills', parentPath: 'united-states/california/sierra-foothills' },
  { name: 'Fiddletown', slug: 'fiddletown', parentRegion: 'Sierra Foothills', parentPath: 'united-states/california/sierra-foothills' },
  { name: 'North Yuba', slug: 'north-yuba', parentRegion: 'Sierra Foothills', parentPath: 'united-states/california/sierra-foothills' },
  { name: 'Pleasant Valley', slug: 'pleasant-valley', parentRegion: 'Sierra Foothills', parentPath: 'united-states/california/sierra-foothills' },
  { name: 'Sierra Pelona Valley', slug: 'sierra-pelona-valley', parentRegion: 'Sierra Foothills', parentPath: 'united-states/california/sierra-foothills' },
];

const ALL_AVAS = [
  ...CENTRAL_COAST_AVAS,
  ...SANTA_BARBARA_AVAS,
  ...PASO_ROBLES_AVAS,
  ...MENDOCINO_AVAS,
  ...SIERRA_FOOTHILLS_AVAS,
];

/**
 * Query François for wine region information
 */
async function queryFrancois(regionName: string, parentRegion: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:8000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.RAG_API_KEY!
      },
      body: JSON.stringify({
        question: `Tell me about the ${regionName} wine region in ${parentRegion}, California. Include: geography, climate, soil types, primary grape varieties, notable producers, and what makes wines from this AVA distinctive.`,
        top_k: 5
      })
    });

    if (!response.ok) {
      throw new Error(`François API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results?.map((r: any) => r.document).join('\n\n') || '';
  } catch (error) {
    console.log(`  ⚠️  François unavailable, will use web search`);
    return '';
  }
}

/**
 * Generate landing page content using Claude + François
 */
async function generatePageContent(ava: AVA): Promise<string> {
  console.log(`\n📝 Generating content for ${ava.name}...`);

  // Step 1: Query François RAG
  console.log('  🔍 Querying François RAG...');
  const francoisContext = await queryFrancois(ava.name, ava.parentRegion);

  const hasRagData = francoisContext.length > 100;
  console.log(`  ${hasRagData ? '✅' : '⚠️'} François context: ${francoisContext.length} chars`);

  // Step 2: Generate content with Claude
  console.log('  ✍️  Generating page content with Claude...');

  const prompt = `You are writing an educational wine region guide. Create a comprehensive landing page for the ${ava.name} AVA in ${ava.parentRegion}, California.

${hasRagData ? `CONTEXT FROM WINE KNOWLEDGE BASE:\n${francoisContext}\n` : ''}

Write a detailed, educational page covering:

## Overview (2-3 paragraphs)
- Geographic location within ${ava.parentRegion}
- When the AVA was established
- Size and key geographical features
- Relationship to other nearby AVAs

## Climate & Terroir (2-3 paragraphs)
- Climate characteristics (Pacific influence, fog patterns, elevation, temperature variations)
- Soil types and geology
- How these factors influence wine style and character

## Grape Varieties & Wine Styles (2-3 paragraphs)
- Primary grape varieties grown
- Characteristic wine styles
- What makes wines from this AVA distinctive
- How it differs from other California AVAs

## Notable Producers (1 paragraph)
- Mention 3-5 well-known producers (if you know them)
- Keep it factual, no marketing language

## What to Know (1 paragraph)
- Key takeaways for wine students and enthusiasts
- Price points (if known)
- Aging potential
- Best vintages or growing conditions to look for

STYLE GUIDELINES:
- Educational, not promotional
- Technical but accessible
- Focus on terroir and how it shapes wine character
- Use specific details (elevation ranges, soil types, temperature variations, etc.)
- NO fluff or marketing speak
- NO pairing recommendations
- Cite facts when known, be general when uncertain

${!hasRagData ? 'NOTE: You may use web search to find accurate information about this AVA.' : ''}

Write in markdown format. Start with the Overview section immediately (no title, that will be added separately).`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 2500,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }]
  });

  const content = message.content[0].type === 'text' ? message.content[0].text : '';
  console.log(`  ✅ Generated ${content.length} chars of content`);

  return content;
}

/**
 * Create page.tsx and guide.md files for an AVA
 */
function createPageFiles(ava: AVA, content: string): void {
  const dirPath = path.join(process.cwd(), 'app', 'regions', ava.parentPath, ava.slug);

  // Create directory if doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Create markdown content file in the same directory
  const contentPath = path.join(dirPath, `${ava.slug}-guide.md`);
  fs.writeFileSync(contentPath, content);

  // Create page.tsx
  const functionName = ava.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  const pageContent = `import RegionLayout from '@/components/RegionLayout';

export default function ${functionName}Page() {
  return (
    <RegionLayout
      title="${ava.name}"
      level="village"
      parentRegion="${ava.parentPath}"
      contentFile="${ava.slug}-guide.md"
    />
  );
}
`;

  const pagePath = path.join(dirPath, 'page.tsx');
  fs.writeFileSync(pagePath, pageContent);

  console.log(`  ✅ Created page.tsx and ${ava.slug}-guide.md`);
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const limit = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1]) : undefined;
  const region = args.includes('--region') ? args[args.indexOf('--region') + 1] : 'all';

  console.log('🍷 CALIFORNIA AVA PAGE GENERATOR');
  console.log('='.repeat(70));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Region filter: ${region}`);
  console.log('='.repeat(70));

  let avasToProcess = ALL_AVAS;

  // Filter by region if specified
  if (region !== 'all') {
    const regionMap: { [key: string]: AVA[] } = {
      'central-coast': CENTRAL_COAST_AVAS,
      'santa-barbara': SANTA_BARBARA_AVAS,
      'paso-robles': PASO_ROBLES_AVAS,
      'mendocino': MENDOCINO_AVAS,
      'sierra-foothills': SIERRA_FOOTHILLS_AVAS,
    };
    avasToProcess = regionMap[region] || ALL_AVAS;
  }

  if (limit) {
    avasToProcess = avasToProcess.slice(0, limit);
  }

  console.log(`\nProcessing ${avasToProcess.length} AVAs:`);
  console.log(`  • Central Coast: ${CENTRAL_COAST_AVAS.filter(a => avasToProcess.includes(a)).length}`);
  console.log(`  • Santa Barbara: ${SANTA_BARBARA_AVAS.filter(a => avasToProcess.includes(a)).length}`);
  console.log(`  • Paso Robles: ${PASO_ROBLES_AVAS.filter(a => avasToProcess.includes(a)).length}`);
  console.log(`  • Mendocino: ${MENDOCINO_AVAS.filter(a => avasToProcess.includes(a)).length}`);
  console.log(`  • Sierra Foothills: ${SIERRA_FOOTHILLS_AVAS.filter(a => avasToProcess.includes(a)).length}`);
  console.log('='.repeat(70));

  for (let i = 0; i < avasToProcess.length; i++) {
    const ava = avasToProcess[i];
    console.log(`\n[${i + 1}/${avasToProcess.length}] ${ava.name} (${ava.parentRegion})`);
    console.log('-'.repeat(70));

    try {
      // Generate content
      const content = await generatePageContent(ava);

      if (dryRun) {
        console.log('\n--- PREVIEW ---');
        console.log(content.substring(0, 500) + '...\n');
      } else {
        // Create actual files
        createPageFiles(ava, content);
      }

      // Rate limiting to avoid API throttling
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error: any) {
      console.error(`  ❌ Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ CALIFORNIA AVA GENERATION COMPLETE!');
  console.log('='.repeat(70));

  if (!dryRun) {
    console.log(`\n${avasToProcess.length} AVA pages created successfully`);
  }
}

main().catch(console.error);
