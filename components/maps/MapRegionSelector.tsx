'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

const COUNTRY_GROUPS = [
  {
    label: 'Europe',
    countries: [
      { name: 'France', slug: 'france', flag: '🇫🇷', path: 'europe/france' },
      { name: 'Italy', slug: 'italy', flag: '🇮🇹', path: 'italy' },
      { name: 'Spain', slug: 'spain', flag: '🇪🇸', path: 'spain' },
      { name: 'Germany', slug: 'germany', flag: '🇩🇪', path: 'germany' },
      { name: 'Portugal', slug: 'portugal', flag: '🇵🇹', path: 'portugal' },
    ],
  },
  {
    label: 'Americas',
    countries: [
      { name: 'United States', slug: 'united-states', flag: '🇺🇸', path: 'united-states' },
      { name: 'Argentina', slug: 'argentina', flag: '🇦🇷', path: 'argentina' },
      { name: 'Chile', slug: 'chile', flag: '🇨🇱', path: 'chile' },
    ],
  },
  {
    label: 'Oceania',
    countries: [
      { name: 'Australia', slug: 'australia', flag: '🇦🇺', path: 'australia' },
      { name: 'New Zealand', slug: 'new-zealand', flag: '🇳🇿', path: 'new-zealand' },
    ],
  },
];

export default function MapRegionSelector() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Determine active country
  const activeCountry = COUNTRY_GROUPS.flatMap(g => g.countries).find(c =>
    pathname.includes(`/${c.slug}`) || pathname.includes(`/${c.path}`)
  );

  return (
    <div ref={ref} className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md flex items-center gap-2 hover:bg-white transition-colors"
      >
        <span className="text-lg">{activeCountry?.flag ?? '🌍'}</span>
        <span className="text-sm font-medium text-[#1C1C1C]">
          {activeCountry?.name ?? 'Select Region'}
        </span>
        <svg
          className={`w-4 h-4 text-[#1C1C1C] transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-1 w-52 bg-white/98 backdrop-blur-sm rounded-lg shadow-lg border border-[#1C1C1C]/10 overflow-hidden">
          {COUNTRY_GROUPS.map((group, gi) => (
            <div key={group.label}>
              {gi > 0 && <div className="h-px bg-[#1C1C1C]/10" />}
              <div className="px-3 py-1.5 text-[10px] font-semibold text-[#1C1C1C]/50 uppercase tracking-wider">
                {group.label}
              </div>
              {group.countries.map(country => {
                const isActive = pathname.includes(`/${country.slug}`) ||
                  pathname.includes(`/${country.path}`);
                return (
                  <Link
                    key={country.slug}
                    href={`/maps/${country.path}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-[#FAF7F2] ${
                      isActive ? 'bg-[#FAF7F2] text-[#722F37] font-medium' : 'text-[#1C1C1C]'
                    }`}
                  >
                    <span className="text-base">{country.flag}</span>
                    <span>{country.name}</span>
                    {isActive && (
                      <svg className="w-3 h-3 ml-auto text-[#722F37]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
