import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import ExercisePlayer, {
  type PlayerExercise,
} from '@/components/learn/ExercisePlayer'

export const metadata = {
  title: 'Practice | Wine Saint',
}

export default async function PracticePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config })

  // Find the lesson
  const lessonRes = await payload.find({
    collection: 'lessons',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const lesson = lessonRes.docs[0]
  if (!lesson) notFound()

  // Find its exercises (module Q's only, not exam pool)
  const exRes = await payload.find({
    collection: 'exercises',
    where: {
      and: [
        { lesson: { equals: lesson.id } },
        { examOnly: { equals: false } },
      ],
    },
    limit: 100,
    depth: 0,
  })

  const exercises: PlayerExercise[] = exRes.docs.map((d) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = d as any
    return {
      id: e.id,
      type: e.type,
      prompt: e.prompt,
      payload: e.payload ?? {},
      difficulty: e.difficulty,
    }
  })

  if (exercises.length === 0) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg border-3 border-[#1C1C1C] p-8 text-center">
          <h1 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">
            No exercises for this lesson yet
          </h1>
          <a
            href={`/learn/${slug}`}
            className="inline-block px-6 py-3 bg-[#722F37] text-white rounded font-semibold uppercase tracking-wide text-sm hover:bg-[#A64253] transition-colors"
          >
            Back to lesson
          </a>
        </div>
      </div>
    )
  }

  return (
    <ExercisePlayer
      exercises={exercises}
      lessonTitle={(lesson as { title: string }).title}
      lessonSlug={slug}
      backHref="/learn"
    />
  )
}
