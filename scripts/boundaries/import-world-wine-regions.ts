/**
 * WORLD WINE REGION BOUNDARIES IMPORTER
 *
 * Creates Sanity appellation records for major wine-producing countries
 * and their primary wine regions, fetching boundaries from OpenStreetMap.
 *
 * Usage:
 *   npx tsx scripts/boundaries/import-world-wine-regions.ts
 *   npx tsx scripts/boundaries/import-world-wine-regions.ts --country=italy
 *   npx tsx scripts/boundaries/import-world-wine-regions.ts --dry-run
 *   npx tsx scripts/boundaries/import-world-wine-regions.ts --countries-only
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
const COUNTRIES_ONLY = process.argv.includes('--countries-only');
const COUNTRY_FILTER = process.argv.find(a => a.startsWith('--country='))?.split('=')[1];
const BOUNDARY_DIR = path.join(process.cwd(), 'data', 'boundaries');

if (!fs.existsSync(BOUNDARY_DIR)) fs.mkdirSync(BOUNDARY_DIR, { recursive: true });

interface RegionDef {
  name: string;
  slug: string;
  osmRelationId: number | null;
  osmSearchName?: string;
  centerPoint: { longitude: number; latitude: number; defaultZoom: number };
  approximateBbox?: [number, number, number, number]; // [south, west, north, east]
}

interface CountryDef {
  name: string;
  slug: string;
  osmRelationId: number;
  centerPoint: { longitude: number; latitude: number; defaultZoom: number };
}

interface WineCountry {
  country: CountryDef;
  regions: RegionDef[];
}

// ============================================================
// WINE COUNTRY + REGION DATA
// OSM relation IDs for administrative boundaries
// ============================================================
const WINE_COUNTRIES: WineCountry[] = [
  {
    country: {
      name: 'Italy',
      slug: 'italy',
      osmRelationId: 365331,
      centerPoint: { longitude: 12.5674, latitude: 41.8719, defaultZoom: 5 },
    },
    regions: [
      // All 20 Italian administrative regions (regioni)
      // All 20 Italian administrative regions (regioni) — verified admin_level=4 OSM relation IDs
      { name: 'Valle d\'Aosta', slug: 'valle-daosta', osmRelationId: 45155, centerPoint: { longitude: 7.3678, latitude: 45.7370, defaultZoom: 9 } },
      { name: 'Piedmont', slug: 'piedmont', osmRelationId: 44874, centerPoint: { longitude: 7.9934, latitude: 44.3996, defaultZoom: 7 } },
      { name: 'Liguria', slug: 'liguria', osmRelationId: 301482, centerPoint: { longitude: 9.0700, latitude: 44.3168, defaultZoom: 8 } },
      { name: 'Lombardy', slug: 'lombardy', osmRelationId: 44879, centerPoint: { longitude: 9.6773, latitude: 45.4654, defaultZoom: 7 } },
      { name: 'Trentino-Alto Adige', slug: 'trentino-alto-adige', osmRelationId: 45757, centerPoint: { longitude: 11.1217, latitude: 46.4995, defaultZoom: 8 } },
      { name: 'Veneto', slug: 'veneto', osmRelationId: 43648, centerPoint: { longitude: 11.8961, latitude: 45.5403, defaultZoom: 7 } },
      { name: 'Friuli-Venezia Giulia', slug: 'friuli-venezia-giulia', osmRelationId: 179296, centerPoint: { longitude: 13.2368, latitude: 45.9636, defaultZoom: 7 } },
      { name: 'Emilia-Romagna', slug: 'emilia-romagna', osmRelationId: 42611, centerPoint: { longitude: 11.3426, latitude: 44.4949, defaultZoom: 7 } },
      { name: 'Tuscany', slug: 'tuscany', osmRelationId: 41977, centerPoint: { longitude: 11.2558, latitude: 43.7711, defaultZoom: 7 } },
      { name: 'Umbria', slug: 'umbria', osmRelationId: 42004, centerPoint: { longitude: 12.3888, latitude: 43.1122, defaultZoom: 8 } },
      { name: 'Marche', slug: 'marche', osmRelationId: 53060, centerPoint: { longitude: 13.1777, latitude: 43.6170, defaultZoom: 8 } },
      { name: 'Lazio', slug: 'lazio', osmRelationId: 40784, centerPoint: { longitude: 12.8628, latitude: 41.9028, defaultZoom: 7 } },
      { name: 'Abruzzo', slug: 'abruzzo', osmRelationId: 53937, centerPoint: { longitude: 13.7202, latitude: 42.2289, defaultZoom: 8 } },
      { name: 'Molise', slug: 'molise', osmRelationId: 41256, centerPoint: { longitude: 14.6600, latitude: 41.5600, defaultZoom: 9 } },
      { name: 'Campania', slug: 'campania', osmRelationId: 40218, centerPoint: { longitude: 14.7681, latitude: 40.6669, defaultZoom: 7 } },
      { name: 'Basilicata', slug: 'basilicata', osmRelationId: 40137, centerPoint: { longitude: 15.9699, latitude: 40.6399, defaultZoom: 8 } },
      { name: 'Puglia', slug: 'puglia', osmRelationId: 40095, centerPoint: { longitude: 16.8698, latitude: 40.7928, defaultZoom: 7 } },
      { name: 'Calabria', slug: 'calabria', osmRelationId: 1783980, centerPoint: { longitude: 16.5988, latitude: 38.9059, defaultZoom: 7 } },
      { name: 'Sicily', slug: 'sicily', osmRelationId: 39152, centerPoint: { longitude: 14.0154, latitude: 37.5999, defaultZoom: 7 } },
      { name: 'Sardinia', slug: 'sardinia', osmRelationId: 7361997, centerPoint: { longitude: 9.0129, latitude: 40.0757, defaultZoom: 7 } },
    ],
  },
  {
    country: {
      name: 'Spain',
      slug: 'spain',
      osmRelationId: 1311341,
      centerPoint: { longitude: -3.7038, latitude: 40.4168, defaultZoom: 5 },
    },
    regions: [
      {
        name: 'La Rioja',
        slug: 'la-rioja',
        osmRelationId: 348991, // verified admin_level=4
        centerPoint: { longitude: -2.4445, latitude: 42.2871, defaultZoom: 8 },
      },
      {
        name: 'Catalonia',
        slug: 'catalonia',
        osmRelationId: 349053, // verified admin_level=4
        centerPoint: { longitude: 1.5209, latitude: 41.5912, defaultZoom: 7 },
      },
      {
        name: 'Castilla y León',
        slug: 'castilla-y-leon',
        osmRelationId: 349041, // verified admin_level=4
        centerPoint: { longitude: -4.7245, latitude: 41.6516, defaultZoom: 6 },
      },
      {
        name: 'Galicia',
        slug: 'galicia-spain',
        osmRelationId: 349036, // verified admin_level=4
        centerPoint: { longitude: -7.8662, latitude: 42.5751, defaultZoom: 7 },
      },
      {
        name: 'Andalusia',
        slug: 'andalusia',
        osmRelationId: 349044, // verified admin_level=4
        centerPoint: { longitude: -4.4806, latitude: 37.1773, defaultZoom: 6 },
      },
      {
        name: 'Aragón',
        slug: 'aragon',
        osmRelationId: 349045, // verified admin_level=4
        centerPoint: { longitude: -0.8773, latitude: 41.5868, defaultZoom: 7 },
      },
      {
        name: 'Valencia',
        slug: 'valencia-spain',
        osmRelationId: 349043, // verified admin_level=4
        centerPoint: { longitude: -0.7533, latitude: 39.4702, defaultZoom: 7 },
      },
      {
        name: 'Navarre',
        slug: 'navarre',
        osmRelationId: 349027, // verified admin_level=4
        centerPoint: { longitude: -1.6481, latitude: 42.6954, defaultZoom: 8 },
      },
      {
        name: 'Basque Country',
        slug: 'basque-country',
        osmRelationId: 349042, // verified admin_level=4
        centerPoint: { longitude: -2.6733, latitude: 43.0097, defaultZoom: 8 },
      },
      {
        name: 'Castilla-La Mancha',
        slug: 'castilla-la-mancha',
        osmRelationId: 349052, // verified admin_level=4
        centerPoint: { longitude: -3.0092, latitude: 39.9464, defaultZoom: 6 },
      },
      {
        name: 'Extremadura',
        slug: 'extremadura',
        osmRelationId: 349050, // verified admin_level=4
        centerPoint: { longitude: -6.1697, latitude: 39.1693, defaultZoom: 7 },
      },
    ],
  },
  {
    country: {
      name: 'Germany',
      slug: 'germany',
      osmRelationId: 51477,
      centerPoint: { longitude: 10.4515, latitude: 51.1657, defaultZoom: 5 },
    },
    regions: [
      // German Anbaugebiete (wine regions) - most don't exist as OSM boundary polygons.
      // Rheinhessen and Pfalz have verified OSM relation IDs (boundary=place/region).
      // All others use approximateBbox fallback — osmSearchName removed to prevent wrong
      // OSM objects (rivers, municipalities with same name) being cached.
      {
        name: 'Mosel',
        slug: 'mosel',
        osmRelationId: null,
        centerPoint: { longitude: 7.1025, latitude: 50.0300, defaultZoom: 8 },
        approximateBbox: [49.4, 6.5, 50.4, 7.5],
      },
      {
        name: 'Rheingau',
        slug: 'rheingau',
        osmRelationId: null,
        centerPoint: { longitude: 8.0250, latitude: 50.0750, defaultZoom: 9 },
        approximateBbox: [49.9, 7.7, 50.2, 8.4],
      },
      {
        name: 'Rheinhessen',
        slug: 'rheinhessen',
        osmRelationId: 19890944, // verified: boundary=place, wikidata=Q707297
        centerPoint: { longitude: 8.1000, latitude: 49.8500, defaultZoom: 9 },
        approximateBbox: [49.6, 7.7, 50.1, 8.5],
      },
      {
        name: 'Pfalz',
        slug: 'pfalz',
        osmRelationId: 19890967, // verified: boundary=place, wikidata=Q326359
        centerPoint: { longitude: 8.0500, latitude: 49.3333, defaultZoom: 8 },
        approximateBbox: [49.0, 7.7, 49.7, 8.3],
      },
      {
        name: 'Baden',
        slug: 'baden',
        osmRelationId: null,
        centerPoint: { longitude: 8.0000, latitude: 48.3333, defaultZoom: 8 },
        approximateBbox: [47.5, 7.6, 49.1, 8.6],
      },
      {
        name: 'Franken',
        slug: 'franken',
        osmRelationId: null,
        centerPoint: { longitude: 10.0000, latitude: 49.7000, defaultZoom: 8 },
        approximateBbox: [49.3, 9.0, 50.3, 11.2],
      },
      {
        name: 'Nahe',
        slug: 'nahe',
        osmRelationId: null,
        centerPoint: { longitude: 7.7000, latitude: 49.8500, defaultZoom: 9 },
        approximateBbox: [49.6, 7.3, 50.0, 8.0],
      },
      {
        name: 'Württemberg',
        slug: 'wurttemberg',
        osmRelationId: null,
        centerPoint: { longitude: 9.3333, latitude: 48.8333, defaultZoom: 8 },
        approximateBbox: [48.2, 8.7, 49.5, 10.0],
      },
      {
        name: 'Ahr',
        slug: 'ahr',
        osmRelationId: null,
        centerPoint: { longitude: 6.9167, latitude: 50.5500, defaultZoom: 10 },
        approximateBbox: [50.3, 6.7, 50.7, 7.2],
      },
      {
        name: 'Mittelrhein',
        slug: 'mittelrhein',
        osmRelationId: null,
        centerPoint: { longitude: 7.6167, latitude: 50.3667, defaultZoom: 9 },
        approximateBbox: [50.1, 7.3, 50.7, 8.0],
      },
      {
        name: 'Saale-Unstrut',
        slug: 'saale-unstrut',
        osmRelationId: null,
        centerPoint: { longitude: 11.7500, latitude: 51.3000, defaultZoom: 9 },
        approximateBbox: [51.0, 11.0, 51.6, 12.5],
      },
      {
        name: 'Sachsen',
        slug: 'sachsen-wine',
        osmRelationId: null,
        centerPoint: { longitude: 13.7000, latitude: 51.1000, defaultZoom: 9 },
        approximateBbox: [51.0, 13.2, 51.5, 14.4],
      },
      {
        name: 'Hessische Bergstrasse',
        slug: 'hessische-bergstrasse',
        osmRelationId: null,
        centerPoint: { longitude: 8.6500, latitude: 49.6500, defaultZoom: 10 },
        approximateBbox: [49.4, 8.5, 49.9, 8.8],
      },
    ],
  },
  {
    country: {
      name: 'Portugal',
      slug: 'portugal',
      osmRelationId: 295480,
      centerPoint: { longitude: -8.2245, latitude: 39.3999, defaultZoom: 6 },
    },
    regions: [
      {
        name: 'Douro',
        slug: 'douro',
        osmRelationId: null,
        osmSearchName: 'Douro',
        centerPoint: { longitude: -7.5333, latitude: 41.1500, defaultZoom: 8 },
        approximateBbox: [40.8, -8.2, 41.5, -6.8],
      },
      {
        name: 'Alentejo',
        slug: 'alentejo',
        osmRelationId: 5073819,
        centerPoint: { longitude: -7.7900, latitude: 38.1333, defaultZoom: 7 },
      },
      {
        name: 'Vinho Verde',
        slug: 'vinho-verde',
        osmRelationId: null,
        osmSearchName: 'Vinho Verde',
        centerPoint: { longitude: -8.2833, latitude: 41.7500, defaultZoom: 8 },
        approximateBbox: [41.0, -8.8, 42.2, -7.6],
      },
      {
        name: 'Dão',
        slug: 'dao',
        osmRelationId: null,
        osmSearchName: 'Dão',
        centerPoint: { longitude: -7.9167, latitude: 40.4500, defaultZoom: 8 },
        approximateBbox: [40.1, -8.3, 40.8, -7.4],
      },
      {
        name: 'Bairrada',
        slug: 'bairrada',
        osmRelationId: null,
        osmSearchName: 'Bairrada',
        centerPoint: { longitude: -8.5500, latitude: 40.3833, defaultZoom: 9 },
        approximateBbox: [40.1, -8.8, 40.7, -8.2],
      },
      {
        name: 'Setúbal Peninsula',
        slug: 'setubal',
        osmRelationId: null,
        osmSearchName: 'Setúbal',
        centerPoint: { longitude: -8.9167, latitude: 38.5000, defaultZoom: 8 },
        approximateBbox: [38.2, -9.3, 38.8, -8.4],
      },
      {
        name: 'Tejo',
        slug: 'tejo',
        osmRelationId: null,
        osmSearchName: 'Tejo',
        centerPoint: { longitude: -8.5000, latitude: 39.3000, defaultZoom: 8 },
        approximateBbox: [38.8, -9.0, 39.8, -7.8],
      },
      {
        name: 'Lisboa',
        slug: 'lisboa-wine',
        osmRelationId: null,
        osmSearchName: 'Lisboa',
        centerPoint: { longitude: -9.1000, latitude: 39.1000, defaultZoom: 8 },
        approximateBbox: [38.8, -9.5, 39.7, -8.8],
      },
      {
        name: 'Algarve',
        slug: 'algarve',
        osmRelationId: 5076192,
        centerPoint: { longitude: -8.2500, latitude: 37.1500, defaultZoom: 8 },
      },
    ],
  },
  {
    country: {
      name: 'Argentina',
      slug: 'argentina',
      osmRelationId: 286393,
      centerPoint: { longitude: -63.6167, latitude: -38.4161, defaultZoom: 4 },
    },
    regions: [
      {
        name: 'Mendoza',
        slug: 'mendoza',
        osmRelationId: 1673432,
        centerPoint: { longitude: -68.8272, latitude: -32.8908, defaultZoom: 7 },
        approximateBbox: [-37.5, -70.6, -32.0, -66.3],
      },
      {
        name: 'Salta',
        slug: 'salta',
        osmRelationId: 1673431,
        centerPoint: { longitude: -65.4117, latitude: -24.7859, defaultZoom: 7 },
        approximateBbox: [-27.0, -68.5, -21.8, -62.4],
      },
      {
        name: 'San Juan',
        slug: 'san-juan',
        osmRelationId: 1673430,
        centerPoint: { longitude: -68.5366, latitude: -30.8653, defaultZoom: 7 },
        approximateBbox: [-32.5, -70.0, -28.3, -66.0],
      },
      {
        name: 'La Rioja',
        slug: 'la-rioja-argentina',
        osmRelationId: 1673438,
        centerPoint: { longitude: -66.8500, latitude: -29.4130, defaultZoom: 7 },
        approximateBbox: [-31.5, -69.2, -27.5, -65.0],
      },
      {
        name: 'Neuquén',
        slug: 'neuquen',
        osmRelationId: 1673444,
        centerPoint: { longitude: -68.9588, latitude: -38.9516, defaultZoom: 7 },
        approximateBbox: [-41.0, -71.0, -36.3, -68.3],
      },
      {
        name: 'Río Negro',
        slug: 'rio-negro',
        osmRelationId: 1673445,
        centerPoint: { longitude: -67.2247, latitude: -40.8135, defaultZoom: 7 },
        approximateBbox: [-42.0, -71.0, -37.5, -62.5],
      },
      {
        name: 'Catamarca',
        slug: 'catamarca',
        osmRelationId: 1673440,
        centerPoint: { longitude: -65.7760, latitude: -28.4696, defaultZoom: 7 },
        approximateBbox: [-29.5, -70.0, -25.0, -65.0],
      },
      {
        name: 'Tucumán',
        slug: 'tucuman',
        osmRelationId: 1673436,
        centerPoint: { longitude: -65.2098, latitude: -26.8083, defaultZoom: 8 },
        approximateBbox: [-28.0, -66.5, -26.0, -64.5],
      },
    ],
  },
  {
    country: {
      name: 'Chile',
      slug: 'chile',
      osmRelationId: 167454,
      centerPoint: { longitude: -71.5430, latitude: -35.6751, defaultZoom: 5 },
    },
    regions: [
      {
        name: 'Aconcagua Valley',
        slug: 'aconcagua-valley',
        osmRelationId: null,
        centerPoint: { longitude: -70.6000, latitude: -32.8333, defaultZoom: 8 },
        approximateBbox: [-33.4, -71.2, -32.3, -70.0],
      },
      {
        name: 'Casablanca Valley',
        slug: 'casablanca-valley',
        osmRelationId: null,
        centerPoint: { longitude: -71.4000, latitude: -33.3200, defaultZoom: 9 },
        approximateBbox: [-33.6, -71.7, -33.0, -71.0],
      },
      {
        name: 'Maipo Valley',
        slug: 'maipo-valley',
        osmRelationId: null,
        centerPoint: { longitude: -70.8000, latitude: -33.7000, defaultZoom: 8 },
        approximateBbox: [-34.1, -71.5, -33.2, -70.2],
      },
      {
        name: 'Rapel Valley',
        slug: 'rapel-valley',
        osmRelationId: null,
        centerPoint: { longitude: -71.0000, latitude: -34.3333, defaultZoom: 8 },
        approximateBbox: [-34.9, -71.8, -33.7, -70.3],
      },
      {
        name: 'Colchagua Valley',
        slug: 'colchagua-valley',
        osmRelationId: null,
        centerPoint: { longitude: -71.2833, latitude: -34.5000, defaultZoom: 8 },
        approximateBbox: [-34.9, -71.8, -34.0, -70.5],
      },
      {
        name: 'Curicó Valley',
        slug: 'curico-valley',
        osmRelationId: null,
        centerPoint: { longitude: -71.2333, latitude: -34.9833, defaultZoom: 9 },
        approximateBbox: [-35.3, -71.8, -34.6, -70.6],
      },
      {
        name: 'Maule Valley',
        slug: 'maule-valley',
        osmRelationId: null,
        centerPoint: { longitude: -71.5000, latitude: -35.5000, defaultZoom: 8 },
        approximateBbox: [-36.2, -72.0, -34.9, -70.5],
      },
      {
        name: 'Bío-Bío Valley',
        slug: 'bio-bio-valley',
        osmRelationId: null,
        centerPoint: { longitude: -72.5000, latitude: -37.5000, defaultZoom: 8 },
        approximateBbox: [-38.0, -73.0, -36.8, -71.5],
      },
      {
        name: 'Elquí Valley',
        slug: 'elqui-valley',
        osmRelationId: null,
        centerPoint: { longitude: -70.7500, latitude: -30.0000, defaultZoom: 8 },
        approximateBbox: [-30.4, -71.5, -29.5, -70.0],
      },
      {
        name: 'Limarí Valley',
        slug: 'limari-valley',
        osmRelationId: null,
        centerPoint: { longitude: -71.0000, latitude: -30.7000, defaultZoom: 9 },
        approximateBbox: [-31.2, -71.6, -30.2, -70.4],
      },
    ],
  },
  {
    country: {
      name: 'Australia',
      slug: 'australia',
      osmRelationId: 80500,
      centerPoint: { longitude: 133.7751, latitude: -25.2744, defaultZoom: 4 },
    },
    regions: [
      {
        name: 'South Australia',
        slug: 'south-australia',
        osmRelationId: 2316596,
        centerPoint: { longitude: 135.0000, latitude: -30.0000, defaultZoom: 6 },
      },
      {
        name: 'Victoria',
        slug: 'victoria-wine',
        osmRelationId: 2316741,
        centerPoint: { longitude: 144.0000, latitude: -37.0000, defaultZoom: 6 },
      },
      {
        name: 'New South Wales',
        slug: 'new-south-wales',
        osmRelationId: 2316593,
        centerPoint: { longitude: 147.0000, latitude: -32.0000, defaultZoom: 6 },
      },
      {
        name: 'Western Australia',
        slug: 'western-australia',
        osmRelationId: 2316598,
        centerPoint: { longitude: 117.0000, latitude: -28.0000, defaultZoom: 5 },
      },
      {
        name: 'Barossa Valley',
        slug: 'barossa-valley',
        osmRelationId: null,
        centerPoint: { longitude: 138.9600, latitude: -34.5000, defaultZoom: 9 },
        approximateBbox: [-34.8, 138.6, -34.2, 139.3],
      },
      {
        name: 'McLaren Vale',
        slug: 'mclaren-vale',
        osmRelationId: null,
        centerPoint: { longitude: 138.5400, latitude: -35.2200, defaultZoom: 10 },
        approximateBbox: [-35.4, 138.4, -35.0, 138.7],
      },
      {
        name: 'Clare Valley',
        slug: 'clare-valley',
        osmRelationId: null,
        centerPoint: { longitude: 138.5833, latitude: -33.8333, defaultZoom: 9 },
        approximateBbox: [-34.2, 138.3, -33.4, 138.9],
      },
      {
        name: 'Eden Valley',
        slug: 'eden-valley',
        osmRelationId: null,
        centerPoint: { longitude: 139.0667, latitude: -34.5833, defaultZoom: 10 },
        approximateBbox: [-34.8, 138.8, -34.2, 139.3],
      },
      {
        name: 'Margaret River',
        slug: 'margaret-river',
        osmRelationId: null,
        centerPoint: { longitude: 115.0583, latitude: -33.9517, defaultZoom: 9 },
        approximateBbox: [-34.4, 114.8, -33.4, 115.4],
      },
      {
        name: 'Great Southern',
        slug: 'great-southern',
        osmRelationId: null,
        centerPoint: { longitude: 117.8000, latitude: -34.5000, defaultZoom: 8 },
        approximateBbox: [-35.5, 116.5, -33.5, 119.5],
      },
      {
        name: 'Yarra Valley',
        slug: 'yarra-valley',
        osmRelationId: null,
        centerPoint: { longitude: 145.5500, latitude: -37.7500, defaultZoom: 9 },
        approximateBbox: [-38.0, 145.0, -37.4, 146.2],
      },
      {
        name: 'Mornington Peninsula',
        slug: 'mornington-peninsula',
        osmRelationId: null,
        centerPoint: { longitude: 145.1500, latitude: -38.3000, defaultZoom: 9 },
        approximateBbox: [-38.6, 144.8, -37.9, 145.5],
      },
      {
        name: 'Hunter Valley',
        slug: 'hunter-valley',
        osmRelationId: null,
        centerPoint: { longitude: 151.1667, latitude: -32.8333, defaultZoom: 8 },
        approximateBbox: [-33.3, 150.5, -32.2, 151.8],
      },
      {
        name: 'Mudgee',
        slug: 'mudgee',
        osmRelationId: null,
        centerPoint: { longitude: 149.5833, latitude: -32.6000, defaultZoom: 9 },
        approximateBbox: [-33.0, 149.1, -32.1, 150.1],
      },
    ],
  },
  {
    country: {
      name: 'New Zealand',
      slug: 'new-zealand',
      osmRelationId: 556706,
      centerPoint: { longitude: 172.6362, latitude: -40.9006, defaultZoom: 5 },
    },
    regions: [
      {
        name: 'Marlborough',
        slug: 'marlborough',
        osmRelationId: 4266977,
        centerPoint: { longitude: 173.9833, latitude: -41.5500, defaultZoom: 8 },
      },
      {
        name: 'Central Otago',
        slug: 'central-otago',
        osmRelationId: 4427029,
        centerPoint: { longitude: 169.2500, latitude: -45.0833, defaultZoom: 8 },
      },
      {
        name: "Hawke's Bay",
        slug: 'hawkes-bay',
        osmRelationId: 1643811,
        centerPoint: { longitude: 176.8167, latitude: -39.5000, defaultZoom: 8 },
      },
      {
        name: 'Martinborough',
        slug: 'martinborough',
        osmRelationId: null,
        centerPoint: { longitude: 175.4500, latitude: -41.2167, defaultZoom: 9 },
        approximateBbox: [-41.4, 175.2, -40.9, 175.8],
      },
      {
        name: 'Waipara Valley',
        slug: 'waipara-valley',
        osmRelationId: null,
        centerPoint: { longitude: 172.7500, latitude: -43.0667, defaultZoom: 9 },
        approximateBbox: [-43.4, 172.4, -42.7, 173.2],
      },
      {
        name: 'Nelson',
        slug: 'nelson-wine',
        osmRelationId: 4266962,
        centerPoint: { longitude: 173.2833, latitude: -41.2667, defaultZoom: 9 },
      },
      {
        name: 'Gisborne',
        slug: 'gisborne',
        osmRelationId: 2643819,
        centerPoint: { longitude: 178.0000, latitude: -38.5000, defaultZoom: 9 },
      },
      {
        name: 'Northland',
        slug: 'northland-wine',
        osmRelationId: 2133870,
        centerPoint: { longitude: 173.5000, latitude: -35.7000, defaultZoom: 8 },
      },
      {
        name: 'Auckland',
        slug: 'auckland-wine',
        osmRelationId: 2094141,
        centerPoint: { longitude: 174.7633, latitude: -36.8485, defaultZoom: 8 },
      },
      {
        name: 'Waikato',
        slug: 'waikato-wine',
        osmRelationId: 2094142,
        centerPoint: { longitude: 175.3333, latitude: -37.7833, defaultZoom: 9 },
      },
    ],
  },
];

// ============================================================
// OVERPASS + GEOJSON HELPERS
// ============================================================

async function fetchByRelationId(relationId: number): Promise<any> {
  const query = `[out:json][timeout:45];\nrelation(${relationId});\nout geom;`;
  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: query,
    headers: { 'Content-Type': 'text/plain' },
  });
  if (!response.ok) throw new Error(`Overpass error: ${response.status}`);
  return response.json();
}

async function fetchByName(name: string, countryCode: string): Promise<any> {
  // Use admin_level=4 filter for Italian regions + recursive member expansion
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
  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: query,
    headers: { 'Content-Type': 'text/plain' },
  });
  if (!response.ok) throw new Error(`Overpass error: ${response.status}`);
  return response.json();
}

// Group outer ways into separate connected rings.
// IMPORTANT: Once a ring closes (last pt ≈ first pt), stop extending it —
// otherwise island ways get incorrectly appended with diagonal lines.
function clusterWaysIntoRings(ways: number[][][]): number[][][] {
  const dp = (a: number[], b: number[]) =>
    Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
  const THRESH = 0.0005; // ~55m — tight enough to avoid false island joins

  const rings: number[][][] = [];
  let remaining = ways.map(w => [...w]);

  while (remaining.length > 0) {
    let ring: number[][] = [...remaining.shift()!];
    let changed = true;

    while (changed) {
      changed = false;
      // Stop if the ring is already closed
      if (ring.length > 4 && dp(ring[0], ring[ring.length - 1]) < THRESH) break;

      for (let i = 0; i < remaining.length; i++) {
        const way = remaining[i];
        const last = ring[ring.length - 1];
        if (dp(last, way[0]) < THRESH) {
          ring.push(...way.slice(1));
          remaining.splice(i, 1);
          changed = true;
          break;
        } else if (dp(last, way[way.length - 1]) < THRESH) {
          ring.push(...[...way].reverse().slice(1));
          remaining.splice(i, 1);
          changed = true;
          break;
        }
      }
    }

    if (ring.length >= 4) {
      if (dp(ring[0], ring[ring.length - 1]) >= THRESH) ring.push(ring[0]);
      rings.push(ring);
    }
  }
  return rings;
}

function bboxArea(ring: number[][]): number {
  const lons = ring.map(p => p[0]);
  const lats = ring.map(p => p[1]);
  return (Math.max(...lons) - Math.min(...lons)) * (Math.max(...lats) - Math.min(...lats));
}

function simplifyRing(ring: number[][], targetPoints = 350): number[][] {
  const step = Math.max(1, Math.floor(ring.length / targetPoints));
  const s = ring.filter((_, i) => i % step === 0);
  if (JSON.stringify(s[0]) !== JSON.stringify(s[s.length - 1])) s.push(s[0]);
  return s;
}

function osmToGeoJSON(osmData: any): any | null {
  if (!osmData?.elements?.length) return null;

  // Build a map of way id → geometry for all ways in the response
  // (with recursive ._;>>; query, way geometries are returned as top-level elements)
  const wayGeomById = new Map<number, number[][]>();
  for (const el of osmData.elements) {
    if (el.type === 'way' && el.geometry) {
      wayGeomById.set(el.id, el.geometry.map((p: any) => [p.lon, p.lat]));
    }
  }

  // Collect outer ways from ALL relations in the response
  // This handles nested admin relations (sub-regions within a province)
  const outerWaySet = new Set<number>(); // avoid duplicates
  const outerWays: number[][][] = [];

  for (const el of osmData.elements) {
    if (el.type !== 'relation' || !el.members) continue;
    for (const m of el.members) {
      if (m.role !== 'outer') continue;
      if (m.type === 'way') {
        if (outerWaySet.has(m.ref)) continue;
        outerWaySet.add(m.ref);
        // Inline geometry (old query style) or look up from wayGeomById
        const geom = m.geometry
          ? m.geometry.map((p: any) => [p.lon, p.lat])
          : wayGeomById.get(m.ref);
        if (geom && geom.length >= 2) outerWays.push(geom);
      }
    }
  }

  if (!outerWays.length) return null;

  // Cluster into separate closed rings
  let rings = clusterWaysIntoRings(outerWays)
    .map(r => simplifyRing(r))
    .filter(r => r.length >= 4);

  if (!rings.length) return null;

  // Sort descending by bbox area (largest ring = mainland first)
  rings.sort((a, b) => bboxArea(b) - bboxArea(a));

  // Drop rings smaller than 0.5% of the main polygon — removes tiny islands
  // that create visual noise without adding geographic value at this zoom level
  const mainArea = bboxArea(rings[0]);
  rings = rings.filter(r => bboxArea(r) >= mainArea * 0.005);

  if (rings.length === 1) {
    return { type: 'Polygon', coordinates: [rings[0]] };
  }
  return { type: 'MultiPolygon', coordinates: rings.map(r => [r]) };
}

// Create a simple rectangular polygon from a bounding box [south, west, north, east]
function bboxToGeoJSON(bbox: [number, number, number, number]): any {
  const [south, west, north, east] = bbox;
  return {
    type: 'Polygon',
    coordinates: [[
      [west, south],
      [east, south],
      [east, north],
      [west, north],
      [west, south],
    ]],
  };
}

function countPoints(geoJSON: any): number {
  if (!geoJSON) return 0;
  if (geoJSON.type === 'MultiPolygon') {
    return geoJSON.coordinates.reduce((sum: number, poly: any[]) =>
      sum + poly.reduce((s: number, ring: any[]) => s + ring.length, 0), 0);
  }
  return geoJSON.coordinates?.[0]?.length ?? 0;
}

// ============================================================
// SANITY HELPERS
// ============================================================

async function findAppellation(slug: string): Promise<{ _id: string; name: string } | null> {
  return sanity.fetch(
    `*[_type == "appellation" && slug.current == $slug][0]{ _id, name }`,
    { slug }
  );
}

async function createAppellation(data: {
  name: string;
  slug: string;
  level: string;
  parentId?: string;
  centerPoint: { longitude: number; latitude: number; defaultZoom: number };
}): Promise<string> {
  const doc: any = {
    _type: 'appellation',
    name: data.name,
    slug: { _type: 'slug', current: data.slug },
    level: data.level,
    centerPoint: data.centerPoint,
  };
  if (data.parentId) {
    doc.parentAppellation = { _type: 'reference', _ref: data.parentId };
  }
  const created = await sanity.create(doc);
  return created._id;
}

async function updateBoundary(
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

// ============================================================
// COUNTRY ISO CODE MAPPING (for Overpass name searches)
// ============================================================
const COUNTRY_ISO: Record<string, string> = {
  italy: 'IT',
  spain: 'ES',
  germany: 'DE',
  portugal: 'PT',
  argentina: 'AR',
  chile: 'CL',
  australia: 'AU',
  'new-zealand': 'NZ',
};

// ============================================================
// MAIN
// ============================================================

async function processRegion(
  region: RegionDef,
  countrySlug: string,
  parentId: string
): Promise<'success' | 'no_boundary' | 'failed'> {
  const cachedFile = path.join(BOUNDARY_DIR, `${region.slug}.geojson`);
  let geoJSON: any = null;

  // 1. Check local cache
  if (fs.existsSync(cachedFile)) {
    try {
      const cached = JSON.parse(fs.readFileSync(cachedFile, 'utf8'));
      geoJSON = cached.geometry;
      console.log(`   ✓ Using cached file: ${countPoints(geoJSON)} pts`);
    } catch {
      geoJSON = null;
    }
  }

  // 2. Fetch from Overpass if no cache
  if (!geoJSON) {
    if (region.osmRelationId) {
      try {
        console.log(`   Fetching OSM relation ${region.osmRelationId}...`);
        const osmData = await fetchByRelationId(region.osmRelationId);
        geoJSON = osmToGeoJSON(osmData);
        if (geoJSON) console.log(`   ✓ OSM relation: ${countPoints(geoJSON)} pts`);
        await new Promise(r => setTimeout(r, 1200));
      } catch (e: any) {
        console.log(`   ⚠️  Overpass error: ${e.message}`);
      }
    }

    if (!geoJSON && region.osmSearchName) {
      try {
        const isoCode = COUNTRY_ISO[countrySlug] || 'FR';
        console.log(`   Searching by name "${region.osmSearchName}" in ${isoCode}...`);
        const osmData = await fetchByName(region.osmSearchName, isoCode);
        geoJSON = osmToGeoJSON(osmData);
        if (geoJSON) console.log(`   ✓ Name search: ${countPoints(geoJSON)} pts`);
        await new Promise(r => setTimeout(r, 1200));
      } catch (e: any) {
        console.log(`   ⚠️  Name search error: ${e.message}`);
      }
    }

    // 3. Fall back to approximate bbox polygon
    if (!geoJSON && region.approximateBbox) {
      geoJSON = bboxToGeoJSON(region.approximateBbox);
      console.log(`   ⚠️  Using approximate bbox polygon`);
    }

    // Save to cache
    if (geoJSON) {
      fs.writeFileSync(cachedFile, JSON.stringify({
        type: 'Feature',
        properties: { name: region.name, slug: region.slug, source: 'OSM+bbox' },
        geometry: geoJSON,
      }, null, 2));
    }
  }

  // 4. Find or create Sanity record
  let appellation = await findAppellation(region.slug);
  if (!appellation) {
    if (!DRY_RUN) {
      console.log(`   Creating new Sanity record...`);
      const id = await createAppellation({
        name: region.name,
        slug: region.slug,
        level: 'sub_region',
        parentId,
        centerPoint: region.centerPoint,
      });
      appellation = { _id: id, name: region.name };
      console.log(`   ✅ Created: ${id}`);
    } else {
      console.log(`   ○ [dry-run] Would create new Sanity record`);
    }
  } else {
    console.log(`   ✓ Found existing: ${appellation._id}`);
  }

  // 5. Upload boundary
  if (appellation && geoJSON && !DRY_RUN) {
    await updateBoundary(appellation._id, geoJSON, region.centerPoint);
    console.log(`   ✅ Boundary uploaded`);
  } else if (!geoJSON) {
    console.log(`   ⚠️  No boundary data available`);
    return 'no_boundary';
  } else if (DRY_RUN) {
    console.log(`   ○ [dry-run] Would upload boundary`);
  }

  return 'success';
}

async function main() {
  console.log('🌍  World Wine Region Boundaries Importer');
  console.log('==========================================');
  if (DRY_RUN) console.log('DRY RUN — no changes will be written to Sanity\n');
  if (COUNTRIES_ONLY) console.log('COUNTRIES ONLY mode — skipping region processing\n');

  const countriesToProcess = COUNTRY_FILTER
    ? WINE_COUNTRIES.filter(c => c.country.slug === COUNTRY_FILTER)
    : WINE_COUNTRIES;

  const summary: Array<{ country: string; regions: number; succeeded: number; failed: number }> = [];

  for (const wc of countriesToProcess) {
    const { country, regions } = wc;
    console.log(`\n\n🇦🇷 Processing: ${country.name}`);
    console.log('─'.repeat(50));

    // ---- Country record ----
    let countryId: string;
    let existing = await findAppellation(country.slug);

    if (existing) {
      countryId = existing._id;
      console.log(`  ✓ Country exists: ${countryId}`);
    } else {
      if (!DRY_RUN) {
        console.log(`  Creating country record...`);
        countryId = await createAppellation({
          name: country.name,
          slug: country.slug,
          level: 'country',
          centerPoint: country.centerPoint,
        });
        console.log(`  ✅ Created country: ${countryId}`);
      } else {
        countryId = 'DRY_RUN_ID';
        console.log(`  ○ [dry-run] Would create country record`);
      }
    }

    // ---- Country boundary ----
    const countryCacheFile = path.join(BOUNDARY_DIR, `${country.slug}.geojson`);
    let countryGeoJSON: any = null;

    if (fs.existsSync(countryCacheFile)) {
      try {
        const cached = JSON.parse(fs.readFileSync(countryCacheFile, 'utf8'));
        countryGeoJSON = cached.geometry;
        console.log(`  ✓ Country boundary cached: ${countPoints(countryGeoJSON)} pts`);
      } catch { countryGeoJSON = null; }
    }

    if (!countryGeoJSON && country.osmRelationId) {
      try {
        console.log(`  Fetching country boundary (relation ${country.osmRelationId})...`);
        const osmData = await fetchByRelationId(country.osmRelationId);
        countryGeoJSON = osmToGeoJSON(osmData);
        if (countryGeoJSON) {
          console.log(`  ✓ Country boundary: ${countPoints(countryGeoJSON)} pts`);
          fs.writeFileSync(countryCacheFile, JSON.stringify({
            type: 'Feature',
            properties: { name: country.name, slug: country.slug, source: 'OSM' },
            geometry: countryGeoJSON,
          }, null, 2));
        }
        await new Promise(r => setTimeout(r, 1500));
      } catch (e: any) {
        console.log(`  ⚠️  Country boundary error: ${e.message}`);
      }
    }

    if (countryGeoJSON && !DRY_RUN) {
      await updateBoundary(countryId, countryGeoJSON, country.centerPoint);
      console.log(`  ✅ Country boundary uploaded`);
    }

    if (COUNTRIES_ONLY) {
      summary.push({ country: country.name, regions: 0, succeeded: 0, failed: 0 });
      continue;
    }

    // ---- Regions ----
    let succeeded = 0;
    let failed = 0;

    for (const region of regions) {
      console.log(`\n  📍 ${region.name} (${region.slug})`);
      const result = await processRegion(region, country.slug, countryId);
      if (result === 'success') succeeded++;
      else failed++;
      await new Promise(r => setTimeout(r, 800));
    }

    summary.push({ country: country.name, regions: regions.length, succeeded, failed });
  }

  // ---- Summary ----
  console.log('\n\n📊 Summary');
  console.log('==========');
  for (const s of summary) {
    const icon = s.failed === 0 ? '✅' : '⚠️ ';
    console.log(`${icon} ${s.country}: ${s.succeeded}/${s.regions} regions`);
  }
  const total = summary.reduce((a, s) => a + s.regions, 0);
  const totalOk = summary.reduce((a, s) => a + s.succeeded, 0);
  console.log(`\nTotal: ${totalOk}/${total} regions processed`);
}

main().catch(console.error);
