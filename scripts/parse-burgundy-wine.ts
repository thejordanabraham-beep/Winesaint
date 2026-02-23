/**
 * Burgundy Wine Name Parser
 *
 * Extracts structured data from Burgundy wine names:
 * - Producer
 * - Appellation/Village
 * - Climat name
 * - Classification (Grand Cru, Premier Cru, Village)
 * - Vintage
 *
 * Example:
 *   "2020 Domaine Leroy Chambolle-Musigny Les Charmes"
 *   → { producer: "Domaine Leroy", village: "Chambolle-Musigny",
 *       climat: "Les Charmes", classification: "premier_cru", vintage: 2020 }
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.join(__dirname, '../.env.local') });

// Sanity client setup
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
});

// Common producer prefixes to strip
const PRODUCER_PREFIXES = [
  'domaine',
  'domaine des',
  'domaine de',
  'domaine du',
  'domaine de la',
  'domaine de l\'',
  'maison',
  'château',
  'chateau',
  'clos',
  'cave',
  'vins',
];

// Known Burgundy villages/appellations
const BURGUNDY_VILLAGES = [
  'gevrey-chambertin',
  'morey-saint-denis',
  'chambolle-musigny',
  'vougeot',
  'vosne-romanée',
  'nuits-saint-georges',
  'aloxe-corton',
  'pernand-vergelesses',
  'savigny-lès-beaune',
  'beaune',
  'pommard',
  'volnay',
  'meursault',
  'puligny-montrachet',
  'chassagne-montrachet',
  'santenay',
  'mercurey',
  'givry',
  'rully',
  'montagny',
  'chablis',
];

// Classification markers
const CLASSIFICATION_MARKERS = {
  grand_cru: ['grand cru', 'grands crus'],
  premier_cru: ['premier cru', 'premiers crus', '1er cru', '1ers crus'],
  village: ['village'],
};

interface ParsedWine {
  vintage?: number;
  producer?: string;
  village?: string;
  climat?: string;
  classification?: 'grand_cru' | 'premier_cru' | 'village' | 'unknown';
  rawInput: string;
  confidence: 'high' | 'medium' | 'low';
  matchedClimatId?: string;
}

/**
 * Normalize text for comparison
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .replace(/\s+/g, ' ');
}

/**
 * Extract vintage from wine name
 */
function extractVintage(text: string): { vintage?: number; remainingText: string } {
  const vintageMatch = text.match(/\b(19\d{2}|20\d{2})\b/);

  if (vintageMatch) {
    return {
      vintage: parseInt(vintageMatch[1]),
      remainingText: text.replace(vintageMatch[0], '').trim(),
    };
  }

  return { remainingText: text };
}

/**
 * Strip producer prefixes
 */
function stripProducerPrefix(text: string): string {
  const normalized = normalize(text);

  for (const prefix of PRODUCER_PREFIXES) {
    const regex = new RegExp(`^${prefix}\\s+`, 'i');
    if (normalized.match(regex)) {
      return text.substring(prefix.length).trim();
    }
  }

  return text;
}

/**
 * Find village/appellation in text
 */
function extractVillage(text: string): { village?: string; remainingText: string } {
  const normalized = normalize(text);

  for (const village of BURGUNDY_VILLAGES) {
    if (normalized.includes(village)) {
      // Find the position and extract
      const index = normalized.indexOf(village);
      const before = text.substring(0, index).trim();
      const after = text.substring(index + village.length).trim();

      return {
        village: village.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-'),
        remainingText: `${before} ${after}`.trim(),
      };
    }
  }

  return { remainingText: text };
}

/**
 * Detect classification level
 */
function detectClassification(text: string): 'grand_cru' | 'premier_cru' | 'village' | 'unknown' {
  const normalized = normalize(text);

  for (const [classification, markers] of Object.entries(CLASSIFICATION_MARKERS)) {
    for (const marker of markers) {
      if (normalized.includes(marker)) {
        return classification as 'grand_cru' | 'premier_cru' | 'village';
      }
    }
  }

  return 'unknown';
}

/**
 * Match against known climats in Sanity
 */
async function findMatchingClimat(
  climatName: string,
  village?: string
): Promise<{ id: string; name: string; classification: string } | null> {
  try {
    // Try exact match first
    let query = `*[_type == "climat" && name match $climatName`;
    if (village) {
      query += ` && appellation->name match $village`;
    }
    query += `][0]{ _id, name, classification }`;

    const result = await client.fetch(query, {
      climatName: `*${climatName}*`,
      village: `*${village}*`,
    });

    if (result) {
      return { id: result._id, name: result.name, classification: result.classification };
    }

    // Try fuzzy match without village
    const fuzzyResult = await client.fetch(
      `*[_type == "climat" && name match $climatName][0]{ _id, name, classification }`,
      { climatName: `*${climatName}*` }
    );

    return fuzzyResult ? {
      id: fuzzyResult._id,
      name: fuzzyResult.name,
      classification: fuzzyResult.classification,
    } : null;
  } catch (error) {
    console.error('Error finding climat:', error);
    return null;
  }
}

/**
 * Main parsing function
 */
export async function parseBurgundyWine(wineName: string): Promise<ParsedWine> {
  let text = wineName;
  const result: ParsedWine = {
    rawInput: wineName,
    confidence: 'low',
  };

  // Extract vintage
  const { vintage, remainingText: afterVintage } = extractVintage(text);
  result.vintage = vintage;
  text = afterVintage;

  // Extract village
  const { village, remainingText: afterVillage } = extractVillage(text);
  result.village = village;
  text = afterVillage;

  // Detect classification
  const classification = detectClassification(text);
  result.classification = classification !== 'unknown' ? classification : undefined;

  // Remove classification markers from text
  for (const markers of Object.values(CLASSIFICATION_MARKERS)) {
    for (const marker of markers) {
      text = text.replace(new RegExp(marker, 'gi'), '').trim();
    }
  }

  // What remains is likely: Producer + Climat
  // Split by village if we found one
  let parts = text.split(/\s+/);

  // First part is likely producer, rest is climat
  if (parts.length >= 2) {
    // Try to find a climat match in the remaining text
    const potentialClimat = parts.slice(1).join(' ').trim();

    if (potentialClimat) {
      const climatMatch = await findMatchingClimat(potentialClimat, village);

      if (climatMatch) {
        result.climat = climatMatch.name;
        result.matchedClimatId = climatMatch.id;
        result.classification = climatMatch.classification as any;
        result.confidence = 'high';

        // Producer is everything before the climat
        result.producer = parts[0];
      } else {
        // No exact match, store as-is
        result.climat = potentialClimat;
        result.producer = parts[0];
        result.confidence = 'medium';
      }
    }
  }

  // Improve confidence based on what we found
  if (result.vintage && result.village && result.climat && result.matchedClimatId) {
    result.confidence = 'high';
  } else if (result.village && result.climat) {
    result.confidence = 'medium';
  }

  return result;
}

/**
 * Batch parse multiple wine names
 */
export async function parseBatch(wineNames: string[]): Promise<ParsedWine[]> {
  const results: ParsedWine[] = [];

  for (const name of wineNames) {
    try {
      const parsed = await parseBurgundyWine(name);
      results.push(parsed);
    } catch (error) {
      console.error(`Error parsing "${name}":`, error);
      results.push({
        rawInput: name,
        confidence: 'low',
      });
    }
  }

  return results;
}

/**
 * Test the parser with sample wines
 */
async function testParser() {
  console.log('🧪 Testing Burgundy Wine Name Parser\n');

  const testCases = [
    '2020 Domaine Leroy Chambolle-Musigny Les Charmes Premier Cru',
    '2019 Domaine de la Romanée-Conti Romanée-Conti Grand Cru',
    '2021 Domaine Leflaive Puligny-Montrachet Les Pucelles 1er Cru',
    '2018 Domaine Armand Rousseau Chambertin Grand Cru',
    '2020 Domaine Ramonet Montrachet Grand Cru',
    '2019 Domaine Georges Roumier Bonnes-Mares Grand Cru',
    '2020 Domaine Hubert Lignier Clos de Vougeot Grand Cru',
  ];

  const results = await parseBatch(testCases);

  results.forEach((result, i) => {
    console.log(`Test ${i + 1}: ${testCases[i]}`);
    console.log(`  Vintage: ${result.vintage || 'N/A'}`);
    console.log(`  Producer: ${result.producer || 'N/A'}`);
    console.log(`  Village: ${result.village || 'N/A'}`);
    console.log(`  Climat: ${result.climat || 'N/A'}`);
    console.log(`  Classification: ${result.classification || 'N/A'}`);
    console.log(`  Matched ID: ${result.matchedClimatId || 'N/A'}`);
    console.log(`  Confidence: ${result.confidence}`);
    console.log('');
  });
}

// Run tests if executed directly
if (require.main === module) {
  testParser()
    .then(() => {
      console.log('✅ Parser test complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Parser test failed:', error);
      process.exit(1);
    });
}
