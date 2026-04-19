/**
 * SURGICAL FIX - Remove repetitive phrases only
 * No rewriting, just find/replace
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000';

// Surgical replacements - order matters
const FIXES: [RegExp, string][] = [
  // 1. Remove color opener sentences entirely
  [/^The wine (displays|presents) a [^.]+\.\s*/i, ''],
  [/^This wine (displays|presents) a [^.]+\.\s*/i, ''],

  // 2. "The aromatic profile reveals X" → "X"
  [/The aromatic profile (reveals|displays|shows|exhibits|presents)\s*/gi, ''],

  // 3. "palate architecture" → "palate"
  [/palate architecture/gi, 'palate'],

  // 4. "textural amplitude" → "texture"
  [/textural amplitude/gi, 'texture'],

  // 5. "structural tension" → "tension"
  [/structural tension/gi, 'tension'],

  // 6. "phenolic maturity" → "ripeness"
  [/phenolic maturity/gi, 'ripeness'],

  // 7. "phenolic development" → "tannin development"
  [/phenolic development/gi, 'tannin development'],

  // 8. "phenolic extraction" → "extraction"
  [/phenolic extraction/gi, 'extraction'],

  // 9. "phenolic grip" → "grip"
  [/phenolic grip/gi, 'grip'],

  // 10. "phenolic structure" → "tannin structure"
  [/phenolic structure/gi, 'tannin structure'],

  // 11. "structural framework" → "structure"
  [/structural framework/gi, 'structure'],

  // 12. "structural integrity" → "structure"
  [/structural integrity/gi, 'structure'],

  // 13. Clean up double spaces
  [/  +/g, ' '],

  // 14. Capitalize first letter after cleanup
  [/^\s*([a-z])/i, (_, c) => c.toUpperCase()],
];

function fix(text: string): string {
  let result = text;
  for (const [pattern, replacement] of FIXES) {
    result = result.replace(pattern, replacement);
  }
  return result.trim();
}

async function getToken(): Promise<string> {
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.PAYLOAD_ADMIN_EMAIL,
      password: process.env.PAYLOAD_ADMIN_PASSWORD,
    }),
  });
  const data = await res.json();
  return data.token;
}

async function main() {
  console.log('\n=== SURGICAL FIX ===\n');

  const token = await getToken();
  console.log('Authenticated\n');

  let page = 1;
  let hasMore = true;
  let fixed = 0;
  let skipped = 0;

  while (hasMore) {
    const res = await fetch(`${PAYLOAD_URL}/api/reviews?limit=50&page=${page}`, {
      headers: { 'Authorization': `JWT ${token}` }
    });
    const data = await res.json();

    for (const review of data.docs) {
      const original = review.tastingNotes || '';
      const edited = fix(original);

      if (edited !== original) {
        const updateRes = await fetch(`${PAYLOAD_URL}/api/reviews/${review.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `JWT ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tastingNotes: edited }),
        });

        if (updateRes.ok) {
          fixed++;
          console.log(`✓ ${review.id}`);
        }
      } else {
        skipped++;
      }
    }

    hasMore = data.hasNextPage;
    page++;

    if (page % 5 === 0) {
      console.log(`  ... page ${page}, fixed ${fixed}, skipped ${skipped}`);
    }
  }

  console.log(`\nDone. Fixed: ${fixed}, Already clean: ${skipped}`);
}

main().catch(console.error);
