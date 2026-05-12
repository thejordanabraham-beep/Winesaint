/**
 * Wine Saint Certified — One-shot content importer.
 *
 * POST /api/wsc-import?dir=<relative-path-or-keyword>
 *
 *   ?dir=level-1            → import wine-saint-certified/level-1/
 *   ?dir=france-mastery     → import wine-saint-certified/mastery/france/
 *   ?dir=all                → import L1 + France Mastery (incl exam)
 *   ?dir=<custom relative>  → import any path under wine-saint-certified/
 *
 * Auth: requires a logged-in editorial Payload user (cookie session).
 * Or set WSC_IMPORT_TOKEN env var and pass ?token=... to skip auth (dev only).
 *
 * Idempotency: lessons matched by slug. Exercises for a lesson are
 * deleted-and-recreated. Exam questionPool is regenerated each run.
 *
 * All imported records ship with `source: 'imported'` and `isPublished: false`.
 * Editorial review pass in admin flips isPublished to true.
 */

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'

import { parseFile } from '@/scripts/import-wsc-content/parser'
import { markdownToLexical } from '@/scripts/import-wsc-content/lexical'
import type {
  ParsedExam,
  ParsedExercise,
  ParsedLesson,
} from '@/scripts/import-wsc-content/types'

// ── Helpers ──────────────────────────────────────────────────────────────

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

function resolveDirArg(dirArg: string): string[] {
  const root = path.join(process.cwd(), 'wine-saint-certified')
  switch (dirArg) {
    case 'level-1':
      return [path.join(root, 'level-1')]
    case 'france-mastery':
      return [path.join(root, 'mastery', 'france')]
    case 'all':
      return [path.join(root, 'level-1'), path.join(root, 'mastery', 'france')]
    default:
      return [path.join(root, dirArg)]
  }
}

function exercisePromptSlug(prompt: string): string {
  return prompt
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

// ── Lesson upsert ────────────────────────────────────────────────────────

interface UpsertResult {
  lessonsUpserted: number
  examsUpserted: number
  exercisesCreated: number
  errors: string[]
  details: string[]
}

async function upsertLesson(
  payload: Awaited<ReturnType<typeof getPayload>>,
  parsedLesson: ParsedLesson
): Promise<{ lessonId: string; exercisesCreated: number }> {
  const existing = await payload.find({
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
    intro: markdownToLexical(parsedLesson.intro),
    audience: parsedLesson.audience ?? undefined,
    durationMinutes: parsedLesson.durationMinutes ?? undefined,
    learningObjectives: parsedLesson.learningObjectives.map((o) => ({ objective: o })),
    keyTerms: parsedLesson.keyTerms,
    topicTags: parsedLesson.topicTags.map((tag) => ({ tag })),
    sourceFile: parsedLesson.sourceFile,
    isPublished: false,
  }

  // Delete-then-create is safer than update with `versions.drafts` enabled —
  // some pre-existing rows from earlier failed attempts have inconsistent
  // version state that breaks payload.update with cryptic null-deref errors.
  if (existing.docs.length > 0) {
    // First, clear any orphan exercises pointing at the doomed lesson
    const oldExercises = await payload.find({
      collection: 'exercises',
      where: { lesson: { equals: existing.docs[0].id } },
      limit: 1000,
    })
    for (const row of oldExercises.docs) {
      await payload.delete({ collection: 'exercises', id: row.id })
    }
    await payload.delete({ collection: 'lessons', id: existing.docs[0].id })
  }
  const created = await payload.create({
    collection: 'lessons',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: lessonData as any,
  })
  const lessonId = created.id as string

  // Delete existing module-style exercises for this lesson, then create fresh
  const oldExercises = await payload.find({
    collection: 'exercises',
    where: {
      and: [{ lesson: { equals: lessonId } }, { examOnly: { equals: false } }],
    },
    limit: 1000,
  })
  for (const row of oldExercises.docs) {
    await payload.delete({ collection: 'exercises', id: row.id })
  }

  let exercisesCreated = 0
  for (const ex of parsedLesson.exercises) {
    const exerciseData = {
      slug: exercisePromptSlug(ex.prompt),
      type: ex.type,
      prompt: ex.prompt,
      payload: ex.payload,
      lesson: lessonId,
      difficulty: ex.difficulty,
      topicTags: ex.topicTags.map((tag) => ({ tag })),
      source: 'imported',
      examOnly: false,
      isPublished: false,
    }
    if (exercisesCreated === 0) {
      // Log the first exercise being attempted so we can see the data shape
      console.log('First exercise data sample:', JSON.stringify({ ...exerciseData, lesson: lessonId, lessonIdType: typeof lessonId }, null, 2))
    }
    await payload.create({
      collection: 'exercises',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: exerciseData as any,
      overrideAccess: true,
    })
    exercisesCreated++
  }

  return { lessonId, exercisesCreated }
}

async function upsertExam(
  payload: Awaited<ReturnType<typeof getPayload>>,
  parsedExam: ParsedExam
): Promise<{ examId: string; exercises: number }> {
  const existing = await payload.find({
    collection: 'exams',
    where: { slug: { equals: parsedExam.slug } },
    limit: 1,
  })

  // Delete previous questionPool exercises (if any)
  if (existing.docs.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exam = existing.docs[0] as any
    const oldIds = (exam.questionPool ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (q: any) => (typeof q === 'object' ? q.id : q)
    )
    for (const id of oldIds) {
      try {
        await payload.delete({ collection: 'exercises', id })
      } catch {
        // already gone
      }
    }
  }

  // Create new exam-only exercises
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newIds: any[] = []
  for (const ex of parsedExam.exercises) {
    const created = await payload.create({
      collection: 'exercises',
      data: {
        slug: exercisePromptSlug(ex.prompt),
        type: ex.type,
        prompt: ex.prompt,
        payload: ex.payload,
        difficulty: ex.difficulty,
        topicTags: ex.topicTags.map((tag) => ({ tag })),
        source: 'imported',
        examOnly: true,
        isPublished: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    })
    newIds.push(created.id)
  }

  const examData = {
    slug: parsedExam.slug,
    title: parsedExam.title,
    track: parsedExam.track,
    passThreshold: parsedExam.passThreshold,
    questionCount: parsedExam.questionCount || newIds.length,
    timeLimitMinutes: parsedExam.timeLimitMinutes ?? undefined,
    description: parsedExam.description,
    questionPool: newIds,
    isPublished: false,
  }

  let examId: string
  if (existing.docs.length > 0) {
    const updated = await payload.update({
      collection: 'exams',
      id: existing.docs[0].id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: examData as any,
    })
    examId = updated.id as string
  } else {
    const created = await payload.create({
      collection: 'exams',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: examData as any,
    })
    examId = created.id as string
  }

  return { examId, exercises: newIds.length }
}

// ── Route ────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const url = new URL(request.url)
  const dirArg = url.searchParams.get('dir') ?? 'all'
  const tokenArg = url.searchParams.get('token')

  // Auth: either logged-in editorial user OR shared import token
  const payload = await getPayload({ config })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user } = (await payload.auth({ headers: request.headers as any })) as any

  const sharedToken = process.env.WSC_IMPORT_TOKEN
  const tokenOk = sharedToken && tokenArg === sharedToken
  const userOk = user && (user.userType === 'editorial' || user.role === 'admin')

  if (!tokenOk && !userOk) {
    return NextResponse.json(
      { error: 'Unauthorized — log in as editorial user or pass ?token=<WSC_IMPORT_TOKEN>' },
      { status: 401 }
    )
  }

  // Resolve which directories to walk
  const dirs = resolveDirArg(dirArg)
  for (const d of dirs) {
    if (!fs.existsSync(d)) {
      return NextResponse.json({ error: `Directory not found: ${d}` }, { status: 400 })
    }
  }

  // Collect all .md files
  const files = dirs.flatMap((d) => listMdFiles(d))

  // Run upsert
  const result: UpsertResult = {
    lessonsUpserted: 0,
    examsUpserted: 0,
    exercisesCreated: 0,
    errors: [],
    details: [],
  }

  for (const file of files) {
    try {
      const parsed = parseFile(file)
      const rel = file.includes('wine-saint-certified')
        ? 'wine-saint-certified/' + file.split('wine-saint-certified/')[1]
        : file

      if (parsed.kind === 'lesson') {
        const out = await upsertLesson(payload, parsed.data)
        result.lessonsUpserted++
        result.exercisesCreated += out.exercisesCreated
        result.details.push(`📚 ${rel} → ${out.exercisesCreated} exercises`)
      } else {
        const out = await upsertExam(payload, parsed.data)
        result.examsUpserted++
        result.exercisesCreated += out.exercises
        result.details.push(`🎓 ${rel} → ${out.exercises} exam-only exercises`)
      }
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e = err as any
      // Payload ValidationError exposes the field-level breakdown on `.data.errors`
      const fieldErrors =
        e?.data?.errors ??
        e?.errors ??
        e?.data ??
        null
      const detail = fieldErrors ? ` | ${JSON.stringify(fieldErrors)}` : ''
      result.errors.push(`${file}: ${e?.message ?? String(e)}${detail}`)
      console.error('=== Import error for', file)
      console.error('  message:', e?.message)
      console.error('  name:', e?.name)
      console.error('  data:', JSON.stringify(e?.data, null, 2))
      console.error('  errors:', JSON.stringify(e?.errors, null, 2))
    }
  }

  return NextResponse.json({
    ok: result.errors.length === 0,
    summary: {
      filesProcessed: files.length,
      lessonsUpserted: result.lessonsUpserted,
      examsUpserted: result.examsUpserted,
      exercisesCreated: result.exercisesCreated,
      errors: result.errors.length,
    },
    details: result.details,
    errors: result.errors,
  })
}

// Allow GET for convenience (e.g., curl from browser) — same logic.
export async function GET(request: Request) {
  return POST(request)
}
