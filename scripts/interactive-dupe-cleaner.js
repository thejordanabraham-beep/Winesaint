#!/usr/bin/env node
/**
 * Interactive Bordeaux Duplicate Cleaner
 * Groups wines by producer + vintage and lets you delete specific entries
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const readline = require('readline');

const PAYLOAD_URL = 'http://localhost:3000';
let TOKEN = null;

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

  // Filter to Bordeaux
  return allWines.filter(w => {
    const fullSlug = w.producer?.region?.fullSlug || '';
    return fullSlug.includes('bordeaux');
  });
}

async function deleteWineAndReview(wineId) {
  const headers = { 'Authorization': 'JWT ' + TOKEN };

  // Find and delete reviews
  const reviewRes = await fetch(PAYLOAD_URL + '/api/reviews?where[wine][equals]=' + wineId, { headers });
  const reviewData = await reviewRes.json();

  for (const review of reviewData.docs || []) {
    await fetch(PAYLOAD_URL + '/api/reviews/' + review.id, { method: 'DELETE', headers });
  }

  // Delete wine
  await fetch(PAYLOAD_URL + '/api/wines/' + wineId, { method: 'DELETE', headers });
}

function askQuestion(rl, question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer.toLowerCase().trim());
    });
  });
}

async function main() {
  TOKEN = await getToken();
  if (!TOKEN) {
    console.log('Failed to authenticate');
    process.exit(1);
  }

  const wines = await fetchAllBordeauxWines();
  console.log('Found ' + wines.length + ' Bordeaux wines\n');

  // Group by producer + vintage only (not by name)
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

  // Find groups with multiple entries (potential duplicates)
  const duplicateGroups = Object.values(groups).filter(g => g.length > 1);

  if (duplicateGroups.length === 0) {
    console.log('No potential duplicates found!');
    process.exit(0);
  }

  console.log('Found ' + duplicateGroups.length + ' producer+vintage groups with multiple wines\n');
  console.log('Commands:');
  console.log('  1,2,3...  = Delete that wine number');
  console.log('  Enter     = Skip (keep all)');
  console.log('  q         = Quit');
  console.log('');
  console.log('================================================\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let deleted = 0;
  let skipped = 0;

  for (let i = 0; i < duplicateGroups.length; i++) {
    const group = duplicateGroups[i];

    console.log('--- Group ' + (i + 1) + '/' + duplicateGroups.length + ' ---');
    console.log('Producer: ' + group[0].producer + ' | Vintage: ' + group[0].vintage);
    console.log('');

    group.forEach((w, idx) => {
      console.log('  [' + (idx + 1) + '] ID ' + w.id + ': "' + w.name + '"');
    });
    console.log('');

    const answer = await askQuestion(rl, 'Delete which? (1-' + group.length + ' or comma-separated, Enter=skip, q=quit): ');

    if (answer === 'q') {
      console.log('\nQuitting...');
      break;
    }

    if (answer === '') {
      console.log('Skipped (keeping all)');
      skipped++;
    } else {
      // Parse comma-separated numbers
      const choices = answer.split(',').map(s => parseInt(s.trim())).filter(n => n >= 1 && n <= group.length);

      for (const choice of choices) {
        const toDelete = group[choice - 1];
        process.stdout.write('Deleting ID ' + toDelete.id + ' ("' + toDelete.name + '")...');
        await deleteWineAndReview(toDelete.id);
        console.log(' done!');
        deleted++;
      }

      if (choices.length === 0) {
        console.log('Invalid input, skipped');
        skipped++;
      }
    }
    console.log('');
  }

  rl.close();

  console.log('================================================');
  console.log('Summary: Deleted ' + deleted + ' wines, Skipped ' + skipped + ' groups');
}

main().catch(console.error);
