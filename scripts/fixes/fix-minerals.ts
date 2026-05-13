import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAYLOAD_URL = 'http://localhost:3000';

async function main() {
  const loginRes = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.PAYLOAD_ADMIN_EMAIL, password: process.env.PAYLOAD_ADMIN_PASSWORD }),
  });
  const { token } = await loginRes.json();

  let page = 1;
  let fixed = 0;
  let errors = 0;

  while (true) {
    const res = await fetch(`${PAYLOAD_URL}/api/reviews?where[flavorProfile.flavor][equals]=minerals&limit=100&page=${page}&depth=0`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) break;

    for (const review of data.docs) {
      const fp = review.flavorProfile || [];
      const updated = fp.map((f: any) => ({
        ...f,
        flavor: f.flavor === 'minerals' ? 'mineral' : f.flavor,
      }));

      const patchRes = await fetch(`${PAYLOAD_URL}/api/reviews/${review.id}`, {
        method: 'PATCH',
        headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ flavorProfile: updated }),
      });

      if (patchRes.ok) {
        fixed++;
      } else {
        console.log(`✗ Review ${review.id} failed`);
        errors++;
      }
    }

    process.stdout.write(`  Fixed ${fixed}/${data.totalDocs}...\r`);

    if (!data.hasNextPage) break;
    // Don't increment page — patched items drop from results, shifting the list
  }

  console.log(`\nDone. Fixed: ${fixed}, Errors: ${errors}`);
}

main().catch(console.error);
