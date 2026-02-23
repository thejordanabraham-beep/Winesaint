import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

// Côte de Nuits villages - Grand Crus and Premier Crus will be shown on individual village pages
const COTE_DE_NUITS_VILLAGES = [
  { name: 'Marsannay', slug: 'marsannay' },
  { name: 'Fixin', slug: 'fixin' },
  { name: 'Gevrey-Chambertin', slug: 'gevrey-chambertin' },
  { name: 'Morey-Saint-Denis', slug: 'morey-saint-denis' },
  { name: 'Chambolle-Musigny', slug: 'chambolle-musigny' },
  { name: 'Vougeot', slug: 'vougeot' },
  { name: 'Vosne-Romanée', slug: 'vosne-romanee' },
  { name: 'Nuits-Saint-Georges', slug: 'nuits-saint-georges' }
] as const;

export default async function CoteDeNuitsPage() {
  // Read and parse markdown file
  const guidesDir = path.join(process.cwd(), 'guides');
  const filePath = path.join(guidesDir, 'cote-de-nuits-guide.md');

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
        {/* Custom Sidebar for Côte de Nuits - villages only */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-8">
            <h3 className="font-bold text-lg mb-4 text-[#722F37]">Villages</h3>
            <nav className="space-y-1">
              {COTE_DE_NUITS_VILLAGES.map((village) => (
                <Link
                  key={village.slug}
                  href={`/regions/france/burgundy/cote-de-nuits/${village.slug}`}
                  className="block px-3 py-2 rounded text-sm hover:bg-[#722F37]/10 transition-colors hover:text-[#722F37]"
                >
                  {village.name}
                </Link>
              ))}
            </nav>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Côte de Nuits</h1>
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
