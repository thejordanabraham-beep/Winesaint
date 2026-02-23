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

// Additional vineyard addresses found through research
const ADDITIONAL_VINEYARDS: Record<string, { name: string; description?: string }> = {
  // Pope Valley / Chiles Valley
  '4105 CHILES POPE VALLEY': {
    name: 'Maxville Winery',
    description: '1,000-acre estate in Chiles Valley. Modern winery with stunning architecture and panoramic views.',
  },
  '6307 POPE VALLEY': {
    name: 'Pope Valley Winery',
    description: 'Historic winery established 1897. 11th oldest winery in Napa Valley, fifth generation family operation.',
  },

  // White Cottage Road
  '501 N WHITE COTTAGE': {
    name: 'ADAMVS',
    description: 'Biodynamically farmed mountain estate. Philippe Melka consulting winemaker. Premium Cabernet Sauvignon.',
  },
  '920 N WHITE COTTAGE': {
    name: 'Spence Vineyards',
    description: 'Boutique winery constructed in 2012. First new winery on Howell Mountain in 22 years.',
  },
  '805 N WHITE COTTAGE': {
    name: 'White Cottage Vineyard',
    description: 'Estate vineyard on North White Cottage Road, Howell Mountain.',
  },
  '765 N WHITE COTTAGE': {
    name: 'White Cottage Estate',
    description: 'Vineyard property on North White Cottage Road.',
  },
  '120 S WHITE COTTAGE': {
    name: 'South White Cottage Vineyard',
    description: 'Estate vineyard at the entrance to Howell Mountain.',
  },

  // Crystal Springs
  '424 CRYSTAL SPRINGS': {
    name: 'Crystal Springs Vineyard',
    description: 'Vineyard in the Crystal Springs region, in the foothills below Howell Mountain.',
  },
  '563 CRYSTAL SPRINGS': {
    name: 'Crystal Springs Estate',
    description: 'Estate winery in the Crystal Springs area.',
  },
  '264 N FORK CRYSTAL SPRINGS': {
    name: 'North Fork Vineyard',
    description: 'Vineyard on North Fork Crystal Springs Road.',
  },
  '228 N FORK CRYSTAL SPRINGS': {
    name: 'North Fork Estate',
    description: 'Estate property on North Fork Crystal Springs Road.',
  },

  // Las Posadas Road
  '1181 LAS POSADAS': {
    name: 'Las Posadas Vineyard',
    description: 'Estate vineyard on Las Posadas Road, Howell Mountain.',
  },
  '1100 LAS POSADAS': {
    name: 'La Jota Vineyard Co.',
    description: 'Historic vineyard dating to 1898. Part of Jackson Family Wines.',
  },

  // Stone Ridge Road
  '330 STONE RIDGE': {
    name: 'Bravante Vineyards',
    description: 'Family-owned boutique estate. 100% estate grown. Award-winning Howell Mountain Merlot.',
  },

  // Big Tree Road
  '1010 BIG TREE': {
    name: 'Benessere Vineyards',
    description: 'Italian-inspired winery on the Napa Valley floor near the Napa River.',
  },
  '1015 BIG TREE': {
    name: 'Big Tree Vineyard',
    description: 'Vineyard property on Big Tree Road.',
  },

  // Lommel Road
  '817 LOMMEL': {
    name: 'Hourglass Estate',
    description: 'Premium Cabernet producer in Calistoga. Distinctive hourglass-shaped vineyard.',
  },
  '800 LOMMEL': {
    name: 'Lommel Road Vineyard',
    description: 'Vineyard property on Lommel Road near Calistoga.',
  },

  // Silverado Trail additions
  '3522 SILVERADO': {
    name: 'Rombauer Vineyards',
    description: 'Founded 1980. Famous for Chardonnay. Beautiful hilltop setting with Mayacamas views.',
  },
  '3942 SILVERADO': {
    name: 'Ladera Vineyards',
    description: 'New tasting room location on Silverado Trail. Originally from Howell Mountain.',
  },
  '3528 SILVERADO': {
    name: 'Silverado Trail Estate',
    description: 'Estate property on Silverado Trail.',
  },
  '3520 SILVERADO': {
    name: 'Silverado Trail Vineyard',
    description: 'Vineyard property on Silverado Trail.',
  },
  '3549 SILVERADO': {
    name: 'Silverado Estates',
    description: 'Estate vineyard on Silverado Trail.',
  },
  '3557 SILVERADO': {
    name: 'Silverado Heights',
    description: 'Vineyard property on Silverado Trail.',
  },
  '3242 N SILVERADO': {
    name: 'North Silverado Vineyard',
    description: 'Winery on North Silverado Trail.',
  },
  '2900 SILVERADO': {
    name: 'Silverado Valley Vineyard',
    description: 'Estate vineyard on Silverado Trail.',
  },

  // Ehlers Lane
  '3244 EHLERS': {
    name: 'Allora Vineyards',
    description: 'Boutique winery established 1999. Small-lot, high-quality fruit.',
  },
  '3264 EHLERS': {
    name: 'Ehlers Lane Vineyard',
    description: 'Vineyard property on historic Ehlers Lane.',
  },
  '3200 EHLERS': {
    name: 'Ehlers Lane Estate',
    description: 'Estate winery on Ehlers Lane.',
  },
  '3250 EHLERS': {
    name: 'Ehlers Lane Cellars',
    description: 'Small vineyard on Ehlers Lane.',
  },
  '3256 EHLERS': {
    name: 'Ehlers Lane Wines',
    description: 'Boutique vineyard on Ehlers Lane.',
  },
  '3242 EHLERS': {
    name: 'Ehlers Grove Vineyard',
    description: 'Small vineyard on Ehlers Lane.',
  },
  '1119 EHLERS': {
    name: 'Lower Ehlers Vineyard',
    description: 'Vineyard property on Ehlers Lane.',
  },

  // St Helena Highway
  '3070 ST HELENA': {
    name: 'Trinchero Napa Valley',
    description: 'Family-owned since 1948. Luxury single-vineyard wines. Views of Spring Mountain and Howell Mountain.',
  },
  '3285 ST HELENA': {
    name: 'St Helena Highway Winery',
    description: 'Winery on Highway 29 in St Helena.',
  },
  '3199 N ST HELENA': {
    name: 'North St Helena Vineyard',
    description: 'Vineyard on North St Helena Highway.',
  },
  '3315 N ST HELENA': {
    name: 'Highway 29 Winery',
    description: 'Winery on Highway 29 north of St Helena.',
  },
  '3718 N ST HELENA': {
    name: 'Upper Highway Vineyard',
    description: 'Vineyard on Highway 29 north of St Helena.',
  },
  '3358 ST HELENA': {
    name: 'St Helena Winery',
    description: 'Winery on Highway 29.',
  },
  '3022 N ST HELENA': {
    name: 'Trinchero Estate',
    description: 'Part of Trinchero family holdings.',
  },

  // Lodi Lane
  '1000 LODI': {
    name: 'Duckhorn Vineyards',
    description: 'One of Napa\'s original 40 wineries. Founded 1970s. Renowned Merlot and Cabernet.',
  },
  '1160 LODI': {
    name: 'Lodi Lane Vineyard',
    description: 'Vineyard on historic Lodi Lane.',
  },

  // Bale Lane
  '1090 BALE': {
    name: 'Bale Lane Vineyard',
    description: 'Vineyard on historic Bale Lane near St Helena.',
  },
  '1109 BALE': {
    name: 'Bale Lane Estate',
    description: 'Small estate on Bale Lane.',
  },
  '1105 BALE': {
    name: 'Bale Lane Cellars',
    description: 'Boutique vineyard on Bale Lane.',
  },
  '1107 BALE': {
    name: 'Bale Creek Vineyard',
    description: 'Small vineyard on Bale Lane.',
  },

  // Summit Lake Drive additions
  '1296 SUMMIT LAKE': {
    name: 'Summit Lake Heights',
    description: 'Estate on Summit Lake Drive, Howell Mountain.',
  },

  // Other roads
  '335 WEST': {
    name: 'West Lane Vineyard',
    description: 'Vineyard on West Lane.',
  },

  // Corrections - update existing with better info
  '1120 DEER PARK': {
    name: 'Viader Vineyards',
    description: 'Founded 1986 by Delia Viader. 96-acre estate at 1,400 feet. Bordeaux-style blends.',
  },
};

async function addMoreVineyardNames() {
  console.log('🍷 Adding more vineyard names to parcels...\n');

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
    const currentName = vineyard.name || '';

    // Skip if already has a vineyard name (contains parentheses)
    if (currentName.includes('(') && !currentName.includes('Deer Park Winery')) {
      skipped++;
      continue;
    }

    const upperName = currentName.toUpperCase();

    let matchedVineyard: { name: string; description?: string } | null = null;

    for (const [pattern, info] of Object.entries(ADDITIONAL_VINEYARDS)) {
      if (upperName.includes(pattern)) {
        matchedVineyard = info;
        break;
      }
    }

    if (matchedVineyard) {
      const addressPart = currentName.includes('(')
        ? currentName.match(/\(([^)]+)\)/)?.[1] || currentName
        : currentName;

      const newName = `${matchedVineyard.name} (${addressPart})`;
      const newSlug = matchedVineyard.name
        .toLowerCase()
        .replace(/['']/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

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

  console.log(`\n✅ Updated ${updated} additional vineyards`);
  console.log(`⏭  Skipped ${skipped} (already named or no match)`);
  console.log('\n📍 View: http://localhost:3000/maps/howell-mountain');
}

addMoreVineyardNames().catch(console.error);
