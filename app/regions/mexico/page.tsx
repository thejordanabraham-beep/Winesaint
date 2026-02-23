'use client';

import Breadcrumb from '@/components/Breadcrumb';
import RegionSidebar from '@/components/RegionSidebar';

const MEXICO_MAJOR_REGIONS = [
  { name: 'Valle de Guadalupe', slug: 'valle-de-guadalupe' },
  { name: 'Baja California', slug: 'baja-california' },
];

export default function MexicoPage() {
  const breadcrumbItems = [
    { name: 'Wine Region Guide', href: '/regions' },
    { name: 'Mexico', href: '/regions/mexico' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex gap-8">
          <RegionSidebar
            title="Major Wine Regions"
            regions={MEXICO_MAJOR_REGIONS}
            basePath="/regions/mexico"
          />

          <main className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Mexico</h1>
                <p className="text-lg text-gray-600">
                  Emerging wine region with Mediterranean-style climate
                </p>
              </div>

              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Overview</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Mexico's wine industry, centered in Baja California, is experiencing a renaissance. The Valle
                  de Guadalupe has become one of the most exciting emerging wine regions in the Americas, producing
                  innovative wines with a distinctive Mexican character.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Wine Regions</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Valle de Guadalupe's Mediterranean climate and diverse soils create ideal conditions for both
                  international and Spanish varieties. The region combines modern winemaking techniques with
                  local ingredients and traditions, creating a unique wine culture.
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
