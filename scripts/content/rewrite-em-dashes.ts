import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'

const API_KEY = process.env.ANTHROPIC_API_KEY
if (!API_KEY) {
  console.error('ANTHROPIC_API_KEY not set')
  process.exit(1)
}

const client = new Anthropic({ apiKey: API_KEY, timeout: 300000 })

const ROOT = path.join(process.cwd(), 'wine-saint-certified')
const LOG_FILE = path.join(process.cwd(), 'scripts/em-dash-rewrite.log')

function listMdFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isFile() && entry.name.endsWith('.md')) out.push(full)
    else if (entry.isDirectory() && !entry.name.startsWith('.')) {
      out.push(...listMdFiles(full))
    }
  }
  return out
}

const SYSTEM_PROMPT = `You are a precise text editor. Your ONLY job is to rewrite em dashes (—) out of the provided markdown text.

Rules:
1. Replace every em dash with proper grammatical punctuation: commas, semicolons, colons, periods, or restructured prose. Choose whatever reads most naturally.
2. Do NOT use hyphens or en dashes as sentence breaks either. The goal is natural, clean prose with no dash-based sentence interruptions.
3. EXCEPTION: Keep em dashes in the frontmatter "Level:" line (e.g. "Level: 1 — Foundations") since that's a structured label, not prose.
4. EXCEPTION: Keep hyphens in compound words (e.g. "full-bodied", "medium-weight", "well-structured"). Those are not sentence breaks.
5. Preserve ALL markdown formatting exactly: headers, bold, italic, lists, code blocks, links, horizontal rules (---).
6. Preserve ALL content exactly. Do not add, remove, summarize, or rephrase anything beyond what's needed to remove the em dash. Change the minimum number of words possible.
7. Do not add any commentary, explanation, or wrapping. Return ONLY the rewritten markdown text, nothing else.
8. Do not wrap the output in a code block or add any prefix/suffix.

Examples of rewrites:
- "it is a framework for understanding how food and wine interact — and using that understanding" → "it is a framework for understanding how food and wine interact, and using that understanding"
- "it either harmonizes — finding shared flavors — or it contrasts" → "it either harmonizes (finding shared flavors) or it contrasts"
- "This is not a subtle flaw — it is actively unpleasant" → "This is not a subtle flaw; it is actively unpleasant"
- "Fatty or rich dishes — the acid cuts through" → "Fatty or rich dishes: the acid cuts through"
- "the French take credit for inventing indulgence" → (no change needed, no em dash)`

async function rewriteFile(filePath: string): Promise<{ changed: boolean; dashCount: number }> {
  const content = fs.readFileSync(filePath, 'utf-8')
  const dashCount = (content.match(/—/g) || []).length

  if (dashCount === 0) return { changed: false, dashCount: 0 }

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 32000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: content }],
  })

  const rewritten = msg.content[0].type === 'text' ? msg.content[0].text : ''

  const remainingDashes = (rewritten.match(/—/g) || []).length
  const levelLineDashes = (rewritten.match(/^.*Level:.*—.*$/gm) || []).length

  fs.writeFileSync(filePath, rewritten)

  return { changed: true, dashCount, remainingNonExempt: remainingDashes - levelLineDashes }
}

async function main() {
  const files = listMdFiles(ROOT).sort()
  const total = files.length
  let processed = 0
  let skipped = 0
  let totalDashes = 0
  let errors: string[] = []

  fs.writeFileSync(LOG_FILE, `Em-dash rewrite started: ${new Date().toISOString()}\n`)

  const BATCH = 3
  for (let i = 0; i < files.length; i += BATCH) {
    const batch = files.slice(i, i + BATCH)
    const results = await Promise.allSettled(
      batch.map(async (file) => {
        const rel = path.relative(ROOT, file)
        try {
          const result = await rewriteFile(file)
          if (!result.changed) {
            skipped++
            return
          }
          processed++
          totalDashes += result.dashCount
          const extra = result.remainingNonExempt > 0 ? ` (${result.remainingNonExempt} remaining!)` : ''
          const line = `  ✓ ${rel}: ${result.dashCount} dashes removed${extra}`
          console.log(line)
          fs.appendFileSync(LOG_FILE, line + '\n')
        } catch (err: any) {
          errors.push(rel)
          const line = `  ✗ ${rel}: ${err.message}`
          console.error(line)
          fs.appendFileSync(LOG_FILE, line + '\n')
        }
      })
    )
    const done = Math.min(i + BATCH, total)
    console.log(`[${done}/${total}]`)
  }

  const summary = `
=== SUMMARY ===
Files processed: ${processed}
Files skipped (no dashes): ${skipped}
Total dashes rewritten: ${totalDashes}
Errors: ${errors.length}${errors.length > 0 ? '\n  ' + errors.join('\n  ') : ''}
`
  console.log(summary)
  fs.appendFileSync(LOG_FILE, summary)
}

main().catch(console.error)
