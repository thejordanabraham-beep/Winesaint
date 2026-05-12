import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { LessonRichText } from '@/components/learn/LessonRichText'

const TRACK_LABELS: Record<string, string> = {
  france: 'France Mastery',
  italy: 'Italy Mastery',
  california: 'California Mastery',
  germany: 'Germany Mastery',
  spain: 'Spain Mastery',
  portugal: 'Portugal Mastery',
  australia: 'Australia Mastery',
  austria: 'Austria Mastery',
  argentina: 'Argentina Mastery',
  chile: 'Chile Mastery',
  greece: 'Greece Mastery',
  'new-zealand': 'New Zealand Mastery',
  'pacific-northwest': 'Pacific Northwest Mastery',
  'wine-program-management': 'Wine Program Management',
}

const LEVEL_LABELS: Record<string, string> = {
  foundations: 'Foundations',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getLesson(slug: string): Promise<any | null> {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'lessons',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  return res.docs[0] ?? null
}

async function getExerciseCount(lessonId: string | number): Promise<number> {
  const payload = await getPayload({ config })
  const res = await payload.count({
    collection: 'exercises',
    where: {
      and: [{ lesson: { equals: lessonId } }, { examOnly: { equals: false } }],
    },
  })
  return res.totalDocs
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const lesson = await getLesson(slug)
  if (!lesson) return { title: 'Lesson not found | Wine Saint' }
  return {
    title: `${lesson.title} | Wine Saint Education`,
  }
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const lesson = await getLesson(slug)
  if (!lesson) notFound()

  const exerciseCount = await getExerciseCount(lesson.id)

  const trackLabel = lesson.track
    ? TRACK_LABELS[lesson.track] ?? lesson.track
    : LEVEL_LABELS[lesson.level] ?? lesson.level

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-[#722F37]">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/learn" className="text-gray-500 hover:text-[#722F37]">
            Education
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#1C1C1C]">{lesson.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#722F37] mb-3">
            {trackLabel} · Lesson {lesson.order}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl italic text-[#1C1C1C] leading-tight">
            {lesson.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            {lesson.durationMinutes && <span>{lesson.durationMinutes} min</span>}
            {lesson.audience && <span>· {lesson.audience}</span>}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-12">
          {/* Main content */}
          <div>
            {/* Learning Objectives */}
            {Array.isArray(lesson.learningObjectives) && lesson.learningObjectives.length > 0 && (
              <div className="mb-10 bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
                <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">
                  Learning Objectives
                </h2>
                <ul className="space-y-2">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {lesson.learningObjectives.map((o: any, i: number) => (
                    <li key={i} className="text-[#1C1C1C] flex gap-3">
                      <span className="text-[#722F37] font-semibold">→</span>
                      <span>{o.objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lesson Body */}
            {lesson.intro && <LessonRichText data={lesson.intro} />}

            {/* CTA */}
            <div className="mt-12 bg-white rounded-lg border-3 border-[#722F37] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">
                Test yourself
              </h2>
              <p className="text-gray-600 mb-4">
                {exerciseCount} question{exerciseCount === 1 ? '' : 's'} on this lesson.
              </p>
              {exerciseCount > 0 ? (
                <Link
                  href={`/learn/${lesson.slug}/practice`}
                  className="inline-block px-6 py-3 bg-[#722F37] text-white rounded font-semibold uppercase tracking-wide text-sm hover:bg-[#A64253] transition-colors"
                >
                  Start practice →
                </Link>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No exercises yet. Come back soon.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-8 self-start">
            {/* Key Terms */}
            {Array.isArray(lesson.keyTerms) && lesson.keyTerms.length > 0 && (
              <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-5">
                <h3 className="font-serif text-lg italic text-[#1C1C1C] mb-3">
                  Key Terms
                </h3>
                <dl className="space-y-3 text-sm">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {lesson.keyTerms.map((kt: any, i: number) => (
                    <div key={i}>
                      <dt className="font-semibold text-[#1C1C1C]">{kt.term}</dt>
                      <dd className="text-gray-600 mt-0.5 leading-relaxed">
                        {kt.definition}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
