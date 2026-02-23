import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

async function getRagContext(region: string, year: number): Promise<string> {
  try {
    const response = await fetch('http://localhost:8000/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `${region} ${year} vintage weather growing conditions harvest`,
        n_results: 10,
        rerank: true
      })
    });

    if (!response.ok) return '';

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results.map((r: any) => r.text).join('\n\n').substring(0, 3000);
    }
    return '';
  } catch (error) {
    return '';
  }
}

async function generateVintageOverview(region: string, year: number, ragContext: string): Promise<{ overview: string; rating: string }> {
  const prompt = `You are a wine expert writing a vintage report for ${region} ${year}.

${ragContext ? `REFERENCE CONTEXT:\n${ragContext}\n\n` : ''}

Write a concise 2-3 sentence overview of the ${year} vintage in ${region} that covers:
- Weather and growing conditions
- Overall quality and character of the wines
- Drinking window/aging potential if relevant

Also provide an overall rating: poor, fair, good, very_good, excellent, or outstanding

Format:
OVERVIEW: [2-3 sentences]
RATING: [one of: poor, fair, good, very_good, excellent, outstanding]`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 500,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }]
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';

  const overviewMatch = text.match(/OVERVIEW:\s*(.+?)(?=RATING:|$)/s);
  const ratingMatch = text.match(/RATING:\s*(\w+)/);

  return {
    overview: overviewMatch ? overviewMatch[1].trim() : text.substring(0, 300),
    rating: ratingMatch ? ratingMatch[1].toLowerCase() : 'good'
  };
}

async function generateVintageReports() {
  console.log('🍷 GENERATING VINTAGE REPORTS');
  console.log('='.repeat(70));

  // Get all unique region + vintage combinations from imported wines
  const combinations = await client.fetch(`
    *[_type == 'wine' && defined(vintage) && defined(region)] {
      vintage,
      'regionId': region._ref,
      'regionName': region->name,
      'regionSlug': region->slug.current
    }
  `);

  // Group by region + vintage
  const uniqueCombos = new Map<string, { regionId: string; regionName: string; regionSlug: string; vintage: number }>();

  combinations.forEach((combo: any) => {
    const key = `${combo.regionId}-${combo.vintage}`;
    if (!uniqueCombos.has(key)) {
      uniqueCombos.set(key, {
        regionId: combo.regionId,
        regionName: combo.regionName,
        regionSlug: combo.regionSlug,
        vintage: combo.vintage
      });
    }
  });

  console.log(`Found ${uniqueCombos.size} unique region+vintage combinations\n`);

  let created = 0;
  let skipped = 0;

  for (const [key, combo] of uniqueCombos) {
    // Check if vintage report already exists
    const existing = await client.fetch(
      `*[_type == 'vintageReport' && region._ref == $regionId && year == $year][0]`,
      { regionId: combo.regionId, year: combo.vintage }
    );

    if (existing) {
      console.log(`⏭️  ${combo.regionName} ${combo.vintage} - already exists`);
      skipped++;
      continue;
    }

    console.log(`\n📝 Creating: ${combo.regionName} ${combo.vintage}`);

    // Get RAG context
    const ragContext = await getRagContext(combo.regionName, combo.vintage);
    if (ragContext) {
      console.log(`   ✓ Found RAG context`);
    }

    // Generate overview and rating
    const { overview, rating } = await generateVintageOverview(combo.regionName, combo.vintage, ragContext);

    // Create vintage report
    await client.create({
      _type: 'vintageReport',
      region: { _type: 'reference', _ref: combo.regionId },
      year: combo.vintage,
      slug: { current: `${combo.vintage}` },
      overview,
      overallRating: rating
    });

    console.log(`   ✅ Created vintage report`);
    console.log(`   Overview: ${overview.substring(0, 100)}...`);
    console.log(`   Rating: ${rating}`);

    created++;

    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n' + '='.repeat(70));
  console.log(`✅ Created: ${created}`);
  console.log(`⏭️  Skipped (already exist): ${skipped}`);
}

generateVintageReports();
