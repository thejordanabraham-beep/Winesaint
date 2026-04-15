import Link from 'next/link';

const featuredArticle = {
  title: 'Napa: An Inconvenient Truth',
  subtitle: 'The real threat to Napa isn\'t the thermometer—it\'s the balance sheet',
  category: 'Analysis',
  author: 'Wine Saint Editorial',
  date: 'January 27, 2026',
  slug: 'napa-inconvenient-truth',
  gradient: 'from-[#722F37] to-[#457b9d]',
};

const articles = [
  {
    title: 'Wine Ratings Are Made Up and the Points Don\'t Matter',
    category: 'Opinion',
    author: 'Wine Saint Editorial',
    slug: 'wine-ratings-made-up',
    gradient: 'from-[#722F37] to-[#ff6b35]',
  },
  {
    title: 'The Ginger Fox of Pupillin',
    category: 'Features',
    author: 'Wine Saint Editorial',
    slug: 'ginger-fox-pupillin',
    gradient: 'from-[#6d597a] to-[#457b9d]',
  },
  {
    title: 'Loire Valley 2024: The Vintage Nobody Wanted But Somehow Survived',
    category: 'Vintage Report',
    author: 'Wine Saint Editorial',
    slug: 'loire-valley-2024-vintage',
    gradient: 'from-[#2a9d8f] to-[#457b9d]',
  },
  {
    title: 'A Wine Buyer\'s Guide to Savoie: France\'s Alpine Secret',
    category: 'Buying Guide',
    author: 'Wine Saint Editorial',
    slug: 'savoie-buyers-guide',
    gradient: 'from-[#2a9d8f] to-[#6d597a]',
  },
  {
    title: 'Russian River Valley: What\'s Old Is New Again',
    category: 'Features',
    author: 'Wine Saint Editorial',
    slug: 'russian-river-valley-whats-old-is-new',
    gradient: 'from-[#722F37] to-[#2a9d8f]',
  },
];

const categoryColors: Record<string, string> = {
  Analysis: 'bg-[#f4d35e] text-[#1C1C1C]',
  Opinion: 'bg-[#ff6b35] text-white',
  Features: 'bg-[#6d597a] text-white',
  'Vintage Report': 'bg-[#2a9d8f] text-white',
  'Buying Guide': 'bg-[#457b9d] text-white',
};

export default function ArticlesPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b-3 border-[#1C1C1C] bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#722F37]">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#1C1C1C]">Articles</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="border-b-3 border-[#1C1C1C] bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="font-serif text-5xl italic text-[#1C1C1C] mb-3">Articles</h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            Analysis, opinion, features, and dispatches from the world of wine.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Featured Hero Card */}
        <Link
          href={`/articles/${featuredArticle.slug}`}
          className="group fun-card bg-white border-3 border-[#1C1C1C] rounded-lg overflow-hidden block mb-10"
        >
          <div className={`bg-gradient-to-br ${featuredArticle.gradient} px-10 py-16 relative`}>
            <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full mb-4 ${categoryColors[featuredArticle.category] ?? 'bg-white text-[#1C1C1C]'}`}>
              {featuredArticle.category}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl italic text-white leading-tight mb-4 group-hover:underline">
              {featuredArticle.title}
            </h2>
            <p className="text-white/80 text-xl mb-6 max-w-2xl">
              {featuredArticle.subtitle}
            </p>
            <div className="flex items-center gap-3 text-sm text-white/70">
              <span>{featuredArticle.author}</span>
              <span>•</span>
              <span>{featuredArticle.date}</span>
            </div>
          </div>
        </Link>

        {/* Remaining Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group fun-card bg-white border-3 border-[#1C1C1C] rounded-lg overflow-hidden"
            >
              <div className={`bg-gradient-to-br ${article.gradient} aspect-[16/10] relative`}>
                <div className="absolute bottom-4 left-4">
                  <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${categoryColors[article.category] ?? 'bg-white text-[#1C1C1C]'}`}>
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl italic text-[#1C1C1C] leading-snug mb-2 group-hover:underline">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500">{article.author}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
