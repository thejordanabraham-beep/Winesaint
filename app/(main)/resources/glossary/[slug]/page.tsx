import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000/api';

interface Term {
  id: number;
  term: string;
  slug: string;
  definition: string;
  category?: string;
  pronunciation?: string;
  etymology?: string;
  relatedTerms?: Array<{ term: string }>;
}

const CATEGORIES: Record<string, { name: string; icon: string }> = {
  winemaking: { name: 'Winemaking', icon: '🍷' },
  viticulture: { name: 'Viticulture', icon: '🍇' },
  tasting: { name: 'Tasting', icon: '👃' },
  regions: { name: 'Regions', icon: '🗺️' },
  grapes: { name: 'Grapes', icon: '🌿' },
  general: { name: 'General', icon: '📚' },
};

async function getTermBySlug(slug: string): Promise<Term | null> {
  try {
    const response = await fetch(
      `${API_URL}/glossary?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
      { next: { revalidate: 60 } }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.docs?.[0] || null;
  } catch (error) {
    console.error('Error fetching term:', error);
    return null;
  }
}

async function getRelatedByLetter(term: string, currentSlug: string): Promise<Term[]> {
  try {
    const firstLetter = term.charAt(0).toUpperCase();
    const response = await fetch(
      `${API_URL}/glossary?where[term][like]=${firstLetter}%&limit=7&sort=term`,
      { next: { revalidate: 60 } }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return (data.docs || []).filter((t: Term) => t.slug !== currentSlug).slice(0, 6);
  } catch (error) {
    console.error('Error fetching related terms:', error);
    return [];
  }
}

async function getPrevNextTerms(currentTerm: string): Promise<{ prev: Term | null; next: Term | null }> {
  try {
    // Get previous term (alphabetically before current)
    const prevResponse = await fetch(
      `${API_URL}/glossary?where[term][less_than]=${encodeURIComponent(currentTerm)}&limit=1&sort=-term`,
      { next: { revalidate: 60 } }
    );
    const prevData = prevResponse.ok ? await prevResponse.json() : { docs: [] };

    // Get next term (alphabetically after current)
    const nextResponse = await fetch(
      `${API_URL}/glossary?where[term][greater_than]=${encodeURIComponent(currentTerm)}&limit=1&sort=term`,
      { next: { revalidate: 60 } }
    );
    const nextData = nextResponse.ok ? await nextResponse.json() : { docs: [] };

    return {
      prev: prevData.docs?.[0] || null,
      next: nextData.docs?.[0] || null,
    };
  } catch (error) {
    console.error('Error fetching prev/next:', error);
    return { prev: null, next: null };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const term = await getTermBySlug(slug);

  if (!term) {
    return { title: 'Term Not Found' };
  }

  return {
    title: `${term.term} - Wine Glossary`,
    description: term.definition?.substring(0, 160),
  };
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = await getTermBySlug(slug);

  if (!term) {
    notFound();
  }

  const [{ prev, next }, relatedByLetter] = await Promise.all([
    getPrevNextTerms(term.term),
    getRelatedByLetter(term.term, term.slug),
  ]);

  const categoryInfo = term.category ? CATEGORIES[term.category] : null;

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

            {/* Category Tag */}
            {categoryInfo && (
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/resources/glossary?category=${term.category}`}
                  className="px-3 py-1 bg-[#FAF7F2] text-sm rounded-full border border-[#1C1C1C]/10 hover:border-[#722F37] hover:text-[#722F37] transition-colors flex items-center gap-1"
                >
                  <span>{categoryInfo.icon}</span>
                  <span>{categoryInfo.name}</span>
                </Link>
              </div>
            )}
          </header>

          {/* Definition */}
          <div className="mb-6">
            <p className="text-lg text-gray-800 leading-relaxed">
              {term.definition}
            </p>
          </div>

          {/* Etymology */}
          {term.etymology && (
            <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h2 className="font-serif text-lg italic text-amber-800 mb-2">Etymology</h2>
              <p className="text-gray-700">{term.etymology}</p>
            </div>
          )}

          {/* Related Terms */}
          {term.relatedTerms && term.relatedTerms.length > 0 && (
            <div className="mb-6 p-4 bg-[#FAF7F2] rounded-lg">
              <h2 className="font-serif text-lg italic text-[#1C1C1C] mb-3">Related Terms</h2>
              <div className="flex flex-wrap gap-2">
                {term.relatedTerms.map((related, idx) => (
                  <Link
                    key={idx}
                    href={`/resources/glossary/${related.term.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-3 py-1 bg-white text-sm rounded border border-[#1C1C1C]/20 hover:border-[#722F37] hover:text-[#722F37] transition-colors"
                  >
                    {related.term}
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
              href={`/resources/glossary/${prev.slug}`}
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
              href={`/resources/glossary/${next.slug}`}
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
                  href={`/resources/glossary/${relTerm.slug}`}
                  className="bg-white rounded-lg border border-[#1C1C1C]/20 p-4 hover:border-[#722F37] hover:shadow transition-all"
                >
                  <h3 className="font-serif text-lg italic text-[#722F37] mb-1">{relTerm.term}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{relTerm.definition}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
