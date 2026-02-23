'use client';

import Breadcrumb from '@/components/Breadcrumb';
import RegionSidebar from '@/components/RegionSidebar';

const CANADA_MAJOR_REGIONS = [
  { name: 'Okanagan Valley', slug: 'okanagan-valley' },
  { name: 'Niagara Peninsula', slug: 'niagara-peninsula' },
  { name: 'British Columbia', slug: 'british-columbia' },
  { name: 'Ontario', slug: 'ontario' },
];

export default function CanadaPage() {
  const breadcrumbItems = [
    { name: 'Wine Region Guide', href: '/regions' },
    { name: 'Canada', href: '/regions/canada' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex gap-8">
          <RegionSidebar
            title="Major Wine Regions"
            regions={CANADA_MAJOR_REGIONS}
            basePath="/regions/canada"
          />

          <main className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Canada</h1>
                <p className="text-lg text-gray-600">
                  Cool-climate excellence and world-renowned ice wines
                </p>
              </div>

              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Overview</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Canada has established itself as a premium cool-climate wine producer, particularly famous for
                  its ice wines. The Okanagan Valley in British Columbia and Niagara Peninsula in Ontario produce
                  exceptional wines that combine European elegance with New World fruit expression.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Wine Regions</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The Okanagan Valley benefits from a unique desert-like climate moderated by lakes, producing
                  outstanding Pinot Noir and aromatic whites. Niagara Peninsula's moderating influence from
                  Lake Ontario creates ideal conditions for ice wine production alongside excellent table wines.
                </p>

                <div className="mt-12 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 text-center italic">
                    Additional content to be added
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
