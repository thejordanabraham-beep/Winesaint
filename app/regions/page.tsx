'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import regionsData from '../data/regions_hierarchical.json';

export default function WineRegionGuidePage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Get all countries
  const countries = useMemo(() => {
    return Object.entries(regionsData.countries).map(([slug, data]: [string, any]) => ({
      slug,
      name: data.name,
      regionCount: Object.keys(data.regions).length,
      overview: data.overview
    }));
  }, []);

  // Filter countries by search
  const filteredCountries = useMemo(() => {
    if (!searchQuery) return countries;

    return countries.filter(country =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [countries, searchQuery]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Wine Region Guide</h1>
          <p className="mt-2 text-gray-600">
            Explore the world's wine regions from {regionsData.total_countries} countries.
            Discover terroir, climate, grape varieties, and the unique characteristics that define each region.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Countries
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by country name..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredCountries.length} countries
          </p>
        </div>

        {/* Country Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCountries.map((country) => (
            <Link
              key={country.slug}
              href={`/regions/${country.slug}`}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-[#722F37] transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#722F37] transition-colors">
                  {country.name}
                </h3>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-[#722F37] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {country.regionCount} wine {country.regionCount === 1 ? 'region' : 'regions'}
                </p>

                {country.overview && (
                  <p className="text-xs text-gray-500 line-clamp-3">
                    {country.overview.substring(0, 150)}...
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center text-sm font-medium text-[#722F37] group-hover:underline">
                Explore regions
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredCountries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No countries match your search.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-red-600 hover:text-red-700 font-semibold"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
