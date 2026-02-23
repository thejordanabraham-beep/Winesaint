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

function detectCorrectVineyard(wineName: string): string | null {
  // IMPORTANT: Order matters! More specific names must come before general ones
  const vineyardKeywords = [
    // Champagne clos
    'Clos d\'Ambonnay', 'Clos du Mesnil', 'Clos des Goisses',

    // California vineyards
    'Bien Nacido', 'To Kalon', 'Hirsch Vineyards', 'Hirsch', 'Durell', 'Pisoni',

    // Burgundy - Montrachet family (specific before general)
    'Criots-Bâtard-Montrachet', 'Bienvenues-Bâtard-Montrachet', 'Bâtard-Montrachet',
    'Chevalier-Montrachet', 'Le Montrachet', 'Montrachet',

    // Burgundy - Romanée family
    'Romanée-Conti', 'Romanée-Saint-Vivant', 'La Romanée', 'Romanée',

    // Burgundy - Corton family (specific before general)
    'Corton-Charlemagne', 'Corton-Bressandes', 'Corton-Renardes', 'Corton-Pougets', 'Corton',

    // Other Burgundy Grand Crus and Premier Crus
    'La Tâche', 'Richebourg', 'Les Amoureuses',
    'Clos de la Roche', 'Clos Saint-Denis', 'Clos de Tart', 'Clos de Bèze',
    'Clos Vougeot', 'Clos de Vougeot', 'Clos des Varoilles',
    'Bonnes-Mares', 'Chambertin', 'Échezeaux', 'Grands-Échezeaux'
  ];

  for (const keyword of vineyardKeywords) {
    if (wineName.includes(keyword)) {
      return keyword;
    }
  }
  return null;
}

async function findOrCreateVineyard(vineyardName: string, region: string): Promise<string | null> {
  try {
    const existing = await client.fetch(
      `*[_type == "vineyard" && name == $name][0]`,
      { name: vineyardName }
    );

    if (existing) return existing._id;

    const newVineyard = await client.create({
      _type: 'vineyard',
      name: vineyardName,
      region: region,
      slug: {
        current: vineyardName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').substring(0, 96)
      },
    });

    console.log(`  ✨ Created vineyard: ${vineyardName}`);
    return newVineyard._id;
  } catch (error: any) {
    console.error(`  ❌ Error creating vineyard: ${error.message}`);
    return null;
  }
}

async function fix() {
  console.log('🔧 FIXING VINEYARD NAMES');
  console.log('='.repeat(70));

  // Get all wines with vineyards
  const wines = await client.fetch(`*[_type == 'wine' && defined(vineyard)]{
    _id,
    name,
    'vineyardName': vineyard->name,
    'regionName': region->name,
    vineyard
  }`);

  let fixCount = 0;

  for (const wine of wines) {
    const correctVineyard = detectCorrectVineyard(wine.name);

    if (correctVineyard && correctVineyard !== wine.vineyardName) {
      console.log(`\n❌ WRONG: ${wine.name}`);
      console.log(`   Current: ${wine.vineyardName}`);
      console.log(`   Should be: ${correctVineyard}`);

      // Find or create the correct vineyard
      const vineyardId = await findOrCreateVineyard(correctVineyard, wine.regionName || 'Unknown');

      if (vineyardId) {
        // Update the wine
        await client.patch(wine._id).set({
          vineyard: { _type: 'reference', _ref: vineyardId }
        }).commit();

        console.log(`   ✅ FIXED`);
        fixCount++;
      }
    } else {
      console.log(`✅ CORRECT: ${wine.name} → ${wine.vineyardName}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`Fixed ${fixCount} wines`);
}

fix();
