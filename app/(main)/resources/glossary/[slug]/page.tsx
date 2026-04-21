import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import glossaryData from '@/app/data/glossary.json';

type Term = {
  id: string;
  term: string;
  pronunciation?: string;
  categories: string[];
  short_definition: string;
  full_definition: string;
  related_terms?: string[];
  see_also?: string[];
  links?: {
    regions?: string[];
    grapes?: string[];
    resources?: string[];
  };
};

type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

const terms = glossaryData.terms as Term[];
const categories = glossaryData.categories as Category[];

// Generate static params for all terms
export function generateStaticParams() {
  return terms.map((term) => ({
    slug: term.id,
  }));
}

// Generate metadata for each term page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const term = terms.find(t => t.id === slug);

  if (!term) {
    return {
      title: 'Term Not Found',
    };
  }

  return {
    title: `${term.term} - Wine Glossary`,
    description: term.short_definition,
  };
}

// Get category info by id
function getCategoryInfo(categoryId: string): Category | undefined {
  return categories.find(c => c.id === categoryId);
}

// Get term by id
function getTermById(id: string): Term | undefined {
  return terms.find(t => t.id === id);
}

// Get terms that start with the same letter
function getRelatedByLetter(currentTerm: Term): Term[] {
  const firstLetter = currentTerm.term.charAt(0).toUpperCase();
  return terms
    .filter(t => t.id !== currentTerm.id && t.term.charAt(0).toUpperCase() === firstLetter)
    .slice(0, 6);
}

// Navigation helpers
function getPrevNextTerms(currentTerm: Term): { prev: Term | null; next: Term | null } {
  const sortedTerms = [...terms].sort((a, b) => a.term.localeCompare(b.term));
  const currentIndex = sortedTerms.findIndex(t => t.id === currentTerm.id);

  return {
    prev: currentIndex > 0 ? sortedTerms[currentIndex - 1] : null,
    next: currentIndex < sortedTerms.length - 1 ? sortedTerms[currentIndex + 1] : null,
  };
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = terms.find(t => t.id === slug);

  if (!term) {
    notFound();
  }

  const { prev, next } = getPrevNextTerms(term);
  const relatedByLetter = getRelatedByLetter(term);

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
            <div className="flex flex-wrap gap-2">
              {term.categories.map(catId => {
                const cat = getCategoryInfo(catId);
                return cat ? (
                  <Link
                    key={catId}
                    href={`/resources/glossary?category=${catId}`}
                    className="px-3 py-1 bg-[#FAF7F2] text-sm rounded-full border border-[#1C1C1C]/10 hover:border-[#722F37] hover:text-[#722F37] transition-colors flex items-center gap-1"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                ) : null;
              })}
            </div>
          </header>

          {/* Short Definition */}
          <div className="mb-6">
            <p className="text-lg text-gray-800 font-medium leading-relaxed">
              {term.short_definition}
            </p>
          </div>

          {/* Full Definition */}
          <div className="mb-8">
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
                {term.related_terms.map(relatedId => {
                  const relatedTerm = getTermById(relatedId);
                  if (relatedTerm) {
                    return (
                      <Link
                        key={relatedId}
                        href={`/resources/glossary/${relatedId}`}
                        className="px-3 py-1 bg-white text-sm rounded border border-[#1C1C1C]/20 hover:border-[#722F37] hover:text-[#722F37] transition-colors"
                      >
                        {relatedTerm.term}
                      </Link>
                    );
                  }
                  return (
                    <span
                      key={relatedId}
                      className="px-3 py-1 bg-white text-sm rounded border border-[#1C1C1C]/10 text-gray-400"
                    >
                      {relatedId}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* See Also */}
          {term.see_also && term.see_also.length > 0 && (
            <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h2 className="font-serif text-lg italic text-amber-800 mb-3">See Also</h2>
              <div className="flex flex-wrap gap-2">
                {term.see_also.map(seeAlsoId => {
                  const seeAlsoTerm = getTermById(seeAlsoId);
                  if (seeAlsoTerm) {
                    return (
                      <Link
                        key={seeAlsoId}
                        href={`/resources/glossary/${seeAlsoId}`}
                        className="px-3 py-1 bg-white text-sm rounded border border-amber-300 hover:border-[#722F37] hover:text-[#722F37] transition-colors"
                      >
                        {seeAlsoTerm.term}
                      </Link>
                    );
                  }
                  return (
                    <span
                      key={seeAlsoId}
                      className="px-3 py-1 bg-white text-sm rounded border border-amber-200 text-gray-400"
                    >
                      {seeAlsoId}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Deep Links */}
          {term.links && (Object.keys(term.links).length > 0) && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h2 className="font-serif text-lg italic text-blue-800 mb-3">Explore Further</h2>
              <div className="space-y-2">
                {term.links.regions && term.links.regions.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-blue-700">Regions: </span>
                    <span className="text-sm">
                      {term.links.regions.map((link, i) => (
                        <span key={link}>
                          <Link
                            href={link}
                            className="text-blue-600 hover:underline"
                          >
                            {link.split('/').pop()?.replace(/-/g, ' ')}
                          </Link>
                          {i < term.links!.regions!.length - 1 && ', '}
                        </span>
                      ))}
                    </span>
                  </div>
                )}
                {term.links.grapes && term.links.grapes.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-blue-700">Grapes: </span>
                    <span className="text-sm">
                      {term.links.grapes.map((link, i) => (
                        <span key={link}>
                          <Link
                            href={link}
                            className="text-blue-600 hover:underline"
                          >
                            {link.split('/').pop()?.replace(/-/g, ' ')}
                          </Link>
                          {i < term.links!.grapes!.length - 1 && ', '}
                        </span>
                      ))}
                    </span>
                  </div>
                )}
                {term.links.resources && term.links.resources.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-blue-700">Resources: </span>
                    <span className="text-sm">
                      {term.links.resources.map((link, i) => (
                        <span key={link}>
                          <Link
                            href={link}
                            className="text-blue-600 hover:underline"
                          >
                            {link.split('/').pop()?.replace(/-/g, ' ')} guide
                          </Link>
                          {i < term.links!.resources!.length - 1 && ', '}
                        </span>
                      ))}
                    </span>
                  </div>
                )}
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
