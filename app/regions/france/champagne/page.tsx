import RegionLayout from '@/components/RegionLayout';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

// Champagne sub-regions
const CHAMPAGNE_SUB_REGIONS = [
  { name: 'Montagne de Reims', slug: 'montagne-de-reims' },
  { name: 'Côte des Blancs', slug: 'cote-des-blancs' },
  { name: 'Vallée de la Marne', slug: 'vallee-de-la-marne' },
  { name: 'Côte de Sézanne', slug: 'cote-de-sezanne' },
  { name: 'Côte des Bar', slug: 'cote-des-bar' }
] as const;

export default async function ChampagnePage() {
  // Read and parse markdown file (same logic as RegionLayout)
  const guidesDir = path.join(process.cwd(), 'guides');
  const filePath = path.join(guidesDir, 'champagne-guide.md');

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
        {/* Custom Sidebar for Champagne - sub-regions only */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-2">
            <h3 className="font-bold text-lg mb-4 text-[#722F37]">Sub-Regions</h3>
            <nav className="space-y-2">
              {CHAMPAGNE_SUB_REGIONS.map((subRegion) => (
                <Link
                  key={subRegion.slug}
                  href={`/regions/france/champagne/${subRegion.slug}`}
                  className="block px-3 py-2 rounded text-sm hover:bg-[#722F37]/10 transition-colors hover:text-[#722F37]"
                >
                  {subRegion.name}
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
          </nav>

          {/* Page Header */}
          <header className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Champagne</h1>
            <p className="text-gray-600 text-lg">France</p>
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
