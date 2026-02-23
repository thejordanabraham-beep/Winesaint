import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'hj3ee4sp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// More realistic vineyard boundaries based on Vinous map reference
// These are approximated shapes matching the visual reference
// Coordinates are in [longitude, latitude] format

const VINEYARD_BOUNDARIES: Record<string, {
  coordinates: number[][][];
  labelPosition: { longitude: number; latitude: number };
  fillColor: string;
}> = {
  'dunn-vineyards': {
    // Dunn is in the northwestern area - irregular shape following ridgeline
    fillColor: '#8B4513', // brown
    labelPosition: { longitude: -122.473, latitude: 38.572 },
    coordinates: [[
      [-122.478, 38.576],
      [-122.474, 38.578],
      [-122.470, 38.576],
      [-122.468, 38.573],
      [-122.467, 38.569],
      [-122.469, 38.566],
      [-122.473, 38.565],
      [-122.477, 38.567],
      [-122.479, 38.570],
      [-122.480, 38.574],
      [-122.478, 38.576],
    ]],
  },
  'la-jota-vineyard': {
    // La Jota - western side, elongated shape running north-south
    fillColor: '#4169E1', // royal blue
    labelPosition: { longitude: -122.481, latitude: 38.558 },
    coordinates: [[
      [-122.484, 38.565],
      [-122.480, 38.566],
      [-122.478, 38.563],
      [-122.477, 38.558],
      [-122.478, 38.553],
      [-122.480, 38.550],
      [-122.483, 38.551],
      [-122.485, 38.554],
      [-122.486, 38.559],
      [-122.485, 38.563],
      [-122.484, 38.565],
    ]],
  },
  'burgess-cellars': {
    // Burgess - central-eastern area, broader shape
    fillColor: '#2E8B57', // sea green
    labelPosition: { longitude: -122.458, latitude: 38.562 },
    coordinates: [[
      [-122.463, 38.568],
      [-122.458, 38.569],
      [-122.453, 38.567],
      [-122.451, 38.563],
      [-122.452, 38.558],
      [-122.455, 38.555],
      [-122.460, 38.556],
      [-122.464, 38.559],
      [-122.465, 38.564],
      [-122.463, 38.568],
    ]],
  },
  'oshaughnessy-estate': {
    // O'Shaughnessy - eastern slope, terraced shape
    fillColor: '#DAA520', // goldenrod
    labelPosition: { longitude: -122.448, latitude: 38.555 },
    coordinates: [[
      [-122.453, 38.560],
      [-122.449, 38.561],
      [-122.445, 38.559],
      [-122.443, 38.555],
      [-122.444, 38.551],
      [-122.447, 38.549],
      [-122.451, 38.550],
      [-122.454, 38.553],
      [-122.455, 38.557],
      [-122.453, 38.560],
    ]],
  },
  'cade-estate': {
    // Cade - southwestern area, modern estate shape
    fillColor: '#FF6347', // tomato
    labelPosition: { longitude: -122.472, latitude: 38.543 },
    coordinates: [[
      [-122.477, 38.548],
      [-122.473, 38.550],
      [-122.469, 38.548],
      [-122.467, 38.544],
      [-122.468, 38.540],
      [-122.471, 38.537],
      [-122.475, 38.538],
      [-122.478, 38.541],
      [-122.479, 38.545],
      [-122.477, 38.548],
    ]],
  },
  'summit-lake-vineyards': {
    // Summit Lake - small, compact shape in southern area
    fillColor: '#9370DB', // medium purple
    labelPosition: { longitude: -122.462, latitude: 38.535 },
    coordinates: [[
      [-122.465, 38.538],
      [-122.461, 38.539],
      [-122.458, 38.537],
      [-122.458, 38.533],
      [-122.460, 38.531],
      [-122.464, 38.532],
      [-122.466, 38.535],
      [-122.465, 38.538],
    ]],
  },
  'beringer-howell-mountain': {
    // Beringer - large estate in eastern portion, multiple blocks
    fillColor: '#228B22', // forest green
    labelPosition: { longitude: -122.442, latitude: 38.568 },
    coordinates: [[
      [-122.450, 38.575],
      [-122.444, 38.577],
      [-122.438, 38.575],
      [-122.435, 38.570],
      [-122.436, 38.564],
      [-122.439, 38.560],
      [-122.444, 38.561],
      [-122.449, 38.563],
      [-122.452, 38.568],
      [-122.451, 38.573],
      [-122.450, 38.575],
    ]],
  },
  'liparita': {
    // Liparita - central area, historic vineyard shape
    fillColor: '#CD853F', // peru
    labelPosition: { longitude: -122.465, latitude: 38.550 },
    coordinates: [[
      [-122.469, 38.554],
      [-122.465, 38.555],
      [-122.461, 38.553],
      [-122.460, 38.549],
      [-122.462, 38.546],
      [-122.466, 38.545],
      [-122.469, 38.547],
      [-122.471, 38.551],
      [-122.469, 38.554],
    ]],
  },
};

async function updateVineyardBoundaries() {
  console.log('🗺️  Updating vineyard boundaries with realistic shapes...\n');

  for (const [slug, data] of Object.entries(VINEYARD_BOUNDARIES)) {
    // Find the vineyard
    const vineyard = await client.fetch(
      `*[_type == "vineyard" && slug.current == $slug][0]{ _id, name }`,
      { slug }
    );

    if (!vineyard) {
      console.log(`  ⚠️  Vineyard not found: ${slug}`);
      continue;
    }

    // Update the boundaries
    await client.patch(vineyard._id)
      .set({
        boundaries: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: data.coordinates,
          },
          properties: {
            fillColor: data.fillColor,
            strokeColor: '#1a1a1a',
          },
        },
        labelPosition: data.labelPosition,
      })
      .commit();

    console.log(`  ✓ Updated ${vineyard.name}`);
  }

  console.log('\n✅ Done! Refresh the map to see the new boundaries.');
  console.log('📍 http://localhost:3000/maps/howell-mountain');
}

updateVineyardBoundaries().catch(console.error);
