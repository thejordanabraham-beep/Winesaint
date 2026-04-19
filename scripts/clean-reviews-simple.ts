/**
 * CLEAN REVIEWS - Simple find/replace
 * No AI, just removes repetitive phrases
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000';

// Simple replacements - pattern -> replacement
const REPLACEMENTS: [RegExp, string][] = [
  // Remove color descriptions entirely
  [/The wine presents a [^.]+\.\s*/gi, ''],
  [/The wine displays a [^.]+\.\s*/gi, ''],
  [/This wine displays a [^.]+\.\s*/gi, ''],

  // "The aromatic profile reveals X" -> "X"
  [/The aromatic profile (reveals|displays|shows|exhibits|presents)\s*/gi, ''],

  // "The palate architecture" -> "The palate"
  [/palate architecture/gi, 'palate'],

  // "textural amplitude" -> "texture"
  [/textural amplitude/gi, 'texture'],

  // "structural tension" -> "tension"
  [/structural tension/gi, 'tension'],

  // "structural framework" -> "structure"
  [/structural framework/gi, 'structure'],

  // "phenolic maturity" -> "ripeness"
  [/phenolic maturity/gi, 'ripeness'],

  // "phenolic development" -> "tannin development"
  [/phenolic development/gi, 'tannin development'],

  // "phenolic extraction" -> "extraction"
  [/phenolic extraction/gi, 'extraction'],

  // "aromatic complexity" -> "complexity"
  [/aromatic complexity/gi, 'complexity'],

  // "mineral tension" -> "minerality"
  [/mineral tension/gi, 'minerality'],

  // "textural refinement" -> "refinement"
  [/textural refinement/gi, 'refinement'],

  // "remarkable precision" -> "precision"
  [/remarkable precision/gi, 'precision'],

  // "fruit concentration" -> "concentrated fruit"
  [/fruit concentration/gi, 'concentrated fruit'],

  // "aromatic profile" -> "nose" or just remove
  [/The aromatic profile/gi, 'The nose'],
  [/aromatic profile/gi, 'aromatics'],

  // "structural integrity" -> "structure"
  [/structural integrity/gi, 'structure'],

  // Remove "remarkable" when overused
  [/remarkable /gi, ''],

  // "exceptional" -> often not needed
  [/exceptional /gi, ''],

  // Clean up double spaces
  [/  +/g, ' '],

  // Clean up space before period
  [/ \./g, '.'],

  // Capitalize after cleanup
  [/\. ([a-z])/g, (_, c) => `. ${c.toUpperCase()}`],
];

function cleanText(text: string): string {
  let result = text;
  for (const [pattern, replacement] of REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
  // Trim and ensure first letter is capitalized
  result = result.trim();
  if (result.length > 0) {
    result = result[0].toUpperCase() + result.slice(1);
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
  const data = await response.json();
  return data.token;
}

async function main() {
  console.log('\n=== CLEAN REVIEWS (simple find/replace) ===\n');

  const token = await getPayloadToken();
  console.log('Authenticated\n');

  let page = 1;
  let hasMore = true;
  let totalProcessed = 0;
  let totalCleaned = 0;

  while (hasMore) {
    const response = await fetch(`${PAYLOAD_URL}/api/reviews?limit=50&page=${page}&depth=1`, {
      headers: { 'Authorization': `JWT ${token}` }
    });

    const data = await response.json();
    const reviews = data.docs;

    for (const review of reviews) {
      totalProcessed++;

      const originalNotes = review.tastingNotes || '';
      const originalSummary = review.shortSummary || '';

      const cleanedNotes = cleanText(originalNotes);
      const cleanedSummary = cleanText(originalSummary);

      // Only update if something changed
      if (cleanedNotes !== originalNotes || cleanedSummary !== originalSummary) {
        const updateRes = await fetch(`${PAYLOAD_URL}/api/reviews/${review.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `JWT ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tastingNotes: cleanedNotes,
            shortSummary: cleanedSummary,
          })
        });

        if (updateRes.ok) {
          totalCleaned++;
          if (totalCleaned % 50 === 0) {
            console.log(`Cleaned ${totalCleaned} reviews...`);
          }
        }
      }
    }

    hasMore = data.hasNextPage;
    page++;
  }

  console.log(`\nDone! Cleaned ${totalCleaned} of ${totalProcessed} reviews.`);
}

main().catch(console.error);
