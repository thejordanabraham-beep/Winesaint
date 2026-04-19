/**
 * Fix remaining "aromatic profile" instances
 */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000';

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
  console.log('Fixing remaining "aromatic profile" instances...\n');

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

      if (original.toLowerCase().includes('aromatic profile')) {
        // Replace variations
        let edited = original
          .replace(/The aromatic profile/gi, 'The nose')
          .replace(/an aromatic profile/gi, 'a nose')
          .replace(/aromatic profile/gi, 'aromatics');

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
