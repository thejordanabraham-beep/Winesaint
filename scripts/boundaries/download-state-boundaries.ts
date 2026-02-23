import * as fs from 'fs';
import * as path from 'path';

// Using simplified US state boundaries from public domain source
const STATE_BOUNDARIES_URL = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';

async function downloadStateBoundaries() {
  console.log('🗺️ Downloading US state boundaries...\n');

  const response = await fetch(STATE_BOUNDARIES_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  const data = await response.json();
  const dataDir = path.join(__dirname, '../data');

  // Extract California
  const california = data.features.find((f: any) => f.properties.name === 'California');
  if (california) {
    const caCoords = california.geometry.coordinates;
    // Simplify to ~150 points for performance
    const simplified = simplifyPolygon(caCoords, 150);

    const caOutput = {
      type: 'Polygon',
      coordinates: simplified,
    };

    fs.writeFileSync(
      path.join(dataDir, 'california_state.json'),
      JSON.stringify(caOutput, null, 2)
    );
    console.log('✓ California state boundary saved');
  }

  // Extract Oregon
  const oregon = data.features.find((f: any) => f.properties.name === 'Oregon');
  if (oregon) {
    const orCoords = oregon.geometry.coordinates;
    const simplified = simplifyPolygon(orCoords, 150);

    const orOutput = {
      type: 'Polygon',
      coordinates: simplified,
    };

    fs.writeFileSync(
      path.join(dataDir, 'oregon_state.json'),
      JSON.stringify(orOutput, null, 2)
    );
    console.log('✓ Oregon state boundary saved');
  }

  // Extract Washington
  const washington = data.features.find((f: any) => f.properties.name === 'Washington');
  if (washington) {
    const waCoords = washington.geometry.coordinates;
    const simplified = simplifyPolygon(waCoords, 150);

    const waOutput = {
      type: 'Polygon',
      coordinates: simplified,
    };

    fs.writeFileSync(
      path.join(dataDir, 'washington_state.json'),
      JSON.stringify(waOutput, null, 2)
    );
    console.log('✓ Washington state boundary saved');
  }

  console.log('\n✅ State boundaries downloaded!');
}

function simplifyPolygon(coordinates: any, targetPoints: number): number[][][] {
  // Handle MultiPolygon (take largest polygon)
  if (Array.isArray(coordinates[0]) && Array.isArray(coordinates[0][0]) && Array.isArray(coordinates[0][0][0])) {
    // MultiPolygon - find largest by point count
    let largest = coordinates[0];
    for (const poly of coordinates) {
      if (poly[0].length > largest[0].length) {
        largest = poly;
      }
    }
    coordinates = largest;
  }

  const ring = coordinates[0];
  if (ring.length <= targetPoints) {
    return [ring];
  }

  const step = Math.max(1, Math.floor(ring.length / targetPoints));
  const simplified = ring.filter((_: any, i: number) => i % step === 0);

  // Ensure polygon is closed
  if (JSON.stringify(simplified[0]) !== JSON.stringify(simplified[simplified.length - 1])) {
    simplified.push(simplified[0]);
  }

  return [simplified];
}

downloadStateBoundaries().catch(console.error);
