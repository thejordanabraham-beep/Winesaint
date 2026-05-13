/**
 * GENERATE PRODUCER PROFILES
 *
 * Drafts a `summary` (1-2 sentence blurb) and `description` (richText long-form
 * profile) for producers in Payload using Claude. Writes back via the Payload
 * Local API.
 *
 * USAGE:
 *   npx tsx scripts/generate-producer-profiles.ts [options]
 *
 * OPTIONS:
 *   --limit <n>        Max producers to process (default: all)
 *   --offset <n>       Skip first N producers (default: 0)
 *   --slug <slug>      Target a single producer by slug
 *   --only-empty       Only process producers with empty summary (default: true)
 *   --overwrite        Process all producers, overwriting existing content
 *   --dry-run          Print drafts, don't write to Payload
 *   --delay <ms>       Delay between API calls (default: 1500)
 *
 * EXAMPLES:
 *   npx tsx scripts/generate-producer-profiles.ts --limit 5 --dry-run
 *   npx tsx scripts/generate-producer-profiles.ts --slug ramey
 *   npx tsx scripts/generate-producer-profiles.ts --limit 50
 */

import 'dotenv/config';
import path from 'path';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { getPayload } from 'payload';
import config from '../payload.config';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

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
const ONLY_EMPTY = !hasFlag('--overwrite');
const DRY_RUN = hasFlag('--dry-run');
const DELAY_MS = parseInt(getArg('--delay', '1500'), 10) || 1500;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface ProducerRecord {
  id: number;
  name: string;
  slug: string;
  summary?: string | null;
  description?: unknown;
  region?: { name?: string; country?: string } | number | null;
  country?: string | null;
}

interface DraftedProfile {
  summary: string;
  description: string;
}

function paragraphsToLexical(text: string) {
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
        tag: 'h3' as const,
        direction: 'ltr' as const,
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
      direction: 'ltr' as const,
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
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      children,
    },
  };
}

const PROMPT_TEMPLATE = `You are writing an editorial profile for a wine producer. The audience is knowledgeable wine drinkers, not professionals — they know what Grand Cru means; they don't need definitions. Tone: confident, specific, evocative but factual. No marketing fluff. No "passion for the land", "terroir-driven excellence", "where tradition meets innovation", etc. Don't reference Wine Saint, "this profile", or any website. Write like a printed reference.

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

CRITICAL: Do not invent facts. If you don't know specific details (founding year, hectares, winemaker name, exact vineyard holdings), don't make them up. Write what's plausibly true for the region/style without inventing dates, names, or numbers. It's better to be vague than confidently wrong.`;

async function fetchProducers(payload: any): Promise<ProducerRecord[]> {
  const where: any = {};
  if (SLUG) where.slug = { equals: SLUG };
  else if (ONLY_EMPTY) where.summary = { equals: null };

  const result = await payload.find({
    collection: 'producers',
    where,
    depth: 1,
    limit: LIMIT > 0 ? LIMIT + OFFSET : 1000,
    sort: 'name',
  });

  const docs = result.docs as ProducerRecord[];
  const sliced = OFFSET > 0 ? docs.slice(OFFSET) : docs;
  return LIMIT > 0 ? sliced.slice(0, LIMIT) : sliced;
}

async function fetchSampleWines(payload: any, producerId: number): Promise<string[]> {
  const result = await payload.find({
    collection: 'wines',
    where: { producer: { equals: producerId } },
    depth: 0,
    limit: 8,
    sort: '-vintage',
  });
  return result.docs.map((w: any) => `${w.vintage ?? 'NV'} ${w.name}`).filter(Boolean);
}

async function draftProfile(
  producer: ProducerRecord,
  wines: string[],
): Promise<DraftedProfile> {
  const region =
    typeof producer.region === 'object' && producer.region
      ? producer.region.name || ''
      : '';
  const country =
    typeof producer.region === 'object' && producer.region
      ? producer.region.country || producer.country || ''
      : producer.country || '';

  const prompt = PROMPT_TEMPLATE.replace('{{NAME}}', producer.name)
    .replace('{{REGION}}', region || 'Unknown')
    .replace('{{COUNTRY}}', country || 'Unknown')
    .replace('{{WINES}}', wines.length ? wines.join('; ') : 'Not provided');

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const block = response.content.find((c) => c.type === 'text');
  if (!block || block.type !== 'text') {
    throw new Error(`No text response for ${producer.name}`);
  }

  const raw = block.text.trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`No JSON in response for ${producer.name}: ${raw.slice(0, 200)}`);
  }

  const parsed = JSON.parse(jsonMatch[0]) as DraftedProfile;
  if (!parsed.summary || !parsed.description) {
    throw new Error(`Missing summary/description for ${producer.name}`);
  }
  return parsed;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Missing ANTHROPIC_API_KEY in env');
    process.exit(1);
  }

  console.log('Connecting to Payload...');
  const payload = await getPayload({ config });

  console.log(
    `Fetching producers (only-empty=${ONLY_EMPTY}, slug=${SLUG || 'any'}, limit=${LIMIT || 'none'}, offset=${OFFSET})`,
  );
  const producers = await fetchProducers(payload);
  console.log(`Processing ${producers.length} producer(s)\n`);

  let ok = 0;
  let failed = 0;

  for (const [i, producer] of producers.entries()) {
    const tag = `[${i + 1}/${producers.length}] ${producer.name}`;
    try {
      console.log(`${tag} — fetching sample wines...`);
      const wines = await fetchSampleWines(payload, producer.id);

      console.log(`${tag} — drafting profile (${wines.length} wines for context)...`);
      const draft = await draftProfile(producer, wines);

      console.log(`  summary: ${draft.summary}`);
      console.log(`  description (first 200 chars): ${draft.description.slice(0, 200)}...`);

      if (DRY_RUN) {
        console.log(`${tag} — DRY RUN, skipping write\n`);
      } else {
        await payload.update({
          collection: 'producers',
          id: producer.id,
          data: {
            summary: draft.summary,
            description: paragraphsToLexical(draft.description),
          },
        });
        console.log(`${tag} — saved\n`);
      }
      ok++;
    } catch (err) {
      failed++;
      console.error(`${tag} — FAILED:`, err instanceof Error ? err.message : err, '\n');
    }

    if (i < producers.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\nDone. ok=${ok} failed=${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
