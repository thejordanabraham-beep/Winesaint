/**
 * INTERACTIVE REGION EXPLORER
 *
 * Visual, hierarchical exploration of wine regions
 * Click through countries → regions → sub-regions
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getAllRegions, getSubRegions, type RegionConfig } from '@/lib/guide-config';

export default function InteractiveRegionExplorer() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const countries = getAllRegions('country');
  const regions = selectedCountry ? getSubRegions(selectedCountry) : [];
  const subRegions = selectedRegion ? getSubRegions(selectedRegion) : [];

  return (
    <div className="bg-gradient-to-br from-wine-50 to-amber-50 rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Explore Wine Regions
        </h2>
        <p className="text-gray-600">
          Navigate through the world's great wine regions
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Countries */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            Countries
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {countries.map((country) => (
              <button
                key={country.slug}
                onClick={() => {
                  setSelectedCountry(country.slug);
                  setSelectedRegion(null);
                }}
                className={`
                  w-full text-left px-4 py-3 rounded-lg transition-all
                  ${selectedCountry === country.slug
                    ? 'bg-wine-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <div className="font-semibold">{country.name}</div>
                <div className={`text-xs mt-0.5 ${
                  selectedCountry === country.slug ? 'text-wine-100' : 'text-gray-500'
                }`}>
                  {getSubRegions(country.slug).length} regions
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Regions */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="text-2xl">🍇</span>
            Regions
          </h3>
          {selectedCountry ? (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {regions.map((region) => (
                <button
                  key={region.slug}
                  onClick={() => setSelectedRegion(region.slug)}
                  className={`
                    w-full text-left px-4 py-3 rounded-lg transition-all
                    ${selectedRegion === region.slug
                      ? 'bg-wine-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="font-semibold">{region.name}</div>
                  {region.subRegions && region.subRegions.length > 0 && (
                    <div className={`text-xs mt-0.5 ${
                      selectedRegion === region.slug ? 'text-wine-100' : 'text-gray-500'
                    }`}>
                      {region.subRegions.length} sub-regions
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center text-gray-400 h-96 flex items-center justify-center">
              <p>Select a country to view regions</p>
            </div>
          )}
        </div>

        {/* Sub-regions */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="text-2xl">📍</span>
            Sub-regions
          </h3>
          {selectedRegion && subRegions.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {subRegions.map((subRegion) => (
                <Link
                  key={subRegion.slug}
                  href={`/regions/${selectedCountry}/${selectedRegion}/${subRegion.slug}`}
                  className="block px-4 py-3 bg-white rounded-lg hover:bg-wine-50 hover:border-wine-300 border border-gray-200 transition-all group"
                >
                  <div className="font-semibold text-gray-900 group-hover:text-wine-700">
                    {subRegion.name}
                  </div>
                  <div className="text-xs text-wine-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    View guide →
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center text-gray-400 h-96 flex items-center justify-center">
              <p>
                {selectedRegion
                  ? 'No sub-regions available'
                  : 'Select a region to view sub-regions'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Viewing Guide Link */}
      {selectedRegion && (
        <div className="mt-6 text-center">
          <Link
            href={`/regions/${selectedCountry}/${selectedRegion}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-wine-600 text-white font-semibold rounded-lg hover:bg-wine-700 transition-colors shadow-md"
          >
            <span>View {regions.find(r => r.slug === selectedRegion)?.name} Guide</span>
            <span>→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
