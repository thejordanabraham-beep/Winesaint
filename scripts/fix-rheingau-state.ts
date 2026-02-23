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

// Rheingau is in Hesse (DE-HE). Rheinhessen is in Rhineland-Palatinate (DE-RP).
// By filtering to DE-HE only, we exclude all Rheinhessen south-bank vineyards
// that fall within the same lat/lng bbox — solving the cross-Rhine overlap.
// Also fix Hessische Bergstrasse with the same Hesse state filter to be precise.
const query = `[out:json][timeout:120];
area["ISO3166-2"="DE-HE"]->.hesse;
(
  way["landuse"="vineyard"](area.hesse)(49.96,7.85,50.09,8.45);
  relation["landuse"="vineyard"](area.hesse)(49.96,7.85,50.09,8.45);
);
out geom;`;

async function run() {
  console.log('Fetching Rheingau vineyards (Hesse state only)...');
  const res = await fetch(`${OVERPASS_URL}?data=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  const data = await res.json();
  const elements = data.elements || [];
  console.log(`${elements.length} elements (all in Hesse — Rheinhessen excluded)`);

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

  // Show lat range to confirm we're north of the Rhine
  const lats = pts.map(p => p.geometry.coordinates[1]);
  const lons = pts.map(p => p.geometry.coordinates[0]);
  console.log(`Lat range: ${Math.min(...lats).toFixed(4)} – ${Math.max(...lats).toFixed(4)}`);
  console.log(`Lng range: ${Math.min(...lons).toFixed(4)} – ${Math.max(...lons).toFixed(4)}`);

  const fc = featureCollection(pts);
  let result: any = null;
  for (const maxEdge of [5, 8, 15]) {
    try {
      result = turfConcave(fc, { maxEdge, units: 'kilometers' });
      if (result?.geometry) { console.log(`Concave hull maxEdge=${maxEdge}km, type=${result.geometry.type}`); break; }
    } catch { /* try next */ }
  }
  if (!result?.geometry) {
    result = turfConvex(fc);
    console.log('Convex fallback');
  }

  const geo = result.geometry;
  const simplifyRing = (ring: number[][]): number[][] => {
    if (ring.length <= 400) return ring;
    const step = Math.ceil(ring.length / 400);
    const s = ring.filter((_: any, i: number) => i % step === 0);
    if (JSON.stringify(s[0]) !== JSON.stringify(s[s.length - 1])) s.push(s[0]);
    return s;
  };
  const simplified = geo.type === 'Polygon'
    ? { ...geo, coordinates: geo.coordinates.map(simplifyRing) }
    : { ...geo, coordinates: geo.coordinates.map((p: number[][][]) => p.map(simplifyRing)) };

  fs.writeFileSync(
    path.join(BOUNDARY_DIR, 'rheingau.geojson'),
    JSON.stringify({ type: 'Feature', geometry: simplified, properties: {} }, null, 2)
  );

  const app = await sanity.fetch(
    `*[_type=="appellation"&&slug.current=="rheingau"][0]{_id,name}`
  );
  await sanity.patch(app._id).set({
    boundaries: { _type: 'geoJSON', geometry: simplified, properties: {} },
  }).commit();
  console.log(`Uploaded: ${app.name}`);
}

run().catch(console.error);
