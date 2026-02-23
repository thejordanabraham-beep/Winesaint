/**
 * Few-Shot Examples - Real Critic Review Samples
 *
 * Brief, professional tasting notes from established critics.
 * Used to demonstrate the desired concise, academic style.
 */

export interface ExampleReview {
  wine: string;
  vintage: number;
  score: number;
  review: string;
  source: string;
}

// Examples demonstrating concise, academic style
export const FEW_SHOT_EXAMPLES: ExampleReview[] = [
  // Example 1: Concise, specific, no fluff
  {
    wine: 'Ridge Monte Bello',
    vintage: 2019,
    score: 97,
    review: 'Deep ruby. Black cherry, cassis, graphite, dried herbs on the nose. Palate shows concentrated dark fruit, firm tannins, integrated oak. Minerality persists through long finish. Needs 5+ years. Drink 2029-2050.',
    source: 'Academic style',
  },

  // Example 2: Brief sensory-focused
  {
    wine: 'Shafer Hillside Select',
    vintage: 2018,
    score: 96,
    review: 'Opaque purple. Blackberry, espresso, tobacco leaf. Full-bodied, velvety texture, ripe tannins. Oak well-integrated. Lengthy mineral finish. Classic Stags Leap expression with typical density.',
    source: 'Academic style',
  },

  // Example 3: Contextual, vintage-aware
  {
    wine: 'Dunn Howell Mountain',
    vintage: 2017,
    score: 94,
    review: 'Shows vintage heat in riper fruit profile than typical. Dark plum, sage, iron. Firm structure, chewy tannins indicate long aging potential. Less austere than usual for this producer. Drink 2027-2045.',
    source: 'Academic style',
  },

  // Example 4: Value-conscious collector note
  {
    wine: 'Corison Kronos Vineyard',
    vintage: 2019,
    score: 95,
    review: 'Red and black cherry, violet, bay leaf. Medium-full body, silky tannins. Restrained oak allows fruit purity. Elegant rather than powerful. One of the best values in serious Napa Cabernet. Drink 2025-2040.',
    source: 'Academic style',
  },

  // Example 5: Critical but fair
  {
    wine: 'Caymus Napa Valley',
    vintage: 2020,
    score: 88,
    review: 'Boysenberry, vanilla, mocha. Soft, plush texture. Immediately accessible. Oak is prominent. Lacks complexity of higher-end bottlings but delivers crowd-pleasing richness. Drink now-2028.',
    source: 'Academic style',
  },

  // Example 6: White wine example
  {
    wine: 'Roulot Meursault',
    vintage: 2020,
    score: 93,
    review: 'Pale gold. Citrus oil, hazelnut, chalk. Medium-full body with bright acidity. Saline mineral finish. Textbook Meursault with Roulot precision. Drink 2024-2032.',
    source: 'Academic style',
  },
];

/**
 * Get 2-3 random examples for few-shot prompting
 */
export function getRandomExamples(count: number = 2): ExampleReview[] {
  const shuffled = [...FEW_SHOT_EXAMPLES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, FEW_SHOT_EXAMPLES.length));
}

/**
 * Format examples for inclusion in prompt
 */
export function formatExamplesForPrompt(examples: ExampleReview[]): string {
  return examples.map((ex, i) => `
Example ${i + 1}: ${ex.wine} ${ex.vintage} (${ex.score} pts)
"${ex.review}"
`).join('\n');
}

/**
 * Build a system prompt with few-shot examples
 */
export function buildSystemPromptWithExamples(): string {
  const examples = getRandomExamples(2);

  return `You are a wine critic writing concise, academic tasting notes.

STYLE GUIDELINES:
- Maximum 60 words for a full review
- No flowery language or superlatives
- Specific descriptors (e.g., "black cherry" not "dark fruit")
- Include: appearance, nose, palate, finish, drinking window
- Professional, measured tone

EXAMPLE NOTES TO EMULATE:
${formatExamplesForPrompt(examples)}

Write in this same concise, technical style.`;
}
