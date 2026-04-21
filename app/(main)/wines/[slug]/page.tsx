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
    description?: string;
  } | null;
  region: {
    id: number;
    name: string;
    slug: string;
    country: string;
  } | null;
  reviews?: Array<{
    id: number;
    score: number;
    tastingNotes?: string;
    shortSummary?: string;
    flavorProfile?: Array<{ flavor: string }>;
    reviewerName?: string;
    reviewDate?: string;
  }>;
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

    const wine = wineResult.docs[0] as unknown as Wine;

    // Fetch reviews for this wine
    const reviewResult = await payload.find({
      collection: 'reviews',
      where: { wine: { equals: wine.id } },
      depth: 0,
    });

    wine.reviews = (reviewResult.docs || []) as unknown as Wine['reviews'];

    return wine;
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
  const latestReview = wine.reviews?.[0];
  const description = latestReview?.shortSummary || latestReview?.tastingNotes?.substring(0, 160) || `Expert review of ${fullTitle}`;

  return {
    title: `${fullTitle} - WineSaint Review`,
    description,
    openGraph: {
      title: fullTitle,
      description,
      type: 'website',
      url: `https://winesaint.com/wines/${slug}`,
      siteName: 'WineSaint',
      ...(latestReview && {
        images: [
          {
            url: `https://winesaint.com/og-image.jpg`, // TODO: Add wine-specific images
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

  const latestReview = wine.reviews?.[0];

  // Generate JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: formatWineDisplayName(wine.producer?.name, wine.name, wine.vintage),
    description: latestReview?.tastingNotes || `${formatWineDisplayName(wine.producer?.name, wine.name)} from ${wine.vintage}`,
    brand: {
      '@type': 'Brand',
      name: wine.producer?.name || 'Unknown Producer',
    },
    category: 'Wine',
    ...(wine.priceUsd && {
      offers: {
        '@type': 'Offer',
        price: wine.priceUsd,
        priceCurrency: 'USD',
      },
    }),
    ...(latestReview && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: latestReview.score,
        bestRating: 100,
        worstRating: 0,
        ratingCount: wine.reviews?.length || 1,
      },
    }),
    ...(wine.reviews && wine.reviews.length > 0 && {
      review: wine.reviews.map((review) => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.score,
          bestRating: 100,
          worstRating: 0,
        },
        author: {
          '@type': 'Person',
          name: review.reviewerName,
        },
        reviewBody: review.tastingNotes,
        datePublished: review.reviewDate,
      })),
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
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-[#722F37]">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/wines" className="hover:text-[#722F37]">
                Wines
              </Link>
            </li>
            <li>/</li>
            <li className="text-[#1C1C1C] font-medium">
              {formatWineDisplayName(wine.producer?.name, wine.name, wine.vintage)}
            </li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Wine Details */}
          <div className="space-y-6">
            {/* Header + Reviews Combined */}
            <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-6">
              <h1 className="font-serif text-3xl italic text-[#1C1C1C]">
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

              {/* Reviews Section */}
              <div className="mt-6 pt-6 border-t-2 border-[#1C1C1C]/10">
                {wine.reviews && wine.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {wine.reviews.map((review, index) => (
                      <div
                        key={review.id}
                        className={index > 0 ? 'pt-6 border-t-2 border-[#1C1C1C]/10' : ''}
                      >
                        <div className="flex items-start gap-4">
                          <ScoreBadge score={review.score} size="md" />
                          <div className="flex-1">
                            {review.reviewerName && (
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-[#1C1C1C]">
                                  {review.reviewerName}
                                </span>
                              </div>
                            )}

                            {review.tastingNotes && (
                              <p className="text-gray-700 leading-relaxed">
                                {review.tastingNotes}
                              </p>
                            )}

                            {review.flavorProfile && review.flavorProfile.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {review.flavorProfile.map((item, i) => (
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
                      </div>
                    ))}
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
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-[#1C1C1C] group-hover:text-[#722F37]">{wine.producer.name}</h3>
                  <span className="text-gray-400 group-hover:text-[#722F37]">→</span>
                </div>
                {wine.producer.description && (
                  <p className="mt-2 text-gray-600">{wine.producer.description}</p>
                )}
              </Link>
            )}

          </div>
        </div>
      </div>
    </div>
    </>
  );
}
