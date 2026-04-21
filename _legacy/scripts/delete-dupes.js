require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const PAYLOAD_URL = 'http://localhost:3000';
const toDelete = [5426, 5234, 5230, 5226, 5098, 4921, 4907];

async function getToken() {
  const res = await fetch(PAYLOAD_URL + '/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.PAYLOAD_ADMIN_EMAIL || 'admin@winesaint.com',
      password: process.env.PAYLOAD_ADMIN_PASSWORD || 'admin123'
    })
  });
  const data = await res.json();
  return data.token;
}

async function deleteWineAndReview(wineId, token) {
  const headers = { 'Authorization': 'JWT ' + token };

  // First find the review for this wine
  const reviewRes = await fetch(PAYLOAD_URL + '/api/reviews?where[wine][equals]=' + wineId, { headers });
  const reviewData = await reviewRes.json();

  // Delete reviews
  for (const review of reviewData.docs || []) {
    const delRes = await fetch(PAYLOAD_URL + '/api/reviews/' + review.id, { method: 'DELETE', headers });
    if (delRes.ok) {
      console.log('  Deleted review ID:', review.id);
    }
  }

  // Delete wine
  const wineRes = await fetch(PAYLOAD_URL + '/api/wines/' + wineId, { method: 'DELETE', headers });
  if (wineRes.ok) {
    console.log('  Deleted wine ID:', wineId);
  } else {
    console.log('  FAILED wine ID:', wineId, '-', wineRes.status);
  }
}

async function run() {
  const token = await getToken();
  if (!token) {
    console.log('Failed to authenticate');
    return;
  }
  console.log('Authenticated. Deleting ' + toDelete.length + ' duplicates...\n');

  for (const id of toDelete) {
    console.log('Wine ID:', id);
    await deleteWineAndReview(id, token);
  }

  console.log('\nDone!');
}

run().catch(console.error);
