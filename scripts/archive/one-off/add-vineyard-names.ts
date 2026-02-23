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

// Known vineyard addresses mapped to vineyard names
// Address patterns (uppercase) -> { name, description }
const KNOWN_VINEYARDS: Record<string, { name: string; description?: string }> = {
  '1108 DEER PARK': {
    name: 'Burgess Cellars',
    description: 'Historic Howell Mountain winery founded in 1972. One of the oldest operating wineries in the appellation.',
  },
  '360 HOWELL MOUNTAIN': {
    name: 'CADE Estate Winery',
    description: 'LEED Gold certified winery part of PlumpJack Group. Premium Cabernet Sauvignon from 1,800 feet elevation.',
  },
  '2000 SUMMIT LAKE': {
    name: 'Summit Lake Vineyards',
    description: 'Family-owned since 1971. Specializes in old-vine Zinfandel and Cabernet Sauvignon.',
  },
  '2075 SUMMIT LAKE': {
    name: 'Outpost Wines',
    description: 'Estate winery at 2,200 feet elevation. Organically farmed Zinfandel, Cabernet, and Petite Sirah.',
  },
  '1300 SUMMIT LAKE': {
    name: 'Robert Foley Vineyards',
    description: 'Boutique producer known for bold Howell Mountain reds. Tastings by appointment.',
  },
  '975 DEER PARK': {
    name: 'Ink Grade Cellars',
    description: 'Modern winery producing premium Howell Mountain wines.',
  },
  '1120 DEER PARK': {
    name: 'Deer Park Winery',
    description: 'Estate winery on historic Deer Park Road in the heart of Howell Mountain.',
  },
  '1156 DEER PARK': {
    name: 'Deer Park Vineyards',
    description: 'Vineyard property on Deer Park Road.',
  },
  '2600 SUMMIT LAKE': {
    name: 'Lokoya Winery',
    description: 'Luxury mountain Cabernet producer. Part of Jackson Family Wines.',
  },
  '2475 SUMMIT LAKE': {
    name: 'Howell Mountain Vineyards',
    description: 'Estate vineyard producing premium mountain fruit.',
  },
  '1455 SUMMIT LAKE': {
    name: 'Summit Lake Estate',
    description: 'Small estate vineyard on Summit Lake Drive.',
  },
  '3000 SUMMIT LAKE': {
    name: 'Amici Cellars',
    description: 'Howell Mountain estate producing Cabernet Sauvignon.',
  },
  '4060 SILVERADO': {
    name: 'Darioush Winery',
    description: 'Persian-inspired architecture. Premium Cabernet Sauvignon estate.',
  },
  '3730 SILVERADO': {
    name: 'Signorello Estate',
    description: 'Family estate producing Cabernet Sauvignon and Chardonnay since 1980s.',
  },
  '3764 SILVERADO': {
    name: 'Silverado Vineyards',
    description: 'Estate vineyard on the Silverado Trail.',
  },
  '3468 SILVERADO': {
    name: 'Reynolds Family Winery',
    description: 'Family winery on the Silverado Trail.',
  },
  '601 MUND': {
    name: 'Ink Grade Vineyard',
    description: 'Large vineyard property providing fruit for premium wines.',
  },
  '1599 INK GRADE': {
    name: 'Ink Grade Cellars Vineyard',
    description: 'Extensive vineyard holdings on Ink Grade Road.',
  },
  '860 FRIESEN': {
    name: 'Friesen Vineyard',
    description: 'Vineyard property on Friesen Drive.',
  },
  '1150 FRIESEN': {
    name: 'Friesen Estate Winery',
    description: 'Estate winery on Friesen Drive.',
  },
  '544 LIPARITA': {
    name: 'Liparita Vineyard',
    description: 'Historic vineyard name dating to the 1880s. First California wine to win gold at Paris Exposition 1900.',
  },
  '716 LIPARITA': {
    name: 'Liparita Estate',
    description: 'Estate property on historic Liparita Avenue.',
  },
};

function formatAddress(addr: string): string {
  // Convert "2000 SUMMIT LAKE DR" to "2000 Summit Lake Dr"
  return addr
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function addVineyardNames() {
  console.log('🍷 Adding vineyard names to parcels...\n');

  // Get all vineyards in Howell Mountain
  const vineyards = await client.fetch(`
    *[_type == "vineyard"] {
      _id,
      name,
      slug,
      description
    }
  `);

  console.log(`Found ${vineyards.length} vineyards to check\n`);

  let updated = 0;
  let skipped = 0;

  for (const vineyard of vineyards) {
    // Extract address from current name (which is the formatted address)
    const currentName = vineyard.name || '';
    const upperName = currentName.toUpperCase();

    // Check if this matches any known vineyard
    let matchedVineyard: { name: string; description?: string } | null = null;
    let matchedPattern = '';

    for (const [pattern, info] of Object.entries(KNOWN_VINEYARDS)) {
      if (upperName.includes(pattern)) {
        matchedVineyard = info;
        matchedPattern = pattern;
        break;
      }
    }

    if (matchedVineyard) {
      // Create new name with vineyard name and address
      const newName = `${matchedVineyard.name} (${currentName})`;
      const newSlug = matchedVineyard.name
        .toLowerCase()
        .replace(/['']/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      // Update the vineyard
      await client.patch(vineyard._id)
        .set({
          name: newName,
          slug: { _type: 'slug', current: newSlug },
          description: matchedVineyard.description || vineyard.description,
        })
        .commit();

      console.log(`✓ ${matchedVineyard.name}`);
      console.log(`  ${currentName} → ${newName}`);
      updated++;
    } else {
      skipped++;
    }
  }

  console.log(`\n✅ Updated ${updated} vineyards with names`);
  console.log(`⏭  Skipped ${skipped} unmatched parcels (kept address-only names)`);
  console.log('\n📍 View: http://localhost:3000/maps/howell-mountain');
}

addVineyardNames().catch(console.error);
