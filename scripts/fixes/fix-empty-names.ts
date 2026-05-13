import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAYLOAD_URL = 'http://localhost:3000';

const ID_NAME_MAP: Record<number, string> = {
  107: 'Châteauneuf-du-Pape', // Château La Nerthe
  108: 'Châteauneuf-du-Pape', // Château Mont-Redon
  109: 'Châteauneuf-du-Pape', // Château Rayas
  111: 'Châteauneuf-du-Pape', // Château de Beaucastel
  113: 'Château-Grillet',     // Château-Grillet
  114: 'Châteauneuf-du-Pape', // Clos Saint-Jean
  115: 'Châteauneuf-du-Pape', // Clos des Papes
  116: 'Châteauneuf-du-Pape', // Clos du Mont-Olivet
  119: 'Châteauneuf-du-Pape', // Domaine Charvin
  120: 'Châteauneuf-du-Pape', // Domaine Henri Bonneau
  122: 'Châteauneuf-du-Pape', // Domaine de la Janasse
  128: 'Châteauneuf-du-Pape', // Le Clos du Caillou
  129: 'Châteauneuf-du-Pape', // Le Vieux Donjon
  232: 'Teroldego',           // Foradori
};

async function main() {
  const loginRes = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.PAYLOAD_ADMIN_EMAIL, password: process.env.PAYLOAD_ADMIN_PASSWORD }),
  });
  const { token } = await loginRes.json();

  const res = await fetch(`${PAYLOAD_URL}/api/wines?where[name][equals]=&limit=200&depth=1`, {
    headers: { Authorization: `JWT ${token}` },
  });
  const data = await res.json();
  console.log(`Empty-name wines found: ${data.totalDocs}`);

  const DRY_RUN = process.argv.includes('--dry-run');
  if (DRY_RUN) console.log('DRY RUN\n');

  let success = 0;
  let skipped = 0;
  let errors = 0;

  for (const w of data.docs) {
    const producer = typeof w.producer === 'object' ? w.producer.name : 'Unknown';
    const producerId = typeof w.producer === 'object' ? w.producer.id : 0;
    const newName = ID_NAME_MAP[producerId];

    if (!newName) {
      console.log(`  ? Skipped wine ${w.id} — unmapped producer "${producer}" (ID ${producerId})`);
      skipped++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`  → Would set wine ${w.id} (${producer} ${w.vintage}): "" → "${newName}"`);
      success++;
      continue;
    }

    const patchRes = await fetch(`${PAYLOAD_URL}/api/wines/${w.id}`, {
      method: 'PATCH',
      headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });

    if (patchRes.ok) {
      console.log(`  ✓ Wine ${w.id} (${producer} ${w.vintage}): "" → "${newName}"`);
      success++;
    } else {
      console.log(`  ✗ Wine ${w.id}: PATCH failed`);
      errors++;
    }
  }

  console.log(`\nSuccess: ${success}, Skipped: ${skipped}, Errors: ${errors}`);
}

main().catch(console.error);
