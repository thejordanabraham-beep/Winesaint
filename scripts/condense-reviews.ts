/**
 * CONDENSE REVIEWS
 *
 * Rewrites verbose reviews into punchy 2-3 sentence notes
 */

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000';
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const BATCH_SIZE = 10;
const DELAY_MS = 300;

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

async function condenseReview(originalNotes: string, wineName: string): Promise<string> {
  const prompt = `Rewrite this wine tasting note in 2-3 SHORT sentences.

WINE: ${wineName}

ORIGINAL:
${originalNotes}

REWRITE RULES:
- 2-3 sentences MAXIMUM
- Lead with specific flavors (blackberry, graphite, violet - not "dark fruit")
- Then texture/structure in plain terms
- Then drinking window if relevant
- NO color descriptions
- BANNED PHRASES (do not use): "aromatic profile", "palate architecture", "textural amplitude", "structural tension", "phenolic", "The wine presents", "The wine displays", "reveals", "showcasing"
- Write like a sommelier's quick note, not a formal review

OUTPUT ONLY THE REWRITTEN NOTE, nothing else.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 150,
    temperature: 0.4,
    messages: [{ role: 'user', content: prompt }]
  });

  const text = message.content[0].type === 'text' ? message.content[0].text.trim() : '';

  // Remove any quotes if Claude wrapped it
  return text.replace(/^["']|["']$/g, '');
}

async function main() {
  console.log('\n=== CONDENSE REVIEWS ===\n');

  const token = await getPayloadToken();
  console.log('Authenticated\n');

  let page = 1;
  let hasMore = true;
  let totalProcessed = 0;
  let totalCondensed = 0;

  while (hasMore) {
    const response = await fetch(`${PAYLOAD_URL}/api/reviews?limit=${BATCH_SIZE}&page=${page}&depth=1`, {
      headers: { 'Authorization': `JWT ${token}` }
    });

    const data = await response.json();
    const reviews = data.docs;

    for (const review of reviews) {
      totalProcessed++;

      const originalNotes = review.tastingNotes || '';

      // Skip if already short (under 200 chars is probably fine)
      if (!originalNotes || originalNotes.length < 200) {
        continue;
      }

      // Check for banned phrases that indicate it needs fixing
      const needsFix = /aromatic profile|palate architecture|textural amplitude|structural tension|phenolic|The wine presents|The wine displays/i.test(originalNotes);

      if (!needsFix && originalNotes.length < 350) {
        continue; // Already okay
      }

      const wine = review.wine;
      const wineName = typeof wine === 'object' ? wine.name : 'Unknown';

      try {
        const condensed = await condenseReview(originalNotes, wineName);

        // Update the review
        const updateRes = await fetch(`${PAYLOAD_URL}/api/reviews/${review.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `JWT ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ tastingNotes: condensed })
        });

        if (updateRes.ok) {
          totalCondensed++;
          console.log(`[${totalCondensed}] ${wineName}`);
          console.log(`   ${originalNotes.length} -> ${condensed.length} chars`);
          console.log(`   "${condensed.substring(0, 100)}..."\n`);
        }

        await new Promise(r => setTimeout(r, DELAY_MS));
      } catch (err: any) {
        console.error(`Error on ${wineName}: ${err.message}`);
      }
    }

    hasMore = data.hasNextPage;
    page++;

    // Progress update
    if (page % 5 === 0) {
      console.log(`--- Page ${page}, condensed ${totalCondensed} so far ---\n`);
    }
  }

  console.log(`\nDone! Condensed ${totalCondensed} of ${totalProcessed} reviews.`);
}

main().catch(console.error);
