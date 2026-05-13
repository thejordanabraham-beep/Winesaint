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

function scoreConventionMatch(candidateName: string, allProducerNames: string[]): number {
  const candidateNorm = normalize(candidateName);
  const candidateWords = candidateNorm.split(' ');
  if (candidateWords.length < 2) return 0;

  let score = 0;

  // Check word-order patterns against other wines from same producer
  for (const other of allProducerNames) {
    const otherNorm = normalize(other);
    const otherWords = otherNorm.split(' ');

    // Check if first word matches pattern (e.g., does producer put grape first?)
    if (candidateWords[0] === otherWords[0]) score += 2;

    // Check bigram overlap (consecutive word pairs)
    for (let i = 0; i < candidateWords.length - 1; i++) {
      const bigram = candidateWords[i] + ' ' + candidateWords[i + 1];
      for (let j = 0; j < otherWords.length - 1; j++) {
        if (otherWords[j] + ' ' + otherWords[j + 1] === bigram) score += 1;
      }
    }

    // Check specific patterns
    // German: "Riesling [vineyard]" vs "[vineyard] Riesling"
    const grapes = ['riesling', 'spatburgunder', 'weissburgunder', 'silvaner', 'gewurztraminer', 'auxerrois'];
    for (const grape of grapes) {
      const candIdx = candidateWords.indexOf(grape);
      const otherIdx = otherWords.indexOf(grape);
      if (candIdx >= 0 && otherIdx >= 0 && candIdx === otherIdx) score += 3;
    }

    // Italian: "Riserva" position
    const riservaCandIdx = candidateWords.indexOf('riserva');
    const riservaOtherIdx = otherWords.indexOf('riserva');
    if (riservaCandIdx >= 0 && riservaOtherIdx >= 0) {
      // Check relative position (e.g., right after appellation vs at end)
      const candRelative = riservaCandIdx / candidateWords.length;
      const otherRelative = riservaOtherIdx / otherWords.length;
      if (Math.abs(candRelative - otherRelative) < 0.2) score += 3;
    }

    // "Blanc/Rosato/Rosé" position
    const colorWords = ['blanc', 'rosato', 'rose', 'bianco'];
    for (const cw of colorWords) {
      const candIdx2 = candidateWords.indexOf(cw);
      const otherIdx2 = otherWords.indexOf(cw);
      if (candIdx2 >= 0 && otherIdx2 >= 0 && candIdx2 === otherIdx2) score += 3;
    }
  }

  return score;
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
  console.log('Total wines: ' + allWines.length);

  const byProducer = new Map<string, any[]>();
  for (const w of allWines) {
    const producer = typeof w.producer === 'object' ? w.producer.name : 'Unknown';
    if (!byProducer.has(producer)) byProducer.set(producer, []);
    byProducer.get(producer)!.push(w);
  }

  // Manual overrides where convention scoring gets it wrong
  const overrides: Record<string, string> = {
    // "Two Wolves" is the vineyard name — don't split it
    'Paul Lato|sauvignon blanc o mio ole sole two vineyard wolves': 'Sauvignon Blanc Two Wolves Vineyard O Sole Mio',
    // Blanc should follow the appellation, not lead
    'Thibault Liger-Belair|blanc clos de les beaune savigny village': 'Savigny-lès-Beaune Clos de Village Blanc',
    // Simpler format, 2 wines vs 1
    'Domaine Charvin|cotes du rhone rose': 'Côtes-du-Rhône Rosé',
  };

  // Find reorder groups
  const renames: { id: number; oldName: string; newName: string; producer: string }[] = [];
  let groupNum = 0;

  for (const [producer, wines] of byProducer) {
    const sortedGroups = new Map<string, any[]>();
    for (const w of wines) {
      const sorted = sortedWords(w.name);
      if (!sortedGroups.has(sorted)) sortedGroups.set(sorted, []);
      sortedGroups.get(sorted)!.push(w);
    }

    // All wine names from this producer (for convention matching)
    const allNames = wines.map((w: any) => w.name);

    for (const [_, group] of sortedGroups) {
      const uniqueNames = [...new Set(group.map((w: any) => w.name))];
      const uniqueNorm = [...new Set(uniqueNames.map(n => normalize(n)))];
      if (uniqueNorm.length <= 1) continue;

      groupNum++;

      // Score each variant against the producer's convention
      const variantScores = uniqueNames.map(name => {
        // Exclude this group's wines from convention check to avoid self-reference
        const otherNames = allNames.filter(n => !uniqueNames.includes(n));
        const conventionScore = scoreConventionMatch(name, otherNames);
        const count = group.filter((w: any) => w.name === name).length;
        return { name, conventionScore, count, totalScore: conventionScore + count * 2 };
      });

      variantScores.sort((a, b) => b.totalScore - a.totalScore);

      // Check for manual override
      const overrideKey = producer + '|' + sortedWords(uniqueNames[0]);
      const keepName = overrides[overrideKey] || variantScores[0].name;

      console.log(`\n[${groupNum}] ${producer}`);
      for (const vs of variantScores) {
        const winesForName = group.filter((w: any) => w.name === vs.name);
        const vintages = winesForName.map((w: any) => w.vintage).sort().join(', ');
        const marker = vs.name === keepName ? '  ✓ KEEP' : '  ✗ RENAME';
        console.log(`${marker}: "${vs.name}" (${vs.count} wines, convention: ${vs.conventionScore}) — vintages: ${vintages}`);
      }

      // Queue renames
      for (const vs of variantScores) {
        if (vs.name === keepName) continue;
        const winesForName = group.filter((w: any) => w.name === vs.name);
        for (const w of winesForName) {
          renames.push({ id: w.id, oldName: w.name, newName: keepName, producer });
        }
      }
    }
  }

  // Also fix the 2 region issues
  // Le Clos du Caillou: ID with "Rosé Le Caillou (Côtes-du-Rhone)" in CdP region -> should be CdR
  // Château Pierre-Bise: ID with "Côteaux du Layon 1er Cru Chaume" in Savennières -> should be Coteaux du Layon

  console.log('\n\n=== RENAME PLAN ===');
  console.log('Total renames: ' + renames.length);
  console.log();

  // Execute renames
  const DRY_RUN = process.argv.includes('--dry-run');
  if (DRY_RUN) {
    console.log('DRY RUN — no changes made');
    for (const r of renames) {
      console.log(`  Wine ID ${r.id}: "${r.oldName}" → "${r.newName}" (${r.producer})`);
    }
    return;
  }

  let success = 0;
  let errors = 0;
  for (const r of renames) {
    const res = await fetch(`${PAYLOAD_URL}/api/wines/${r.id}`, {
      method: 'PATCH',
      headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: r.newName }),
    });
    if (res.ok) {
      console.log(`  ✓ Wine ID ${r.id}: "${r.oldName}" → "${r.newName}"`);
      success++;
    } else {
      console.log(`  ✗ Wine ID ${r.id}: PATCH failed`);
      errors++;
    }
  }

  console.log('\nSuccess: ' + success + ', Errors: ' + errors);
}

main().catch(console.error);
