/**
 * FIX REPETITIVE PHRASES IN REVIEWS
 *
 * Applies find/replace transformations to eliminate robotic, formulaic language
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000';

// Phrase replacements - maps overused phrases to varied alternatives
const PHRASE_REPLACEMENTS: Array<{ pattern: RegExp; replacements: string[] }> = [
  // "The aromatic profile reveals/displays/shows" -> varied alternatives
  {
    pattern: /The aromatic profile (reveals|displays|shows|exhibits|presents)/gi,
    replacements: [
      'Aromas of',
      'The nose offers',
      'Scents of',
      'On the nose,',
      'The bouquet presents',
      'Fragrant notes of',
    ]
  },
  // "palate architecture" -> simpler terms
  {
    pattern: /palate architecture/gi,
    replacements: [
      'palate',
      'mid-palate',
      'palate structure',
      'mouthfeel',
    ]
  },
  // "textural amplitude" -> plain English
  {
    pattern: /textural amplitude/gi,
    replacements: [
      'texture',
      'weight',
      'body',
      'richness',
      'density',
    ]
  },
  // "structural tension" -> varied
  {
    pattern: /structural tension/gi,
    replacements: [
      'tension',
      'grip',
      'backbone',
      'tautness',
      'energy',
    ]
  },
  // "structural framework" -> simpler
  {
    pattern: /structural framework/gi,
    replacements: [
      'structure',
      'frame',
      'backbone',
      'tannins',
    ]
  },
  // "phenolic maturity" -> accessible
  {
    pattern: /phenolic maturity/gi,
    replacements: [
      'ripeness',
      'tannin ripeness',
      'fruit maturity',
    ]
  },
  // "phenolic development" -> simpler
  {
    pattern: /phenolic development/gi,
    replacements: [
      'tannin development',
      'tannin evolution',
      'development',
    ]
  },
  // "phenolic extraction" -> simpler
  {
    pattern: /phenolic extraction/gi,
    replacements: [
      'extraction',
      'tannin extraction',
      'grip',
    ]
  },
  // "The wine presents" at start -> varied
  {
    pattern: /^The wine presents/i,
    replacements: [
      'This shows',
      'Presenting',
      'Here we find',
      'This offers',
    ]
  },
  // "The wine displays" -> varied
  {
    pattern: /The wine displays/gi,
    replacements: [
      'This displays',
      'Showing',
      'This exhibits',
      'This reveals',
    ]
  },
  // "aromatic complexity" -> varied
  {
    pattern: /aromatic complexity/gi,
    replacements: [
      'complexity on the nose',
      'layered aromatics',
      'aromatic depth',
      'fragrant layers',
    ]
  },
  // "The palate reveals" -> varied
  {
    pattern: /The palate reveals/gi,
    replacements: [
      'On the palate,',
      'The taste reveals',
      'Flavors of',
      'The palate shows',
    ]
  },
  // "mineral tension" -> varied
  {
    pattern: /mineral tension/gi,
    replacements: [
      'minerality',
      'mineral edge',
      'stony tension',
      'mineral drive',
    ]
  },
  // "textural refinement" -> simpler
  {
    pattern: /textural refinement/gi,
    replacements: [
      'refinement',
      'polish',
      'finesse',
      'silkiness',
    ]
  },
  // "remarkable precision" -> varied
  {
    pattern: /remarkable precision/gi,
    replacements: [
      'precision',
      'focus',
      'clarity',
      'definition',
    ]
  },
  // "fruit concentration" -> varied
  {
    pattern: /fruit concentration/gi,
    replacements: [
      'concentrated fruit',
      'fruit intensity',
      'fruit depth',
      'rich fruit',
    ]
  },
];

// Track replacements for variety
const replacementCounters: Map<string, number> = new Map();

function getNextReplacement(replacements: string[]): string {
  const key = replacements.join('|');
  const currentIndex = replacementCounters.get(key) || 0;
  const replacement = replacements[currentIndex % replacements.length];
  replacementCounters.set(key, currentIndex + 1);
  return replacement;
}

function fixText(text: string): string {
  let result = text;

  for (const { pattern, replacements } of PHRASE_REPLACEMENTS) {
    result = result.replace(pattern, () => getNextReplacement(replacements));
  }

  return result;
}

async function getPayloadToken(): Promise<string> {
  const response = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.PAYLOAD_ADMIN_EMAIL || 'admin@winesaint.com',
      password: process.env.PAYLOAD_ADMIN_PASSWORD || 'admin123',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to authenticate with Payload');
  }

  const data = await response.json();
  return data.token;
}

async function main() {
  console.log('\n=== FIX REPETITIVE PHRASES ===\n');

  const token = await getPayloadToken();
  console.log('Authenticated with Payload\n');

  // Fetch all reviews
  let page = 1;
  let hasMore = true;
  let totalFixed = 0;
  let totalReviews = 0;

  while (hasMore) {
    const response = await fetch(`${PAYLOAD_URL}/api/reviews?limit=50&page=${page}`, {
      headers: { 'Authorization': `JWT ${token}` }
    });

    const data = await response.json();
    const reviews = data.docs;

    for (const review of reviews) {
      totalReviews++;

      const originalNotes = review.tastingNotes || '';
      const originalSummary = review.shortSummary || '';

      const fixedNotes = fixText(originalNotes);
      const fixedSummary = fixText(originalSummary);

      // Check if anything changed
      if (fixedNotes !== originalNotes || fixedSummary !== originalSummary) {
        // Update the review
        const updateRes = await fetch(`${PAYLOAD_URL}/api/reviews/${review.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `JWT ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tastingNotes: fixedNotes,
            shortSummary: fixedSummary,
          })
        });

        if (updateRes.ok) {
          totalFixed++;
          process.stdout.write(`\rFixed ${totalFixed} reviews...`);
        } else {
          console.error(`\nFailed to update review ${review.id}`);
        }
      }
    }

    hasMore = data.hasNextPage;
    page++;
  }

  console.log(`\n\nComplete! Fixed ${totalFixed} of ${totalReviews} reviews.`);
}

main().catch(console.error);
