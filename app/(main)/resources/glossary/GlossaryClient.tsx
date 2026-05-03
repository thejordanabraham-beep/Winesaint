'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

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

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface GlossaryClientProps {
  terms: Term[];
  categories: Category[];
}

export default function GlossaryClient({ terms, categories }: GlossaryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Filter terms based on search and category
  const filteredTerms = useMemo(() => {
    return terms.filter(term => {
      if (selectedCategory !== 'all' && !term.categories.includes(selectedCategory)) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          term.term.toLowerCase().includes(query) ||
          term.short_definition.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [terms, searchQuery, selectedCategory]);

  // Group filtered terms by letter
  const filteredByLetter = useMemo(() => {
    const grouped: Record<string, Term[]> = {};
    LETTERS.forEach(letter => {
      grouped[letter] = [];
    });

    filteredTerms.forEach(term => {
      const firstLetter = term.term.charAt(0).toUpperCase();
      if (grouped[firstLetter]) {
        grouped[firstLetter].push(term);
      }
    });

    return grouped;
  }, [filteredTerms]);

  const letterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    LETTERS.forEach(letter => {
      counts[letter] = filteredByLetter[letter]?.length || 0;
    });
    return counts;
  }, [filteredByLetter]);

  const scrollToLetter = (letter: string) => {
    const element = letterRefs.current[letter];
    if (element && letterCounts[letter] > 0) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveLetter(letter);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const letter of LETTERS) {
        const element = letterRefs.current[letter];
        if (element && letterCounts[letter] > 0) {
          const rect = element.getBoundingClientRect();
          const absoluteTop = rect.top + window.scrollY;
          if (absoluteTop <= scrollPosition) {
            setActiveLetter(letter);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [letterCounts]);

  const getCategoryInfo = (catId: string) => {
    return categories.find(c => c.id === catId);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-[#722F37]">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources" className="text-gray-500 hover:text-[#722F37]">Resources</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#1C1C1C]">Glossary</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">Wine Glossary</h1>
          <p className="mt-3 text-gray-600 max-w-3xl">
            A comprehensive dictionary of wine terminology, from viticulture to tasting notes.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {terms.length} terms
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search terms and definitions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border-2 border-[#1C1C1C]/20 bg-white px-4 py-2 pl-10 text-[#1C1C1C] placeholder:text-gray-400 focus:border-[#722F37] focus:outline-none"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border-2 border-[#1C1C1C]/20 bg-white px-4 py-2 text-[#1C1C1C] focus:border-[#722F37] focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sticky top-0 z-10 bg-[#FAF7F2] py-4 border-b border-[#1C1C1C]/10 mb-6">
          <div className="flex flex-wrap gap-1 justify-center">
            {LETTERS.map(letter => {
              const count = letterCounts[letter];
              const isActive = activeLetter === letter;
              const hasTerms = count > 0;

              return (
                <button
                  key={letter}
                  onClick={() => scrollToLetter(letter)}
                  disabled={!hasTerms}
                  className={`px-2 py-1 rounded text-sm font-medium transition-all ${
                    isActive && hasTerms
                      ? 'bg-[#722F37] text-white'
                      : hasTerms
                        ? 'bg-white border border-[#1C1C1C]/20 text-[#1C1C1C] hover:border-[#722F37]'
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {(searchQuery || selectedCategory !== 'all') && (
          <div className="mb-6 text-sm text-gray-600">
            Showing {filteredTerms.length} of {terms.length} terms
          </div>
        )}

        <div className="space-y-8">
          {LETTERS.map(letter => {
            const letterTerms = filteredByLetter[letter];
            if (!letterTerms || letterTerms.length === 0) return null;

            return (
              <div
                key={letter}
                ref={(el) => { letterRefs.current[letter] = el; }}
                className="scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex-shrink-0 w-12 h-12 rounded-full bg-[#722F37] text-white font-serif text-2xl italic flex items-center justify-center">
                    {letter}
                  </span>
                  <div className="flex-1 h-px bg-[#1C1C1C]/10"></div>
                  <span className="text-sm text-gray-400">{letterTerms.length} terms</span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {letterTerms.map(term => (
                    <Link
                      key={term.id}
                      href={`/resources/glossary/${term.id}`}
                      className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-lg transition-all group block"
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-serif text-xl italic text-[#722F37] group-hover:underline">
                          {term.term}
                        </h3>
                        {term.pronunciation && (
                          <span className="text-sm text-gray-400 italic flex-shrink-0">
                            /{term.pronunciation}/
                          </span>
                        )}
                      </div>

                      {term.categories && term.categories.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1">
                          {term.categories.slice(0, 2).map(catId => {
                            const cat = getCategoryInfo(catId);
                            if (!cat) return null;
                            return (
                              <span key={catId} className="px-2 py-0.5 bg-[#FAF7F2] text-xs rounded border border-[#1C1C1C]/10">
                                {cat.icon} {cat.name}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      <p className="text-gray-700 text-sm">
                        {term.short_definition}
                      </p>

                      <span className="inline-block mt-3 text-sm text-[#722F37] group-hover:underline">
                        Read more &rarr;
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No terms found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 text-[#722F37] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
