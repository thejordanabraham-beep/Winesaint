import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ScoreBadge } from '@/components/ui/ScoreBadge';

interface Producer {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  description?: string;
  winemaker?: string;
  founded?: number;
  website?: string;
  region?: {
    id: number;
    name: string;
    slug: string;
    country: string;
  } | null;
  country?: string;
}

interface Wine {
  id: number;
  name: string;
  slug: string;
  vintage: number;
  score?: number;
}

async function getProducer(slug: string): Promise<{ producer: Producer | null; wines: Wine[] }> {
  try {
    const payload = await getPayload({ config });

    // Query Payload for producer by slug
    const producerResult = await payload.find({
      collection: 'producers',
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
    });

    if (!producerResult.docs || producerResult.docs.length === 0) {
      return { producer: null, wines: [] };
    }

    const producer = producerResult.docs[0] as unknown as Producer;

    // Fetch wines for this producer
    const wineResult = await payload.find({
      collection: 'wines',
      where: { producer: { equals: producer.id } },
      depth: 0,
      limit: 100,
      sort: '-vintage',
    });

    const wines = wineResult.docs as unknown as Wine[];

    // Fetch reviews to get scores
    const reviewResult = await payload.find({
      collection: 'reviews',
      depth: 0,
      limit: 500,
    });

    const reviewsByWine = new Map<number, number>();
    for (const review of reviewResult.docs) {
      const wineId = typeof review.wine === 'number' ? review.wine : (review.wine as { id: number })?.id;
      if (wineId && !reviewsByWine.has(wineId)) {
        reviewsByWine.set(wineId, review.score);
      }
    }

    // Add scores to wines
    const winesWithScores = wines.map(wine => ({
      ...wine,
      score: reviewsByWine.get(wine.id),
    }));

    return { producer, wines: winesWithScores };
  } catch (error) {
    console.error('Error fetching producer:', error);
    return { producer: null, wines: [] };
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { producer } = await getProducer(slug);

  if (!producer) {
    return { title: 'Producer Not Found' };
  }

  return {
    title: `${producer.name} - WineSaint`,
    description: producer.summary || `Wines from ${producer.name}`,
  };
}

export default async function ProducerPage({ params }: PageProps) {
  const { slug } = await params;
  const { producer, wines } = await getProducer(slug);

  if (!producer) {
    notFound();
  }

  const region = typeof producer.region === 'object' ? producer.region : null;
  const country = region?.country || producer.country || '';

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#722F37]">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/producers" className="hover:text-[#722F37]">Producers</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{producer.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">

        {/* Producer Header */}
        <div className="bg-white rounded-lg border-[3px] border-[#1C1C1C] p-6 sm:p-8 mb-6">
          <div className="flex gap-6">
            {/* Label Image Placeholder */}
            <div className="flex-shrink-0 w-24 sm:w-32 h-32 sm:h-44 bg-gradient-to-br from-stone-100 to-stone-200 rounded-lg border border-stone-300 flex items-center justify-center">
              <span className="text-stone-400 text-xs text-center px-2">Label</span>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1C1C1C] mb-2">
                {producer.name}
              </h1>

              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                {region && (
                  <>
                    <Link href={`/regions/${region.slug}`} className="hover:text-[#722F37]">
                      {region.name}
                    </Link>
                    <span>•</span>
                  </>
                )}
                {country && (
                  <>
                    <span>{country}</span>
                    {producer.founded && <span>•</span>}
                  </>
                )}
                {producer.founded && (
                  <span>Est. {producer.founded}</span>
                )}
              </div>

              {producer.summary && (
                <p className="text-gray-700 font-medium">
                  {producer.summary}
                </p>
              )}
            </div>
          </div>

          {producer.description && (
            <>
              <hr className="my-6 border-gray-200" />
              <div className="prose max-w-none">
                {producer.description.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </>
          )}

          {/* Quick Facts */}
          {(producer.winemaker || producer.founded || producer.website) && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                {producer.winemaker && (
                  <div>
                    <span className="text-gray-500 block">Winemaker</span>
                    <span className="font-medium">{producer.winemaker}</span>
                  </div>
                )}
                {producer.founded && (
                  <div>
                    <span className="text-gray-500 block">Founded</span>
                    <span className="font-medium">{producer.founded}</span>
                  </div>
                )}
                {producer.website && (
                  <div>
                    <span className="text-gray-500 block">Website</span>
                    <a href={producer.website} className="font-medium text-[#722F37] hover:underline" target="_blank" rel="noopener noreferrer">
                      Visit site
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Wines */}
        {wines.length > 0 && (
          <div className="bg-white rounded-lg border-[3px] border-[#1C1C1C] p-6">
            <h2 className="font-display text-xl font-semibold text-[#1C1C1C] mb-4">
              Wines
            </h2>
            <div className="space-y-3">
              {wines.map((wine) => (
                <Link
                  key={wine.id}
                  href={`/wines/${wine.slug}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50 transition-colors group"
                >
                  <div>
                    <p className="font-medium text-[#1C1C1C] group-hover:text-[#722F37]">
                      {wine.vintage} {wine.name}
                    </p>
                  </div>
                  {wine.score && <ScoreBadge score={wine.score} size="sm" />}
                </Link>
              ))}
            </div>
          </div>
        )}

        {wines.length === 0 && (
          <div className="bg-white rounded-lg border-[3px] border-[#1C1C1C] p-6 text-center text-gray-500">
            No wines reviewed yet.
          </div>
        )}
      </div>
    </div>
  );
}
