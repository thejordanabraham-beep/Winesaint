import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { ScoreBadge } from '@/components/ui/ScoreBadge';

// Demo data - replace with Sanity fetch
const demoReports: Record<string, Record<string, any>> = {
  bordeaux: {
    '2022': {
      _id: 'vr1',
      year: 2022,
      overview: 'An exceptional vintage marked by ideal growing conditions and concentrated, age-worthy wines. The 2022 growing season in Bordeaux was characterized by a warm, dry summer following a mild spring. Early concerns about frost in April were quickly forgotten as temperatures rose and remained consistently warm through harvest. The wines show remarkable concentration and depth, with ripe tannins and excellent acidity that promise decades of aging potential.',
      conditionsNotes: 'The winter was mild with adequate rainfall, replenishing water reserves. Spring brought some frost concerns in early April, but damage was minimal. Summer was hot and dry, with several heat waves in July and August. Light rain in September before harvest helped freshen the vines without causing rot issues. Harvest began early, in mid-September for most properties.',
      overallRating: 'outstanding',
      region: {
        name: 'Bordeaux',
        slug: 'bordeaux',
        country: 'France',
        description: 'The world\'s most famous wine region, producing both red and white wines of exceptional quality from the Left and Right Banks of the Gironde estuary.',
      },
      featuredWines: [
        { name: 'Château Margaux', slug: 'chateau-margaux-2022', vintage: 2022, producer: { name: 'Château Margaux' }, score: 98 },
        { name: 'Château Latour', slug: 'chateau-latour-2022', vintage: 2022, producer: { name: 'Château Latour' }, score: 97 },
        { name: 'Château Haut-Brion', slug: 'chateau-haut-brion-2022', vintage: 2022, producer: { name: 'Château Haut-Brion' }, score: 97 },
        { name: 'Pétrus', slug: 'petrus-2022', vintage: 2022, producer: { name: 'Pétrus' }, score: 99 },
      ],
    },
  },
  burgundy: {
    '2021': {
      _id: 'vr2',
      year: 2021,
      overview: 'A classic vintage with elegant wines showing great balance and freshness. The 2021 vintage in Burgundy was challenging, requiring meticulous work in the vineyard. Late spring frost significantly reduced yields, but the surviving fruit benefited from a cooler, longer growing season. The resulting wines are more restrained than recent warm vintages, with bright acidity and classic Burgundian elegance.',
      conditionsNotes: 'Severe frost in April caused significant crop loss across the region. A cool, wet spring delayed flowering. Summer was mild with periodic rainfall. September brought warm, sunny weather that allowed fruit to ripen fully while retaining freshness.',
      overallRating: 'excellent',
      region: {
        name: 'Burgundy',
        slug: 'burgundy',
        country: 'France',
        description: 'Historic wine region producing world-renowned Pinot Noir and Chardonnay wines from meticulously classified vineyards.',
      },
      featuredWines: [
        { name: 'Romanée-Conti', slug: 'romanee-conti-2021', vintage: 2021, producer: { name: 'DRC' }, score: 98 },
        { name: 'La Tâche', slug: 'la-tache-2021', vintage: 2021, producer: { name: 'DRC' }, score: 97 },
        { name: 'Musigny', slug: 'musigny-2021', vintage: 2021, producer: { name: 'Comte de Vogüé' }, score: 96 },
      ],
    },
  },
};

interface PageProps {
  params: Promise<{ region: string; year: string }>;
}

export default async function VintageDetailPage({ params }: PageProps) {
  const { region, year } = await params;
  const report = demoReports[region]?.[year];

  if (!report) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-red-200">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/vintages" className="hover:text-white">
                  Vintages
                </Link>
              </li>
              <li>/</li>
              <li className="text-white">
                {report.region.name} {report.year}
              </li>
            </ol>
          </nav>

          <div className="flex items-center gap-6">
            <div className="text-6xl font-bold">{report.year}</div>
            <div>
              <h1 className="text-3xl font-bold">{report.region.name}</h1>
              <p className="text-red-100 mt-1">{report.region.country}</p>
            </div>
            <div className="ml-auto">
              <RatingBadge rating={report.overallRating} />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Vintage Overview</h2>
              <p className="text-gray-700 leading-relaxed">{report.overview}</p>
            </div>

            {/* Growing Conditions */}
            {report.conditionsNotes && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Growing Conditions</h2>
                <p className="text-gray-700 leading-relaxed">{report.conditionsNotes}</p>
              </div>
            )}

            {/* Featured Wines */}
            {report.featuredWines && report.featuredWines.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Wines from {report.year}</h2>
                <div className="space-y-4">
                  {report.featuredWines.map((wine: any) => (
                    <Link
                      key={wine.slug}
                      href={`/wines/${wine.slug}`}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {wine.name} {wine.vintage}
                        </p>
                        <p className="text-sm text-gray-500">{wine.producer.name}</p>
                      </div>
                      {wine.score && <ScoreBadge score={wine.score} size="sm" />}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Region Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">About {report.region.name}</h3>
              <p className="text-sm text-gray-600">{report.region.description}</p>
              <Link
                href={`/wines?region=${report.region.slug}`}
                className="mt-4 inline-block text-red-600 hover:text-red-700 text-sm"
              >
                Browse wines from {report.region.name} &rarr;
              </Link>
            </div>

            {/* Other Vintages */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Other Vintages</h3>
              <div className="space-y-2">
                {['2021', '2020', '2019', '2018'].map((yr) => (
                  <Link
                    key={yr}
                    href={`/vintages/${region}/${yr}`}
                    className={`block px-3 py-2 rounded text-sm ${
                      yr === year
                        ? 'bg-red-100 text-red-800 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {report.region.name} {yr}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
