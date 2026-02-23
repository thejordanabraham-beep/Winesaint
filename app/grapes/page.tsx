'use client';

import { useState, useMemo } from 'react';
import { applyGrapeOverrides } from '@/app/utils/grapeOverrides';

// Color mapping for display
const getColorBadge = (berryColor: string) => {
  const color = berryColor.toLowerCase();
  if (color.includes('black') || color.includes('red') || color.includes('blue')) {
    return { label: 'Red', class: 'bg-red-100 text-red-800' };
  }
  if (color.includes('white') || color.includes('green') || color.includes('yellow')) {
    return { label: 'White', class: 'bg-yellow-100 text-yellow-800' };
  }
  if (color.includes('pink') || color.includes('grey') || color.includes('gray')) {
    return { label: 'Rosé', class: 'bg-pink-100 text-pink-800' };
  }
  return { label: 'White', class: 'bg-yellow-100 text-yellow-800' };
};

// Alphabet for A-Z filter
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function GrapesPage() {
  // Apply grape overrides (name changes and essential status changes)
  const grapesData = useMemo(() => applyGrapeOverrides(), []);

  const [showEssential, setShowEssential] = useState(true);
  const [selectedColor, setSelectedColor] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Get all unique regions from the data
  const allRegions = useMemo(() => {
    const regionSet = new Set<string>();
    grapesData.grapes.forEach((grape: any) => {
      grape.level_1.major_regions?.forEach((region: string) => {
        regionSet.add(region);
      });
    });
    return ['All Regions', ...Array.from(regionSet).sort()];
  }, [grapesData]);

  // Filter grapes
  const filteredGrapes = useMemo(() => {
    return grapesData.grapes.filter((grape: any) => {
      // Essential filter
      if (showEssential && !grape.is_essential) {
        return false;
      }

      // Color filter
      if (selectedColor !== 'All') {
        const badge = getColorBadge(grape.berry_color);
        if (badge.label !== selectedColor) {
          return false;
        }
      }

      // Region filter
      if (selectedRegion !== 'All Regions' && !grape.level_1.major_regions?.includes(selectedRegion)) {
        return false;
      }

      // Alphabetical filter
      if (selectedLetter !== 'All' && !grape.name.toUpperCase().startsWith(selectedLetter)) {
        return false;
      }

      // Search filter
      if (searchQuery && !grape.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [grapesData, showEssential, selectedColor, selectedRegion, selectedLetter, searchQuery]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Grape Guide</h1>
          <p className="mt-2 text-gray-600">
            Explore {grapesData.total_grapes} wine grape varieties with detailed information on origins, characteristics, and flavor profiles.
          </p>
        </div>

        {/* Essential Toggle */}
        <div className="mb-6">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setShowEssential(true)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                showEssential
                  ? 'bg-[#722F37] text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Essential ({grapesData.essential_grapes})
            </button>
            <button
              onClick={() => setShowEssential(false)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                !showEssential
                  ? 'bg-[#722F37] text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              All Grapes ({grapesData.total_grapes})
            </button>
          </div>
        </div>

        {/* Alphabetical Navigation */}
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedLetter('All')}
              className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                selectedLetter === 'All'
                  ? 'bg-[#722F37] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {ALPHABET.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                  selectedLetter === letter
                    ? 'bg-[#722F37] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500"
              >
                <option value="All">All</option>
                <option value="Red">Red</option>
                <option value="White">White</option>
              </select>
            </div>
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500"
              >
                {allRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredGrapes.length} grape varieties
          </p>
        </div>

        {/* Grape Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGrapes.map((grape: any) => {
            const colorBadge = getColorBadge(grape.berry_color);
            return (
              <div
                key={grape.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{grape.name}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colorBadge.class}`}>
                      {colorBadge.label}
                    </span>
                  </div>
                  {grape.principal_synonyms && (
                    <p className="text-xs text-gray-500">Also known as: {grape.principal_synonyms}</p>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  {grape.level_1.description}
                </p>

                <div className="space-y-3">
                  {/* Key Characteristics */}
                  {grape.level_1.key_characteristics && grape.level_1.key_characteristics.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">
                        Key Characteristics
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {grape.level_1.key_characteristics.map((char: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Typical Flavors */}
                  {grape.level_1.typical_flavors && grape.level_1.typical_flavors.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">
                        Typical Flavors
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {grape.level_1.typical_flavors.map((flavor: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-block bg-[#722F37]/10 text-[#722F37] text-xs px-2 py-1 rounded"
                          >
                            {flavor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Major Growing Regions */}
                  {grape.level_1.major_regions && grape.level_1.major_regions.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">
                        Major Growing Regions
                      </h4>
                      <p className="text-xs text-gray-600">{grape.level_1.major_regions.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredGrapes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No grape varieties match your filters.</p>
            <button
              onClick={() => {
                setShowEssential(true);
                setSelectedColor('All');
                setSelectedRegion('All Regions');
                setSelectedLetter('All');
                setSearchQuery('');
              }}
              className="mt-2 text-red-600 hover:text-red-700 font-semibold"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
