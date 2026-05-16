import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { formatWineDisplayName } from '@/lib/utils';
import { getVineyardPath } from '@/lib/guide-config';

interface Wine {
  id: number;
  name: string;
  slug: string;
  vintage: number;
  wineType?: string;
  priceUsd?: number;
  alcoholPercentage?: number;
  producer: {
    id: number;
    name: string;
    slug: string;
    summary?: string;
    image?: {
      id: number;
      url?: string;
      alt?: string;
    } | null;
  } | null;
  region: {
    id: number;
    name: string;
    slug: string;
    country: string;
  } | null;
  score?: number;
  tastingNotes?: string;
  shortSummary?: string;
  flavorProfile?: Array<{ flavor: string }>;
  reviewerName?: string;
  reviewDate?: string;
}

async function getWine(slug: string): Promise<Wine | null> {
  try {
    const payload = await getPayload({ config });

    // Query Payload for wine by slug
    const wineResult = await payload.find({
      collection: 'wines',
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
    });

    if (!wineResult.docs || wineResult.docs.length === 0) return null;

    return wineResult.docs[0] as unknown as Wine;
  } catch (error) {
    console.error('Error fetching wine:', error);
    return null;
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const wine = await getWine(slug);

  if (!wine) {
    return {
      title: 'Wine Not Found',
    };
  }

  const fullTitle = formatWineDisplayName(wine.producer?.name, wine.name, wine.vintage);
  const description = wine.shortSummary || wine.tastingNotes?.substring(0, 160) || `Expert review of ${fullTitle}`;

  return {
    title: `${fullTitle} - WineSaint Review`,
    description,
    openGraph: {
      title: fullTitle,
      description,
      type: 'website',
      url: `https://winesaint.com/wines/${slug}`,
      siteName: 'WineSaint',
      ...(wine.score && {
        images: [
          {
            url: `https://winesaint.com/og-image.jpg`,
            width: 1200,
            height: 630,
            alt: fullTitle,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
  };
}

export default async function WineDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const wine = await getWine(slug);

  if (!wine) {
    notFound();
  }

  // Generate JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: formatWineDisplayName(wine.producer?.name, wine.name, wine.vintage),
    description: wine.tastingNotes || `${formatWineDisplayName(wine.producer?.name, wine.name)} from ${wine.vintage}`,
    brand: {
      '@type': 'Brand',
      name: wine.producer?.name || 'Unknown Producer',
    },
    category: 'Wine',
    ...(wine.score && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: wine.score,
        bestRating: 100,
        worstRating: 0,
        ratingCount: 1,
      },
      review: [{
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: wine.score,
          bestRating: 100,
          worstRating: 0,
        },
        author: {
          '@type': 'Person',
          name: wine.reviewerName,
        },
        reviewBody: wine.tastingNotes,
        datePublished: wine.reviewDate,
      }],
    }),
    ...(wine.alcoholPercentage && {
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Alcohol Content',
          value: `${wine.alcoholPercentage}%`,
        },
      ],
    }),
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 md:mb-8 overflow-hidden">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li className="flex-shrink-0">
              <Link href="/" className="hover:text-[#722F37]">
                Home
              </Link>
            </li>
            <li className="flex-shrink-0">/</li>
            <li className="flex-shrink-0">
              <Link href="/wines" className="hover:text-[#722F37]">
                Wines
              </Link>
            </li>
            <li className="flex-shrink-0">/</li>
            <li className="text-[#1C1C1C] font-medium truncate">
              {formatWineDisplayName(wine.producer?.name, wine.name, wine.vintage)}
            </li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Wine Details */}
          <div className="space-y-6">
            {/* Header + Reviews Combined */}
            <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-4 md:p-6">
              <h1 className="font-serif text-2xl md:text-3xl italic text-[#1C1C1C]">
                {formatWineDisplayName(wine.producer?.name, wine.name, wine.vintage)}
              </h1>

              {wine.wineType && (
                <div className="mt-2">
                  <span className={`
                    inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide
                    ${wine.wineType === 'red' ? 'bg-red-100 text-red-800' : ''}
                    ${wine.wineType === 'white' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${wine.wineType === 'rose' ? 'bg-pink-100 text-pink-800' : ''}
                    ${wine.wineType === 'sparkling' ? 'bg-blue-100 text-blue-800' : ''}
                    ${wine.wineType === 'dessert' ? 'bg-amber-100 text-amber-800' : ''}
                    ${wine.wineType === 'fortified' ? 'bg-purple-100 text-purple-800' : ''}
                  `}>
                    {wine.wineType === 'rose' ? 'Rosé' : wine.wineType.charAt(0).toUpperCase() + wine.wineType.slice(1)}
                  </span>
                </div>
              )}

              <div className="mt-2 text-sm text-gray-600">
                {(() => {
                  const regionName = wine.region?.name || 'Unknown Region';
                  const country = wine.region?.country;

                  // If no country or country is "Unknown", just show region name
                  if (!country || country === 'Unknown') {
                    return regionName;
                  }

                  // If region name already includes country, don't append it again
                  if (regionName.startsWith(country) || regionName.includes(` - ${country}`) || regionName.includes(`${country} - `)) {
                    return regionName;
                  }

                  // Otherwise append country
                  return `${regionName}, ${country}`;
                })()}
              </div>

              {/* Review Section */}
              <div className="mt-6 pt-6 border-t-2 border-[#1C1C1C]/10">
                {wine.score ? (
                  <div className="flex items-start gap-4">
                    <ScoreBadge score={wine.score} size="md" />
                    <div className="flex-1">
                      {wine.reviewerName && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-[#1C1C1C]">
                            {wine.reviewerName}
                          </span>
                        </div>
                      )}

                      {wine.tastingNotes && (
                        <p className="text-gray-700 leading-relaxed">
                          {wine.tastingNotes}
                        </p>
                      )}

                      {wine.flavorProfile && wine.flavorProfile.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {wine.flavorProfile.map((item, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-[#FAF7F2] border border-[#1C1C1C]/20 rounded text-xs text-gray-600"
                            >
                              {item.flavor}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No reviews yet. Check back soon!
                  </p>
                )}
              </div>
            </div>

            {/* Producer Info */}
            {wine.producer && (
              <Link
                href={`/producers/${wine.producer.slug}`}
                className="block bg-white border-3 border-[#1C1C1C] rounded-lg p-6 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-20 h-14 bg-gradient-to-br from-stone-100 to-stone-200 rounded border border-stone-300 flex items-center justify-center overflow-hidden">
                    {wine.producer.image?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={wine.producer.image.url}
                        alt={wine.producer.image.alt || `${wine.producer.name} label`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-stone-400 text-[10px]">Label</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="font-semibold text-[#1C1C1C] group-hover:text-[#722F37]">
                        {wine.producer.name}
                      </h3>
                      <span className="text-gray-400 group-hover:text-[#722F37] flex-shrink-0">→</span>
                    </div>
                    {wine.producer.summary && (
                      <p className="mt-1 text-sm text-gray-600 leading-snug">
                        {wine.producer.summary}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )}

          </div>
        </div>
      </div>
    </div>
    </>
  );
}
