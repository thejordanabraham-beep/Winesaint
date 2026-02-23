/**
 * Generate AVA/Sub-Region Landing Pages using François
 *
 * Uses François RAG + web search to create educational content
 * for wine sub-regions (AVAs, villages, etc.)
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

const NAPA_VALLEY_AVAS: AVA[] = [
  { name: 'Atlas Peak', slug: 'atlas-peak', parentRegion: 'Napa Valley', parentPath: 'united-states/california/napa-valley' },
  { name: 'Calistoga', slug: 'calistoga', parentRegion: 'Napa Valley', parentPath: 'united-states/california/napa-valley' },
  { name: 'Chiles Valley', slug: 'chiles-valley', parentRegion: 'Napa Valley', parentPath: 'united-states/california/napa-valley' },
  { name: 'Coombsville', slug: 'coombsville', parentRegion: 'Napa Valley', parentPath: 'united-states/california/napa-valley' },
  { name: 'Diamond Mountain District', slug: 'diamond-mountain-district', parentRegion: 'Napa Valley', parentPath: 'united-states/california/napa-valley' },
  { name: 'Howell Mountain', slug: 'howell-mountain', parentRegion: 'Napa Valley', parentPath: 'united-states/california/napa-valley' },
  { name: 'Los Carneros', slug: 'los-carneros', parentRegion: 'Napa Valley', parentPath: 'united-states/california/napa-valley' },
  { name: 'Mount Veeder', slug: 'mount-veeder', parentRegion: 'Napa Valley', parentPath: 'united-states/california/napa-valley' },
  { name: 'Oak Knoll District', slug: 'oak-knoll-district', parentRegion: 'Napa Valley', parentPath: 'united-states/california/napa-valley' },
  { name: 'Oakville', slug: 'oakville', parentRegion: 'Napa Valley', parentPath: 'united-states/california/napa-valley' },
  { name: 'Rutherford', slug: 'rutherford', parentRegion: 'Napa Valley', parentPath: 'united-states/california/napa-valley' },
  { name: 'Spring Mountain District', slug: 'spring-mountain-district', parentRegion: 'Napa Valley', parentPath: 'united-states/california/napa-valley' },
  { name: 'St. Helena', slug: 'st-helena', parentRegion: 'Napa Valley', parentPath: 'united-states/california/napa-valley' },
  { name: 'Stags Leap District', slug: 'stags-leap-district', parentRegion: 'Napa Valley', parentPath: 'united-states/california/napa-valley' },
  { name: 'Yountville', slug: 'yountville', parentRegion: 'Napa Valley', parentPath: 'united-states/california/napa-valley' },
];

/**
 * Query François for wine region information
 */
async function queryFrancois(regionName: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:8000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.RAG_API_KEY!
      },
      body: JSON.stringify({
        question: `Tell me about the ${regionName} wine region. Include: geography, climate, soil types, primary grape varieties, notable producers, and what makes wines from this region distinctive.`,
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
 * Generate landing page content using Claude + François + Web Search
 */
async function generatePageContent(ava: AVA): Promise<string> {
  console.log(`\n📝 Generating content for ${ava.name}...`);

  // Step 1: Query François RAG
  console.log('  🔍 Querying François RAG...');
  const francoisContext = await queryFrancois(ava.name);

  const hasRagData = francoisContext.length > 100;
  console.log(`  ${hasRagData ? '✅' : '⚠️'} François context: ${francoisContext.length} chars`);

  // Step 2: Generate content with Claude
  console.log('  ✍️  Generating page content with Claude...');

  const prompt = `You are writing an educational wine region guide. Create a comprehensive landing page for the ${ava.name} AVA in ${ava.parentRegion}.

${hasRagData ? `CONTEXT FROM WINE KNOWLEDGE BASE:\n${francoisContext}\n` : ''}

Write a detailed, educational page covering:

## Overview (2-3 paragraphs)
- Geographic location and boundaries
- When the AVA was established
- Size and key geographical features

## Climate & Terroir (2-3 paragraphs)
- Climate characteristics (fog, elevation, temperature)
- Soil types
- How these factors influence wine style

## Grape Varieties & Wine Styles (2-3 paragraphs)
- Primary grape varieties grown
- Characteristic wine styles
- What makes wines from here distinctive

## Notable Producers (1 paragraph)
- Mention 3-5 well-known producers (if you know them)
- Keep it factual, no marketing language

## What to Know (1 paragraph)
- Key takeaways for wine students
- Price points (if known)
- Aging potential

STYLE GUIDELINES:
- Educational, not promotional
- Technical but accessible
- Focus on terroir and how it shapes wine
- Use specific details (elevation ranges, soil types, etc.)
- NO fluff or marketing speak
- Cite facts when known, be general when uncertain

${!hasRagData ? 'NOTE: You may use web search to find accurate information about this AVA.' : ''}

Write in markdown format. Start with the Overview section immediately (no title, that will be added separately).`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 2000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }]
  });

  const content = message.content[0].type === 'text' ? message.content[0].text : '';
  console.log(`  ✅ Generated ${content.length} chars of content`);

  return content;
}

/**
 * Create page.tsx file for an AVA
 */
function createPageFile(ava: AVA, content: string): void {
  const dirPath = path.join(process.cwd(), 'app', 'regions', ava.parentPath, ava.slug);
  const filePath = path.join(dirPath, 'page.tsx');

  // Create directory if doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Create markdown content file
  const contentPath = path.join(dirPath, `${ava.slug}-guide.md`);
  fs.writeFileSync(contentPath, content);

  // Create page.tsx
  const pageContent = `import RegionLayout from '@/components/RegionLayout';

export default function ${ava.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Page() {
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

  fs.writeFileSync(filePath, pageContent);
  console.log(`  ✅ Created ${filePath}`);
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const limit = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1]) : undefined;

  console.log('🍷 AVA PAGE GENERATOR');
  console.log('='.repeat(70));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`AVAs to process: ${limit || NAPA_VALLEY_AVAS.length}`);
  console.log('');

  const avasToProcess = limit ? NAPA_VALLEY_AVAS.slice(0, limit) : NAPA_VALLEY_AVAS;

  for (let i = 0; i < avasToProcess.length; i++) {
    const ava = avasToProcess[i];
    console.log(`\n[${i + 1}/${avasToProcess.length}] ${ava.name}`);

    try {
      // Generate content
      const content = await generatePageContent(ava);

      if (dryRun) {
        console.log('\n--- PREVIEW ---');
        console.log(content.substring(0, 500) + '...\n');
      } else {
        // Create actual files
        createPageFile(ava, content);
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error: any) {
      console.error(`  ❌ Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ Complete!');

  if (!dryRun) {
    console.log('\nPages created at:');
    avasToProcess.forEach(ava => {
      console.log(`  http://localhost:3000/regions/${ava.parentPath}/${ava.slug}`);
    });
  }
}

main().catch(console.error);
