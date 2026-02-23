import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config({ path: '.env.local' });

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const OVERPASS_URL = 'https://overpass.kumi.systems/api/interpreter';

async function fetchByName(name: string, countryCode: string) {
  const query = `
[out:json][timeout:60];
area["ISO3166-1"="${countryCode}"]->.country;
(
  relation["name"="${name}"]["boundary"="administrative"]["admin_level"="4"](area.country);
  relation["name"="${name}"]["boundary"="administrative"](area.country);
  relation["name"="${name}"]["place"="region"](area.country);
);
(._;>>;);
out geom;
  `.trim();
  const resp = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: query,
    headers: { 'Content-Type': 'text/plain' },
  });
  if (!resp.ok) throw new Error(`Overpass ${resp.status}`);
  return resp.json();
}

function bboxArea(ring: number[][]) {
  const lons = ring.map(p => p[0]);
  const lats = ring.map(p => p[1]);
  return (Math.max(...lons) - Math.min(...lons)) * (Math.max(...lats) - Math.min(...lats));
}

function osmToGeoJSON(osmData: any): any {
  if (!osmData?.elements?.length) return null;
  const wayGeomById = new Map<number, number[][]>();
  for (const el of osmData.elements) {
    if (el.type === 'way' && el.geometry) {
      wayGeomById.set(el.id, el.geometry.map((p: any) => [p.lon, p.lat]));
    }
  }
  const outerWaySet = new Set<number>();
  const outerWays: number[][][] = [];
  for (const el of osmData.elements) {
    if (el.type !== 'relation' || !el.members) continue;
    for (const m of el.members) {
      if (m.role !== 'outer') continue;
      if (m.type === 'way') {
        if (outerWaySet.has(m.ref)) continue;
        outerWaySet.add(m.ref);
        const geom = m.geometry
          ? m.geometry.map((p: any) => [p.lon, p.lat])
          : wayGeomById.get(m.ref);
        if (geom && geom.length >= 2) outerWays.push(geom);
      }
    }
  }
  if (!outerWays.length) return null;
  
  const dp = (a: number[], b: number[]) =>
    Math.sqrt(Math.pow(a[0]-b[0],2) + Math.pow(a[1]-b[1],2));
  const THRESH = 0.0005;
  const rings: number[][][] = [];
  let remaining = outerWays.map(w => [...w]);
  while (remaining.length > 0) {
    let ring: number[][] = [...remaining.shift()!];
    let changed = true;
    while (changed) {
      changed = false;
      if (ring.length > 4 && dp(ring[0], ring[ring.length-1]) < THRESH) break;
      for (let i = 0; i < remaining.length; i++) {
        const way = remaining[i];
        const last = ring[ring.length-1];
        if (dp(last, way[0]) < THRESH) {
          ring.push(...way.slice(1)); remaining.splice(i,1); changed=true; break;
        } else if (dp(last, way[way.length-1]) < THRESH) {
          ring.push(...[...way].reverse().slice(1)); remaining.splice(i,1); changed=true; break;
        }
      }
    }
    if (ring.length >= 4) {
      if (dp(ring[0], ring[ring.length-1]) >= THRESH) ring.push(ring[0]);
      rings.push(ring);
    }
  }
  
  const simplified = rings.map(r => {
    const step = Math.max(1, Math.floor(r.length / 350));
    const s = r.filter((_: any, i: number) => i % step === 0);
    if (JSON.stringify(s[0]) !== JSON.stringify(s[s.length-1])) s.push(s[0]);
    return s;
  }).filter(r => r.length >= 4);
  
  simplified.sort((a, b) => bboxArea(b) - bboxArea(a));
  const mainArea = bboxArea(simplified[0]);
  const filtered = simplified.filter(r => bboxArea(r) >= mainArea * 0.005);
  
  if (filtered.length === 1) return { type: 'Polygon', coordinates: [filtered[0]] };
  return { type: 'MultiPolygon', coordinates: filtered.map(r => [r]) };
}

async function uploadBoundary(slug: string, geoJSON: any, name: string) {
  const r = await sanity.fetch(`*[_type == 'appellation' && slug.current == $s][0]{ _id }`, { s: slug });
  if (!r) { console.log(`  NOT FOUND: ${slug}`); return; }
  await sanity.patch(r._id).set({
    boundaries: { _type: 'geoJSON', geometry: geoJSON, properties: {} }
  }).commit();
  const pts = geoJSON.type === 'Polygon' ? geoJSON.coordinates[0].length : geoJSON.coordinates.reduce((s: number, p: any) => s + p[0].length, 0);
  console.log(`  ✅ ${name}: ${pts} pts uploaded`);
}

async function run() {
  // Valle d'Aosta — try alternate names
  console.log("Trying Valle d'Aosta...");
  for (const n of ["Valle d'Aosta", "Valle d'Aosta/Vallée d'Aoste", "Aoste", "Aosta Valley"]) {
    try {
      const data = await fetchByName(n, 'IT');
      const geo = osmToGeoJSON(data);
      if (geo) {
        const pts = geo.type === 'Polygon' ? geo.coordinates[0].length : geo.coordinates.reduce((s: number, p: any) => s + p[0].length, 0);
        const lons = (geo.type === 'Polygon' ? geo.coordinates[0] : geo.coordinates[0][0]).map((c: number[]) => c[0]);
        const lats = (geo.type === 'Polygon' ? geo.coordinates[0] : geo.coordinates[0][0]).map((c: number[]) => c[1]);
        console.log(`  "${n}": ${pts} pts, lng=[${Math.min(...lons).toFixed(2)},${Math.max(...lons).toFixed(2)}] lat=[${Math.min(...lats).toFixed(2)},${Math.max(...lats).toFixed(2)}]`);
        const expectedRange = Math.min(...lons) > 6 && Math.max(...lons) < 8 && Math.max(...lats) > 45;
        if (expectedRange) {
          await uploadBoundary('valle-daosta', geo, "Valle d'Aosta");
          fs.writeFileSync('data/boundaries/valle-daosta.geojson', JSON.stringify({ type: 'Feature', geometry: geo, properties: {} }, null, 2));
          break;
        }
      } else {
        console.log(`  "${n}": no data`);
      }
    } catch(e: any) {
      console.log(`  "${n}": error ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 2000));
  }

  // Sardinia — try alternate names  
  console.log("\nTrying Sardinia...");
  for (const n of ["Sardegna", "Sardinia", "Sardegna/Sardigna"]) {
    try {
      const data = await fetchByName(n, 'IT');
      const geo = osmToGeoJSON(data);
      if (geo) {
        const pts = geo.type === 'Polygon' ? geo.coordinates[0].length : geo.coordinates.reduce((s: number, p: any) => s + p[0].length, 0);
        const lons = (geo.type === 'Polygon' ? geo.coordinates[0] : geo.coordinates[0][0]).map((c: number[]) => c[0]);
        const lats = (geo.type === 'Polygon' ? geo.coordinates[0] : geo.coordinates[0][0]).map((c: number[]) => c[1]);
        console.log(`  "${n}": ${pts} pts, lng=[${Math.min(...lons).toFixed(2)},${Math.max(...lons).toFixed(2)}] lat=[${Math.min(...lats).toFixed(2)},${Math.max(...lats).toFixed(2)}]`);
        const expectedRange = Math.min(...lons) > 7 && Math.max(...lons) < 11 && Math.min(...lats) < 40;
        if (expectedRange) {
          await uploadBoundary('sardinia', geo, 'Sardinia');
          fs.writeFileSync('data/boundaries/sardinia.geojson', JSON.stringify({ type: 'Feature', geometry: geo, properties: {} }, null, 2));
          break;
        }
      } else {
        console.log(`  "${n}": no data`);
      }
    } catch(e: any) {
      console.log(`  "${n}": error ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 2000));
  }
}
run().catch(console.error);
