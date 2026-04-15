'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResultCard } from '@/components/search/SearchResultCard';

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

  // Filters
  const [sortBy, setSortBy] = useState('default');
  const [vintageMin, setVintageMin] = useState('');
  const [vintageMax, setVintageMax] = useState('');
  const [scoreMin, setScoreMin] = useState('');
  const [scoreMax, setScoreMax] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  useEffect(() => {
    const fetchAllWines = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/wines');
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
        const score10 = wine.review.score; // Already on 1-10 scale
        if (scoreMin && score10 < parseFloat(scoreMin)) return false;
        if (scoreMax && score10 > parseFloat(scoreMax)) return false;
        return true;
      });
    }

    if (sortBy === 'score') filtered.sort((a, b) => (b.review?.score || 0) - (a.review?.score || 0));
    else if (sortBy === 'vintage') filtered.sort((a, b) => b.vintage - a.vintage);
    else if (sortBy === 'price') filtered.sort((a, b) => (a.priceUsd || 0) - (b.priceUsd || 0));

    setResults(filtered);
  };

  // Re-run search when filters change
  useEffect(() => {
    if (allWines.length > 0) handleSearch();
  }, [sortBy, vintageMin, vintageMax, scoreMin, scoreMax, priceMin, priceMax, selectedCountries, searchQuery]);

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
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Results */}
        <div>
            <div className="flex justify-end mb-6">
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

            <p className="text-sm text-gray-500 mb-4">Showing {results.length} results</p>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No results found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {results.map((wine) => (
                  <SearchResultCard
                    key={wine._id}
                    wine={wine}
                    isExpanded={expandedCards.has(wine._id)}
                    onToggle={() => toggleCard(wine._id)}
                  />
                ))}
              </div>
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
