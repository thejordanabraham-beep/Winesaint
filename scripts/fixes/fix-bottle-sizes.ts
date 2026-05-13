import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAYLOAD_URL = 'http://localhost:3000';

// DELETE these wines + their reviews (have standard counterpart)
const DELETE_IDS = [12062, 12057, 12048, 12047, 10831];

// RENAME these wines (strip size from name)
const RENAME_MAP: Record<number, string> = {
  12522: 'Sagrantino di Montefalco',
  5306: 'Petrus',
  2909: 'Pinot Noir Kiser Vineyard Upper Block',
  2907: 'Pinot Noir Wendling Vineyard Suitcase Block',
  1349: 'Brut Nature Riesling',
};

async function main() {
  const loginRes = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.PAYLOAD_ADMIN_EMAIL, password: process.env.PAYLOAD_ADMIN_PASSWORD }),
  });
  const { token } = await loginRes.json();

  let deleted = 0;
  let renamed = 0;
  let reviewsCleaned = 0;
  let errors = 0;

  // 1. DELETE duplicate size wines + their reviews
  console.log('=== DELETING DUPLICATE SIZE WINES ===');
  for (const wineId of DELETE_IDS) {
    const wineRes = await fetch(`${PAYLOAD_URL}/api/wines/${wineId}?depth=0`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const wine = await wineRes.json();

    // Delete reviews first
    const revRes = await fetch(`${PAYLOAD_URL}/api/reviews?where[wine][equals]=${wineId}&limit=100&depth=0`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const revData = await revRes.json();
    for (const r of revData.docs || []) {
      const del = await fetch(`${PAYLOAD_URL}/api/reviews/${r.id}`, {
        method: 'DELETE',
        headers: { Authorization: `JWT ${token}` },
      });
      if (del.ok) {
        console.log(`  Deleted review ${r.id}`);
      } else {
        console.log(`  FAILED to delete review ${r.id}`);
        errors++;
      }
    }

    // Delete wine
    const del = await fetch(`${PAYLOAD_URL}/api/wines/${wineId}`, {
      method: 'DELETE',
      headers: { Authorization: `JWT ${token}` },
    });
    if (del.ok) {
      console.log(`  Deleted wine ${wineId} "${wine.name}"`);
      deleted++;
    } else {
      console.log(`  FAILED to delete wine ${wineId}`);
      errors++;
    }
  }

  // 2. RENAME wines (strip size reference)
  console.log('\n=== RENAMING WINES ===');
  for (const [idStr, newName] of Object.entries(RENAME_MAP)) {
    const id = Number(idStr);
    const res = await fetch(`${PAYLOAD_URL}/api/wines/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    if (res.ok) {
      console.log(`  Renamed wine ${id} → "${newName}"`);
      renamed++;
    } else {
      console.log(`  FAILED to rename wine ${id}`);
      errors++;
    }
  }

  // 3. CLEAN review text — remove/rewrite bottle size mentions
  // Only target real bottle-size references, skip Balthazar (person), skip production volume references
  console.log('\n=== CLEANING REVIEW TEXT ===');

  // Reviews that mention magnum/half-bottle format in tasting notes
  const MAGNUM_REVIEW_IDS = [12617, 11945, 11940, 11932, 11103, 10632, 9542, 6244, 5238, 4313, 3292, 2878, 2876];

  for (const revId of MAGNUM_REVIEW_IDS) {
    const res = await fetch(`${PAYLOAD_URL}/api/reviews/${revId}?depth=0`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const review = await res.json();
    if (!review.id) {
      console.log(`  Review ${revId} not found (may have been deleted)`);
      continue;
    }

    let tastingNotes = review.tastingNotes || '';
    let shortSummary = review.shortSummary || '';
    let changed = false;

    // Remove sentences/phrases about bottle format
    const formatPatterns = [
      /\s*Available only in magnum format\.\s*/gi,
      /\s*Magnum-only release\.\s*/gi,
      /\s*The magnum format has worked magic here, coaxing extra complexity and silkiness from the wine\.\s*/gi,
      /\s*The magnum format (?:brings|adds|delivers|provides)[^.]*\.\s*/gi,
      /\s*The half-bottle format feels perfectly suited to its intensity[^.]*\.\s*/gi,
      /\s*(?:From|In) magnum(?:,| format)[^.]*\.\s*/gi,
    ];

    for (const pat of formatPatterns) {
      if (pat.test(tastingNotes)) {
        tastingNotes = tastingNotes.replace(pat, ' ').trim();
        changed = true;
      }
    }

    // Clean short summaries
    const summaryPatterns = [
      /^Magnum magic delivers /i,
      /^Magnum format elevates /i,
      /^Powerful magnum with /i,
      /\s+in magnum$/i,
    ];

    for (const pat of summaryPatterns) {
      if (pat.test(shortSummary)) {
        if (/^Magnum magic delivers /i.test(shortSummary)) {
          shortSummary = shortSummary.replace(/^Magnum magic delivers /i, 'Delivers ');
        } else if (/^Magnum format elevates /i.test(shortSummary)) {
          shortSummary = shortSummary.replace(/^Magnum format elevates /i, 'Elevated ');
        } else if (/^Powerful magnum with /i.test(shortSummary)) {
          shortSummary = shortSummary.replace(/^Powerful magnum with /i, 'Powerful, with ');
        } else if (/\s+in magnum$/i.test(shortSummary)) {
          shortSummary = shortSummary.replace(/\s+in magnum$/i, '');
        }
        changed = true;
      }
    }

    // Generic: remove stray "magnum" mentions that refer to format
    // "from magnum" at end of clause, "The magnum has done its work beautifully, "
    const genericMagnum = [
      /\s*The magnum has done its work beautifully, preserving/i,
      / from magnum\./gi,
    ];
    for (const pat of genericMagnum) {
      if (pat.test(tastingNotes)) {
        if (/The magnum has done its work beautifully, preserving/i.test(tastingNotes)) {
          tastingNotes = tastingNotes.replace(/The magnum has done its work beautifully, preserving/i, 'Preserving');
        }
        if (/ from magnum\./gi.test(tastingNotes)) {
          tastingNotes = tastingNotes.replace(/ from magnum\./gi, '.');
        }
        changed = true;
      }
    }

    if (changed) {
      // Clean up double spaces
      tastingNotes = tastingNotes.replace(/\s{2,}/g, ' ').trim();
      shortSummary = shortSummary.replace(/\s{2,}/g, ' ').trim();

      const patchRes = await fetch(`${PAYLOAD_URL}/api/reviews/${revId}`, {
        method: 'PATCH',
        headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ tastingNotes, shortSummary }),
      });
      if (patchRes.ok) {
        console.log(`  Cleaned review ${revId}`);
        reviewsCleaned++;
      } else {
        console.log(`  FAILED to clean review ${revId}`);
        errors++;
      }
    } else {
      console.log(`  Review ${revId} — no pattern matched, skipping`);
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Wines deleted: ${deleted}`);
  console.log(`Wines renamed: ${renamed}`);
  console.log(`Reviews cleaned: ${reviewsCleaned}`);
  console.log(`Errors: ${errors}`);
}

main().catch(console.error);
