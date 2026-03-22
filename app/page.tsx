import Link from 'next/link';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { createClient } from '@sanity/client';
import { LivexWidget } from '@/components/home/LivexWidget';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Demo articles
const articles = [
  {
    title: 'Napa: An Inconvenient Truth',
    subtitle: 'The real threat to Napa isn\'t the thermometer—it\'s the balance sheet',
    category: 'Analysis',
    author: 'Wine Saint Editorial',
    date: 'January 27, 2026',
    slug: 'napa-inconvenient-truth',
  },
  {
    title: 'The Ginger Fox of Pupillin',
    subtitle: 'Domaine Bornard and the Jura Wine Renaissance',
    category: 'Features',
    author: 'Wine Saint Editorial',
    slug: 'ginger-fox-pupillin',
  },
  {
    title: 'Wine Ratings Are Made Up and the Points Don\'t Matter',
    category: 'Opinion',
    author: 'Wine Saint Editorial',
    slug: 'wine-ratings-made-up',
  },
  {
    title: 'Loire Valley 2024: The Vintage Nobody Wanted But Somehow Survived',
    category: 'Vintage Report',
    author: 'Wine Saint Editorial',
    slug: 'loire-valley-2024-vintage',
  },
  {
    title: 'A Wine Buyer\'s Guide to Savoie: France\'s Alpine Secret',
    category: 'Buying Guide',
    author: 'Wine Saint Editorial',
    slug: 'savoie-buyers-guide',
  },
  {
    title: 'Russian River Valley: What\'s Old Is New Again',
    category: 'Features',
    author: 'Wine Saint Editorial',
    slug: 'russian-river-valley-whats-old-is-new',
  },
];

const vintageHighlights = [
  { region: 'Bordeaux', year: 2022, rating: 'Outstanding', slug: 'bordeaux' },
  { region: 'Burgundy', year: 2021, rating: 'Excellent', slug: 'burgundy' },
  { region: 'Napa Valley', year: 2022, rating: 'Outstanding', slug: 'napa-valley' },
  { region: 'Champagne', year: 2019, rating: 'Outstanding', slug: 'champagne' },
];

type PowerRanking = {
  score: number;
  producerName: string;
  wineName: string;
  vintage: number | string;
  regionName: string;
  slug: string;
};

export default async function Home() {
  // Fetch top-rated wines from the database
  const powerRankings: PowerRanking[] = await client.fetch(`
    *[_type == 'review' && defined(score) && defined(wine->slug.current)] | order(score desc)[0...4] {
      score,
      'producerName': wine->producer->name,
      'wineName': wine->name,
      'vintage': wine->vintage,
      'regionName': wine->region->name,
      'slug': wine->slug.current
    }
  `);

  return (
    <div className="bg-[#FAF7F2]">
      {/* Hero Section */}
      <section className="border-b-3 border-[#1C1C1C] bg-gradient-to-br from-[#722F37] to-[#6d597a]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center">
            <h1 className="font-serif text-3xl md:text-5xl italic text-white mb-3">
              #1 Wine Education Resource
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-3xl mx-auto">
              In depth guides, expert reviews, producer profiles, detailed maps and learning resources for experienced wine enthusiasts as well as those just getting started
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-4xl mx-auto mb-6">
              <div className="bg-white/10 backdrop-blur border-2 border-white/20 rounded-lg p-3">
                <div className="text-2xl md:text-3xl font-bold text-[#f4d35e] mb-1">2,500+</div>
                <div className="text-white text-xs md:text-sm">In-Depth Wine Region & Vineyard Guides</div>
              </div>

              <div className="bg-white/10 backdrop-blur border-2 border-white/20 rounded-lg p-3">
                <div className="text-2xl md:text-3xl font-bold text-[#f4d35e] mb-1">10,000+</div>
                <div className="text-white text-xs md:text-sm">Expert Wine Reviews</div>
              </div>

              <div className="bg-white/10 backdrop-blur border-2 border-white/20 rounded-lg p-3">
                <div className="text-2xl md:text-3xl font-bold text-[#f4d35e] mb-1">✓</div>
                <div className="text-white text-xs md:text-sm">Maps, Educational Materials & Original Articles</div>
              </div>
            </div>

            {/* Additional Copy */}
            <div className="max-w-3xl mx-auto">
              <p className="text-white/80 text-base md:text-lg leading-relaxed">
                San Francisco's Premier Independent Wine Media. Wine Saint provides a full circle approach to wine education for experts and novices alike with an emphasis on California, small producers and good people.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Articles Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl italic">Latest Stories</h2>
              <Link href="/articles" className="pill-btn text-sm">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {articles.map((article, index) => {
                const colors = ['bg-[#722F37]', 'bg-[#457b9d]', 'bg-[#f4d35e]', 'bg-[#2a9d8f]'];
                return (
                  <Link
                    key={article.slug}
                    href={`/articles/${article.slug}`}
                    className="group fun-card bg-white border-3 border-[#1C1C1C] rounded-lg overflow-hidden"
                  >
                    <article>
                      <div className={`aspect-[16/10] ${colors[index]} relative`}>
                        <div className="absolute bottom-4 left-4">
                          <span className="inline-block px-3 py-1 bg-[#1C1C1C] text-white text-xs font-bold uppercase tracking-wider rounded-full">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37] transition-colors">
                          {article.title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          By {article.author}
                        </p>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Power Rankings */}
            <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-6">
              <h2 className="font-serif text-xl italic mb-6">February 2026: Power Rankings</h2>

              <div className="space-y-4">
                {powerRankings.map((wine, index) => (
                  <Link
                    key={`${wine.slug}-${index}`}
                    href={`/wines/${wine.slug}`}
                    className="flex items-center gap-4 group p-2 -mx-2 rounded-lg hover:bg-[#722F37]/10 transition-colors"
                  >
                    <ScoreBadge score={wine.score} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1C1C1C] group-hover:text-[#722F37] transition-colors truncate">
                        {wine.producerName} {wine.wineName} {wine.vintage}
                      </p>
                      <p className="text-sm text-gray-500">{wine.regionName}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                href="/wines"
                className="mt-6 block text-center bg-[#1C1C1C] text-white py-3 rounded-lg font-semibold hover:bg-[#722F37] transition-colors"
              >
                All Reviews
              </Link>
            </div>

            {/* Liv-ex Widget */}
            <LivexWidget />

            {/* Vintage Chart */}
            <div className="bg-[#f4d35e] border-3 border-[#1C1C1C] rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="font-serif text-xl italic">Vintage Chart 📊</h2>
              </div>
              <div className="bg-white p-4">
                <div className="space-y-2">
                  {vintageHighlights.map((vintage) => (
                    <Link
                      key={`${vintage.slug}-${vintage.year}`}
                      href={`/vintages/${vintage.slug}/${vintage.year}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f4d35e]/20 transition-colors group"
                    >
                      <div>
                        <p className="font-semibold text-[#1C1C1C] group-hover:text-[#722F37]">
                          {vintage.region}
                        </p>
                        <p className="text-sm text-gray-500">{vintage.year}</p>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 bg-[#2a9d8f] text-white rounded-full">
                        {vintage.rating}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-[#722F37] border-3 border-[#1C1C1C] rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="font-serif text-xl italic text-white">Stay Thirsty 💌</h3>
                <p className="mt-2 text-sm text-white/80">
                  Weekly picks, hot takes, and good vibes.
                </p>
              </div>
              <div className="bg-white p-6">
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border-2 border-[#1C1C1C] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#1C1C1C] text-white py-3 rounded-lg font-semibold hover:bg-[#722F37] transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor's Picks */}
      <section className="bg-[#1C1C1C] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-3xl italic text-white">Editor&apos;s Picks ✨</h2>
            <Link href="/wines" className="pill-btn text-white border-white hover:bg-white hover:text-[#1C1C1C]">
              Browse All
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {powerRankings.map((wine, index) => {
              const colors = ['bg-[#6d597a]', 'bg-[#457b9d]', 'bg-[#2a9d8f]', 'bg-[#722F37]'];
              return (
                <Link
                  key={`${wine.slug}-editor-${index}`}
                  href={`/wines/${wine.slug}`}
                  className="group"
                >
                  <div className="fun-card bg-white border-3 border-[#1C1C1C] rounded-lg overflow-hidden">
                    <div className={`aspect-[3/4] ${colors[index]} relative flex items-center justify-center`}>
                      <div className="w-12 h-40 bg-white/20 rounded-sm" />
                      <div className="absolute top-3 right-3">
                        <ScoreBadge score={wine.score} size="sm" />
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-[#1C1C1C] group-hover:text-[#722F37] transition-colors truncate text-sm">
                        {wine.producerName} {wine.wineName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{wine.vintage} · {wine.regionName}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
