/**
 * AI Wine Review Generator
 *
 * This script generates wine reviews using Claude API based on wine data
 * from the Sanity CMS database. Reviews are informed by real K&L Wine Merchants
 * tasting notes to ensure unique, authentic-sounding content.
 *
 * Usage: npx tsx scripts/generate-reviews.ts [--limit N] [--dry-run] [--regenerate]
 *
 * Options:
 *   --limit N      Process only N wines (default: 10)
 *   --dry-run      Preview without writing to Sanity
 *   --regenerate   Regenerate existing reviews (updates wines that already have reviews)
 *
 * Environment variables required:
 * - ANTHROPIC_API_KEY: Your Claude API key
 * - SANITY_PROJECT_ID: Your Sanity project ID
 * - SANITY_DATASET: Your Sanity dataset (default: production)
 * - SANITY_API_TOKEN: Sanity API token with write access
 */

import dotenv from 'dotenv';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@sanity/client';

// K&L Wine reference notes - curated tasting notes for unique review generation
// These are used as inspiration for writing original reviews
const KL_REFERENCE_NOTES: Record<string, Record<number, string>> = {
  'Opus One': {
    2019: 'Beautifully expressive nose with ripe blackberries, dark cherries, luscious dark plums, fresh violets, tobacco, fresh herbs. Juicy, balanced, succulent. Grace, balance and nuance with depth of ripe black fruits, sage, rosemary, pencil lead, mint leaf, eucalyptus, crushed rocks. Intensely perfumed with rose petals and violets, rich yet expansive, dark chocolate, cherries, fragrant blackcurrant. Satin-like tannins with real drive and persistency.',
    2018: 'Nothing short of fantastic. Fresh crushed blackberries, dark currants, hints of blueberries, fresh florals, dark chocolate, graphite, peppery herbs, touch of loam. Gorgeous medium-plus to full body with wonderful elegance and finesse, incredible balance, focus and structure, beautifully polished tannins. First vintage with 80% wild yeast fermentation. Power and concentration with lovely vein of cool blue fruits.',
    2017: 'Absolutely magical wine from this challenging vintage. Late summer cherries, raspberry and bilberry fruits with juicy character that confirms balance and sculpted elegance even in a hot year. Beautiful grip, creamy texture with strikingly powerful tannic frame. Floral aromatics bloom as wine opens. Dense, full-throttle beauty with plush fruit and soft, silky contours, distinctly red-toned fruit profile.',
    2016: 'Deep garnet-purple, bursts with ripe blueberries, black cherry jam, crème de cassis, hints of violets, dark chocolate, cedar chest, cardamom, touch of charcoal. Full-bodied, rich and concentrated with layer upon layer of opulent stewed black fruit, amazing tension, firm ripe fine-grained tannins, long finish with exotic spices. Brilliant vintage for Napa Valley.',
    2015: 'Monumental showing. Seductive aromas of fresh ripe blackberries and dark currants woven with exotic spices and florals, nuances of graphite, anise, loamy soil. Gorgeous full body with remarkable structure, balance and concentration. Freshness and purity gives immediate appeal while promising brilliant future. Compact and reticent, unfurls with complexity - wild cherry, plum, creamy oak, sage.',
    2014: 'Savory, tightly wound and intensely aromatic, needs time to unwind. Tannins firm but impeccably balanced. A wine of tension, power and grace. Inky purple with striking bouquet of graphite, toasty oak, crème de cassis and acacia flowers. Not an obvious Opus but may challenge or surpass other vintages.',
    2013: 'Absolutely stunning release, one of most impressive young wines from this estate. Just as concentrated and full of fruit as 2012 but acidity and floral nuance balances out richness. Robert Parker awarded 97+ points, calling it a beauty with velvety texture - one of their great achievements over 37 years.',
    2012: 'Stunning release. Intense fruit with silky texture and plush mouthfeel. Classy, complex, suave and savory with toasty oak and crème de cassis. Pauillac lookalike, brilliant world-class wine that should drink well for 25-30 years. Glorious purity of fruit with seamless tannins and wonderful balance.',
    2010: 'Obvious in its immediate accessibility. Dark fruit, chocolate and licorice with complexity of black olive and tobacco on bouquet.',
    2009: 'Impeccable. Brings together silkiness of 2007 with power and darkness of 2008. Cool vintage reflected in complex notes of black olive and tobacco, supple and polished with more savory edge. Cool temperatures during bloom and maturation.',
    2008: 'Extreme weather conditions led to smallest per-acre yield to date. Rose petals, cassis and black cherry with marzipan and sandalwood. Satin texture with smooth round tannins, bright acidity supporting juicy elegant mouthfeel, long finish with clove and dark chocolate.',
    2007: 'Terrific black currant fruit, licorice, incense, subtle smoke, opulent even voluptuous mouthfeel, dazzling purity and texture. Not fat but perfumed and energetic. Substantial ripe tannins on firm long finish, built for long evolution. Aromas of cassis, nutmeg, raspberries, cola, fresh oats, dark chocolate, forest floor.',
    2006: 'Lowest average maximum temperature in twenty-five growing seasons. Fresh cut roses, licorice, dark chocolate, blackberry pie, smoked bacon, sassafras.',
    2005: 'Elegance and finesse with bright acidity and long finish.',
    2004: 'Balanced structure with dark berry fruit and earthy undertones.',
    2003: 'Blackberry, plum, hazelnut, graphite, olive oil, cocoa, dried cherries. Soft entry with rich flannel-like tannins. Vibrant blackberry and black cherry of Oakville with Bordeaux elegance.',
    2002: 'Dense plum/purple hue, striking bouquet of graphite, toasty oak, crème de cassis, acacia flowers. Full-bodied opulent with silky tannins. Tastes like blend of great Napa Cabernet married to Bordeaux Pauillac. Top wine from early century. Dried strawberry, vanilla bean, mocha, cassis, black cherry, plum, espresso.',
    2001: 'Black currant, black cherry liqueur, plum, fresh vanilla, graham cracker, black peppercorn. Supple creamy entry followed by intense flavors of ripe black cherry, cassis, dark chocolate.',
    2000: 'Soft and plush texture. Sandalwood, leather, caramel, hint of anise. Blackberry and herbs, harmonious with sweet tannins and long intense finish.',
  },
  'Caymus Special Selection': {
    2019: 'Flashy, boysenberry and mulberry pâte de fruit notes, licorice snap and açaí berry notes. High-gloss toasty finish with fruit pushing through, apple wood and mint notes add range.',
    2018: 'Rich and opulent with layers of dark berry fruit and chocolate.',
    2017: 'Concentrated with excellent structure and long finish.',
    2016: 'Classic Caymus, stretches flavors from herb and tea to ripe plum and cherry. Long complex aftertaste with enough tannin to carry. Distinguished by extremely fine velvety tannins.',
    2015: 'Powerful yet balanced with silky tannins and deep fruit.',
    2014: 'Dense opaque purple, blackberry and cassis fruit, full-bodied with ripe tannin and long finish. Very Caymus in immediate accessibility but plenty of staying power and depth.',
    2013: 'Initially subdued, needs one hour decant. Intense seductive aromatics of black cherry and black plum with mocha, tar and sagebrush.',
    2012: 'Dense and intense, absolute joy to savor. Violets, graphite, crème de cassis, coffee grounds, lavender. Intense bouquet with wonderful terroir. Mocha, blackberry preserves, graphite, blueberry and wonderful minerality.',
    2011: 'Refined elegance with bright acidity.',
    2010: 'Excellent depth and concentration with polished tannins.',
    2009: 'Smooth and accessible with ripe fruit character.',
    2008: 'Structured with notable aging potential.',
    2007: 'Exceptional vintage with depth and complexity.',
    2006: 'Beautifully proportioned, rich in dark berry, dusty cedar and loamy earth, black licorice, herb, olive and tobacco. All pieces fit together nicely with long tapered aftertaste.',
    2005: 'Big ripe Napa Cabernet at 15.2% natural alcohol. Gorgeous fig, plum, blackberry, cassis with no real oak showing through.',
    2004: 'Well-structured with integrated tannins.',
    2003: 'Approachable style with soft fruit and gentle finish.',
    2002: 'Outstanding concentration and length.',
    2001: 'Elegant and age-worthy with fine tannins.',
    2000: 'Rich and full with excellent balance.',
  },
  'Caymus Napa Valley Cabernet Sauvignon': {
    2022: 'Creamy forward style with warmed raspberry and boysenberry preserves infused with mocha and melted licorice. Late flicker of chaparral. Made for near-term hedonism. Truly remarkable in classic ultra-ripe silken Caymus style.',
    2020: 'Crowd-pleaser, boysenberry and açaí berry fruit streaming through with silky persistent structure and chocolate-framed finish. Caressing feel with subtle savory echo. Abundant textural tannins yet soft as velvet.',
    2019: 'Lush and inviting with ripe fruit and smooth tannins.',
    2018: 'Very lush and caressing, flashy display of creamed plum, boysenberry and açaí berry liberally laced with milk chocolate and melted black licorice. No wine like Caymus - luxurious opulence on unrivaled scale.',
    2017: 'Approachable and fruit-forward.',
    2016: 'Rich and balanced with excellent structure.',
    2015: 'Smooth and silky with integrated oak.',
    2014: 'Supple and fruit-forward, designed for broad appeal. Easygoing plum, black cherry, loamy earth, blueberry with vanilla bean oak. Just enough tannins for pedigree.',
    2013: 'Dense and satisfying with dark fruit.',
    2012: 'Exceptional concentration and depth.',
    2011: 'Lighter style with bright acidity.',
    2010: 'Well-balanced with moderate tannins.',
    2009: 'Accessible with soft fruit character.',
    2008: 'Structured for short-term aging.',
    2007: 'Excellent vintage with good depth.',
    2006: 'Smooth and approachable.',
    2005: 'Rich with balanced acidity.',
    2004: 'Medium-bodied with fine tannins.',
    2003: 'Soft and ready to drink.',
    2002: 'Good concentration and balance.',
    2001: 'Elegant and refined.',
    2000: 'Mature and drinking well.',
  },
  'Cain Five': {
    2018: 'Pencil shavings, leather, dark plum. Fine tannins, fresh acidity. Age-worthy.',
    2017: 'Flowers, herbs, tar on earthy background. Supple texture, subtle finish.',
    2016: 'Walnuts, chocolate, currants. Satin mouthfeel. Juicy yet restrained.',
    2015: 'Iron grip. Earthy fruit, serious length. Built like a tank.',
    2014: 'Polished tannins, tobacco, loam. Traditional style. Balanced acidity.',
    2013: 'Savory, juicy. Dried herbs, black tea. Medium body with lift.',
    2012: 'Spring Mountain minerality. Herbal, focused. Elegant frame.',
    2011: 'Light touch. Bright cherry, soft tannins. Drink now.',
    2010: 'Dense, brooding. Cassis, smoke. Firm structure. Cellar candidate.',
  },
  // BURGUNDY WHITE PRODUCERS
  'Dauvissat Chablis': {
    2022: 'Brisk acidity, vanilla note, peach, green plum, honey, floral, mineral. Round, mouthwatering finish.',
    2021: 'Taut and racy, mineral backbone. Green apple, wet stone character.',
    2020: 'Green apple, white flowers, wet stones, oyster shell, struck match. Medium-full, taut, racy, intensely mineral finish. Reference point for appellation.',
    2019: 'Citrus, mineral, saline. Impeccable precision and focus.',
    2018: 'Ripe but balanced. Orchard fruit with chalky minerality.',
    2017: 'Classic tension. Lemon, wet stone, iodine character.',
    2016: 'Crystalline purity. Cooked stone finish. Fine Chablis character.',
    2015: 'Generous fruit with underlying minerality. Balanced acidity.',
  },
  'Dauvissat Chablis 1er Cru La Forest': {
    2022: 'Anise, mint, demure fruit. Wine of texture, detail and drive. Powerful, expansive, stony phenolic drag. Prodigiously long finish.',
    2021: 'Tense and mineral. Limestone character. Needs time.',
    2020: 'Orchard fruit, orange oil, pear, oyster shell, fresh bread, smoke. Medium-full, deep, multidimensional. Liquorice, stones, succulence without sucrosity.',
    2019: 'Striking purity. Lemon, chalk, saline finish.',
    2018: 'Richer style. White peach, hazelnut, mineral core.',
    2017: 'Coiled tension. Citrus, wet stone, iodine. Needs patience.',
    2016: 'Powerful and concentrated. Lovely lift. Distinctive mineral flavors.',
    2015: 'Generous orchard fruit. Fine acidity. Long finish.',
  },
  'Bonneau du Martray Corton-Charlemagne': {
    2022: 'Citrus peel, white flowers, spice. Racy acidity, mineral drive.',
    2021: 'Precise and mineral. Limestone purity. Built for aging.',
    2020: 'Crisp orchard fruit, fresh bread, orange oil, nutmeg. Light reduction from sun on stones. Lemony, iodine, crystalline, cooked stone finish.',
    2019: 'Layered complexity. Pear, citrus oil, praline. Chalky structure.',
    2018: 'Orchard fruit, fresh bread, orange oil, nutmeg. Fine Corton-Charlemagne character.',
    2017: 'Pear, citrus oil, toasted sesame, warm bread, oyster shell, white flowers. Full-bodied, layered, racy spine of acidity. Finest in over a decade.',
    2016: 'Pale yellow-green, citrus peel, menthol, lavender, white pepper. Extremely tight, bracing grapefruit pith, lemon, crushed stone.',
    2015: 'Rich and powerful. Lemon, white peach, stone. Dense, broad with serious structure.',
  },
  'Sauzet Puligny-Montrachet': {
    2022: 'Pure orchard fruits, flinty notes. Great introduction to Sauzet style.',
    2021: 'Precise and mineral. Citrus, white flower, chalk.',
    2020: 'Pear, white flowers, orange oil. Medium-full, rich, fleshy, racy acids, long saline finish. Smoky, cool, floral, pear, apple, anise.',
    2019: 'Honeyed pears, white flowers, peach, buttered toast, praline. Satiny, precise, charming.',
    2018: 'Pleasantly ripe apple, floral. Refreshing, well done.',
    2017: 'Orchard fruit purity. Fine minerality. Classic Puligny.',
    2016: 'Tense and mineral. Citrus, chalk, saline finish.',
    2015: 'Generous but focused. White fruit, floral lift.',
  },
  'Roulot Meursault': {
    2022: 'Classic rich Meursault - ripe apple, hazelnut, white flowers, spice. Creamy, lush, no heaviness. Marvel of elegance and equilibrium.',
    2021: 'Precise and mineral. Less opulent but equally compelling.',
    2020: 'Floral notes emerge, tension builds, ripe lemons, orange blossom character.',
    2019: 'Hazelnut, citrus, white flowers. Creamy texture with bright acidity.',
    2018: 'Citrus oil, crisp green orchard fruit, pastry cream, almond paste, clear honey.',
    2017: 'Pungent green fruit, honeysuckle, lime juice. Racy, pure, detailed. Bright tangy acidity.',
    2016: 'Focused, transparent, chalky stony essence. Lime, apple, floral depth. Lingering citrus mineral finish.',
    2015: 'Generous fruit with Roulot precision. Hazelnut, citrus lift.',
  },
  'Roulot Meursault Meix Chavaux': {
    2022: 'Intense, iodine, oyster shell, subtle wood, considerable concentration. Premier cru quality from village site.',
    2021: 'Taut and mineral. Less opulent but precise.',
    2020: 'Floral notes, tension, ripe lemons, orange blossom. Upper Meursault character.',
    2019: 'Iodine, oyster shell, citrus oil. Underlying concentration.',
    2018: 'Citrus oil, green orchard fruit, pastry cream. Almond paste, honey.',
    2017: 'Pretty pale colour, lightest nose, floral notes emerge. Tension builds.',
    2016: 'Could be mistaken for Premier Cru. Intensity and precision.',
    2015: 'Rich yet focused. Iodine, mineral, hazelnut notes.',
  },
  'Comtes Lafon Meursault': {
    2022: 'Honeyed pears, white flowers, peach, buttered toast. Satiny texture.',
    2021: 'Precise and mineral. Classic Lafon purity.',
    2020: 'Stone fruit, pear, honeycomb, almonds, spices. Medium-full, satiny, enveloping, layered, saline finish.',
    2019: 'Honeyed pears, white flowers, peach, buttered toast, praline. Satiny, precise, charming, lively acids.',
    2018: 'Ripe apple, hazelnut, butter. Firm texture, lemony acidity.',
    2017: 'Classic Meursault opulence with Lafon precision.',
    2016: 'Rich orchard fruit. Fine acidity. Long mineral finish.',
    2015: 'Generous and textured. Hazelnut, white fruit, spice.',
  },
  'Comtes Lafon Meursault 1er Cru Goutte d\'Or': {
    2022: 'Abundant clay influence. Pear, white peach, hazelnut, honeycomb.',
    2021: 'Ample and glossy. Sappy energy despite richness.',
    2020: 'Pear, white peach, hazelnut, honeycomb. Ample, deep, glossy-textured with nice sappy energy.',
    2019: 'Rich and layered. Honeycomb, stone fruit, hazelnut.',
    2018: 'Opulent yet balanced. White peach, almond, spice.',
    2017: 'Classic Goutte d\'Or richness with fine acidity.',
    2016: 'Ample fruit. Glossy texture. Long finish.',
    2015: 'Generous and deep. Honeycomb, orchard fruit character.',
  },
  // BURGUNDY RED - MÉO-CAMUZET
  'Méo-Camuzet Vosne-Romanée': {
    2022: 'Elegant and perfumed. Red fruit, violet, fine spices.',
    2021: 'Subtle and layered. Lighter vintage but pure.',
    2020: 'Creaminess, red cherry, subtle florality, hint of smoke. Complex, elegant, sinuous. Finish lasts and lasts.',
    2019: 'Lively fruit, fine Vosne spices. Generous shape.',
    2018: 'Lively fruit, fine Vosne spices. Oak integrated but needs years. Aux Communes and Barreaux parcels.',
    2017: 'Perfumed and vibrant. Black raspberries, plums, dark chocolate, fresh nutmeg, vanillin oak. Pure, full-bodied, transparent.',
    2016: 'Refined and vibrant. Black raspberries, plums, dark chocolate, soil, vanillin oak, nutmeg. Pure, full-bodied, moderate tannins, long tangy finish.',
    2015: 'Immensely impressive. Ripe dark berries, candied peel, raw cocoa, Asian spices.',
  },
  'Méo-Camuzet Vosne-Romanée 1er Cru Aux Brûlées': {
    2022: 'Intense and structured. Dark fruit, spice, mineral.',
    2021: 'Elegant despite lighter vintage. Pure red fruit.',
    2020: 'Layered complexity. Dark berries, spice, smoke.',
    2019: 'Powerful and refined. Dark fruit with Asian spice notes.',
    2018: 'Ripe dark berries, candied peel, raw cocoa, sweet Asian spices. Immensely impressive.',
    2017: 'Structured and complex. Black fruit, chocolate, spice.',
    2016: 'Deep and concentrated. Fine tannins, long finish.',
    2015: 'Bursting with ripe dark berries, candied peel, raw cocoa, Asian spices.',
  },
};

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Score conversion table: 100-point scale to 10-point scale
const SCORE_CONVERSION: Record<number, [number, number]> = {
  100: [9.8, 10.0],
  99: [9.5, 9.7],
  98: [9.3, 9.5],
  97: [9.1, 9.3],
  96: [8.5, 9.0],
  95: [8.1, 8.5],
  94: [8.0, 8.0],
  93: [7.7, 7.9],
  92: [7.5, 7.6],
  91: [7.3, 7.4],
  90: [7.1, 7.2],
  89: [6.9, 7.0],
  88: [6.6, 6.8],
  87: [6.4, 6.5],
  86: [6.2, 6.3],
};

// Convert Vivino 5-point scale to 100-point scale
function vivinoTo100(vivinoScore: number): number {
  // Vivino 4.5 ≈ 95 points, 4.0 ≈ 90, 3.5 ≈ 85, etc.
  return Math.round(vivinoScore * 20 + 10);
}

// Calculate weighted final score
function calculateFinalScore(criticAvg: number, vivinoScore: number): number {
  const vivinoAs100 = vivinoTo100(vivinoScore);
  const weightedScore = (criticAvg * 0.9) + (vivinoAs100 * 0.1);
  return Math.round(weightedScore);
}

// Get price range from USD price
function getPriceRange(priceUsd: number): string {
  if (priceUsd < 20) return 'budget';
  if (priceUsd < 50) return 'mid-range';
  if (priceUsd < 100) return 'premium';
  return 'luxury';
}

// Get reference notes for a wine (local K&L notes)
function getLocalReferenceNotes(wineName: string, vintage: number): string | null {
  // Try exact match first
  if (KL_REFERENCE_NOTES[wineName]?.[vintage]) {
    return KL_REFERENCE_NOTES[wineName][vintage];
  }
  // Try partial matches
  for (const name of Object.keys(KL_REFERENCE_NOTES)) {
    if (wineName.includes(name) || name.includes(wineName)) {
      if (KL_REFERENCE_NOTES[name][vintage]) {
        return KL_REFERENCE_NOTES[name][vintage];
      }
    }
  }
  return null;
}

// Search wine.com for tasting notes
async function searchWineComNotes(wineName: string, vintage: number, producer: string): Promise<string | null> {
  try {
    const searchQuery = encodeURIComponent(`${producer} ${wineName} ${vintage}`);
    const searchUrl = `https://www.wine.com/search/${searchQuery}/1`;

    console.log(`   Searching wine.com for: ${producer} ${wineName} ${vintage}`);

    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      console.log(`   wine.com returned status ${response.status}`);
      return null;
    }

    const html = await response.text();

    // Extract product URLs from search results
    const productUrlMatch = html.match(/href="(\/product\/[^"]+)"/);
    if (!productUrlMatch) {
      console.log(`   No products found on wine.com`);
      return null;
    }

    // Fetch the product page
    const productUrl = `https://www.wine.com${productUrlMatch[1]}`;
    console.log(`   Found product: ${productUrl}`);

    const productResponse = await fetch(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!productResponse.ok) {
      return null;
    }

    const productHtml = await productResponse.text();

    // Extract tasting notes - look for common patterns
    const patterns = [
      /class="[^"]*viewMoreModule_text[^"]*"[^>]*>([^<]+(?:<[^>]+>[^<]*)*)<\/div>/i,
      /class="[^"]*pipDescription[^"]*"[^>]*>([^<]+(?:<[^>]+>[^<]*)*)<\/div>/i,
      /"description"\s*:\s*"([^"]+)"/i,
      /Tasting Notes?:?\s*<\/[^>]+>\s*<[^>]+>([^<]+)/i,
      /Critical Acclaim.*?<p[^>]*>([^<]+)<\/p>/is,
    ];

    for (const pattern of patterns) {
      const match = productHtml.match(pattern);
      if (match && match[1] && match[1].length > 50) {
        // Clean up the extracted text
        const notes = match[1]
          .replace(/<[^>]+>/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/\s+/g, ' ')
          .trim();

        if (notes.length > 50) {
          console.log(`   ✓ Found wine.com tasting notes (${notes.length} chars)`);
          return notes;
        }
      }
    }

    console.log(`   No tasting notes found on product page`);
    return null;
  } catch (error) {
    console.log(`   wine.com search error: ${error}`);
    return null;
  }
}

// Get reference notes - try local first, then wine.com
async function getReferenceNotes(wineName: string, vintage: number, producer: string): Promise<string | null> {
  // Try local K&L notes first
  const localNotes = getLocalReferenceNotes(wineName, vintage);
  if (localNotes) {
    console.log(`   ✓ Found local K&L reference notes`);
    return localNotes;
  }

  // Fall back to wine.com search
  return await searchWineComNotes(wineName, vintage, producer);
}

// Napa Valley vintage characteristics
const NAPA_VINTAGES: Record<number, string> = {
  2015: 'Fourth year of drought. Small berries, concentrated flavors. Early harvest. Warm vintage with dense, ripe wines. Lower yields meant intensity.',
  2016: 'Return to normalcy after drought. Balanced growing season. Classic structure with freshness. Elegant wines with good acidity. Textbook Napa.',
  2017: 'Devastating October wildfires. Early harvest saved most fruit. Heat spikes in September. Ripe, powerful wines. Smoke taint concerns for late-harvest.',
  2018: 'Cool spring, warm summer, long hang time. Generous yields. Balanced ripeness. Approachable young with fine tannins. Excellent quality across the board.',
  2019: 'Cool, long growing season. Later harvest. Bright acidity, lower alcohol. Elegant, fresh wines. More Bordeaux-like than typical Napa.',
  2020: 'Historic wildfires and smoke. Extremely early harvest. Heat dome in August. Polarizing vintage - some stellar, some smoke-affected. Check producer carefully.',
};

// Producer style archetypes
const PRODUCER_STYLES: Record<string, string> = {
  'Screaming Eagle': 'Cult status. Silky power. Restraint over bombast. Waitlist-only exclusivity.',
  'Harlan Estate': 'First growth ambitions. Architectural precision. Mountain fruit gravitas.',
  'Opus One': 'Franco-American diplomacy in a bottle. Polished. Corporate elegance.',
  'Dominus Estate': 'Christian Moueix\'s Napa chapter. Yountville terroir. Pomerol sensibility.',
  'Scarecrow': 'J.J. Cohn vineyard. Rutherford dust. Hollywood pedigree meets old-vine intensity.',
  'Colgin Cellars': 'Perfectionist. Tightly wound. Mountain intensity from multiple sites.',
  'Hundred Acre': 'Unapologetic hedonism. Massive extraction. Love it or hate it.',
  'Bryant Family': 'Pritchard Hill power. Dense. Structured for decades.',
  'Dalla Valle': 'Maya fame. Oakville elegance. Cabernet Franc adds complexity.',
  'Shafer Vineyards': 'Hillside Select benchmark. Stags Leap District precision. Reliable excellence.',
  'Dunn Vineyards': 'Howell Mountain fortress wines. Decades of patience required. Old school.',
  'Corison Winery': 'Cathy Corison\'s restraint. Anti-Parker. Lower alcohol. Ageworthy.',
  'Diamond Creek': 'Three distinct vineyard expressions. Volcanic soils. Historic.',
  'Heitz Cellar': 'Martha\'s Vineyard eucalyptus signature. Classic house since 1961.',
  'Spottswoode': 'St. Helena organic pioneer. Feminine elegance. Consistent brilliance.',
  'Caymus Vineyards': 'Crowd-pleaser. Ripe. Oaky. Accessible. Chuck Wagner\'s empire.',
  'Stag\'s Leap Wine Cellars': '1976 Judgment of Paris winner. Refined Stags Leap expression.',
  'Far Niente': 'Oakville polish. Cave-aged. Reliable luxury.',
  'Duckhorn Vineyards': 'Merlot heritage but serious Cabernet. Three Palms fame.',
  'Joseph Phelps Vineyards': 'Insignia pioneer. Multi-vineyard blending mastery.',
  'Quintessa': 'Biodynamic estate. Rutherford single-vineyard. Agustin Huneeus vision.',
  'Chappellet Winery': 'Pritchard Hill original. Steep slopes. Concentrated.',
  'Grgich Hills Estate': 'Mike Grgich\'s legacy. Paris tasting fame. Balanced style.',
  'Peter Michael Winery': 'Knights Valley precision. Sir Peter\'s perfectionism.',
  'Schramsberg Vineyards': 'Sparkling specialists. Method Champenoise since 1965.',
};

// Random style variations to avoid repetition
const STYLE_VARIATIONS = [
  'Write as if recommending to a collector building a cellar.',
  'Write as if describing to a sommelier at a Michelin restaurant.',
  'Write as if explaining to someone who knows Bordeaux but not Napa.',
  'Write with the confidence of someone who has tasted every vintage.',
  'Write as if this wine surprised you - positively or negatively.',
  'Write focusing on texture and mouthfeel over fruit descriptors.',
  'Write emphasizing the vineyard and terroir expression.',
  'Write comparing implicitly to the producer\'s house style.',
];

// Varied vocabulary pools
const STRUCTURE_WORDS = ['architecture', 'framework', 'backbone', 'scaffolding', 'chassis', 'skeleton', 'infrastructure'];
const TEXTURE_WORDS = ['silky', 'velvety', 'satiny', 'plush', 'supple', 'polished', 'sleek', 'glossy', 'creamy'];
const INTENSITY_WORDS = ['powerful', 'muscular', 'intense', 'concentrated', 'dense', 'profound', 'weighty', 'substantial'];
const ELEGANCE_WORDS = ['refined', 'graceful', 'poised', 'elegant', 'nuanced', 'subtle', 'restrained', 'sophisticated'];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Get review length based on score - higher scores get longer reviews
function getReviewLengthInstruction(score: number): { wordCount: string; style: string } {
  if (score >= 97) {
    return { wordCount: '100-130 words', style: 'thorough, with evocative detail befitting an exceptional wine' };
  } else if (score >= 94) {
    return { wordCount: '70-90 words', style: 'balanced, highlighting key strengths' };
  } else if (score >= 90) {
    return { wordCount: '50-70 words', style: 'concise, focused on essentials' };
  } else {
    return { wordCount: '40-60 words', style: 'brief and direct' };
  }
}

// Build the prompt for Claude
async function buildPrompt(wine: WineData): Promise<string> {
  const referenceNotes = await getReferenceNotes(wine.name, wine.vintage, wine.producer);
  const finalScore = calculateFinalScore(wine.criticAvg, wine.vivinoScore);
  const lengthVariation = getReviewLengthInstruction(finalScore);

  const vintageContext = NAPA_VINTAGES[wine.vintage] || 'Standard Napa vintage.';
  const producerStyle = PRODUCER_STYLES[wine.producer] || '';
  const styleVariation = getRandomElement(STYLE_VARIATIONS);

  const referenceSection = referenceNotes
    ? `\n## Reference Notes (reword creatively, don't copy):\n${referenceNotes}\n`
    : '';

  const producerSection = producerStyle
    ? `\n## Producer Context:\n${producerStyle}\n`
    : '';

  return `You are a wine critic with a distinct voice. Each review must feel unique and personal.

## CRITICAL: AVOID THESE OVERUSED PHRASES
Never use: "showcasing", "masterpiece", "ability to craft", "balancing power with finesse",
"structured Cabernet", "polished Napa Cab", "serious backbone", "mountain fruit",
"classic Napa power", "built for the cellar", "delivers", "offers"

## YOUR VOICE FOR THIS REVIEW
${styleVariation}

## Vocabulary to consider (pick 1-2, not all):
- Structure: ${getRandomElement(STRUCTURE_WORDS)}, ${getRandomElement(STRUCTURE_WORDS)}
- Texture: ${getRandomElement(TEXTURE_WORDS)}, ${getRandomElement(TEXTURE_WORDS)}
- Intensity: ${getRandomElement(INTENSITY_WORDS)}, ${getRandomElement(INTENSITY_WORDS)}
- Elegance: ${getRandomElement(ELEGANCE_WORDS)}, ${getRandomElement(ELEGANCE_WORDS)}

## Wine Information
- Name: ${wine.name}
- Producer: ${wine.producer}
- Vintage: ${wine.vintage}
- Region: ${wine.region}
- Grapes: ${wine.grapes}
- Price: $${wine.priceUsd}
${producerSection}
## Vintage Context (${wine.vintage}):
${vintageContext}
${referenceSection}
## Output Format
Return ONLY valid JSON:

{
  "scores": {
    "final_score": ${finalScore},
    "score_justification": ""
  },
  "review": {
    "short_summary": "",
    "full_review": "",
    "flavor_profile": [],
    "drink_this_if": "",
    "food_pairings": []
  }
}

## Guidelines
- "short_summary": UNIQUE hook, max 15 words. What makes THIS wine different? Avoid generic praise.
- "full_review": ${lengthVariation.wordCount}. Reference the vintage character. Mention specific aromas (be creative - not just "dark fruit"). Describe texture distinctly. Note how it reflects the producer's style.
- "flavor_profile": 4-6 SPECIFIC descriptors. Not "blackberry" alone but "crushed blackberry with graphite" or "sun-warmed plum skin".
- "drink_this_if": Creative scenario. Not "you want a great Cabernet" but specific like "you're grilling wagyu ribeye and want something that won't back down"
- "food_pairings": 3-4 specific dishes, not generic "grilled meats"
- "score_justification": Reference vintage and producer context

Output valid JSON only. No markdown, no backticks.`;
}

interface WineData {
  _id: string;
  name: string;
  producer: string;
  vintage: number;
  region: string;
  country: string;
  grapes: string;
  priceUsd: number;
  criticAvg: number;
  vivinoScore: number;
  flavorMentions: string;
}

interface SanityWine {
  _id: string;
  name: string;
  vintage: number;
  producer: { name: string } | null;
  region: { name: string; country: string } | null;
  grapeVarieties: string[] | null;
  priceUsd: number | null;
  criticAvg: number | null;
  vivinoScore: number | null;
  flavorMentions: string[] | null;
  hasAiReview: boolean | null;
}

interface AiReviewOutput {
  scores: {
    final_score: number;
    score_justification: string;
  };
  review: {
    short_summary: string;
    full_review: string;
    flavor_profile: string[];
    drink_this_if: string;
    food_pairings: string[];
  };
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const limitIndex = args.indexOf('--limit');
  const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : 10;
  const dryRun = args.includes('--dry-run');
  const regenerate = args.includes('--regenerate');

  console.log('🍷 Wine Review Generator (Research-Based)');
  console.log('==========================================');
  console.log(`Mode: ${dryRun ? 'DRY RUN (no writes)' : 'LIVE'}`);
  console.log(`Regenerate existing: ${regenerate ? 'YES' : 'NO'}`);
  console.log(`Limit: ${limit} wines\n`);

  // Validate environment variables
  const requiredEnvVars = ['ANTHROPIC_API_KEY', 'SANITY_PROJECT_ID'];
  const missingVars = requiredEnvVars.filter(v => !process.env[v]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(v => console.error(`   - ${v}`));
    console.error('\nSet these in your .env.local file or environment.');
    process.exit(1);
  }

  if (!dryRun && !process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN is required for live mode.');
    console.error('   Use --dry-run to test without writing to Sanity.');
    process.exit(1);
  }

  // Initialize clients
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const sanityClient = createClient({
    projectId: process.env.SANITY_PROJECT_ID!,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
  });

  // Fetch wines based on mode
  console.log(regenerate
    ? '📚 Fetching wines for regeneration...'
    : '📚 Fetching wines without reviews...');

  const queryFilter = regenerate
    ? `*[_type == "wine" && defined(criticAvg) && defined(vivinoScore)]`
    : `*[_type == "wine" && (hasAiReview != true) && defined(criticAvg) && defined(vivinoScore)]`;

  const query = `${queryFilter}[0...${limit}]{
    _id,
    name,
    vintage,
    producer->{name},
    region->{name, country},
    grapeVarieties,
    priceUsd,
    criticAvg,
    vivinoScore,
    flavorMentions,
    hasAiReview
  }`;

  const wines: SanityWine[] = await sanityClient.fetch(query);

  if (wines.length === 0) {
    console.log('✅ No wines found that need reviews.');
    console.log('   (Wines must have criticAvg and vivinoScore defined)');
    return;
  }

  console.log(`Found ${wines.length} wines to process.`);
  if (regenerate) {
    console.log('⚠️  Regenerate mode: Existing reviews will be REPLACED with new unique content.');
  }
  console.log();

  // Process each wine
  let successCount = 0;
  let errorCount = 0;

  for (const wine of wines) {
    console.log(`\n🍷 Processing: ${wine.name} ${wine.vintage}`);

    try {
      // Prepare wine data
      const wineData: WineData = {
        _id: wine._id,
        name: wine.name,
        producer: wine.producer?.name || 'Unknown Producer',
        vintage: wine.vintage,
        region: wine.region?.name || 'Unknown Region',
        country: wine.region?.country || 'Unknown',
        grapes: wine.grapeVarieties?.join(', ') || 'Unknown',
        priceUsd: wine.priceUsd || 50,
        criticAvg: wine.criticAvg || 85,
        vivinoScore: wine.vivinoScore || 4.0,
        flavorMentions: wine.flavorMentions?.join(', ') || 'fruit, oak, tannins',
      };

      console.log(`   Critic Avg: ${wineData.criticAvg}, Vivino: ${wineData.vivinoScore}`);

      // Generate review with Claude
      console.log('   Generating review with Claude...');

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: await buildPrompt(wineData),
          },
        ],
      });

      // Extract text response
      const responseText = message.content[0].type === 'text'
        ? message.content[0].text
        : '';

      // Parse JSON response
      let reviewData: AiReviewOutput;
      try {
        reviewData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('   ❌ Failed to parse JSON response');
        console.error('   Response:', responseText.substring(0, 200));
        errorCount++;
        continue;
      }

      console.log(`   Score: ${reviewData.scores.final_score}/100`);
      console.log(`   Summary: ${reviewData.review.short_summary}`);

      if (dryRun) {
        console.log('   [DRY RUN] Would create review in Sanity');
        console.log('   Full review preview:');
        console.log(`   "${reviewData.review.full_review.substring(0, 150)}..."`);
        successCount++;
        continue;
      }

      // If regenerating, delete existing reviews for this wine first
      if (regenerate) {
        const existingReviews = await sanityClient.fetch(
          `*[_type == "review" && wine._ref == $wineId]._id`,
          { wineId: wine._id }
        );
        if (existingReviews.length > 0) {
          console.log(`   Deleting ${existingReviews.length} existing review(s)...`);
          for (const reviewId of existingReviews) {
            await sanityClient.delete(reviewId);
          }
        }
      }

      // Create review document in Sanity
      const reviewDoc = {
        _type: 'review',
        wine: {
          _type: 'reference',
          _ref: wine._id,
        },
        score: reviewData.scores.final_score,
        shortSummary: reviewData.review.short_summary,
        tastingNotes: reviewData.review.full_review,
        flavorProfile: reviewData.review.flavor_profile,
        drinkThisIf: reviewData.review.drink_this_if,
        foodPairings: reviewData.review.food_pairings,
        reviewerName: 'Vitaly Vochenko',
        reviewDate: new Date().toISOString().split('T')[0],
        isAiGenerated: true,
        scoreJustification: reviewData.scores.score_justification,
      };

      const createdReview = await sanityClient.create(reviewDoc);
      console.log(`   ✅ Created review: ${createdReview._id}`);

      // Update wine to mark it as having an AI review
      await sanityClient.patch(wine._id).set({ hasAiReview: true }).commit();
      console.log('   ✅ Updated wine hasAiReview flag');

      successCount++;

      // Rate limiting: wait 1 second between API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`   ❌ Error processing wine:`, error);
      errorCount++;
    }
  }

  // Summary
  console.log('\n========================');
  console.log('📊 Summary');
  console.log('========================');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📝 Total processed: ${wines.length}`);
}

main().catch(console.error);
