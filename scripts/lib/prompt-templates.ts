/**
 * Prompt Templates for Wine Review Generation
 *
 * 5 distinct templates to ensure variety:
 * 1. Academic - Technical sommelier notes
 * 2. Comparative - Relates to benchmark wines
 * 3. Sensory-focused - Pure tasting descriptors
 * 4. Contextual - Vintage and terroir emphasis
 * 5. Collector - Cellaring and investment focus
 */

export interface WineContext {
  name: string;
  producer: string;
  vintage: number;
  region: string;
  grapes: string;
  priceUsd: number;
  criticAvg: number;
  vivinoScore: number;
  referenceNotes: string | null;
  vintageContext: string;
  producerStyle: string;
  flavorPalette: {
    primaryFruits: string[];
    secondary: string[];
    tertiary: string[];
    structure: string[];
  };
}

export interface ReviewOutput {
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

// Template 1: Academic/Technical
const ACADEMIC_TEMPLATE = (ctx: WineContext, keywords: string) => `You are writing academic wine notes. Be concise and technical.

WINE: ${ctx.producer} ${ctx.name} ${ctx.vintage}
REGION: ${ctx.region}
GRAPES: ${ctx.grapes}
PRICE: $${ctx.priceUsd}

${ctx.referenceNotes ? `REFERENCE DESCRIPTORS (use as vocabulary guide, don't copy verbatim):\n${ctx.referenceNotes}\n` : ''}
${ctx.vintageContext ? `VINTAGE: ${ctx.vintageContext}\n` : ''}
${ctx.producerStyle ? `PRODUCER STYLE: ${ctx.producerStyle}\n` : ''}

FLAVOR VOCABULARY TO USE:
${keywords}

RULES:
- Maximum 60 words for full_review
- No flowery language, no superlatives like "stunning" or "magnificent"
- Use standard tasting format: appearance, nose, palate, finish
- Be specific: "black cherry" not "dark fruit"
- Academic tone: factual, measured, professional
- CRITICAL: Use the EXACT final_score shown below (${ctx.criticAvg}). Do not adjust it.

Return JSON only:
{
  "scores": { "final_score": ${ctx.criticAvg}, "score_justification": "" },
  "review": {
    "short_summary": "",
    "full_review": "",
    "flavor_profile": [],
    "drink_this_if": "",
    "food_pairings": []
  }
}`;

// Template 2: Comparative
const COMPARATIVE_TEMPLATE = (ctx: WineContext, keywords: string) => `You are comparing this wine to regional benchmarks. Brief and direct.

WINE: ${ctx.producer} ${ctx.name} ${ctx.vintage}
REGION: ${ctx.region}
GRAPES: ${ctx.grapes}

${ctx.referenceNotes ? `NOTES:\n${ctx.referenceNotes}\n` : ''}
${ctx.producerStyle ? `STYLE: ${ctx.producerStyle}\n` : ''}

VOCABULARY:
${keywords}

RULES:
- 50-70 words for full_review
- Reference how this compares to the producer's typical style
- Mention one strength and one limitation if any
- No marketing language
- Specific descriptors only
- CRITICAL: Use the EXACT final_score shown below (${ctx.criticAvg}). Do not adjust it.

Return JSON:
{
  "scores": { "final_score": ${ctx.criticAvg}, "score_justification": "" },
  "review": {
    "short_summary": "",
    "full_review": "",
    "flavor_profile": [],
    "drink_this_if": "",
    "food_pairings": []
  }
}`;

// Template 3: Sensory-focused
const SENSORY_TEMPLATE = (ctx: WineContext, keywords: string) => `Pure sensory assessment. No context, just what's in the glass.

WINE: ${ctx.producer} ${ctx.name} ${ctx.vintage}

${ctx.referenceNotes ? `DESCRIPTORS:\n${ctx.referenceNotes}\n` : ''}

VOCABULARY:
${keywords}

FORMAT:
- Color and viscosity in 5 words
- Nose in 15 words
- Palate in 25 words
- Finish in 10 words

Total maximum: 55 words
CRITICAL: Use the EXACT final_score shown below (${ctx.criticAvg}). Do not adjust it.

Return JSON:
{
  "scores": { "final_score": ${ctx.criticAvg}, "score_justification": "" },
  "review": {
    "short_summary": "",
    "full_review": "",
    "flavor_profile": [],
    "drink_this_if": "",
    "food_pairings": []
  }
}`;

// Template 4: Contextual (Vintage/Terroir)
const CONTEXTUAL_TEMPLATE = (ctx: WineContext, keywords: string) => `Focus on how vintage and terroir shape this wine.

WINE: ${ctx.producer} ${ctx.name} ${ctx.vintage}
REGION: ${ctx.region}

VINTAGE CHARACTER: ${ctx.vintageContext || 'Standard vintage'}
PRODUCER APPROACH: ${ctx.producerStyle || 'Traditional'}

${ctx.referenceNotes ? `NOTES:\n${ctx.referenceNotes}\n` : ''}

VOCABULARY:
${keywords}

RULES:
- 50-65 words
- How does vintage show in the wine?
- What terroir characteristics emerge?
- Factual, not poetic
- CRITICAL: Use the EXACT final_score shown below (${ctx.criticAvg}). Do not adjust it.

Return JSON:
{
  "scores": { "final_score": ${ctx.criticAvg}, "score_justification": "" },
  "review": {
    "short_summary": "",
    "full_review": "",
    "flavor_profile": [],
    "drink_this_if": "",
    "food_pairings": []
  }
}`;

// Template 5: Collector/Cellar
const COLLECTOR_TEMPLATE = (ctx: WineContext, keywords: string) => `Assessment for collectors. Focus on aging potential and value.

WINE: ${ctx.producer} ${ctx.name} ${ctx.vintage}
PRICE: $${ctx.priceUsd}
REGION: ${ctx.region}

${ctx.vintageContext ? `VINTAGE: ${ctx.vintageContext}\n` : ''}
${ctx.referenceNotes ? `NOTES:\n${ctx.referenceNotes}\n` : ''}

VOCABULARY:
${keywords}

RULES:
- 50-65 words
- Current drinking window
- Aging trajectory estimate (years)
- Value assessment relative to price
- No hyperbole
- CRITICAL: Use the EXACT final_score shown below (${ctx.criticAvg}). Do not adjust it.

Return JSON:
{
  "scores": { "final_score": ${ctx.criticAvg}, "score_justification": "" },
  "review": {
    "short_summary": "",
    "full_review": "",
    "flavor_profile": [],
    "drink_this_if": "",
    "food_pairings": []
  }
}`;

// Template selector
const TEMPLATES = [
  { name: 'academic', fn: ACADEMIC_TEMPLATE },
  { name: 'comparative', fn: COMPARATIVE_TEMPLATE },
  { name: 'sensory', fn: SENSORY_TEMPLATE },
  { name: 'contextual', fn: CONTEXTUAL_TEMPLATE },
  { name: 'collector', fn: COLLECTOR_TEMPLATE },
];

/**
 * Get a random template
 */
export function getRandomTemplate(): { name: string; fn: (ctx: WineContext, keywords: string) => string } {
  const index = Math.floor(Math.random() * TEMPLATES.length);
  return TEMPLATES[index];
}

/**
 * Get a specific template by name
 */
export function getTemplate(name: string): ((ctx: WineContext, keywords: string) => string) | null {
  const template = TEMPLATES.find(t => t.name === name);
  return template?.fn || null;
}

/**
 * Build the two-pass keyword extraction prompt
 */
export function buildKeywordPrompt(ctx: WineContext): string {
  const grapeType = ctx.grapes.toLowerCase();
  const isNapaCab = ctx.region.toLowerCase().includes('napa') &&
    (grapeType.includes('cabernet') || grapeType.includes('bordeaux'));

  // Default descriptors for Napa Cabernet if no reference
  const defaultDescriptors = isNapaCab
    ? 'cassis, black cherry, cedar, tobacco, graphite, firm tannins, full-bodied'
    : `${ctx.flavorPalette.primaryFruits.join(', ')}, ${ctx.flavorPalette.secondary.slice(0, 2).join(', ')}, ${ctx.flavorPalette.structure.join(', ')}`;

  return `Select wine descriptors for: ${ctx.producer} ${ctx.name} ${ctx.vintage}
Region: ${ctx.region}
Grapes: ${ctx.grapes}

${ctx.referenceNotes ? `Reference notes to draw from:\n${ctx.referenceNotes}\n` : ''}

Vocabulary options:
- Fruits: ${ctx.flavorPalette.primaryFruits.join(', ')}
- Secondary: ${ctx.flavorPalette.secondary.join(', ')}
${ctx.flavorPalette.tertiary.length ? `- Tertiary: ${ctx.flavorPalette.tertiary.join(', ')}` : ''}
- Structure: ${ctx.flavorPalette.structure.join(', ')}

${!ctx.referenceNotes ? `If no specific notes available, use these typical descriptors: ${defaultDescriptors}` : ''}

IMPORTANT: You MUST output 8-12 comma-separated descriptors. No explanations, no refusals.
Example output: cassis, black cherry, cedar, vanilla, firm tannins, full-bodied, graphite, long finish

Output only the descriptors:`;
}
