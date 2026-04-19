import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

// Mock data for Château Margaux 2011
const mockWine = {
  name: 'Château Margaux',
  vintage: 2011,
  producer: {
    name: 'Château Margaux',
    slug: 'chateau-margaux',
    founded: 1590,
  },
  region: {
    name: 'Margaux',
    fullSlug: 'france/bordeaux/left-bank/margaux',
  },
  grapes: [
    { name: 'Cabernet Sauvignon', slug: 'cabernet-sauvignon', percentage: 87 },
    { name: 'Merlot', slug: 'merlot', percentage: 8 },
    { name: 'Petit Verdot', slug: 'petit-verdot', percentage: 3 },
    { name: 'Cabernet Franc', slug: 'cabernet-franc', percentage: 2 },
  ],
  wineType: 'Red',
  priceUsd: 450,
  alcoholPercentage: 13.5,
};

const mockVintage = {
  year: 2011,
  region: 'Left Bank Bordeaux',
  rating: 85,
  quality: 'Average',
  drinkFrom: 2018,
  drinkUntil: 2035,
  weather: 'A challenging growing season marked by a cool, rainy spring that delayed flowering. Summer brought irregular weather with periods of intense heat followed by rain. Early harvest was necessary in some areas.',
  harvest: 'Early (mid-September)',
  yields: 'Low',
};

const mockReview = {
  score: 7.2,
  tastingNotes: `Despite the challenging 2011 vintage, Château Margaux produced a wine of characteristic elegance and poise. The nose opens with lifted aromatics of violet, cassis, and subtle graphite, with hints of cedar and tobacco emerging with air.

On the palate, the wine is medium-bodied with fine-grained tannins and bright, refreshing acidity. Less concentrated than the great years, but impeccably balanced with a silky texture that speaks to the estate's mastery even in difficult conditions.

The finish is moderate in length, with lingering notes of red fruit and a mineral undertone. This is a Margaux for earlier drinking than most vintages, showing well now and likely at its best through 2035.`,
  shortSummary: 'Elegant and refined despite the vintage challenges, with characteristic Margaux finesse.',
  flavorProfile: ['Violet', 'Cassis', 'Graphite', 'Cedar', 'Tobacco', 'Red Cherry'],
  drinkThisIf: 'You want classic Margaux elegance without the extended wait or premium price of a great vintage. Perfect for those seeking an approachable First Growth.',
  foodPairings: ['Lamb with herbs', 'Beef tenderloin', 'Aged Comté', 'Duck confit', 'Wild mushroom risotto'],
  reviewerName: 'Wine Saint',
  reviewDate: 'May 2025',
};

const mockVertical = [
  { year: 2020, score: 9.6, quality: 'Exceptional', price: 650, drink: '2030-2070' },
  { year: 2019, score: 9.4, quality: 'Excellent', price: 580, drink: '2029-2060' },
  { year: 2018, score: 9.3, quality: 'Excellent', price: 520, drink: '2028-2055' },
  { year: 2016, score: 9.5, quality: 'Exceptional', price: 620, drink: '2026-2065' },
  { year: 2015, score: 9.4, quality: 'Excellent', price: 590, drink: '2025-2060' },
  { year: 2014, score: 8.5, quality: 'Very Good', price: 420, drink: '2022-2045' },
  { year: 2012, score: 8.2, quality: 'Good', price: 380, drink: '2020-2040' },
  { year: 2011, score: 7.2, quality: 'Average', price: 450, drink: '2018-2035', current: true },
  { year: 2010, score: 9.5, quality: 'Exceptional', price: 850, drink: '2025-2070' },
  { year: 2009, score: 9.4, quality: 'Exceptional', price: 780, drink: '2020-2065' },
];

const mockRelatedWines = [
  { name: 'Château Margaux', vintage: 2010, score: 9.5, slug: '#' },
  { name: 'Château Margaux', vintage: 2015, score: 9.4, slug: '#' },
  { name: 'Pavillon Rouge', vintage: 2011, score: 7.8, slug: '#' },
];

const mockSameVintage = [
  { name: 'Château Latour', vintage: 2011, score: 7.5, producer: 'Château Latour', slug: '#' },
  { name: 'Château Mouton Rothschild', vintage: 2011, score: 7.3, producer: 'Château Mouton Rothschild', slug: '#' },
  { name: 'Château Haut-Brion', vintage: 2011, score: 7.6, producer: 'Château Haut-Brion', slug: '#' },
];

function ScoreBadge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const getScoreColor = (s: number) => {
    if (s >= 9.0) return 'bg-[#722F37] text-white';
    if (s >= 8.0) return 'bg-[#ff6b35] text-white';
    if (s >= 7.0) return 'bg-[#f4d35e] text-[#1C1C1C]';
    return 'bg-gray-400 text-white';
  };

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl',
    xl: 'w-24 h-24 text-3xl',
  };

  return (
    <div className={`flex items-center justify-center rounded-full font-serif italic border-2 border-[#1C1C1C] ${getScoreColor(score)} ${sizeClasses[size]}`}>
      {score.toFixed(1)}
    </div>
  );
}

function VintageQualityBar({ rating }: { rating: number }) {
  const filled = Math.round(rating / 10);
  return (
    <div className="flex gap-0.5">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${i < filled ? 'bg-[#722F37]' : 'bg-gray-200'}`}
        />
      ))}
    </div>
  );
}

function FlavorTag({ flavor }: { flavor: string }) {
  return (
    <span className="inline-block px-3 py-1.5 bg-stone-100 text-gray-700 text-sm rounded-full border border-stone-200">
      {flavor}
    </span>
  );
}

export default function WineReviewMockup() {
  const breadcrumbItems = [
    { name: 'Regions', href: '/regions' },
    { name: 'France', href: '/regions/france' },
    { name: 'Bordeaux', href: '/regions/france/bordeaux' },
    { name: 'Left Bank', href: '/regions/france/bordeaux/left-bank' },
    { name: 'Margaux', href: '/regions/france/bordeaux/left-bank/margaux' },
    { name: `${mockWine.producer.name} ${mockWine.vintage}`, href: '#' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* Left: Wine Image + Basic Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex flex-col md:flex-row gap-8">

                {/* Wine Bottle Placeholder */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-80 bg-gradient-to-b from-stone-100 to-stone-200 rounded-lg flex items-center justify-center">
                    <div className="w-12 h-56 bg-gradient-to-b from-[#722F37] to-[#4a1f24] rounded-sm shadow-lg" />
                  </div>
                </div>

                {/* Wine Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="font-serif text-4xl font-bold text-[#1C1C1C]">
                        {mockWine.producer.name}
                      </h1>
                      <p className="text-2xl text-[#722F37] font-serif mt-1">
                        {mockWine.vintage}
                      </p>
                      <p className="text-sm text-[#B8926A] uppercase tracking-wide mt-2">
                        First Growth - Margaux
                      </p>
                    </div>
                    <ScoreBadge score={mockReview.score} size="lg" />
                  </div>

                  <p className="text-gray-600 mt-4 italic font-serif">
                    "{mockReview.shortSummary}"
                  </p>

                  {/* Vintage Badge */}
                  <div className="mt-6 p-4 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-[#1C1C1C]">
                        {mockVintage.year} {mockVintage.region}
                      </span>
                      <span className="text-sm font-medium px-2 py-1 bg-[#f4d35e] text-[#1C1C1C] rounded">
                        {mockVintage.rating}/100
                      </span>
                    </div>
                    <VintageQualityBar rating={mockVintage.rating} />
                    <p className="text-sm text-gray-500 mt-2">
                      {mockVintage.quality} vintage - {mockVintage.harvest}
                    </p>
                    <Link href="#" className="text-sm text-[#722F37] hover:underline mt-1 inline-block">
                      View full vintage report &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Facts Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              <h3 className="font-display text-lg font-semibold text-[#1C1C1C] mb-4 pb-2 border-b border-gray-200">
                Quick Facts
              </h3>

              <dl className="space-y-4">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Region</dt>
                  <dd>
                    <Link href="#" className="text-[#722F37] hover:underline font-medium">
                      {mockWine.region.name}
                    </Link>
                  </dd>
                </div>

                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Producer</dt>
                  <dd>
                    <Link href="#" className="text-[#722F37] hover:underline font-medium">
                      {mockWine.producer.name}
                    </Link>
                    <span className="text-xs text-gray-400 ml-1">Est. {mockWine.producer.founded}</span>
                  </dd>
                </div>

                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Grapes</dt>
                  <dd className="flex flex-wrap gap-1 mt-1">
                    {mockWine.grapes.map((grape) => (
                      <Link
                        key={grape.slug}
                        href="#"
                        className="text-xs bg-stone-100 text-gray-700 px-2 py-1 rounded hover:bg-stone-200 transition-colors"
                      >
                        {grape.name} ({grape.percentage}%)
                      </Link>
                    ))}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Type</dt>
                  <dd className="font-medium">{mockWine.wineType}</dd>
                </div>

                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Price</dt>
                  <dd className="font-medium">${mockWine.priceUsd}</dd>
                </div>

                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Alcohol</dt>
                  <dd className="font-medium">{mockWine.alcoholPercentage}%</dd>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Drinking Window</dt>
                  <dd className="font-medium text-[#722F37]">
                    {mockVintage.drinkFrom} - {mockVintage.drinkUntil}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Wine Saint Review */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#722F37] rounded-full flex items-center justify-center">
              <span className="text-white font-serif text-lg">W</span>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-[#1C1C1C]">
                Wine Saint Review
              </h2>
              <p className="text-sm text-gray-500">
                {mockReview.reviewerName} - {mockReview.reviewDate}
              </p>
            </div>
          </div>

          <div className="prose max-w-none">
            {mockReview.tastingNotes.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Flavor Profile */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-3">Flavor Profile</h3>
            <div className="flex flex-wrap gap-2">
              {mockReview.flavorProfile.map((flavor) => (
                <FlavorTag key={flavor} flavor={flavor} />
              ))}
            </div>
          </div>

          {/* Drink This If + Food Pairings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-200">
            <div>
              <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-3">Drink This If...</h3>
              <p className="text-gray-700 italic">"{mockReview.drinkThisIf}"</p>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-3">Food Pairings</h3>
              <ul className="space-y-1">
                {mockReview.foodPairings.map((pairing) => (
                  <li key={pairing} className="text-gray-700 flex items-center gap-2">
                    <span className="text-[#8B9D83]">&#8226;</span>
                    {pairing}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* More Wines Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

          {/* More from Producer */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-display text-lg font-semibold text-[#1C1C1C] mb-4">
              More from {mockWine.producer.name}
            </h3>
            <div className="space-y-3">
              {mockRelatedWines.map((wine) => (
                <Link
                  key={`${wine.name}-${wine.vintage}`}
                  href={wine.slug}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50 transition-colors group"
                >
                  <div>
                    <p className="font-medium text-[#1C1C1C] group-hover:text-[#722F37]">
                      {wine.name} {wine.vintage}
                    </p>
                  </div>
                  <ScoreBadge score={wine.score} size="sm" />
                </Link>
              ))}
            </div>
            <Link href="#" className="text-sm text-[#722F37] hover:underline mt-4 inline-block">
              View all wines &rarr;
            </Link>
          </div>

          {/* Same Vintage */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-display text-lg font-semibold text-[#1C1C1C] mb-4">
              More {mockVintage.year} Left Bank
            </h3>
            <div className="space-y-3">
              {mockSameVintage.map((wine) => (
                <Link
                  key={`${wine.name}-${wine.vintage}`}
                  href={wine.slug}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50 transition-colors group"
                >
                  <div>
                    <p className="font-medium text-[#1C1C1C] group-hover:text-[#722F37]">
                      {wine.name}
                    </p>
                    <p className="text-sm text-gray-500">{wine.producer}</p>
                  </div>
                  <ScoreBadge score={wine.score} size="sm" />
                </Link>
              ))}
            </div>
            <Link href="#" className="text-sm text-[#722F37] hover:underline mt-4 inline-block">
              View all 2011 wines &rarr;
            </Link>
          </div>
        </div>

        {/* Vertical - All Vintages */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h3 className="font-display text-xl font-semibold text-[#1C1C1C] mb-6">
            {mockWine.producer.name} Vertical
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
                  <th className="pb-3 font-medium">Vintage</th>
                  <th className="pb-3 font-medium">Score</th>
                  <th className="pb-3 font-medium">Quality</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Drinking Window</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockVertical.map((v) => (
                  <tr
                    key={v.year}
                    className={`hover:bg-stone-50 transition-colors ${v.current ? 'bg-[#722F37]/5' : ''}`}
                  >
                    <td className="py-4">
                      <Link href="#" className={`font-medium ${v.current ? 'text-[#722F37]' : 'text-[#1C1C1C]'} hover:underline`}>
                        {v.year}
                        {v.current && <span className="ml-2 text-xs bg-[#722F37] text-white px-2 py-0.5 rounded">CURRENT</span>}
                      </Link>
                    </td>
                    <td className="py-4">
                      <ScoreBadge score={v.score} size="sm" />
                    </td>
                    <td className="py-4 text-gray-600">{v.quality}</td>
                    <td className="py-4 text-gray-600">${v.price}</td>
                    <td className="py-4 text-gray-500 text-sm">{v.drink}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Link href="#" className="text-sm text-[#722F37] hover:underline mt-6 inline-block">
            View all 50 vintages &rarr;
          </Link>
        </div>

        {/* Design Note */}
        <div className="mt-12 p-6 bg-[#722F37]/10 rounded-xl border border-[#722F37]/20">
          <h4 className="font-display font-semibold text-[#722F37] mb-2">Design Mockup Note</h4>
          <p className="text-gray-700 text-sm">
            This is a static mockup with placeholder data. Links do not navigate anywhere.
            This demonstrates the proposed layout for individual wine review pages with:
            breadcrumb navigation, vintage context, Wine Saint reviews, flavor profiles,
            producer verticals, and cross-linking to related wines.
          </p>
        </div>
      </div>
    </div>
  );
}
