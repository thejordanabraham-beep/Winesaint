import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAYLOAD_URL = 'http://localhost:3000';
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const FAILED_IDS = [
  // Auth failures (JWT expired)
  1079,1080,1081,1082,1083,1084,1085,1086,1087,1088,1089,1090,
  1091,1092,1093,1094,1095,1096,1097,1098,1099,1100,1101,1102,
  1103,1104,1105,1106,1107,1108,1109,1110,1111,1112,1113,1114,
  1115,1116,1118,1119,1120,1121,1122,1123,1124,1125,1126,1127,
  1128,1129,1130,1131,1132,
  // PATCH failures (transient)
  1551, 1631, 9025, 9029, 9143, 9601, 9604,
  // Fetch failures (dev server down)
  8916,8917,8918,8919,8920,8921,8922,8923,8924,8925,
  8926,8927,8928,8929,8930,
  // Fetch failure (one-off)
  9607,
];

const SYSTEM_PROMPT = `You write wine reviews. Your voice is learned from the examples provided.

Guidelines:
- Match the tone, depth, and natural variety of the examples
- Let the wine's complexity guide the review's length (3-6 sentences typical)
- Include structure (tannins, acidity, body) when relevant to the wine
- Include drinking window when the wine warrants aging guidance
- When writing multiple reviews, vary your approach to avoid repetition

Trust the examples. They teach the voice.`;

const VOICE_EXAMPLES: Record<string, { wine: string; review: string }[]> = {
  red: [
    { wine: "2021 Failla Pinot Noir Occidental Ridge", review: "The 2021 Occidental Ridge is gorgeous. Silky tannins and sweet, floral top notes convey palpable finesse. Medium in body yet packed with flavor. Dark red-toned fruit, blood orange, cinnamon and cedar emerge in the glass. Clean mineral notes wrap it all up." },
    { wine: "2020 Bruno Giacosa Barbaresco Asili Riserva", review: "A sensual beauty, dark and expansive on the palate with gorgeous resonance. Wild cherry, lavender, cedar, new leather and spice build effortlessly. One of the finest Red Labels in some time. Drink 2028-2050." },
    { wine: "2018 Martinelli Syrah Vellutini Ranch", review: "One of the most extroverted wines in the range. Inky red fruit, spice, chocolate, licorice, leather and cedar power through. Requires time to shed formidable tannin. A powerhouse that demands cellaring through 2028." },
    { wine: "Bonneau Châteauneuf Reserve Des Célestins", review: "Outrageously ripe and powerful on the nose, with dense aromas of cherry, crème de framboise and coffee. Solid and weighty on the palate. Very long aftertaste with broad, sweet tannins. Built for decades." },
    { wine: "2021 Kongsgaard Syrah Hudson Vineyard", review: "Checking in at 14.83% alcohol, the 2021 Syrah Hudson Vineyard is rich, powerful and dense. Dark fruit, spice, chocolate, leather and a hint of smoke build beautifully. The tannins are firm but ripe. Needs time." },
    { wine: "2022 Domaine de la Côte Pinot Noir Bloom's Field", review: "Gorgeous energy and vibrancy here. Red fruit, crushed flowers and savory herbs flow with effortless grace. Silky tannins and piercing acidity. Pure class." },
    { wine: "2019 Domaine Dujac Clos de la Roche", review: "Freshly cut flowers, sweet red berries and exotic spice waft from the glass. The palate is beautifully articulated with silky tannins framing layers of red fruit and earth. The finish goes on and on." },
    { wine: "2021 Château Léoville-Barton Saint-Julien", review: "Firm, structured and built for the cellar. Cassis, graphite and tobacco leaf over a firm tannic frame. Classic Saint-Julien. Give it a decade." },
  ],
  white: [
    { wine: "2021 Albert Mann Riesling Eichberg", review: "Still a touch of reduction on the nose, but the palate comes in with smoothness just short of creaminess. Wonderfully clean-cut, touches of white peach and lemon-framed Reine Claude plum. Sublime buffered freshness." },
    { wine: "2023 Failla Chardonnay Olivet Ranch", review: "Such a classy wine. Elegant and understated, all about vibrancy. Green pear, slate, chalk, mint and white pepper lend upper register brilliance to this taut, nervy Chardonnay." },
    { wine: "2022 Kistler Chardonnay Kistler Vineyard", review: "Compelling. Bright and sculpted, impresses with energy and delineation. Bright citrus peel, crushed rocks, jasmine, tangerine oil and mint give striking aromatic top notes. The tight finish demands cellaring." },
    { wine: "2022 Domaine Raveneau Chablis Blanchot", review: "Laser-focused and intense. Oyster shell, flint, citrus and white flowers lead to a palate of extraordinary precision. Tightly wound now. Needs five years minimum." },
    { wine: "2022 Domaine Weinbach Riesling Schlossberg", review: "Explosive aromatics of lime blossom, white peach and crushed stone. The palate is concentrated yet weightless, with that distinctive Schlossberg minerality running through the long finish. Brilliant." },
    { wine: "2022 François Cotat Sancerre Les Monts Damnés", review: "Thrilling tension and energy. Grapefruit, lime, chalk and a saline edge drive this nervy, precise Sancerre. The finish is long and mouthwatering. One of the finest from this address." },
  ],
  sparkling: [
    { wine: "NV Coutier Grand Cru Brut", review: "Light gold. Smoky, mineral-tinged aromas of dried pear, strawberry and anise. Sappy and focused on the palate, pliant orchard and pit fruit flavors with a refreshing bitter jolt of orange pith. Closes on a chalky mineral note." },
    { wine: "NV Laherte Blanc de Blancs Brut Nature", review: "Wonderfully precise and nuanced. Crushed rocks, lemon peel, mint, white pepper and bright saline notes run through this super-expressive, taut Blanc de Blancs. Classic." },
    { wine: "NV Egly-Ouriet Blanc de Noirs Grand Cru", review: "Dense, powerful and intense. Marvelous intensity from the generosity of Ambonnay and 60 months on lees. Intense plum, smoke, spice and anise meld into the rich, resonant finish." },
    { wine: "2012 Krug Vintage Brut", review: "The 2012 Krug is magnificent. Golden apple, brioche, roasted nuts and a hint of saffron unfold in waves. The mousse is impossibly fine. Power and finesse in perfect harmony. Has decades ahead." },
  ],
  rose: [
    { wine: "2023 Domaine Tempier Bandol Rosé", review: "The benchmark for serious rosé. Pale salmon hue with aromas of stone fruit, herbs and sea breeze. The palate has surprising depth and texture, finishing long with a savory, mineral edge." },
    { wine: "2023 Clos Cibonne Côtes de Provence Tibouren", review: "Delicate yet persistent. Peach, white flowers and a hint of salinity. The Tibouren grape gives lovely texture. Drink with bouillabaisse." },
  ],
  dessert: [
    { wine: "2021 Château d'Yquem Sauternes", review: "The 2021 Yquem is luminous gold with aromas of apricot, mango, honey and saffron. The palate is sweet but not cloying, with bracing acidity providing lift. Endless finish. A great vintage." },
    { wine: "2019 Dönnhoff Oberhäuser Brücke Riesling Eiswein", review: "Concentrated essence of Riesling. Apricot, peach, honey and citrus in perfect balance. The acidity is electric, cutting through the sweetness with precision. Tiny production, massive reward." },
  ],
};

function detectColor(wine: any): string {
  const name = ((wine.name || '') + ' ' + (wine.type || '')).toLowerCase();
  if (['riesling', 'grüner', 'chardonnay', 'blanc', 'sémillon', 'sauvignon', 'silvaner', 'weissburgunder', 'muscat', 'white'].some(w => name.includes(w))) return 'white';
  if (['rosé', 'rosalie', 'rose'].some(w => name.includes(w))) return 'rose';
  if (['brut', 'champagne', 'sparkling', 'crémant', 'sekt'].some(w => name.includes(w))) return 'sparkling';
  if (['recioto', 'eiswein', 'trockenbeerenauslese', 'beerenauslese', 'dessert', 'sweet'].some(w => name.includes(w))) return 'dessert';
  return 'red';
}

async function login(): Promise<string> {
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

async function editReview(
  existing: string,
  producer: string,
  wineName: string,
  vintage: string,
  region: string,
  color: string,
): Promise<{ tastingNotes: string; shortSummary: string; flavorProfile: string[] }> {
  const examples = VOICE_EXAMPLES[color] || VOICE_EXAMPLES.red;
  const examplesStr = examples.slice(0, 8).map(e => `WINE: ${e.wine}\nREVIEW: ${e.review}`).join('\n\n');

  const prompt = `Rewrite this wine review in your own words. Keep the same quality judgment and key facts (vineyards, drinking windows). Use different descriptors and a different angle. Be direct — jump straight into the tasting, don't announce the wine first. Drop filler from the original; only keep what matters.

WINE: ${producer} ${wineName} ${vintage}
REGION: ${region}

CURRENT REVIEW:
${existing}

VOICE EXAMPLES:
${examplesStr}

JSON:
{
  "tasting_notes": "your rewritten review",
  "short_summary": "10 words max",
  "flavor_profile": ["flavor1", "flavor2", "flavor3", "flavor4"]
}`;

  let message: any;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        temperature: 0.8,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      });
      break;
    } catch (err: any) {
      if (attempt < 4) {
        const wait = (attempt + 1) * 10000;
        console.log(`    Retrying in ${wait / 1000}s...`);
        await new Promise(r => setTimeout(r, wait));
      } else {
        throw err;
      }
    }
  }

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse review JSON');

  const data = JSON.parse(jsonMatch[0]);
  return {
    tastingNotes: data.tasting_notes,
    shortSummary: data.short_summary,
    flavorProfile: data.flavor_profile,
  };
}

async function main() {
  console.log(`=== WineSaint Review Cleanup ===`);
  console.log(`Processing ${FAILED_IDS.length} failed reviews\n`);

  const token = await login();
  console.log('Authenticated with Payload\n');

  let success = 0;
  let errors = 0;
  const startTime = Date.now();

  for (const id of FAILED_IDS) {
    try {
      const res = await fetch(`${PAYLOAD_URL}/api/reviews/${id}?depth=2`, {
        headers: { Authorization: `JWT ${token}` },
      });
      if (!res.ok) {
        console.log(`  ✗ ID ${id}: fetch failed (${res.status})`);
        errors++;
        continue;
      }

      const doc = await res.json();
      const wine = doc.wine;
      const existing = doc.tastingNotes;
      if (!existing || !wine) {
        console.log(`  SKIP ID ${id}: no tasting notes or wine data`);
        continue;
      }

      const producer = typeof wine.producer === 'object' ? wine.producer.name : 'Unknown';
      const wineName = wine.name || '';
      const vintage = String(wine.vintage || '');
      const region = typeof wine.region === 'object' ? wine.region.name : 'Unknown';
      const color = detectColor(wine);

      const result = await editReview(existing, producer, wineName, vintage, region, color);

      const flavorProfilePayload = result.flavorProfile.map((f: string) => ({ flavor: f }));
      const patchRes = await fetch(`${PAYLOAD_URL}/api/reviews/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `JWT ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tastingNotes: result.tastingNotes,
          shortSummary: result.shortSummary,
          flavorProfile: flavorProfilePayload,
        }),
      });

      if (patchRes.ok) {
        console.log(`  ✓ ID ${id}: ${producer} ${wineName} ${vintage}`);
        success++;
      } else {
        const errText = await patchRes.text();
        console.log(`  ✗ ID ${id}: PATCH failed — ${errText.substring(0, 100)}`);
        errors++;
      }
    } catch (err: any) {
      console.log(`  ✗ ID ${id}: ${err.message}`);
      errors++;
    }

    await new Promise(r => setTimeout(r, 1500));
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n=== COMPLETE ===`);
  console.log(`Success: ${success}/${FAILED_IDS.length}`);
  console.log(`Errors: ${errors}`);
  console.log(`Time: ${elapsed}s`);
}

main().catch(console.error);
