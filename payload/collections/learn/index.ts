/**
 * Wine Saint Certified — Learn collections.
 *
 * V1 collections for the education product:
 *   - Lessons        : course content (one per markdown module)
 *   - Exercises      : quiz questions (parsed from markdown)
 *   - UserProgress   : per-attempt history + SRS scheduling
 *   - Exams          : Foundations + France Mastery certification exams
 *   - ExamAttempts   : one row per exam sitting
 *   - Certificates   : issued certificates with PDF URLs
 *
 * The Users collection is also extended for anonymous learner support —
 * see /payload/collections/Users.ts.
 */
export { Lessons } from './Lessons.ts'
export { Exercises } from './Exercises.ts'
export { UserProgress } from './UserProgress.ts'
export { Exams } from './Exams.ts'
export { ExamAttempts } from './ExamAttempts.ts'
export { Certificates } from './Certificates.ts'
