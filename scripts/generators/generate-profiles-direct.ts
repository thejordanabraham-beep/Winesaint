/**
 * GENERATE PRODUCER PROFILES (Direct DB)
 *
 * Uses Claude API to draft profiles, writes directly to Postgres.
 * Bypasses Payload local API to avoid Next.js env dependency issues.
 *
 * USAGE:
 *   npx tsx scripts/generate-profiles-direct.ts [options]
 *
 * OPTIONS:
 *   --limit <n>        Max producers to process (default: all)
 *   --offset <n>       Skip first N producers (default: 0)
 *   --slug <slug>      Target a single producer by slug
 *   --overwrite        Process all producers, overwriting existing content
 *   --dry-run          Print drafts, don't write to DB
 *   --delay <ms>       Delay between API calls (default: 1000)
 */

import dotenv from 'dotenv';
import path from 'path';
import pg from 'pg';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const args = process.argv.slice(2);
const getArg = (name: string, fallback = '') => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const hasFlag = (name: string) => args.includes(name);

const LIMIT = parseInt(getArg('--limit', '0'), 10) || 0;
const OFFSET = parseInt(getArg('--offset', '0'), 10) || 0;
const SLUG = getArg('--slug', '');
const OVERWRITE = hasFlag('--overwrite');
const DRY_RUN = hasFlag('--dry-run');
const DELAY_MS = parseInt(getArg('--delay', '1000'), 10) || 1000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function textToLexical(text: string) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const children = blocks.map((block) => {
    const headingMatch = block.match(/^###\s+(.+)$/);
    if (headingMatch) {
      return {
        type: 'heading',
        version: 1,
        tag: 'h3',
        direction: 'ltr',
        format: '',
        indent: 0,
        children: [
          {
            type: 'text',
            version: 1,
            text: headingMatch[1],
            format: 0,
            mode: 'normal',
            style: '',
            detail: 0,
          },
        ],
      };
    }
    return {
      type: 'paragraph',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      textFormat: 0,
      children: [
        {
          type: 'text',
          version: 1,
          text: block,
          format: 0,
          mode: 'normal',
          style: '',
          detail: 0,
        },
      ],
    };
  });

  return {
    root: {
      type: 'root',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      children,
    },
  };
}

const PROMPT = `You are writing an editorial profile for a wine producer. The audience is knowledgeable wine drinkers, not professionals — they know what Grand Cru means; they don't need definitions. Tone: confident, specific, evocative but factual. No marketing fluff. No "passion for the land", "terroir-driven excellence", "where tradition meets innovation", etc. Don't reference Wine Saint, "this profile", or any website. Write like a printed reference.

Producer: {{NAME}}
Region: {{REGION}}
Country: {{COUNTRY}}
Wines we have reviewed (sample): {{WINES}}

Return STRICT JSON, no preamble, no code fences, in this exact shape:

{
  "summary": "<1-2 sentence blurb, max ~280 chars, for a producer card shown under wine reviews>",
  "description": "<long-form profile structured with three markdown H3 sections as described below>"
}

The description MUST use these three H3 sections, separated by blank lines:

### History
The producer, the people, ownership, family lineage, key transitions, timeline. This can be long if the story warrants it.

### Vineyards
Where the grapes grow — soils, sites, exposures, altitude, plantings, climate, farming practices (organic / biodynamic / sustainable / conventional).

### Winemaking
What happens in the cellar — fermentation style, vessels, oak regime, native yeast, filtration, aging, anything distinctive about how the wines are made. Include signature wines or styles the producer is known for.

Section weight will vary naturally. Don't pad thin sections — a single honest sentence is better than filler. If farming details are undocumented, say so briefly. If winemaking is conventional and unremarkable, note it and move on. If there's notable content beyond the core three (a second label, a famous controversy, a philosophical stance), fold it into whichever section it fits best or add a closing paragraph.

Each section header must be exactly "### History", "### Vineyards", or "### Winemaking" on its own line, followed by prose paragraphs. No bullets, no bold text within paragraphs, no sub-subheaders.

CRITICAL: Do not invent facts. If you don't know specific details (founding year, hectares, winemaker name, exact vineyard holdings), don't make them up. Write what's plausibly true for the region/style without inventing dates, names, or numbers. It's better to be vague than confidently wrong.

STYLE: Never use em dashes (—). Use commas, semicolons, colons, periods, or parentheses instead. No exceptions.`;

interface Producer {
  id: number;
  name: string;
  slug: string;
  region_name: string;
  country: string;
  summary: string | null;
}

async function fetchProducers(): Promise<Producer[]> {
  let query = `
    SELECT p.id, p.name, p.slug, p.summary,
           COALESCE(r.name, '') as region_name,
           COALESCE(p.country, r.country, '') as country
    FROM producers p
    LEFT JOIN regions r ON p.region_id = r.id
  `;
  const conditions: string[] = [];
  const params: any[] = [];

  if (SLUG) {
    conditions.push(`p.slug = $${params.length + 1}`);
    params.push(SLUG);
  } else if (!OVERWRITE) {
    conditions.push(`p.summary IS NULL`);
  }

  if (conditions.length) query += ` WHERE ${conditions.join(' AND ')}`;
  query += ` ORDER BY p.name`;
  if (LIMIT > 0) query += ` LIMIT ${LIMIT + OFFSET}`;

  const result = await pool.query(query, params);
  let rows = result.rows as Producer[];
  if (OFFSET > 0) rows = rows.slice(OFFSET);
  if (LIMIT > 0) rows = rows.slice(0, LIMIT);
  return rows;
}

async function fetchSampleWines(producerId: number): Promise<string[]> {
  const result = await pool.query(
    `SELECT vintage, name FROM wines WHERE producer_id = $1 ORDER BY vintage DESC LIMIT 8`,
    [producerId],
  );
  return result.rows.map((w: any) => `${w.vintage ?? 'NV'} ${w.name}`).filter(Boolean);
}

async function draftProfile(producer: Producer, wines: string[]) {
  const prompt = PROMPT
    .replace('{{NAME}}', producer.name)
    .replace('{{REGION}}', producer.region_name || 'Unknown')
    .replace('{{COUNTRY}}', producer.country || 'Unknown')
    .replace('{{WINES}}', wines.length ? wines.join('; ') : 'Not provided');

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2500,
    messages: [{ role: 'user', content: prompt }],
  });

  const block = response.content.find((c) => c.type === 'text');
  if (!block || block.type !== 'text') throw new Error(`No text response for ${producer.name}`);

  const raw = block.text.trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`No JSON in response for ${producer.name}: ${raw.slice(0, 200)}`);

  const parsed = JSON.parse(jsonMatch[0]);
  if (!parsed.summary || !parsed.description) {
    throw new Error(`Missing summary/description for ${producer.name}`);
  }
  return parsed as { summary: string; description: string };
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Missing ANTHROPIC_API_KEY in env');
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error('Missing DATABASE_URL in env');
    process.exit(1);
  }

  console.log(`Fetching producers (overwrite=${OVERWRITE}, slug=${SLUG || 'any'}, limit=${LIMIT || 'all'}, offset=${OFFSET})`);
  const producers = await fetchProducers();
  console.log(`Processing ${producers.length} producer(s)\n`);

  let ok = 0;
  let failed = 0;

  for (const [i, producer] of producers.entries()) {
    const tag = `[${i + 1}/${producers.length}] ${producer.name}`;
    try {
      const wines = await fetchSampleWines(producer.id);
      console.log(`${tag} — drafting (${wines.length} wines for context)...`);

      const draft = await draftProfile(producer, wines);
      console.log(`  summary: ${draft.summary}`);
      console.log(`  description preview: ${draft.description.slice(0, 150)}...\n`);

      if (!DRY_RUN) {
        const lexical = textToLexical(draft.description);
        await pool.query(
          `UPDATE producers SET summary = $1, description = $2, updated_at = NOW() WHERE id = $3`,
          [draft.summary, JSON.stringify(lexical), producer.id],
        );
        console.log(`  ✓ saved to DB\n`);
      } else {
        console.log(`  [DRY RUN] skipped write\n`);
      }
      ok++;
    } catch (err) {
      failed++;
      console.error(`${tag} — FAILED:`, err instanceof Error ? err.message : err, '\n');
    }

    if (i < producers.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\nDone. ok=${ok} failed=${failed}`);
  await pool.end();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(async (err) => {
  console.error('Fatal:', err);
  await pool.end();
  process.exit(1);
});
