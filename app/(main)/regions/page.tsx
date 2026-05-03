import Link from 'next/link';
import { getAllCountries, getChildRegionCount } from '@/lib/payload';

export const revalidate = 3600;

// ISO 3166-1 alpha-2 country codes for flagcdn.com
const countryCodes: Record<string, string> = {
  'Albania': 'al',
  'Argentina': 'ar',
  'Australia': 'au',
  'Austria': 'at',
  'Bosnia Herzegovina': 'ba',
  'Brazil': 'br',
  'Bulgaria': 'bg',
  'Canada': 'ca',
  'Chile': 'cl',
  'Croatia': 'hr',
  'Cyprus': 'cy',
  'Czech Republic': 'cz',
  'England': 'gb-eng',
  'France': 'fr',
  'Georgia': 'ge',
  'Germany': 'de',
  'Greece': 'gr',
  'Hungary': 'hu',
  'Israel': 'il',
  'Italy': 'it',
  'Lebanon': 'lb',
  'Luxembourg': 'lu',
  'Mexico': 'mx',
  'Moldova': 'md',
  'Montenegro': 'me',
  'Morocco': 'ma',
  'New Zealand': 'nz',
  'North Macedonia': 'mk',
  'Portugal': 'pt',
  'Romania': 'ro',
  'Serbia': 'rs',
  'Slovakia': 'sk',
  'Slovenia': 'si',
  'South Africa': 'za',
  'Spain': 'es',
  'Switzerland': 'ch',
  'Turkey': 'tr',
  'Ukraine': 'ua',
  'United States': 'us',
  'Uruguay': 'uy',
};

function getFlagUrl(countryName: string): string {
  const code = countryCodes[countryName];
  if (code) {
    return `https://flagcdn.com/w640/${code}.png`;
  }
  return '';
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
          {countriesWithCounts.map((country) => {
            const flagUrl = getFlagUrl(country.name);
            return (
              <Link
                key={country.id}
                href={`/regions/${country.fullSlug}`}
                className="bg-white rounded-lg border-2 border-[#1C1C1C] overflow-hidden hover:shadow-lg hover:border-[#722F37] transition-all group"
              >
                {/* Flag Section - full width image */}
                <div className="h-28 relative overflow-hidden">
                  {flagUrl ? (
                    <img
                      src={flagUrl}
                      alt={`${country.name} flag`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#FAF7F2] flex items-center justify-center">
                      <span className="text-4xl">🍷</span>
                    </div>
                  )}
                </div>
                {/* Info Section */}
                <div className="p-4 border-t-2 border-[#1C1C1C]">
                  <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37] transition-colors">
                    {country.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {country.regionCount} {country.regionCount === 1 ? 'region' : 'regions'}
                  </p>
                </div>
              </Link>
            );
          })}
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
