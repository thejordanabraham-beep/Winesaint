#!/usr/bin/env node
/**
 * Smart Bordeaux Duplicate Cleaner
 * Auto-detects and removes duplicates based on patterns
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const readline = require('readline');

const PAYLOAD_URL = 'http://localhost:3000';
let TOKEN = null;

// Appellations that should be deleted when a real wine name exists
const APPELLATION_NAMES = [
  'sauternes', 'pomerol', 'pauillac', 'margaux', 'saint-emilion', 'st-emilion',
  'saint-julien', 'saint-estephe', 'pessac-leognan', 'graves', 'medoc',
  'haut-medoc', 'barsac', 'fronsac', 'lalande-de-pomerol', 'moulis', 'listrac'
];

// Known different wines that share producer (don't delete these)
const DIFFERENT_WINES = [
  { producer: /yquem/i, names: ['y de yquem', 'yquem'] }, // Y d'Yquem is dry white
  { producer: /margaux/i, names: ['pavillon rouge', 'pavillon blanc', 'chateau margaux'] },
  { producer: /latour/i, names: ['les forts de latour', 'pauillac de latour', 'chateau latour'] },
  { producer: /lafite/i, names: ['carruades de lafite', 'chateau lafite rothschild'] },
  { producer: /mouton/i, names: ['le petit mouton', 'chateau mouton rothschild'] },
  { producer: /haut-brion/i, names: ['le clarence', 'la clarte', 'chateau haut-brion'] },
];

function isAppellationOnly(name) {
  const normalized = name.toLowerCase().trim();
  return APPELLATION_NAMES.some(app => normalized === app || normalized === app.replace('-', ' '));
}

function areKnownDifferentWines(producerName, wines) {
  for (const rule of DIFFERENT_WINES) {
    if (rule.producer.test(producerName)) {
      const names = wines.map(w => w.name.toLowerCase());
      const matchedRules = rule.names.filter(n => names.some(wn => wn.includes(n)));
      if (matchedRules.length > 1) {
        return true; // Multiple known different wines present
      }
    }
  }
  return false;
}

async function getToken() {
  const res = await fetch(PAYLOAD_URL + '/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.PAYLOAD_ADMIN_EMAIL,
      password: process.env.PAYLOAD_ADMIN_PASSWORD
    })
  });
  const data = await res.json();
  return data.token;
}

async function fetchAllBordeauxWines() {
  let allWines = [];
  let page = 1;
  let hasMore = true;

  process.stdout.write('Fetching wines');
  while (hasMore) {
    const res = await fetch(PAYLOAD_URL + '/api/wines?limit=100&page=' + page + '&depth=2');
    const data = await res.json();
    allWines = allWines.concat(data.docs);
    hasMore = data.hasNextPage;
    page++;
    process.stdout.write('.');
  }
  console.log(' done!\n');

  return allWines.filter(w => {
    const fullSlug = w.producer?.region?.fullSlug || '';
    return fullSlug.includes('bordeaux');
  });
}

async function deleteWineAndReview(wineId) {
  const headers = { 'Authorization': 'JWT ' + TOKEN };

  const reviewRes = await fetch(PAYLOAD_URL + '/api/reviews?where[wine][equals]=' + wineId, { headers });
  const reviewData = await reviewRes.json();

  for (const review of reviewData.docs || []) {
    await fetch(PAYLOAD_URL + '/api/reviews/' + review.id, { method: 'DELETE', headers });
  }

  await fetch(PAYLOAD_URL + '/api/wines/' + wineId, { method: 'DELETE', headers });
}

async function main() {
  TOKEN = await getToken();
  if (!TOKEN) {
    console.log('Failed to authenticate');
    process.exit(1);
  }

  const wines = await fetchAllBordeauxWines();
  console.log('Found ' + wines.length + ' Bordeaux wines\n');

  // Group by producer + vintage
  const groups = {};
  wines.forEach(w => {
    const producerName = w.producer?.name || 'Unknown';
    const key = producerName + '|' + w.vintage;

    if (!groups[key]) groups[key] = [];
    groups[key].push({
      id: w.id,
      name: w.name,
      vintage: w.vintage,
      producer: producerName
    });
  });

  // Find duplicates and categorize
  const toDelete = [];
  const toSkip = [];
  const toReview = [];

  Object.values(groups).forEach(group => {
    if (group.length <= 1) return;

    const producerName = group[0].producer;

    // Check if these are known different wines
    if (areKnownDifferentWines(producerName, group)) {
      toSkip.push({ reason: 'Known different wines', group });
      return;
    }

    // Find wines that are just appellation names
    const appellationWines = group.filter(w => isAppellationOnly(w.name));
    const realWines = group.filter(w => !isAppellationOnly(w.name));

    if (appellationWines.length > 0 && realWines.length > 0) {
      // Delete the appellation-only wines
      appellationWines.forEach(w => {
        toDelete.push({ wine: w, reason: 'Appellation-only name', keep: realWines[0].name });
      });
      return;
    }

    // Otherwise needs manual review
    toReview.push(group);
  });

  // Report
  console.log('========================================');
  console.log('ANALYSIS COMPLETE');
  console.log('========================================\n');

  console.log('AUTO-DELETE (' + toDelete.length + ' wines):');
  console.log('These have appellation-only names when a real name exists:\n');
  toDelete.forEach(d => {
    console.log('  DELETE: "' + d.wine.name + '" ' + d.wine.vintage + ' (ID ' + d.wine.id + ')');
    console.log('    KEEP: "' + d.keep + '"');
    console.log('');
  });

  console.log('\nAUTO-SKIP (' + toSkip.length + ' groups):');
  console.log('These are known different wines (not duplicates):\n');
  toSkip.slice(0, 5).forEach(s => {
    console.log('  ' + s.group[0].producer + ' ' + s.group[0].vintage + ': ' + s.group.map(w => '"' + w.name + '"').join(', '));
  });
  if (toSkip.length > 5) console.log('  ... and ' + (toSkip.length - 5) + ' more');

  console.log('\n\nNEEDS REVIEW (' + toReview.length + ' groups):');
  console.log('These need manual inspection:\n');
  toReview.slice(0, 10).forEach(group => {
    console.log('  ' + group[0].producer + ' ' + group[0].vintage + ':');
    group.forEach(w => console.log('    - "' + w.name + '" (ID ' + w.id + ')'));
  });
  if (toReview.length > 10) console.log('  ... and ' + (toReview.length - 10) + ' more');

  console.log('\n========================================');
  console.log('READY TO DELETE ' + toDelete.length + ' WINES');
  console.log('========================================\n');

  if (toDelete.length === 0) {
    console.log('Nothing to auto-delete.');
    process.exit(0);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Proceed with deletion? (yes/no): ', async (answer) => {
    if (answer.toLowerCase() === 'yes') {
      console.log('\nDeleting...\n');
      for (const d of toDelete) {
        process.stdout.write('  Deleting ID ' + d.wine.id + ' "' + d.wine.name + '"...');
        await deleteWineAndReview(d.wine.id);
        console.log(' done');
      }
      console.log('\nDeleted ' + toDelete.length + ' wines!');
    } else {
      console.log('Aborted.');
    }
    rl.close();
  });
}

main().catch(console.error);
