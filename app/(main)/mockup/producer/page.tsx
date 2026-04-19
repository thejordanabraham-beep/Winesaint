import Link from 'next/link';

const mockProducer = {
  name: 'Emmerich Knoll',
  slug: 'emmerich-knoll',
  region: { name: 'Wachau', slug: 'wachau' },
  country: 'Austria',
  founded: 1825,
  winemaker: 'Emmerich Knoll III',
  website: 'https://www.weingut-knoll.at',
  summary: 'One of the Wachau\'s most revered estates, Emmerich Knoll has been crafting benchmark Grüner Veltliner and Riesling from prime sites like Schütt, Loibenberg, and Kreutles since 1825.',
  description: `The Knoll estate sits at the heart of Dürnstein, one of the most picturesque villages in the Wachau. For nearly 200 years, the family has farmed some of the region's most prized vineyards, including the legendary Schütt, Loibenberg, Kellerberg, and Kreutles sites.

The house style emphasizes precision, minerality, and age-worthiness. Fermentations are long and cool, often extending into spring. The wines see extended lees contact, building texture and complexity. No malolactic fermentation is permitted, preserving the racy acidity that defines great Wachau wine.

Current winemaker Emmerich Knoll III continues the family tradition of producing some of Austria's most collectible white wines. The Smaragd bottlings from top sites regularly achieve decades of aging potential.`,
};

const mockWines = [
  { name: 'Grüner Veltliner Kreutles Smaragd', vintage: 2024, score: 7.7, slug: '#' },
  { name: 'Riesling Schütt Smaragd', vintage: 2024, score: 8.2, slug: '#' },
  { name: 'Grüner Veltliner Loibenberg Smaragd', vintage: 2024, score: 8.0, slug: '#' },
  { name: 'Riesling Kellerberg Smaragd', vintage: 2024, score: 8.5, slug: '#' },
  { name: 'Grüner Veltliner Kreutles Smaragd', vintage: 2023, score: 8.1, slug: '#' },
  { name: 'Riesling Schütt Smaragd', vintage: 2023, score: 8.4, slug: '#' },
];

const mockVineyards = [
  { name: 'Kreutles', slug: '#' },
  { name: 'Schütt', slug: '#' },
  { name: 'Loibenberg', slug: '#' },
  { name: 'Kellerberg', slug: '#' },
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

export default function ProducerMockup() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#722F37]">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/producers" className="hover:text-[#722F37]">Producers</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{mockProducer.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">

        {/* Producer Header */}
        <div className="bg-white rounded-lg border-[3px] border-[#1C1C1C] p-6 sm:p-8 mb-6">
          <div className="flex gap-6">
            {/* Label Image - Portrait orientation */}
            <div className="flex-shrink-0 w-24 sm:w-32 h-32 sm:h-44 bg-gradient-to-br from-stone-100 to-stone-200 rounded-lg border border-stone-300 flex items-center justify-center">
              <span className="text-stone-400 text-xs text-center px-2">Label</span>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1C1C1C] mb-2">
                {mockProducer.name}
              </h1>

              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                <Link href={`/regions/${mockProducer.region.slug}`} className="hover:text-[#722F37]">
                  {mockProducer.region.name}
                </Link>
                <span>•</span>
                <span>{mockProducer.country}</span>
                <span>•</span>
                <span>Est. {mockProducer.founded}</span>
              </div>

              <p className="text-gray-700 font-medium">
                {mockProducer.summary}
              </p>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          <div className="prose max-w-none">
            {mockProducer.description.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Quick Facts */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block">Winemaker</span>
                <span className="font-medium">{mockProducer.winemaker}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Founded</span>
                <span className="font-medium">{mockProducer.founded}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Website</span>
                <a href={mockProducer.website} className="font-medium text-[#722F37] hover:underline" target="_blank" rel="noopener noreferrer">
                  Visit site
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Vineyards */}
        <div className="bg-white rounded-lg border-[3px] border-[#1C1C1C] p-6 mb-6">
          <h2 className="font-display text-xl font-semibold text-[#1C1C1C] mb-4">
            Vineyards
          </h2>
          <div className="flex flex-wrap gap-2">
            {mockVineyards.map((vineyard) => (
              <Link
                key={vineyard.name}
                href={vineyard.slug}
                className="px-4 py-2 bg-stone-100 text-gray-700 rounded-lg hover:bg-stone-200 transition-colors"
              >
                {vineyard.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Wines */}
        <div className="bg-white rounded-lg border-[3px] border-[#1C1C1C] p-6">
          <h2 className="font-display text-xl font-semibold text-[#1C1C1C] mb-4">
            Wines
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
          <h4 className="font-display font-semibold text-[#722F37] mb-2">Producer Page Mockup</h4>
          <p className="text-gray-700 text-sm">
            Shows producer overview, vineyards they farm, and list of reviewed wines.
            Clicking from a wine review card would lead here.
          </p>
        </div>
      </div>
    </div>
  );
}
