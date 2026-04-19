import Link from 'next/link';

const mockVineyard = {
  name: 'Kreutles',
  slug: 'kreutles',
  region: { name: 'Wachau', slug: 'wachau' },
  country: 'Austria',
  elevation: '280-350m',
  aspect: 'South',
  soil: 'Gneiss with loess deposits',
  acreage: 4.2,
  summary: 'A steep, high-altitude site on weathered gneiss soils above Dürnstein. South-facing terraces capture intense sunlight while cool air drainage preserves freshness.',
  description: `Kreutles is one of the highest vineyard sites in the Wachau, situated on the steep terraced slopes above the village of Dürnstein. The vineyard rises to over 350 meters, making it one of the coolest sites in the region despite its full southern exposure.

The soils are predominantly weathered gneiss, the ancient metamorphic rock that defines much of the Wachau's terroir. Thin layers of loess overlay the bedrock in places, adding water retention capacity. The combination produces wines of exceptional mineral intensity.

The steep gradient and southern aspect maximize sun exposure, critical at these elevations where ripening can be challenging. Meanwhile, cool air drainage from the hills above preserves acidity and freshness. The diurnal temperature variation is among the highest in the Wachau.

Grüner Veltliner dominates the plantings, producing wines of intense concentration with pronounced citrus and peppery character. The best examples can age for 15-20 years, developing extraordinary complexity.`,
};

const mockProducers = [
  { name: 'Emmerich Knoll', slug: '#' },
  { name: 'F.X. Pichler', slug: '#' },
];

const mockWines = [
  { name: 'Emmerich Knoll Grüner Veltliner Kreutles Smaragd', vintage: 2024, score: 7.7, slug: '#' },
  { name: 'Emmerich Knoll Grüner Veltliner Kreutles Smaragd', vintage: 2023, score: 8.1, slug: '#' },
  { name: 'F.X. Pichler Grüner Veltliner Kreutles Smaragd', vintage: 2024, score: 8.3, slug: '#' },
  { name: 'F.X. Pichler Grüner Veltliner Kreutles Smaragd', vintage: 2023, score: 8.5, slug: '#' },
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

export default function VineyardMockup() {
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
          <span className="text-gray-700">{mockVineyard.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">

        {/* Vineyard Header */}
        <div className="bg-white rounded-lg border-[3px] border-[#1C1C1C] p-6 sm:p-8 mb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1C1C] mb-2">
            {mockVineyard.name}
          </h1>

          <Link href={`/regions/${mockVineyard.region.slug}`} className="text-gray-600 hover:text-[#722F37]">
            {mockVineyard.region.name}, {mockVineyard.country}
          </Link>

          <p className="text-lg text-gray-700 font-medium mt-4 mb-6">
            {mockVineyard.summary}
          </p>

          {/* Site Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-stone-50 rounded-lg mb-6">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide block">Elevation</span>
              <span className="font-medium">{mockVineyard.elevation}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide block">Aspect</span>
              <span className="font-medium">{mockVineyard.aspect}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide block">Soil</span>
              <span className="font-medium">{mockVineyard.soil}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide block">Size</span>
              <span className="font-medium">{mockVineyard.acreage} ha</span>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          <div className="prose max-w-none">
            {mockVineyard.description.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Producers */}
        <div className="bg-white rounded-lg border-[3px] border-[#1C1C1C] p-6 mb-6">
          <h2 className="font-display text-xl font-semibold text-[#1C1C1C] mb-4">
            Producers
          </h2>
          <div className="flex flex-wrap gap-2">
            {mockProducers.map((producer) => (
              <Link
                key={producer.name}
                href={producer.slug}
                className="px-4 py-2 bg-stone-100 text-gray-700 rounded-lg hover:bg-stone-200 transition-colors"
              >
                {producer.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Wines from this Vineyard */}
        <div className="bg-white rounded-lg border-[3px] border-[#1C1C1C] p-6">
          <h2 className="font-display text-xl font-semibold text-[#1C1C1C] mb-4">
            Wines from {mockVineyard.name}
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
                    {wine.vintage} {wine.name}
                  </p>
                </div>
                <ScoreBadge score={wine.score} />
              </Link>
            ))}
          </div>
          <Link href="#" className="text-sm text-[#722F37] hover:underline mt-4 inline-block">
            View all wines &rarr;
          </Link>
        </div>

        {/* Design Note */}
        <div className="mt-12 p-6 bg-[#722F37]/10 rounded-xl border border-[#722F37]/20">
          <h4 className="font-display font-semibold text-[#722F37] mb-2">Vineyard Page Mockup</h4>
          <p className="text-gray-700 text-sm">
            Shows vineyard terroir details, producers who farm it, and wines from the site.
            Clicking from a wine review card would lead here.
          </p>
        </div>
      </div>
    </div>
  );
}
