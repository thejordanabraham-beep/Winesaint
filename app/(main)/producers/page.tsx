'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';

interface Producer {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  region?: {
    id: number;
    name: string;
    slug: string;
    country: string;
  } | null;
  country?: string;
  wineCount?: number;
}

export default function ProducersPage() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducers() {
      try {
        const response = await fetch('/api/producers-list');
        const data = await response.json();
        setProducers(data);
      } catch (error) {
        console.error('Error fetching producers:', error);
      }
      setLoading(false);
    }
    fetchProducers();
  }, []);

  // Get unique countries
  const countries = useMemo(() => {
    const countrySet = new Set<string>();
    producers.forEach(p => {
      const country = typeof p.region === 'object' ? p.region?.country : p.country;
      if (country) countrySet.add(country);
    });
    return Array.from(countrySet).sort();
  }, [producers]);

  // Filter producers
  const filteredProducers = useMemo(() => {
    let filtered = producers;

    // Filter by country
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(p => {
        const country = typeof p.region === 'object' ? p.region?.country : p.country;
        return country === selectedCountry;
      });
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (typeof p.region === 'object' && p.region?.name.toLowerCase().includes(query))
      );
    }

    // Sort alphabetically
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [producers, selectedCountry, searchQuery]);

  // Group by first letter
  const groupedProducers = useMemo(() => {
    const groups: Record<string, Producer[]> = {};
    filteredProducers.forEach(p => {
      const letter = p.name.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(p);
    });
    return groups;
  }, [filteredProducers]);

  // Available letters
  const availableLetters = useMemo(() => {
    return Object.keys(groupedProducers).sort();
  }, [groupedProducers]);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const scrollToLetter = (letter: string) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveLetter(letter);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C] mb-2">
            Producers
          </h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${producers.length} producers`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search producers..."
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#1C1C1C] rounded-lg text-sm focus:outline-none focus:border-[#722F37] placeholder-gray-400"
            />
          </div>
        </div>

        {/* Country Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => setSelectedCountry('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCountry === 'all'
                  ? 'bg-[#722F37] text-white'
                  : 'bg-white border-2 border-[#1C1C1C] text-[#1C1C1C] hover:bg-gray-50'
              }`}
            >
              All
            </button>
            {countries.map(country => (
              <button
                key={country}
                onClick={() => setSelectedCountry(country)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCountry === country
                    ? 'bg-[#722F37] text-white'
                    : 'bg-white border-2 border-[#1C1C1C] text-[#1C1C1C] hover:bg-gray-50'
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>

        {/* A-Z Navigation */}
        <div className="mb-6 flex flex-wrap gap-1 justify-center">
          {alphabet.map(letter => {
            const isAvailable = availableLetters.includes(letter);
            return (
              <button
                key={letter}
                onClick={() => isAvailable && scrollToLetter(letter)}
                disabled={!isAvailable}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  isAvailable
                    ? activeLetter === letter
                      ? 'bg-[#722F37] text-white'
                      : 'bg-white border border-[#1C1C1C] text-[#1C1C1C] hover:bg-[#722F37] hover:text-white hover:border-[#722F37]'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* Producer List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading producers...</div>
        ) : filteredProducers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No producers found. {searchQuery && 'Try a different search term.'}
          </div>
        ) : (
          <div className="space-y-8">
            {availableLetters.map(letter => (
              <div key={letter} id={`letter-${letter}`}>
                {/* Letter Header */}
                <div className="sticky top-0 bg-[#FAF7F2] py-2 z-10">
                  <h2 className="font-serif text-2xl italic text-[#722F37] border-b-2 border-[#722F37] pb-1">
                    {letter}
                  </h2>
                </div>

                {/* Producers under this letter */}
                <div className="divide-y divide-gray-200">
                  {groupedProducers[letter].map(producer => {
                    const region = typeof producer.region === 'object' ? producer.region : null;

                    return (
                      <Link
                        key={producer.id}
                        href={`/producers/${producer.slug}`}
                        className="flex items-center justify-between py-4 hover:bg-white hover:px-4 hover:-mx-4 transition-all group"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-[#1C1C1C] group-hover:text-[#722F37] transition-colors">
                            {producer.name}
                          </span>
                          <span className="text-gray-500 text-sm ml-3">
                            {region?.name || 'Unknown Region'}
                            {producer.wineCount ? ` · ${producer.wineCount} wine${producer.wineCount > 1 ? 's' : ''}` : ''}
                          </span>
                        </div>
                        <span className="text-gray-400 group-hover:text-[#722F37] ml-4">→</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
