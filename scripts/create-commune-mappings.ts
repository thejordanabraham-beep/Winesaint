/**
 * CREATE COMMUNE MAPPINGS FOR BAROLO & BARBARESCO
 *
 * This script creates comprehensive MGA-to-commune mappings by:
 * 1. Querying François RAG for each MGA's commune
 * 2. Cross-referencing with known research data
 * 3. Generating JSON mapping files
 */

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Barolo communes (11 total)
const BAROLO_COMMUNES = [
  'la-morra',
  'serralunga-d-alba',
  'barolo',
  'monforte-d-alba',
  'castiglione-falletto',
  'verduno',
  'novello',
  'cherasco',
  'diano-d-alba',
  'grinzane-cavour',
  'roddi'
] as const;

// Barbaresco communes (4 total)
const BARBARESCO_COMMUNES = [
  'barbaresco',
  'neive',
  'treiso',
  'san-rocco-seno-d-elvio'
] as const;

// Known mappings from research (partial - to be expanded)
const KNOWN_BAROLO_MAPPINGS: Record<string, string> = {
  // La Morra
  'rocche-dell-annunziata': 'la-morra',
  'la-serra': 'la-morra',
  'arborina': 'la-morra',
  'conca': 'la-morra',
  'brunate': 'la-morra',
  'cerequio': 'la-morra', // Shared with Barolo village
  'gattera': 'la-morra',

  // Serralunga d'Alba
  'falletto': 'serralunga-d-alba',
  'francia': 'serralunga-d-alba',
  'lazzarito': 'serralunga-d-alba',
  'vignarionda': 'serralunga-d-alba',
  'margheria': 'serralunga-d-alba',
  'cerretta': 'serralunga-d-alba',
  'prapo': 'serralunga-d-alba',
  'parafada': 'serralunga-d-alba',
  'ornato': 'serralunga-d-alba',

  // Barolo village
  'cannubi': 'barolo',
  'cannubi-boschis': 'barolo',
  'cannubi-muscatel': 'barolo',
  'cannubi-san-lorenzo': 'barolo',
  'cannubi-valletta': 'barolo',
  'sarmassa': 'barolo',
  'bricco-delle-viole': 'barolo',
  'terlo': 'barolo',
  'liste': 'barolo',
  'castellero': 'barolo',

  // Monforte d'Alba
  'ginestra': 'monforte-d-alba',
  'bussia': 'monforte-d-alba',
  'mosconi': 'monforte-d-alba',
  'castelletto': 'monforte-d-alba',
  'le-coste-di-monforte': 'monforte-d-alba',
  'ravera-di-monforte': 'monforte-d-alba',
  'bussia-dardi-le-rose': 'monforte-d-alba',
  'bussia-vigna-fantini': 'monforte-d-alba',
  'gramolere': 'monforte-d-alba',
  'perno': 'monforte-d-alba',
  'vigna-sori-ginestra': 'monforte-d-alba',

  // Castiglione Falletto
  'monprivato': 'castiglione-falletto',
  'rocche-di-castiglione': 'castiglione-falletto',
  'villero': 'castiglione-falletto',
  'bricco-rocche': 'castiglione-falletto',
  'parussi': 'castiglione-falletto',
  'fiasco': 'castiglione-falletto',
  'bricco-boschis': 'castiglione-falletto',

  // Verduno
  'monvigliero': 'verduno',
  'san-lorenzo-di-verduno': 'verduno',
  'boscatto': 'verduno',
  'massara': 'verduno',

  // Novello
  'ravera': 'novello',
  'sottocastello-di-novello': 'novello',
  'cerviano-merli': 'novello',
  'panerole': 'novello',
  'corini-pallaretta': 'novello',
};

const KNOWN_BARBARESCO_MAPPINGS: Record<string, string> = {
  // Barbaresco village
  'asili': 'barbaresco',
  'martinenga': 'barbaresco',
  'montefico': 'barbaresco',
  'montestefano': 'barbaresco',
  'paje': 'barbaresco',
  'pora': 'barbaresco',
  'rabaja': 'barbaresco',
  'rabaja-bas': 'barbaresco',
  'rio-sordo': 'barbaresco',
  'roncagliette': 'barbaresco',
  'secondine': 'barbaresco',
  'ovello': 'barbaresco',

  // Neive
  'albesani': 'neive',
  'bricco-di-neive': 'neive',
  'gallina': 'neive',
  'basarin': 'neive',

  // Treiso
  'bernardot': 'treiso',
  'bricco-di-treiso': 'treiso',
  'nervo': 'treiso',
  'pajore': 'treiso',
  'rizzi': 'treiso',
  'rombone': 'treiso',

  // San Rocco Seno d'Elvio
  'montersino': 'san-rocco-seno-d-elvio',
};

// Query François RAG API
async function queryFrancois(query: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:8000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'wine-rag-secret-key-2024'
      },
      body: JSON.stringify({
        question: query,
        top_k: 5,
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
    return '';
  }
}

// Use Claude with web search to determine commune for an MGA
async function determineCommune(
  mgaName: string,
  mgaSlug: string,
  appellation: 'Barolo' | 'Barbaresco',
  knownMapping: Record<string, string>
): Promise<string | null> {
  // Check if we already know it
  if (knownMapping[mgaSlug]) {
    return knownMapping[mgaSlug];
  }

  console.log(`   Researching: ${mgaName}...`);

  // Query François first
  const francoisData = await queryFrancois(
    `${mgaName} ${appellation} MGA commune village location`
  );

  // Use Claude with web search to determine the commune
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `You are a wine expert specializing in Piedmont. I need to determine which commune (village) the MGA "${mgaName}" in ${appellation} belongs to.

${appellation === 'Barolo' ?
  'Barolo has 11 communes: La Morra, Serralunga d\'Alba, Barolo (village), Monforte d\'Alba, Castiglione Falletto, Verduno, Novello, Cherasco, Diano d\'Alba, Grinzane Cavour, Roddi' :
  'Barbaresco has 4 communes: Barbaresco (village), Neive, Treiso, San Rocco Seno d\'Elvio'}

François RAG data:
${francoisData}

Based on all available information, which commune does "${mgaName}" belong to?

IMPORTANT: Respond with ONLY the commune name in kebab-case (e.g., "la-morra" or "serralunga-d-alba"). If you cannot determine it with high confidence, respond with "UNKNOWN".`
    }]
  });

  const result = response.content[0];
  if (result.type === 'text') {
    const commune = result.text.trim().toLowerCase();
    if (commune === 'unknown') {
      return null;
    }
    return commune;
  }

  return null;
}

async function createBaroloMapping() {
  console.log('\n🍷 Creating Barolo Commune Mapping');
  console.log('='.repeat(70));

  // Read existing Barolo MGAs
  const baroloData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'piedmont-barolo-mgas.json'), 'utf-8')
  );

  const mapping: Array<{
    mgaName: string;
    mgaSlug: string;
    commune: string;
    communeName: string;
  }> = [];

  let unknown = 0;

  for (const mga of baroloData) {
    const mgaSlug = mga.name.toLowerCase()
      .replace(/'/g, '')
      .replace(/\s+/g, '-')
      .replace(/à/g, 'a')
      .replace(/è/g, 'e')
      .replace(/ì/g, 'i')
      .replace(/ò/g, 'o')
      .replace(/ù/g, 'u');

    const commune = await determineCommune(mga.name, mgaSlug, 'Barolo', KNOWN_BAROLO_MAPPINGS);

    if (commune) {
      mapping.push({
        mgaName: mga.name,
        mgaSlug,
        commune,
        communeName: commune.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      });
      console.log(`   ✓ ${mga.name} → ${commune}`);
    } else {
      unknown++;
      console.log(`   ⚠️  ${mga.name} → UNKNOWN (manual mapping needed)`);
      // Add to mapping anyway with placeholder
      mapping.push({
        mgaName: mga.name,
        mgaSlug,
        commune: 'UNKNOWN',
        communeName: 'UNKNOWN'
      });
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Save mapping
  const outputPath = path.join(process.cwd(), 'data', 'barolo-commune-mapping.json');
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2));

  console.log(`\n✅ Barolo mapping saved: ${outputPath}`);
  console.log(`   Total MGAs: ${mapping.length}`);
  console.log(`   Unknown: ${unknown}`);

  return mapping;
}

async function createBarbarescoMapping() {
  console.log('\n🍷 Creating Barbaresco Commune Mapping');
  console.log('='.repeat(70));

  // Read existing Barbaresco MGAs
  const barbarescoData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'piedmont-barbaresco-mgas.json'), 'utf-8')
  );

  const mapping: Array<{
    mgaName: string;
    mgaSlug: string;
    commune: string;
    communeName: string;
  }> = [];

  let unknown = 0;

  for (const mga of barbarescoData) {
    const mgaSlug = mga.name.toLowerCase()
      .replace(/'/g, '')
      .replace(/\s+/g, '-')
      .replace(/à/g, 'a')
      .replace(/è/g, 'e')
      .replace(/ì/g, 'i')
      .replace(/ò/g, 'o')
      .replace(/ù/g, 'u');

    const commune = await determineCommune(mga.name, mgaSlug, 'Barbaresco', KNOWN_BARBARESCO_MAPPINGS);

    if (commune) {
      mapping.push({
        mgaName: mga.name,
        mgaSlug,
        commune,
        communeName: commune.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      });
      console.log(`   ✓ ${mga.name} → ${commune}`);
    } else {
      unknown++;
      console.log(`   ⚠️  ${mga.name} → UNKNOWN (manual mapping needed)`);
      mapping.push({
        mgaName: mga.name,
        mgaSlug,
        commune: 'UNKNOWN',
        communeName: 'UNKNOWN'
      });
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Save mapping
  const outputPath = path.join(process.cwd(), 'data', 'barbaresco-commune-mapping.json');
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2));

  console.log(`\n✅ Barbaresco mapping saved: ${outputPath}`);
  console.log(`   Total MGAs: ${mapping.length}`);
  console.log(`   Unknown: ${unknown}`);

  return mapping;
}

async function main() {
  console.log('\n🏔️  BAROLO & BARBARESCO COMMUNE MAPPER');
  console.log('='.repeat(70));
  console.log('Creating MGA → Commune mappings for hierarchical restructure');
  console.log('='.repeat(70));

  try {
    const baroloMapping = await createBaroloMapping();
    const barbarescoMapping = await createBarbarescoMapping();

    console.log('\n📊 SUMMARY');
    console.log('='.repeat(70));
    console.log(`Barolo MGAs mapped: ${baroloMapping.length}`);
    console.log(`Barbaresco MGAs mapped: ${barbarescoMapping.length}`);
    console.log('\nNext step: Review mappings and fill in any UNKNOWN entries manually');
    console.log('Then run restructure scripts to reorganize directories');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
