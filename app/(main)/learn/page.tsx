import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

// Render at request time, not build time. Payload's schema sync (push:true)
// runs at runtime, so the lessons table doesn't exist when Next.js tries to
// prerender during the build.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Education | Wine Saint',
  description:
    'Wine Saint Certified — structured curriculum for practical wine fluency.',
}

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
  'south-africa': 'South Africa Mastery',
  'wine-program-management': 'Wine Program Management',
}

const LEVEL_LABELS: Record<string, string> = {
  foundations: 'Foundations',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

interface LessonSummary {
  id: string | number
  slug: string
  title: string
  level: string
  track: string | null
  order: number
  durationMinutes: number | null
  audience: string | null
}

async function getLessons(): Promise<LessonSummary[]> {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'lessons',
    limit: 200,
    sort: 'order',
    depth: 0,
  })
  return res.docs.map((d) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = d as any
    return {
      id: doc.id,
      slug: doc.slug,
      title: doc.title,
      level: doc.level,
      track: doc.track ?? null,
      order: doc.order ?? 0,
      durationMinutes: doc.durationMinutes ?? null,
      audience: doc.audience ?? null,
    }
  })
}

interface GroupedLessons {
  key: string
  label: string
  description: string
  lessons: LessonSummary[]
}

function groupLessons(lessons: LessonSummary[]): GroupedLessons[] {
  const groups: Record<string, GroupedLessons> = {}

  for (const lesson of lessons) {
    let key: string
    let label: string
    let description: string

    if (lesson.level === 'mastery' && lesson.track) {
      key = `mastery-${lesson.track}`
      label = TRACK_LABELS[lesson.track] ?? lesson.track
      description = `Deep-dive specialization. ${lesson.audience ?? ''}`
    } else {
      key = lesson.level
      label = LEVEL_LABELS[lesson.level] ?? lesson.level
      description =
        lesson.level === 'foundations'
          ? 'For servers, bartenders, and anyone getting into wine. The essentials.'
          : lesson.level === 'intermediate'
            ? 'For sommeliers, lead servers, and serious hobbyists. Region-by-region depth.'
            : 'For wine directors and beverage managers. Technical mastery.'
    }

    if (!groups[key]) {
      groups[key] = { key, label, description, lessons: [] }
    }
    groups[key].lessons.push(lesson)
  }

  // Sort within each group by order
  Object.values(groups).forEach((g) => g.lessons.sort((a, b) => a.order - b.order))

  // Levels first (foundations, intermediate, advanced), then mastery alpha
  const order = ['foundations', 'intermediate', 'advanced']
  return Object.values(groups).sort((a, b) => {
    const ai = order.indexOf(a.key)
    const bi = order.indexOf(b.key)
    if (ai !== -1 && bi !== -1) return ai - bi
    if (ai !== -1) return -1
    if (bi !== -1) return 1
    return a.label.localeCompare(b.label)
  })
}

export default async function LearnPage() {
  const lessons = await getLessons()
  const groups = groupLessons(lessons)

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-[#722F37]">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#1C1C1C]">Education</span>
        </nav>

        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <h1 className="font-serif text-3xl sm:text-5xl italic text-[#1C1C1C]">
            Wine Saint Certified
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Structured curriculum for practical wine fluency. Built for restaurant
            staff and serious hobbyists. Read the lessons, take the quizzes,
            earn the certificate.
          </p>
          <p className="mt-3 text-sm text-gray-500 italic">
            Beta · v1 · 28 lessons · 600+ practice questions · 1 certification exam
          </p>
        </div>

        {/* Groups */}
        <div className="space-y-12">
          {groups.map((group) => (
            <section key={group.key}>
              <div className="mb-6 flex items-baseline justify-between flex-wrap gap-3">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl italic text-[#1C1C1C]">
                    {group.label}
                  </h2>
                  <p className="mt-1 text-gray-600 max-w-2xl">{group.description}</p>
                </div>
                <span className="text-sm font-semibold uppercase tracking-wide text-[#722F37]">
                  {group.lessons.length} lessons
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/learn/${lesson.slug}`}
                    className="block bg-white rounded-lg border-3 border-[#1C1C1C] p-5 hover:shadow-lg transition-shadow group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Lesson {lesson.order}
                      </span>
                      {lesson.durationMinutes && (
                        <span className="text-xs text-gray-500">
                          {lesson.durationMinutes} min
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl italic text-[#1C1C1C] group-hover:text-[#722F37] transition-colors leading-snug">
                      {lesson.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {groups.length === 0 && (
          <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-10 text-center">
            <p className="text-gray-600">
              No lessons published yet. Run the importer to populate content.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
