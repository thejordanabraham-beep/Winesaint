import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAYLOAD_URL = 'http://localhost:3000';

function normalize(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[''`]/g, "'")
    .replace(/[^a-z0-9' ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sortedWords(name: string): string {
  return normalize(name).split(' ').sort().join(' ');
}

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
    const res = await fetch(`${PAYLOAD_URL}/api/wines?limit=100&page=${page}&depth=2&sort=id`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) break;
    allWines.push(...data.docs);
    if (!data.hasNextPage) break;
    page++;
  }
  console.log('Total wines: ' + allWines.length + '\n');

  const byProducer = new Map<string, any[]>();
  for (const w of allWines) {
    const producer = typeof w.producer === 'object' ? w.producer.name : 'Unknown';
    if (!byProducer.has(producer)) byProducer.set(producer, []);
    byProducer.get(producer)!.push(w);
  }

  let groupNum = 0;
  const results: any[] = [];

  for (const [producer, wines] of byProducer) {
    const sortedGroups = new Map<string, any[]>();
    for (const w of wines) {
      const sorted = sortedWords(w.name);
      if (!sortedGroups.has(sorted)) sortedGroups.set(sorted, []);
      sortedGroups.get(sorted)!.push(w);
    }

    for (const [_, group] of sortedGroups) {
      const uniqueNorm = [...new Set(group.map((w: any) => normalize(w.name)))];
      if (uniqueNorm.length <= 1) continue;

      groupNum++;
      const variants: any[] = [];

      const uniqueNames = [...new Set(group.map((w: any) => w.name))];
      for (const name of uniqueNames) {
        const winesWithName = group.filter((w: any) => w.name === name);
        const vintages = winesWithName.map((w: any) => w.vintage).sort();
        const ids = winesWithName.map((w: any) => w.id);
        const regions = [...new Set(winesWithName.map((w: any) =>
          typeof w.region === 'object' ? w.region.name : 'Unknown'
        ))];
        const types = [...new Set(winesWithName.map((w: any) => w.type || 'N/A'))];

        variants.push({ name, vintages, ids, regions, types, count: winesWithName.length });
      }

      // Determine if this is truly the same wine
      const allRegions = [...new Set(variants.flatMap(v => v.regions))];
      const allTypes = [...new Set(variants.flatMap(v => v.types))];
      const sameRegion = allRegions.length === 1;
      const sameType = allTypes.length === 1;

      // Check if the words are truly identical (not just sorted same)
      const wordSets = uniqueNames.map(n => new Set(normalize(n).split(' ')));
      const sameWords = wordSets.every((ws, _, arr) => {
        const first = arr[0];
        return ws.size === first.size && [...ws].every(w => first.has(w));
      });

      let verdict = 'SAME WINE';
      const flags: string[] = [];
      if (!sameRegion) flags.push('DIFFERENT REGIONS: ' + allRegions.join(' vs '));
      if (!sameType) flags.push('DIFFERENT TYPES: ' + allTypes.join(' vs '));
      if (!sameWords) { flags.push('DIFFERENT WORDS (not just reorder)'); verdict = 'CHECK'; }
      if (flags.length > 0 && sameWords) verdict = 'LIKELY SAME - CHECK';

      console.log(`[${groupNum}] ${producer}`);
      console.log(`  Verdict: ${verdict}`);
      for (const f of flags) console.log(`  ⚠ ${f}`);
      for (const v of variants) {
        console.log(`  "${v.name}" — ${v.count} wines, vintages: ${v.vintages.join(', ')} | region: ${v.regions.join(', ')} | type: ${v.types.join(', ')}`);
      }

      // Recommend which name to keep (the one with more wines)
      const sorted = [...variants].sort((a, b) => b.count - a.count);
      if (verdict === 'SAME WINE') {
        console.log(`  → Keep: "${sorted[0].name}" (${sorted[0].count} wines)`);
        console.log(`  → Rename: ${sorted.slice(1).map(v => `"${v.name}" (${v.count} wines, IDs: ${v.ids.join(', ')})`).join(', ')}`);
      }
      console.log();

      results.push({ groupNum, producer, variants, verdict, flags, keepName: sorted[0].name });
    }
  }

  console.log('=== SUMMARY ===');
  const same = results.filter(r => r.verdict === 'SAME WINE');
  const check = results.filter(r => r.verdict !== 'SAME WINE');
  console.log('Confirmed same wine (just reorder): ' + same.length);
  console.log('Needs manual check: ' + check.length);
}

main().catch(console.error);
