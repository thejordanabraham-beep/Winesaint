'use client';

import { useState } from 'react';
import Link from 'next/link';

const MAJOR_COUNTRIES = [
  { name: 'United States', slug: 'united-states' },
  { name: 'France', slug: 'france' },
  { name: 'Italy', slug: 'italy' },
  { name: 'Spain', slug: 'spain' },
  { name: 'Germany', slug: 'germany' },
  { name: 'Austria', slug: 'austria' },
  { name: 'Greece', slug: 'greece' },
  { name: 'Portugal', slug: 'portugal' },
  { name: 'Australia', slug: 'australia' },
  { name: 'New Zealand', slug: 'new-zealand' },
  { name: 'Argentina', slug: 'argentina' },
  { name: 'South Africa', slug: 'south-africa' },
];

export default function RegionsDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href="/regions"
        className="px-2 py-2 text-sm font-semibold uppercase tracking-wide whitespace-nowrap text-[#1C1C1C] hover:text-[#722F37] transition-colors"
      >
        Wine Region Guide
      </Link>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
          {MAJOR_COUNTRIES.map((country) => (
            <Link
              key={country.slug}
              href={`/regions/${country.slug}`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#722F37] hover:text-white transition-colors"
            >
              {country.name}
            </Link>
          ))}
          <div className="border-t border-gray-200 my-2"></div>
          <Link
            href="/regions"
            className="block px-4 py-2 text-sm font-semibold text-[#722F37] hover:bg-[#722F37] hover:text-white transition-colors"
          >
            ALL Regions
          </Link>
        </div>
      )}
    </div>
  );
}
