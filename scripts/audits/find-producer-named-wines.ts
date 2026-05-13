import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAYLOAD_URL = 'http://localhost:3000';

async function main() {
  const loginRes = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.PAYLOAD_ADMIN_EMAIL, password: process.env.PAYLOAD_ADMIN_PASSWORD }),
  });
  const { token } = await loginRes.json();

  // Fetch all wines, check if name equals producer name
  let page = 1;
  const matches: any[] = [];

  while (true) {
    const res = await fetch(`${PAYLOAD_URL}/api/wines?limit=250&page=${page}&depth=1`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) break;

    for (const w of data.docs) {
      const producerName = typeof w.producer === 'object' ? w.producer?.name : null;
      if (producerName && w.name === producerName) {
        const regionName = typeof w.region === 'object' ? w.region?.name : String(w.region || '?');
        // Check review count
        const revRes = await fetch(`${PAYLOAD_URL}/api/reviews?where[wine][equals]=${w.id}&limit=1&depth=0`, {
          headers: { Authorization: `JWT ${token}` },
        });
        const revData = await revRes.json();
        matches.push({
          id: w.id,
          name: w.name,
          vintage: w.vintage,
          producer: producerName,
          producerId: typeof w.producer === 'object' ? w.producer.id : w.producer,
          region: regionName,
          reviews: revData.totalDocs,
        });
      }
    }

    process.stdout.write(`  Scanned page ${page}/${data.totalPages}...\r`);
    if (!data.hasNextPage) break;
    page++;
  }

  console.log(`\nFound ${matches.length} wines where name = producer name:\n`);
  for (const m of matches) {
    console.log(`  ID=${m.id} "${m.name}" ${m.vintage} | producer=${m.producer} (${m.producerId}) | region=${m.region} | ${m.reviews} reviews`);
  }
}

main().catch(console.error);
