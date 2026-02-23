import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

// VDP Vineyard Classifications for Mittelmosel
const VINEYARDS = {
  grosseLage: [
    { name: 'Wehlener Sonnenuhr', slug: 'wehlener-sonnenuhr' },
    { name: 'Erdener Prälat', slug: 'erdener-pralat' },
    { name: 'Erdener Treppchen', slug: 'erdener-treppchen' },
    { name: 'Ürziger Würzgarten', slug: 'urziger-wurzgarten' },
    { name: 'Graacher Domprobst', slug: 'graacher-domprobst' },
    { name: 'Graacher Himmelreich', slug: 'graacher-himmelreich' },
    { name: 'Bernkasteler Doctor', slug: 'bernkasteler-doctor' },
    { name: 'Brauneberger Juffer-Sonnenuhr', slug: 'brauneberger-juffer-sonnenuhr' },
    { name: 'Piesporter Goldtröpfchen', slug: 'piesporter-goldtropfchen' },
    { name: 'Trittenheimer Apotheke', slug: 'trittenheimer-apotheke' },
  ],
  ersteLage: [
    { name: 'Ürziger Goldwingert', slug: 'urziger-goldwingert' },
    { name: 'Erdener Busslay', slug: 'erdener-busslay' },
    { name: 'Zeltinger Sonnenuhr', slug: 'zeltinger-sonnenuhr' },
    { name: 'Graacher Abtsberg', slug: 'graacher-abtsberg' },
    { name: 'Bernkasteler Lay', slug: 'bernkasteler-lay' },
    { name: 'Lieser Niederberg Helden', slug: 'lieser-niederberg-helden' },
    { name: 'Brauneberger Juffer', slug: 'brauneberger-juffer' },
    { name: 'Piesporter Domherr', slug: 'piesporter-domherr' },
    { name: 'Wintricher Ohligsberg', slug: 'wintricher-ohligsberg' },
    { name: 'Kestener Paulinshofberg', slug: 'kestener-paulinshofberg' },
  ],
};

export default async function MittelmoselPage() {
  // Read and parse markdown file
  const guidesDir = path.join(process.cwd(), 'guides');
  const filePath = path.join(guidesDir, 'mittelmosel-guide.md');

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

  const totalVineyards = VINEYARDS.grosseLage.length + VINEYARDS.ersteLage.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex gap-8">
        {/* Sidebar - VDP Vineyards */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-2">
            <h3 className="font-bold text-lg mb-4 text-[#722F37]">
              Vineyards ({totalVineyards})
            </h3>

            {/* Grosse Lage */}
            <section className="mb-6">
              <h4 className="text-xs font-semibold text-[#722F37] mb-2 pl-2 uppercase tracking-wide">
                VDP Grosse Lage ({VINEYARDS.grosseLage.length})
              </h4>
              <nav className="space-y-1">
                {VINEYARDS.grosseLage.map((vineyard) => (
                  <Link
                    key={vineyard.slug}
                    href={`/regions/germany/mosel/mittelmosel/${vineyard.slug}`}
                    className="block px-3 py-1.5 rounded text-sm hover:bg-[#722F37]/10 transition-colors hover:text-[#722F37]"
                  >
                    {vineyard.name}
                  </Link>
                ))}
              </nav>
            </section>

            {/* Erste Lage */}
            <section>
              <h4 className="text-xs font-semibold text-gray-600 mb-2 pl-2 uppercase tracking-wide">
                VDP Erste Lage ({VINEYARDS.ersteLage.length})
              </h4>
              <nav className="space-y-1">
                {VINEYARDS.ersteLage.map((vineyard) => (
                  <Link
                    key={vineyard.slug}
                    href={`/regions/germany/mosel/mittelmosel/${vineyard.slug}`}
                    className="block px-3 py-1.5 rounded text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {vineyard.name}
                  </Link>
                ))}
              </nav>
            </section>
          </div>
        </aside>

        {/* Main Content */}
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
            <span>›</span>
            <Link href="/regions/germany/mosel" className="hover:text-[#722F37] transition-colors">
              Mosel
            </Link>
          </nav>

          {/* Page Header */}
          <header className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mittelmosel</h1>
            <p className="text-gray-600 text-lg">Middle Mosel, Germany</p>
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
