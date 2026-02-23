/**
 * Fetches German wine region boundaries for non-RLP regions using
 * OpenStreetMap vineyard landuse polygons via Overpass API.
 *
 * Covers: Baden, Württemberg, Franken, Rheingau, Hessische Bergstrasse,
 *         Saale-Unstrut, Sachsen
 *
 * Usage: npx tsx scripts/boundaries/fetch-german-osm-vineyards.ts
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

// [west, south, east, north]
const REGIONS = [
  { slug: 'franken', name: 'Franken', bbox: [8.9, 49.4, 11.0, 50.65] as [number, number, number, number] },
  // Rheingau: strict north-of-Rhine bbox. Rhine flows at ~49.97°N here;
  // previous south=49.85 was picking up Rheinhessen vineyards south of the river.
  { slug: 'rheingau', name: 'Rheingau', bbox: [7.80, 49.97, 8.30, 50.25] as [number, number, number, number] },
  // Hessische Bergstrasse: narrow strip between Heidelberg and Darmstadt at ~8.6°E
  { slug: 'hessische-bergstrasse', name: 'Hessische Bergstrasse', bbox: [8.47, 49.42, 8.78, 49.90] as [number, number, number, number] },
  { slug: 'saale-unstrut', name: 'Saale-Unstrut', bbox: [11.0, 50.65, 12.4, 51.85] as [number, number, number, number] },
  { slug: 'sachsen-wine', name: 'Sachsen', bbox: [12.7, 50.75, 14.2, 51.4] as [number, number, number, number] },
  { slug: 'wurttemberg', name: 'Württemberg', bbox: [8.9, 48.3, 10.35, 49.85] as [number, number, number, number] },
  // Baden: long Rhine strip from Switzerland to Heidelberg + Tauberfranken pocket in NE.
  // Cap north at 49.42 to avoid overlapping with Hessische Bergstrasse.
  { slug: 'baden', name: 'Baden', bbox: [7.3, 47.3, 9.6, 49.42] as [number, number, number, number] },
];

async function fetchVineyardsInBbox(
  bbox: [number, number, number, number],
  regionName: string
): Promise<any[]> {
  const [west, south, east, north] = bbox;
  const query = `[out:json][timeout:120];
(
  way["landuse"="vineyard"](${south},${west},${north},${east});
  relation["landuse"="vineyard"](${south},${west},${north},${east});
);
out geom;`;

  console.log(`  Querying Overpass for ${regionName}...`);
  const res = await fetch(`${OVERPASS_URL}?data=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`Overpass error: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data.elements || [];
}

function buildConcaveHull(elements: any[], regionName: string): any | null {
  const pts: any[] = [];

  for (const el of elements) {
    if (el.type === 'way' && el.geometry) {
      for (let i = 0; i < el.geometry.length; i += 2) {
        const { lat, lon } = el.geometry[i];
        if (lon && lat) pts.push(point([lon, lat]));
      }
    } else if (el.type === 'relation' && el.members) {
      for (const member of el.members) {
        if (member.geometry) {
          for (let i = 0; i < member.geometry.length; i += 2) {
            const { lat, lon } = member.geometry[i];
            if (lon && lat) pts.push(point([lon, lat]));
          }
        }
      }
    }
  }

  if (pts.length < 3) {
    console.log(`    ⚠️  Only ${pts.length} points for ${regionName}, skipping`);
    return null;
  }

  console.log(`    ${pts.length} points collected`);
  const fc = featureCollection(pts);

  let result: any = null;
  for (const maxEdge of [10, 20, 40]) {
    try {
      result = turfConcave(fc, { maxEdge, units: 'kilometers' });
      if (result?.geometry) {
        console.log(`    ✓ Concave hull (maxEdge=${maxEdge}km), type=${result.geometry.type}`);
        break;
      }
    } catch { /* try next */ }
  }

  if (!result?.geometry) {
    try {
      result = turfConvex(fc);
      if (result?.geometry) console.log(`    ✓ Fell back to convex hull`);
    } catch { /* skip */ }
  }

  return result?.geometry || null;
}

function simplify(geo: any, maxPts = 400): any {
  if (!geo?.coordinates) return geo;

  const simplifyRing = (ring: number[][]): number[][] => {
    if (ring.length <= maxPts) return ring;
    const step = Math.ceil(ring.length / maxPts);
    const s = ring.filter((_, i) => i % step === 0);
    if (JSON.stringify(s[0]) !== JSON.stringify(s[s.length - 1])) s.push(s[0]);
    return s;
  };

  if (geo.type === 'Polygon') {
    return { ...geo, coordinates: geo.coordinates.map(simplifyRing) };
  }
  if (geo.type === 'MultiPolygon') {
    return { ...geo, coordinates: geo.coordinates.map((poly: number[][][]) => poly.map(simplifyRing)) };
  }
  return geo;
}

async function uploadBoundary(slug: string, geo: any): Promise<void> {
  const appellation = await sanity.fetch(
    `*[_type == "appellation" && slug.current == $slug][0]{ _id, name }`,
    { slug }
  );
  if (!appellation) {
    console.log(`    ⚠️  No Sanity record for slug: ${slug}`);
    return;
  }

  await sanity.patch(appellation._id).set({
    boundaries: { _type: 'geoJSON', geometry: geo, properties: {} },
  }).commit();

  console.log(`    ✅ Uploaded to Sanity: ${appellation.name}`);
}

async function run() {
  if (!fs.existsSync(BOUNDARY_DIR)) fs.mkdirSync(BOUNDARY_DIR, { recursive: true });

  for (const region of REGIONS) {
    console.log(`\n=== ${region.name} (${region.slug}) ===`);

    try {
      const elements = await fetchVineyardsInBbox(region.bbox, region.name);
      console.log(`  ${elements.length} OSM elements found`);

      if (elements.length === 0) {
        console.log(`  ⚠️  No vineyard data found, skipping`);
        continue;
      }

      const geo = buildConcaveHull(elements, region.name);
      if (!geo) continue;

      const simplified = simplify(geo, 400);
      const exterior = simplified.type === 'Polygon'
        ? simplified.coordinates[0]?.length
        : simplified.coordinates?.[0]?.[0]?.length;
      console.log(`  Simplified exterior: ${exterior} pts`);

      // Save cache
      const cachePath = path.join(BOUNDARY_DIR, `${region.slug}.geojson`);
      fs.writeFileSync(cachePath, JSON.stringify(
        { type: 'Feature', geometry: simplified, properties: {} }, null, 2
      ));

      await uploadBoundary(region.slug, simplified);

    } catch (err) {
      console.error(`  ❌ Error for ${region.name}:`, err);
    }

    // Rate limit courtesy
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\nDone!');
}

run().catch(console.error);
