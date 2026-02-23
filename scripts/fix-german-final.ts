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

// [west, south, east, north]
const REGIONS: Array<{ slug: string; name: string; bbox: [number, number, number, number]; notes: string }> = [
  {
    slug: 'rheingau',
    name: 'Rheingau',
    // Rheingau is ONLY the south-facing Rhine slope between Rüdesheim and Hochheim.
    // Rhine flows at ~49.97N here. Hillside extends only ~10km north to ~50.07N.
    // Previous north=50.25 was pulling in Frankfurt suburbs and Taunus foothills.
    bbox: [7.88, 49.97, 8.40, 50.08],
    notes: 'Tight north=50.08 captures only Rhine slope, excludes Frankfurt/Taunus',
  },
  {
    slug: 'wurttemberg',
    name: 'Württemberg',
    // Reference shows Württemberg tightly in the Stuttgart/Neckar corridor.
    // Reduce east boundary from 10.05 → 9.85 (Göppingen area, not all the way to Aalen).
    // Reduce north from 49.55 → 49.35 to not bleed into Hessische Bergstrasse area.
    bbox: [8.85, 48.40, 9.85, 49.35],
    notes: 'Tighter east+north to hug Stuttgart/Neckar corridor',
  },
  {
    slug: 'hessische-bergstrasse',
    name: 'Hessische Bergstrasse',
    // Keep narrow Bergstrasse strip but ensure it doesn't extend too far south
    // to avoid merging with Württemberg or Baden near Heidelberg.
    bbox: [8.47, 49.45, 8.72, 49.88],
    notes: 'Narrow ridge between Heidelberg and Darmstadt',
  },
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
  const res = await fetch(`${OVERPASS_URL}?data=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  const data = await res.json();
  return data.elements || [];
}

function buildConcaveHull(elements: any[]) {
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
  for (const maxEdge of [6, 10, 20]) {
    try {
      result = turfConcave(fc, { maxEdge, units: 'kilometers' });
      if (result?.geometry) { console.log(`  Concave hull maxEdge=${maxEdge}km, type=${result.geometry.type}`); break; }
    } catch { /* try next */ }
  }
  if (!result?.geometry) {
    try { result = turfConvex(fc); if (result?.geometry) console.log('  Convex fallback'); } catch {}
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
  const app = await sanity.fetch(`*[_type=="appellation"&&slug.current==$slug][0]{_id,name}`, { slug });
  if (!app) { console.log(`  No Sanity record: ${slug}`); return; }
  await sanity.patch(app._id).set({ boundaries: { _type: 'geoJSON', geometry: geo, properties: {} } }).commit();
  console.log(`  Uploaded: ${app.name}`);
}

async function run() {
  for (const region of REGIONS) {
    console.log(`\n=== ${region.name} ===`);
    console.log(`  (${region.notes})`);
    try {
      const elements = await fetchVineyardsInBbox(region.bbox, region.name);
      console.log(`  ${elements.length} OSM elements`);
      if (!elements.length) { console.log('  No data, skipping'); continue; }
      const geo = buildConcaveHull(elements);
      if (!geo) { console.log('  No hull, skipping'); continue; }
      const simplified = simplify(geo, 400);
      const allLons: number[] = [], allLats: number[] = [];
      const collect = (item: any) => {
        if (Array.isArray(item)) {
          if (item.length === 2 && typeof item[0] === 'number') { allLons.push(item[0]); allLats.push(item[1]); }
          else item.forEach(collect);
        }
      };
      collect(simplified.coordinates);
      console.log(`  Result lng: ${Math.min(...allLons).toFixed(2)}–${Math.max(...allLons).toFixed(2)}, lat: ${Math.min(...allLats).toFixed(2)}–${Math.max(...allLats).toFixed(2)}`);
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
