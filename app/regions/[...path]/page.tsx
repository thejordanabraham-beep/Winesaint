'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import regionsData from '../../data/regions_hierarchical.json';
import type { RegionsHierarchical, PageData, BreadcrumbItem, Region } from '@/types/regions';

export default function RegionPage() {
  const params = useParams();
  const path = Array.isArray(params.path) ? params.path : [params.path];

  // Find the current region/country data
  const pageData = useMemo((): PageData => {
    if (path.length === 0) return null;

    const countrySlug = path[0];
    if (!countrySlug) return null;
    const typedData = regionsData as unknown as RegionsHierarchical;
    const country = typedData.countries[countrySlug];

    if (!country) return null;

    // If just country
    if (path.length === 1) {
      return {
        type: 'country',
        name: country.name,
        slug: countrySlug,
        overview: country.overview,
        regions: Object.values(country.regions),
        breadcrumb: [
          { name: 'Wine Region Guide', href: '/regions' },
          { name: country.name, href: `/regions/${countrySlug}` }
        ]
      };
    }

    // Navigate through the hierarchy
    let current: Region | undefined = undefined;
    let breadcrumb: BreadcrumbItem[] = [
      { name: 'Wine Region Guide', href: '/regions' },
      { name: country.name, href: `/regions/${countrySlug}` }
    ];

    // Find the region in the hierarchy
    for (let i = 1; i < path.length; i++) {
      const slug = path[i];
      if (!slug) continue;

      if (i === 1) {
        // Top-level region
        current = country.regions[slug];
      } else {
        // Sub-region - search in current's children
        if (current && current.children) {
          current = current.children.find((child: Region) => child.slug === slug);
        }
      }

      if (!current) return null;

      breadcrumb.push({
        name: current.name,
        href: `/regions/${path.slice(0, i + 1).join('/')}`
      });
    }

    if (!current) return null;

    return {
      type: 'region',
      ...current,
      breadcrumb
    };
  }, [path]);

  if (!pageData) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Region Not Found</h1>
            <p className="text-gray-600 mb-4">The wine region you're looking for doesn't exist.</p>
            <Link href="/regions" className="text-[#722F37] hover:underline font-semibold">
              Return to Wine Region Guide
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb items={pageData.breadcrumb} />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{pageData.name}</h1>
          {pageData.type === 'country' && (
            <p className="mt-2 text-gray-600">
              Explore {pageData.regions.length} wine regions in {pageData.name}
            </p>
          )}
          {pageData.type === 'region' && pageData.hierarchy_level && (
            <p className="mt-2 text-sm text-gray-500 capitalize">
              {pageData.hierarchy_level}
            </p>
          )}
        </div>

        {/* Overview Content */}
        {pageData.overview && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Overview</h2>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
              {pageData.overview.substring(0, 1000)}
              {pageData.overview.length > 1000 && '...'}
            </div>
          </div>
        )}

        {/* Region Info (for non-country pages) */}
        {pageData.type === 'region' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Grapes */}
            {pageData.grapes && pageData.grapes.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                  Key Grapes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {pageData.grapes.slice(0, 10).map((grape: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-block bg-[#722F37]/10 text-[#722F37] text-xs px-2 py-1 rounded"
                    >
                      {grape}
                    </span>
                  ))}
                  {pageData.grapes.length > 10 && (
                    <span className="text-xs text-gray-500">
                      +{pageData.grapes.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Climate */}
            {pageData.content?.climate && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                  Climate
                </h3>
                <p className="text-sm text-gray-700">{pageData.content.climate}</p>
              </div>
            )}

            {/* Soil */}
            {pageData.content?.soil && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                  Soil
                </h3>
                <p className="text-sm text-gray-700">{pageData.content.soil}</p>
              </div>
            )}
          </div>
        )}

        {/* Sub-regions / Children */}
        {((pageData.type === 'country' && pageData.regions.length > 0) ||
          (pageData.type === 'region' && pageData.children && pageData.children.length > 0)) && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {pageData.type === 'country' ? 'Wine Regions' : 'Sub-Regions'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(pageData.type === 'country' ? pageData.regions : pageData.children || []).map(
                (region: Region) => {
                  const regionPath = pageData.type === 'country'
                    ? `/regions/${path[0]}/${region.slug}`
                    : `/regions/${path.join('/')}/${region.slug}`;

                  return (
                    <Link
                      key={region.slug}
                      href={regionPath}
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-[#722F37] transition-all group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#722F37] transition-colors">
                          {region.name}
                        </h3>
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-[#722F37] transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>

                      {region.hierarchy_level && (
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                          {region.hierarchy_level}
                        </p>
                      )}

                      {region.content?.overview && (
                        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                          {region.content.overview.substring(0, 150)}...
                        </p>
                      )}

                      {region.grapes && region.grapes.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-gray-700 mb-1">Key Grapes:</p>
                          <div className="flex flex-wrap gap-1">
                            {region.grapes.slice(0, 3).map((grape: string, idx: number) => (
                              <span
                                key={idx}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                              >
                                {grape}
                              </span>
                            ))}
                            {region.grapes.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{region.grapes.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {region.children && region.children.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            {region.children.length} sub-region{region.children.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      )}

                      {region.subregions && region.subregions.length > 0 && !region.children && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            {region.subregions.length} sub-region{region.subregions.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      )}
                    </Link>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* No children message */}
        {pageData.type === 'region' && (!pageData.children || pageData.children.length === 0) && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600">
              This is a detailed region page. More information coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
