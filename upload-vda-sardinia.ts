import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Try to find the correct OSM relation IDs for these two regions
// Valle d'Aosta (Regione autonoma): OSM relation 43076? No - let's use Nominatim
// Sardinia: Let's try OSM relation IDs known to be correct

const OVERPASS_URL = 'https://overpass.kumi.systems/api/interpreter';

async function tryRelationId(id: number, name: string) {
  const query = `[out:json][timeout:60];\nrelation(${id});\n(._;>>;);\nout geom;`;
  const resp = await fetch(OVERPASS_URL, {
    method: 'POST', body: query,
    headers: { 'Content-Type': 'text/plain' },
  });
  if (!resp.ok) { console.log(`  ${name} (${id}): HTTP ${resp.status}`); return null; }
  const data = await resp.json();
  const relations = data.elements?.filter((e: any) => e.type === 'relation') || [];
  if (relations.length === 0) return null;
  const rel = relations[0];
  console.log(`  ${name} (${id}): "${rel.tags?.name}" admin_level=${rel.tags?.admin_level}`);
  return data;
}

async function run() {
  // Known correct IDs from OSM for Italian regions
  // Valle d'Aosta: try 43076, 3604688 etc
  // Sardinia: try 7190409
  console.log("Testing relation IDs for Valle d'Aosta:");
  for (const id of [43076, 3604688, 3604690]) {
    await tryRelationId(id, "Valle d'Aosta");
    await new Promise(r => setTimeout(r, 1500));
  }
  
  console.log("\nTesting relation IDs for Sardinia:");
  for (const id of [7190409, 7190408, 3604699, 3747727, 45652]) {
    await tryRelationId(id, 'Sardinia');
    await new Promise(r => setTimeout(r, 1500));
  }
}
run().catch(console.error);
