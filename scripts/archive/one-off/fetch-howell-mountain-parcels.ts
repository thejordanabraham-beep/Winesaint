import * as fs from 'fs';
import * as path from 'path';

// Howell Mountain AVA boundary (simplified)
const AVA_BOUNDARY = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/howell_mountain_simplified.json'), 'utf-8')
);

// Vineyard-related land use codes from Napa County
const VINEYARD_LAND_USE_CODES = [
  '34', '3401', '341', '35', '38', '3801', '3811', '382', '3821', '383', '3831',
  '384', '385', '39', '3901', '392', '3921', '393', '3931', '394', '3941', '395',
  '42', '421', '4210', '4211', '4212', '4213', '4214', '4215', '3201'
];

// Create bounding box from AVA boundary for initial spatial filter
function getBoundingBox(coords: number[][]): { xmin: number; ymin: number; xmax: number; ymax: number } {
  let xmin = Infinity, ymin = Infinity, xmax = -Infinity, ymax = -Infinity;

  for (const [lng, lat] of coords) {
    xmin = Math.min(xmin, lng);
    ymin = Math.min(ymin, lat);
    xmax = Math.max(xmax, lng);
    ymax = Math.max(ymax, lat);
  }

  return { xmin, ymin, xmax, ymax };
}

async function fetchVineyardParcels() {
  console.log('🍇 Fetching vineyard parcels within Howell Mountain AVA...\n');

  const coords = AVA_BOUNDARY.coordinates[0];
  const bbox = getBoundingBox(coords);

  console.log(`Bounding box: ${bbox.xmin.toFixed(4)}, ${bbox.ymin.toFixed(4)} to ${bbox.xmax.toFixed(4)}, ${bbox.ymax.toFixed(4)}`);

  // Build land use filter
  const landUseFilter = VINEYARD_LAND_USE_CODES.map(code => `landuse1='${code}'`).join(' OR ');

  // Query parameters
  const params = new URLSearchParams({
    where: landUseFilter,
    geometry: JSON.stringify({
      xmin: bbox.xmin,
      ymin: bbox.ymin,
      xmax: bbox.xmax,
      ymax: bbox.ymax,
      spatialReference: { wkid: 4326 }
    }),
    geometryType: 'esriGeometryEnvelope',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: '*',
    outSR: '4326',
    f: 'geojson',
    resultRecordCount: '500'
  });

  const url = `https://gis.countyofnapa.org/arcgis/rest/services/Hosted/Parcels_Public/FeatureServer/0/query?${params}`;

  console.log('Querying Napa County parcel API...\n');

  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    console.error('API Error:', data.error);
    return;
  }

  const features = data.features || [];
  console.log(`Found ${features.length} vineyard parcels in Howell Mountain area\n`);

  // Group by land use type
  const byLandUse: Record<string, typeof features> = {};
  for (const feature of features) {
    const lu = feature.properties.landuse1 || 'unknown';
    const desc = feature.properties.descr || '';
    const key = `${lu} - ${desc}`;
    if (!byLandUse[key]) byLandUse[key] = [];
    byLandUse[key].push(feature);
  }

  console.log('Parcels by type:');
  for (const [type, parcels] of Object.entries(byLandUse).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${type}: ${parcels.length} parcels`);
  }

  // Save to file
  const outputPath = path.join(__dirname, '../data/howell_mountain_vineyard_parcels.geojson');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`\n✅ Saved to ${outputPath}`);

  // Show sample addresses
  console.log('\nSample parcels with addresses:');
  const withAddresses = features
    .filter((f: any) => f.properties.streetaddr)
    .slice(0, 15);

  for (const f of withAddresses) {
    const props = f.properties;
    console.log(`  - ${props.streetaddr} (${props.gis_acres?.toFixed(1) || '?'} acres) - ${props.descr}`);
  }
}

fetchVineyardParcels().catch(console.error);
