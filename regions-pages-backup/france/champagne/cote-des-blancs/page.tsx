import RegionLayout from '@/components/RegionLayout';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

// Côte des Blancs villages
const COTE_DES_BLANCS_VILLAGES = {
  grandCrus: [
    { name: 'Avize', slug: 'avize' },
    { name: 'Chouilly', slug: 'chouilly' },
    { name: 'Cramant', slug: 'cramant' },
    { name: 'Le Mesnil-sur-Oger', slug: 'le-mesnil-sur-oger' },
    { name: 'Oger', slug: 'oger' },
    { name: 'Oiry', slug: 'oiry' }
  ],
  premierCrus: [
    { name: 'Bergères-les-Vertus', slug: 'bergeres-les-vertus' },
    { name: 'Cuis', slug: 'cuis' },
    { name: 'Etrechy', slug: 'etrechy' },
    { name: 'Grauves', slug: 'grauves' },
    { name: 'Vertus', slug: 'vertus' },
    { name: 'Villeneuve-Renneville', slug: 'villeneuve-renneville' },
    { name: 'Voipreux', slug: 'voipreux' }
  ]
} as const;

export default async function CoteDesBlancPage() {
  // Read and parse markdown file
  const guidesDir = path.join(process.cwd(), 'guides');
  const filePath = path.join(guidesDir, 'côte-des-blancs-guide.md');

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
        {/* Sidebar with villages */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-2">
            <h3 className="font-bold text-lg mb-4 text-[#722F37]">Villages</h3>

            {/* Grand Crus */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-amber-600 mb-2 pl-2">
                Grand Cru ({COTE_DES_BLANCS_VILLAGES.grandCrus.length})
              </h4>
              <nav className="space-y-1">
                {COTE_DES_BLANCS_VILLAGES.grandCrus.map((village) => (
                  <Link
                    key={village.slug}
                    href={`/regions/france/champagne/cote-des-blancs/${village.slug}`}
                    className="block px-3 py-1.5 rounded text-sm hover:bg-amber-50 transition-colors hover:text-amber-700"
                  >
                    {village.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Premier Crus */}
            <div>
              <h4 className="text-xs font-semibold text-[#722F37] mb-2 pl-2">
                Premier Cru ({COTE_DES_BLANCS_VILLAGES.premierCrus.length})
              </h4>
              <nav className="space-y-1">
                {COTE_DES_BLANCS_VILLAGES.premierCrus.map((village) => (
                  <Link
                    key={village.slug}
                    href={`/regions/france/champagne/cote-des-blancs/${village.slug}`}
                    className="block px-3 py-1.5 rounded text-sm hover:bg-[#722F37]/10 transition-colors hover:text-[#722F37]"
                  >
                    {village.name}
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
            <Link href="/regions/france" className="hover:text-[#722F37] transition-colors">
              France
            </Link>
            <span>›</span>
            <Link href="/regions/france/champagne" className="hover:text-[#722F37] transition-colors">
              Champagne
            </Link>
          </nav>

          {/* Page Header */}
          <header className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Côte des Blancs</h1>
            <p className="text-gray-600 text-lg">Champagne, France</p>
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
