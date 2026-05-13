import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAYLOAD_URL = 'http://localhost:3000';

function normalize(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/[''`]/g, "'")
    .replace(/[^a-z0-9' ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sortedWords(name: string): string {
  return normalize(name).split(' ').sort().join(' ');
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}

function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

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
    const res = await fetch(`${PAYLOAD_URL}/api/wines?limit=100&page=${page}&depth=1&sort=id`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) break;
    allWines.push(...data.docs);
    if (!data.hasNextPage) break;
    page++;
    if (page % 20 === 0) process.stderr.write(`  fetched ${allWines.length} wines...\n`);
  }
  console.log('Total wines: ' + allWines.length);

  // Group by producer
  const byProducer = new Map<string, any[]>();
  for (const w of allWines) {
    const producer = typeof w.producer === 'object' ? w.producer.name : 'Unknown';
    if (!byProducer.has(producer)) byProducer.set(producer, []);
    byProducer.get(producer)!.push(w);
  }

  console.log('Producers: ' + byProducer.size + '\n');

  // 1. Exact same normalized name (just accent/punctuation differences)
  console.log('=== EXACT MATCH AFTER NORMALIZATION (accent/punctuation differences) ===\n');
  let exactCount = 0;
  for (const [producer, wines] of byProducer) {
    const nameGroups = new Map<string, any[]>();
    for (const w of wines) {
      const norm = normalize(w.name);
      if (!nameGroups.has(norm)) nameGroups.set(norm, []);
      nameGroups.get(norm)!.push(w);
    }
    for (const [norm, group] of nameGroups) {
      const uniqueNames = [...new Set(group.map((w: any) => w.name))];
      if (uniqueNames.length > 1) {
        exactCount++;
        console.log(producer + ':');
        for (const name of uniqueNames) {
          const vintages = group.filter((w: any) => w.name === name).map((w: any) => w.vintage).sort();
          console.log('  "' + name + '" — vintages: ' + vintages.join(', '));
        }
        console.log();
      }
    }
  }
  console.log('Total exact-after-normalization groups: ' + exactCount + '\n');

  // 2. Same words, different order
  console.log('=== SAME WORDS, DIFFERENT ORDER ===\n');
  let reorderCount = 0;
  for (const [producer, wines] of byProducer) {
    const sortedGroups = new Map<string, any[]>();
    for (const w of wines) {
      const sorted = sortedWords(w.name);
      if (!sortedGroups.has(sorted)) sortedGroups.set(sorted, []);
      sortedGroups.get(sorted)!.push(w);
    }
    for (const [sorted, group] of sortedGroups) {
      const uniqueNorm = [...new Set(group.map((w: any) => normalize(w.name)))];
      if (uniqueNorm.length > 1) {
        reorderCount++;
        const uniqueNames = [...new Set(group.map((w: any) => w.name))];
        console.log(producer + ':');
        for (const name of uniqueNames) {
          const vintages = group.filter((w: any) => w.name === name).map((w: any) => w.vintage).sort();
          console.log('  "' + name + '" — vintages: ' + vintages.join(', '));
        }
        console.log();
      }
    }
  }
  console.log('Total reordered groups: ' + reorderCount + '\n');

  // 3. Fuzzy matches (high similarity but not exact)
  console.log('=== FUZZY MATCHES (>80% similar, not exact) ===\n');
  let fuzzyCount = 0;
  for (const [producer, wines] of byProducer) {
    const uniqueNames = [...new Set(wines.map((w: any) => w.name))];
    const reported = new Set<string>();

    for (let i = 0; i < uniqueNames.length; i++) {
      for (let j = i + 1; j < uniqueNames.length; j++) {
        const a = normalize(uniqueNames[i]);
        const b = normalize(uniqueNames[j]);
        if (a === b) continue; // already caught above
        if (sortedWords(uniqueNames[i]) === sortedWords(uniqueNames[j])) continue; // already caught above

        const sim = similarity(a, b);
        if (sim >= 0.75) {
          const key = [a, b].sort().join('|');
          if (reported.has(key)) continue;
          reported.add(key);
          fuzzyCount++;

          const vintagesA = wines.filter((w: any) => w.name === uniqueNames[i]).map((w: any) => w.vintage).sort();
          const vintagesB = wines.filter((w: any) => w.name === uniqueNames[j]).map((w: any) => w.vintage).sort();

          console.log(producer + ' (' + (sim * 100).toFixed(0) + '% similar):');
          console.log('  "' + uniqueNames[i] + '" — vintages: ' + vintagesA.join(', '));
          console.log('  "' + uniqueNames[j] + '" — vintages: ' + vintagesB.join(', '));
          console.log();
        }
      }
    }
  }
  console.log('Total fuzzy match groups: ' + fuzzyCount);
}

main().catch(console.error);
