/**
 * Reference Sources - Waterfall lookup for wine tasting notes
 *
 * Priority: K&L Notes → François RAG (with reranking) → Vivino/CellarTracker (future)
 */

import dotenv from 'dotenv';
import path from 'path';
import { ResultReranker, buildMetadataHints } from './reranker';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const RAG_API_URL = process.env.RAG_API_URL || 'http://localhost:8000';
const RAG_API_KEY = process.env.RAG_API_KEY || '';

// K&L curated tasting notes
export const KL_REFERENCE_NOTES: Record<string, Record<number, string>> = {
  'Opus One': {
    2019: 'Ripe blackberries, dark cherries, dark plums, violets, tobacco, fresh herbs. Juicy, balanced. Black fruits, sage, rosemary, pencil lead, mint, eucalyptus, crushed rocks. Rose petals, dark chocolate, blackcurrant. Satin tannins.',
    2018: 'Blackberries, dark currants, blueberries, florals, dark chocolate, graphite, peppery herbs, loam. Medium-plus to full body, elegant, focused, polished tannins. 80% wild yeast fermentation. Cool blue fruits.',
    2017: 'Late summer cherries, raspberry, bilberry. Balanced, sculpted. Creamy texture, powerful tannic frame. Floral aromatics. Dense, plush, red-toned fruit profile.',
    2016: 'Deep garnet-purple. Blueberries, black cherry jam, cassis, violets, dark chocolate, cedar, cardamom, charcoal. Full-bodied, rich, concentrated, opulent. Firm fine-grained tannins, exotic spices.',
    2015: 'Blackberries, dark currants, exotic spices, florals, graphite, anise, loamy soil. Full body, remarkable structure. Fresh, pure. Wild cherry, plum, creamy oak, sage.',
    2014: 'Savory, tightly wound, intensely aromatic. Firm tannins, impeccably balanced. Tension, power, grace. Graphite, toasty oak, cassis, acacia flowers.',
    2013: 'Concentrated, full of fruit like 2012 but acidity and floral nuance balances richness. 97+ points Parker. Velvety texture.',
    2012: 'Intense fruit, silky texture, plush mouthfeel. Toasty oak, cassis. Pauillac-like. Should drink 25-30 years. Purity of fruit, seamless tannins.',
  },
  'Caymus Special Selection': {
    2019: 'Boysenberry, mulberry pâte de fruit, licorice, açaí berry. Toasty finish, apple wood, mint.',
    2018: 'Rich, opulent. Dark berry fruit, chocolate.',
    2017: 'Concentrated. Excellent structure, long finish.',
    2016: 'Herb, tea to ripe plum and cherry. Long complex aftertaste. Extremely fine velvety tannins.',
    2015: 'Powerful yet balanced. Silky tannins, deep fruit.',
    2014: 'Dense opaque purple. Blackberry, cassis. Full-bodied, ripe tannin, long finish.',
    2013: 'Needs decant. Black cherry, black plum, mocha, tar, sagebrush.',
    2012: 'Violets, graphite, cassis, coffee, lavender. Mocha, blackberry preserves, blueberry, minerality.',
  },
  'Caymus Napa Valley Cabernet Sauvignon': {
    2022: 'Raspberry, boysenberry preserves, mocha, licorice. Chaparral. Near-term hedonism. Ultra-ripe, silken.',
    2020: 'Boysenberry, açaí berry, silky structure, chocolate finish. Textural tannins, soft as velvet.',
    2019: 'Lush, inviting. Ripe fruit, smooth tannins.',
    2018: 'Creamed plum, boysenberry, açaí, milk chocolate, black licorice. Luxurious opulence.',
    2014: 'Supple, fruit-forward. Plum, black cherry, loamy earth, blueberry, vanilla bean oak.',
  },
  'Cain Five': {
    2018: 'Pencil shavings, leather, dark plum. Fine tannins, fresh acidity. Age-worthy.',
    2017: 'Flowers, herbs, tar, earthy. Supple texture, subtle finish.',
    2016: 'Walnuts, chocolate, currants. Satin mouthfeel. Juicy yet restrained.',
    2015: 'Iron grip. Earthy fruit, serious length. Built like a tank.',
    2014: 'Polished tannins, tobacco, loam. Traditional style. Balanced acidity.',
    2013: 'Savory, juicy. Dried herbs, black tea. Medium body with lift.',
    2012: 'Spring Mountain minerality. Herbal, focused. Elegant frame.',
  },
  'Jolie Laide Trousseau': {
    2021: 'Wild strawberry, cranberry, forest floor, white pepper. Bright acidity, mineral tension. Transparent ruby. Light-bodied, silky tannins. Natural wine purity.',
    2020: 'Red cherry, pomegranate, dried herbs, chalky mineral. Vibrant acidity. Early harvest freshness. Delicate extraction, fine tannins.',
    2019: 'Strawberry, rose petals, limestone, subtle spice. Electric acidity, refined structure. Cool-vintage elegance. Transparent, medium-light body.',
    2018: 'Cherry compote, violet, sage, wet stone. Balanced, precise. Silky texture. Herb-inflected finish. Classic Trousseau expression.',
    2017: 'Cranberry, dried rose, iron-rich earth. Focused red fruit. Moderate concentration. Fine-grained tannins, persistent mineral finish.',
    2016: 'Red berry, forest floor, white pepper, subtle oak. Balanced acidity, elegant structure. Medium body, restrained power.',
    2015: 'Wild strawberry, dried herbs, mineral-driven. Concentrated from drought. Refined tannins, long finish. Pure varietal expression.',
  },
};

// Napa Valley vintage characteristics
export const NAPA_VINTAGES: Record<number, string> = {
  2015: 'Fourth drought year. Small berries, concentrated. Early harvest. Dense, ripe wines.',
  2016: 'Return to normalcy. Balanced season. Classic structure with freshness. Textbook Napa.',
  2017: 'October wildfires. Early harvest. Heat spikes September. Ripe, powerful wines.',
  2018: 'Cool spring, warm summer, long hang time. Generous yields. Balanced ripeness. Fine tannins.',
  2019: 'Cool, long season. Later harvest. Bright acidity, lower alcohol. Elegant, fresh. More Bordeaux-like.',
  2020: 'Historic wildfires and smoke. Extremely early harvest. Heat dome August. Polarizing vintage.',
  2021: 'Drought conditions. Small berries, concentrated flavors. Lower yields. Intense wines.',
  2022: 'Cool spring, moderate summer. Extended hang time. Balanced acidity. Classic vintage.',
};

// Producer style profiles
export const PRODUCER_STYLES: Record<string, string> = {
  'Screaming Eagle': 'Cult status. Silky power. Restraint over bombast.',
  'Harlan Estate': 'First growth ambitions. Architectural precision. Mountain fruit gravitas.',
  'Opus One': 'Franco-American diplomacy. Polished. Corporate elegance.',
  'Dominus Estate': 'Moueix\'s Napa chapter. Yountville terroir. Pomerol sensibility.',
  'Scarecrow': 'J.J. Cohn vineyard. Rutherford dust. Old-vine intensity.',
  'Colgin Cellars': 'Perfectionist. Tightly wound. Mountain intensity.',
  'Hundred Acre': 'Unapologetic hedonism. Massive extraction.',
  'Bryant Family': 'Pritchard Hill power. Dense. Structured for decades.',
  'Dalla Valle': 'Maya fame. Oakville elegance. Cabernet Franc complexity.',
  'Shafer Vineyards': 'Hillside Select benchmark. Stags Leap precision.',
  'Dunn Vineyards': 'Howell Mountain fortress. Decades of patience required.',
  'Corison Winery': 'Restraint. Lower alcohol. Ageworthy.',
  'Diamond Creek': 'Three distinct vineyard expressions. Volcanic soils.',
  'Heitz Cellar': 'Martha\'s Vineyard eucalyptus. Classic since 1961.',
  'Spottswoode': 'St. Helena organic pioneer. Feminine elegance.',
  'Caymus Vineyards': 'Crowd-pleaser. Ripe. Oaky. Accessible.',
  'Stag\'s Leap Wine Cellars': '1976 Judgment of Paris winner. Refined.',
  'Far Niente': 'Oakville polish. Cave-aged. Reliable luxury.',
  'Duckhorn Vineyards': 'Merlot heritage but serious Cabernet.',
  'Joseph Phelps Vineyards': 'Insignia pioneer. Multi-vineyard blending.',
  'Quintessa': 'Biodynamic estate. Rutherford single-vineyard.',
  'Chappellet Winery': 'Pritchard Hill original. Steep slopes. Concentrated.',
  'Grgich Hills Estate': 'Paris tasting fame. Balanced style.',
  'Peter Michael Winery': 'Knights Valley precision.',
  'Schramsberg Vineyards': 'Sparkling specialists since 1965.',
  'Jolie Laide': 'Natural wine pioneer. Minimal intervention. Rare varietals. Terroir transparency.',
};

export interface ReferenceResult {
  source: 'kl' | 'rag' | 'none';
  notes: string | null;
  vintageContext: string;
  producerStyle: string;
}

/**
 * Get K&L reference notes for a wine
 */
function getKLNotes(wineName: string, producer: string, vintage: number): string | null {
  // Try exact producer match
  if (KL_REFERENCE_NOTES[producer]?.[vintage]) {
    return KL_REFERENCE_NOTES[producer][vintage];
  }

  // Try wine name match
  if (KL_REFERENCE_NOTES[wineName]?.[vintage]) {
    return KL_REFERENCE_NOTES[wineName][vintage];
  }

  // Try partial matches
  for (const name of Object.keys(KL_REFERENCE_NOTES)) {
    if (wineName.includes(name) || producer.includes(name) || name.includes(producer)) {
      if (KL_REFERENCE_NOTES[name][vintage]) {
        return KL_REFERENCE_NOTES[name][vintage];
      }
    }
  }

  return null;
}

/**
 * Query François RAG for wine/producer context with reranking
 */
export async function queryRAG(
  question: string,
  producer?: string,
  region?: string,
  grapes?: string
): Promise<string | null> {
  try {
    // Use new /search endpoint to get raw results
    const response = await fetch(`${RAG_API_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': RAG_API_KEY,
      },
      body: JSON.stringify({
        question,
        top_k: 15,  // Get more results for reranking
        search_method: 'hybrid',
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const results = data.results || [];

    if (results.length === 0) return null;

    // Apply reranking with metadata hints
    const reranker = new ResultReranker();
    const metadataHints = buildMetadataHints(producer || '', region || '', grapes);

    const rerankedResults = reranker.rerank(question, results, metadataHints);

    // Take top 5 after reranking
    const topResults = rerankedResults.slice(0, 5);

    // Combine into context
    const context = topResults.map(r => r.document).join('\n\n');

    return context;
  } catch (error) {
    console.error('RAG query error:', error);
    return null;
  }
}

/**
 * Get reference notes using waterfall: K&L → RAG
 */
export async function getReferenceNotes(
  wineName: string,
  producer: string,
  vintage: number,
  region: string
): Promise<ReferenceResult> {
  // Get vintage and producer context
  const vintageContext = NAPA_VINTAGES[vintage] || '';
  const producerStyle = PRODUCER_STYLES[producer] || '';

  // Try K&L notes first
  const klNotes = getKLNotes(wineName, producer, vintage);
  if (klNotes) {
    console.log(`   ✓ Found K&L reference notes`);
    return {
      source: 'kl',
      notes: klNotes,
      vintageContext,
      producerStyle,
    };
  }

  // Fall back to RAG query for producer/region context (with reranking)
  console.log(`   Querying RAG for ${producer} context (with reranking)...`);
  const ragContext = await queryRAG(
    `What are the typical characteristics of ${producer} wines from ${region}? Focus on flavor profile and style.`,
    producer,
    region,
    wineName  // Pass wine name as grape hint
  );

  if (ragContext) {
    console.log(`   ✓ Found reranked RAG context`);
    return {
      source: 'rag',
      notes: ragContext,
      vintageContext,
      producerStyle,
    };
  }

  console.log(`   No reference notes found`);
  return {
    source: 'none',
    notes: null,
    vintageContext,
    producerStyle,
  };
}
