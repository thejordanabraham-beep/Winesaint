import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const args = process.argv.slice(2);
const getArg = (name: string, defaultValue: string = '') => {
  const index = args.indexOf(name);
  return index !== -1 && args[index + 1] ? args[index + 1] : defaultValue;
};

const PAYLOAD_URL = 'http://localhost:3000';
const LIMIT = getArg('--limit') ? parseInt(getArg('--limit')) : null;
const OFFSET = getArg('--offset') ? parseInt(getArg('--offset')) : 0;
const DELAY = parseInt(getArg('--delay', '1500'));
const DRY_RUN = args.includes('--dry-run');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
    { wine: "2019 Château Grand-Puy-Lacoste Pauillac", review: "The 2019 shows classic Pauillac structure with cassis and graphite notes. There's good depth mid-palate, but the finish is a tad diffuse and dry. Lacks the concentration of the finest vintages." },
    { wine: "2020 Ridge Monte Bello", review: "The 2020 Monte Bello is elegant rather than powerful. Red and black fruit mingle with cedar, sage and crushed rocks. I wanted a bit more fruit density at this stage. Perhaps just needs time to knit together. Drink 2028-2045." },
    { wine: "2015 Oddero Barolo Riserva Bussia", review: "Gorgeous and beguiling, needing time to be fully expressive. Deep and sumptuous in feel. Time in glass brings out floral and spice notes to play off sweet red cherry and plum fruit. All class. Best from 2027." },
    { wine: "2018 Screaming Eagle Cabernet Sauvignon", review: "Rich and opulent with layers of dark fruit and spice. The texture is seamless. Maybe this was just not showing on the day? It felt more reserved than expected given the vintage's reputation. Time will tell." },
    { wine: "2019 Domaine Dujac Clos de la Roche", review: "Freshly cut flowers, sweet red berries and exotic spice waft from the glass. The palate is beautifully articulated with silky tannins framing layers of red fruit and earth. The finish goes on and on." },
    { wine: "2021 Château Léoville-Barton Saint-Julien", review: "Firm, structured and built for the cellar. Cassis, graphite and tobacco leaf over a firm tannic frame. Classic Saint-Julien. Give it a decade." },
    { wine: "2019 Tenuta San Guido Sassicaia", review: "Another gorgeous wine in this range, the 2019 Sassicaia brings power with finesse. Dark cherry, herbs, iron and spice build seamlessly. The tannins are polished but present. Long, savory finish." },
  ],
  white: [
    { wine: "2021 Albert Mann Riesling Eichberg", review: "Still a touch of reduction on the nose, but the palate comes in with smoothness just short of creaminess. Wonderfully clean-cut, touches of white peach and lemon-framed Reine Claude plum. Sublime buffered freshness." },
    { wine: "2020 Billaud-Simon Chablis Les Blanchots", review: "Perfumed nose with Nashi pear, Japanese plum and lemon sherbet, opening nicely in the glass. Well balanced with crisp acidity, needs more substance on its slightly attenuated finish." },
    { wine: "2023 Failla Chardonnay Olivet Ranch", review: "Such a classy wine. Elegant and understated, all about vibrancy. Green pear, slate, chalk, mint and white pepper lend upper register brilliance to this taut, nervy Chardonnay." },
    { wine: "2022 Kistler Chardonnay Kistler Vineyard", review: "Compelling. Bright and sculpted, impresses with energy and delineation. Bright citrus peel, crushed rocks, jasmine, tangerine oil and mint give striking aromatic top notes. The tight finish demands cellaring." },
    { wine: "2021 Peter Michael Belle Côte Chardonnay", review: "The 2021 Belle Côte is rich and generous. Tropical fruit, honeysuckle, toasted almonds and a touch of butterscotch unfold beautifully. The oak is well-integrated. Finishes long with refreshing acidity keeping it in balance." },
    { wine: "2022 Domaine Raveneau Chablis Blanchot", review: "Laser-focused and intense. Oyster shell, flint, citrus and white flowers lead to a palate of extraordinary precision. Tightly wound now. Needs five years minimum." },
    { wine: "2022 Domaine Weinbach Riesling Schlossberg", review: "Explosive aromatics of lime blossom, white peach and crushed stone. The palate is concentrated yet weightless, with that distinctive Schlossberg minerality running through the long finish. Brilliant." },
    { wine: "2021 Kongsgaard Chardonnay Napa Valley", review: "There's an overripe/underripe quality that makes this hard to assess. Rich tropical fruit sits alongside green notes. The texture is creamy but the acidity feels slightly off. An unusual vintage here." },
    { wine: "2022 François Cotat Sancerre Les Monts Damnés", review: "Thrilling tension and energy. Grapefruit, lime, chalk and a saline edge drive this nervy, precise Sancerre. The finish is long and mouthwatering. One of the finest from this address." },
    { wine: "2021 Domaine Leflaive Puligny-Montrachet Les Pucelles", review: "The 2021 Pucelles is refined and graceful. Citrus blossom, white peach and subtle oak spice lead to a mineral-driven palate. Has that classic Puligny tension. Perfect for seafood." },
  ],
  sparkling: [
    { wine: "NV Coutier Grand Cru Brut", review: "Light gold. Smoky, mineral-tinged aromas of dried pear, strawberry and anise. Sappy and focused on the palate, pliant orchard and pit fruit flavors with a refreshing bitter jolt of orange pith. Closes on a chalky mineral note." },
    { wine: "NV Laherte Blanc de Blancs Brut Nature", review: "Wonderfully precise and nuanced. Crushed rocks, lemon peel, mint, white pepper and bright saline notes run through this super-expressive, taut Blanc de Blancs. Classic." },
    { wine: "NV Egly-Ouriet Blanc de Noirs Grand Cru", review: "Dense, powerful and intense. Marvelous intensity from the generosity of Ambonnay and 60 months on lees. Intense plum, smoke, spice and anise meld into the rich, resonant finish." },
    { wine: "2012 Krug Vintage Brut", review: "The 2012 Krug is magnificent. Golden apple, brioche, roasted nuts and a hint of saffron unfold in waves. The mousse is impossibly fine. Power and finesse in perfect harmony. Has decades ahead." },
    { wine: "NV Billecart-Salmon Brut Rosé", review: "Pale salmon. Delicate yet persistent, with red currant, wild strawberry and a touch of blood orange. The palate is creamy with fine bubbles and a long, refreshing finish. Elegant aperitif style." },
    { wine: "NV Pierre Gimonnet Cuvée Gastronome", review: "From 30+ year-old vines in the heart of the Côte des Blancs. Apple, chalk, lemon zest and a subtle yeastiness. Crisp acidity and a fine, persistent mousse. Transparent and pure." },
    { wine: "NV Moët & Chandon Impérial", review: "Reliable if simple. Apple, citrus and light brioche notes. Clean and refreshing but lacks the complexity and depth of the better grower champagnes. Serviceable for celebrations." },
    { wine: "NV Selosse Substance", review: "From a solera begun in 1986. Oxidative notes of dried apple, honey, hazelnut and spice. The zero dosage lets the vineyard speak. Profoundly individual. Not for everyone but utterly compelling for those who get it." },
  ],
  rose: [
    { wine: "2023 Domaine Tempier Bandol Rosé", review: "The benchmark for serious rosé. Pale salmon hue with aromas of stone fruit, herbs and sea breeze. The palate has surprising depth and texture, finishing long with a savory, mineral edge." },
    { wine: "2023 Clos Cibonne Côtes de Provence Tibouren", review: "Delicate yet persistent. Peach, white flowers and a hint of salinity. The Tibouren grape gives lovely texture. Drink with bouillabaisse." },
    { wine: "2023 Château Simone Palette Rosé", review: "One of France's most age-worthy rosés. Complex aromas of spice, herbs and red fruit. The palate is structured with fine tannins and a long, savory finish. Can develop for 5+ years." },
  ],
  dessert: [
    { wine: "2021 Château d'Yquem Sauternes", review: "The 2021 Yquem is luminous gold with aromas of apricot, mango, honey and saffron. The palate is sweet but not cloying, with bracing acidity providing lift. Endless finish. A great vintage." },
    { wine: "2019 Dönnhoff Oberhäuser Brücke Riesling Eiswein", review: "Concentrated essence of Riesling. Apricot, peach, honey and citrus in perfect balance. The acidity is electric, cutting through the sweetness with precision. Tiny production, massive reward." },
    { wine: "2017 Royal Tokaji Essencia", review: "Approaching syrup in texture yet somehow weightless. Quince, orange marmalade, saffron and a tea-like tannin. A spoonful is enough to contemplate for hours. More elixir than wine." },
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
  console.log('=== WineSaint Review Editor ===');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Offset: ${OFFSET}, Limit: ${LIMIT || 'all'}, Delay: ${DELAY}ms`);
  console.log(`Model: claude-sonnet-4-20250514`);
  console.log();

  let token = await login();
  let tokenTime = Date.now();
  console.log('Authenticated with Payload\n');

  async function freshToken() {
    if (Date.now() - tokenTime > 45 * 60 * 1000) {
      token = await login();
      tokenTime = Date.now();
      console.log('  (token refreshed)');
    }
    return token;
  }

  // Get total count
  const countRes = await fetch(`${PAYLOAD_URL}/api/reviews?limit=1`, {
    headers: { Authorization: `JWT ${token}` },
  });
  const countData = await countRes.json();
  const totalReviews = countData.totalDocs;
  console.log(`Total reviews in system: ${totalReviews}`);

  const toProcess = LIMIT ? Math.min(LIMIT, totalReviews - OFFSET) : totalReviews - OFFSET;
  console.log(`Processing: ${toProcess} reviews starting from offset ${OFFSET}\n`);

  let processed = 0;
  let errors = 0;
  let page = Math.floor(OFFSET / 100) + 1;
  let skipInFirstPage = OFFSET % 100;
  const startTime = Date.now();

  while (processed < toProcess) {
    await freshToken();
    const batchRes = await fetch(
      `${PAYLOAD_URL}/api/reviews?limit=100&page=${page}&sort=id&depth=2`,
      { headers: { Authorization: `JWT ${token}` } },
    );
    const batchData = await batchRes.json();

    if (!batchData.docs || batchData.docs.length === 0) break;

    const docs = skipInFirstPage > 0 ? batchData.docs.slice(skipInFirstPage) : batchData.docs;
    skipInFirstPage = 0;

    for (const doc of docs) {
      if (processed >= toProcess) break;

      const wine = doc.wine;
      const existing = doc.tastingNotes;
      if (!existing || !wine) {
        console.log(`  SKIP ID ${doc.id}: no tasting notes or wine data`);
        processed++;
        continue;
      }

      const producer = typeof wine.producer === 'object' ? wine.producer.name : 'Unknown';
      const wineName = wine.name || '';
      const vintage = String(wine.vintage || '');
      const region = typeof wine.region === 'object' ? wine.region.name : 'Unknown';
      const color = detectColor(wine);

      try {
        const result = await editReview(existing, producer, wineName, vintage, region, color);

        if (DRY_RUN) {
          console.log(`[${processed + 1}/${toProcess}] ID ${doc.id}: ${producer} ${wineName} ${vintage}`);
          console.log(`  BEFORE: ${existing.substring(0, 100)}...`);
          console.log(`  AFTER:  ${result.tastingNotes.substring(0, 100)}...`);
          console.log();
        } else {
          // PATCH the review
          const flavorProfilePayload = result.flavorProfile.map((f: string) => ({ flavor: f }));
          await freshToken();
          const patchRes = await fetch(`${PAYLOAD_URL}/api/reviews/${doc.id}`, {
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
            console.log(`  ✓ ID ${doc.id}: ${producer} ${wineName} ${vintage}`);
          } else {
            const errText = await patchRes.text();
            console.log(`  ✗ ID ${doc.id}: PATCH failed — ${errText.substring(0, 100)}`);
            errors++;
          }
        }
      } catch (err: any) {
        console.log(`  ✗ ID ${doc.id}: ${err.message}`);
        errors++;
      }

      processed++;

      if (processed % 10 === 0) {
        const elapsed = (Date.now() - startTime) / 1000;
        const rate = processed / elapsed;
        const remaining = (toProcess - processed) / rate;
        const hrs = Math.floor(remaining / 3600);
        const mins = Math.floor((remaining % 3600) / 60);
        console.log(`\n  --- Progress: ${processed}/${toProcess} (${((processed / toProcess) * 100).toFixed(1)}%) | ${elapsed.toFixed(0)}s elapsed | ~${hrs}h ${mins}m remaining ---\n`);
      }

      await new Promise(r => setTimeout(r, DELAY));
    }

    page++;
  }

  const elapsed = (Date.now() - startTime) / 1000;
  console.log('\n=== COMPLETE ===');
  console.log(`Processed: ${processed}`);
  console.log(`Errors: ${errors}`);
  console.log(`Time: ${(elapsed / 60).toFixed(1)} minutes`);
  console.log(`Avg: ${(elapsed / processed).toFixed(1)}s per review`);
}

main().catch(console.error);
