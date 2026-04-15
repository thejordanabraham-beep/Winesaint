import Link from 'next/link';
import { getAllCountries, getChildRegionCount } from '@/lib/payload';

export const dynamic = 'force-dynamic';

export default async function WineRegionGuidePage() {
  const countries = await getAllCountries();

  // Get region counts for each country
  const countriesWithCounts = await Promise.all(
    countries.map(async (country) => ({
      ...country,
      regionCount: await getChildRegionCount(country.id)
    }))
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Wine Region Guide</h1>
          <p className="mt-2 text-gray-600">
            Explore the world's wine regions from {countries.length} countries.
            Discover terroir, climate, grape varieties, and the unique characteristics that define each region.
          </p>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {countries.length} countries
          </p>
        </div>

        {/* Country Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {countriesWithCounts.map((country) => (
            <Link
              key={country.id}
              href={`/regions/${country.fullSlug}`}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-[#722F37] transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#722F37] transition-colors">
                  {country.name}
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

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {country.regionCount} wine {country.regionCount === 1 ? 'region' : 'regions'}
                </p>

                {country.description && (
                  <p className="text-xs text-gray-500 line-clamp-3">
                    {country.description.substring(0, 150)}...
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center text-sm font-medium text-[#722F37] group-hover:underline">
                Explore regions
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {countries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No countries found. Check that the database is connected.</p>
          </div>
        )}
      </div>
    </div>
  );
}
