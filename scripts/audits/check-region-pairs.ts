import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAYLOAD_URL = 'http://localhost:3000';

const PAIRS = [
  [680, 1356, 'Bernkasteler Doctor'],
  [688, 1361, 'Erdener Prälat'],
  [710, 1379, 'Karthäuserhofberg'],
  [739, 1391, 'Scharzhofberger'],
  [754, 1373, 'Wehlener Sonnenuhr'],
  [1005, 1414, 'Barbaresco'],
  [1008, 1418, 'Barolo'],
  [1063, 1069, 'Columbia Gorge'],
  [1064, 1070, 'Columbia Valley'],
  [1067, 1549, 'Walla Walla Valley'],
];

async function main() {
  const loginRes = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.PAYLOAD_ADMIN_EMAIL, password: process.env.PAYLOAD_ADMIN_PASSWORD }),
  });
  const { token } = await loginRes.json();

  for (const [id1, id2, label] of PAIRS) {
    const r1 = await (await fetch(`${PAYLOAD_URL}/api/regions/${id1}?depth=1`, { headers: { Authorization: `JWT ${token}` } })).json();
    const r2 = await (await fetch(`${PAYLOAD_URL}/api/regions/${id2}?depth=1`, { headers: { Authorization: `JWT ${token}` } })).json();

    const p1 = typeof r1.parentRegion === 'object' ? r1.parentRegion.name : String(r1.parentRegion || 'none');
    const p2 = typeof r2.parentRegion === 'object' ? r2.parentRegion.name : String(r2.parentRegion || 'none');

    const c1 = (await (await fetch(`${PAYLOAD_URL}/api/wines?where[region][equals]=${id1}&limit=1&depth=0`, { headers: { Authorization: `JWT ${token}` } })).json()).totalDocs;
    const c2 = (await (await fetch(`${PAYLOAD_URL}/api/wines?where[region][equals]=${id2}&limit=1&depth=0`, { headers: { Authorization: `JWT ${token}` } })).json()).totalDocs;

    const same = p1 === p2 ? 'MERGE' : 'DIFFERENT';
    console.log(`${same}: "${r1.name}" (ID ${id1}, parent=${p1}, ${c1}w) vs "${r2.name}" (ID ${id2}, parent=${p2}, ${c2}w)`);
  }
}

main().catch(console.error);
