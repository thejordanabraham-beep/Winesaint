/**
 * FRANCE WINE REGION BOUNDARIES - OVERPASS API IMPORTER
 *
 * Fetches real boundary shapes for French wine regions from OpenStreetMap
 * via the Overpass API, then uploads them to Sanity.
 *
 * Usage:
 *   npx tsx scripts/boundaries/import-france-wine-boundaries.ts
 *
 * Options:
 *   --dry-run    Print results without uploading to Sanity
 *   --region=X   Only process a specific region (e.g. --region=burgundy)
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const OVERPASS_URL = 'https://overpass.kumi.systems/api/interpreter';
const DRY_RUN = process.argv.includes('--dry-run');
const REGION_FILTER = process.argv.find(a => a.startsWith('--region='))?.split('=')[1];

// French wine regions mapped to their Sanity slugs and OSM search terms
// OSM relation IDs are used where known for reliability
const FRANCE_WINE_REGIONS = [
  // Major regions
  {
    name: 'Burgundy',
    slug: 'burgundy',
    osmRelationId: 8638372, // Bourgogne administrative region (close match)
    fallbackName: 'Bourgogne-Franche-Comté',
    centerPoint: { longitude: 4.8357, latitude: 47.0833, defaultZoom: 7 },
  },
  {
    name: 'Bordeaux',
    slug: 'bordeaux',
    osmRelationId: 7343, // Gironde département
    fallbackName: 'Gironde',
    centerPoint: { longitude: -0.5792, latitude: 44.8378, defaultZoom: 8 },
  },
  {
    name: 'Champagne',
    slug: 'champagne',
    osmRelationId: 8638454, // Marne département
    fallbackName: 'Marne',
    centerPoint: { longitude: 4.0333, latitude: 49.0500, defaultZoom: 8 },
  },
  {
    name: 'Alsace',
    slug: 'alsace',
    osmRelationId: 8404188, // Alsace cultural region
    fallbackName: 'Alsace',
    centerPoint: { longitude: 7.4467, latitude: 48.2042, defaultZoom: 8 },
  },
  {
    name: 'Loire Valley',
    slug: 'loire-valley',
    osmRelationId: null,
    fallbackName: 'Val de Loire',
    centerPoint: { longitude: 0.6833, latitude: 47.3936, defaultZoom: 7 },
  },
  {
    name: 'Rhône Valley',
    slug: 'rhone-valley',
    osmRelationId: null,
    fallbackName: 'Vallée du Rhône',
    centerPoint: { longitude: 4.8357, latitude: 44.9333, defaultZoom: 7 },
  },
  {
    name: 'Provence',
    slug: 'provence',
    osmRelationId: 8654172,
    fallbackName: 'Provence-Alpes-Côte d\'Azur',
    centerPoint: { longitude: 6.1296, latitude: 43.9352, defaultZoom: 8 },
  },
  {
    name: 'Languedoc',
    slug: 'languedoc',
    osmRelationId: 8654073,
    fallbackName: 'Occitanie',
    centerPoint: { longitude: 3.8772, latitude: 43.6119, defaultZoom: 7 },
  },
  {
    name: 'Jura',
    slug: 'jura',
    osmRelationId: 7360,
    fallbackName: 'Jura',
    centerPoint: { longitude: 5.7, latitude: 46.7833, defaultZoom: 9 },
  },
  {
    name: 'Savoie',
    slug: 'savoie',
    osmRelationId: 7399,
    fallbackName: 'Savoie',
    centerPoint: { longitude: 6.5833, latitude: 45.5000, defaultZoom: 9 },
  },
  {
    name: 'Roussillon',
    slug: 'roussillon',
    osmRelationId: 7352,
    fallbackName: 'Pyrénées-Orientales',
    centerPoint: { longitude: 2.5833, latitude: 42.6833, defaultZoom: 9 },
  },
  {
    name: 'Beaujolais',
    slug: 'beaujolais',
    osmRelationId: null,
    fallbackName: 'Beaujolais',
    centerPoint: { longitude: 4.6667, latitude: 46.1667, defaultZoom: 9 },
  },
  // Burgundy sub-regions
  {
    name: 'Chablis',
    slug: 'chablis',
    osmRelationId: null,
    fallbackName: 'Chablis',
    centerPoint: { longitude: 3.7833, latitude: 47.8167, defaultZoom: 11 },
  },
  {
    name: 'Côte de Nuits',
    slug: 'cote-de-nuits',
    osmRelationId: null,
    fallbackName: 'Côte de Nuits',
    centerPoint: { longitude: 4.9500, latitude: 47.2000, defaultZoom: 10 },
  },
  {
    name: 'Côte de Beaune',
    slug: 'cote-de-beaune',
    osmRelationId: null,
    fallbackName: 'Côte de Beaune',
    centerPoint: { longitude: 4.8500, latitude: 46.9833, defaultZoom: 10 },
  },
  // Rhône sub-regions
  {
    name: 'Northern Rhône',
    slug: 'northern-rhone',
    osmRelationId: null,
    fallbackName: 'Northern Rhône',
    centerPoint: { longitude: 4.7667, latitude: 45.3333, defaultZoom: 9 },
  },
  {
    name: 'Southern Rhône',
    slug: 'southern-rhone',
    osmRelationId: null,
    fallbackName: 'Southern Rhône',
    centerPoint: { longitude: 4.9167, latitude: 44.0000, defaultZoom: 9 },
  },
];

// Query Overpass for a relation by ID
async function fetchByRelationId(relationId: number): Promise<any> {
  const query = `
[out:json][timeout:30];
relation(${relationId});
out geom;
  `.trim();

  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: query,
    headers: { 'Content-Type': 'text/plain' },
  });

  if (!response.ok) throw new Error(`Overpass error: ${response.status}`);
  return response.json();
}

// Query Overpass by name within France
async function fetchByName(name: string): Promise<any> {
  const query = `
[out:json][timeout:30];
area["ISO3166-1"="FR"]->.france;
(
  relation["name"="${name}"]["boundary"="administrative"](area.france);
  relation["name"="${name}"]["place"="region"](area.france);
  relation["name"="${name}"]["natural"="coastline"](area.france);
);
out geom;
  `.trim();

  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: query,
    headers: { 'Content-Type': 'text/plain' },
  });

  if (!response.ok) throw new Error(`Overpass error: ${response.status}`);
  return response.json();
}

// Convert OSM relation geometry to GeoJSON polygon
function osmToGeoJSON(osmData: any): { type: string; coordinates: number[][][] } | null {
  if (!osmData?.elements?.length) return null;

  const relation = osmData.elements.find((e: any) => e.type === 'relation');
  if (!relation?.members) return null;

  // Collect all outer way geometries
  const outerWays = relation.members
    .filter((m: any) => m.type === 'way' && m.role === 'outer' && m.geometry)
    .map((m: any) => m.geometry.map((p: any) => [p.lon, p.lat]));

  if (!outerWays.length) return null;

  // Connect way segments into a ring
  const ring = connectWays(outerWays);
  if (ring.length < 4) return null;

  // Simplify: keep every Nth point based on ring size
  const targetPoints = 300;
  const step = Math.max(1, Math.floor(ring.length / targetPoints));
  const simplified = ring.filter((_: any, i: number) => i % step === 0);

  // Ensure closed ring
  if (JSON.stringify(simplified[0]) !== JSON.stringify(simplified[simplified.length - 1])) {
    simplified.push(simplified[0]);
  }

  return { type: 'Polygon', coordinates: [simplified] };
}

// Connect OSM way segments into a single ring
function connectWays(ways: number[][][]): number[][] {
  if (!ways.length) return [];

  const result: number[][] = [...ways[0]];
  const remaining = ways.slice(1);

  let maxIterations = ways.length * 2;
  while (remaining.length > 0 && maxIterations-- > 0) {
    const lastPoint = result[result.length - 1];
    let connected = false;

    for (let i = 0; i < remaining.length; i++) {
      const way = remaining[i];
      const firstPoint = way[0];
      const lastWayPoint = way[way.length - 1];

      const threshold = 0.001; // ~100m tolerance

      if (distance(lastPoint, firstPoint) < threshold) {
        result.push(...way.slice(1));
        remaining.splice(i, 1);
        connected = true;
        break;
      } else if (distance(lastPoint, lastWayPoint) < threshold) {
        result.push(...[...way].reverse().slice(1));
        remaining.splice(i, 1);
        connected = true;
        break;
      }
    }

    if (!connected) {
      // Gap in ring — just append next way
      result.push(...remaining[0]);
      remaining.splice(0, 1);
    }
  }

  return result;
}

function distance(a: number[], b: number[]): number {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

// Look up Sanity appellation by slug
async function findSanityAppellation(slug: string): Promise<{ _id: string; name: string } | null> {
  return sanity.fetch(
    `*[_type == "appellation" && slug.current == $slug][0]{ _id, name }`,
    { slug }
  );
}

// Upload boundary + centerPoint to Sanity
async function updateSanityBoundary(
  id: string,
  geoJSON: any,
  centerPoint: { longitude: number; latitude: number; defaultZoom: number }
): Promise<void> {
  await sanity.patch(id).set({
    boundaries: {
      _type: 'geoJSON',
      geometry: geoJSON,
      properties: {},
    },
    centerPoint,
  }).commit();
}

async function main() {
  console.log('🗺️  France Wine Region Boundary Importer');
  console.log('=========================================');
  if (DRY_RUN) console.log('DRY RUN — no changes will be written to Sanity\n');

  // Save results to file for inspection
  const outputDir = path.join(process.cwd(), 'data', 'boundaries');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const results: any[] = [];

  const regionsToProcess = REGION_FILTER
    ? FRANCE_WINE_REGIONS.filter(r => r.slug === REGION_FILTER)
    : FRANCE_WINE_REGIONS;

  for (const region of regionsToProcess) {
    console.log(`\n📍 ${region.name} (${region.slug})`);

    // Find in Sanity
    const appellation = await findSanityAppellation(region.slug);
    if (!appellation) {
      console.log(`   ⚠️  Not found in Sanity — skipping`);
      continue;
    }
    console.log(`   ✓ Found in Sanity: ${appellation._id}`);

    // Check for cached GeoJSON first
    const cachedFile = path.join(outputDir, `${region.slug}.geojson`);
    let geoJSON: { type: string; coordinates: number[][][] } | null = null;
    let pointCount = 0;

    if (fs.existsSync(cachedFile)) {
      try {
        const cached = JSON.parse(fs.readFileSync(cachedFile, 'utf8'));
        geoJSON = cached.geometry;
        if (geoJSON?.type === 'MultiPolygon') {
          pointCount = (geoJSON as any).coordinates.reduce((sum: number, poly: any[]) =>
            sum + poly.reduce((s: number, ring: any[]) => s + ring.length, 0), 0);
        } else {
          pointCount = geoJSON?.coordinates?.[0]?.length ?? 0;
        }
        console.log(`   ✓ Using cached file: ${pointCount} points`);
      } catch (e) {
        console.log(`   ⚠️  Cached file invalid, fetching from Overpass...`);
        geoJSON = null;
      }
    }

    if (!geoJSON) {
      // Fetch boundary from Overpass
      let osmData: any = null;
      let source = '';

      try {
        if (region.osmRelationId) {
          console.log(`   Fetching OSM relation ${region.osmRelationId}...`);
          osmData = await fetchByRelationId(region.osmRelationId);
          source = `relation:${region.osmRelationId}`;
        }

        if (!osmData?.elements?.length && region.fallbackName) {
          console.log(`   Trying name search: "${region.fallbackName}"...`);
          osmData = await fetchByName(region.fallbackName);
          source = `name:"${region.fallbackName}"`;
        }
      } catch (e: any) {
        console.log(`   ❌ Overpass error: ${e.message}`);
        continue;
      }

      if (!osmData?.elements?.length) {
        console.log(`   ❌ No OSM data found`);
        results.push({ slug: region.slug, name: region.name, status: 'not_found' });
        continue;
      }

      geoJSON = osmToGeoJSON(osmData);
      if (!geoJSON) {
        console.log(`   ❌ Could not build polygon from OSM data`);
        results.push({ slug: region.slug, name: region.name, status: 'conversion_failed' });
        continue;
      }

      pointCount = geoJSON.coordinates[0].length;
      console.log(`   ✓ Polygon: ${pointCount} points (source: ${source})`);
    }

    // Save locally (only if not already cached)
    if (!fs.existsSync(cachedFile)) {
      fs.writeFileSync(cachedFile, JSON.stringify({ type: 'Feature', properties: { name: region.name }, geometry: geoJSON }, null, 2));
      console.log(`   ✓ Saved to data/boundaries/${region.slug}.geojson`);
    }

    if (!DRY_RUN) {
      try {
        await updateSanityBoundary(appellation._id, geoJSON, region.centerPoint);
        console.log(`   ✅ Uploaded to Sanity`);
        results.push({ slug: region.slug, name: region.name, status: 'success', points: pointCount });
      } catch (e: any) {
        console.log(`   ❌ Sanity upload failed: ${e.message}`);
        results.push({ slug: region.slug, name: region.name, status: 'upload_failed' });
      }
    } else {
      console.log(`   ○ [dry-run] Would upload to Sanity`);
      results.push({ slug: region.slug, name: region.name, status: 'dry_run', points: pointCount });
    }

    // Rate limit — be polite to Overpass
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('\n\n📊 Summary');
  console.log('==========');
  for (const r of results) {
    const icon = r.status === 'success' ? '✅' : r.status === 'dry_run' ? '○' : '❌';
    const detail = r.points ? ` (${r.points} pts)` : '';
    console.log(`${icon} ${r.name}${detail}`);
  }

  const succeeded = results.filter(r => ['success', 'dry_run'].includes(r.status)).length;
  console.log(`\n${succeeded}/${results.length} regions processed`);
}

main().catch(console.error);
