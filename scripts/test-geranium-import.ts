/**
 * Test Geranium Wine List Import
 *
 * Processes 3 sample wines to show what François can generate
 */

import * as XLSX from 'xlsx';
import dotenv from 'dotenv';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { getReferenceNotes } from './lib/reference-sources';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const EXCEL_FILE = '/Users/jordanabraham/Desktop/Geranium_Wine_List.xlsx';

interface Wine {
  originalEntry: string;
  vintage: string;
  producer: string;
  wineName: string;
  region: string;
  category: string;
}

async function testImport() {
  console.log('🧪 TEST: Geranium Wine List Import');
  console.log('='.repeat(60));
  console.log('Processing 3 sample wines...\n');

  // Read Excel
  const workbook = XLSX.readFile(EXCEL_FILE);
  const worksheet = workbook.Sheets['Geranium Wine List'];
  const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // Get 3 sample wines (rows 2, 3, 4 - skipping header)
  const sampleWines: Wine[] = [
    {
      originalEntry: data[1][0],
      vintage: data[1][1],
      producer: data[1][2],
      wineName: data[1][3],
      region: data[1][4],
      category: data[1][5]
    },
    {
      originalEntry: data[2][0],
      vintage: data[2][1],
      producer: data[2][2],
      wineName: data[2][3],
      region: data[2][4],
      category: data[2][5]
    },
    {
      originalEntry: data[3][0],
      vintage: data[3][1],
      producer: data[3][2],
      wineName: data[3][3],
      region: data[3][4],
      category: data[3][5]
    }
  ];

  // Initialize Anthropic
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  // Process each wine
  for (const [index, wine] of sampleWines.entries()) {
    console.log(`\n[${ index + 1}/3] ${wine.originalEntry}`);
    console.log('─'.repeat(60));

    // 1. Query François
    console.log('🤖 Querying François RAG...');
    let context: any = [];
    try {
      context = await getReferenceNotes(
        wine.producer,
        wine.region,
        wine.wineName.split(/\s+/).filter(w => w.length > 3)
      );
    } catch (error: any) {
      console.log(`   ⚠️  Error querying François: ${error.message}`);
      context = [];
    }

    if (!Array.isArray(context) || context.length === 0) {
      console.log('   ⚠️  No context found in François');
    } else {
      console.log(`   ✅ Found ${context.length} relevant chunks`);
      if (context[0] && context[0].source) {
        console.log(`   Top source: ${context[0].source}`);
      }
    }

    // 2. Generate profile/description
    console.log('\n✍️  Generating wine profile...');

    const contextText = Array.isArray(context)
      ? context.map(c => c.text).join('\n\n').substring(0, 2000)
      : '';

    const prompt = `You are a wine expert writing a concise profile for a restaurant wine list.

WINE: ${wine.originalEntry}
Producer: ${wine.producer}
Region: ${wine.region}
Category: ${wine.category}

EDUCATIONAL CONTEXT:
${contextText || 'No specific context available. Use general wine knowledge.'}

Write a 75-100 word wine profile that:
- Describes the producer's style and reputation
- Mentions key characteristics of this region/wine
- Is educational but accessible
- Uses specific wine terminology

Profile:`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 300,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    });

    const profile = message.content[0].type === 'text' ? message.content[0].text : '';

    console.log('\n📝 GENERATED PROFILE:');
    console.log('─'.repeat(60));
    console.log(profile);
    console.log('─'.repeat(60));

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n\n✅ TEST COMPLETE');
  console.log('='.repeat(60));
  console.log('This shows what François can generate for each wine.');
  console.log('Ready to process all 6,383 wines when you are!');
}

testImport()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
