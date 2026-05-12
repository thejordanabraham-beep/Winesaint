'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResultCard } from '@/components/search/SearchResultCard';

const PER_PAGE = 18;

interface WineResult {
  _id: string;
  name: string;
  slug: string;
  vintage: number;
  priceUsd?: number;
  grapeVarieties?: string[];
  producer: { name: string } | null;
  region: { name: string; country: string } | null;
  review?: {
    score: number;
    tastingNotes: string;
    reviewerName: string;
    reviewDate: string;
    flavorProfile?: string[];
    foodPairings?: string[];
    drinkThisIf?: string;
    drinkingWindowStart?: number;
    drinkingWindowEnd?: number;
  };
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [allWines, setAllWines] = useState<WineResult[]>([]);
  const [results, setResults] = useState<WineResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  // Filters
  const [sortBy, setSortBy] = useState('default');
  const [vintageMin, setVintageMin] = useState('');
  const [vintageMax, setVintageMax] = useState('');
  const [scoreMin, setScoreMin] = useState('');
  const [scoreMax, setScoreMax] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const totalPages = Math.ceil(results.length / PER_PAGE);
  const paginatedResults = results.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  useEffect(() => {
    const fetchAllWines = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/wines-list');
        const data = await response.json();
        setAllWines(data);
        if (initialQuery) {
          setResults(filterWines(data, initialQuery));
        } else {
          setResults(data);
        }
      } catch (error) {
        console.error('Error fetching wines:', error);
      }
      setLoading(false);
    };
    fetchAllWines();
  }, [initialQuery]);

  const filterWines = (wines: WineResult[], searchTerm: string) => {
    if (!searchTerm.trim()) return wines;
    const term = searchTerm.toLowerCase();
    return wines.filter((wine) => {
      const nameMatch = wine.name?.toLowerCase().includes(term);
      const producerMatch = wine.producer?.name?.toLowerCase().includes(term);
      const regionMatch = wine.region?.name?.toLowerCase().includes(term);
      return nameMatch || producerMatch || regionMatch;
    });
  };

  const handleSearch = () => {
    let filtered = filterWines(allWines, searchQuery);

    if (vintageMin) filtered = filtered.filter((wine) => wine.vintage >= parseInt(vintageMin));
    if (vintageMax) filtered = filtered.filter((wine) => wine.vintage <= parseInt(vintageMax));
    if (priceMin) filtered = filtered.filter((wine) => wine.priceUsd && wine.priceUsd >= parseInt(priceMin));
    if (priceMax) filtered = filtered.filter((wine) => wine.priceUsd && wine.priceUsd <= parseInt(priceMax));
    if (selectedCountries.length > 0) {
      filtered = filtered.filter((wine) => wine.region?.country && selectedCountries.includes(wine.region.country));
    }
    if (scoreMin || scoreMax) {
      filtered = filtered.filter((wine) => {
        if (!wine.review) return false;
        const score10 = wine.review.score;
        if (scoreMin && score10 < parseFloat(scoreMin)) return false;
        if (scoreMax && score10 > parseFloat(scoreMax)) return false;
        return true;
      });
    }

    if (sortBy === 'score') filtered.sort((a, b) => (b.review?.score || 0) - (a.review?.score || 0));
    else if (sortBy === 'vintage') filtered.sort((a, b) => b.vintage - a.vintage);
    else if (sortBy === 'price') filtered.sort((a, b) => (a.priceUsd || 0) - (b.priceUsd || 0));

    setResults(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (allWines.length > 0) handleSearch();
  }, [sortBy, vintageMin, vintageMax, scoreMin, scoreMax, priceMin, priceMax, selectedCountries, searchQuery]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setExpandedCards(new Set());
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleCard = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedCards(newExpanded);
  };

  const toggleCountry = (country: string) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter(c => c !== country));
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('default');
    setVintageMin('');
    setVintageMax('');
    setScoreMin('');
    setScoreMax('');
    setPriceMin('');
    setPriceMax('');
    setSelectedCountries([]);
    setResults(allWines);
    setCurrentPage(1);
  };

  const pageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  const currentYear = new Date().getFullYear();
  const startResult = (currentPage - 1) * PER_PAGE + 1;
  const endResult = Math.min(currentPage * PER_PAGE, results.length);

  const activeFilters: { label: string; onRemove: () => void }[] = [];
  if (searchQuery) activeFilters.push({ label: `"${searchQuery}"`, onRemove: () => setSearchQuery('') });
  if (sortBy !== 'default') {
    const sortLabels: Record<string, string> = { score: 'Score (High to Low)', vintage: 'Vintage (Newest)', price: 'Price (Low to High)' };
    activeFilters.push({ label: `Sort: ${sortLabels[sortBy] || sortBy}`, onRemove: () => setSortBy('default') });
  }
  if (vintageMin || vintageMax) {
    activeFilters.push({
      label: `Vintage: ${vintageMin || currentYear - 49}–${vintageMax || currentYear}`,
      onRemove: () => { setVintageMin(''); setVintageMax(''); },
    });
  }
  if (scoreMin || scoreMax) {
    activeFilters.push({
      label: `Score: ${scoreMin || '5.0'}–${scoreMax || '10.0'}`,
      onRemove: () => { setScoreMin(''); setScoreMax(''); },
    });
  }
  if (priceMin || priceMax) {
    activeFilters.push({
      label: `Price: $${priceMin || '0'}–$${priceMax || '2000'}`,
      onRemove: () => { setPriceMin(''); setPriceMax(''); },
    });
  }
  for (const country of selectedCountries) {
    activeFilters.push({ label: country, onRemove: () => toggleCountry(country) });
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8" ref={topRef}>
        <div>
            {/* Search bar + Filters row */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by producer, wine, or region..."
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-[#1C1C1C] bg-[#FAF7F2] text-sm placeholder-gray-400 focus:outline-none focus:border-[#722F37] transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <SearchFilters
                sortBy={sortBy}
                setSortBy={setSortBy}
                vintageMin={vintageMin}
                setVintageMin={setVintageMin}
                vintageMax={vintageMax}
                setVintageMax={setVintageMax}
                scoreMin={scoreMin}
                setScoreMin={setScoreMin}
                scoreMax={scoreMax}
                setScoreMax={setScoreMax}
                priceMin={priceMin}
                setPriceMin={setPriceMin}
                priceMax={priceMax}
                setPriceMax={setPriceMax}
                selectedCountries={selectedCountries}
                toggleCountry={toggleCountry}
                clearFilters={clearFilters}
              />
            </div>

            {/* Active filter pills */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {activeFilters.map((filter, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAF7F2] border border-[#722F37]/30 text-sm text-[#722F37]"
                  >
                    {filter.label}
                    <button
                      onClick={filter.onRemove}
                      className="ml-0.5 hover:text-[#1C1C1C] transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-500 hover:text-[#722F37] underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Result count */}
            <p className="text-sm text-gray-500 mb-4">
              {results.length > 0 ? (
                <>Showing {startResult}–{endResult} of {results.length.toLocaleString()} results</>
              ) : loading ? '' : 'No results'}
            </p>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No results found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-100">
                  {paginatedResults.map((wine) => (
                    <SearchResultCard
                      key={wine._id}
                      wine={wine}
                      isExpanded={expandedCards.has(wine._id)}
                      onToggle={() => toggleCard(wine._id)}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav className="flex items-center justify-center gap-1 pt-8 pb-4">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-[#722F37] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ← Prev
                    </button>

                    {pageNumbers().map((page, idx) =>
                      page === 'ellipsis' ? (
                        <span key={`e-${idx}`} className="px-2 py-2 text-sm text-gray-400">…</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`min-w-[36px] px-2 py-2 text-sm transition-colors ${
                            currentPage === page
                              ? 'bg-[#722F37] text-white'
                              : 'text-gray-600 hover:text-[#722F37] hover:bg-[#FAF7F2]'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-[#722F37] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </nav>
                )}
              </>
            )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="bg-white min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <SearchContent />
    </Suspense>
  );
}
