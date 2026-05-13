/**
 * Manual review editor
 */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000';

async function getToken(): Promise<string> {
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.PAYLOAD_ADMIN_EMAIL,
      password: process.env.PAYLOAD_ADMIN_PASSWORD,
    }),
  });
  const data = await res.json();
  return data.token;
}

async function updateReview(token: string, id: number, notes: string): Promise<boolean> {
  const res = await fetch(`${PAYLOAD_URL}/api/reviews/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `JWT ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tastingNotes: notes }),
  });
  return res.ok;
}

// Edits to make - ID: new notes
const EDITS: Record<number, string> = {
  401: "Desiccated citrus peel, pear skin, chamomile infusion, and subtle green herbal notes that speak to the complexity achievable on Watervale's limestone soils. The palate leans decidedly savory rather than overtly fruity, delivering concentrated orchard fruit and citrus flavors shot through with pronounced minerality. Floral elements emerge alongside a developing spice character as the wine opens with aeration. The finish demonstrates considerable length and chewy texture, leaving lingering impressions of citrus zest and candied ginger root.",
};

async function main() {
  const token = await getToken();
  console.log('Authenticated\n');

  for (const [id, notes] of Object.entries(EDITS)) {
    const ok = await updateReview(token, parseInt(id), notes);
    console.log(`${ok ? '✓' : '✗'} Review ${id}`);
  }
}

main().catch(console.error);
