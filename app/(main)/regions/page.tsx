import Link from 'next/link';
import { getAllCountries, getChildRegionCount } from '@/lib/payload';

export const revalidate = 3600;

// Country code to flag emoji mapping
const countryFlags: Record<string, string> = {
  'Albania': '🇦🇱',
  'Argentina': '🇦🇷',
  'Australia': '🇦🇺',
  'Austria': '🇦🇹',
  'Bosnia Herzegovina': '🇧🇦',
  'Brazil': '🇧🇷',
  'Bulgaria': '🇧🇬',
  'Canada': '🇨🇦',
  'Chile': '🇨🇱',
  'Croatia': '🇭🇷',
  'Cyprus': '🇨🇾',
  'Czech Republic': '🇨🇿',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'France': '🇫🇷',
  'Georgia': '🇬🇪',
  'Germany': '🇩🇪',
  'Greece': '🇬🇷',
  'Hungary': '🇭🇺',
  'Israel': '🇮🇱',
  'Italy': '🇮🇹',
  'Lebanon': '🇱🇧',
  'Luxembourg': '🇱🇺',
  'Mexico': '🇲🇽',
  'Moldova': '🇲🇩',
  'Montenegro': '🇲🇪',
  'Morocco': '🇲🇦',
  'New Zealand': '🇳🇿',
  'North Macedonia': '🇲🇰',
  'Portugal': '🇵🇹',
  'Romania': '🇷🇴',
  'Serbia': '🇷🇸',
  'Slovakia': '🇸🇰',
  'Slovenia': '🇸🇮',
  'South Africa': '🇿🇦',
  'Spain': '🇪🇸',
  'Switzerland': '🇨🇭',
  'Turkey': '🇹🇷',
  'Ukraine': '🇺🇦',
  'United States': '🇺🇸',
  'Uruguay': '🇺🇾',
};

function getFlag(countryName: string): string {
  return countryFlags[countryName] || '🍷';
}

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
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-serif text-3xl italic text-gray-900">Wine Region Guide</h1>
          <p className="mt-2 text-gray-600">
            Explore our collection of wine regions from {countries.length} countries.
          </p>
        </div>

        {/* Country Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {countriesWithCounts.map((country) => (
            <Link
              key={country.id}
              href={`/regions/${country.fullSlug}`}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-[#722F37]/50 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-serif text-lg italic text-gray-900 group-hover:text-[#722F37] transition-colors">
                    {country.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {country.regionCount} {country.regionCount === 1 ? 'region' : 'regions'}
                  </p>
                </div>
                <span className="text-3xl ml-3" role="img" aria-label={`${country.name} flag`}>
                  {getFlag(country.name)}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {countries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No countries found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
