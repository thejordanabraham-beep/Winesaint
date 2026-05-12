/**
 * Wine Saint Certified — Importer Preview / Dry Run
 *
 * Parses a single markdown file (or a whole directory) and prints the
 * structured result. NO Payload writes. Use to verify parser correctness
 * before connecting the upsert step.
 *
 * Usage:
 *   npx tsx scripts/import-wsc-content/preview.ts <path-to-md-or-dir>
 *
 * Examples:
 *   npx tsx scripts/import-wsc-content/preview.ts \
 *     wine-saint-certified/level-1/module-01-wine-basics.md
 *
 *   npx tsx scripts/import-wsc-content/preview.ts wine-saint-certified/level-1
 *
 *   npx tsx scripts/import-wsc-content/preview.ts wine-saint-certified/mastery/france
 */

import fs from 'fs'
import path from 'path'
import { parseFile } from './parser.ts'

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

function summarize(target: string): void {
  const stat = fs.statSync(target)
  const files = stat.isDirectory() ? listMdFiles(target) : [target]

  console.log(`\nParsing ${files.length} file${files.length === 1 ? '' : 's'}…\n`)

  let lessonCount = 0
  let examCount = 0
  let totalExercises = 0
  const parseErrors: string[] = []

  for (const file of files) {
    try {
      const result = parseFile(file)
      const rel = file.includes('wine-saint-certified')
        ? 'wine-saint-certified/' + file.split('wine-saint-certified/')[1]
        : file

      if (result.kind === 'lesson') {
        lessonCount++
        const d = result.data
        totalExercises += d.exercises.length
        console.log(
          `  📚 ${rel}\n` +
            `     ${d.title}\n` +
            `     level=${d.level} track=${d.track ?? '—'} order=${d.order} duration=${d.durationMinutes ?? '—'}min\n` +
            `     objectives=${d.learningObjectives.length} keyTerms=${d.keyTerms.length} ` +
            `exercises=${d.exercises.length} introChars=${d.intro.length}\n` +
            `     tags=[${d.topicTags.join(', ')}]\n`
        )
      } else {
        examCount++
        const d = result.data
        totalExercises += d.exercises.length
        console.log(
          `  🎓 ${rel}\n` +
            `     ${d.title}\n` +
            `     track=${d.track} threshold=${d.passThreshold}% timeLimit=${d.timeLimitMinutes ?? '—'}min\n` +
            `     declaredQuestionCount=${d.questionCount} actuallyParsed=${d.exercises.length}\n`
        )
      }
    } catch (err) {
      parseErrors.push(`${file}: ${(err as Error).message}`)
      console.log(`  ❌ ${file} — ${(err as Error).message}\n`)
    }
  }

  console.log('═══ SUMMARY ═══')
  console.log(`  Lessons parsed: ${lessonCount}`)
  console.log(`  Exams parsed: ${examCount}`)
  console.log(`  Total exercises: ${totalExercises}`)
  if (parseErrors.length) {
    console.log(`  Parse errors: ${parseErrors.length}`)
    for (const e of parseErrors) console.log(`    - ${e}`)
  }
  console.log()
}

function detailed(target: string): void {
  const result = parseFile(target)
  console.log(JSON.stringify(result, null, 2))
}

// ── Main ──────────────────────────────────────────────────────────────────

const arg = process.argv[2]
if (!arg) {
  console.error('Usage: npx tsx scripts/import-wsc-content/preview.ts <path> [--detailed]')
  process.exit(1)
}

const target = path.resolve(arg)
if (!fs.existsSync(target)) {
  console.error(`Path not found: ${target}`)
  process.exit(1)
}

const detailedFlag = process.argv.includes('--detailed')

if (detailedFlag) {
  detailed(target)
} else {
  summarize(target)
}
