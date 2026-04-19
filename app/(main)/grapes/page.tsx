'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { applyGrapeOverrides } from '@/app/(main)/utils/grapeOverrides';

// Create URL slug from grape name
const createSlug = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

// Wine-appropriate color badges
const getColorBadge = (berryColor: string) => {
  const color = berryColor.toLowerCase();
  if (color.includes('black') || color.includes('red') || color.includes('blue')) {
    return { label: 'Red', bgClass: 'bg-[#722F37]', textClass: 'text-white' };
  }
  if (color.includes('white') || color.includes('green') || color.includes('yellow')) {
    return { label: 'White', bgClass: 'bg-[#E8DFD0]', textClass: 'text-[#1C1C1C]' };
  }
  if (color.includes('pink') || color.includes('grey') || color.includes('gray')) {
    return { label: 'Rosé', bgClass: 'bg-[#E8B4B8]', textClass: 'text-[#1C1C1C]' };
  }
  return { label: 'White', bgClass: 'bg-[#E8DFD0]', textClass: 'text-[#1C1C1C]' };
};

// Format grape name to title case
const formatGrapeName = (name: string) => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Parse and clean flavors - handles malformed data with newlines/dashes in single entries
const parseFlavors = (rawFlavors: string[]): string[] => {
  const cleaned: string[] = [];
  for (const item of rawFlavors) {
    // Split on newlines first, then clean each part
    const parts = item.split(/\n/).map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      // Remove leading dashes/bullets
      const clean = part.replace(/^[-–—•]\s*/, '').trim();
      if (clean && clean.length < 50) { // Skip overly long entries
        cleaned.push(clean);
      }
    }
  }
  return cleaned;
};

// Alphabet for A-Z filter
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function GrapesPage() {
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
      if (showEssential && !grape.is_essential) return false;
      if (selectedColor !== 'All') {
        const badge = getColorBadge(grape.berry_color);
        if (badge.label !== selectedColor) return false;
      }
      if (selectedRegion !== 'All Regions' && !grape.level_1.major_regions?.includes(selectedRegion)) return false;
      if (selectedLetter !== 'All' && !grape.name.toUpperCase().startsWith(selectedLetter)) return false;
      if (searchQuery && !grape.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [grapesData, showEssential, selectedColor, selectedRegion, selectedLetter, searchQuery]);

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">Grape Guide</h1>
          <p className="mt-2 text-gray-600">
            Explore {grapesData.total_grapes} grape varieties with tasting profiles and regional origins.
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
              Essential ({grapesData.essential_grapes})
            </button>
            <button
              onClick={() => setShowEssential(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !showEssential
                  ? 'bg-[#1C1C1C] text-white'
                  : 'text-[#1C1C1C] hover:bg-gray-100'
              }`}
            >
              All ({grapesData.total_grapes})
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
          {filteredGrapes.map((grape: any) => {
            const colorBadge = getColorBadge(grape.berry_color);
            const flavors = parseFlavors(grape.level_1.typical_flavors || []).slice(0, 6);
            const regions = (grape.level_1.major_regions || []).slice(0, 4);

            return (
              <Link
                key={grape.id}
                href={`/grapes/${createSlug(grape.name)}`}
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
                <p className="text-sm text-gray-700 mb-4 leading-relaxed line-clamp-3">
                  {grape.level_1.description}
                </p>

                {/* Flavor Pills */}
                {flavors.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {flavors.map((flavor: string, idx: number) => (
                        <span
                          key={idx}
                          className="inline-block bg-[#FAF7F2] border border-[#1C1C1C]/20 text-[#1C1C1C] text-xs px-2 py-1 rounded"
                        >
                          {flavor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Characteristics */}
                {grape.level_1.key_characteristics && grape.level_1.key_characteristics.length > 0 && (
                  <div className="pt-3 border-t border-[#1C1C1C]/10">
                    <p className="text-xs font-medium text-[#1C1C1C] mb-2">Key Characteristics</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {grape.level_1.key_characteristics.slice(0, 4).map((char: string, idx: number) => (
                        <li key={idx}>• {char}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Regions */}
                {regions.length > 0 && (
                  <div className="pt-3 mt-3 border-t border-[#1C1C1C]/10">
                    <p className="text-xs text-gray-500">
                      <span className="font-medium text-[#1C1C1C]">Regions:</span>{' '}
                      {regions.map((r: string) => r.replace(/\s*\([^)]*\)/g, '')).join(' · ')}
                      {(grape.level_1.major_regions || []).length > 4 && (
                        <span className="text-gray-400"> +{grape.level_1.major_regions.length - 4} more</span>
                      )}
                    </p>
                  </div>
                )}

                {/* Synonyms */}
                {grape.principal_synonyms && (
                  <div className="pt-3 border-t border-[#1C1C1C]/10 pb-3 border-b border-[#1C1C1C]/10">
                    <p className="text-xs text-gray-500">
                      <span className="font-medium text-[#1C1C1C]">Synonyms:</span>{' '}
                      {grape.principal_synonyms.split(',').slice(0, 5).map((s: string) => s.trim()).join(' · ')}
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
