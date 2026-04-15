'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RegionHit {
  document: {
    id: string;
    name: string;
    slug: string;
    fullSlug: string;
    level: string;
    country: string;
    classification?: string;
    description?: string;
    parentRegionName?: string;
  };
  highlight?: {
    name?: { snippet: string };
    country?: { snippet: string };
    description?: { snippet: string };
  };
}

interface SearchResult {
  found: number;
  hits: RegionHit[];
  search_time_ms: number;
}

export default function RegionSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=regions&limit=50`);

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'country': return 'bg-blue-100 text-blue-800';
      case 'region': return 'bg-green-100 text-green-800';
      case 'subregion': return 'bg-yellow-100 text-yellow-800';
      case 'village': return 'bg-purple-100 text-purple-800';
      case 'vineyard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Region Search</h1>
        <p className="text-gray-600 mb-6">Search wine regions powered by Typesense instant search</p>

        {/* Search Input */}
        <div className="mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search regions (e.g., Burgundy, Napa, Mosel...)"
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-wine-500 outline-none"
            autoFocus
          />
        </div>

        {/* Search Stats */}
        {results && (
          <div className="mb-4 text-sm text-gray-500">
            Found {results.found} regions in {results.search_time_ms}ms
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Results */}
        {!loading && results && results.hits.length > 0 && (
          <div className="space-y-3">
            {results.hits.map((hit) => (
              <Link
                key={hit.document.id}
                href={`/regions/${hit.document.fullSlug}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {hit.document.name}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${getLevelBadgeColor(hit.document.level)}`}>
                        {hit.document.level}
                      </span>
                      {hit.document.classification && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded bg-amber-100 text-amber-800">
                          {hit.document.classification}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {hit.document.parentRegionName && (
                        <span>{hit.document.parentRegionName} &bull; </span>
                      )}
                      <span>{hit.document.country}</span>
                    </div>
                    {hit.document.description && (
                      <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                        {hit.document.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && query && results && results.hits.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No regions found for "{query}"</p>
          </div>
        )}

        {/* Initial State */}
        {!loading && !query && (
          <div className="text-center py-12 text-gray-500">
            <p>Start typing to search {results?.found || '2,438'} wine regions</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {['Burgundy', 'Champagne', 'Napa Valley', 'Barolo', 'Rioja', 'Mosel'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
