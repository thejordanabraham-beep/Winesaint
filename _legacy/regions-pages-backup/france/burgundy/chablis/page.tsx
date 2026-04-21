import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

// Chablis Grand Crus and Premier Crus
const CHABLIS_GRAND_CRUS = [
  { name: 'Blanchot', slug: 'blanchot' },
  { name: 'Bougros', slug: 'bougros' },
  { name: 'Les Clos', slug: 'les-clos' },
  { name: 'Grenouilles', slug: 'grenouilles' },
  { name: 'Preuses', slug: 'preuses' },
  { name: 'Valmur', slug: 'valmur' },
  { name: 'Vaudésir', slug: 'vaudesir' }
] as const;

const CHABLIS_PREMIER_CRUS = [
  { name: 'Beauroy', slug: 'beauroy' },
  { name: 'Berdiot', slug: 'berdiot' },
  { name: 'Butteaux', slug: 'butteaux' },
  { name: 'Côte de Jouan', slug: 'cote-de-jouan' },
  { name: 'Côte de Savant', slug: 'cote-de-savant' },
  { name: 'Côte de Vaubarousse', slug: 'cote-de-vaubarousse' },
  { name: 'Forêt', slug: 'foret' },
  { name: 'Fourchaume', slug: 'fourchaume' },
  { name: 'Les Beauregards', slug: 'les-beauregards' },
  { name: 'Les Fourneaux', slug: 'les-fourneaux' },
  { name: 'Mont de Milieu', slug: 'mont-de-milieu' },
  { name: 'Montée de Tonnerre', slug: 'montee-de-tonnerre' },
  { name: 'Montmains', slug: 'montmains' },
  { name: 'Vaillons', slug: 'vaillons' },
  { name: 'Vaucoupin', slug: 'vaucoupin' },
  { name: 'Vaudevey', slug: 'vaudevey' },
  { name: 'Vosgros', slug: 'vosgros' }
] as const;

export default async function ChablisPage() {
  // Read and parse markdown file
  const guidesDir = path.join(process.cwd(), 'guides');
  const filePath = path.join(guidesDir, 'chablis-guide.md');

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
        {/* Custom Sidebar for Chablis - Grand Crus and Premier Crus */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-8">
            <h3 className="font-bold text-lg mb-4 text-[#722F37]">Climats</h3>

            {/* Grand Crus */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-amber-600 mb-2 pl-2">
                Grand Cru ({CHABLIS_GRAND_CRUS.length})
              </h4>
              <nav className="space-y-1">
                {CHABLIS_GRAND_CRUS.map((climat) => (
                  <Link
                    key={climat.slug}
                    href={`/regions/france/burgundy/chablis/${climat.slug}`}
                    className="block px-3 py-1.5 rounded text-sm hover:bg-amber-50 transition-colors hover:text-amber-700"
                  >
                    {climat.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Premier Crus */}
            <div>
              <h4 className="text-xs font-semibold text-[#722F37] mb-2 pl-2">
                Premier Cru ({CHABLIS_PREMIER_CRUS.length})
              </h4>
              <nav className="space-y-1">
                {CHABLIS_PREMIER_CRUS.map((climat) => (
                  <Link
                    key={climat.slug}
                    href={`/regions/france/burgundy/chablis/${climat.slug}`}
                    className="block px-3 py-1.5 rounded text-sm hover:bg-[#722F37]/10 transition-colors hover:text-[#722F37]"
                  >
                    {climat.name}
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
            <Link href="/regions/france/burgundy" className="hover:text-[#722F37] transition-colors">
              Burgundy
            </Link>
          </nav>

          {/* Page Header */}
          <header className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Chablis</h1>
            <p className="text-gray-600 text-lg">Burgundy, France</p>
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
