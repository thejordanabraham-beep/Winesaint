'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MapsDropdown } from './MapsDropdown';
import { MobileMenu } from './MobileMenu';
import RegionsDropdown from './RegionsDropdown';

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    } else {
      router.push('/search');
    }
  };

  return (
    <header className="bg-[#FAF7F2] border-b-3 border-[#1C1C1C]">
      {/* Announcement bar - Scrolling Wine of the Day */}
      <div className="bg-[#722F37] text-white py-2 text-sm font-medium overflow-hidden relative h-8 flex items-center">
        <div className="scroll-text whitespace-nowrap absolute">
          Wine of the Day: 2021 Weingut Clemens Busch Marienburg Fahrlay Riesling Grosses Gewächs, Mosel, Germany
        </div>
      </div>

      {/* Main header */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Left Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-0 flex-1 justify-start">
            <RegionsDropdown />
            <span className="text-gray-400 px-1">•</span>
            <Link
              href="/grapes"
              className="px-2 py-2 text-sm font-semibold uppercase tracking-wide whitespace-nowrap text-[#1C1C1C] hover:text-[#722F37] transition-colors"
            >
              Grape Guide
            </Link>
            <span className="text-gray-400 px-1">•</span>
            <Link
              href="/search"
              className="px-2 py-2 text-sm font-semibold uppercase tracking-wide whitespace-nowrap text-[#1C1C1C] hover:text-[#722F37] transition-colors"
            >
              Wine Reviews
            </Link>
            <span className="text-gray-400 px-1">•</span>
            <MapsDropdown />
          </div>

          {/* Logo - Centered */}
          <Link href="/" className="group absolute left-1/2 transform -translate-x-1/2">
            <span className="font-serif text-3xl italic text-[#1C1C1C] group-hover:text-[#722F37] transition-colors whitespace-nowrap">
              WineSaint
            </span>
          </Link>

          {/* Right Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-0 flex-1 justify-end">
            <Link
              href="/vintages"
              className="px-2 py-2 text-sm font-semibold uppercase tracking-wide whitespace-nowrap text-[#1C1C1C] hover:text-[#722F37] transition-colors"
            >
              Vintage Chart
            </Link>
            <span className="text-gray-400 px-1">•</span>
            <Link
              href="/learn"
              className="px-2 py-2 text-sm font-semibold uppercase tracking-wide whitespace-nowrap text-[#1C1C1C] hover:text-[#722F37] transition-colors"
            >
              Education
            </Link>
            <span className="text-gray-400 px-1">•</span>
            <Link
              href="/chat"
              className="px-2 py-2 text-sm font-semibold uppercase tracking-wide whitespace-nowrap text-[#1C1C1C] hover:text-[#722F37] transition-colors flex items-center gap-1"
            >
              <span>François</span>
              <span className="text-xs bg-[#722F37] text-white px-1.5 py-0.5 rounded-full">AI</span>
            </Link>
            <span className="text-gray-400 px-1">•</span>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="ml-2 px-3 py-2 bg-[#722F37] text-white hover:bg-[#A64253] transition-colors rounded flex items-center gap-1.5"
              aria-label="Search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wide">Search</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1C1C1C]"
            >
              <span className="sr-only">Open menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Desktop Search Bar */}
        {searchOpen && (
          <div className="hidden md:block pb-4 border-t-2 border-[#1C1C1C]/10 pt-4 mt-2">
            <form onSubmit={handleSearch} className="flex items-center max-w-2xl mx-auto">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search wines, producers, regions..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#722F37] rounded-lg text-sm focus:outline-none focus:border-[#722F37] placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                className="ml-3 px-6 py-3 bg-[#722F37] text-white rounded-lg hover:bg-[#A64253] transition-colors text-sm font-semibold"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="ml-2 px-3 py-3 text-gray-500 hover:text-[#1C1C1C] transition-colors"
                aria-label="Close search"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      </nav>
    </header>
  );
}
