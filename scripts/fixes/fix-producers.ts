import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAYLOAD_URL = 'http://localhost:3000';

async function login() {
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.PAYLOAD_ADMIN_EMAIL, password: process.env.PAYLOAD_ADMIN_PASSWORD }),
  });
  return (await res.json()).token;
}

async function reassignWines(token: string, fromProducerId: number, toProducerId: number) {
  let page = 1;
  let moved = 0;
  while (true) {
    const res = await fetch(`${PAYLOAD_URL}/api/wines?where[producer][equals]=${fromProducerId}&limit=100&page=${page}&depth=0`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) break;

    for (const w of data.docs) {
      const patchRes = await fetch(`${PAYLOAD_URL}/api/wines/${w.id}`, {
        method: 'PATCH',
        headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ producer: toProducerId }),
      });
      if (patchRes.ok) {
        console.log(`  ✓ Wine ${w.id} "${w.name}" ${w.vintage} → producer ${toProducerId}`);
        moved++;
      } else {
        console.log(`  ✗ Wine ${w.id} PATCH failed`);
      }
    }

    if (!data.hasNextPage) break;
    page++;
  }
  return moved;
}

async function main() {
  const token = await login();

  // 1. ROUMIER: Merge "Christophe Roumier (Domaine Georges Roumier)" (136) → "Georges Roumier" (152)
  console.log('=== ROUMIER MERGE ===');
  console.log('Moving wines from producer 136 → 152');
  const roumierMoved = await reassignWines(token, 136, 152);
  console.log(`Moved ${roumierMoved} wines`);

  // Delete empty producer
  const delRes = await fetch(`${PAYLOAD_URL}/api/producers/136`, {
    method: 'DELETE',
    headers: { Authorization: `JWT ${token}` },
  });
  console.log(`Delete producer 136: ${delRes.ok ? '✓' : '✗'}`);

  // 2. TERRE NERE: Move Etna wines from "Terre Nere" (209) to "Tenuta delle Terre Nere" (208)
  console.log('\n=== TERRE NERE FIX ===');

  // First, move Etna wines (Rosato, Rosato Etna) from 209 → 208
  const etnaWineRes = await fetch(`${PAYLOAD_URL}/api/wines?where[producer][equals]=209&limit=100&depth=1`, {
    headers: { Authorization: `JWT ${token}` },
  });
  const etnaData = await etnaWineRes.json();
  for (const w of etnaData.docs) {
    const region = typeof w.region === 'object' ? w.region.name : '';
    const isEtna = region.toLowerCase().includes('etna') || w.name.toLowerCase().includes('etna') || w.name === 'Rosato';
    if (isEtna) {
      const patchRes = await fetch(`${PAYLOAD_URL}/api/wines/${w.id}`, {
        method: 'PATCH',
        headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ producer: 208 }),
      });
      console.log(`  ✓ Etna wine ${w.id} "${w.name}" → Tenuta delle Terre Nere (208): ${patchRes.ok}`);
    }
  }

  // Merge remaining "Terre Nere" (209) into "Terre Nere Campigli Vallone" (210)
  // since both are Montalcino wines
  console.log('\nMerging remaining Terre Nere (209) → Terre Nere Campigli Vallone (210)');
  const tnMoved = await reassignWines(token, 209, 210);
  console.log(`Moved ${tnMoved} wines`);

  if (tnMoved > 0 || true) {
    // Delete empty producer 209
    const delTn = await fetch(`${PAYLOAD_URL}/api/producers/209`, {
      method: 'DELETE',
      headers: { Authorization: `JWT ${token}` },
    });
    console.log(`Delete producer 209: ${delTn.ok ? '✓' : '✗'}`);
  }

  // 3. Fix "Brunelllo" typo (triple L) in wine 10298
  console.log('\n=== TYPO FIX ===');
  const typoRes = await fetch(`${PAYLOAD_URL}/api/wines/10298`, {
    method: 'PATCH',
    headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Brunello di Montalcino Capriolo' }),
  });
  console.log(`Wine 10298 "Brunelllo" → "Brunello": ${typoRes.ok ? '✓' : '✗'}`);

  console.log('\nDone.');
}

main().catch(console.error);
