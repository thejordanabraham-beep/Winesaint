/**
 * Fix Australian wine sub-regions (Mudgee, Hunter Valley, etc.) using
 * OSM vineyard landuse data, and fix the Australia country boundary
 * to mainland only (excluding remote territories).
 */

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

// [west, south, east, north] — Australian wine sub-regions
const SUBREGIONS: Array<{ slug: string; name: string; bbox: [number, number, number, number] }> = [
  { slug: 'hunter-valley', name: 'Hunter Valley', bbox: [150.5, -33.3, 151.8, -32.2] },
  { slug: 'mudgee', name: 'Mudgee', bbox: [149.1, -33.0, 150.1, -32.1] },
  { slug: 'barossa-valley', name: 'Barossa Valley', bbox: [138.6, -34.8, 139.3, -34.2] },
  { slug: 'mclaren-vale', name: 'McLaren Vale', bbox: [138.4, -35.4, 138.7, -35.0] },
  { slug: 'clare-valley', name: 'Clare Valley', bbox: [138.3, -34.2, 138.9, -33.4] },
  { slug: 'yarra-valley', name: 'Yarra Valley', bbox: [145.0, -38.0, 146.2, -37.4] },
  { slug: 'margaret-river', name: 'Margaret River', bbox: [114.8, -34.4, 115.4, -33.4] },
  { slug: 'mornington-peninsula', name: 'Mornington Peninsula', bbox: [144.8, -38.6, 145.5, -37.9] },
  { slug: 'eden-valley', name: 'Eden Valley', bbox: [138.8, -34.8, 139.3, -34.2] },
];

// Mainland Australia polygon — bbox covers mainland + Tasmania, excludes territories
// [west, south, east, north]
const AUSTRALIA_MAINLAND_BBOX = [112.5, -43.7, 153.7, -10.7];

async function fetchVineyardsInBbox(bbox: [number, number, number, number], name: string) {
  const [west, south, east, north] = bbox;
  const query = `[out:json][timeout:60];
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
  console.log(`  ${pts.length} points`);
  if (pts.length < 3) return null;
  const fc = featureCollection(pts);
  let result: any = null;
  for (const maxEdge of [5, 10, 25]) {
    try {
      result = turfConcave(fc, { maxEdge, units: 'kilometers' });
      if (result?.geometry) { console.log(`  Concave hull maxEdge=${maxEdge}km, ${result.geometry.type}`); break; }
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

async function fixAustraliaCountryBoundary() {
  console.log('\n=== Australia Country Boundary (mainland only) ===');
  // Use Overpass to get mainland Australia boundary via admin relation
  // with a bbox that excludes remote territories
  const [west, south, east, north] = AUSTRALIA_MAINLAND_BBOX;
  const query = `[out:json][timeout:120];
relation(2316598);
out geom;`;
  // Actually just use the mainland bbox approach: get the AU-NSW, AU-VIC, AU-SA, AU-WA, AU-QLD, AU-TAS, AU-NT
  // and use their combined extent as a simple bbox
  // Simpler: create a mainland polygon directly from known coordinates
  const mainlandPoly = {
    type: 'Polygon' as const,
    coordinates: [[
      // Rough mainland + Tasmania outline (clockwise from NW)
      [113.2, -22.0], [114.2, -21.8], [121.9, -19.0], [128.0, -14.8],
      [136.7, -12.0], [136.8, -11.6], [139.5, -12.1], [141.0, -10.7],
      [142.5, -10.7], [145.5, -14.5], [146.3, -18.0], [147.5, -19.2],
      [148.5, -20.4], [150.0, -22.5], [150.8, -23.5], [152.0, -24.5],
      [153.2, -26.0], [153.6, -28.0], [153.6, -29.5], [153.2, -30.5],
      [153.0, -31.5], [152.5, -32.5], [151.8, -33.0], [151.3, -33.9],
      [150.9, -34.4], [150.6, -35.3], [150.2, -35.9], [150.1, -36.5],
      [149.9, -37.5], [148.3, -37.9], [147.3, -38.2], [146.3, -38.7],
      [145.0, -38.5], [144.7, -38.0], [143.5, -38.7], [142.5, -38.4],
      [140.9, -38.1], [140.0, -37.9], [139.1, -36.0], [138.5, -35.0],
      [138.0, -33.2], [137.5, -35.8], [136.5, -35.8], [135.6, -34.9],
      [135.2, -34.7], [133.6, -32.2], [132.0, -32.0], [130.0, -31.5],
      [129.0, -33.5], [127.0, -33.8], [125.0, -33.5], [123.7, -33.9],
      [122.3, -33.8], [121.5, -33.8], [120.0, -34.3], [119.0, -34.1],
      [117.5, -35.0], [115.6, -33.6], [114.1, -22.2], [113.2, -22.0],
    ]],
  };

  const app = await sanity.fetch(`*[_type=="appellation"&&slug.current=="australia"][0]{_id,name}`);
  if (!app) { console.log('  No Australia record'); return; }
  await sanity.patch(app._id).set({ boundaries: { _type: 'geoJSON', geometry: mainlandPoly, properties: {} } }).commit();
  fs.writeFileSync(path.join(BOUNDARY_DIR, 'australia.geojson'),
    JSON.stringify({ type: 'Feature', geometry: mainlandPoly, properties: {} }, null, 2));
  console.log(`  Uploaded mainland boundary for: ${app.name}`);
}

async function run() {
  // Fix sub-regions
  for (const region of SUBREGIONS) {
    console.log(`\n=== ${region.name} ===`);
    try {
      const elements = await fetchVineyardsInBbox(region.bbox, region.name);
      console.log(`  ${elements.length} OSM elements`);
      if (!elements.length) { console.log('  No vineyard data, skipping'); continue; }
      const geo = buildConcaveHull(elements);
      if (!geo) continue;
      const simplified = simplify(geo, 400);
      fs.writeFileSync(path.join(BOUNDARY_DIR, `${region.slug}.geojson`),
        JSON.stringify({ type: 'Feature', geometry: simplified, properties: {} }, null, 2));
      await uploadBoundary(region.slug, simplified);
    } catch (err) {
      console.error(`  Error:`, err);
    }
    await new Promise(r => setTimeout(r, 2000));
  }

  // Fix Australia country boundary
  await fixAustraliaCountryBoundary();

  console.log('\nDone!');
}

run().catch(console.error);
