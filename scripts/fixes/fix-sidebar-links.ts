import { getPayload } from 'payload';
import config from '../payload.config';

async function fixSidebarLinks() {
  const payload = await getPayload({ config });

  // Get all regions with sidebarLinks
  const allRegions = await payload.find({
    collection: 'regions',
    limit: 3000,
  });

  let fixedCount = 0;
  let removedLinks = 0;

  // Greece sub-regions that incorrectly link to siblings
  const greeceSiblingRegions = [
    'greece/northern-greece/naoussa',
    'greece/northern-greece/amyndeon',
    'greece/northern-greece/drama',
    'greece/peloponnese/nemea',
    'greece/peloponnese/mantinia',
    'greece/peloponnese/patras'
  ];

  for (const region of allRegions.docs) {
    if (!region.sidebarLinks || region.sidebarLinks.length === 0) continue;

    const originalLength = region.sidebarLinks.length;
    let newLinks = [...region.sidebarLinks];

    // Filter out château/producer links and placeholders
    newLinks = newLinks.filter((link: any) => {
      const slug = link.slug.toLowerCase();
      // Remove château links (producers, not regions)
      if (slug.startsWith('chateau-')) return false;
      if (slug.startsWith('vieux-chateau-')) return false;
      // Remove placeholder "wine-region" links
      if (slug === 'wine-region') return false;
      return true;
    });

    // For Greece sub-regions, clear sibling links entirely
    if (greeceSiblingRegions.includes(region.fullSlug)) {
      newLinks = [];
    }

    // If we filtered anything, update the region
    if (newLinks.length !== originalLength) {
      const removed = originalLength - newLinks.length;
      console.log(`${region.fullSlug}: removing ${removed} invalid links`);

      await payload.update({
        collection: 'regions',
        id: region.id,
        data: {
          sidebarLinks: newLinks
        }
      });

      fixedCount++;
      removedLinks += removed;
    }
  }

  console.log(`\nFixed ${fixedCount} regions`);
  console.log(`Removed ${removedLinks} invalid sidebar links`);

  process.exit(0);
}

fixSidebarLinks().catch(console.error);
