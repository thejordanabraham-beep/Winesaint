import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAYLOAD_URL = 'http://localhost:3000';

const FIXES: Record<number, string> = {
  // Le Clos du Caillou
  6317: 'Côtes du Rhône Bouquet Des Garrigues',
  6316: 'Côtes du Rhône Réserve',
  6315: 'Côtes du Rhône Les Quartz',
  6309: 'Côtes du Rhône Bouquet Des Garrigues Blanc',
  6308: 'Côtes du Rhône Réserve Blanc',
  // Franck Balthazar
  6189: 'Côtes-du-Rhône',
  6186: 'Côtes-du-Rhône',
  // Domaine du Coulet
  6066: 'Pettit Ours Brun Côtes du Rhône Rouge',
  // Fonsalette
  5611: 'Château de Fonsalette Côtes du Rhône',
  5606: 'Château de Fonsalette Côtes du Rhône',
  5601: 'Château de Fonsalette Côtes du Rhône',
  5600: 'Château de Fonsalette Côtes du Rhône',
  5596: 'Château de Fonsalette Côtes du Rhône',
  5592: 'Château de Fonsalette Côtes du Rhône',
  5585: 'Château de Fonsalette Côtes du Rhône Blanc',
  5584: 'Château de Fonsalette Côtes du Rhône',
  5578: 'Château de Fonsalette Côtes du Rhône Blanc',
  5577: 'Château de Fonsalette Côtes du Rhône',
  // Pavie
  5249: 'Castillon-Côtes de Bordeaux',
};

async function main() {
  const loginRes = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.PAYLOAD_ADMIN_EMAIL, password: process.env.PAYLOAD_ADMIN_PASSWORD }),
  });
  const { token } = await loginRes.json();

  let success = 0;
  let errors = 0;

  for (const [idStr, newName] of Object.entries(FIXES)) {
    const id = Number(idStr);
    const currentRes = await fetch(`${PAYLOAD_URL}/api/wines/${id}?depth=0`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const current = await currentRes.json();

    const res = await fetch(`${PAYLOAD_URL}/api/wines/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });

    if (res.ok) {
      console.log(`✓ ${id}: "${current.name}" → "${newName}"`);
      success++;
    } else {
      console.log(`✗ ${id}: PATCH failed`);
      errors++;
    }
  }

  console.log(`\nSuccess: ${success}, Errors: ${errors}`);
}

main().catch(console.error);
