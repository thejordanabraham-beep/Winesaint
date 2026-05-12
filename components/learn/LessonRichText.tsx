/**
 * Renders a Lexical richText field using Payload's built-in React converter.
 *
 * Used for the `intro` field on lessons. Applies WineSaint editorial typography
 * (serif italic headings, generous reading width, brand-consistent prose).
 */

import { RichText } from '@payloadcms/richtext-lexical/react'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LexicalData = any

export function LessonRichText({ data }: { data: LexicalData }) {
  if (!data || !data.root) return null
  return (
    <div className="lesson-prose max-w-3xl">
      <RichText data={data} />
      <style>{`
        .lesson-prose h2 {
          font-family: ui-serif, Georgia, Cambria, serif;
          font-style: italic;
          font-size: 1.875rem;
          color: #1C1C1C;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .lesson-prose h3 {
          font-family: ui-serif, Georgia, Cambria, serif;
          font-style: italic;
          font-size: 1.5rem;
          color: #1C1C1C;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .lesson-prose h4 {
          font-weight: 600;
          font-size: 1.125rem;
          color: #1C1C1C;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .lesson-prose p {
          color: #1C1C1C;
          line-height: 1.7;
          margin-bottom: 1rem;
          font-size: 1.0625rem;
        }
        .lesson-prose strong {
          font-weight: 700;
          color: #1C1C1C;
        }
        .lesson-prose em {
          font-style: italic;
        }
        .lesson-prose ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .lesson-prose ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .lesson-prose li {
          color: #1C1C1C;
          line-height: 1.6;
          margin-bottom: 0.25rem;
          font-size: 1.0625rem;
        }
        .lesson-prose blockquote {
          border-left: 3px solid #722F37;
          background-color: #FAF7F2;
          padding: 1rem 1.25rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #1C1C1C;
        }
      `}</style>
    </div>
  )
}
