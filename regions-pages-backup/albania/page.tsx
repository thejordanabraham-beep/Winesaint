'use client';

import Breadcrumb from '@/components/Breadcrumb';
import RegionSidebar from '@/components/RegionSidebar';

const ALBANIA_MAJOR_REGIONS = [
  { name: 'Wine Region', slug: 'wine-region' },
];

export default function AlbaniaPage() {
  const breadcrumbItems = [
    { name: 'Wine Region Guide', href: '/regions' },
    { name: 'Albania', href: '/regions/albania' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex gap-8">
          <RegionSidebar
            title="Major Wine Regions"
            regions={ALBANIA_MAJOR_REGIONS}
            basePath="/regions/albania"
          />

          <main className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Albania</h1>
                <p className="text-lg text-gray-600">
                  Rediscovering ancient wine traditions
                </p>
              </div>

              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Overview</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Wine region information for Albania.
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
