import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import glossaryData from '@/app/data/glossary.json';

interface Term {
  id: string;
  term: string;
  pronunciation?: string;
  categories: string[];
  short_definition: string;
  full_definition: string;
  related_terms?: string[];
  see_also?: string[];
}

const CATEGORIES: Record<string, { name: string; icon: string }> = {
  winemaking: { name: 'Winemaking', icon: '🍷' },
  viticulture: { name: 'Viticulture', icon: '🍇' },
  tasting: { name: 'Tasting', icon: '👃' },
  faults: { name: 'Faults', icon: '⚠️' },
  regions: { name: 'Regions', icon: '🗺️' },
  grapes: { name: 'Grape Varieties', icon: '🌿' },
  business: { name: 'Business', icon: '📊' },
  history: { name: 'History', icon: '📜' },
  general: { name: 'General', icon: '📚' },
};

function getTermBySlug(slug: string): Term | null {
  const terms = (glossaryData as any).terms as Term[];
  return terms.find(t => t.id === slug) || null;
}

function getTermByName(name: string): Term | null {
  const terms = (glossaryData as any).terms as Term[];
  return terms.find(t => t.id === name || t.term.toLowerCase() === name.toLowerCase()) || null;
}

function getRelatedByLetter(term: string, currentId: string): Term[] {
  const terms = (glossaryData as any).terms as Term[];
  const firstLetter = term.charAt(0).toUpperCase();
  return terms
    .filter(t => t.term.charAt(0).toUpperCase() === firstLetter && t.id !== currentId)
    .slice(0, 6);
}

function getPrevNextTerms(currentTerm: string): { prev: Term | null; next: Term | null } {
  const terms = (glossaryData as any).terms as Term[];
  const sorted = [...terms].sort((a, b) => a.term.localeCompare(b.term));
  const currentIndex = sorted.findIndex(t => t.term === currentTerm);

  return {
    prev: currentIndex > 0 ? sorted[currentIndex - 1] : null,
    next: currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const term = getTermBySlug(slug);

  if (!term) {
    return { title: 'Term Not Found' };
  }

  return {
    title: `${term.term} - Wine Glossary | WineSaint`,
    description: term.short_definition,
  };
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = getTermBySlug(slug);

  if (!term) {
    notFound();
  }

  const { prev, next } = getPrevNextTerms(term.term);
  const relatedByLetter = getRelatedByLetter(term.term, term.id);

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-[#722F37]">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources" className="text-gray-500 hover:text-[#722F37]">Resources</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources/glossary" className="text-gray-500 hover:text-[#722F37]">Glossary</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#1C1C1C]">{term.term}</span>
        </nav>

        {/* Main Content */}
        <article className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 sm:p-8">
          {/* Header */}
          <header className="mb-6 pb-6 border-b border-[#1C1C1C]/10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
              <h1 className="font-serif text-4xl italic text-[#722F37]">{term.term}</h1>
              {term.pronunciation && (
                <span className="text-gray-500 italic text-lg">
                  /{term.pronunciation}/
                </span>
              )}
            </div>

            {/* Category Tags */}
            {term.categories && term.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {term.categories.map(cat => {
                  const categoryInfo = CATEGORIES[cat];
                  if (!categoryInfo) return null;
                  return (
                    <Link
                      key={cat}
                      href={`/resources/glossary?category=${cat}`}
                      className="px-3 py-1 bg-[#FAF7F2] text-sm rounded-full border border-[#1C1C1C]/10 hover:border-[#722F37] hover:text-[#722F37] transition-colors flex items-center gap-1"
                    >
                      <span>{categoryInfo.icon}</span>
                      <span>{categoryInfo.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </header>

          {/* Short Definition */}
          <div className="mb-6 p-4 bg-[#FAF7F2] rounded-lg border-l-4 border-[#722F37]">
            <p className="text-lg text-gray-800 font-medium">
              {term.short_definition}
            </p>
          </div>

          {/* Full Definition */}
          <div className="mb-6">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Full Definition</h2>
            <p className="text-gray-700 leading-relaxed">
              {term.full_definition}
            </p>
          </div>

          {/* Related Terms */}
          {term.related_terms && term.related_terms.length > 0 && (
            <div className="mb-6 p-4 bg-[#FAF7F2] rounded-lg">
              <h2 className="font-serif text-lg italic text-[#1C1C1C] mb-3">Related Terms</h2>
              <div className="flex flex-wrap gap-2">
                {term.related_terms.map((related, idx) => (
                  <Link
                    key={idx}
                    href={`/resources/glossary/${related}`}
                    className="px-3 py-1 bg-white text-sm rounded border border-[#1C1C1C]/20 hover:border-[#722F37] hover:text-[#722F37] transition-colors"
                  >
                    {related.replace(/-/g, ' ')}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* See Also */}
          {term.see_also && term.see_also.length > 0 && (
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h2 className="font-serif text-lg italic text-amber-800 mb-3">See Also</h2>
              <div className="flex flex-wrap gap-2">
                {term.see_also.map((item, idx) => (
                  <Link
                    key={idx}
                    href={`/resources/glossary/${item}`}
                    className="px-3 py-1 bg-white text-sm rounded border border-amber-300 hover:border-[#722F37] hover:text-[#722F37] transition-colors"
                  >
                    {item.replace(/-/g, ' ')}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          {prev ? (
            <Link
              href={`/resources/glossary/${prev.id}`}
              className="flex items-center gap-2 text-[#722F37] hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">{prev.term}</span>
            </Link>
          ) : (
            <div></div>
          )}

          <Link
            href="/resources/glossary"
            className="px-4 py-2 bg-white border-2 border-[#1C1C1C] rounded-lg text-sm hover:border-[#722F37] hover:text-[#722F37] transition-colors"
          >
            Back to Glossary
          </Link>

          {next ? (
            <Link
              href={`/resources/glossary/${next.id}`}
              className="flex items-center gap-2 text-[#722F37] hover:underline"
            >
              <span className="text-sm">{next.term}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div></div>
          )}
        </div>

        {/* More Terms Starting with Same Letter */}
        {relatedByLetter.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">
              More terms starting with {term.term.charAt(0).toUpperCase()}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedByLetter.map(relTerm => (
                <Link
                  key={relTerm.id}
                  href={`/resources/glossary/${relTerm.id}`}
                  className="bg-white rounded-lg border border-[#1C1C1C]/20 p-4 hover:border-[#722F37] hover:shadow transition-all"
                >
                  <h3 className="font-serif text-lg italic text-[#722F37] mb-1">{relTerm.term}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{relTerm.short_definition}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
