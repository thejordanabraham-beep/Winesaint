import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

// Rheingau Vineyards grouped by VDP Classification
const RHEINGAU_VINEYARDS = {
  grosseLage: [
    { name: 'Baikenkopf', slug: 'baikenkopf' },
    { name: 'Berg Kaisersteinfels', slug: 'berg-kaisersteinfels' },
    { name: 'Berg Roseneck', slug: 'berg-roseneck' },
    { name: 'Berg Rottland', slug: 'berg-rottland' },
    { name: 'Berg Schlossberg', slug: 'berg-schlossberg' },
    { name: 'Domprasenz', slug: 'domprasenz' },
    { name: 'Doosberg', slug: 'doosberg' },
    { name: 'Gehrn Kesselring', slug: 'gehrn-kesselring' },
    { name: 'Grafenberg', slug: 'grafenberg' },
    { name: 'Greiffenberg', slug: 'greiffenberg' },
    { name: 'Hasensprung', slug: 'hasensprung' },
    { name: 'Hassel', slug: 'hassel' },
    { name: 'Hohenrain', slug: 'hohenrain' },
    { name: 'Holle', slug: 'holle' },
    { name: 'Hollenberg', slug: 'hollenberg' },
    { name: 'Im Landberg', slug: 'im-landberg' },
    { name: 'Im Rothenberg', slug: 'im-rothenberg' },
    { name: 'Jesuitengarten', slug: 'jesuitengarten' },
    { name: 'Jungfer', slug: 'jungfer' },
    { name: 'Kapellenberg', slug: 'kapellenberg' },
    { name: 'Kirchenpfad', slug: 'kirchenpfad' },
    { name: 'Kirchenstuck Im Stein', slug: 'kirchenstuck-im-stein' },
    { name: 'Klaus', slug: 'klaus' },
    { name: 'Klauserweg', slug: 'klauserweg' },
    { name: 'Konigin Victoriaberg Dechantenruhe', slug: 'konigin-victoriaberg-dechantenruhe' },
    { name: 'Langenberg', slug: 'langenberg' },
    { name: 'Lenchen', slug: 'lenchen' },
    { name: 'Lenchen Eiserberg', slug: 'lenchen-eiserberg' },
    { name: 'Marcobrunn', slug: 'marcobrunn' },
    { name: 'Mauerchen', slug: 'mauerchen' },
    { name: 'Morschberg', slug: 'morschberg' },
    { name: 'Nonnberg Fuhshohl', slug: 'nonnberg-fuhshohl' },
    { name: 'Nonnberg Vier Morgen', slug: 'nonnberg-vier-morgen' },
    { name: 'Nussbrunnen', slug: 'nussbrunnen' },
    { name: 'Pfaffenwies Roder', slug: 'pfaffenwies-roder' },
    { name: 'Reichestal', slug: 'reichestal' },
    { name: 'Rodchen', slug: 'rodchen' },
    { name: 'Rosengarten', slug: 'rosengarten' },
    { name: 'Rothenberg', slug: 'rothenberg' },
    { name: 'Sankt Nikolaus', slug: 'sankt-nikolaus' },
    { name: 'Schlenzenberg', slug: 'schlenzenberg' },
    { name: 'Schloss Johannisberg', slug: 'schloss-johannisberg' },
    { name: 'Schlossberg', slug: 'schlossberg' },
    { name: 'Schonhell', slug: 'schonhell' },
    { name: 'Seligmacher', slug: 'seligmacher' },
    { name: 'Siegelsberg', slug: 'siegelsberg' },
    { name: 'Steinberg Goldener Becher', slug: 'steinberg-goldener-becher' },
    { name: 'Unterer Bischofsberg', slug: 'unterer-bischofsberg' },
    { name: 'Walkenberg', slug: 'walkenberg' },
    { name: 'Weiss Erd', slug: 'weiss-erd' },
    { name: 'Wisselbrunnen', slug: 'wisselbrunnen' },
  ],
  other: [
    { name: 'Erbacher Marcobrunn', slug: 'erbacher-marcobrunn' },
    { name: 'Rauenthaler Baiken', slug: 'rauenthaler-baiken' },
    { name: 'Rudesheimer Berg Schlossberg', slug: 'rudesheimer-berg-schlossberg' },
  ],
};

export default async function RheingauPage() {
  // Read and parse markdown file
  const guidesDir = path.join(process.cwd(), 'guides');
  const filePath = path.join(guidesDir, 'rheingau-guide.md');

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
                {RHEINGAU_VINEYARDS.grosseLage.map((vineyard) => (
                  <Link
                    key={vineyard.slug}
                    href={`/regions/germany/rheingau/${vineyard.slug}`}
                    className="block px-3 py-1.5 rounded text-sm hover:bg-[#722F37]/10 transition-colors hover:text-[#722F37]"
                  >
                    {vineyard.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Other Vineyards */}
            {RHEINGAU_VINEYARDS.other.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-sm text-gray-700 mb-2 px-3">Other Vineyards</h4>
                <nav className="space-y-1">
                  {RHEINGAU_VINEYARDS.other.map((vineyard) => (
                    <Link
                      key={vineyard.slug}
                      href={`/regions/germany/rheingau/${vineyard.slug}`}
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
            <Link href="/regions/germany" className="hover:text-[#722F37] transition-colors">
              Germany
            </Link>
          </nav>

          {/* Page Header */}
          <header className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Rheingau</h1>
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
