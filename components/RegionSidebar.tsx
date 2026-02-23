'use client';

import { useState } from 'react';
import Link from 'next/link';

interface RegionLink {
  name: string;
  slug: string;
  children?: RegionLink[];
}

interface RegionSidebarProps {
  title: string;
  regions: RegionLink[];
  basePath: string;
}

export default function RegionSidebar({ title, regions, basePath }: RegionSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-64'}`}>
      <div className="sticky top-8">
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full bg-[#722F37] text-white p-2 rounded-t-lg flex items-center justify-center hover:bg-[#d32f3c] transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>

        {/* Sidebar Content */}
        {!isCollapsed && (
          <div className="bg-white border border-gray-200 rounded-b-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 uppercase tracking-wide text-sm">
                {title}
              </h3>
            </div>

            <nav className="p-2">
              <ul className="space-y-1">
                {regions.map((region) => (
                  <li key={region.slug}>
                    <Link
                      href={`${basePath}/${region.slug}`}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-[#722F37] hover:text-white rounded transition-colors"
                    >
                      {region.name}
                    </Link>

                    {/* Sub-regions */}
                    {region.children && region.children.length > 0 && (
                      <ul className="ml-4 mt-1 space-y-1">
                        {region.children.map((child) => (
                          <li key={child.slug}>
                            <Link
                              href={`${basePath}/${region.slug}/${child.slug}`}
                              className="block px-3 py-1.5 text-xs text-gray-600 hover:bg-[#722F37]/10 hover:text-[#722F37] rounded transition-colors"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
}
