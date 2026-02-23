import * as fs from 'fs';
import * as path from 'path';

// France country boundary from Natural Earth (simplified)
const COUNTRIES_URL = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';

async function downloadFranceBoundary() {
  console.log('🗺️ Downloading France boundary...\n');

  const dataDir = path.join(__dirname, '../data');

  const response = await fetch(COUNTRIES_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  const data = await response.json();

  // Find France
  const france = data.features.find((f: any) =>
    f.properties.ADMIN === 'France' || f.properties.name === 'France'
  );

  if (france) {
    // France is a MultiPolygon (mainland + overseas territories)
    // We want just mainland France
    let mainlandCoords: number[][][];

    if (france.geometry.type === 'MultiPolygon') {
      // Find the largest polygon (mainland France)
      let largest = france.geometry.coordinates[0];
      let maxPoints = 0;

      for (const poly of france.geometry.coordinates) {
        const points = poly[0]?.length || 0;
        // Also check if it's in European coordinates (roughly -5 to 10 longitude, 41 to 51 latitude)
        const firstCoord = poly[0]?.[0];
        if (firstCoord &&
            firstCoord[0] > -10 && firstCoord[0] < 15 &&
            firstCoord[1] > 40 && firstCoord[1] < 52 &&
            points > maxPoints) {
          largest = poly;
          maxPoints = points;
        }
      }
      mainlandCoords = largest;
    } else {
      mainlandCoords = france.geometry.coordinates;
    }

    // Simplify to ~200 points
    const ring = mainlandCoords[0];
    const step = Math.max(1, Math.floor(ring.length / 200));
    const simplified = ring.filter((_: any, i: number) => i % step === 0);

    if (JSON.stringify(simplified[0]) !== JSON.stringify(simplified[simplified.length - 1])) {
      simplified.push(simplified[0]);
    }

    const output = {
      type: 'Polygon',
      coordinates: [simplified],
    };

    fs.writeFileSync(
      path.join(dataDir, 'france_country.json'),
      JSON.stringify(output, null, 2)
    );
    console.log('✓ France country boundary saved');
  } else {
    console.log('✗ France not found in dataset');
  }

  console.log('\n✅ Done!');
}

downloadFranceBoundary().catch(console.error);
