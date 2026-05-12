'use client'

/**
 * Exercise Player — interactive client component.
 *
 * Renders exercises one at a time. Each exercise:
 *   - shows the prompt + type-specific input
 *   - submit → show correct/wrong + explanation
 *   - next → advance to next exercise
 *
 * No backend session state in v1 — purely client-side. No streaks, no SRS,
 * no progress tracking. Just the engagement loop demonstrated.
 */

import { useState, useMemo } from 'react'
import Link from 'next/link'

type Choice = { id: string; text: string }

interface ExercisePayload {
  choices?: Choice[]
  correctIds?: string[]
  acceptedAnswers?: string[]
  caseSensitive?: boolean
}

export interface PlayerExercise {
  id: string | number
  type: 'multiple-choice' | 'multiple-select' | 'type-answer'
  prompt: string
  payload: ExercisePayload
  difficulty?: string
}

interface ExercisePlayerProps {
  exercises: PlayerExercise[]
  lessonTitle: string
  lessonSlug: string
  backHref?: string
}

export default function ExercisePlayer({
  exercises,
  lessonTitle,
  lessonSlug,
  backHref = '/learn',
}: ExercisePlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  // Per-exercise state — selected choices or typed text
  const [selected, setSelected] = useState<string[]>([])
  const [typed, setTyped] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [stats, setStats] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 })

  const ex = exercises[currentIndex]
  const isLast = currentIndex === exercises.length - 1
  const isComplete = currentIndex >= exercises.length

  // Compute correctness when submitted
  const isCorrect = useMemo(() => {
    if (!submitted || !ex) return false
    if (ex.type === 'type-answer') {
      const accepted = ex.payload.acceptedAnswers ?? []
      const target = typed.trim()
      return accepted.some((a) =>
        ex.payload.caseSensitive
          ? a === target
          : a.toLowerCase() === target.toLowerCase()
      )
    }
    const correctIds = new Set(ex.payload.correctIds ?? [])
    const selectedSet = new Set(selected)
    if (correctIds.size !== selectedSet.size) return false
    for (const id of correctIds) if (!selectedSet.has(id)) return false
    return true
  }, [submitted, ex, typed, selected])

  const canSubmit = ex && !submitted && (
    (ex.type === 'type-answer' && typed.trim().length > 0) ||
    (ex.type !== 'type-answer' && selected.length > 0)
  )

  function handleSubmit() {
    if (!ex || submitted) return
    setSubmitted(true)
    setStats((s) => ({ correct: s.correct + (computeCorrect(ex, selected, typed) ? 1 : 0), total: s.total + 1 }))
  }

  function handleNext() {
    setCurrentIndex((i) => i + 1)
    setSelected([])
    setTyped('')
    setSubmitted(false)
  }

  function handleSelect(choiceId: string) {
    if (submitted || !ex) return
    if (ex.type === 'multiple-select') {
      setSelected((prev) =>
        prev.includes(choiceId) ? prev.filter((id) => id !== choiceId) : [...prev, choiceId]
      )
    } else {
      setSelected([choiceId])
    }
  }

  // ───── Session complete screen ─────
  if (isComplete) {
    const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-lg border-3 border-[#1C1C1C] p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#722F37] mb-2">
            Session complete
          </p>
          <h1 className="font-serif text-4xl italic text-[#1C1C1C] mb-4">
            {stats.correct} of {stats.total} correct
          </h1>
          <p className="text-gray-600 mb-8 text-lg">{pct}% on {lessonTitle}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/learn/${lessonSlug}`}
              className="px-6 py-3 bg-[#722F37] text-white rounded font-semibold uppercase tracking-wide text-sm hover:bg-[#A64253] transition-colors"
            >
              Back to lesson
            </Link>
            <Link
              href={backHref}
              className="px-6 py-3 border-2 border-[#1C1C1C] text-[#1C1C1C] rounded font-semibold uppercase tracking-wide text-sm hover:bg-[#1C1C1C] hover:text-white transition-colors"
            >
              All lessons
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!ex) return null

  // ───── Active exercise screen ─────
  const choices = ex.payload.choices ?? []
  const correctIds = new Set(ex.payload.correctIds ?? [])

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Top bar */}
      <div className="border-b-2 border-[#1C1C1C]/10 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between gap-4">
          <Link
            href={`/learn/${lessonSlug}`}
            className="text-sm text-gray-500 hover:text-[#722F37] flex items-center gap-1"
          >
            ← Exit
          </Link>
          <div className="flex items-center gap-1 flex-1 max-w-md mx-auto">
            {exercises.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i < currentIndex
                    ? 'bg-[#722F37]'
                    : i === currentIndex
                      ? 'bg-[#1C1C1C]'
                      : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-gray-500 tabular-nums">
            {currentIndex + 1} / {exercises.length}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Question {currentIndex + 1}
          {ex.type === 'multiple-select' && ' · Select all that apply'}
          {ex.type === 'type-answer' && ' · Type your answer'}
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl italic text-[#1C1C1C] mb-8 leading-snug">
          {ex.prompt}
        </h2>

        {/* Type-answer input */}
        {ex.type === 'type-answer' ? (
          <input
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={submitted}
            placeholder="Type your answer…"
            className="w-full px-4 py-3 bg-white border-2 border-[#1C1C1C] rounded text-lg focus:outline-none focus:border-[#722F37] disabled:opacity-60"
          />
        ) : (
          <div className="space-y-3">
            {choices.map((choice) => {
              const isSelected = selected.includes(choice.id)
              const isThisCorrect = correctIds.has(choice.id)
              let stateClass = 'bg-white border-2 border-[#1C1C1C] hover:border-[#722F37]'
              if (submitted) {
                if (isThisCorrect) {
                  stateClass = 'bg-green-50 border-2 border-green-600'
                } else if (isSelected) {
                  stateClass = 'bg-red-50 border-2 border-red-500'
                } else {
                  stateClass = 'bg-white border-2 border-gray-300 opacity-60'
                }
              } else if (isSelected) {
                stateClass = 'bg-[#722F37]/5 border-2 border-[#722F37]'
              }
              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => handleSelect(choice.id)}
                  disabled={submitted}
                  className={`w-full text-left px-5 py-4 rounded transition-colors ${stateClass}`}
                >
                  <span className="font-semibold text-sm uppercase tracking-wide text-gray-500 mr-3">
                    {choice.id.toUpperCase()}
                  </span>
                  <span className="text-[#1C1C1C]">{choice.text}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Submit / Next */}
        <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
          {!submitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`px-8 py-3 rounded font-semibold uppercase tracking-wide text-sm transition-colors ${
                canSubmit
                  ? 'bg-[#722F37] text-white hover:bg-[#A64253]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit
            </button>
          ) : (
            <div className="w-full">
              <div
                className={`mb-4 p-4 rounded border-2 ${
                  isCorrect
                    ? 'bg-green-50 border-green-600 text-green-900'
                    : 'bg-red-50 border-red-500 text-red-900'
                }`}
              >
                <p className="font-semibold mb-1">{isCorrect ? '✓ Correct' : '✗ Not quite'}</p>
                {ex.type === 'type-answer' && (
                  <p className="text-sm">
                    Accepted answers: {(ex.payload.acceptedAnswers ?? []).join(', ') || '—'}
                  </p>
                )}
                {ex.type !== 'type-answer' && !isCorrect && (
                  <p className="text-sm">
                    Correct answer{correctIds.size > 1 ? 's' : ''}:{' '}
                    {choices
                      .filter((c) => correctIds.has(c.id))
                      .map((c) => c.text)
                      .join(', ')}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-[#1C1C1C] text-white rounded font-semibold uppercase tracking-wide text-sm hover:bg-[#722F37] transition-colors"
              >
                {isLast ? 'Finish' : 'Next →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ───── Helpers ─────
function computeCorrect(
  ex: PlayerExercise,
  selected: string[],
  typed: string
): boolean {
  if (ex.type === 'type-answer') {
    const accepted = ex.payload.acceptedAnswers ?? []
    const target = typed.trim()
    return accepted.some((a) =>
      ex.payload.caseSensitive
        ? a === target
        : a.toLowerCase() === target.toLowerCase()
    )
  }
  const correctIds = new Set(ex.payload.correctIds ?? [])
  const selectedSet = new Set(selected)
  if (correctIds.size !== selectedSet.size) return false
  for (const id of correctIds) if (!selectedSet.has(id)) return false
  return true
}
