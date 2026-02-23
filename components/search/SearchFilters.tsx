'use client';

import { useState, useEffect, useRef } from 'react';

interface SearchFiltersProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  vintageMin: string;
  setVintageMin: (value: string) => void;
  vintageMax: string;
  setVintageMax: (value: string) => void;
  scoreMin: string;
  setScoreMin: (value: string) => void;
  scoreMax: string;
  setScoreMax: (value: string) => void;
  priceMin: string;
  setPriceMin: (value: string) => void;
  priceMax: string;
  setPriceMax: (value: string) => void;
  selectedCountries: string[];
  toggleCountry: (country: string) => void;
  clearFilters: () => void;
}

const COUNTRIES = [
  'Argentina', 'Australia', 'Austria', 'Canada', 'Chile', 'China',
  'Croatia', 'England', 'France', 'Germany', 'Italy', 'New Zealand',
  'Portugal', 'Spain', 'USA'
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => currentYear - i);
const SCORES = [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0];
const PRICES = [0, 25, 50, 75, 100, 150, 200, 300, 500, 1000, 2000];

export function SearchFilters({
  sortBy,
  setSortBy,
  vintageMin,
  setVintageMin,
  vintageMax,
  setVintageMax,
  scoreMin,
  setScoreMin,
  scoreMax,
  setScoreMax,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  selectedCountries,
  toggleCountry,
  clearFilters,
}: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    vintage: true,
    score: true,
    price: true,
    country: true,
  });
  const [countrySearch, setCountrySearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const activeFilterCount = [
    sortBy !== 'default' ? 1 : 0,
    vintageMin || vintageMax ? 1 : 0,
    scoreMin || scoreMax ? 1 : 0,
    priceMin || priceMax ? 1 : 0,
    selectedCountries.length,
  ].reduce((a, b) => a + b, 0);

  const vintageMinNum = vintageMin ? parseInt(vintageMin) : currentYear - 49;
  const vintageMaxNum = vintageMax ? parseInt(vintageMax) : currentYear;
  const scoreMinNum = scoreMin ? parseFloat(scoreMin) : 5.0;
  const scoreMaxNum = scoreMax ? parseFloat(scoreMax) : 10.0;
  const priceMinNum = priceMin ? parseInt(priceMin) : 0;
  const priceMaxNum = priceMax ? parseInt(priceMax) : 2000;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#FAF7F2] border-2 border-[#1C1C1C] hover:bg-white transition-colors"
      >
        <svg className="w-5 h-5 text-[#1C1C1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span className="font-serif text-lg italic text-[#1C1C1C]">Filters</span>
        {activeFilterCount > 0 && (
          <span className="text-xs font-sans not-italic bg-[#722F37] text-white px-2 py-0.5 rounded-full">
            {activeFilterCount}
          </span>
        )}
        <svg
          className={`w-4 h-4 text-[#1C1C1C] transition-transform ml-1 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <aside className="absolute top-full left-0 mt-2 w-80 bg-white border-2 border-[#1C1C1C] shadow-2xl z-50 max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-[#FAF7F2] border-b-2 border-[#1C1C1C] p-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl italic text-[#1C1C1C]">
                Filter Options
              </h2>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#722F37] hover:underline font-semibold uppercase tracking-wide"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="p-3">

      {/* Sort By */}
      <div className="bg-white border-2 border-[#1C1C1C] mb-3">
        <button
          onClick={() => toggleSection('sort')}
          className="w-full flex items-center justify-between p-3 hover:bg-[#FAF7F2] transition-colors"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#722F37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            <span className="text-sm font-semibold uppercase tracking-wider text-[#1C1C1C]">Sort By</span>
          </div>
          <svg
            className={`w-4 h-4 text-[#1C1C1C] transition-transform ${expandedSections.sort ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedSections.sort && (
          <div className="p-3 pt-0 border-t border-gray-200">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#722F37]"
            >
              <option value="default">Default</option>
              <option value="score">Score (High to Low)</option>
              <option value="vintage">Vintage (Newest)</option>
              <option value="price">Price (Low to High)</option>
            </select>
          </div>
        )}
      </div>

      {/* Vintage Between */}
      <div className="bg-white border-2 border-[#1C1C1C] mb-3">
        <button
          onClick={() => toggleSection('vintage')}
          className="w-full flex items-center justify-between p-3 hover:bg-[#FAF7F2] transition-colors"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#722F37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-semibold uppercase tracking-wider text-[#1C1C1C]">Vintage</span>
            {(vintageMin || vintageMax) && (
              <span className="text-xs text-[#722F37] font-normal">
                {vintageMin || currentYear - 49} - {vintageMax || currentYear}
              </span>
            )}
          </div>
          <svg
            className={`w-4 h-4 text-[#1C1C1C] transition-transform ${expandedSections.vintage ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedSections.vintage && (
          <div className="p-3 pt-0 border-t border-gray-200 space-y-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Min: {vintageMin || currentYear - 49}</label>
              <input
                type="range"
                min={currentYear - 49}
                max={currentYear}
                value={vintageMinNum}
                onChange={(e) => setVintageMin(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#722F37]"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Max: {vintageMax || currentYear}</label>
              <input
                type="range"
                min={currentYear - 49}
                max={currentYear}
                value={vintageMaxNum}
                onChange={(e) => setVintageMax(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#722F37]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Score Between */}
      <div className="bg-white border-2 border-[#1C1C1C] mb-3">
        <button
          onClick={() => toggleSection('score')}
          className="w-full flex items-center justify-between p-3 hover:bg-[#FAF7F2] transition-colors"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#722F37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-sm font-semibold uppercase tracking-wider text-[#1C1C1C]">Score</span>
            {(scoreMin || scoreMax) && (
              <span className="text-xs text-[#722F37] font-normal">
                {scoreMin || '5.0'} - {scoreMax || '10.0'}
              </span>
            )}
          </div>
          <svg
            className={`w-4 h-4 text-[#1C1C1C] transition-transform ${expandedSections.score ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedSections.score && (
          <div className="p-3 pt-0 border-t border-gray-200 space-y-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Min: {scoreMin || '5.0'}</label>
              <input
                type="range"
                min="5.0"
                max="10.0"
                step="0.5"
                value={scoreMinNum}
                onChange={(e) => setScoreMin(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#722F37]"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Max: {scoreMax || '10.0'}</label>
              <input
                type="range"
                min="5.0"
                max="10.0"
                step="0.5"
                value={scoreMaxNum}
                onChange={(e) => setScoreMax(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#722F37]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Price Between */}
      <div className="bg-white border-2 border-[#1C1C1C] mb-3">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between p-3 hover:bg-[#FAF7F2] transition-colors"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#722F37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold uppercase tracking-wider text-[#1C1C1C]">Price</span>
            {(priceMin || priceMax) && (
              <span className="text-xs text-[#722F37] font-normal">
                ${priceMin || '0'} - ${priceMax || '2000'}
              </span>
            )}
          </div>
          <svg
            className={`w-4 h-4 text-[#1C1C1C] transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedSections.price && (
          <div className="p-3 pt-0 border-t border-gray-200 space-y-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Min: ${priceMin || '0'}</label>
              <input
                type="range"
                min="0"
                max="2000"
                step="25"
                value={priceMinNum}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#722F37]"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Max: ${priceMax || '2000'}</label>
              <input
                type="range"
                min="0"
                max="2000"
                step="25"
                value={priceMaxNum}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#722F37]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Country */}
      <div className="bg-white border-2 border-[#1C1C1C] mb-3">
        <button
          onClick={() => toggleSection('country')}
          className="w-full flex items-center justify-between p-3 hover:bg-[#FAF7F2] transition-colors"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#722F37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            <span className="text-sm font-semibold uppercase tracking-wider text-[#1C1C1C]">Country</span>
            {selectedCountries.length > 0 && (
              <span className="text-xs bg-[#722F37] text-white px-1.5 py-0.5 rounded-full font-normal">
                {selectedCountries.length}
              </span>
            )}
          </div>
          <svg
            className={`w-4 h-4 text-[#1C1C1C] transition-transform ${expandedSections.country ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedSections.country && (
          <div className="p-3 pt-0 border-t border-gray-200">
            {/* Search box */}
            <input
              type="text"
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              placeholder="Search countries..."
              className="w-full border-2 border-gray-300 px-3 py-1.5 text-sm mb-2 focus:outline-none focus:border-[#722F37]"
            />
            {/* Country list */}
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {COUNTRIES.filter(country =>
                country.toLowerCase().includes(countrySearch.toLowerCase())
              ).map(country => (
                <label
                  key={country}
                  className="flex items-center gap-2 cursor-pointer hover:bg-[#FAF7F2] py-1.5 px-2 rounded transition-colors group"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(country)}
                      onChange={() => toggleCountry(country)}
                      className="w-4 h-4 border-2 border-gray-400 appearance-none checked:bg-[#722F37] checked:border-[#722F37] focus:ring-2 focus:ring-[#722F37] focus:ring-offset-0 cursor-pointer transition-colors"
                    />
                    {selectedCountries.includes(country) && (
                      <svg
                        className="w-3 h-3 text-white absolute top-0.5 left-0.5 pointer-events-none"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-[#1C1C1C]">{country}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
          </div>
        </aside>
      )}
    </div>
  );
}
