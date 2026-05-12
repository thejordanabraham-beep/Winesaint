/**
 * Wine Saint Certified — Markdown Parser
 *
 * Parses markdown files from wine-saint-certified/ into structured data
 * ready for upsert into Payload.
 *
 * Handles two content shapes:
 *   1. Module file — has metadata block + sections + key terms + quiz
 *      (L1 + L2 + L3 + Mastery sub-modules)
 *   2. Exam file — large question bank with `## Section N:` groupings
 *      and `**Question N**` items (currently France Mastery exam)
 *
 * Module quizzes use `**QN. Prompt**` single-line format.
 * Exam questions use `**Question N**\n\nPrompt\n\n` multi-line format.
 */

import fs from 'fs'
import path from 'path'
import type {
  ParsedExam,
  ParsedExercise,
  ParsedKeyTerm,
  ParsedLesson,
  ParsedMetadata,
  ParseResult,
  LessonLevel,
  LessonTrack,
} from './types.ts'
import { inferTags } from './tags.ts'

// ── Helpers ───────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function parseDurationMinutes(s: string | undefined): number | null {
  if (!s) return null
  // Matches "~30 minutes", "60 minutes", "60–90 minutes", "2.5 hours", etc.
  const m = s.match(/(\d+)(?:[\s–-]\d+)?\s*(minute|hour)/i)
  if (!m) return null
  const n = parseInt(m[1], 10)
  return m[2].toLowerCase().startsWith('hour') ? n * 60 : n
}

function parseModuleOrder(filename: string): number | null {
  // L1: module-01-wine-basics.md → 1
  const l1 = filename.match(/module-(\d+)-/)
  if (l1) return parseInt(l1[1], 10)
  // Mastery: 02-bordeaux-left-bank.md → 2
  const m = filename.match(/^(\d+)-/)
  if (m) return parseInt(m[1], 10)
  return null
}

// ── Metadata block ────────────────────────────────────────────────────────

function parseMetadataBlock(text: string): ParsedMetadata {
  // Metadata is the block of **Key:** Value lines between the # title and
  // the first --- separator.
  const meta: ParsedMetadata = {}
  const lines = text.split('\n')
  for (const line of lines) {
    const m = line.match(/^\*\*([\w\s]+):\*\*\s*(.+)$/)
    if (!m) continue
    const key = m[1].trim().toLowerCase()
    const value = m[2].trim()
    switch (key) {
      case 'level':
        meta.level = value
        break
      case 'audience':
        meta.audience = value
        break
      case 'duration':
      case 'estimated duration':
        meta.duration = value
        break
      case 'certification requirement':
        meta.certificationRequirement = value
        break
      case 'program':
        meta.program = value
        break
      case 'module':
        meta.module = value
        break
      case 'prerequisites':
        meta.prerequisites = value
        break
    }
  }
  return meta
}

// ── Sections (## Section N: Title) ────────────────────────────────────────

interface ParsedSection {
  title: string
  body: string
}

function extractSections(text: string): ParsedSection[] {
  // Find all "## " headings with their positions, then slice between them.
  const headings = findHeadings(text)
  const sections: ParsedSection[] = []
  for (let i = 0; i < headings.length; i++) {
    const h = headings[i]
    const titleMatch = h.line.match(/^##\s+Section\s+\d+[:.]?\s*(.+)$/)
    if (!titleMatch) continue
    const start = h.lineEnd
    const end = i + 1 < headings.length ? headings[i + 1].lineStart : text.length
    sections.push({
      title: titleMatch[1].trim(),
      body: text.slice(start, end).trim(),
    })
  }
  return sections
}

/**
 * Find every `## ` heading line in the text and return its position.
 * Used as a reliable "next section" anchor for slicing.
 */
function findHeadings(text: string): Array<{ line: string; lineStart: number; lineEnd: number }> {
  const out: Array<{ line: string; lineStart: number; lineEnd: number }> = []
  const re = /^##\s+[^\n]+$/gm
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    out.push({
      line: m[0],
      lineStart: m.index,
      lineEnd: m.index + m[0].length,
    })
  }
  return out
}

/**
 * Extract the body of a single named section (by its heading text).
 * Returns null if the heading isn't found.
 */
function extractNamedSection(text: string, headingRegex: RegExp): string | null {
  const headings = findHeadings(text)
  for (let i = 0; i < headings.length; i++) {
    if (headingRegex.test(headings[i].line)) {
      const start = headings[i].lineEnd
      const end = i + 1 < headings.length ? headings[i + 1].lineStart : text.length
      return text.slice(start, end)
    }
  }
  return null
}

// ── Learning Objectives ───────────────────────────────────────────────────

function extractLearningObjectives(text: string): string[] {
  const body = extractNamedSection(text, /^##\s+Learning\s+Objectives/i)
  if (!body) return []
  return body
    .split('\n')
    .map((l) => l.trim())
    // Real bullets only — must be "- " followed by non-dash content (excludes the "---" separator)
    .filter((l) => /^-\s+[^-]/.test(l))
    .map((l) => l.replace(/^-\s*/, '').trim())
    .filter(Boolean)
}

// ── Key Terms ─────────────────────────────────────────────────────────────

function extractKeyTerms(text: string): ParsedKeyTerm[] {
  const body = extractNamedSection(text, /^##\s+Key\s+Terms/i)
  if (!body) return []
  const terms: ParsedKeyTerm[] = []
  // Table rows: | **Term** | Definition |
  const rowRe = /^\|\s*\*\*([^*]+)\*\*\s*\|\s*(.+?)\s*\|\s*$/gm
  let row: RegExpExecArray | null
  while ((row = rowRe.exec(body)) !== null) {
    terms.push({
      term: row[1].trim(),
      definition: row[2].trim(),
    })
  }
  return terms
}

// ── Module Quiz Questions: **QN. Prompt** ─────────────────────────────────

function extractModuleQuiz(text: string, topicTags: string[]): ParsedExercise[] {
  const body = extractNamedSection(text, /^##\s+Quiz/i)
  if (!body) return []
  return parseModuleStyleQuestions(body, topicTags, false)
}

function parseModuleStyleQuestions(
  text: string,
  topicTags: string[],
  examOnly: boolean
): ParsedExercise[] {
  const exercises: ParsedExercise[] = []
  // Find each "**Q1. Prompt**" anchor, slice between anchors.
  // Allows the prompt to span multiple lines if needed by using `[\s\S]+?` for the bold content.
  const anchorRe = /\*\*Q(\d+)[.:]\s*([\s\S]+?)\*\*/g
  const anchors: Array<{ index: number; promptEnd: number; prompt: string }> = []
  let m: RegExpExecArray | null
  while ((m = anchorRe.exec(text)) !== null) {
    anchors.push({
      index: m.index,
      promptEnd: m.index + m[0].length,
      prompt: m[2].trim(),
    })
  }
  for (let i = 0; i < anchors.length; i++) {
    const a = anchors[i]
    const blockEnd = i + 1 < anchors.length ? anchors[i + 1].index : text.length
    const optionsBlock = text.slice(a.promptEnd, blockEnd)
    const ex = parseChoicesBlock(a.prompt, optionsBlock, topicTags, examOnly)
    if (ex) exercises.push(ex)
  }
  return exercises
}

// ── Exam Questions: **Question N** Prompt ─────────────────────────────────

function extractExamQuestions(text: string, topicTags: string[]): ParsedExercise[] {
  const exercises: ParsedExercise[] = []
  // Locate every "**Question N**" anchor, then slice between anchors.
  const anchorRe = /\*\*Question\s+(\d+)\*\*/g
  const anchors: Array<{ index: number; promptEnd: number; n: number }> = []
  let m: RegExpExecArray | null
  while ((m = anchorRe.exec(text)) !== null) {
    anchors.push({
      index: m.index,
      promptEnd: m.index + m[0].length,
      n: parseInt(m[1], 10),
    })
  }
  for (let i = 0; i < anchors.length; i++) {
    const a = anchors[i]
    const blockEnd = i + 1 < anchors.length ? anchors[i + 1].index : text.length
    const block = text.slice(a.promptEnd, blockEnd).trim()
    // First paragraph (until first option line) is the prompt
    const optStart = block.search(/\n\s*\n?-?\s*[A-Z]\)/)
    if (optStart === -1) continue
    const prompt = block.slice(0, optStart).trim()
    const rest = block.slice(optStart).trim()
    const ex = parseChoicesBlock(prompt, rest, topicTags, true)
    if (ex) exercises.push(ex)
  }
  return exercises
}

// ── Common: parse options + correct from a block ──────────────────────────

function parseChoicesBlock(
  prompt: string,
  optionsBlock: string,
  topicTags: string[],
  examOnly: boolean
): ParsedExercise | null {
  // Options like "- A) text" or "A) text"
  const optionRe = /^-?\s*([A-Z])\)\s*(.+?)$/gm
  const choices: Array<{ id: string; text: string }> = []
  let m: RegExpExecArray | null
  while ((m = optionRe.exec(optionsBlock)) !== null) {
    choices.push({ id: m[1].toLowerCase(), text: m[2].trim() })
  }
  if (choices.length === 0) return null

  // Correct: "**Correct: B**" or "**Correct:** B"
  const correctMatch = optionsBlock.match(/\*\*Correct:?\*?\*?\s*([A-Z](?:\s*,\s*[A-Z])*)/i)
  if (!correctMatch) return null
  const correctLetters = correctMatch[1].split(/\s*,\s*/).map((c) => c.toLowerCase())
  const correctIds = correctLetters.filter((c) => choices.some((ch) => ch.id === c))

  // Detect "select all that apply" → multi-select
  const isMultiSelect =
    correctIds.length > 1 ||
    /select all|all that apply|check all/i.test(prompt)

  // Detect "fill in" / free-response → type-answer (rare)
  const isTypeAnswer = /fill in|enter the/i.test(prompt) && choices.length === 0

  return {
    type: isTypeAnswer ? 'type-answer' : isMultiSelect ? 'multiple-select' : 'multiple-choice',
    prompt,
    payload: isTypeAnswer
      ? { acceptedAnswers: [], caseSensitive: false }
      : { choices, correctIds },
    difficulty: 'medium',
    topicTags,
    examOnly,
  }
}

// ── Intro: concatenate Section bodies ─────────────────────────────────────

function buildIntroMarkdown(sections: ParsedSection[]): string {
  return sections
    .map((s) => `## ${s.title}\n\n${s.body}`)
    .join('\n\n')
}

// ── Level / Track determination ───────────────────────────────────────────

function determineLevelAndTrack(
  filePath: string,
  metadata: ParsedMetadata
): { level: LessonLevel; track: LessonTrack | null } {
  const rel = filePath.includes('wine-saint-certified')
    ? filePath.split('wine-saint-certified/')[1]
    : filePath
  const parts = rel.split(path.sep)

  if (parts[0] === 'level-1') return { level: 'foundations', track: null }
  if (parts[0] === 'level-2') return { level: 'intermediate', track: null }
  if (parts[0] === 'level-3') return { level: 'advanced', track: null }
  if (parts[0] === 'mastery') {
    return { level: 'mastery', track: (parts[1] as LessonTrack) ?? null }
  }
  return { level: 'foundations', track: null }
}

// ── Detect file kind ──────────────────────────────────────────────────────

function isExamFile(filePath: string): boolean {
  return /-exam\.md$/.test(filePath)
}

// ── Main: parse a single file ─────────────────────────────────────────────

export function parseFile(filePath: string): ParseResult {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const filename = path.basename(filePath)
  const topicTags = inferTags(filePath)

  // Title — first `# Heading` line
  const titleMatch = raw.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1].trim() : filename.replace(/\.md$/, '')

  if (isExamFile(filePath)) {
    return parseExam(raw, filePath, title, topicTags)
  }
  return parseLesson(raw, filePath, title, topicTags)
}

function parseLesson(
  raw: string,
  filePath: string,
  title: string,
  topicTags: string[]
): ParseResult {
  const filename = path.basename(filePath)
  const metadata = parseMetadataBlock(raw)
  const { level, track } = determineLevelAndTrack(filePath, metadata)
  const sections = extractSections(raw)
  const learningObjectives = extractLearningObjectives(raw)
  const keyTerms = extractKeyTerms(raw)
  const exercises = extractModuleQuiz(raw, topicTags)
  const order = parseModuleOrder(filename) ?? 0
  const durationMinutes = parseDurationMinutes(metadata.duration)

  // Slug from filename, stripping leading numbers
  const slug = filename
    .replace(/\.md$/, '')
    .replace(/^module-\d+-/, '')
    .replace(/^\d+-/, '')
  const fullSlug = track ? `${track}-${slug}` : slug

  const lesson: ParsedLesson = {
    slug: fullSlug,
    title,
    level,
    track,
    order,
    audience: metadata.audience ?? null,
    durationMinutes,
    learningObjectives,
    keyTerms,
    topicTags,
    intro: buildIntroMarkdown(sections),
    exercises,
    sourceFile: filePath.includes('wine-saint-certified')
      ? 'wine-saint-certified/' + filePath.split('wine-saint-certified/')[1]
      : filePath,
    metadata,
  }
  return { kind: 'lesson', data: lesson }
}

function parseExam(
  raw: string,
  filePath: string,
  title: string,
  topicTags: string[]
): ParseResult {
  const filename = path.basename(filePath).replace(/\.md$/, '')
  // Description: lines after title until first ---
  const descMatch = raw.match(/^#[^\n]+\n+([\s\S]+?)\n---/)
  const description = descMatch ? descMatch[1].trim() : ''

  // Pass threshold from "Passing Score: 80%..."
  const thresholdMatch = description.match(/Passing\s+Score[^0-9]*(\d+)\s*%/i)
  const passThreshold = thresholdMatch ? parseInt(thresholdMatch[1], 10) : 80

  // Question count from "Total Questions: 100"
  const countMatch = description.match(/Total\s+Questions[^0-9]*(\d+)/i)
  const questionCount = countMatch ? parseInt(countMatch[1], 10) : 0

  // Time limit from "Time Limit: 2.5 hours" → 150 minutes
  const timeMatch = description.match(/Time\s+Limit[^0-9]*([\d.]+)\s*(hour|minute)/i)
  let timeLimitMinutes: number | null = null
  if (timeMatch) {
    const n = parseFloat(timeMatch[1])
    timeLimitMinutes = timeMatch[2].toLowerCase().startsWith('hour') ? Math.round(n * 60) : Math.round(n)
  }

  const exercises = extractExamQuestions(raw, topicTags)

  // Track for exam — "foundations" or "france-mastery" (matches schema)
  const track: 'foundations' | 'france-mastery' = filename.includes('france-mastery')
    ? 'france-mastery'
    : 'foundations'

  const exam: ParsedExam = {
    slug: filename,
    title,
    track,
    questionCount,
    passThreshold,
    timeLimitMinutes,
    description,
    exercises,
    sourceFile: filePath.includes('wine-saint-certified')
      ? 'wine-saint-certified/' + filePath.split('wine-saint-certified/')[1]
      : filePath,
  }
  return { kind: 'exam', data: exam }
}
