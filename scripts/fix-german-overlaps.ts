import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
// @ts-ignore
import turfConcave from '@turf/concave';
// @ts-ignore
import turfConvex from '@turf/convex';
// @ts-ignore
import { featureCollection, point } from '@turf/helpers';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const BOUNDARY_DIR = path.join(process.cwd(), 'data', 'boundaries');
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

// Only re-run the regions with overlap issues
const REGIONS: Array<{ slug: string; name: string; bbox: [number, number, number, number] }> = [
  // Rheingau: Rhine flows at ~49.97N; old south=49.85 grabbed Rheinhessen vineyards
  { slug: 'rheingau', name: 'Rheingau', bbox: [7.80, 49.97, 8.30, 50.25] },
  // Hessische Bergstrasse: narrow strip at ~8.6E between Heidelberg and Darmstadt
  { slug: 'hessische-bergstrasse', name: 'Hessische Bergstrasse', bbox: [8.47, 49.42, 8.78, 49.90] },
  // Baden: cap north at 49.42 to avoid Bergstrasse overlap
  { slug: 'baden', name: 'Baden', bbox: [7.3, 47.3, 9.6, 49.42] },
];

async function fetchVineyardsInBbox(bbox: [number, number, number, number], name: string) {
  const [west, south, east, north] = bbox;
  const query = `[out:json][timeout:120];
(
  way["landuse"="vineyard"](${south},${west},${north},${east});
  relation["landuse"="vineyard"](${south},${west},${north},${east});
);
out geom;`;
  console.log(`  Querying Overpass for ${name}...`);
  const encoded = encodeURIComponent(query);
  const res = await fetch(`${OVERPASS_URL}?data=${encoded}`);
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  const data = await res.json();
  return data.elements || [];
}

function buildConcaveHull(elements: any[], name: string) {
  const pts: any[] = [];
  for (const el of elements) {
    if (el.type === 'way' && el.geometry) {
      for (let i = 0; i < el.geometry.length; i += 2) {
        const { lat, lon } = el.geometry[i];
        if (lon && lat) pts.push(point([lon, lat]));
      }
    } else if (el.type === 'relation' && el.members) {
      for (const m of el.members) {
        if (m.geometry) {
          for (let i = 0; i < m.geometry.length; i += 2) {
            const { lat, lon } = m.geometry[i];
            if (lon && lat) pts.push(point([lon, lat]));
          }
        }
      }
    }
  }
  console.log(`  ${pts.length} points collected`);
  if (pts.length < 3) return null;
  const fc = featureCollection(pts);
  let result: any = null;
  for (const maxEdge of [8, 15, 30]) {
    try {
      result = turfConcave(fc, { maxEdge, units: 'kilometers' });
      if (result?.geometry) {
        console.log(`  Concave hull (maxEdge=${maxEdge}km) type=${result.geometry.type}`);
        break;
      }
    } catch { /* try next */ }
  }
  if (!result?.geometry) {
    try {
      result = turfConvex(fc);
      if (result?.geometry) console.log('  Convex hull fallback');
    } catch { /* skip */ }
  }
  return result?.geometry || null;
}

function simplify(geo: any, maxPts = 400): any {
  if (!geo?.coordinates) return geo;
  const simplifyRing = (ring: number[][]): number[][] => {
    if (ring.length <= maxPts) return ring;
    const step = Math.ceil(ring.length / maxPts);
    const s = ring.filter((_: any, i: number) => i % step === 0);
    if (JSON.stringify(s[0]) !== JSON.stringify(s[s.length - 1])) s.push(s[0]);
    return s;
  };
  if (geo.type === 'Polygon') return { ...geo, coordinates: geo.coordinates.map(simplifyRing) };
  if (geo.type === 'MultiPolygon') return { ...geo, coordinates: geo.coordinates.map((p: number[][][]) => p.map(simplifyRing)) };
  return geo;
}

async function uploadBoundary(slug: string, geo: any) {
  const app = await sanity.fetch(
    `*[_type == "appellation" && slug.current == $slug][0]{ _id, name }`,
    { slug }
  );
  if (!app) { console.log(`  No Sanity record: ${slug}`); return; }
  await sanity.patch(app._id).set({ boundaries: { _type: 'geoJSON', geometry: geo, properties: {} } }).commit();
  console.log(`  Uploaded: ${app.name}`);
}

async function run() {
  for (const region of REGIONS) {
    console.log(`\n=== ${region.name} ===`);
    try {
      const elements = await fetchVineyardsInBbox(region.bbox, region.name);
      console.log(`  ${elements.length} OSM elements`);
      if (!elements.length) { console.log('  No data, skipping'); continue; }
      const geo = buildConcaveHull(elements, region.name);
      if (!geo) continue;
      const simplified = simplify(geo, 400);
      fs.writeFileSync(
        path.join(BOUNDARY_DIR, `${region.slug}.geojson`),
        JSON.stringify({ type: 'Feature', geometry: simplified, properties: {} }, null, 2)
      );
      await uploadBoundary(region.slug, simplified);
    } catch (err) {
      console.error(`  Error for ${region.name}:`, err);
    }
    await new Promise(r => setTimeout(r, 3000));
  }
  console.log('\nDone!');
}

run().catch(console.error);
