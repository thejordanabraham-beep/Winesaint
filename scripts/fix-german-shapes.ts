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

// Corrected bboxes based on reference wine map [west, south, east, north]
const REGIONS: Array<{ slug: string; name: string; bbox: [number, number, number, number] }> = [
  // Franken: follows the Main river around Würzburg. Previous west=8.9 captured
  // Württemberg/Bergstrasse vineyards. Actual Franken starts ~9.3E at Wertheim.
  // Also cap north at 50.35 (Bamberg area), not 50.65 (no Franken vineyards that far north).
  { slug: 'franken', name: 'Franken', bbox: [9.30, 49.55, 10.95, 50.35] },

  // Württemberg: Neckar/Stuttgart corridor. Tighten east boundary (vineyards
  // don't extend much past Göppingen ~9.9E) and north (Heilbronn ~49.2N).
  { slug: 'wurttemberg', name: 'Württemberg', bbox: [8.85, 48.40, 10.05, 49.55] },

  // Saale-Unstrut: two clusters near Naumburg + Freyburg/Halle.
  // Previous bbox too broad (50.65–51.85). Actual region: 51.0–51.65N, 11.4–12.1E.
  { slug: 'saale-unstrut', name: 'Saale-Unstrut', bbox: [11.35, 51.00, 12.10, 51.65] },

  // Sachsen: tiny region near Meissen/Dresden along the Elbe.
  // Previous bbox too wide (12.7–14.2). Actual cluster: 13.1–13.95E, 50.95–51.3N.
  { slug: 'sachsen-wine', name: 'Sachsen', bbox: [13.10, 50.90, 13.95, 51.30] },
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
      // Show coord range for verification
      const allLons: number[] = [], allLats: number[] = [];
      const collect = (item: any) => {
        if (Array.isArray(item)) {
          if (item.length === 2 && typeof item[0] === 'number') { allLons.push(item[0]); allLats.push(item[1]); }
          else item.forEach(collect);
        }
      };
      collect(simplified.coordinates);
      console.log(`  Lng: ${Math.min(...allLons).toFixed(2)}–${Math.max(...allLons).toFixed(2)}, Lat: ${Math.min(...allLats).toFixed(2)}–${Math.max(...allLats).toFixed(2)}`);
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
