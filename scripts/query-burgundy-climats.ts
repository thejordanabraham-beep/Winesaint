import { client } from '../lib/sanity/client';

async function queryBurgundyClimats() {
  console.log('🍷 Querying Sanity for Burgundy climats/vineyards...\n');

  // Query for all climats in Burgundy
  const query = `*[_type == "climat" && region->slug.current == "burgundy"] {
    name,
    "slug": slug.current,
    classification,
    "commune": commune->name,
    "communeSlug": commune->slug.current,
    "subRegion": subRegion->name,
    "subRegionSlug": subRegion->slug.current
  } | order(subRegionSlug asc, communeSlug asc, classification asc, name asc)`;

  const climats = await client.fetch(query);

  console.log(`Total climats found: ${climats.length}\n`);

  // Group by sub-region and commune
  const grouped: Record<string, Record<string, any[]>> = {};

  for (const climat of climats) {
    const subRegion = climat.subRegion || 'Unknown';
    const commune = climat.commune || 'Unknown';

    if (!grouped[subRegion]) {
      grouped[subRegion] = {};
    }
    if (!grouped[subRegion][commune]) {
      grouped[subRegion][commune] = [];
    }
    grouped[subRegion][commune].push(climat);
  }

  // Display results
  for (const [subRegion, communes] of Object.entries(grouped)) {
    console.log(`\n📍 ${subRegion}`);
    console.log('─'.repeat(80));

    for (const [commune, climatsInCommune] of Object.entries(communes)) {
      const grandCrus = climatsInCommune.filter(c => c.classification === 'Grand Cru').length;
      const premierCrus = climatsInCommune.filter(c => c.classification === 'Premier Cru').length;
      const village = climatsInCommune.filter(c => c.classification === 'Village' || !c.classification).length;

      console.log(`\n  ${commune}:`);
      console.log(`    Grand Crus: ${grandCrus}`);
      console.log(`    Premier Crus: ${premierCrus}`);
      console.log(`    Village: ${village}`);
      console.log(`    Total: ${climatsInCommune.length}`);

      // List Premier Crus
      if (premierCrus > 0) {
        const pcList = climatsInCommune
          .filter(c => c.classification === 'Premier Cru')
          .map(c => `      - ${c.name} (${c.slug})`)
          .join('\n');
        console.log(`    Premier Crus:\n${pcList}`);
      }
    }
  }

  // Summary by classification
  console.log('\n\n═══════════════════════════════════════════════════');
  console.log('SUMMARY');
  console.log('═══════════════════════════════════════════════════');
  const grandCrusTotal = climats.filter((c: any) => c.classification === 'Grand Cru').length;
  const premierCrusTotal = climats.filter((c: any) => c.classification === 'Premier Cru').length;
  const villageTotal = climats.filter((c: any) => c.classification === 'Village' || !c.classification).length;

  console.log(`Grand Crus: ${grandCrusTotal}`);
  console.log(`Premier Crus: ${premierCrusTotal}`);
  console.log(`Village: ${villageTotal}`);
  console.log(`Total: ${climats.length}`);
}

queryBurgundyClimats().catch(console.error);
