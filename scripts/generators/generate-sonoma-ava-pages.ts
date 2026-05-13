/**
 * Generate Sonoma County AVA Landing Pages
 * Creates page.tsx and guide.md for all 16 Sonoma AVAs
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

const SONOMA_AVAS: AVA[] = [
  { name: 'Alexander Valley', slug: 'alexander-valley', parentRegion: 'Sonoma', parentPath: 'united-states/california/sonoma' },
  { name: 'Bennett Valley', slug: 'bennett-valley', parentRegion: 'Sonoma', parentPath: 'united-states/california/sonoma' },
  { name: 'Chalk Hill', slug: 'chalk-hill', parentRegion: 'Sonoma', parentPath: 'united-states/california/sonoma' },
  { name: 'Dry Creek Valley', slug: 'dry-creek-valley', parentRegion: 'Sonoma', parentPath: 'united-states/california/sonoma' },
  { name: 'Fort Ross-Seaview', slug: 'fort-ross-seaview', parentRegion: 'Sonoma', parentPath: 'united-states/california/sonoma' },
  { name: 'Fountain Grove District', slug: 'fountain-grove-district', parentRegion: 'Sonoma', parentPath: 'united-states/california/sonoma' },
  { name: 'Green Valley', slug: 'green-valley', parentRegion: 'Sonoma', parentPath: 'united-states/california/sonoma' },
  { name: 'Knights Valley', slug: 'knights-valley', parentRegion: 'Sonoma', parentPath: 'united-states/california/sonoma' },
  { name: 'Los Carneros', slug: 'los-carneros', parentRegion: 'Sonoma', parentPath: 'united-states/california/sonoma' },
  { name: 'Moon Mountain District', slug: 'moon-mountain-district', parentRegion: 'Sonoma', parentPath: 'united-states/california/sonoma' },
  { name: 'Petaluma Gap', slug: 'petaluma-gap', parentRegion: 'Sonoma', parentPath: 'united-states/california/sonoma' },
  { name: 'Rockpile', slug: 'rockpile', parentRegion: 'Sonoma', parentPath: 'united-states/california/sonoma' },
  { name: 'Russian River Valley', slug: 'russian-river-valley', parentRegion: 'Sonoma', parentPath: 'united-states/california/sonoma' },
  { name: 'Sonoma Coast', slug: 'sonoma-coast', parentRegion: 'Sonoma', parentPath: 'united-states/california/sonoma' },
  { name: 'Sonoma Mountain', slug: 'sonoma-mountain', parentRegion: 'Sonoma', parentPath: 'united-states/california/sonoma' },
  { name: 'Sonoma Valley', slug: 'sonoma-valley', parentRegion: 'Sonoma', parentPath: 'united-states/california/sonoma' },
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
        question: `Tell me about the ${regionName} wine region in Sonoma County, California. Include: geography, climate, soil types, primary grape varieties, notable producers, and what makes wines from this AVA distinctive.`,
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
  const francoisContext = await queryFrancois(ava.name);

  const hasRagData = francoisContext.length > 100;
  console.log(`  ${hasRagData ? '✅' : '⚠️'} François context: ${francoisContext.length} chars`);

  // Step 2: Generate content with Claude
  console.log('  ✍️  Generating page content with Claude...');

  const prompt = `You are writing an educational wine region guide. Create a comprehensive landing page for the ${ava.name} AVA in Sonoma County, California.

${hasRagData ? `CONTEXT FROM WINE KNOWLEDGE BASE:\n${francoisContext}\n` : ''}

Write a detailed, educational page covering:

## Overview (2-3 paragraphs)
- Geographic location within Sonoma County
- When the AVA was established
- Size and key geographical features
- Relationship to other nearby AVAs

## Climate & Terroir (2-3 paragraphs)
- Climate characteristics (Pacific influence, fog patterns, elevation, temperature)
- Soil types and geology
- How these factors influence wine style

## Grape Varieties & Wine Styles (2-3 paragraphs)
- Primary grape varieties grown
- Characteristic wine styles
- What makes wines from this AVA distinctive
- How it differs from other Sonoma AVAs

## Notable Producers (1 paragraph)
- Mention 3-5 well-known producers (if you know them)
- Keep it factual, no marketing language

## What to Know (1 paragraph)
- Key takeaways for wine students and enthusiasts
- Price points (if known)
- Aging potential
- Best vintages or growing conditions

STYLE GUIDELINES:
- Educational, not promotional
- Technical but accessible
- Focus on terroir and how it shapes wine character
- Use specific details (elevation ranges, soil types, temperature variations, etc.)
- NO fluff or marketing speak
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

  console.log('🍷 SONOMA COUNTY AVA PAGE GENERATOR');
  console.log('='.repeat(70));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`AVAs to process: ${limit || SONOMA_AVAS.length}`);
  console.log('='.repeat(70));

  const avasToProcess = limit ? SONOMA_AVAS.slice(0, limit) : SONOMA_AVAS;

  for (let i = 0; i < avasToProcess.length; i++) {
    const ava = avasToProcess[i];
    console.log(`\n[${i + 1}/${avasToProcess.length}] ${ava.name}`);
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
  console.log('✅ SONOMA AVA GENERATION COMPLETE!');
  console.log('='.repeat(70));

  if (!dryRun) {
    console.log('\nPages created at:');
    avasToProcess.forEach(ava => {
      console.log(`  • http://localhost:3000/regions/${ava.parentPath}/${ava.slug}`);
    });
  }
}

main().catch(console.error);
