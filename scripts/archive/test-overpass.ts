import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testQuery(name: string, id: number) {
  const query = `[out:json][timeout:60];\nrelation(${id});\n(._;>>;);\nout geom;`;
  const resp = await fetch('https://overpass.kumi.systems/api/interpreter', {
    method: 'POST',
    body: query,
    headers: { 'Content-Type': 'text/plain' },
  });
  const data = await resp.json();

  console.log(`\n=== ${name} (${id}) ===`);
  console.log(`Total elements: ${data.elements?.length}`);

  const relations = (data.elements || []).filter((e: any) => e.type === 'relation');
  const ways = (data.elements || []).filter((e: any) => e.type === 'way');
  const nodes = (data.elements || []).filter((e: any) => e.type === 'node');
  console.log(`  Relations: ${relations.length}, Ways: ${ways.length}, Nodes: ${nodes.length}`);

  for (const rel of relations.slice(0, 5)) {
    const outerWayMembers = (rel.members || []).filter((m: any) => m.type === 'way' && m.role === 'outer');
    const memberRelations = (rel.members || []).filter((m: any) => m.type === 'relation');
    const outerWithGeom = outerWayMembers.filter((m: any) => m.geometry && m.geometry.length >= 2);
    console.log(`  Rel ${rel.id} (${rel.tags?.name || 'no name'}): outer_ways=${outerWayMembers.length} (${outerWithGeom.length} with geom), member_rels=${memberRelations.length}`);
  }

  const waysWithGeom = ways.filter((w: any) => w.geometry && w.geometry.length >= 2);
  if (waysWithGeom.length > 0) {
    const lons = waysWithGeom.flatMap((w: any) => (w.geometry as any[]).map((p: any) => p.lon as number));
    const lats = waysWithGeom.flatMap((w: any) => (w.geometry as any[]).map((p: any) => p.lat as number));
    const minLon = lons.reduce((a, b) => a < b ? a : b, Infinity);
    const maxLon = lons.reduce((a, b) => a > b ? a : b, -Infinity);
    const minLat = lats.reduce((a, b) => a < b ? a : b, Infinity);
    const maxLat = lats.reduce((a, b) => a > b ? a : b, -Infinity);
    console.log(`  All way geom bounds: lng=[${minLon.toFixed(2)},${maxLon.toFixed(2)}] lat=[${minLat.toFixed(2)},${maxLat.toFixed(2)}]`);
  }
}

testQuery('Trentino-Alto Adige', 47284)
  .then(() => new Promise(r => setTimeout(r, 2000)))
  .then(() => testQuery('Tuscany', 40768))
  .catch(console.error);
