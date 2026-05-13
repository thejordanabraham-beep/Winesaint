/**
 * Fix overused words - surgical replacement
 */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000';

// Rotate through synonyms for variety
const counters: Record<string, number> = {};

function rotate(key: string, options: string[]): string {
  counters[key] = (counters[key] || 0) + 1;
  return options[counters[key] % options.length];
}

const FIXES: [RegExp, () => string][] = [
  // "demonstrates" -> shows, displays, exhibits, presents
  [/demonstrates /gi, () => rotate('demo', ['shows ', 'displays ', 'exhibits ', 'presents '])],

  // "reveals" -> shows, offers, presents, delivers
  [/reveals /gi, () => rotate('reveal', ['shows ', 'offers ', 'presents ', 'delivers '])],

  // "considerable" -> notable, real, good, solid, significant
  [/considerable /gi, () => rotate('consider', ['notable ', 'real ', 'good ', 'solid ', 'significant '])],

  // "remarkable" -> notable, impressive, striking, fine
  [/remarkable /gi, () => rotate('remark', ['notable ', 'impressive ', 'striking ', 'fine '])],

  // "exceptional" -> excellent, outstanding, impressive, superb
  [/exceptional /gi, () => rotate('except', ['excellent ', 'outstanding ', 'impressive ', 'superb '])],
];

function fix(text: string): string {
  let result = text;
  for (const [pattern, replacer] of FIXES) {
    result = result.replace(pattern, replacer);
  }
  // Clean double spaces
  result = result.replace(/  +/g, ' ');
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
  console.log('Fixing overused words...\n');

  const token = await getToken();

  let page = 1;
  let hasMore = true;
  let fixed = 0;

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
          process.stdout.write(`\r${fixed} fixed`);
        }
      }
    }

    hasMore = data.hasNextPage;
    page++;
  }

  console.log(`\n\nDone. Fixed ${fixed} reviews.`);
}

main().catch(console.error);
