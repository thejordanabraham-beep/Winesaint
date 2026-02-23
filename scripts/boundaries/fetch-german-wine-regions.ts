/**
 * Fetches German wine region (Anbaugebiet) boundaries by downloading individual
 * vineyard parcels from the Rhineland-Palatinate vineyard register API and
 * dissolving them by region using Turf.js.
 *
 * Covers RLP-based regions: Mosel, Nahe, Ahr, Mittelrhein, Rheinhessen, Pfalz,
 * and partially Rheingau.
 *
 * Usage: npx tsx scripts/boundaries/fetch-german-wine-regions.ts
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

const API_BASE = 'https://demo.ldproxy.net/vineyards/collections/vineyards/items';
const BOUNDARY_DIR = path.join(process.cwd(), 'data', 'boundaries');

// Map API region names to our slugs
const REGION_SLUG_MAP: Record<string, string> = {
  'Mosel': 'mosel',
  'Nahe': 'nahe',
  'Ahr': 'ahr',
  'Mittelrhein': 'mittelrhein',
  'Rheinhessen': 'rheinhessen',
  'Pfalz': 'pfalz',
  'Rheingau': 'rheingau',
};

async function fetchAllParcels(): Promise<any[]> {
  const all: any[] = [];
  let offset = 0;
  const limit = 200;

  console.log('Downloading vineyard parcels from RLP API...');
  while (true) {
    const url = `${API_BASE}?limit=${limit}&offset=${offset}&f=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    const features = data.features || [];
    all.push(...features);
    console.log(`  Fetched ${all.length} / ${data.numberMatched} parcels`);
    if (all.length >= data.numberMatched || features.length === 0) break;
    offset += limit;
    await new Promise(r => setTimeout(r, 500));
  }
  return all;
}

function dissolveByRegion(features: any[]): Record<string, any> {
  // Group features by region
  const byRegion: Record<string, any[]> = {};
  for (const f of features) {
    const region = f.properties?.region;
    if (!region) continue;
    if (!byRegion[region]) byRegion[region] = [];
    byRegion[region].push(f);
  }

  const dissolved: Record<string, any> = {};

  for (const [region, parcels] of Object.entries(byRegion)) {
    const slug = REGION_SLUG_MAP[region];
    if (!slug) {
      console.log(`  Skipping unmapped region: ${region} (${parcels.length} parcels)`);
      continue;
    }

    console.log(`  Building outline for ${region} (${parcels.length} parcels)...`);

    // Collect ALL coordinate points from all parcels
    const pts: any[] = [];
    for (const f of parcels) {
      const geo = f.geometry;
      if (!geo?.coordinates) continue;
      const rings = geo.type === 'Polygon' ? geo.coordinates : geo.coordinates.flatMap((p: any) => p);
      for (const ring of rings) {
        // Sample every other point to keep count manageable
        for (let i = 0; i < ring.length; i += 2) {
          const [lon, lat] = ring[i];
          if (lon && lat) pts.push(point([lon, lat]));
        }
      }
    }

    if (pts.length < 3) continue;
    const fc = featureCollection(pts);

    // Try concave hull first (better for elongated regions like Mosel)
    // maxEdge in km — larger = more convex, smaller = more concave
    let result: any = null;
    for (const maxEdge of [15, 25, 50]) {
      try {
        result = turfConcave(fc, { maxEdge, units: 'kilometers' });
        if (result?.geometry) break;
      } catch { /* try next */ }
    }

    // Fall back to convex hull if concave fails
    if (!result?.geometry) {
      try {
        result = turfConvex(fc);
      } catch { /* skip */ }
    }

    dissolved[slug] = result?.geometry || null;
    if (dissolved[slug]) {
      const pts2 = countPoints(dissolved[slug]);
      console.log(`    ✓ ${region}: ${pts2} pts`);
    }
  }

  return dissolved;
}

function countPoints(geo: any): number {
  if (!geo?.coordinates) return 0;
  if (geo.type === 'Polygon') return geo.coordinates[0]?.length || 0;
  if (geo.type === 'MultiPolygon') {
    return geo.coordinates.reduce((s: number, p: any) => s + (p[0]?.length || 0), 0);
  }
  return 0;
}

function simplify(geo: any, maxPts = 400): any {
  if (!geo?.coordinates) return geo;

  const simplifyRing = (ring: number[][]): number[][] => {
    if (ring.length <= maxPts) return ring;
    const step = Math.ceil(ring.length / maxPts);
    const s = ring.filter((_, i) => i % step === 0);
    // Ensure closed
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

async function uploadBoundary(slug: string, geoJSON: any): Promise<void> {
  const appellation = await sanity.fetch(
    `*[_type == "appellation" && slug.current == $slug][0]{ _id, name }`,
    { slug }
  );
  if (!appellation) {
    console.log(`    ⚠️  No Sanity record found for slug: ${slug}`);
    return;
  }

  await sanity.patch(appellation._id).set({
    boundaries: { _type: 'geoJSON', geometry: geoJSON, properties: {} },
  }).commit();

  console.log(`    ✅ Uploaded to Sanity: ${appellation.name}`);
}

async function run() {
  if (!fs.existsSync(BOUNDARY_DIR)) fs.mkdirSync(BOUNDARY_DIR, { recursive: true });

  // Fetch all 1,585 vineyard parcels
  const parcels = await fetchAllParcels();
  console.log(`\nTotal parcels downloaded: ${parcels.length}`);

  // Show which regions are present
  const regionCounts: Record<string, number> = {};
  for (const f of parcels) {
    const r = f.properties?.region || 'unknown';
    regionCounts[r] = (regionCounts[r] || 0) + 1;
  }
  console.log('\nRegions in dataset:');
  for (const [r, count] of Object.entries(regionCounts)) {
    console.log(`  ${r}: ${count} parcels`);
  }

  // Dissolve parcels by region
  console.log('\nDissolving by region...');
  const dissolved = dissolveByRegion(parcels);

  // Simplify, save, and upload each
  console.log('\nSaving and uploading...');
  for (const [slug, geo] of Object.entries(dissolved)) {
    if (!geo) {
      console.log(`  ⚠️  ${slug}: no geometry`);
      continue;
    }

    const simplified = simplify(geo, 400);
    const pts = countPoints(simplified);
    console.log(`  ${slug}: ${pts} pts`);

    // Save cache
    fs.writeFileSync(
      path.join(BOUNDARY_DIR, `${slug}.geojson`),
      JSON.stringify({ type: 'Feature', geometry: simplified, properties: {} }, null, 2)
    );

    // Upload to Sanity
    await uploadBoundary(slug, simplified);
  }

  console.log('\nDone!');
}

run().catch(console.error);
