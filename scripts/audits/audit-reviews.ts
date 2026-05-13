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

  const allReviews: any[] = [];
  let page = 1;
  while (true) {
    const res = await fetch(`${PAYLOAD_URL}/api/reviews?limit=100&page=${page}&depth=2&sort=id`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) break;
    allReviews.push(...data.docs);
    if (page % 20 === 0) process.stderr.write(`  fetched ${allReviews.length}...\n`);
    if (!data.hasNextPage) break;
    page++;
  }
  console.log('Total reviews fetched: ' + allReviews.length);

  // 1. Missing/empty tasting notes
  const emptyNotes = allReviews.filter(r => !r.tastingNotes || r.tastingNotes.trim() === '');
  console.log('\n=== MISSING TASTING NOTES ===');
  console.log('Count: ' + emptyNotes.length);
  for (const r of emptyNotes.slice(0, 10)) {
    const wine = r.wine;
    const name = wine ? (typeof wine.producer === 'object' ? wine.producer.name : '') + ' ' + (wine.name || '') : 'NO WINE';
    console.log('  ID ' + r.id + ': ' + name);
  }

  // 2. Missing short summary
  const emptySummary = allReviews.filter(r => !r.shortSummary || r.shortSummary.trim() === '');
  console.log('\n=== MISSING SHORT SUMMARY ===');
  console.log('Count: ' + emptySummary.length);
  for (const r of emptySummary.slice(0, 5)) {
    const wine = r.wine;
    const name = wine ? (typeof wine.producer === 'object' ? wine.producer.name : '') + ' ' + (wine.name || '') : 'NO WINE';
    console.log('  ID ' + r.id + ': ' + name);
  }

  // 3. Missing flavor profile
  const emptyFlavor = allReviews.filter(r => !r.flavorProfile || r.flavorProfile.length === 0);
  console.log('\n=== MISSING FLAVOR PROFILE ===');
  console.log('Count: ' + emptyFlavor.length);

  // 4. Reviews with no linked wine
  const noWine = allReviews.filter(r => !r.wine);
  console.log('\n=== NO LINKED WINE ===');
  console.log('Count: ' + noWine.length);
  for (const r of noWine) {
    console.log('  ID ' + r.id);
  }

  // 5. Very short reviews
  const shortReviews = allReviews.filter(r => r.tastingNotes && r.tastingNotes.length < 50);
  console.log('\n=== VERY SHORT REVIEWS (<50 chars) ===');
  console.log('Count: ' + shortReviews.length);
  for (const r of shortReviews.slice(0, 15)) {
    const wine = r.wine;
    const name = wine ? (typeof wine.producer === 'object' ? wine.producer.name : '') + ' ' + (wine.name || '') : 'NO WINE';
    console.log('  ID ' + r.id + ' (' + r.tastingNotes.length + ' chars): "' + r.tastingNotes + '" | ' + name);
  }

  // 6. Very long reviews
  const longReviews = allReviews.filter(r => r.tastingNotes && r.tastingNotes.length > 800);
  console.log('\n=== VERY LONG REVIEWS (>800 chars) ===');
  console.log('Count: ' + longReviews.length);
  for (const r of longReviews.slice(0, 10)) {
    const wine = r.wine;
    const name = wine ? (typeof wine.producer === 'object' ? wine.producer.name : '') + ' ' + (wine.name || '') : 'NO WINE';
    console.log('  ID ' + r.id + ' (' + r.tastingNotes.length + ' chars): ' + name);
  }

  // 7. JSON/prompt artifacts
  const jsonArtifacts = allReviews.filter(r => r.tastingNotes && (
    r.tastingNotes.includes('{') || r.tastingNotes.includes('tasting_notes') ||
    r.tastingNotes.includes('flavor_profile') || r.tastingNotes.includes('```') ||
    r.tastingNotes.includes('JSON') || r.tastingNotes.includes('WINE:') ||
    r.tastingNotes.includes('REVIEW:')
  ));
  console.log('\n=== JSON/PROMPT ARTIFACTS ===');
  console.log('Count: ' + jsonArtifacts.length);
  for (const r of jsonArtifacts.slice(0, 10)) {
    const wine = r.wine;
    const name = wine ? (typeof wine.producer === 'object' ? wine.producer.name : '') + ' ' + (wine.name || '') : 'NO WINE';
    console.log('  ID ' + r.id + ': ' + name);
    console.log('    "' + r.tastingNotes.substring(0, 200) + '"');
  }

  // 8. Reviews starting with "The 20XX" (preamble issue)
  const preamble = allReviews.filter(r => r.tastingNotes && /^The \d{4} /.test(r.tastingNotes));
  console.log('\n=== REVIEWS STARTING WITH "The 20XX..." (preamble) ===');
  console.log('Count: ' + preamble.length);
  for (const r of preamble.slice(0, 10)) {
    const wine = r.wine;
    const name = wine ? (typeof wine.producer === 'object' ? wine.producer.name : '') + ' ' + (wine.name || '') : 'NO WINE';
    console.log('  ID ' + r.id + ': "' + r.tastingNotes.substring(0, 80) + '..." | ' + name);
  }

  // 9. Duplicate reviews (exact same tasting notes text)
  const noteMap = new Map<string, any[]>();
  for (const r of allReviews) {
    if (!r.tastingNotes) continue;
    const key = r.tastingNotes.trim();
    if (!noteMap.has(key)) noteMap.set(key, []);
    noteMap.get(key)!.push(r);
  }
  const exactDupes = [...noteMap.entries()].filter(([_, reviews]) => reviews.length > 1);
  console.log('\n=== EXACT DUPLICATE REVIEW TEXT ===');
  console.log('Count: ' + exactDupes.length + ' groups');
  for (const [text, reviews] of exactDupes.slice(0, 10)) {
    const ids = reviews.map((r: any) => r.id).join(', ');
    console.log('  IDs: ' + ids);
    console.log('    "' + text.substring(0, 120) + '"');
  }

  // 10. Wine name issues - trailing/leading spaces, weird chars
  const allWines: any[] = [];
  let wPage = 1;
  while (true) {
    const res = await fetch(`${PAYLOAD_URL}/api/wines?limit=100&page=${wPage}&depth=1&sort=id`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) break;
    allWines.push(...data.docs);
    if (!data.hasNextPage) break;
    wPage++;
  }
  console.log('\n=== WINE NAME ISSUES ===');
  console.log('Total wines: ' + allWines.length);

  const trailingSpace = allWines.filter(w => w.name !== w.name.trim());
  console.log('Trailing/leading spaces: ' + trailingSpace.length);
  for (const w of trailingSpace.slice(0, 10)) {
    console.log('  ID ' + w.id + ': "' + w.name + '"');
  }

  const weirdChars = allWines.filter(w => w.name && (/\t/.test(w.name) || /  /.test(w.name)));
  console.log('Tabs or double spaces: ' + weirdChars.length);
  for (const w of weirdChars.slice(0, 10)) {
    const producer = typeof w.producer === 'object' ? w.producer.name : '';
    console.log('  ID ' + w.id + ': "' + w.name + '" | ' + producer);
  }

  // 11. Producer name inconsistencies
  const producers = new Map<string, any[]>();
  for (const w of allWines) {
    if (!w.producer || typeof w.producer !== 'object') continue;
    const name = w.producer.name;
    const lower = name.toLowerCase().replace(/[^a-z]/g, '');
    if (!producers.has(lower)) producers.set(lower, []);
    const existing = producers.get(lower)!;
    if (!existing.find((p: any) => p.name === name)) existing.push(w.producer);
  }
  const prodDupes = [...producers.entries()].filter(([_, prods]) => prods.length > 1);
  console.log('\n=== POSSIBLE DUPLICATE PRODUCERS ===');
  console.log('Count: ' + prodDupes.length);
  for (const [_, prods] of prodDupes) {
    console.log('  ' + prods.map((p: any) => '"' + p.name + '" (ID ' + p.id + ')').join(' vs '));
  }

  // 12. Missing vintage
  const noVintage = allWines.filter(w => !w.vintage);
  console.log('\n=== WINES WITH NO VINTAGE ===');
  console.log('Count: ' + noVintage.length);

  // 13. Score distribution check
  const scores = allReviews.filter(r => r.score).map(r => r.score);
  console.log('\n=== SCORE DISTRIBUTION ===');
  console.log('Reviews with score: ' + scores.length);
  console.log('Reviews without score: ' + (allReviews.length - scores.length));
  if (scores.length > 0) {
    console.log('Min: ' + Math.min(...scores) + ', Max: ' + Math.max(...scores));
    const avg = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
    console.log('Avg: ' + avg.toFixed(1));
    const outliers = allReviews.filter(r => r.score && (r.score < 70 || r.score > 100));
    console.log('Outliers (<70 or >100): ' + outliers.length);
    for (const r of outliers.slice(0, 5)) {
      const wine = r.wine;
      const name = wine ? (typeof wine.producer === 'object' ? wine.producer.name : '') + ' ' + (wine.name || '') : 'NO WINE';
      console.log('  ID ' + r.id + ' score=' + r.score + ': ' + name);
    }
  }
}

main().catch(console.error);
