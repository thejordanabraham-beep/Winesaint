import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

// Bas-Rhin Grand Crus (northern Alsace)
const BAS_RHIN_GRAND_CRUS = [
  { name: 'Altenberg de Bergbieten', slug: 'altenberg-de-bergbieten' },
  { name: 'Altenberg de Wolxheim', slug: 'altenberg-de-wolxheim' },
  { name: 'Bruderthal', slug: 'bruderthal' },
  { name: 'Engelberg', slug: 'engelberg' },
  { name: 'Frankstein', slug: 'frankstein' },
  { name: 'Kastelberg', slug: 'kastelberg' },
  { name: 'Kirchberg de Barr', slug: 'kirchberg-de-barr' },
  { name: 'Moenchberg', slug: 'moenchberg' },
  { name: 'Muenchberg', slug: 'muenchberg' },
  { name: 'Praelatenberg', slug: 'praelatenberg' },
  { name: 'Winzenberg', slug: 'winzenberg' },
  { name: 'Zotzenberg', slug: 'zotzenberg' },
] as const;

// Bas-Rhin Lieux-Dits (placeholder - to be populated)
const BAS_RHIN_LIEUX_DITS: Array<{ name: string; slug: string }> = [
  // To be added based on data
];

export default async function BasRhinPage() {
  // Read and parse markdown file
  const guidesDir = path.join(process.cwd(), 'guides');
  const filePath = path.join(guidesDir, 'bas-rhin-guide.md');

  let contentHtml = '';

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const processedContent = await remark()
      .use(html)
      .process(fileContent);
    contentHtml = processedContent.toString();
  } catch (error) {
    contentHtml = '<p class="text-gray-600">Guide content coming soon...</p>';
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex gap-8">
        {/* Custom Sidebar for Bas-Rhin - Grand Crus and Lieux-Dits */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-2">
            <h3 className="font-bold text-lg mb-4 text-[#722F37]">Vineyards</h3>

            {/* Grand Crus */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-amber-600 mb-2 pl-2">
                Grand Cru ({BAS_RHIN_GRAND_CRUS.length})
              </h4>
              <nav className="space-y-1">
                {BAS_RHIN_GRAND_CRUS.map((vineyard) => (
                  <Link
                    key={vineyard.slug}
                    href={`/regions/france/alsace/bas-rhin/${vineyard.slug}`}
                    className="block px-3 py-1.5 rounded text-sm hover:bg-amber-50 transition-colors hover:text-amber-700"
                  >
                    {vineyard.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Lieux-Dits */}
            {BAS_RHIN_LIEUX_DITS.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-[#722F37] mb-2 pl-2">
                  Lieux-Dits ({BAS_RHIN_LIEUX_DITS.length})
                </h4>
                <nav className="space-y-1">
                  {BAS_RHIN_LIEUX_DITS.map((vineyard) => (
                    <Link
                      key={vineyard.slug}
                      href={`/regions/france/alsace/bas-rhin/${vineyard.slug}`}
                      className="block px-3 py-1.5 rounded text-sm hover:bg-[#722F37]/10 transition-colors hover:text-[#722F37]"
                    >
                      {vineyard.name}
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 max-w-5xl">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
            <Link href="/regions" className="hover:text-[#722F37] transition-colors">
              Wine Region Guide
            </Link>
            <span>›</span>
            <Link href="/regions/france" className="hover:text-[#722F37] transition-colors">
              France
            </Link>
            <span>›</span>
            <Link href="/regions/france/alsace" className="hover:text-[#722F37] transition-colors">
              Alsace
            </Link>
          </nav>

          {/* Page Header */}
          <header className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Bas-Rhin</h1>
            <p className="text-gray-600 text-lg">Alsace, France</p>
          </header>

          {/* Markdown Content */}
          <article
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-[#722F37] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </main>
      </div>
    </div>
  );
}
