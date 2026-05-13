/**
 * GENERATE PIEDMONT GUIDES
 *
 * Generates comprehensive guides for Barolo and Barbaresco hierarchy:
 * - Commune guides (14 total): 2,500-3,500 words
 * - MGA guides (242 total): 500-2,500 words (depending on importance/information)
 *
 * Usage:
 *   npx tsx scripts/generate-piedmont-guides.ts --tier communes
 *   npx tsx scripts/generate-piedmont-guides.ts --tier barolo-mgas
 *   npx tsx scripts/generate-piedmont-guides.ts --tier barbaresco-mgas
 */

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { calculateCost } from '../lib/api-costs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const GUIDES_DIR = path.join(process.cwd(), 'guides');

interface GenerationStats {
  successful: number;
  failed: number;
  skipped: number;
  totalCost: number;
}

// Query François RAG API
async function queryFrancois(query: string, topK: number = 10): Promise<string> {
  try {
    const response = await fetch('http://localhost:8000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'wine-rag-secret-key-2024'
      },
      body: JSON.stringify({
        question: query,
        top_k: topK,
        search_method: 'hybrid'
      })
    });

    if (!response.ok) {
      return '';
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results.map((r: any) => r.document).join('\n\n');
    }
    return '';
  } catch (error) {
    console.log(`   ⚠️  François query failed`);
    return '';
  }
}

// Research commune via François and web
async function researchCommune(communeName: string, appellation: 'Barolo' | 'Barbaresco') {
  console.log(`   🔍 Researching ${communeName}...`);

  const queries = [
    `${communeName} ${appellation} commune terroir soil geology`,
    `${communeName} ${appellation} vineyard sites MGAs climate`,
    `${communeName} ${appellation} producers winemakers estates`,
    `${communeName} ${appellation} wine style characteristics`,
  ];

  const results = await Promise.all(queries.map(q => queryFrancois(q, 8)));
  return results.join('\n\n---\n\n');
}

// Research MGA via François and web
async function researchMGA(mgaName: string, communeName: string, appellation: 'Barolo' | 'Barbaresco') {
  const queries = [
    `${mgaName} ${communeName} ${appellation} MGA vineyard terroir soil`,
    `${mgaName} ${appellation} producers wines characteristics`,
  ];

  const results = await Promise.all(queries.map(q => queryFrancois(q, 5)));
  return results.join('\n\n---\n\n');
}

// Generate commune guide
async function generateCommuneGuide(
  communeName: string,
  communeSlug: string,
  appellation: 'Barolo' | 'Barbaresco',
  mgaCount: number
): Promise<{ success: boolean; cost: number }> {
  const outputFile = path.join(GUIDES_DIR, `${communeSlug}-guide.md`);

  if (fs.existsSync(outputFile)) {
    console.log(`   ⏭️  Skipped: ${communeSlug}-guide.md (already exists)`);
    return { success: true, cost: 0 };
  }

  console.log(`\n📝 Generating guide: ${communeName} (${appellation})`);

  // Research phase
  const research = await researchCommune(communeName, appellation);

  // Generate guide with extended thinking
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 16000,
    thinking: {
      type: 'enabled',
      budget_tokens: 10000
    },
    messages: [{
      role: 'user',
      content: `You are an expert wine writer specializing in Piedmont. Generate a comprehensive guide for the ${communeName} commune in ${appellation}.

**Target length:** 2,500-3,500 words
**Tone:** Academic but accessible, authoritative
**Audience:** Wine enthusiasts and professionals

**Research data from François RAG:**
${research}

**Structure:**
1. **Introduction** (2-3 paragraphs)
   - Overview of ${communeName}'s position in ${appellation}
   - Historical significance
   - Total production share and vineyard area

2. **Terroir & Geography** (400-600 words)
   - Soil composition (specific geological details)
   - Elevation range and slope orientation
   - Climate and microclimate
   - How terroir influences wine style

3. **Vineyard Sites & MGAs** (500-700 words)
   - Overview: ${communeName} has ${mgaCount} MGAs
   - Top 5-8 most important MGAs with brief descriptions
   - Geographic distribution of sites
   - Shared MGAs with neighboring communes (if any)

4. **Wine Style & Characteristics** (400-500 words)
   - Signature characteristics of ${communeName} ${appellation}
   - Tannin structure, aromatics, aging potential
   - Comparison to other ${appellation} communes
   - Vintage variation patterns

5. **Notable Producers** (300-400 words)
   - Key estates and winemakers
   - Historic producers vs. modern wave
   - Quality benchmarks

6. **Visiting ${communeName}** (200-300 words)
   - Geographic location and access
   - Wine tourism highlights
   - Best times to visit

**Guidelines:**
- Use specific examples, vineyard names, producer names
- Include geological and scientific terminology where appropriate
- Avoid marketing language or excessive praise
- Focus on education and terroir expression
- Write in clear, flowing paragraphs (not bullet points)
- Do NOT include a references section
- Do NOT use emojis or informal language

Generate the complete guide as markdown, starting with a # ${communeName} title.`
    }]
  });

  // Extract content and calculate cost
  let content = '';
  let inputTokens = 0;
  let outputTokens = 0;

  for (const block of response.content) {
    if (block.type === 'text') {
      content += block.text;
    }
  }

  if (response.usage) {
    inputTokens = response.usage.input_tokens;
    outputTokens = response.usage.output_tokens;
  }

  const cost = calculateCost('claude-sonnet-4-5-20250929', inputTokens, outputTokens);

  // Save guide
  fs.writeFileSync(outputFile, content);
  console.log(`   ✅ Generated: ${communeSlug}-guide.md (${outputTokens} tokens, $${cost.totalCost.toFixed(3)})`);

  return { success: true, cost: cost.totalCost };
}

// Generate MGA guide
async function generateMGAGuide(
  mgaName: string,
  mgaSlug: string,
  communeName: string,
  communeSlug: string,
  appellation: 'Barolo' | 'Barbaresco'
): Promise<{ success: boolean; cost: number }> {
  const outputFile = path.join(GUIDES_DIR, `${mgaSlug}-vineyard-guide.md`);

  if (fs.existsSync(outputFile)) {
    console.log(`   ⏭️  Skipped: ${mgaSlug}-vineyard-guide.md`);
    return { success: true, cost: 0 };
  }

  console.log(`   📝 Generating: ${mgaName}...`);

  // Research phase
  const research = await researchMGA(mgaName, communeName, appellation);

  // Generate guide with extended thinking
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 12000,
    thinking: {
      type: 'enabled',
      budget_tokens: 8000
    },
    messages: [{
      role: 'user',
      content: `You are an expert wine writer specializing in Piedmont. Generate a comprehensive guide for the ${mgaName} MGA in ${communeName}, ${appellation}.

**Target length:** 500-2,500 words (adjust based on available information and importance)
- If ${mgaName} is a major, well-documented site: aim for 1,500-2,500 words
- If ${mgaName} is lesser-known with limited information: 500-1,000 words is fine
**Tone:** Academic but accessible, authoritative
**Audience:** Wine enthusiasts and professionals

**Research data from François RAG:**
${research}

**Structure (adjust sections based on available information):**
1. **Introduction** (1-2 paragraphs)
   - Location within ${communeName}
   - Size and significance
   - Historical context (if notable)

2. **Terroir** (200-500 words, core section)
   - Soil composition
   - Elevation and aspect
   - Microclimate
   - How these factors influence the wine

3. **Wine Characteristics** (200-400 words)
   - Signature aromatics and flavor profile
   - Tannin structure
   - Aging potential
   - How it compares to other ${communeName} MGAs

4. **Producers & Wines** (150-400 words)
   - Key producers working this site
   - Notable bottlings
   - Quality benchmarks

5. **History & Recognition** (100-300 words, optional if information available)
   - Historical significance
   - Evolution of the site
   - Critical recognition

**Guidelines:**
- Write what you know with confidence; don't speculate or pad with generic content
- If information is limited, focus on terroir and wine characteristics
- Use specific details from the research data
- Avoid marketing language
- Write in clear, flowing paragraphs
- Do NOT include a references section
- Do NOT use emojis

Generate the complete guide as markdown, starting with a # ${mgaName} title.`
    }]
  });

  // Extract content and calculate cost
  let content = '';
  let inputTokens = 0;
  let outputTokens = 0;

  for (const block of response.content) {
    if (block.type === 'text') {
      content += block.text;
    }
  }

  if (response.usage) {
    inputTokens = response.usage.input_tokens;
    outputTokens = response.usage.output_tokens;
  }

  const cost = calculateCost('claude-sonnet-4-5-20250929', inputTokens, outputTokens);

  // Save guide
  fs.writeFileSync(outputFile, content);
  console.log(`      ✅ ${mgaSlug}-vineyard-guide.md ($${cost.totalCost.toFixed(3)})`);

  return { success: true, cost: cost.totalCost };
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const tierFlag = args.indexOf('--tier');
  const tier = tierFlag >= 0 ? args[tierFlag + 1] : 'communes';

  console.log('\n🏔️  PIEDMONT GUIDE GENERATOR');
  console.log('='.repeat(70));
  console.log(`Tier: ${tier}`);
  console.log('='.repeat(70));

  const stats: GenerationStats = {
    successful: 0,
    failed: 0,
    skipped: 0,
    totalCost: 0
  };

  // Load mappings
  const baroloMapping = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'barolo-commune-mapping.json'), 'utf-8')
  );
  const barbarescoMapping = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'barbaresco-commune-mapping.json'), 'utf-8')
  );

  if (tier === 'communes') {
    console.log('\n📚 TIER 1: COMMUNE GUIDES (14 total)');
    console.log('='.repeat(70));

    // Group by commune
    const baroloCommunes = new Map();
    const barbarescoCommunes = new Map();

    for (const mga of baroloMapping) {
      if (!baroloCommunes.has(mga.commune)) {
        baroloCommunes.set(mga.commune, { name: mga.communeName, count: 0 });
      }
      baroloCommunes.get(mga.commune).count++;
    }

    for (const mga of barbarescoMapping) {
      if (!barbarescoCommunes.has(mga.commune)) {
        barbarescoCommunes.set(mga.commune, { name: mga.communeName, count: 0 });
      }
      barbarescoCommunes.get(mga.commune).count++;
    }

    // Generate Barolo commune guides
    console.log('\n🍷 Barolo Communes (10):');
    for (const [slug, data] of baroloCommunes.entries()) {
      try {
        const result = await generateCommuneGuide(data.name, slug, 'Barolo', data.count);
        if (result.cost === 0) {
          stats.skipped++;
        } else {
          stats.successful++;
          stats.totalCost += result.cost;
        }
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.log(`   ❌ Failed: ${slug} - ${error}`);
        stats.failed++;
      }
    }

    // Generate Barbaresco commune guides
    console.log('\n🍷 Barbaresco Communes (4):');
    for (const [slug, data] of barbarescoCommunes.entries()) {
      try {
        const result = await generateCommuneGuide(data.name, slug, 'Barbaresco', data.count);
        if (result.cost === 0) {
          stats.skipped++;
        } else {
          stats.successful++;
          stats.totalCost += result.cost;
        }
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.log(`   ❌ Failed: ${slug} - ${error}`);
        stats.failed++;
      }
    }

  } else if (tier === 'barolo-mgas') {
    console.log('\n📚 TIER 2: BAROLO MGA GUIDES (177 total)');
    console.log('='.repeat(70));

    let processed = 0;
    for (const mga of baroloMapping) {
      try {
        const result = await generateMGAGuide(
          mga.mgaName,
          mga.mgaSlug,
          mga.communeName,
          mga.commune,
          'Barolo'
        );

        if (result.cost === 0) {
          stats.skipped++;
        } else {
          stats.successful++;
          stats.totalCost += result.cost;
        }

        processed++;
        if (processed % 10 === 0) {
          console.log(`\n   Progress: ${processed}/${baroloMapping.length} MGAs processed`);
          console.log(`   Running cost: $${stats.totalCost.toFixed(2)}\n`);
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.log(`   ❌ Failed: ${mga.mgaSlug} - ${error}`);
        stats.failed++;
      }
    }

  } else if (tier === 'barbaresco-mgas') {
    console.log('\n📚 TIER 3: BARBARESCO MGA GUIDES (65 total)');
    console.log('='.repeat(70));

    let processed = 0;
    for (const mga of barbarescoMapping) {
      try {
        const result = await generateMGAGuide(
          mga.mgaName,
          mga.mgaSlug,
          mga.communeName,
          mga.commune,
          'Barbaresco'
        );

        if (result.cost === 0) {
          stats.skipped++;
        } else {
          stats.successful++;
          stats.totalCost += result.cost;
        }

        processed++;
        if (processed % 10 === 0) {
          console.log(`\n   Progress: ${processed}/${barbarescoMapping.length} MGAs processed`);
          console.log(`   Running cost: $${stats.totalCost.toFixed(2)}\n`);
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.log(`   ❌ Failed: ${mga.mgaSlug} - ${error}`);
        stats.failed++;
      }
    }
  }

  // Summary
  console.log('\n✅ GENERATION COMPLETE');
  console.log('='.repeat(70));
  console.log(`Successful: ${stats.successful}`);
  console.log(`Skipped (already exist): ${stats.skipped}`);
  console.log(`Failed: ${stats.failed}`);
  console.log(`Total cost: $${stats.totalCost.toFixed(2)}`);
  console.log('\n💡 Next steps:');
  if (tier === 'communes') {
    console.log('   - Review commune guides for quality');
    console.log('   - Run: npx tsx scripts/generate-piedmont-guides.ts --tier barolo-mgas');
  } else if (tier === 'barolo-mgas') {
    console.log('   - Review Barolo MGA guides');
    console.log('   - Run: npx tsx scripts/generate-piedmont-guides.ts --tier barbaresco-mgas');
  } else {
    console.log('   - All guides generated!');
    console.log('   - Review guides for quality and accuracy');
  }
}

main().catch(console.error);
