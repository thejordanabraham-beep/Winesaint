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

  // Fetch all wines
  const allWines: any[] = [];
  let page = 1;
  while (true) {
    const res = await fetch(`${PAYLOAD_URL}/api/wines?limit=100&page=${page}&depth=2&sort=id`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) break;
    allWines.push(...data.docs);
    if (!data.hasNextPage) break;
    page++;
  }
  console.log('Total wines: ' + allWines.length);

  // Fetch all reviews
  const allReviews: any[] = [];
  page = 1;
  while (true) {
    const res = await fetch(`${PAYLOAD_URL}/api/reviews?limit=100&page=${page}&depth=2&sort=id`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) break;
    allReviews.push(...data.docs);
    if (!data.hasNextPage) break;
    page++;
    if (page % 20 === 0) process.stderr.write(`  fetched ${allReviews.length} reviews...\n`);
  }
  console.log('Total reviews: ' + allReviews.length + '\n');

  // ============================================================
  // 1. TYPOS / MISSPELLINGS IN WINE NAMES
  // ============================================================
  console.log('=== SUSPECTED TYPOS IN WINE NAMES ===\n');

  // Common wine term misspellings
  const typoPatterns: [RegExp, string][] = [
    [/\bVineard\b/i, 'Vineyard'],
    [/\bVinyard\b/i, 'Vineyard'],
    [/\bVinyeard\b/i, 'Vineyard'],
    [/\bWomat\b/i, 'Wombat?'],
    [/\bChardonnay\b/, ''], // correct
    [/\bChardonay\b/i, 'Chardonnay'],
    [/\bChardonney\b/i, 'Chardonnay'],
    [/\bSauvingon\b/i, 'Sauvignon'],
    [/\bCabenet\b/i, 'Cabernet'],
    [/\bPinott?\b/i, 'Pinot?'],
    [/\bGewurtztraminer\b/i, 'Gewürztraminer'],
    [/\bReisling\b/i, 'Riesling'],
    [/\bSyraz\b/i, 'Syrah'],
    [/\bShiaz\b/i, 'Shiraz'],
    [/\bMerlott?\b(?!o)/i, 'Merlot?'],
    [/\bBarbaresc(?!o)\b/i, 'Barbaresco?'],
    [/\bBrunello(?! )\b/i, ''],
    [/\bNebbiol(?!o)\b/i, 'Nebbiolo?'],
    [/\bSangiovse\b/i, 'Sangiovese'],
    [/\bMontrachet\b/, ''], // correct
    [/\bMontrachet\b/, ''],
    [/\bVergelesse\b(?!s)/i, 'Vergelesses?'],
    [/\bBeaune\b/, ''], // correct
    [/\bBeune\b/i, 'Beaune?'],
    [/\bVosne-Romane\b(?!e)/i, 'Vosne-Romanée?'],
    [/\bChambertain\b/i, 'Chambertin?'],
    [/\bMontalcin(?!o)\b/i, 'Montalcino?'],
    [/\bValpoicella\b/i, 'Valpolicella'],
    [/\bSpatlese\b/, 'Spätlese?'],
    [/\bGrosses Gewachs\b/, 'Grosses Gewächs?'],
    [/\bTrockenbeerenausles\b(?!e)/i, 'Trockenbeerenauslese?'],
  ];

  for (const w of allWines) {
    for (const [pattern, suggestion] of typoPatterns) {
      if (suggestion && pattern.test(w.name)) {
        const producer = typeof w.producer === 'object' ? w.producer.name : 'Unknown';
        console.log(`  Wine ID ${w.id}: "${w.name}" (${producer})`);
        console.log(`    Possible typo: ${pattern} → ${suggestion}`);
      }
    }
  }

  // ============================================================
  // 2. DUPLICATE WINES (same producer + same name + same vintage)
  // ============================================================
  console.log('\n=== DUPLICATE WINES (same producer + name + vintage) ===\n');
  const wineKeys = new Map<string, any[]>();
  for (const w of allWines) {
    const producer = typeof w.producer === 'object' ? w.producer.name : 'Unknown';
    const key = `${producer}|${w.name}|${w.vintage}`;
    if (!wineKeys.has(key)) wineKeys.set(key, []);
    wineKeys.get(key)!.push(w);
  }
  const dupeWines = [...wineKeys.entries()].filter(([_, wines]) => wines.length > 1);
  console.log('Duplicate groups: ' + dupeWines.length);
  for (const [key, wines] of dupeWines.slice(0, 30)) {
    const [producer, name, vintage] = key.split('|');
    console.log(`  ${producer} "${name}" ${vintage} — ${wines.length} copies (IDs: ${wines.map(w => w.id).join(', ')})`);
  }
  if (dupeWines.length > 30) console.log('  ... and ' + (dupeWines.length - 30) + ' more');

  // ============================================================
  // 3. WINES WITHOUT REVIEWS
  // ============================================================
  console.log('\n=== WINES WITHOUT REVIEWS ===\n');
  const reviewedWineIds = new Set(allReviews.map(r => typeof r.wine === 'object' ? r.wine.id : r.wine));
  const orphanWines = allWines.filter(w => !reviewedWineIds.has(w.id));
  console.log('Count: ' + orphanWines.length);
  for (const w of orphanWines.slice(0, 20)) {
    const producer = typeof w.producer === 'object' ? w.producer.name : 'Unknown';
    console.log(`  Wine ID ${w.id}: ${producer} "${w.name}" ${w.vintage}`);
  }
  if (orphanWines.length > 20) console.log('  ... and ' + (orphanWines.length - 20) + ' more');

  // ============================================================
  // 4. PRODUCER NAME ISSUES
  // ============================================================
  console.log('\n=== PRODUCER NAME ISSUES ===\n');

  // Fetch producers
  const allProducers: any[] = [];
  page = 1;
  while (true) {
    const res = await fetch(`${PAYLOAD_URL}/api/producers?limit=100&page=${page}&depth=0&sort=id`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) break;
    allProducers.push(...data.docs);
    if (!data.hasNextPage) break;
    page++;
  }

  // Check for trailing/leading spaces
  const spacedProducers = allProducers.filter(p => p.name !== p.name.trim());
  console.log('Trailing/leading spaces: ' + spacedProducers.length);
  for (const p of spacedProducers) console.log(`  ID ${p.id}: "${p.name}"`);

  // Check for near-duplicate producers (fuzzy)
  console.log('\nNear-duplicate producers:');
  const prodNames = allProducers.map(p => p.name);
  for (let i = 0; i < prodNames.length; i++) {
    for (let j = i + 1; j < prodNames.length; j++) {
      const a = prodNames[i].toLowerCase().replace(/[^a-z]/g, '');
      const b = prodNames[j].toLowerCase().replace(/[^a-z]/g, '');
      // Check if one contains the other or they're very similar
      if (a.length > 5 && b.length > 5) {
        if (a.includes(b) || b.includes(a)) {
          console.log(`  "${prodNames[i]}" (ID ${allProducers[i].id}) vs "${prodNames[j]}" (ID ${allProducers[j].id})`);
        }
      }
    }
  }

  // ============================================================
  // 5. REGION ISSUES
  // ============================================================
  console.log('\n=== REGION ISSUES ===\n');

  // Fetch regions
  const allRegions: any[] = [];
  page = 1;
  while (true) {
    const res = await fetch(`${PAYLOAD_URL}/api/regions?limit=100&page=${page}&depth=0&sort=id`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) break;
    allRegions.push(...data.docs);
    if (!data.hasNextPage) break;
    page++;
  }
  console.log('Total regions: ' + allRegions.length);

  // Regions with very few wines (possibly duplicates or errors)
  const regionWineCounts = new Map<string, number>();
  for (const w of allWines) {
    const region = typeof w.region === 'object' ? w.region.name : 'Unknown';
    regionWineCounts.set(region, (regionWineCounts.get(region) || 0) + 1);
  }

  console.log('\nRegions with only 1-2 wines (possible duplicates/errors):');
  const smallRegions = [...regionWineCounts.entries()]
    .filter(([_, count]) => count <= 2)
    .sort((a, b) => a[1] - b[1]);
  for (const [name, count] of smallRegions) {
    const wines = allWines.filter(w => (typeof w.region === 'object' ? w.region.name : '') === name);
    const producers = [...new Set(wines.map(w => typeof w.producer === 'object' ? w.producer.name : ''))];
    console.log(`  "${name}" — ${count} wine(s) from: ${producers.join(', ')}`);
  }

  // Near-duplicate regions
  console.log('\nNear-duplicate regions:');
  const regionNames = allRegions.map(r => r.name);
  for (let i = 0; i < regionNames.length; i++) {
    for (let j = i + 1; j < regionNames.length; j++) {
      const a = regionNames[i].toLowerCase().replace(/[^a-z]/g, '');
      const b = regionNames[j].toLowerCase().replace(/[^a-z]/g, '');
      if (a.length > 4 && b.length > 4 && (a === b || (a.includes(b) && a.length - b.length <= 3) || (b.includes(a) && b.length - a.length <= 3))) {
        console.log(`  "${regionNames[i]}" (ID ${allRegions[i].id}) vs "${regionNames[j]}" (ID ${allRegions[j].id})`);
      }
    }
  }

  // ============================================================
  // 6. REVIEW TEXT QUALITY CHECKS
  // ============================================================
  console.log('\n=== REVIEW TEXT QUALITY ===\n');

  // Reviews that mention the wrong producer/wine
  // Check for common AI artifacts
  const aiArtifacts = allReviews.filter(r => {
    const notes = r.tastingNotes || '';
    return /here is|here's a|I would|I'd say|as an AI|certainly|absolutely/i.test(notes) ||
           /\bpresents\b.*\bwith\b.*\baromas\b/i.test(notes.substring(0, 50));
  });
  console.log('Possible AI-speak artifacts: ' + aiArtifacts.length);
  for (const r of aiArtifacts.slice(0, 10)) {
    const wine = r.wine;
    const name = wine ? (typeof wine.producer === 'object' ? wine.producer.name : '') + ' ' + (wine.name || '') : '';
    console.log(`  ID ${r.id}: "${r.tastingNotes.substring(0, 100)}..." | ${name}`);
  }

  // Reviews with unusual characters
  const weirdChars = allReviews.filter(r => {
    const notes = r.tastingNotes || '';
    return /[\*\#\[\]\(\)]/.test(notes) || /\n/.test(notes);
  });
  console.log('\nReviews with markdown/special characters: ' + weirdChars.length);
  for (const r of weirdChars.slice(0, 10)) {
    const wine = r.wine;
    const name = wine ? (typeof wine.producer === 'object' ? wine.producer.name : '') + ' ' + (wine.name || '') : '';
    console.log(`  ID ${r.id}: "${r.tastingNotes.substring(0, 120)}..." | ${name}`);
  }

  // Reviews mentioning "François" or model names
  const modelLeaks = allReviews.filter(r => {
    const notes = r.tastingNotes || '';
    return /François|Claude|Anthropic|GPT|OpenAI|wine saint|WineSaint/i.test(notes);
  });
  console.log('\nReviews mentioning model/brand names: ' + modelLeaks.length);
  for (const r of modelLeaks.slice(0, 10)) {
    const wine = r.wine;
    const name = wine ? (typeof wine.producer === 'object' ? wine.producer.name : '') + ' ' + (wine.name || '') : '';
    const match = r.tastingNotes.match(/François|Claude|Anthropic|GPT|OpenAI|wine saint|WineSaint/i);
    console.log(`  ID ${r.id}: contains "${match?.[0]}" — ${name}`);
    console.log(`    "${r.tastingNotes.substring(0, 150)}..."`);
  }

  // ============================================================
  // 7. SCORE ANOMALIES
  // ============================================================
  console.log('\n=== SCORE ANOMALIES ===\n');

  // Score distribution by range
  const scoreBuckets: Record<string, number> = {};
  for (const r of allReviews) {
    const s = r.score;
    const bucket = s < 5 ? 'below 5' : s < 6 ? '5-5.9' : s < 7 ? '6-6.9' : s < 8 ? '7-7.9' : s < 9 ? '8-8.9' : '9-10';
    scoreBuckets[bucket] = (scoreBuckets[bucket] || 0) + 1;
  }
  console.log('Score distribution:');
  for (const [bucket, count] of Object.entries(scoreBuckets).sort()) {
    console.log(`  ${bucket}: ${count}`);
  }

  // Very low scores (below 5) — might be conversion errors
  const lowScores = allReviews.filter(r => r.score < 5);
  console.log('\nScores below 5 (possible conversion errors): ' + lowScores.length);
  for (const r of lowScores.slice(0, 15)) {
    const wine = r.wine;
    const name = wine ? (typeof wine.producer === 'object' ? wine.producer.name : '') + ' ' + (wine.name || '') : '';
    console.log(`  ID ${r.id} score=${r.score}: ${name} ${wine?.vintage || ''}`);
  }

  // ============================================================
  // 8. FLAVOR PROFILE ISSUES
  // ============================================================
  console.log('\n=== FLAVOR PROFILE ISSUES ===\n');

  // Weird flavors
  const allFlavors = new Map<string, number>();
  for (const r of allReviews) {
    if (!r.flavorProfile) continue;
    for (const fp of r.flavorProfile) {
      const f = fp.flavor?.toLowerCase() || '';
      allFlavors.set(f, (allFlavors.get(f) || 0) + 1);
    }
  }

  // Most common flavors
  const sortedFlavors = [...allFlavors.entries()].sort((a, b) => b[1] - a[1]);
  console.log('Top 20 flavors:');
  for (const [flavor, count] of sortedFlavors.slice(0, 20)) {
    console.log(`  ${flavor}: ${count}`);
  }

  // Flavors that appear only once (possible typos)
  const singleFlavors = sortedFlavors.filter(([_, count]) => count === 1);
  console.log('\nFlavors appearing only once (possible typos): ' + singleFlavors.length);
  for (const [flavor] of singleFlavors.slice(0, 30)) {
    console.log(`  "${flavor}"`);
  }

  // ============================================================
  // 9. SHORT SUMMARY ISSUES
  // ============================================================
  console.log('\n=== SHORT SUMMARY ISSUES ===\n');

  // Summaries that are too long (>15 words)
  const longSummaries = allReviews.filter(r => r.shortSummary && r.shortSummary.split(' ').length > 15);
  console.log('Summaries >15 words: ' + longSummaries.length);
  for (const r of longSummaries.slice(0, 10)) {
    console.log(`  ID ${r.id}: "${r.shortSummary}"`);
  }

  // Duplicate summaries
  const summaryMap = new Map<string, number>();
  for (const r of allReviews) {
    const s = r.shortSummary?.trim().toLowerCase() || '';
    summaryMap.set(s, (summaryMap.get(s) || 0) + 1);
  }
  const dupeSummaries = [...summaryMap.entries()].filter(([_, count]) => count > 5).sort((a, b) => b[1] - a[1]);
  console.log('\nMost repeated summaries (>5 uses):');
  for (const [summary, count] of dupeSummaries.slice(0, 20)) {
    console.log(`  [${count}x] "${summary}"`);
  }

  // ============================================================
  // 10. WINE NAME CONTAINS PRODUCER NAME
  // ============================================================
  console.log('\n=== WINE NAME CONTAINS PRODUCER NAME ===\n');
  const prodInName = allWines.filter(w => {
    const producer = typeof w.producer === 'object' ? w.producer.name : '';
    if (!producer || producer.length < 4) return false;
    return w.name.toLowerCase().includes(producer.toLowerCase());
  });
  console.log('Count: ' + prodInName.length);
  for (const w of prodInName.slice(0, 15)) {
    const producer = typeof w.producer === 'object' ? w.producer.name : '';
    console.log(`  Wine ID ${w.id}: Producer "${producer}" | Wine name "${w.name}" ${w.vintage}`);
  }
  if (prodInName.length > 15) console.log('  ... and ' + (prodInName.length - 15) + ' more');

  // ============================================================
  // 11. EMPTY/BLANK WINE NAMES
  // ============================================================
  console.log('\n=== EMPTY OR SUSPICIOUS WINE NAMES ===\n');
  const emptyNames = allWines.filter(w => !w.name || w.name.trim().length < 3);
  console.log('Very short/empty wine names: ' + emptyNames.length);
  for (const w of emptyNames) {
    const producer = typeof w.producer === 'object' ? w.producer.name : '';
    console.log(`  Wine ID ${w.id}: "${w.name}" (${producer}) ${w.vintage}`);
  }
}

main().catch(console.error);
