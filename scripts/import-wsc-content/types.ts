/**
 * Wine Saint Certified — Content Importer Types
 *
 * Shared types for parsing wine-saint-certified/ markdown files
 * into Payload-compatible structures.
 */

export type LessonLevel = 'foundations' | 'intermediate' | 'advanced' | 'mastery'

export type LessonTrack =
  | 'france'
  | 'italy'
  | 'california'
  | 'germany'
  | 'spain'
  | 'portugal'
  | 'australia'
  | 'austria'
  | 'argentina'
  | 'chile'
  | 'greece'
  | 'new-zealand'
  | 'pacific-northwest'
  | 'south-africa'
  | 'wine-program-management'

export type ExerciseType = 'multiple-choice' | 'multiple-select' | 'type-answer'

export type Difficulty = 'easy' | 'medium' | 'hard'

/**
 * Parsed metadata from the top of a module file.
 * Keys vary between L1/L2/L3 and Mastery formats.
 */
export interface ParsedMetadata {
  level?: string
  audience?: string
  duration?: string
  certificationRequirement?: string
  program?: string
  module?: string
  prerequisites?: string
}

export interface ParsedKeyTerm {
  term: string
  definition: string
}

export interface ParsedExercise {
  type: ExerciseType
  prompt: string
  payload: {
    choices?: Array<{ id: string; text: string }>
    correctIds?: string[]
    acceptedAnswers?: string[]
    caseSensitive?: boolean
  }
  difficulty: Difficulty
  topicTags: string[]
  examOnly: boolean
}

export interface ParsedLesson {
  slug: string
  title: string
  level: LessonLevel
  track: LessonTrack | null
  order: number
  audience: string | null
  durationMinutes: number | null
  learningObjectives: string[]
  keyTerms: ParsedKeyTerm[]
  topicTags: string[]
  intro: string // raw markdown for now — converted to Lexical at upsert time
  exercises: ParsedExercise[]
  sourceFile: string
  metadata: ParsedMetadata
}

export interface ParsedExam {
  slug: string
  title: string
  track: 'foundations' | 'france-mastery' // matches schema's Exams.track
  questionCount: number
  passThreshold: number
  timeLimitMinutes: number | null
  description: string
  exercises: ParsedExercise[]
  sourceFile: string
}

export type ParseResult =
  | { kind: 'lesson'; data: ParsedLesson }
  | { kind: 'exam'; data: ParsedExam }
