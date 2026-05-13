/**
 * Generate Loire Valley Appellation Pages
 * Creates 22 consolidated appellation pages following the consolidation plan
 */

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

interface Appellation {
  name: string;
  slug: string;
  parentRegion: string;
  parentPath: string;
  consolidated?: string[]; // For consolidated appellations
  notes?: string;
}

// Pays Nantais appellations
const PAYS_NANTAIS_APPELLATIONS: Appellation[] = [
  {
    name: 'Muscadet',
    slug: 'muscadet',
    parentRegion: 'Pays Nantais',
    parentPath: 'france/loire-valley/pays-nantais',
    consolidated: [
      'Muscadet Sèvre et Maine',
      'Muscadet Coteaux de la Loire',
      'Muscadet Côtes de Grandlieu',
      'Muscadet AOC'
    ],
    notes: 'Includes 10 cru communaux: Clisson, Gorges, Le Pallet, Goulaine, Château-Thébaud, Monnières-Saint-Fiacre, Mouzillon-Tillières, Vallet, La Haye-Fouassière, Champtoceaux'
  },
  {
    name: 'Gros Plant du Pays Nantais',
    slug: 'gros-plant-du-pays-nantais',
    parentRegion: 'Pays Nantais',
    parentPath: 'france/loire-valley/pays-nantais'
  },
];

// Anjou-Saumur appellations
const ANJOU_SAUMUR_APPELLATIONS: Appellation[] = [
  {
    name: 'Savennières',
    slug: 'savennieres',
    parentRegion: 'Anjou-Saumur',
    parentPath: 'france/loire-valley/anjou-saumur',
    consolidated: ['Savennières Roche aux Moines', 'Savennières Coulée de Serrant'],
    notes: 'Include Grand Cru sites: Roche aux Moines (33 ha) and Coulée de Serrant (7 ha monopole)'
  },
  {
    name: 'Quarts de Chaume',
    slug: 'quarts-de-chaume',
    parentRegion: 'Anjou-Saumur',
    parentPath: 'france/loire-valley/anjou-saumur',
    notes: 'Grand Cru status since 2011'
  },
  {
    name: 'Bonnezeaux',
    slug: 'bonnezeaux',
    parentRegion: 'Anjou-Saumur',
    parentPath: 'france/loire-valley/anjou-saumur',
    notes: 'Grand Cru sweet Chenin Blanc'
  },
  {
    name: 'Coteaux du Layon',
    slug: 'coteaux-du-layon',
    parentRegion: 'Anjou-Saumur',
    parentPath: 'france/loire-valley/anjou-saumur'
  },
  {
    name: 'Anjou',
    slug: 'anjou',
    parentRegion: 'Anjou-Saumur',
    parentPath: 'france/loire-valley/anjou-saumur',
    consolidated: ['Anjou Villages'],
    notes: 'Cover both Anjou AOC and Anjou Villages'
  },
  {
    name: 'Saumur',
    slug: 'saumur',
    parentRegion: 'Anjou-Saumur',
    parentPath: 'france/loire-valley/anjou-saumur',
    notes: 'White, rosé, and sparkling wines'
  },
  {
    name: 'Saumur-Champigny',
    slug: 'saumur-champigny',
    parentRegion: 'Anjou-Saumur',
    parentPath: 'france/loire-valley/anjou-saumur',
    notes: 'Red Cabernet Franc specialist'
  },
];

// Touraine appellations
const TOURAINE_APPELLATIONS: Appellation[] = [
  {
    name: 'Vouvray',
    slug: 'vouvray',
    parentRegion: 'Touraine',
    parentPath: 'france/loire-valley/touraine',
    notes: 'Chenin Blanc: dry, sweet, and sparkling'
  },
  {
    name: 'Montlouis-sur-Loire',
    slug: 'montlouis-sur-loire',
    parentRegion: 'Touraine',
    parentPath: 'france/loire-valley/touraine',
    notes: 'Chenin Blanc specialist'
  },
  {
    name: 'Chinon',
    slug: 'chinon',
    parentRegion: 'Touraine',
    parentPath: 'france/loire-valley/touraine',
    notes: 'Most famous Loire Cabernet Franc'
  },
  {
    name: 'Bourgueil',
    slug: 'bourgueil',
    parentRegion: 'Touraine',
    parentPath: 'france/loire-valley/touraine',
    notes: 'Cabernet Franc red wines'
  },
  {
    name: 'Saint-Nicolas-de-Bourgueil',
    slug: 'saint-nicolas-de-bourgueil',
    parentRegion: 'Touraine',
    parentPath: 'france/loire-valley/touraine',
    notes: 'Quality Cabernet Franc within Bourgueil area'
  },
  {
    name: 'Touraine',
    slug: 'touraine',
    parentRegion: 'Touraine',
    parentPath: 'france/loire-valley/touraine',
    consolidated: ['Touraine-Amboise', 'Touraine-Azay-le-Rideau', 'Touraine-Mesland'],
    notes: 'Include geographic sub-zones'
  },
  {
    name: 'Cheverny',
    slug: 'cheverny',
    parentRegion: 'Touraine',
    parentPath: 'france/loire-valley/touraine',
    consolidated: ['Cour-Cheverny'],
    notes: 'Include Cour-Cheverny (Romorantin grape)'
  },
];

// Centre-Loire appellations
const CENTRE_LOIRE_APPELLATIONS: Appellation[] = [
  {
    name: 'Sancerre',
    slug: 'sancerre',
    parentRegion: 'Centre-Loire',
    parentPath: 'france/loire-valley/centre-loire',
    notes: 'Sauvignon Blanc benchmark, also Pinot Noir'
  },
  {
    name: 'Pouilly-Fumé',
    slug: 'pouilly-fume',
    parentRegion: 'Centre-Loire',
    parentPath: 'france/loire-valley/centre-loire',
    notes: 'Sauvignon Blanc specialist'
  },
  {
    name: 'Pouilly-sur-Loire',
    slug: 'pouilly-sur-loire',
    parentRegion: 'Centre-Loire',
    parentPath: 'france/loire-valley/centre-loire',
    notes: 'Chasselas grape, distinct from Pouilly-Fumé'
  },
  {
    name: 'Menetou-Salon',
    slug: 'menetou-salon',
    parentRegion: 'Centre-Loire',
    parentPath: 'france/loire-valley/centre-loire',
    notes: 'Sauvignon Blanc and Pinot Noir'
  },
  {
    name: 'Quincy',
    slug: 'quincy',
    parentRegion: 'Centre-Loire',
    parentPath: 'france/loire-valley/centre-loire',
    notes: 'Historic Sauvignon Blanc appellation'
  },
  {
    name: 'Reuilly',
    slug: 'reuilly',
    parentRegion: 'Centre-Loire',
    parentPath: 'france/loire-valley/centre-loire',
    notes: 'Sauvignon Blanc, Pinot Noir, and Pinot Gris'
  },
];

const ALL_APPELLATIONS = [
  ...PAYS_NANTAIS_APPELLATIONS,
  ...ANJOU_SAUMUR_APPELLATIONS,
  ...TOURAINE_APPELLATIONS,
  ...CENTRE_LOIRE_APPELLATIONS,
];

/**
 * Query François for Loire appellation information
 */
async function queryFrancois(appellationName: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:8000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.RAG_API_KEY!
      },
      body: JSON.stringify({
        question: `Tell me about the ${appellationName} wine appellation in Loire Valley, France. Include: geography, terroir, soil types, climate, grape varieties, wine styles, notable producers, and what makes wines from this appellation distinctive.`,
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
 * Generate appellation page content
 */
async function generatePageContent(appellation: Appellation): Promise<string> {
  console.log(`\n📝 Generating content for ${appellation.name}...`);

  // Query François
  console.log('  🔍 Querying François RAG...');
  const francoisContext = await queryFrancois(appellation.name);
  const hasRagData = francoisContext.length > 100;
  console.log(`  ${hasRagData ? '✅' : '⚠️'} François context: ${francoisContext.length} chars`);

  // Build prompt
  console.log('  ✍️  Generating page content with Claude...');

  let consolidationNote = '';
  if (appellation.consolidated) {
    consolidationNote = `\n\nIMPORTANT: This is a CONSOLIDATED page covering multiple related appellations:\n- ${appellation.consolidated.join('\n- ')}\n\nStructure your guide with clear sections for each appellation variant.`;
  }

  const prompt = `You are writing an educational wine appellation guide for ${appellation.name} in the Loire Valley, France.

${hasRagData ? `CONTEXT FROM WINE KNOWLEDGE BASE:\n${francoisContext}\n` : ''}

${appellation.notes ? `SPECIAL NOTES: ${appellation.notes}\n` : ''}${consolidationNote}

Write a detailed, comprehensive guide covering:

## Overview (2-3 paragraphs)
- Geographic location within ${appellation.parentRegion}
- When the appellation was established
- Size and key geographical features
${appellation.consolidated ? '- How the different appellation zones relate to each other' : ''}

## Terroir & Climate (2-3 paragraphs)
- Geology and soil types
- Climate characteristics (maritime influence, Loire River effects, temperature)
- Elevation and aspect
- How terroir influences wine character

## Grape Varieties & Wine Styles (2-3 paragraphs)
- Primary grape varieties
- Wine styles produced (dry white, sweet white, red, rosé, sparkling)
- What makes wines from ${appellation.name} distinctive
- Aging potential and evolution

## Notable Producers (1-2 paragraphs)
- Mention 4-6 well-known producers
- Keep factual, no marketing language
- Include both established estates and rising stars if known

## What to Know (1 paragraph)
- Key takeaways for wine enthusiasts
- Typical price ranges
- Best vintages or conditions
- Serving suggestions (temperature, glassware)

STYLE GUIDELINES:
- Educational, not promotional
- Technical but accessible
- Focus on terroir and how it shapes wine
- Use specific details (soil types, climate data, etc.)
- NO pairing recommendations
- NO fluff or marketing speak
- Cite facts when known, be general when uncertain

${!hasRagData ? 'NOTE: You may use web search to find accurate information about this appellation.' : ''}

Write in markdown format. Start with the Overview section immediately (no title, that will be added separately).`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 3000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }]
  });

  const content = message.content[0].type === 'text' ? message.content[0].text : '';
  console.log(`  ✅ Generated ${content.length} chars of content`);

  return content;
}

/**
 * Create page.tsx and guide.md files
 */
function createPageFiles(appellation: Appellation, content: string): void {
  const dirPath = path.join(process.cwd(), 'app', 'regions', appellation.parentPath, appellation.slug);

  // Create directory
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Create markdown content file
  const contentPath = path.join(dirPath, `${appellation.slug}-guide.md`);
  fs.writeFileSync(contentPath, content);

  // Create page.tsx
  const functionName = appellation.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  const pageContent = `import RegionLayout from '@/components/RegionLayout';

export default function ${functionName}Page() {
  return (
    <RegionLayout
      title="${appellation.name}"
      level="village"
      parentRegion="${appellation.parentPath}"
      contentFile="${appellation.slug}-guide.md"
    />
  );
}
`;

  const pagePath = path.join(dirPath, 'page.tsx');
  fs.writeFileSync(pagePath, pageContent);

  console.log(`  ✅ Created page.tsx and ${appellation.slug}-guide.md`);
}

/**
 * Main execution
 */
async function main() {
  console.log('🍷 LOIRE VALLEY APPELLATION PAGE GENERATOR');
  console.log('='.repeat(70));
  console.log(`Total appellations: ${ALL_APPELLATIONS.length}`);
  console.log('  • Pays Nantais: 2');
  console.log('  • Anjou-Saumur: 7');
  console.log('  • Touraine: 7');
  console.log('  • Centre-Loire: 6');
  console.log('='.repeat(70));

  for (let i = 0; i < ALL_APPELLATIONS.length; i++) {
    const appellation = ALL_APPELLATIONS[i];
    console.log(`\n[${i + 1}/${ALL_APPELLATIONS.length}] ${appellation.name} (${appellation.parentRegion})`);
    console.log('-'.repeat(70));

    try {
      // Generate content
      const content = await generatePageContent(appellation);

      // Create files
      createPageFiles(appellation, content);

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error: any) {
      console.error(`  ❌ Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ LOIRE VALLEY APPELLATION GENERATION COMPLETE!');
  console.log('='.repeat(70));
  console.log(`\n${ALL_APPELLATIONS.length} appellation pages created successfully`);
}

main().catch(console.error);
