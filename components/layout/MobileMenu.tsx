'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MAP_SECTIONS } from '@/lib/constants';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { href: '/regions', label: 'Wine Region Guide' },
  { href: '/grapes', label: 'Grape Guide' },
  { href: '/vintages', label: 'Vintage Chart' },
  { href: '/chat', label: 'François AI' },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mapExpanded, setMapExpanded] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/search');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden py-4 border-t border-[#1C1C1C]/10">
      {/* Mobile Search */}
      <form onSubmit={handleSearch} className="flex mb-4 px-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for..."
          className="flex-1 px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:border-[#722F37]"
        />
        <button type="submit" className="px-3 py-2 bg-[#722F37] text-white">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      <div className="space-y-1">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block px-4 py-3 text-base font-semibold uppercase tracking-wider text-[#1C1C1C] hover:bg-[#722F37]/10 hover:text-[#722F37] rounded transition-colors"
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}

        {/* Mobile Maps Accordion */}
        <div>
          <button
            onClick={() => setMapExpanded(!mapExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold uppercase tracking-wider text-[#1C1C1C] hover:bg-[#722F37]/10 hover:text-[#722F37] rounded transition-colors"
          >
            Maps
            <svg
              className={`w-4 h-4 transition-transform ${mapExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mapExpanded && (
            <div className="pl-4 border-l-2 border-[#722F37]/20 ml-4 mt-1 space-y-1">
              {MAP_SECTIONS.map((section, sectionIndex) => (
                <div key={section.title}>
                  {sectionIndex > 0 && <div className="border-t border-gray-200 my-2" />}
                  <div className="px-4 py-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                    {section.title}
                  </div>
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block ${link.indent ? 'px-6 py-1.5 text-xs text-gray-500' : 'px-4 py-2 text-sm text-[#1C1C1C]'} hover:text-[#722F37] transition-colors`}
                      onClick={onClose}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
