'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface PayloadGrape {
  id: number;
  name: string;
  slug: string;
  color: 'red' | 'white' | 'pink';
  berryColor?: string;
  isEssential?: boolean;
  description?: string;
  aliases?: Array<{ alias: string }>;
  flavorProfile?: Array<{ flavor: string }>;
  majorRegions?: Array<{ region: string }>;
}

interface GrapesClientProps {
  grapes: PayloadGrape[];
  totalGrapes: number;
  essentialCount: number;
}

// Wine-appropriate color badges
const getColorBadge = (color: string) => {
  if (color === 'red') {
    return { label: 'Red', bgClass: 'bg-[#722F37]', textClass: 'text-white' };
  }
  if (color === 'pink') {
    return { label: 'Rosé', bgClass: 'bg-[#E8B4B8]', textClass: 'text-[#1C1C1C]' };
  }
  return { label: 'White', bgClass: 'bg-[#E8DFD0]', textClass: 'text-[#1C1C1C]' };
};

// Format grape name to title case
const formatGrapeName = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Alphabet for A-Z filter
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function GrapesClient({ grapes, totalGrapes, essentialCount }: GrapesClientProps) {
  const [showEssential, setShowEssential] = useState(true);
  const [selectedColor, setSelectedColor] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Get all unique regions from the data
  const allRegions = useMemo(() => {
    const regionSet = new Set<string>();
    grapes.forEach((grape) => {
      grape.majorRegions?.forEach((r) => {
        if (r.region) regionSet.add(r.region);
      });
    });
    return ['All Regions', ...Array.from(regionSet).sort()];
  }, [grapes]);

  // Filter grapes
  const filteredGrapes = useMemo(() => {
    return grapes.filter((grape) => {
      if (showEssential && !grape.isEssential) return false;
      if (selectedColor !== 'All') {
        const badge = getColorBadge(grape.color);
        if (badge.label !== selectedColor) return false;
      }
      if (selectedRegion !== 'All Regions') {
        const hasRegion = grape.majorRegions?.some(r => r.region === selectedRegion);
        if (!hasRegion) return false;
      }
      if (selectedLetter !== 'All' && !grape.name.toUpperCase().startsWith(selectedLetter)) return false;
      if (searchQuery && !grape.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [grapes, showEssential, selectedColor, selectedRegion, selectedLetter, searchQuery]);

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">Grape Guide</h1>
          <p className="mt-2 text-gray-600">
            Explore {totalGrapes} grape varieties with tasting profiles and regional origins.
          </p>
        </div>

        {/* Essential Toggle */}
        <div className="mb-6">
          <div className="inline-flex rounded-lg border-2 border-[#1C1C1C] bg-white p-1">
            <button
              onClick={() => setShowEssential(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                showEssential
                  ? 'bg-[#1C1C1C] text-white'
                  : 'text-[#1C1C1C] hover:bg-gray-100'
              }`}
            >
              Essential ({essentialCount})
            </button>
            <button
              onClick={() => setShowEssential(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !showEssential
                  ? 'bg-[#1C1C1C] text-white'
                  : 'text-[#1C1C1C] hover:bg-gray-100'
              }`}
            >
              All ({totalGrapes})
            </button>
          </div>
        </div>

        {/* Alphabetical Navigation */}
        <div className="mb-6 bg-white rounded-lg border-2 border-[#1C1C1C] p-4">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedLetter('All')}
              className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                selectedLetter === 'All'
                  ? 'bg-[#1C1C1C] text-white'
                  : 'bg-[#FAF7F2] text-[#1C1C1C] hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {ALPHABET.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                  selectedLetter === letter
                    ? 'bg-[#1C1C1C] text-white'
                    : 'bg-[#FAF7F2] text-[#1C1C1C] hover:bg-gray-200'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-[#1C1C1C] mb-1">
                Color
              </label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full border-2 border-[#1C1C1C] rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#722F37] focus:border-[#722F37]"
              >
                <option value="All">All</option>
                <option value="Red">Red</option>
                <option value="White">White</option>
                <option value="Rosé">Rosé</option>
              </select>
            </div>
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-[#1C1C1C] mb-1">
                Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full border-2 border-[#1C1C1C] rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#722F37] focus:border-[#722F37]"
              >
                {allRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-[#1C1C1C] mb-1">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name..."
                className="w-full border-2 border-[#1C1C1C] rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#722F37] focus:border-[#722F37]"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredGrapes.length} grape {filteredGrapes.length === 1 ? 'variety' : 'varieties'}
          </p>
        </div>

        {/* Grape Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGrapes.map((grape) => {
            const colorBadge = getColorBadge(grape.color);
            const flavors = grape.flavorProfile?.slice(0, 6) || [];
            const regions = grape.majorRegions?.slice(0, 4) || [];
            const aliases = grape.aliases?.slice(0, 5) || [];

            return (
              <Link
                key={grape.id}
                href={`/grapes/${grape.slug}`}
                className="block bg-white rounded-lg border-3 border-[#1C1C1C] p-6 hover:shadow-lg transition-shadow group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-serif text-2xl italic text-[#1C1C1C] group-hover:text-[#722F37] transition-colors">
                      {formatGrapeName(grape.name)}
                    </h3>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border-2 border-[#1C1C1C] ${colorBadge.bgClass} ${colorBadge.textClass}`}>
                    {colorBadge.label}
                  </span>
                </div>

                {/* Description - truncated */}
                {grape.description && (
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed line-clamp-3">
                    {grape.description}
                  </p>
                )}

                {/* Flavor Pills */}
                {flavors.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {flavors.map((f, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-[#FAF7F2] border border-[#1C1C1C]/20 text-[#1C1C1C] text-xs px-2 py-1 rounded"
                        >
                          {f.flavor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Regions */}
                {regions.length > 0 && (
                  <div className="pt-3 border-t border-[#1C1C1C]/10">
                    <p className="text-xs text-gray-500">
                      <span className="font-medium text-[#1C1C1C]">Regions:</span>{' '}
                      {regions.map(r => r.region.replace(/\s*\([^)]*\)/g, '')).join(' · ')}
                      {(grape.majorRegions?.length || 0) > 4 && (
                        <span className="text-gray-400"> +{(grape.majorRegions?.length || 0) - 4} more</span>
                      )}
                    </p>
                  </div>
                )}

                {/* Synonyms */}
                {aliases.length > 0 && (
                  <div className="pt-3 border-t border-[#1C1C1C]/10 pb-3 border-b border-[#1C1C1C]/10">
                    <p className="text-xs text-gray-500">
                      <span className="font-medium text-[#1C1C1C]">Synonyms:</span>{' '}
                      {aliases.map(a => a.alias).join(' · ')}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* No Results */}
        {filteredGrapes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border-3 border-[#1C1C1C]">
            <p className="text-gray-500 mb-3">No grape varieties match your filters.</p>
            <button
              onClick={() => {
                setShowEssential(true);
                setSelectedColor('All');
                setSelectedRegion('All Regions');
                setSelectedLetter('All');
                setSearchQuery('');
              }}
              className="text-[#722F37] hover:text-[#5a252c] font-medium"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
