import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { formatWineDisplayName } from '@/lib/utils';

interface Wine {
  id: number;
  name: string;
  slug: string;
  vintage: number;
  wineType?: string;
  producer: {
    id: number;
    name: string;
    slug: string;
  } | null;
  region: {
    id: number;
    name: string;
    slug: string;
    country: string;
  } | null;
}

interface Review {
  id: number;
  score: number;
  wine: number | { id: number };
}

async function getWines(): Promise<{ wines: Wine[]; reviewsByWine: Map<number, number> }> {
  try {
    const payload = await getPayload({ config });

    // Fetch all wines
    const wineResult = await payload.find({
      collection: 'wines',
      depth: 1,
      limit: 500,
      sort: '-createdAt',
    });

    const wines = (wineResult.docs || []) as unknown as Wine[];

    // Fetch reviews to get scores
    const reviewResult = await payload.find({
      collection: 'reviews',
      depth: 0,
      limit: 1000,
    });

    const reviews = (reviewResult.docs || []) as unknown as Review[];

    // Build a map of wine ID to highest score
    const reviewsByWine = new Map<number, number>();
    for (const review of reviews) {
      const wineId = typeof review.wine === 'object' ? review.wine.id : review.wine;
      const existingScore = reviewsByWine.get(wineId);
      if (!existingScore || review.score > existingScore) {
        reviewsByWine.set(wineId, review.score);
      }
    }

    return { wines, reviewsByWine };
  } catch (error) {
    console.error('Error fetching wines:', error);
    return { wines: [], reviewsByWine: new Map() };
  }
}

export default async function WinesPage() {
  const { wines, reviewsByWine } = await getWines();

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">Wine Reviews</h1>
          <p className="mt-3 text-gray-600">
            Explore our collection of {wines.length} wines from around the world.
          </p>
        </div>

        {/* Wine Grid */}
        {wines.length === 0 ? (
          <div className="text-center py-16 bg-white border-3 border-[#1C1C1C] rounded-lg">
            <p className="text-gray-500 text-lg">No wines found in the database.</p>
            <p className="text-gray-400 mt-2">Add wines through the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wines.map((wine) => {
              const score = reviewsByWine.get(wine.id);
              return (
                <Link
                  key={wine.id}
                  href={`/wines/${wine.slug}`}
                  className="group bg-white border-3 border-[#1C1C1C] rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <h2 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37] truncate">
                        {formatWineDisplayName(wine.producer?.name, wine.name, wine.vintage)}
                      </h2>
                    </div>
                    {score && (
                      <div className="ml-2 flex-shrink-0">
                        <ScoreBadge score={score} size="sm" />
                      </div>
                    )}
                  </div>

                  {wine.wineType && (
                    <span className={`
                      inline-block px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide mb-2
                      ${wine.wineType === 'red' ? 'bg-red-100 text-red-800' : ''}
                      ${wine.wineType === 'white' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${wine.wineType === 'rose' ? 'bg-pink-100 text-pink-800' : ''}
                      ${wine.wineType === 'sparkling' ? 'bg-blue-100 text-blue-800' : ''}
                      ${wine.wineType === 'dessert' ? 'bg-amber-100 text-amber-800' : ''}
                      ${wine.wineType === 'fortified' ? 'bg-purple-100 text-purple-800' : ''}
                    `}>
                      {wine.wineType === 'rose' ? 'Rosé' : wine.wineType}
                    </span>
                  )}

                  <p className="text-sm text-gray-500 truncate">
                    {wine.region?.name || 'Unknown Region'}
                    {wine.region?.country && wine.region.country !== 'Unknown' && `, ${wine.region.country}`}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
