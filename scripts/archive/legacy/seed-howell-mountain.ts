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

// Howell Mountain AVA boundary (simplified polygon)
// Actual AVA established in 1983, elevation 1,400-2,200 ft
const HOWELL_MOUNTAIN_BOUNDARY = {
  type: 'Feature' as const,
  geometry: {
    type: 'Polygon' as const,
    coordinates: [[
      [-122.4800, 38.5800],
      [-122.4600, 38.5850],
      [-122.4400, 38.5800],
      [-122.4300, 38.5650],
      [-122.4350, 38.5450],
      [-122.4500, 38.5300],
      [-122.4700, 38.5350],
      [-122.4850, 38.5500],
      [-122.4900, 38.5650],
      [-122.4800, 38.5800],
    ]],
  },
};

// Sample vineyards in Howell Mountain
// These are approximate locations - real boundaries would need to be traced from satellite/GIS data
const HOWELL_MOUNTAIN_VINEYARDS = [
  {
    name: 'Dunn Vineyards',
    acreage: 46,
    primaryGrapes: ['Cabernet Sauvignon'],
    description: 'Founded by Randy Dunn in 1979, known for age-worthy, structured Cabernet Sauvignon.',
    labelPosition: { longitude: -122.4650, latitude: 38.5550 },
    fillColor: '#e63946',
    // Simplified polygon - real boundary would be more detailed
    coordinates: [[
      [-122.4680, 38.5580],
      [-122.4620, 38.5580],
      [-122.4620, 38.5520],
      [-122.4680, 38.5520],
      [-122.4680, 38.5580],
    ]],
  },
  {
    name: 'La Jota Vineyard',
    acreage: 28,
    primaryGrapes: ['Cabernet Sauvignon', 'Cabernet Franc'],
    description: 'Historic vineyard dating to 1898, revived in 1974. Mountain-grown Cabernet.',
    labelPosition: { longitude: -122.4750, latitude: 38.5650 },
    fillColor: '#457b9d',
    coordinates: [[
      [-122.4780, 38.5680],
      [-122.4720, 38.5680],
      [-122.4720, 38.5620],
      [-122.4780, 38.5620],
      [-122.4780, 38.5680],
    ]],
  },
  {
    name: 'Burgess Cellars',
    acreage: 40,
    primaryGrapes: ['Cabernet Sauvignon', 'Merlot'],
    description: 'One of Howell Mountain\'s oldest wineries, founded in 1972.',
    labelPosition: { longitude: -122.4550, latitude: 38.5700 },
    fillColor: '#2a9d8f',
    coordinates: [[
      [-122.4580, 38.5730],
      [-122.4520, 38.5730],
      [-122.4520, 38.5670],
      [-122.4580, 38.5670],
      [-122.4580, 38.5730],
    ]],
  },
  {
    name: 'O\'Shaughnessy Estate',
    acreage: 45,
    primaryGrapes: ['Cabernet Sauvignon'],
    description: 'Premium mountain estate known for elegant, powerful Cabernets.',
    labelPosition: { longitude: -122.4450, latitude: 38.5550 },
    fillColor: '#e9c46a',
    coordinates: [[
      [-122.4480, 38.5580],
      [-122.4420, 38.5580],
      [-122.4420, 38.5520],
      [-122.4480, 38.5520],
      [-122.4480, 38.5580],
    ]],
  },
  {
    name: 'Cade Estate',
    acreage: 54,
    primaryGrapes: ['Cabernet Sauvignon', 'Sauvignon Blanc'],
    description: 'LEED Gold certified winery with stunning views. Part of PlumpJack Group.',
    labelPosition: { longitude: -122.4700, latitude: 38.5450 },
    fillColor: '#f4a261',
    coordinates: [[
      [-122.4730, 38.5480],
      [-122.4670, 38.5480],
      [-122.4670, 38.5420],
      [-122.4730, 38.5420],
      [-122.4730, 38.5480],
    ]],
  },
  {
    name: 'Summit Lake Vineyards',
    acreage: 15,
    primaryGrapes: ['Zinfandel', 'Cabernet Sauvignon'],
    description: 'Small, family-owned vineyard specializing in old-vine Zinfandel.',
    labelPosition: { longitude: -122.4600, latitude: 38.5350 },
    fillColor: '#6d597a',
    coordinates: [[
      [-122.4620, 38.5370],
      [-122.4580, 38.5370],
      [-122.4580, 38.5330],
      [-122.4620, 38.5330],
      [-122.4620, 38.5370],
    ]],
  },
  {
    name: 'Beringer Howell Mountain',
    acreage: 80,
    primaryGrapes: ['Cabernet Sauvignon', 'Merlot'],
    description: 'Part of historic Beringer estate, mountain vineyards acquired in 1990s.',
    labelPosition: { longitude: -122.4400, latitude: 38.5700 },
    fillColor: '#588157',
    coordinates: [[
      [-122.4440, 38.5750],
      [-122.4360, 38.5750],
      [-122.4360, 38.5650],
      [-122.4440, 38.5650],
      [-122.4440, 38.5750],
    ]],
  },
  {
    name: 'Liparita',
    acreage: 30,
    primaryGrapes: ['Cabernet Sauvignon'],
    description: 'Historic vineyard revived in 1987, known for concentrated mountain fruit.',
    labelPosition: { longitude: -122.4500, latitude: 38.5450 },
    fillColor: '#bc6c25',
    coordinates: [[
      [-122.4530, 38.5480],
      [-122.4470, 38.5480],
      [-122.4470, 38.5420],
      [-122.4530, 38.5420],
      [-122.4530, 38.5480],
    ]],
  },
];

async function seedHowellMountain() {
  console.log('🍇 Seeding Howell Mountain appellation and vineyards...\n');

  // Check if Howell Mountain appellation already exists
  const existingAppellation = await client.fetch(
    `*[_type == "appellation" && slug.current == "howell-mountain"][0]`
  );

  let appellationId: string;

  if (existingAppellation) {
    console.log('✓ Howell Mountain appellation already exists');
    appellationId = existingAppellation._id;
  } else {
    // Create Howell Mountain appellation
    const appellation = await client.create({
      _type: 'appellation',
      name: 'Howell Mountain',
      slug: { _type: 'slug', current: 'howell-mountain' },
      parentRegion: { _type: 'reference', _ref: 'region-napa' },
      description: 'Howell Mountain is one of Napa Valley\'s most prestigious mountain appellations, established in 1983. Located in the eastern hills above St. Helena, the AVA is defined by its high elevation (minimum 1,400 feet), volcanic soils, and position above the fog line. These factors produce intensely concentrated wines with firm tannins and exceptional aging potential.',
      establishedYear: 1983,
      totalAcreage: 600,
      boundaries: HOWELL_MOUNTAIN_BOUNDARY,
      centerPoint: {
        longitude: -122.46,
        latitude: 38.555,
        defaultZoom: 13,
      },
    });

    console.log(`✓ Created Howell Mountain appellation (${appellation._id})`);
    appellationId = appellation._id;
  }

  // Create vineyards
  let created = 0;
  let skipped = 0;

  for (const vineyardData of HOWELL_MOUNTAIN_VINEYARDS) {
    const slug = vineyardData.name
      .toLowerCase()
      .replace(/['']/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    // Check if vineyard already exists
    const existing = await client.fetch(
      `*[_type == "vineyard" && slug.current == $slug][0]`,
      { slug }
    );

    if (existing) {
      console.log(`  ⏭ Skipping ${vineyardData.name} (already exists)`);
      skipped++;
      continue;
    }

    await client.create({
      _type: 'vineyard',
      name: vineyardData.name,
      slug: { _type: 'slug', current: slug },
      appellation: { _type: 'reference', _ref: appellationId },
      description: vineyardData.description,
      acreage: vineyardData.acreage,
      primaryGrapes: vineyardData.primaryGrapes,
      labelPosition: vineyardData.labelPosition,
      boundaries: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: vineyardData.coordinates,
        },
        properties: {
          fillColor: vineyardData.fillColor,
          strokeColor: '#1a1a1a',
        },
      },
    });

    console.log(`  ✓ Created ${vineyardData.name}`);
    created++;
  }

  console.log(`\n✅ Done! Created ${created} vineyards, skipped ${skipped}`);
  console.log('\n📍 View your map at: http://localhost:3000/maps/howell-mountain');
}

seedHowellMountain().catch(console.error);
