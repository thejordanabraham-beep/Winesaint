'use client';

import { useState } from 'react';
import Link from 'next/link';

const RESOURCES = [
  { name: 'Oak Guide', slug: 'oak' },
  { name: 'Glassware Guide', slug: 'glassware' },
  { name: 'Rootstock Guide', slug: 'rootstock' },
  { name: 'Glossary', slug: 'glossary' },
];

export default function ResourcesDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="px-2 py-2 text-sm font-semibold uppercase tracking-wide whitespace-nowrap text-[#1C1C1C] hover:text-[#722F37] transition-colors"
      >
        Resources
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
          {RESOURCES.map((resource) => (
            <Link
              key={resource.slug}
              href={`/resources/${resource.slug}`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#722F37] hover:text-white transition-colors"
            >
              {resource.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
