/**
 * Wine Saint Certified — Importer (Payload upsert)
 *
 * Walks wine-saint-certified/ and upserts:
 *   - lessons (one per markdown file)
 *   - exercises (one per quiz Q, linked to lesson)
 *   - exams (one per *-exam.md file)
 *   - exam-only exercises (linked to exam.questionPool, no lesson)
 *
 * Idempotency strategy:
 *   - Lessons: match by `slug`. Update or create.
 *   - Module exercises: delete all existing exercises linked to the lesson
 *     (where examOnly=false), then re-create. Acceptable for v1 because
 *     no real user-progress data exists yet.
 *   - Exam exercises: delete all existing exam-only exercises linked to the
 *     same exam, then re-create + rebuild exam.questionPool.
 *
 * All imported records use `source: 'imported'` and `isPublished: false`.
 * Editorial review pass flips isPublished to true.
 *
 * Usage:
 *   npx tsx scripts/import-wsc-content/upsert.ts <path>
 *
 *   # Import everything (L1 + France Mastery + France exam):
 *   npx tsx scripts/import-wsc-content/upsert.ts wine-saint-certified/level-1
 *   npx tsx scripts/import-wsc-content/upsert.ts wine-saint-certified/mastery/france
 *
 *   # Dry run (parse but don't write):
 *   npx tsx scripts/import-wsc-content/upsert.ts wine-saint-certified/level-1 --dry-run
 */

import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../../payload.config.ts'
import { parseFile } from './parser.ts'
import { markdownToLexical } from './lexical.ts'
import type { ParsedExam, ParsedExercise, ParsedLesson } from './types.ts'

const DRY_RUN = process.argv.includes('--dry-run')

// ── Walk a directory for .md files ────────────────────────────────────────

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

// ── Exercise payload helpers ──────────────────────────────────────────────

interface UpsertContext {
  payload: Awaited<ReturnType<typeof getPayload>>
  importedAt: string
}

async function upsertLessonExercises(
  ctx: UpsertContext,
  lessonId: string,
  exercises: ParsedExercise[]
): Promise<{ created: number }> {
  // Delete existing module-style exercises for this lesson
  const existing = await ctx.payload.find({
    collection: 'exercises',
    where: {
      and: [{ lesson: { equals: lessonId } }, { examOnly: { equals: false } }],
    },
    limit: 1000,
  })
  for (const row of existing.docs) {
    await ctx.payload.delete({ collection: 'exercises', id: row.id })
  }

  // Create fresh exercises
  let created = 0
  for (const ex of exercises) {
    const promptSlug = ex.prompt
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 60)
    await ctx.payload.create({
      collection: 'exercises',
      data: {
        slug: promptSlug,
        type: ex.type,
        prompt: ex.prompt,
        payload: ex.payload,
        lesson: lessonId,
        difficulty: ex.difficulty,
        topicTags: ex.topicTags.map((tag) => ({ tag })),
        source: 'imported',
        examOnly: false,
        isPublished: false,
      } as any,
    })
    created++
  }
  return { created }
}

async function upsertExam(
  ctx: UpsertContext,
  parsedExam: ParsedExam
): Promise<{ examId: string; exercises: number }> {
  // Find or create the exam
  const existing = await ctx.payload.find({
    collection: 'exams',
    where: { slug: { equals: parsedExam.slug } },
    limit: 1,
  })

  // Delete all exam-only exercises in the existing questionPool
  if (existing.docs.length > 0) {
    const ex = existing.docs[0] as any
    const oldPoolIds: string[] = (ex.questionPool ?? []).map((q: any) =>
      typeof q === 'string' ? q : q.id
    )
    for (const exId of oldPoolIds) {
      try {
        await ctx.payload.delete({ collection: 'exercises', id: exId })
      } catch {
        // already deleted — fine
      }
    }
  }

  // Create new exam-only exercises
  const newExerciseIds: string[] = []
  for (const ex of parsedExam.exercises) {
    const promptSlug = ex.prompt
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 60)
    const created = await ctx.payload.create({
      collection: 'exercises',
      data: {
        slug: promptSlug,
        type: ex.type,
        prompt: ex.prompt,
        payload: ex.payload,
        difficulty: ex.difficulty,
        topicTags: ex.topicTags.map((tag) => ({ tag })),
        source: 'imported',
        examOnly: true,
        isPublished: false,
      } as any,
    })
    newExerciseIds.push(created.id as string)
  }

  // Upsert exam record with new questionPool
  const examData = {
    slug: parsedExam.slug,
    title: parsedExam.title,
    track: parsedExam.track,
    passThreshold: parsedExam.passThreshold,
    questionCount: parsedExam.questionCount || newExerciseIds.length,
    timeLimitMinutes: parsedExam.timeLimitMinutes ?? undefined,
    description: parsedExam.description,
    questionPool: newExerciseIds,
    isPublished: false,
  }

  let examId: string
  if (existing.docs.length > 0) {
    const updated = await ctx.payload.update({
      collection: 'exams',
      id: existing.docs[0].id,
      data: examData as any,
    })
    examId = updated.id as string
  } else {
    const created = await ctx.payload.create({
      collection: 'exams',
      data: examData as any,
    })
    examId = created.id as string
  }

  return { examId, exercises: newExerciseIds.length }
}

async function upsertLesson(
  ctx: UpsertContext,
  parsedLesson: ParsedLesson
): Promise<{ lessonId: string; exercisesCreated: number }> {
  const existing = await ctx.payload.find({
    collection: 'lessons',
    where: { slug: { equals: parsedLesson.slug } },
    limit: 1,
  })

  const lessonData = {
    slug: parsedLesson.slug,
    title: parsedLesson.title,
    level: parsedLesson.level,
    track: parsedLesson.track ?? undefined,
    order: parsedLesson.order,
    intro: markdownToLexical(parsedLesson.intro) as any,
    audience: parsedLesson.audience ?? undefined,
    durationMinutes: parsedLesson.durationMinutes ?? undefined,
    learningObjectives: parsedLesson.learningObjectives.map((o) => ({ objective: o })),
    keyTerms: parsedLesson.keyTerms,
    topicTags: parsedLesson.topicTags.map((tag) => ({ tag })),
    sourceFile: parsedLesson.sourceFile,
    isPublished: false,
  }

  let lessonId: string
  if (existing.docs.length > 0) {
    const updated = await ctx.payload.update({
      collection: 'lessons',
      id: existing.docs[0].id,
      data: lessonData as any,
    })
    lessonId = updated.id as string
  } else {
    const created = await ctx.payload.create({
      collection: 'lessons',
      data: lessonData as any,
    })
    lessonId = created.id as string
  }

  const { created: exercisesCreated } = await upsertLessonExercises(
    ctx,
    lessonId,
    parsedLesson.exercises
  )

  return { lessonId, exercisesCreated }
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const arg = process.argv[2]
  if (!arg) {
    console.error('Usage: npx tsx scripts/import-wsc-content/upsert.ts <path> [--dry-run]')
    process.exit(1)
  }
  const target = path.resolve(arg)
  if (!fs.existsSync(target)) {
    console.error(`Path not found: ${target}`)
    process.exit(1)
  }

  const stat = fs.statSync(target)
  const files = stat.isDirectory() ? listMdFiles(target) : [target]

  console.log(`\nImporting ${files.length} file${files.length === 1 ? '' : 's'}…`)
  if (DRY_RUN) console.log('(DRY RUN — no writes)')
  console.log()

  // Initialize Payload — same instance the dev server uses
  const payload = DRY_RUN ? null : await getPayload({ config })
  const ctx: UpsertContext | null = payload
    ? { payload, importedAt: new Date().toISOString() }
    : null

  let lessonsCreated = 0
  let examsCreated = 0
  let exercisesCreated = 0
  const errors: string[] = []

  for (const file of files) {
    try {
      const result = parseFile(file)
      const rel = file.includes('wine-saint-certified')
        ? 'wine-saint-certified/' + file.split('wine-saint-certified/')[1]
        : file

      if (result.kind === 'lesson') {
        if (ctx) {
          const out = await upsertLesson(ctx, result.data)
          lessonsCreated++
          exercisesCreated += out.exercisesCreated
          console.log(
            `  📚 ${rel} → lesson ${out.lessonId} (${out.exercisesCreated} exercises)`
          )
        } else {
          console.log(`  📚 ${rel} → would create lesson + ${result.data.exercises.length} exercises`)
        }
      } else {
        if (ctx) {
          const out = await upsertExam(ctx, result.data)
          examsCreated++
          exercisesCreated += out.exercises
          console.log(
            `  🎓 ${rel} → exam ${out.examId} (${out.exercises} exam-only exercises)`
          )
        } else {
          console.log(
            `  🎓 ${rel} → would create exam + ${result.data.exercises.length} exam-only exercises`
          )
        }
      }
    } catch (err) {
      const msg = (err as Error).message
      errors.push(`${file}: ${msg}`)
      console.log(`  ❌ ${file} — ${msg}`)
    }
  }

  console.log('\n═══ SUMMARY ═══')
  console.log(`  Lessons upserted: ${lessonsCreated}`)
  console.log(`  Exams upserted: ${examsCreated}`)
  console.log(`  Exercises created: ${exercisesCreated}`)
  if (errors.length) {
    console.log(`  Errors: ${errors.length}`)
    for (const e of errors) console.log(`    - ${e}`)
  }
  console.log()

  process.exit(errors.length ? 1 : 0)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
