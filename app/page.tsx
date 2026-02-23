import Link from 'next/link';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Demo articles
const featuredArticle = {
  title: 'Napa: An Inconvenient Truth',
  subtitle: 'The real threat to Napa isn\'t the thermometer—it\'s the balance sheet',
  category: 'Analysis',
  author: 'Wine Saint Editorial',
  date: 'January 27, 2026',
  slug: 'napa-inconvenient-truth',
};

const featuredVideo = {
  title: 'The Ginger Fox of Pupillin',
  category: 'Features',
  subtitle: 'Domaine Bornard and the Jura Wine Renaissance',
  author: 'Wine Saint Editorial',
  slug: 'ginger-fox-pupillin',
};

const articles = [
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
      'wineName': wine->name,
      'vintage': wine->vintage,
      'regionName': wine->region->name,
      'slug': wine->slug.current
    }
  `);

  return (
    <div className="bg-[#FAF7F2]">
      {/* Featured Split Hero */}
      <section className="border-b-3 border-[#1C1C1C]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Featured Article */}
          <Link href={`/articles/${featuredArticle.slug}`} className="group relative">
            <div className="aspect-[4/3] md:aspect-auto md:h-[400px] bg-gradient-to-br from-[#6d597a] to-[#457b9d] relative overflow-hidden">
              <div className="absolute inset-0 flex items-end p-6 md:p-10">
                <div>
                  <span className="inline-block px-3 py-1 bg-[#f4d35e] text-[#1C1C1C] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                    {featuredArticle.category}
                  </span>
                  <h2 className="font-serif text-2xl md:text-4xl italic text-white leading-tight group-hover:underline decoration-2">
                    {featuredArticle.title}
                  </h2>
                  <p className="mt-3 text-white/80 max-w-md text-sm">
                    {featuredArticle.subtitle}
                  </p>
                  <div className="mt-4 text-xs text-white/60">
                    By {featuredArticle.author} · {featuredArticle.date}
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Right: Featured Article */}
          <Link href={`/articles/${featuredVideo.slug}`} className="group relative">
            <div className="aspect-[4/3] md:aspect-auto md:h-[400px] bg-gradient-to-br from-[#722F37] to-[#ff6b35] relative overflow-hidden">
              {/* Content */}
              <div className="absolute inset-0 flex items-end p-6 md:p-10">
                <div>
                  <span className="inline-block px-3 py-1 bg-[#1C1C1C] text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                    {featuredVideo.category}
                  </span>
                  <h2 className="font-serif text-2xl md:text-4xl italic text-white leading-tight group-hover:underline decoration-2">
                    {featuredVideo.title}
                  </h2>
                  <p className="mt-3 text-white/80 max-w-md text-sm">
                    {featuredVideo.subtitle}
                  </p>
                  <div className="mt-4 text-xs text-white/60">
                    By {featuredVideo.author}
                  </div>
                </div>
              </div>
            </div>
          </Link>
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
                        {wine.wineName} {wine.vintage}
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
                      <h3 className="font-serif text-sm italic text-[#1C1C1C] group-hover:text-[#722F37] transition-colors line-clamp-1">
                        {wine.wineName}
                      </h3>
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
