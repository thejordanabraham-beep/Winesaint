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

  const allWines: any[] = [];
  let page = 1;
  while (true) {
    const res = await fetch(`${PAYLOAD_URL}/api/wines?limit=100&page=${page}&depth=1&sort=id`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) break;
    allWines.push(...data.docs);
    if (!data.hasNextPage) break;
    page++;
  }
  console.log('Total wines: ' + allWines.length);

  const allReviews: any[] = [];
  page = 1;
  while (true) {
    const res = await fetch(`${PAYLOAD_URL}/api/reviews?limit=100&page=${page}&depth=0&sort=id`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) break;
    allReviews.push(...data.docs);
    if (!data.hasNextPage) break;
    page++;
  }
  console.log('Total reviews: ' + allReviews.length);

  // Build wine→review count map
  const wineReviewCount = new Map<number, number>();
  for (const r of allReviews) {
    const wineId = typeof r.wine === 'object' ? r.wine.id : r.wine;
    wineReviewCount.set(wineId, (wineReviewCount.get(wineId) || 0) + 1);
  }

  // Find duplicates: same producer + name + vintage
  const groups = new Map<string, any[]>();
  for (const w of allWines) {
    const producerId = typeof w.producer === 'object' ? w.producer.id : w.producer;
    const key = `${producerId}|${w.name}|${w.vintage}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(w);
  }

  const duplicates = [...groups.entries()].filter(([_, wines]) => wines.length > 1);
  console.log(`\nDuplicate groups: ${duplicates.length}\n`);

  const DRY_RUN = process.argv.includes('--dry-run');
  if (DRY_RUN) console.log('DRY RUN — no deletions\n');

  let deleted = 0;
  let errors = 0;

  for (const [key, wines] of duplicates) {
    const producer = typeof wines[0].producer === 'object' ? wines[0].producer.name : 'Unknown';

    // Sort: keep wine with most reviews, then lowest ID (oldest)
    wines.sort((a, b) => {
      const aReviews = wineReviewCount.get(a.id) || 0;
      const bReviews = wineReviewCount.get(b.id) || 0;
      if (bReviews !== aReviews) return bReviews - aReviews;
      return a.id - b.id;
    });

    const keep = wines[0];
    const toDelete = wines.slice(1);

    console.log(`${producer} "${keep.name}" ${keep.vintage}`);
    console.log(`  KEEP: ID ${keep.id} (${wineReviewCount.get(keep.id) || 0} reviews)`);

    for (const d of toDelete) {
      const reviewCount = wineReviewCount.get(d.id) || 0;
      console.log(`  DELETE: ID ${d.id} (${reviewCount} reviews)`);

      if (reviewCount > 0) {
        // Reassign reviews from duplicate to the kept wine before deleting
        const reviewsForWine = allReviews.filter(r => {
          const wId = typeof r.wine === 'object' ? r.wine.id : r.wine;
          return wId === d.id;
        });

        for (const rev of reviewsForWine) {
          if (!DRY_RUN) {
            const res = await fetch(`${PAYLOAD_URL}/api/reviews/${rev.id}`, {
              method: 'PATCH',
              headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ wine: keep.id }),
            });
            if (res.ok) {
              console.log(`    → Reassigned review ${rev.id} to wine ${keep.id}`);
            } else {
              console.log(`    ✗ Failed to reassign review ${rev.id}`);
              errors++;
            }
          } else {
            console.log(`    → Would reassign review ${rev.id} to wine ${keep.id}`);
          }
        }
      }

      if (!DRY_RUN) {
        const res = await fetch(`${PAYLOAD_URL}/api/wines/${d.id}`, {
          method: 'DELETE',
          headers: { Authorization: `JWT ${token}` },
        });
        if (res.ok) {
          console.log(`    ✓ Deleted wine ${d.id}`);
          deleted++;
        } else {
          console.log(`    ✗ Failed to delete wine ${d.id}`);
          errors++;
        }
      } else {
        console.log(`    → Would delete wine ${d.id}`);
        deleted++;
      }
    }
  }

  console.log(`\nDeleted: ${deleted}, Errors: ${errors}`);
}

main().catch(console.error);
