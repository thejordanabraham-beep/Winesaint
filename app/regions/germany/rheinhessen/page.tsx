import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

// Rheinhessen Vineyards grouped by VDP Classification
const RHEINHESSEN_VINEYARDS = {
  grosseLage: [
    { name: 'Aulerde', slug: 'aulerde' },
    { name: 'Brudersberg', slug: 'brudersberg' },
    { name: 'Brunnenhauschen', slug: 'brunnenhauschen' },
    { name: 'Burgel', slug: 'burgel' },
    { name: 'Burgweg', slug: 'burgweg' },
    { name: 'Falkenberg', slug: 'falkenberg' },
    { name: 'Fenchelberg', slug: 'fenchelberg' },
    { name: 'Frauenberg', slug: 'frauenberg' },
    { name: 'Geiersberg', slug: 'geiersberg' },
    { name: 'Glock', slug: 'glock' },
    { name: 'Heerkretz', slug: 'heerkretz' },
    { name: 'Herrenberg', slug: 'herrenberg' },
    { name: 'Hipping', slug: 'hipping' },
    { name: 'Hollberg', slug: 'hollberg' },
    { name: 'Hollenbrand', slug: 'hollenbrand' },
    { name: 'Honigberg', slug: 'honigberg' },
    { name: 'Horn', slug: 'horn' },
    { name: 'Hundertgulden', slug: 'hundertgulden' },
    { name: 'Kirchberg', slug: 'kirchberg' },
    { name: 'Kirchenstuck', slug: 'kirchenstuck' },
    { name: 'Kirchspiel', slug: 'kirchspiel' },
    { name: 'Kloppberg', slug: 'kloppberg' },
    { name: 'Kranzberg', slug: 'kranzberg' },
    { name: 'Kreuz', slug: 'kreuz' },
    { name: 'Leckerberg', slug: 'leckerberg' },
    { name: 'Liebfrauenstift Kirchenstuck', slug: 'liebfrauenstift-kirchenstuck' },
    { name: 'Morstein', slug: 'morstein' },
    { name: 'Oberer Hubacker', slug: 'oberer-hubacker' },
    { name: 'Olberg', slug: 'olberg' },
    { name: 'Orbel', slug: 'orbel' },
    { name: 'Pares', slug: 'pares' },
    { name: 'Paterberg', slug: 'paterberg' },
    { name: 'Pettenthal', slug: 'pettenthal' },
    { name: 'Rothenberg', slug: 'rothenberg' },
    { name: 'Sacktrager', slug: 'sacktrager' },
    { name: 'Scharlachberg', slug: 'scharlachberg' },
    { name: 'Schloss Westerhaus', slug: 'schloss-westerhaus' },
    { name: 'Steinacker', slug: 'steinacker' },
    { name: 'Tafelstein', slug: 'tafelstein' },
    { name: 'Zehnmorgen', slug: 'zehnmorgen' },
    { name: 'Zellerweg Am Schwarzen Herrgott', slug: 'zellerweg-am-schwarzen-herrgott' },
  ],
};

export default async function RheinhessenPage() {
  // Read and parse markdown file
  const guidesDir = path.join(process.cwd(), 'guides');
  const filePath = path.join(guidesDir, 'rheinhessen-guide.md');

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
        {/* Vineyard Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <h3 className="font-bold text-lg mb-4 text-[#722F37]">Vineyards</h3>

            {/* Grosse Lage */}
            <div className="mb-6">
              <h4 className="font-semibold text-sm text-gray-700 mb-2 px-3">Grosse Lage</h4>
              <nav className="space-y-1">
                {RHEINHESSEN_VINEYARDS.grosseLage.map((vineyard) => (
                  <Link
                    key={vineyard.slug}
                    href={`/regions/germany/rheinhessen/${vineyard.slug}`}
                    className="block px-3 py-1.5 rounded text-sm hover:bg-[#722F37]/10 transition-colors hover:text-[#722F37]"
                  >
                    {vineyard.name}
                  </Link>
                ))}
              </nav>
            </div>
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
            <Link href="/regions/germany" className="hover:text-[#722F37] transition-colors">
              Germany
            </Link>
          </nav>

          {/* Page Header */}
          <header className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Rheinhessen</h1>
            <p className="text-gray-600 text-lg">Germany</p>
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
