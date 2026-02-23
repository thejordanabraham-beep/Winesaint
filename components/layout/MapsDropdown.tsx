'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { MAP_SECTIONS } from '@/lib/constants';

export function MapsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="px-2 py-2 text-sm font-semibold uppercase tracking-wide whitespace-nowrap text-[#1C1C1C] hover:text-[#722F37] transition-colors flex items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        Maps
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-2">
            {MAP_SECTIONS.map((section, sectionIndex) => (
              <div key={section.title}>
                {sectionIndex > 0 && <div className="border-t border-gray-100 my-2" />}
                <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                  {section.title}
                </div>
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block ${link.indent ? 'px-6 py-1.5 text-xs text-gray-500' : 'px-4 py-2 text-sm text-[#1C1C1C]'} hover:bg-[#722F37]/10 hover:text-[#722F37] transition-colors`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
