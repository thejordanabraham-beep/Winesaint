import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function deleteLiquors() {
  console.log('🗑️  DELETING SPIRITS/LIQUEURS');
  console.log('='.repeat(70));

  // Get all wines and filter for spirits manually
  const allWines = await client.fetch(`*[_type == 'wine']{
    _id,
    name,
    'producerName': producer->name
  }`);

  const spiritKeywords = [
    'Chartreuse',
    'Cognac',
    'Armagnac',
    'Rum',
    'Nikka',
    'Brandy',
    'Whisky',
    'Whiskey',
    'Vodka',
    'Gin',
    'Tequila',
    'Eau de Vie'
  ];

  // Wines that should NOT be deleted (false positives)
  const wineExceptions = [
    'Originel',
    'Original Vines',
    'L\'Origine',
    'Comando',
    'Ginestra',
    'Regina',
    'Sanctus',
    'Ginglet',
    'Rumbo'
  ];

  const liquorsToDelete: any[] = [];

  for (const wine of allWines) {
    const name = wine.name;

    // Check if it's a false positive first
    const isException = wineExceptions.some(exception => name.includes(exception));
    if (isException) continue;

    // Check if it's a spirit
    const isSpirit = spiritKeywords.some(keyword => name.includes(keyword));

    if (isSpirit) {
      liquorsToDelete.push(wine);
    }
  }

  console.log(`\nFound ${liquorsToDelete.length} spirits/liqueurs to delete:\n`);

  liquorsToDelete.forEach((l, i) => {
    console.log(`${i + 1}. ${l.name}`);
  });

  if (liquorsToDelete.length === 0) {
    console.log('No liquors to delete.');
    return;
  }

  console.log('\n' + '='.repeat(70));
  console.log('Deleting...\n');

  for (const liquor of liquorsToDelete) {
    await client.delete(liquor._id);
    console.log(`✅ Deleted: ${liquor.name}`);
  }

  console.log('\n' + '='.repeat(70));
  console.log(`✅ Deleted ${liquorsToDelete.length} spirits/liqueurs`);
}

deleteLiquors();
