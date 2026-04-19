import Link from 'next/link';

const mockVintage = {
  year: 2024,
  region: { name: 'Wachau', slug: 'wachau' },
  country: 'Austria',
  rating: 5,
  drinkFrom: 2026,
  drinkUntil: 2045,
  harvest: 'Normal (late September)',
  yields: 'Normal',
  summary: 'A warm, dry growing season with well-timed late-summer rains produced ripe, concentrated wines with excellent acidity. One of the strongest vintages in recent memory for the region.',
  weather: `The 2024 growing season in the Wachau began with a mild spring following a wet winter that replenished groundwater reserves. Budbreak occurred slightly early, around mid-April, under favorable conditions.

Summer brought consistently warm temperatures with occasional heat spikes in July, though the region's cooling influences from the Danube and evening breezes from the Waldviertel helped moderate extremes. Crucially, several rain events in late August prevented drought stress and maintained vine health.

September was picture-perfect: warm days, cool nights, and no rain. This allowed for extended hang time and optimal phenolic ripeness while preserving the bright acidity that defines great Wachau wine. Harvest began in late September under ideal conditions.

The resulting wines show exceptional concentration and depth while maintaining the racy, mineral-driven character that makes Wachau unique. Early assessments suggest one of the finest vintages in the past decade.`,
};

const mockWines = [
  { name: 'Emmerich Knoll Riesling Kellerberg Smaragd', score: 8.5, producer: 'Emmerich Knoll', slug: '#' },
  { name: 'F.X. Pichler Grüner Veltliner Kellerberg Smaragd', score: 8.7, producer: 'F.X. Pichler', slug: '#' },
  { name: 'Rudi Pichler Riesling Achleithen Smaragd', score: 8.4, producer: 'Rudi Pichler', slug: '#' },
  { name: 'Emmerich Knoll Riesling Schütt Smaragd', score: 8.2, producer: 'Emmerich Knoll', slug: '#' },
  { name: 'Emmerich Knoll Grüner Veltliner Loibenberg Smaragd', score: 8.0, producer: 'Emmerich Knoll', slug: '#' },
  { name: 'Emmerich Knoll Grüner Veltliner Kreutles Smaragd', score: 7.7, producer: 'Emmerich Knoll', slug: '#' },
];

const mockVintageHistory = [
  { year: 2024, rating: 5 },
  { year: 2023, rating: 4 },
  { year: 2022, rating: 3 },
  { year: 2021, rating: 4 },
  { year: 2020, rating: 5 },
  { year: 2019, rating: 5 },
  { year: 2018, rating: 4 },
  { year: 2017, rating: 5 },
];

function ScoreBadge({ score }: { score: number }) {
  const getScoreColor = (s: number) => {
    if (s >= 9.0) return 'bg-[#722F37] text-white';
    if (s >= 8.0) return 'bg-[#ff6b35] text-white';
    if (s >= 7.0) return 'bg-[#f4d35e] text-[#1C1C1C]';
    return 'bg-gray-400 text-white';
  };

  return (
    <div className={`w-10 h-10 flex items-center justify-center rounded-full font-serif italic text-sm border-2 border-[#1C1C1C] ${getScoreColor(score)}`}>
      {score.toFixed(1)}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-[#B8926A]' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function VintageMockup() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#722F37]">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/regions" className="hover:text-[#722F37]">Regions</Link>
          <span className="mx-2">/</span>
          <Link href="/regions/wachau" className="hover:text-[#722F37]">Wachau</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{mockVintage.year}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">

        {/* Vintage Header */}
        <div className="bg-white rounded-lg border-[3px] border-[#1C1C1C] p-6 sm:p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1C1C]">
                {mockVintage.year} {mockVintage.region.name}
              </h1>
              <p className="text-gray-600 mt-1">{mockVintage.country}</p>
            </div>
            <StarRating rating={mockVintage.rating} />
          </div>

          <p className="text-lg text-gray-700 font-medium mb-6">
            {mockVintage.summary}
          </p>

          {/* Vintage Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-stone-50 rounded-lg mb-6">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide block">Drink From</span>
              <span className="font-medium">{mockVintage.drinkFrom}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide block">Drink Until</span>
              <span className="font-medium">{mockVintage.drinkUntil}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide block">Harvest</span>
              <span className="font-medium">{mockVintage.harvest}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide block">Yields</span>
              <span className="font-medium">{mockVintage.yields}</span>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          <h2 className="font-display text-lg font-semibold text-[#1C1C1C] mb-4">
            Growing Season
          </h2>
          <div className="prose max-w-none">
            {mockVintage.weather.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Wines from this Vintage */}
        <div className="bg-white rounded-lg border-[3px] border-[#1C1C1C] p-6 mb-6">
          <h2 className="font-display text-xl font-semibold text-[#1C1C1C] mb-4">
            {mockVintage.year} {mockVintage.region.name} Wines
          </h2>
          <div className="space-y-3">
            {mockWines.map((wine, i) => (
              <Link
                key={i}
                href={wine.slug}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50 transition-colors group"
              >
                <div>
                  <p className="font-medium text-[#1C1C1C] group-hover:text-[#722F37]">
                    {wine.name}
                  </p>
                  <p className="text-sm text-gray-500">{wine.producer}</p>
                </div>
                <ScoreBadge score={wine.score} />
              </Link>
            ))}
          </div>
          <Link href="#" className="text-sm text-[#722F37] hover:underline mt-4 inline-block">
            View all {mockVintage.year} wines &rarr;
          </Link>
        </div>

        {/* Vintage History */}
        <div className="bg-white rounded-lg border-[3px] border-[#1C1C1C] p-6">
          <h2 className="font-display text-xl font-semibold text-[#1C1C1C] mb-4">
            {mockVintage.region.name} Vintage Chart
          </h2>
          <div className="space-y-3">
            {mockVintageHistory.map((v) => (
              <Link
                key={v.year}
                href="#"
                className={`flex items-center justify-between p-3 rounded-lg transition-colors group ${
                  v.year === mockVintage.year ? 'bg-[#722F37]/5' : 'hover:bg-stone-50'
                }`}
              >
                <span className={`font-medium ${v.year === mockVintage.year ? 'text-[#722F37]' : 'text-[#1C1C1C]'} group-hover:text-[#722F37]`}>
                  {v.year}
                </span>
                <StarRating rating={v.rating} />
              </Link>
            ))}
          </div>
        </div>

        {/* Design Note */}
        <div className="mt-12 p-6 bg-[#722F37]/10 rounded-xl border border-[#722F37]/20">
          <h4 className="font-display font-semibold text-[#722F37] mb-2">Vintage Page Mockup</h4>
          <p className="text-gray-700 text-sm">
            Shows vintage conditions, quality rating, wines from that year, and historical vintage chart.
            Clicking from a wine review card would lead here.
          </p>
        </div>
      </div>
    </div>
  );
}
