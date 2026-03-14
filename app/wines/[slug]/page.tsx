import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { client } from '@/lib/sanity/client';
import { wineBySlugQuery } from '@/lib/sanity/queries';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { formatDrinkingWindow, formatPriceRange, convertTo10Point } from '@/lib/utils';
import { getVineyardPath } from '@/lib/guide-config';

interface Wine {
  _id: string;
  name: string;
  slug: string;
  vintage: number;
  wineType?: string;
  appellation?: string;
  vineyard?: {
    _id: string;
    name: string;
    slug: string;
    region?: string;
  } | null;
  grapeVarieties: string[];
  priceRange?: string;
  priceUsd?: number;
  alcoholPercentage?: number;
  criticAvg?: number;
  vivinoScore?: number;
  flavorMentions?: string[];
  producer: {
    name: string;
    slug: string;
    description?: string;
    website?: string;
  } | null;
  region: {
    name: string;
    slug: string;
    country: string;
    description?: string;
  } | null;
  climat?: {
    _id: string;
    name: string;
    slug: string;
    classification?: string;
    acreage?: number;
    soilTypes?: string[];
    aspect?: string;
    description?: string;
    historicalNotes?: string;
    appellation?: { name: string } | null;
  } | null;
  reviews?: Array<{
    _id: string;
    score: number;
    shortSummary?: string;
    tastingNotes: string;
    flavorProfile?: string[];
    drinkThisIf?: string;
    foodPairings?: string[];
    drinkingWindowStart?: number;
    drinkingWindowEnd?: number;
    reviewerName: string;
    reviewDate: string;
    isAiGenerated?: boolean;
  }>;
  vintageReport?: {
    _id: string;
    year: number;
    slug: string;
    overview: string;
    overallRating: string;
  } | null;
}

async function getWine(slug: string): Promise<Wine | null> {
  // Update query to include new fields
  const query = `*[_type == "wine" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    vintage,
    wineType,
    grapeVarieties,
    priceRange,
    priceUsd,
    criticAvg,
    vivinoScore,
    flavorMentions,
    alcoholPercentage,
    appellation,
    vineyard->{
      _id,
      name,
      "slug": slug.current,
      region
    },
    image,
    producer->{
      _id,
      name,
      "slug": slug.current,
      description,
      website,
      image
    },
    region->{
      _id,
      name,
      "slug": slug.current,
      country,
      description
    },
    climat->{
      _id,
      name,
      "slug": slug.current,
      classification,
      acreage,
      soilTypes,
      aspect,
      description,
      historicalNotes,
      appellation->{
        name
      }
    },
    "reviews": *[_type == "review" && wine._ref == ^._id] | order(reviewDate desc) {
      _id,
      score,
      shortSummary,
      tastingNotes,
      flavorProfile,
      drinkThisIf,
      foodPairings,
      drinkingWindowStart,
      drinkingWindowEnd,
      reviewerName,
      reviewDate,
      isAiGenerated
    },
    "vintageReport": *[_type == "vintageReport" && region._ref == ^.region._id && year == ^.vintage][0]{
      _id,
      year,
      "slug": slug.current,
      overview,
      overallRating
    }
  }`;
  return await client.fetch(query, { slug });
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

  const fullTitle = `${wine.producer?.name} ${wine.name} ${wine.vintage}`;
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
    name: `${wine.producer?.name} ${wine.name} ${wine.vintage}`,
    description: latestReview?.tastingNotes || `${wine.producer?.name} ${wine.name} from ${wine.vintage}`,
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
              {wine.producer?.name} {wine.name} {wine.vintage}
            </li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Wine Details */}
          <div className="space-y-6">
            {/* Header + Reviews Combined */}
            <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-6">
              {(() => {
                const climatName = wine.climat?.name;
                const producerName = wine.producer?.name || 'Unknown Producer';

                // If we have a climat, display producer + climat + vintage (for Burgundy Grand Cru wines)
                if (climatName) {
                  const fullTitle = [producerName, climatName, wine.vintage].filter(Boolean).join(' ');
                  return (
                    <div>
                      <h1 className="font-serif text-3xl italic text-[#1C1C1C]">{fullTitle}</h1>
                      {wine.climat?.classification && (
                        <p className="text-sm text-[#B8926A] uppercase tracking-wide mt-2">
                          {wine.climat.classification === 'grand_cru' && 'Grand Cru'}
                          {wine.climat.classification === 'premier_cru' && 'Premier Cru'}
                          {wine.climat.classification === 'village' && 'Village'}
                          {wine.climat.classification === 'mga' && 'Menzioni Geografiche Aggiuntive'}
                          {wine.climat.classification === 'grosses_gewachs' && 'Grosses Gewächs'}
                        </p>
                      )}
                    </div>
                  );
                }

                // For all other wines, display producer + wine name + vintage
                const fullTitle = [producerName, wine.name, wine.vintage].filter(Boolean).join(' ');
                return <h1 className="font-serif text-3xl italic text-[#1C1C1C]">{fullTitle}</h1>;
              })()}

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
                        key={review._id}
                        className={index > 0 ? 'pt-6 border-t-2 border-[#1C1C1C]/10' : ''}
                      >
                        <div className="flex items-start gap-4">
                          <ScoreBadge score={review.score} size="md" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-[#1C1C1C]">
                                {review.reviewerName}
                              </span>
                            </div>

                            {review.shortSummary && (
                              <p className="text-lg font-medium text-[#1C1C1C] mb-2">
                                {review.shortSummary}
                              </p>
                            )}

                            <p className="text-gray-700 leading-relaxed">
                              {review.tastingNotes}
                            </p>

                            {review.flavorProfile && review.flavorProfile.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1">
                                {review.flavorProfile.map((flavor) => (
                                  <span
                                    key={flavor}
                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                  >
                                    {flavor}
                                  </span>
                                ))}
                              </div>
                            )}

                            {review.foodPairings && review.foodPairings.length > 0 && (
                              <p className="mt-3 text-sm text-gray-600">
                                <span className="font-medium">Pairs with:</span> {review.foodPairings.join(', ')}
                              </p>
                            )}

                            {review.drinkThisIf && (
                              <p className="mt-2 text-sm text-[#722F37] font-medium">
                                Drink this if: {review.drinkThisIf} 🍷
                              </p>
                            )}

                            {(review.drinkingWindowStart || review.drinkingWindowEnd) && (
                              <p className="mt-2 text-sm text-gray-500">
                                Drinking window: {formatDrinkingWindow(review.drinkingWindowStart, review.drinkingWindowEnd)}
                              </p>
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

            {/* Flavor Profile */}
            {wine.flavorMentions && wine.flavorMentions.length > 0 && (
              <div className="bg-[#f4d35e] border-3 border-[#1C1C1C] rounded-lg p-6">
                <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Flavor Profile</h2>
                <div className="flex flex-wrap gap-2">
                  {wine.flavorMentions.map((flavor: string) => (
                    <span
                      key={flavor}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-[#1C1C1C]"
                    >
                      {flavor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Producer Info */}
            {wine.producer && (
              <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-6">
                <h3 className="font-semibold text-[#1C1C1C]">{wine.producer.name}</h3>
                {wine.producer.description && (
                  <p className="mt-2 text-gray-600">{wine.producer.description}</p>
                )}
              </div>
            )}

            {/* Vineyard/Climat - Enhanced clickable box */}
            {wine.climat && (
              <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-6">
                <h3 className="font-semibold text-[#1C1C1C] mb-3">Vineyard Details</h3>

                {/* Classification Badge */}
                {wine.climat.classification && (
                  <div className="mb-3">
                    <span className={`
                      inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                      ${wine.climat.classification === 'grand_cru' ? 'bg-amber-500 text-white' : ''}
                      ${wine.climat.classification === 'premier_cru' ? 'bg-[#722F37] text-white' : ''}
                      ${wine.climat.classification === 'village' ? 'bg-gray-500 text-white' : ''}
                      ${wine.climat.classification === 'mga' ? 'bg-purple-600 text-white' : ''}
                      ${wine.climat.classification === 'grosses_gewachs' ? 'bg-green-700 text-white' : ''}
                    `}>
                      {wine.climat.classification === 'grand_cru' && 'Grand Cru'}
                      {wine.climat.classification === 'premier_cru' && 'Premier Cru'}
                      {wine.climat.classification === 'village' && 'Village'}
                      {wine.climat.classification === 'mga' && 'MGA'}
                      {wine.climat.classification === 'grosses_gewachs' && 'Grosses Gewächs'}
                    </span>
                  </div>
                )}

                {/* Clickable Vineyard Name */}
                {wine.climat.slug && (
                  <Link
                    href={getVineyardPath(wine.climat.slug)}
                    className="text-lg font-medium text-[#722F37] hover:underline inline-flex items-center gap-2"
                  >
                    {wine.climat.name}
                    <span className="text-sm">→</span>
                  </Link>
                )}

                {/* Quick Facts */}
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  {wine.climat.acreage && (
                    <p>
                      <span className="font-medium">Size:</span> {wine.climat.acreage} hectares
                    </p>
                  )}
                  {wine.climat.soilTypes && wine.climat.soilTypes.length > 0 && (
                    <p>
                      <span className="font-medium">Soils:</span> {wine.climat.soilTypes.join(', ')}
                    </p>
                  )}
                  {wine.climat.aspect && (
                    <p>
                      <span className="font-medium">Aspect:</span> {wine.climat.aspect}
                    </p>
                  )}
                  {wine.climat.appellation?.name && (
                    <p>
                      <span className="font-medium">Appellation:</span> {wine.climat.appellation.name}
                    </p>
                  )}
                </div>

                {/* Description snippet */}
                {wine.climat.description && (
                  <p className="mt-3 text-sm text-gray-700 line-clamp-2">
                    {wine.climat.description}
                  </p>
                )}
              </div>
            )}

            {/* Fallback for vineyard (non-climat) */}
            {!wine.climat && wine.vineyard && (
              <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-6">
                <h3 className="font-semibold text-[#1C1C1C] mb-2">
                  {wine.vineyard.name}
                </h3>
                {wine.vineyard.region && (
                  <p className="text-sm text-gray-600">{wine.vineyard.region}</p>
                )}
              </div>
            )}

            {/* Vintage Report Box */}
            {wine.vintageReport && wine.region && (
              <Link href={`/vintages/${wine.region.slug}/${wine.vintageReport.slug}`}>
                <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="font-semibold text-[#1C1C1C] mb-2">
                    {wine.region.name} {wine.vintageReport.year}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {wine.vintageReport.overview}
                  </p>
                  <div className="mt-2 text-xs text-[#722F37] font-medium">
                    View vintage report →
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
