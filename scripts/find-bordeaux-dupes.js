/**
 * Find Bordeaux duplicate wines for review
 * Does NOT delete anything - just outputs a report
 */

const PAYLOAD_URL = 'http://localhost:3000';

// Normalize name for comparison (remove accents, common appellations)
function normalizeName(name) {
  return name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
    .toLowerCase()
    .replace(/\s*(pauillac|margaux|saint-[eé]milion|st-[eé]milion|pomerol|pessac-l[eé]ognan|sauternes|graves|medoc|haut-medoc|saint-julien|saint-estephe|barsac)\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function findDuplicates() {
  console.log('Fetching all wines...\n');

  // Fetch all wines
  let allWines = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(PAYLOAD_URL + '/api/wines?limit=100&page=' + page + '&depth=2');
    const data = await res.json();
    allWines = allWines.concat(data.docs);
    hasMore = data.hasNextPage;
    page++;
    process.stdout.write('\rFetched ' + allWines.length + ' wines...');
  }

  console.log('\n');

  // Filter to Bordeaux region
  const bordeauxWines = allWines.filter(function(w) {
    const fullSlug = w.producer?.region?.fullSlug || '';
    return fullSlug.includes('bordeaux');
  });

  console.log('Total wines: ' + allWines.length);
  console.log('Bordeaux wines: ' + bordeauxWines.length + '\n');

  // Group by producer + normalized name + vintage
  const groups = {};

  bordeauxWines.forEach(function(w) {
    const producerName = w.producer?.name || 'Unknown';
    const normalized = normalizeName(w.name);
    const key = producerName + '|' + normalized + '|' + w.vintage;

    if (!groups[key]) groups[key] = [];
    groups[key].push({
      id: w.id,
      name: w.name,
      normalized: normalized,
      vintage: w.vintage,
      producer: producerName,
      slug: w.slug
    });
  });

  // Find duplicates
  const duplicateGroups = Object.entries(groups)
    .filter(function(entry) { return entry[1].length > 1; })
    .map(function(entry) { return entry[1]; });

  console.log('========================================');
  console.log('DUPLICATE GROUPS FOUND: ' + duplicateGroups.length);
  console.log('========================================\n');

  const toDelete = [];

  duplicateGroups.forEach(function(group, i) {
    console.log('--- Group ' + (i + 1) + ' ---');

    // Sort: shorter name first (likely the one to keep)
    group.sort(function(a, b) { return a.name.length - b.name.length; });

    group.forEach(function(w, j) {
      const marker = j === 0 ? 'KEEP  ' : 'DELETE';
      console.log('  [' + marker + '] ID: ' + w.id + ' | "' + w.name + '" ' + w.vintage);
      if (j > 0) {
        toDelete.push(w.id);
      }
    });
    console.log('');
  });

  console.log('========================================');
  console.log('SUMMARY');
  console.log('========================================');
  console.log('Duplicate groups: ' + duplicateGroups.length);
  console.log('Wines to delete: ' + toDelete.length);
  console.log('\nWine IDs to delete:');
  console.log(toDelete.join(', '));

  return { duplicateGroups, toDelete };
}

findDuplicates().catch(console.error);
