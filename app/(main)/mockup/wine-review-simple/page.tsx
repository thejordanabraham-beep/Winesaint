import Link from 'next/link';

// Mock data for Emmerich Knoll Grüner Veltliner Kreutles Smaragd 2024
const mockWine = {
  name: 'Emmerich Knoll Grüner Veltliner Kreutles Smaragd',
  vintage: 2024,
  region: {
    name: 'Wachau',
    slug: 'wachau',
  },
};

const mockReview = {
  score: 7.7,
  shortSummary: 'Concentrated Smaragd from elevated Kreutles parcels showing pronounced lees influence and citric precision.',
  tastingNotes: `Sourced from the upper elevations of Kreutles, this Smaragd exhibits dominant autolytic character that currently masks the underlying fruit expression of green apple and pear. The palate demonstrates the concentration expected from this classification, with a tightly wound core of citrus pith and zest interacting with residual lees to produce textural complexity, subtle peppery phenolics, and pronounced salivary length—hallmarks of the site's gneiss-derived minerality.`,
  flavorProfile: ['lees/yeast', 'green apple', 'green pear', 'lemon zest', 'lemon pith', 'white pepper'],
  drinkingWindowStart: 2026,
  drinkingWindowEnd: 2040,
};

const mockProducer = {
  name: 'Emmerich Knoll',
  slug: 'emmerich-knoll',
  summary: 'One of the Wachau\'s most revered estates, Emmerich Knoll has been crafting benchmark Grüner Veltliner and Riesling from prime sites like Schütt, Loibenberg, and Kreutles since 1825. Known for racy acidity and exceptional aging potential.',
  wineCount: 24,
};

const mockVineyard = {
  name: 'Kreutles',
  slug: 'kreutles',
  region: 'Wachau',
  summary: 'A steep, high-altitude site on weathered gneiss soils above Dürnstein. South-facing terraces capture intense sunlight while cool air drainage preserves freshness. Known for producing Grüner Veltliner with exceptional minerality and longevity.',
  elevation: '280-350m',
  soil: 'Gneiss',
  aspect: 'South',
};

const mockVintage = {
  year: 2024,
  region: 'Wachau',
  slug: '2024-wachau',
  rating: 5,
  summary: 'A warm, dry growing season with well-timed late-summer rains produced ripe, concentrated wines with excellent acidity. One of the strongest vintages in recent memory for the region.',
};

function ScoreBadge({ score }: { score: number }) {
  const getScoreColor = (s: number) => {
    if (s >= 9.0) return 'bg-[#722F37] text-white';
    if (s >= 8.0) return 'bg-[#ff6b35] text-white';
    if (s >= 7.0) return 'bg-[#f4d35e] text-[#1C1C1C]';
    return 'bg-gray-400 text-white';
  };

  return (
    <div className={`w-14 h-14 flex items-center justify-center rounded-full font-serif italic text-lg border-2 border-[#1C1C1C] ${getScoreColor(score)}`}>
      {score.toFixed(1)}
    </div>
  );
}

function FlavorTag({ flavor }: { flavor: string }) {
  return (
    <span className="inline-block px-3 py-1 bg-white text-gray-700 text-sm rounded-full border border-gray-300">
      {flavor}
    </span>
  );
}

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`${sizeClass} ${i < rating ? 'text-[#B8926A]' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ContextCard({
  title,
  href,
  children,
  icon,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block bg-white rounded-lg border-[3px] border-[#1C1C1C] p-5 hover:shadow-lg hover:translate-y-[-2px] transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-display font-semibold text-[#1C1C1C] group-hover:text-[#722F37] transition-colors">
          {title}
        </h3>
        {icon}
      </div>
      {children}
      <div className="mt-3 text-sm text-[#722F37] font-medium group-hover:underline">
        Learn more &rarr;
      </div>
    </Link>
  );
}

export default function WineReviewSimpleMockup() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#722F37]">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/wines" className="hover:text-[#722F37]">Wines</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{mockWine.name} {mockWine.vintage}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">

        {/* Review Card */}
        <div className="bg-white rounded-lg border-[3px] border-[#1C1C1C] p-6 sm:p-8 mb-6">
          {/* Wine Title */}
          <h1 className="font-serif text-2xl sm:text-3xl italic text-[#1C1C1C] mb-1">
            {mockWine.name} {mockWine.vintage}
          </h1>
          <Link href={`/regions/${mockWine.region.slug}`} className="text-gray-500 hover:text-[#722F37] transition-colors">
            {mockWine.region.name}
          </Link>

          <hr className="my-6 border-gray-200" />

          {/* Review Content */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <ScoreBadge score={mockReview.score} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 mb-1">WineSaint</p>
              <p className="font-semibold text-[#1C1C1C] mb-3">
                {mockReview.shortSummary}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {mockReview.tastingNotes}
              </p>

              {/* Flavor Tags */}
              <div className="flex flex-wrap gap-2 mt-5">
                {mockReview.flavorProfile.map((flavor) => (
                  <FlavorTag key={flavor} flavor={flavor} />
                ))}
              </div>

              {/* Drinking Window */}
              <p className="text-sm text-[#8B9D83] mt-4">
                Drinking window: {mockReview.drinkingWindowStart}–{mockReview.drinkingWindowEnd}
              </p>
            </div>
          </div>
        </div>

        {/* Context Cards - Vertical Stack */}
        <div className="flex flex-col gap-4">

          {/* Producer Card */}
          <ContextCard
            title={mockProducer.name}
            href={`/producers/${mockProducer.slug}`}
          >
            <p className="text-sm text-gray-600 line-clamp-3">
              {mockProducer.summary}
            </p>
          </ContextCard>

          {/* Vineyard Card - Only shows if vineyard exists */}
          {mockVineyard && (
            <ContextCard
              title={mockVineyard.name}
              href={`/vineyards/${mockVineyard.slug}`}
            >
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {mockVineyard.summary}
              </p>
              <div className="flex gap-3 text-xs text-gray-500">
                <span>{mockVineyard.elevation}</span>
                <span>•</span>
                <span>{mockVineyard.soil}</span>
                <span>•</span>
                <span>{mockVineyard.aspect}</span>
              </div>
            </ContextCard>
          )}

          {/* Vintage Card - Only shows if vintage report exists */}
          {mockVintage && (
            <ContextCard
              title={`${mockVintage.year} ${mockVintage.region}`}
              href={`/vintages/${mockVintage.slug}`}
            >
              <div className="mb-2">
                <StarRating rating={mockVintage.rating} size="sm" />
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">
                {mockVintage.summary}
              </p>
            </ContextCard>
          )}

        </div>

        {/* Design Note */}
        <div className="mt-12 p-6 bg-[#722F37]/10 rounded-xl border border-[#722F37]/20">
          <h4 className="font-display font-semibold text-[#722F37] mb-2">Design Mockup v2 - Vertical Stack + Bold Borders</h4>
          <p className="text-gray-700 text-sm mb-3">
            Simpler layout with vertical stacking and bold 3px borders:
          </p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li><strong>Producer</strong> - Brief summary + wine count, links to producer page</li>
            <li><strong>Vineyard</strong> - Site details, only shows when applicable</li>
            <li><strong>Vintage</strong> - Year quality summary, links to vintage report</li>
          </ul>
          <p className="text-gray-700 text-sm mt-3">
            Each card only appears if the data exists. Cards stack vertically for easier scanning.
          </p>
        </div>
      </div>
    </div>
  );
}
