import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAYLOAD_URL = 'http://localhost:3000';

const SIZE_PATTERNS = [
  /\b(magnum)\b/i,
  /\b(jeroboam)\b/i,
  /\b(rehoboam)\b/i,
  /\b(methuselah)\b/i,
  /\b(salmanazar)\b/i,
  /\b(balthazar)\b/i,
  /\b(nebuchadnezzar)\b/i,
  /\b(double magnum)\b/i,
  /\b(imperial)\b/i,
  /\b(half[- ]?bottle)\b/i,
  /\b\d+(\.\d+)?\s*[lL]\b/,        // 1.5L, 3L, 1.5 L
  /\b\d+\s*[mM][lL]\b/,             // 375ml, 750ml, 1500ml
  /\b\d+(\.\d+)?\s*liter(s)?\b/i,   // 1.5 liter, 1.5 liters
  /\b\d+(\.\d+)?\s*litre(s)?\b/i,   // 1.5 litre
];

async function main() {
  const loginRes = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.PAYLOAD_ADMIN_EMAIL, password: process.env.PAYLOAD_ADMIN_PASSWORD }),
  });
  const { token } = await loginRes.json();

  // --- WINE NAMES ---
  console.log('=== WINE NAMES WITH BOTTLE SIZE REFERENCES ===\n');
  let page = 1;
  const wineHits: { id: number; name: string; producer: string; match: string }[] = [];

  while (true) {
    const res = await fetch(`${PAYLOAD_URL}/api/wines?limit=250&page=${page}&depth=1`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) break;

    for (const w of data.docs) {
      for (const pat of SIZE_PATTERNS) {
        const m = w.name?.match(pat);
        if (m) {
          const pname = typeof w.producer === 'object' ? w.producer?.name : String(w.producer);
          wineHits.push({ id: w.id, name: w.name, producer: pname, match: m[0] });
          break;
        }
      }
    }

    process.stdout.write(`  Scanned wines page ${page}/${data.totalPages}...\r`);
    if (!data.hasNextPage) break;
    page++;
  }

  console.log(`\nFound ${wineHits.length} wine names with bottle size references:\n`);
  for (const h of wineHits) {
    console.log(`  ID=${h.id} "${h.name}" (${h.producer}) [matched: "${h.match}"]`);
  }

  // --- REVIEWS ---
  console.log('\n=== REVIEWS WITH BOTTLE SIZE REFERENCES ===\n');
  page = 1;
  const reviewHits: { id: number; wineId: number; wineName: string; field: string; match: string; context: string }[] = [];

  while (true) {
    const res = await fetch(`${PAYLOAD_URL}/api/reviews?limit=250&page=${page}&depth=1`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) break;

    for (const r of data.docs) {
      const wineName = typeof r.wine === 'object' ? r.wine?.name : String(r.wine);
      const wineId = typeof r.wine === 'object' ? r.wine?.id : r.wine;

      for (const field of ['tastingNotes', 'shortSummary'] as const) {
        const text = r[field] || '';
        for (const pat of SIZE_PATTERNS) {
          const m = text.match(pat);
          if (m) {
            const idx = m.index || 0;
            const start = Math.max(0, idx - 40);
            const end = Math.min(text.length, idx + m[0].length + 40);
            const context = (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '');
            reviewHits.push({ id: r.id, wineId, wineName, field, match: m[0], context });
            break;
          }
        }
      }
    }

    process.stdout.write(`  Scanned reviews page ${page}/${data.totalPages}...\r`);
    if (!data.hasNextPage) break;
    page++;
  }

  console.log(`\nFound ${reviewHits.length} reviews with bottle size references:\n`);
  for (const h of reviewHits) {
    console.log(`  Review ${h.id} (wine ${h.wineId} "${h.wineName}") [${h.field}] matched "${h.match}": ${h.context}`);
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Wine names: ${wineHits.length}`);
  console.log(`Reviews: ${reviewHits.length}`);
}

main().catch(console.error);
