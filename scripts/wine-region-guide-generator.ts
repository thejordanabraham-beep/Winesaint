/**
 * WINE REGION GUIDE GENERATOR
 *
 * Generates comprehensive wine region guides using François RAG
 * Style: Academic but accessible (modeled on Jura Guide)
 *
 * Output: Structured markdown ready for WineSaint website
 *
 * LEVELS:
 * - Country: Overview of all regions, major grapes, wine culture
 * - Region: Deep dive into geology, climate, grapes, wines, appellations
 * - Sub-Region: Focused terroir, producers, specific characteristics
 */

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { calculateCost, type CostBreakdown } from '../lib/api-costs';
import { validateGuide, type ValidationResult, getExistingGuidePaths, checkDuplicateContent } from '../lib/validators/guide-validator';
import { withRetry } from '../lib/queue/parallel-queue';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Note: Web search is performed via Claude's built-in WebSearch tool during generation
// This placeholder function is kept for the research phase structure

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Query François RAG API with retry logic
async function queryFrancois(query: string, nResults: number = 10): Promise<string> {
  const fetchFrancois = async (): Promise<string> => {
    const response = await fetch('http://localhost:8000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'wine-rag-secret-key-2024'
      },
      body: JSON.stringify({
        question: query,
        top_k: nResults,
        search_method: 'hybrid'
      })
    });

    if (!response.ok) {
      throw new Error(`François API returned ${response.status}`);
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results.map((r: any) => r.document).join('\n\n');
    }
    return '';
  };

  try {
    // Retry with exponential backoff
    return await withRetry(fetchFrancois, {
      maxRetries: 2,
      initialDelay: 1000,
      backoffMultiplier: 2,
    });
  } catch (error) {
    console.log(`   ⚠️  François query failed after retries: ${query.substring(0, 50)}...`);
    return '';
  }
}

// Multi-phase research: gather comprehensive information
async function researchRegion(
  regionName: string,
  level: 'country' | 'region' | 'sub-region' | 'vineyard',
  parentRegion?: string
) {
  console.log(`\n🔍 RESEARCH PHASE: ${regionName}`);
  console.log('='.repeat(70));

  const queries = level === 'country' ? [
    `${regionName} wine regions overview major wine areas appellations`,
    `${regionName} wine history culture traditions`,
    `${regionName} wine classification system AOC appellations`,
    `${regionName} major grape varieties wine styles`,
  ] : level === 'region' ? [
    `${regionName} geology terroir soil types limestone marl`,
    `${regionName} climate rainfall temperature frost growing conditions`,
    `${regionName} grape varieties indigenous regional grapes viticulture`,
    `${regionName} wine styles appellations AOC production methods`,
    `${regionName} vintage chart recent vintages quality`,
    `${regionName} producers winemakers domaines estates`,
  ] : level === 'vineyard' ? [
    `${regionName} ${parentRegion || ''} vineyard terroir soil slate geology`,
    `${regionName} ${parentRegion || ''} vineyard slope aspect microclimate`,
    `${regionName} ${parentRegion || ''} Grosse Lage VDP classification history`,
    `${regionName} ${parentRegion || ''} producers estates monopole`,
    `${regionName} ${parentRegion || ''} wine characteristics Riesling quality`,
  ] : [
    `${regionName} terroir soil geology vineyard sites`,
    `${regionName} microclimate conditions specific characteristics`,
    `${regionName} producers domaines key estates winemakers`,
    `${regionName} wine styles characteristics flavor profiles`,
    `${regionName} specific vineyard sites blocks parcels lieux-dits famous sites MGAs`,
  ];

  const research: Record<string, string> = {};

  // François RAG queries
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    const key = query.split(' ')[1]; // Extract topic (geology, climate, etc.)
    console.log(`   [${i + 1}/${queries.length}] François: ${key}...`);

    const results = await queryFrancois(query, 15);
    if (results) {
      research[key] = results;
      console.log(`      ✓ Found ${results.length} chars of context`);
    } else {
      console.log(`      ⚠️  No results`);
    }
  }

  const totalFrancoisChars = Object.values(research).join('').length;
  console.log(`\n   François research: ${(totalFrancoisChars / 1000).toFixed(1)}k chars`);

  return research;
}

// Generate guide using Claude with Jura Guide style
async function generateGuide(
  regionName: string,
  level: 'country' | 'region' | 'sub-region' | 'vineyard',
  research: Record<string, string>,
  parentRegion?: string
): Promise<{ content: string; cost: CostBreakdown }> {
  console.log(`\n✍️  GENERATION PHASE: ${regionName}`);
  console.log('='.repeat(70));

  // Build research context
  const researchContext = Object.entries(research)
    .map(([topic, content]) => `## ${topic.toUpperCase()}\n${content.substring(0, 4000)}`)
    .join('\n\n');

  // Auto-detect content tier based on research volume
  const totalResearchChars = Object.values(research).join('').length;
  let targetLength = '1,500-2,500';
  let contentTier = 'moderate';

  if (level === 'vineyard') {
    // Default assumption: comprehensive guide targeting 1,500+ words
    // Only go shorter if research + general knowledge genuinely limited
    if (totalResearchChars > 40000) {
      targetLength = '2,000-3,000+';
      contentTier = 'very-rich';
      console.log(`   📊 Research volume: ${(totalResearchChars / 1000).toFixed(0)}k chars → Comprehensive deep dive`);
    } else if (totalResearchChars > 25000) {
      targetLength = '1,500-2,200';
      contentTier = 'rich';
      console.log(`   📊 Research volume: ${(totalResearchChars / 1000).toFixed(0)}k chars → Standard comprehensive guide`);
    } else if (totalResearchChars > 10000) {
      targetLength = '1,200-1,800';
      contentTier = 'moderate';
      console.log(`   📊 Research volume: ${(totalResearchChars / 1000).toFixed(0)}k chars → Solid comprehensive guide`);
    } else {
      targetLength = '800-1,200';
      contentTier = 'sparse';
      console.log(`   📊 Research volume: ${(totalResearchChars / 1000).toFixed(0)}k chars → Brief guide (limited info)`);
    }
  } else if (level === 'sub-region') {
    if (totalResearchChars > 50000) {
      targetLength = '800-1,200';
      contentTier = 'rich';
      console.log(`   📊 Research volume: ${(totalResearchChars / 1000).toFixed(0)}k chars → Rich content tier`);
    } else if (totalResearchChars > 30000) {
      targetLength = '600-900';
      contentTier = 'moderate';
      console.log(`   📊 Research volume: ${(totalResearchChars / 1000).toFixed(0)}k chars → Moderate content tier`);
    } else {
      targetLength = '400-700';
      contentTier = 'sparse';
      console.log(`   📊 Research volume: ${(totalResearchChars / 1000).toFixed(0)}k chars → Concise content tier`);
    }
  }

  const levelGuidance = level === 'vineyard'
    ? contentTier === 'very-rich'
    ? `This is a VINEYARD-LEVEL guide. This appears to be a famous/important site - write a COMPREHENSIVE deep dive. Include ALL relevant sections:
- **Opening Hook**: Lead with what makes this vineyard legendary/unique
- **Historical Context**: Medieval construction, ownership history, historical significance, cultural importance
- **Geography & Exposition**: Detailed slope analysis, aspect, elevation ranges, exposure, microclimate effects
- **Terroir**: Comprehensive soil composition, geology (slate types, clay content, bedrock, formations), comparison to neighbors
- **Vineyard Sectors/Parcels**: If applicable, detail each sector with distinct characteristics (e.g., Uhlen's Blaufüsser Lay vs Roth Lay vs Laubach, Prälat's different terraces)
- **Viticultural Details**: Slope gradients, terrace walls, hand-harvesting requirements, vine age, training systems, yield restrictions
- **Wine Character**: Detailed flavor profiles, structure, aging potential, vintage variation, distinctive characteristics that identify this site blind
- **Key Producers**: Comprehensive profiles of estates working this site with their different approaches. Include monopoles, parcel names, iconic bottlings naturally when genuinely legendary
- **Classification**: VDP status, Grosse Lage/Erste Lage, historical rankings, modern recognition
- **Cultural Significance**: Role in regional wine history, preservation efforts, etc.

Target length: ${targetLength} words minimum - GO LONGER if warranted. NO UPPER LIMIT.
IMPORTANT: This is a premier site. Use François research + your general wine knowledge to create a definitive guide. Include specific parcel names, producer details, technical data, historical anecdotes, comparative analysis.`
    : contentTier === 'rich'
    ? `This is a VINEYARD-LEVEL guide. Write a COMPREHENSIVE guide covering all relevant aspects. Include these sections:
- **Opening Hook**: Lead with what makes this vineyard distinctive or significant
- **Geography & Exposition**: Slope, aspect, elevation, exposure, microclimate
- **Terroir**: Detailed soil composition, geology (slate type, clay content, bedrock, etc.)
- **Historical Context**: Construction history, ownership, cultural significance if applicable
- **Wine Character**: Detailed flavor profiles, structure, aging potential, distinctive characteristics
- **Comparison to Neighbors**: How this compares/contrasts with neighboring vineyards in the region
- **Vineyard Sectors/Parcels**: If applicable (different sections with distinct terroir)
- **Key Producers**: Profiles of estates working this site, their approaches, notable bottlings if genuinely iconic
- **Viticultural Details**: Slope gradients, training systems, yield restrictions, hand-harvesting if applicable
- **Classification**: VDP status, Grosse Lage/Erste Lage designation, historical rankings

Target length: ${targetLength} words (comprehensive profile)
IMPORTANT: Use François research + your general wine knowledge. Write comprehensive guides by default. Include comparative analysis, producer details, terroir specifics.`
    : contentTier === 'moderate'
    ? `This is a VINEYARD-LEVEL guide. Write a COMPREHENSIVE guide covering key aspects. Include these sections:
- **Geography & Terroir**: Slope, soil type, geological characteristics
- **Wine Character**: Flavor profile, structure, distinctive characteristics
- **Comparison to Neighbors**: Brief comparative context vs. neighboring vineyards
- **Key Producers**: Notable estates working this site
- **Classification**: VDP status if applicable
- **Historical Context**: Brief note if historically significant

Target length: ${targetLength} words (solid comprehensive guide)
IMPORTANT: Use François research + your general wine knowledge. Default to comprehensive treatment. Only omit sections if truly no information available.`
    : `This is a VINEYARD-LEVEL guide with LIMITED information available. Include essential sections:
- **Terroir**: Soil/site characteristics
- **Wine Character**: Key distinguishing features if known
- **Comparison to Neighbors**: Brief context if helpful
- **Producers**: Notable estates if documented
- **Classification**: VDP status if known

Target length: ${targetLength} words (focused guide)
IMPORTANT: Use François research + your general wine knowledge. Write what's well-supported. If the vineyard genuinely has limited information or isn't particularly significant, a brief focused guide is appropriate. Don't pad with speculation.`
    : level === 'country'
    ? `This is a COUNTRY-LEVEL guide. Include these sections:
- **Overview**: Major wine regions within the country and their distinct characteristics
- **Wine History & Culture**: Evolution of winemaking, traditions, key historical moments
- **Classification System**: How appellations/regions are organized (AOC, DOC, AVA, etc.)
- **Geography & Climate**: General landscape, climate zones, major geographical features
- **Major Grape Varieties**: Indigenous and important grapes across regions
- **Wine Styles**: Overview of characteristic wines produced
- **Key Regions**: Brief profiles of major wine-producing areas
- **Notable Producers**: Mention of benchmark estates (naturally, not exhaustive list)

Target length: 2,500-3,500 words (comprehensive overview)`
    : level === 'region'
    ? `This is a REGION-LEVEL guide. Follow the Jura Guide model:
- Opening hook establishing the region's uniqueness
- GEOLOGY section: Deep technical dive (soil types, formation, comparison to neighbors)
- CLIMATE section: Challenges, rainfall, frost, climate change impacts, growing conditions
- GRAPES section: Individual profiles with viticulture, DNA/history, soil preferences
- WINES section: Style explanations, production methods, aging requirements, characteristics
- APPELLATIONS section: Quick reference list of sub-appellations and key villages
- VINTAGE VARIATION section: Analysis of how the region performs across different vintage conditions
- KEY PRODUCERS section: Notable estates and domaines (mention iconic bottlings naturally if genuinely legendary)
- SOURCES section: Credit to Oxford Companion, Wine Grapes, GuildSomm, etc.

Target length: 3,500-5,000 words (comprehensive deep dive)`
    : contentTier === 'rich'
    ? `This is a SUB-REGION-LEVEL guide with RICH information available. Include these sections:
- **Geography & Microclimate**: Elevation, aspect, weather patterns, specific features
- **Terroir**: Comprehensive soil types, geology, formation history
- **Wine Characteristics**: Detailed flavor profiles, structure, aging potential, technical details
- **Comparison to Neighbors**: How this differs from neighboring sub-regions (natural comparative analysis)
- **Notable Lieux-Dits/Blocks/Parcels**: Specific vineyard sites with their characteristics (e.g., "Les Chaillots in the upper slopes," "F Block known for concentration")
- **Key Producers**: Detailed profiles and their distinct approaches. Mention iconic bottlings naturally if genuinely legendary (monopoles, benchmark wines)
- **Vintage Variation**: Analysis of how vintages perform, ideal conditions, notable years
- **Historical Context**: Evolution of the area if interesting

Target length: ${targetLength} words (comprehensive deep dive)
IMPORTANT: You have rich source material - use it fully. Include specific details, producer names, vineyard sites, technical data.`
    : contentTier === 'moderate'
    ? `This is a SUB-REGION-LEVEL guide with MODERATE information available. Include these sections:
- **Geography & Climate**: Key features, elevation, conditions
- **Terroir**: Soil types and distinguishing characteristics
- **Wine Characteristics**: Style and structure when notable
- **Comparison**: How this differs from neighbors (when natural)
- **Notable Sites**: Important lieux-dits/blocks if well-documented
- **Key Producers**: Notable estates worth knowing
- **Vintage Variation**: Brief statement about ideal conditions (e.g., "Performs best in cooler vintages...")

Target length: ${targetLength} words (solid overview)
IMPORTANT: Focus on substance over padding. Cover what's well-documented, skip speculation.`
    : `This is a SUB-REGION-LEVEL guide with LIMITED information available. Include core sections:
- **Geography/Terroir**: What makes this distinct
- **Wine Characteristics**: Essential character if notable
- **Comparison**: Brief context vs. neighbors (if helpful)
- **Key Producers**: Any notable estates worth mentioning
- **Vintage**: Brief note on ideal conditions if data available

Target length: ${targetLength} words (concise overview)
IMPORTANT: Write only what's well-supported by the research. Keep it focused and factual. Don't pad content.`;

  const prompt = `You are a wine educator writing a comprehensive wine region guide for WineSaint in the style of the acclaimed Jura Guide.

## REGION INFORMATION
Name: ${regionName}
Level: ${level}${parentRegion ? `\nParent Region: ${parentRegion}` : ''}

## WRITING STYLE (Critical - Match the Jura Guide)
- **Tone**: Academic but accessible. Technical precision without pretension.
- **Voice**: Confident, direct, engaging. Use punchy declaratives.
- **Detail Level**: Specific data (percentages, dates, measurements, scientific terms)
- **Structure**: Clear sections with descriptive headers
- **Comparisons**: Reference neighboring regions for context (naturally, when it adds understanding)
- **Myth-busting**: Challenge common misconceptions when appropriate
- **Specificity**: Concrete examples over generalizations

## STYLE EXAMPLES FROM JURA GUIDE:
- "This is not a subtle distinction." (punchy declarative)
- "The Flavor Myth: Many texts describe Savagnin as giving 'nutty and spicy' wines. This is wrong—or rather, incomplete." (myth-busting)
- "Between 230 and 160 million years ago, the Jura region lay beneath a shallow sea." (specific dates)
- "In Burgundy's Côte d'Or, approximately 80% of the base rock is limestone and 20% is marl. In the Jura, this ratio inverts—roughly 80% marl to 20% limestone." (comparative data)

## ${levelGuidance}

## CRITICAL: USE BOTH SOURCES OF KNOWLEDGE
You have access to TWO sources of information:
1. **François RAG research** (provided below) - wine-specific database with tasting notes, producer info, technical details
2. **Your general wine knowledge** - extensive training data about wine regions, terroir, history, geology, producers

**IMPORTANT**: Combine BOTH sources to write comprehensive guides. Don't limit yourself to only what's in François research. Use your general knowledge about:
- German wine regions, Rheingau/Mosel geography, VDP classification
- Famous vineyards and their characteristics (Schloss Johannisberg, Berg Schlossberg, Steinberg, etc.)
- Typical soil types in the Rheingau (slate, loess, marl, quartzite)
- Producer names and their reputations
- Historical context and wine culture

## RESEARCH CONTEXT FROM FRANÇOIS RAG:
${researchContext}

## CONTENT GUIDELINES - ALWAYS INCLUDE (when data available):
1. **Geography & Climate/Microclimate**: Elevation, aspect, weather patterns, distinguishing features
2. **Terroir**: Soil types, geology, formation history
3. **Wine Characteristics**: Flavor profiles, structure, aging potential (when notable)
4. **Comparison to Neighbors**: Natural comparisons that provide context (e.g., "Unlike neighboring X which has Y soil, this area features Z...")
5. **Notable Lieux-Dits/Blocks/Parcels**: Specific vineyard sites when well-documented (e.g., "Les Chaillots," "F Block," specific MGAs)
6. **Key Producers**: Notable estates and their approaches. If there's a genuinely iconic bottling (monopole, legendary wine), mention it naturally here - don't create separate section
7. **Vintage Variation**:
   - For rich content guides: Include vintage analysis or chart if data available
   - For moderate/sparse guides: Brief statement about ideal conditions (e.g., "Performs best in cooler vintages due to natural acidity retention")

## CONTENT TO NEVER INCLUDE:
- ❌ Food pairing suggestions
- ❌ Visiting/tourism information
- ❌ "Wines to seek out" or "recommended bottles" sections
- ❌ Practical buying advice or price guidance
- ❌ Separate "Essential Bottles" section (weave iconic wines into Key Producers if genuinely notable)

## IMPORTANT INSTRUCTIONS:
1. Write in markdown format with clear section headers
2. Use the research context but synthesize into original prose (don't copy verbatim)
3. Include specific technical details, dates, percentages, measurements
4. Make comparisons naturally when they add understanding - don't force them
5. Mention specific lieux-dits/blocks/parcels when the research provides good data
6. Within Key Producers, mention truly iconic bottlings organically (DRC's Romanée-Conti, Krug's Clos du Mesnil, etc.) - but only if genuinely legendary
7. Cite sources at end: Oxford Companion to Wine, Wine Grapes, GuildSomm, etc.
8. Front-load the most interesting/unique aspects to hook readers
9. Use subheadings liberally for scanability
10. Write naturally - vary sentence structure, use questions occasionally
11. Let the content breathe - don't pad sections if data is sparse

Generate the complete wine region guide now in markdown format:`;

  console.log(`   Querying Claude Sonnet 4.5...`);
  console.log(`   Expected length: ${level === 'country' ? '2,500-3,500' : level === 'region' ? '3,500-5,000' : targetLength} words`);

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 16000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }]
  });

  const content = message.content[0].type === 'text' ? message.content[0].text : '';

  // Calculate cost
  const cost = calculateCost(
    'claude-sonnet-4-5-20250929',
    message.usage.input_tokens,
    message.usage.output_tokens
  );

  const wordCount = content.split(/\s+/).length;
  console.log(`   ✓ Generated ${wordCount.toLocaleString()} words`);
  console.log(`   ✓ Input tokens: ${message.usage.input_tokens.toLocaleString()}`);
  console.log(`   ✓ Output tokens: ${message.usage.output_tokens.toLocaleString()}`);
  console.log(`   💰 Cost: $${cost.totalCost.toFixed(4)}`);

  return { content, cost };
}

// Generation result interface
export interface GenerationResult {
  success: boolean;
  guide?: string;
  outputPath?: string;
  metrics: {
    regionName: string;
    level: string;
    wordCount: number;
    researchQueries: number;
    claudeTokens: CostBreakdown;
    totalCost: number;
    duration: number;
  };
  validation: ValidationResult;
  error?: Error;
}

// Main function
async function generateRegionGuide(
  regionName: string,
  level: 'country' | 'region' | 'sub-region' | 'vineyard',
  parentRegion?: string,
  outputFile?: string
): Promise<GenerationResult> {
  const startTime = Date.now();

  console.log('\n🍷 WINE REGION GUIDE GENERATOR');
  console.log('='.repeat(70));
  console.log(`Region: ${regionName}`);
  console.log(`Level: ${level}`);
  if (parentRegion) console.log(`Parent: ${parentRegion}`);
  console.log('='.repeat(70));

  try {
    // Phase 1: Research
    const research = await researchRegion(regionName, level, parentRegion);
    const researchQueries = Object.keys(research).length;

    // Phase 2: Generate
    const { content: guide, cost } = await generateGuide(regionName, level, research, parentRegion);

    // Phase 3: Validate
    console.log(`\n🔍 VALIDATION PHASE`);
    console.log('='.repeat(70));

    const validation = validateGuide(guide, level);
    const wordCount = guide.split(/\s+/).length;

    if (validation.valid) {
      console.log(`   ✅ PASS - Guide meets quality standards`);
    } else {
      console.log(`   ❌ FAIL - Quality issues detected:`);
      validation.errors.forEach(err => console.log(`      ❌ ${err}`));
    }

    if (validation.warnings.length > 0) {
      console.log(`   ⚠️  Warnings:`);
      validation.warnings.forEach(warn => console.log(`      ⚠️  ${warn}`));
    }

    // Phase 4: Check for duplicates
    const guidesDir = path.join(process.cwd(), 'guides');
    const existingGuides = getExistingGuidePaths(guidesDir);
    const duplicateCheck = checkDuplicateContent(guide, existingGuides);

    if (duplicateCheck.isDuplicate) {
      console.log(`   ⚠️  WARNING: Content is ${(duplicateCheck.similarity * 100).toFixed(1)}% similar to ${path.basename(duplicateCheck.matchedFile!)}`);
    }

    // Phase 5: Save
    const filename = outputFile || `${regionName.toLowerCase().replace(/\s+/g, '-')}-guide.md`;
    const outputPath = path.join(guidesDir, filename);

    // Create guides directory if it doesn't exist
    if (!fs.existsSync(guidesDir)) {
      fs.mkdirSync(guidesDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, guide, 'utf-8');

    const duration = Date.now() - startTime;

    console.log(`\n✅ COMPLETE`);
    console.log(`   Saved to: ${outputPath}`);
    console.log(`   Word count: ${wordCount.toLocaleString()}`);
    console.log(`   Duration: ${Math.floor(duration / 1000)}s`);
    console.log('='.repeat(70));

    return {
      success: true,
      guide,
      outputPath,
      metrics: {
        regionName,
        level,
        wordCount,
        researchQueries,
        claudeTokens: cost,
        totalCost: cost.totalCost,
        duration,
      },
      validation,
    };
  } catch (error) {
    const duration = Date.now() - startTime;

    console.log(`\n❌ FAILED`);
    console.log(`   Error: ${(error as Error).message}`);
    console.log('='.repeat(70));

    return {
      success: false,
      metrics: {
        regionName,
        level,
        wordCount: 0,
        researchQueries: 0,
        claudeTokens: {
          model: 'claude-sonnet-4-5-20250929',
          inputTokens: 0,
          outputTokens: 0,
          inputCost: 0,
          outputCost: 0,
          totalCost: 0,
        },
        totalCost: 0,
        duration,
      },
      validation: {
        valid: false,
        errors: [(error as Error).message],
        warnings: [],
        metrics: {
          wordCount: 0,
          hasRequiredSections: false,
          sectionsFound: [],
          uniqueWordRatio: 0,
        },
      },
      error: error as Error,
    };
  }
}

// Export for use in other scripts
export { generateRegionGuide, researchRegion, generateGuide };

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(`
Usage: npx tsx scripts/wine-region-guide-generator.ts <region-name> <level> [parent-region] [output-file]

Examples:
  npx tsx scripts/wine-region-guide-generator.ts "France" country
  npx tsx scripts/wine-region-guide-generator.ts "Burgundy" region "France"
  npx tsx scripts/wine-region-guide-generator.ts "Côte de Nuits" sub-region "Burgundy" "cote-de-nuits.md"
  npx tsx scripts/wine-region-guide-generator.ts "Wehlener Sonnenuhr" vineyard "Mosel" "wehlener-sonnenuhr-guide.md"

Levels:
  country     - Overview of major regions, wine culture (2,500-3,500 words)
  region      - Deep dive: geology, climate, grapes, wines (3,500-5,000 words)
  sub-region  - Adaptive length based on available information:
                • Rich data (>50k chars): 800-1,200 words
                • Moderate data (30-50k chars): 600-900 words
                • Sparse data (<30k chars): 400-700 words
  vineyard    - Individual vineyard/site guide (ADAPTIVE):
                • Very rich (>40k chars): 2,000-3,000+ words (famous/important sites)
                • Rich (>25k chars): 1,500-2,200 words (standard comprehensive)
                • Moderate (>10k chars): 1,200-1,800 words (solid comprehensive)
                • Sparse (<10k chars): 800-1,200 words (brief but complete)

                Default: Target ~1,500 words comprehensive guides with comparisons,
                producers, terroir details, historical context. Only go shorter if
                vineyard genuinely has limited significance/information.
                Uses François RAG + Claude's general wine knowledge.
`);
    process.exit(1);
  }

  const [regionName, level, parentRegion, outputFile] = args;

  if (!['country', 'region', 'sub-region', 'vineyard'].includes(level)) {
    console.log('❌ Level must be: country, region, sub-region, or vineyard');
    process.exit(1);
  }

  generateRegionGuide(
    regionName,
    level as 'country' | 'region' | 'sub-region' | 'vineyard',
    parentRegion,
    outputFile
  );
}
