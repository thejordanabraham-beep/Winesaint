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

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const BOUNDARY_DIR = path.join(process.cwd(), 'data', 'boundaries');

// Württemberg: Neckar/Stuttgart corridor, 8.85–10.05E, 48.4–49.55N
const bbox: [number,number,number,number] = [8.85, 48.40, 10.05, 49.55];
const [west, south, east, north] = bbox;

const query = `[out:json][timeout:180];
(
  way["landuse"="vineyard"](${south},${west},${north},${east});
  relation["landuse"="vineyard"](${south},${west},${north},${east});
);
out geom;`;

async function run() {
  console.log('Fetching Württemberg vineyards...');
  const res = await fetch(`${OVERPASS_URL}?data=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  const data = await res.json();
  const elements = data.elements || [];
  console.log(`${elements.length} elements`);

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
  console.log(`${pts.length} points`);

  const fc = featureCollection(pts);
  let result: any = null;
  for (const maxEdge of [8, 15, 30]) {
    try {
      result = turfConcave(fc, { maxEdge, units: 'kilometers' });
      if (result?.geometry) { console.log(`Concave hull maxEdge=${maxEdge}, type=${result.geometry.type}`); break; }
    } catch {}
  }
  if (!result?.geometry) { result = turfConvex(fc); console.log('Convex fallback'); }

  const geo = result.geometry;
  const simplifyRing = (ring: number[][]): number[][] => {
    if (ring.length <= 400) return ring;
    const step = Math.ceil(ring.length / 400);
    const s = ring.filter((_: any, i: number) => i % step === 0);
    if (JSON.stringify(s[0]) !== JSON.stringify(s[s.length-1])) s.push(s[0]);
    return s;
  };
  const simplified = geo.type === 'Polygon'
    ? { ...geo, coordinates: geo.coordinates.map(simplifyRing) }
    : { ...geo, coordinates: geo.coordinates.map((p: any) => p.map(simplifyRing)) };

  fs.writeFileSync(path.join(BOUNDARY_DIR, 'wurttemberg.geojson'),
    JSON.stringify({ type: 'Feature', geometry: simplified, properties: {} }, null, 2));

  const app = await sanity.fetch(`*[_type=="appellation"&&slug.current=="wurttemberg"][0]{_id,name}`);
  await sanity.patch(app._id).set({ boundaries: { _type: 'geoJSON', geometry: simplified, properties: {} } }).commit();
  console.log(`Uploaded: ${app.name}`);
}
run().catch(console.error);
