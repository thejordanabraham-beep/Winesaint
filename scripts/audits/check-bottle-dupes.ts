import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAYLOAD_URL = 'http://localhost:3000';

const SIZE_WINES = [
  { id: 12522, name: 'Sagrantino di Montefalco (3L)', cleanName: 'Sagrantino di Montefalco' },
  { id: 12062, name: 'Barolo Riserva Selezionata Brunata (magnum)', cleanName: 'Barolo Riserva Selezionata Brunata' },
  { id: 12057, name: 'Barolo Brunate (magnum)', cleanName: 'Barolo Brunate' },
  { id: 12048, name: 'Barolo Tre Tine (magnum)', cleanName: 'Barolo Tre Tine' },
  { id: 12047, name: 'Barolo Brunate (magnum)', cleanName: 'Barolo Brunate' },
  { id: 10831, name: 'Barolo (magnum)', cleanName: 'Barolo' },
  { id: 5306, name: '(Magnum)', cleanName: 'Petrus' },
  { id: 2909, name: 'Pinot Noir Kiser Vineyard Upper Block (Magnum)', cleanName: 'Pinot Noir Kiser Vineyard Upper Block' },
  { id: 2907, name: 'Pinot Noir Wendling Vineyard Suitcase Block (Magnum)', cleanName: 'Pinot Noir Wendling Vineyard Suitcase Block' },
  { id: 1349, name: 'Brut Nature Riesling (magnum)', cleanName: 'Brut Nature Riesling' },
];

async function main() {
  const loginRes = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.PAYLOAD_ADMIN_EMAIL, password: process.env.PAYLOAD_ADMIN_PASSWORD }),
  });
  const { token } = await loginRes.json();

  for (const sw of SIZE_WINES) {
    const wineRes = await fetch(`${PAYLOAD_URL}/api/wines/${sw.id}?depth=1`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const wine = await wineRes.json();
    const producerId = typeof wine.producer === 'object' ? wine.producer.id : wine.producer;
    const producerName = typeof wine.producer === 'object' ? wine.producer.name : String(wine.producer);
    const vintage = wine.vintage;

    // Search for standard-size counterpart
    const searchRes = await fetch(
      `${PAYLOAD_URL}/api/wines?where[producer][equals]=${producerId}&where[vintage][equals]=${vintage}&where[name][equals]=${encodeURIComponent(sw.cleanName)}&limit=10&depth=0`,
      { headers: { Authorization: `JWT ${token}` } },
    );
    const searchData = await searchRes.json();
    const standardVersions = (searchData.docs || []).filter((d: any) => d.id !== sw.id);

    const hasStandard = standardVersions.length > 0;
    const action = hasStandard ? 'DELETE (has standard version)' : 'RENAME (no standard version)';

    console.log(`\n${action}: ID=${sw.id} "${sw.name}" ${vintage} (${producerName})`);
    if (hasStandard) {
      for (const sv of standardVersions) {
        console.log(`  Standard: ID=${sv.id} "${sv.name}" ${sv.vintage}`);
      }
    } else {
      console.log(`  Would rename to: "${sw.cleanName}"`);
    }
  }
}

main().catch(console.error);
