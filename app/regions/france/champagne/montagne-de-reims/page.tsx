import RegionLayout from '@/components/RegionLayout';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

// Montagne de Reims villages
const MONTAGNE_DE_REIMS_VILLAGES = {
  grandCrus: [
    { name: 'Ambonnay', slug: 'ambonnay' },
    { name: 'Beaumont-sur-Vesle', slug: 'beaumont-sur-vesle' },
    { name: 'Bouzy', slug: 'bouzy' },
    { name: 'Louvois', slug: 'louvois' },
    { name: 'Mailly-Champagne', slug: 'mailly-champagne' },
    { name: 'Puisieulx', slug: 'puisieulx' },
    { name: 'Sillery', slug: 'sillery' },
    { name: 'Verzenay', slug: 'verzenay' },
    { name: 'Verzy', slug: 'verzy' }
  ],
  premierCrus: [
    { name: 'Bezannes', slug: 'bezannes' },
    { name: 'Chamery', slug: 'chamery' },
    { name: 'Chigny-les-Roses', slug: 'chigny-les-roses' },
    { name: 'Coligny', slug: 'coligny' },
    { name: 'Cormontreuil', slug: 'cormontreuil' },
    { name: 'Coulommes-la-Montagne', slug: 'coulommes-la-montagne' },
    { name: 'Écueil', slug: 'ecueil' },
    { name: 'Jouy-lès-Reims', slug: 'jouy-les-reims' },
    { name: 'Les Mesneux', slug: 'les-mesneux' },
    { name: 'Ludes', slug: 'ludes' },
    { name: 'Montbré', slug: 'montbre' },
    { name: 'Pargny-lès-Reims', slug: 'pargny-les-reims' },
    { name: 'Rilly-la-Montagne', slug: 'rilly-la-montagne' },
    { name: 'Sacy', slug: 'sacy' },
    { name: 'Sermiers', slug: 'sermiers' },
    { name: 'Taissy', slug: 'taissy' },
    { name: 'Tauxières-Mutry', slug: 'tauxieres-mutry' },
    { name: 'Trépail', slug: 'trepail' },
    { name: 'Trois-Puits', slug: 'trois-puits' },
    { name: 'Vaudemange', slug: 'vaudemange' },
    { name: 'Villedommange', slug: 'villedommange' },
    { name: 'Villers-Allerand', slug: 'villers-allerand' },
    { name: 'Villers-aux-Nœuds', slug: 'villers-aux-noeuds' },
    { name: 'Villers-Marmery', slug: 'villers-marmery' },
    { name: 'Vrigny', slug: 'vrigny' }
  ]
} as const;

export default async function MontagneDeReimsPage() {
  // Read and parse markdown file
  const guidesDir = path.join(process.cwd(), 'guides');
  const filePath = path.join(guidesDir, 'montagne-de-reims-guide.md');

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
                Grand Cru ({MONTAGNE_DE_REIMS_VILLAGES.grandCrus.length})
              </h4>
              <nav className="space-y-1">
                {MONTAGNE_DE_REIMS_VILLAGES.grandCrus.map((village) => (
                  <Link
                    key={village.slug}
                    href={`/regions/france/champagne/montagne-de-reims/${village.slug}`}
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
                Premier Cru ({MONTAGNE_DE_REIMS_VILLAGES.premierCrus.length})
              </h4>
              <nav className="space-y-1">
                {MONTAGNE_DE_REIMS_VILLAGES.premierCrus.map((village) => (
                  <Link
                    key={village.slug}
                    href={`/regions/france/champagne/montagne-de-reims/${village.slug}`}
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Montagne de Reims</h1>
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
