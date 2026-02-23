/**
 * Automated Wine Import Pipeline
 *
 * Uses Claude AI to automatically extract wine components from wine names
 * and imports them into Sanity with all proper references.
 *
 * Usage:
 *   npm run import-wine "2020 Domaine Leroy Chambolle-Musigny Les Amoureuses Premier Cru"
 *   npm run import-wine --file wines.txt
 */

import { createClient } from '@sanity/client';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: path.join(__dirname, '../.env.local') });

// Sanity client setup
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
});

// Anthropic client setup
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

interface WineComponents {
  vintage?: number;
  producer?: string;
  appellation?: string;
  climat?: string;
  classification?: string;
  grape?: string;
  region?: string;
  country?: string;
}

async function extractWineComponents(wineName: string): Promise<WineComponents> {
  console.log(`🤖 Extracting components from: "${wineName}"`);

  // Load training examples
  const trainingPath = path.join(__dirname, '../data/wine-pattern-training-comprehensive.json');
  const trainingData = JSON.parse(fs.readFileSync(trainingPath, 'utf-8'));

  // Flatten training examples
  const examples = trainingData.flatMap((region: any) => region.examples).slice(0, 20);

  // Build few-shot prompt
  const examplesText = examples
    .map((ex: any) => {
      return `Input: "${ex.input}"
Output: ${JSON.stringify(ex.expected, null, 2)}`;
    })
    .join('\n\n');

  const prompt = `You are an expert wine data extraction system. Extract structured wine information from wine names.

Here are some examples:

${examplesText}

Now extract components from this wine name:
Input: "${wineName}"
Output:`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

  // Parse JSON from response
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not extract JSON from Claude response');
  }

  const extracted = JSON.parse(jsonMatch[0]);
  console.log('✅ Extracted:', extracted);
  return extracted;
}

async function findOrCreateProducer(producerName: string): Promise<string> {
  const existing = await sanityClient.fetch(
    `*[_type == "producer" && name == $name][0]`,
    { name: producerName }
  );

  if (existing) {
    console.log(`  📍 Found existing producer: ${producerName}`);
    return existing._id;
  }

  const newProducer = await sanityClient.create({
    _type: 'producer',
    name: producerName,
    slug: {
      current: producerName
        .toLowerCase()
        .replace(/^(domaine|château|weingut|estate)\\s+/i, '')
        .replace(/\\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
    },
  });

  console.log(`  ✅ Created producer: ${producerName}`);
  return newProducer._id;
}

async function findOrCreateRegion(regionName: string, country?: string): Promise<string> {
  const existing = await sanityClient.fetch(
    `*[_type == "region" && name == $name][0]`,
    { name: regionName }
  );

  if (existing) {
    console.log(`  📍 Found existing region: ${regionName}`);
    return existing._id;
  }

  const newRegion = await sanityClient.create({
    _type: 'region',
    name: regionName,
    country: country || 'France',
    slug: { current: regionName.toLowerCase().replace(/\\s+/g, '-') },
  });

  console.log(`  ✅ Created region: ${regionName}`);
  return newRegion._id;
}

async function findOrCreateAppellation(
  appellationName: string,
  regionId: string
): Promise<string> {
  const existing = await sanityClient.fetch(
    `*[_type == "appellation" && name == $name][0]`,
    { name: appellationName }
  );

  if (existing) {
    console.log(`  📍 Found existing appellation: ${appellationName}`);
    return existing._id;
  }

  const newAppellation = await sanityClient.create({
    _type: 'appellation',
    name: appellationName,
    slug: { current: appellationName.toLowerCase().replace(/\\s+/g, '-') },
    parentRegion: { _type: 'reference', _ref: regionId },
  });

  console.log(`  ✅ Created appellation: ${appellationName}`);
  return newAppellation._id;
}

async function findClimat(climatName: string, appellationName?: string): Promise<string | null> {
  // Try exact match first
  let query = `*[_type == "climat" && name == $name`;
  const params: any = { name: climatName };

  if (appellationName) {
    query += ` && appellation->name == $appellation`;
    params.appellation = appellationName;
  }

  query += `][0]`;

  let existing = await sanityClient.fetch(query, params);

  if (existing) {
    console.log(`  📍 Found existing climat: ${climatName}`);
    return existing._id;
  }

  // Try partial match (climat name might be subset)
  const climatWords = climatName.toLowerCase().split(' ');
  const searchQuery = `*[_type == "climat"${appellationName ? ` && appellation->name == $appellation` : ''}]`;

  const allClimats = await sanityClient.fetch(
    searchQuery,
    appellationName ? { appellation: appellationName } : {}
  );

  for (const climat of allClimats) {
    const climatLower = climat.name.toLowerCase();
    // Check if climat name is contained in search term or vice versa
    if (climatLower.includes(climatName.toLowerCase()) || climatName.toLowerCase().includes(climatLower)) {
      console.log(`  📍 Found climat via partial match: ${climat.name} (searched for: ${climatName})`);
      return climat._id;
    }
  }

  console.log(`  ⚠️  Climat not found: ${climatName}`);
  return null;
}

async function importWine(wineName: string, dryRun: boolean = false): Promise<void> {
  console.log(`\\n${'='.repeat(80)}`);
  console.log(`🍷 Processing: ${wineName}`);
  console.log('='.repeat(80));

  try {
    // Extract components using Claude
    const components = await extractWineComponents(wineName);

    if (!components.vintage || !components.producer) {
      throw new Error('Missing required fields: vintage and producer');
    }

    console.log('\\n📦 Creating references...');

    // Find or create producer
    let producerId: string | undefined;
    if (components.producer) {
      producerId = await findOrCreateProducer(components.producer);
    }

    // Find or create region
    let regionId: string | undefined;
    if (components.region) {
      regionId = await findOrCreateRegion(components.region, components.country);
    }

    // Find or create appellation
    let appellationId: string | undefined;
    if (components.appellation && regionId) {
      appellationId = await findOrCreateAppellation(components.appellation, regionId);
    }

    // Find climat
    let climatId: string | null = null;
    if (components.climat) {
      climatId = await findClimat(components.climat, components.appellation);
    }

    if (dryRun) {
      console.log('\\n🔍 DRY RUN - Would create wine with:');
      console.log({
        name: wineName,
        vintage: components.vintage,
        producer: components.producer,
        region: components.region,
        appellation: components.appellation,
        climat: components.climat,
        classification: components.classification,
        grapeVarieties: components.grape ? [components.grape] : undefined,
      });
      return;
    }

    // Create wine document
    const wineDoc: any = {
      _type: 'wine',
      name: wineName,
      slug: {
        current: wineName
          .toLowerCase()
          .replace(/\\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .substring(0, 96),
      },
      vintage: components.vintage,
    };

    if (producerId) {
      wineDoc.producer = { _type: 'reference', _ref: producerId };
    }

    if (regionId) {
      wineDoc.region = { _type: 'reference', _ref: regionId };
    }

    if (climatId) {
      wineDoc.climat = { _type: 'reference', _ref: climatId };
    }

    if (components.grape) {
      wineDoc.grapeVarieties = [components.grape];
    }

    const result = await sanityClient.create(wineDoc);

    console.log('\\n✅ SUCCESS! Wine created:');
    console.log(`   ID: ${result._id}`);
    console.log(`   Name: ${wineName}`);
    console.log(`   Vintage: ${components.vintage}`);
    if (components.producer) console.log(`   Producer: ${components.producer}`);
    if (components.climat) console.log(`   Climat: ${components.climat}`);
    console.log(`   URL: https://winesaint.com/wines/${result.slug.current}`);
  } catch (error) {
    console.error('\\n❌ ERROR importing wine:', error);
    throw error;
  }
}

async function importFromFile(filePath: string, dryRun: boolean = false): Promise<void> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const wines = content.split('\\n').filter((line) => line.trim());

  console.log(`📋 Found ${wines.length} wines to import\\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const wine of wines) {
    try {
      await importWine(wine.trim(), dryRun);
      successCount++;
    } catch (error) {
      errorCount++;
    }
  }

  console.log('\\n' + '='.repeat(80));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(80));
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📊 Total: ${wines.length}`);
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('❌ No wine name provided');
  console.log('\\n💡 Usage:');
  console.log('   npm run import-wine "2020 Domaine Leroy Richebourg Grand Cru"');
  console.log('   npm run import-wine --file wines.txt');
  console.log('   npm run import-wine --dry-run "Wine Name Here"');
  process.exit(1);
}

const dryRun = args.includes('--dry-run');
const fileMode = args.includes('--file');

if (fileMode) {
  const fileIndex = args.indexOf('--file') + 1;
  const filePath = args[fileIndex];

  if (!filePath || !fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  importFromFile(filePath, dryRun)
    .then(() => {
      console.log('\\n✅ Batch import complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\\n❌ Batch import failed:', error);
      process.exit(1);
    });
} else {
  const wineName = args.filter((arg) => arg !== '--dry-run').join(' ');

  importWine(wineName, dryRun)
    .then(() => {
      console.log('\\n✅ Import complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\\n❌ Import failed:', error);
      process.exit(1);
    });
}
