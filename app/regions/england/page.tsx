'use client';

import Breadcrumb from '@/components/Breadcrumb';
import RegionSidebar from '@/components/RegionSidebar';

const ENGLAND_MAJOR_REGIONS = [
  { name: 'Sussex', slug: 'sussex' },
  { name: 'Kent', slug: 'kent' },
  { name: 'Hampshire', slug: 'hampshire' },
];

export default function EnglandPage() {
  const breadcrumbItems = [
    { name: 'Wine Region Guide', href: '/regions' },
    { name: 'England', href: '/regions/england' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex gap-8">
          <RegionSidebar
            title="Major Wine Regions"
            regions={ENGLAND_MAJOR_REGIONS}
            basePath="/regions/england"
          />

          <main className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">England</h1>
                <p className="text-lg text-gray-600">
                  World-class sparkling wines from chalk soils
                </p>
              </div>

              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Overview</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  England has emerged as a serious producer of sparkling wine, particularly in the southern counties
                  where chalk soils similar to Champagne create ideal conditions. Climate change has extended the
                  growing season, enabling production of world-class sparkling wines.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Wine Regions</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sussex, Kent, and Hampshire lead production with Champagne varieties (Chardonnay, Pinot Noir,
                  Pinot Meunier) crafted into elegant sparkling wines that rival their French counterparts.
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
