import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const OVERPASS_URL = 'https://overpass.kumi.systems/api/interpreter';

async function findRegions() {
  const query = `[out:json][timeout:30];
area["ISO3166-1"="IT"]->.country;
relation["boundary"="administrative"]["admin_level"="4"](area.country);
out tags;`;
  const resp = await fetch(OVERPASS_URL, {
    method: 'POST', body: query,
    headers: { 'Content-Type': 'text/plain' },
  });
  const data = await resp.json();
  console.log('All Italian admin_level=4 regions:');
  for (const el of (data.elements || [])) {
    const nameEn = el.tags && el.tags['name:en'];
    console.log(`  ${el.id}: ${el.tags?.name} (en: ${nameEn || 'n/a'})`);
  }
}
findRegions().catch(console.error);
