import RegionLayout from '@/components/RegionLayout';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

// Mosel sub-regions with VDP vineyard classifications
const MOSEL_SUBREGIONS = {
  'Mittelmosel': {
    name: 'Mittelmosel (Middle Mosel)',
    slug: 'mittelmosel',
    description: 'Heart of the Mosel with legendary Grand Cru sites'
  },
  'Saar': {
    name: 'Saar',
    slug: 'saar',
    description: 'Tributary valley known for steel and minerality'
  },
  'Ruwer': {
    name: 'Ruwer',
    slug: 'ruwer',
    description: 'Smallest tributary, elegant and refined wines'
  },
  'Terrassenmosel': {
    name: 'Terrassenmosel (Lower Mosel)',
    slug: 'terrassenmosel',
    description: 'Steep terraced vineyards on volcanic soils'
  },
  'Obermosel': {
    name: 'Obermosel (Upper Mosel)',
    slug: 'obermosel',
    description: 'Upper reaches, traditional Elbling production'
  }
} as const;

export default async function MoselPage() {
  // Read and parse markdown file (same logic as RegionLayout)
  const guidesDir = path.join(process.cwd(), 'guides');
  const filePath = path.join(guidesDir, 'mosel-guide.md');

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
        {/* Custom Sidebar for Mosel - sub-regions */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-8">
            <h3 className="font-bold text-lg mb-4 text-[#722F37]">Sub-Regions</h3>
            <nav className="space-y-2">
              {Object.entries(MOSEL_SUBREGIONS).map(([key, region]) => (
                <Link
                  key={region.slug}
                  href={`/regions/germany/mosel/${region.slug}`}
                  className="block px-3 py-2 rounded hover:bg-[#722F37]/10 transition-colors hover:text-[#722F37]"
                >
                  <div className="font-medium text-sm">{region.name}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{region.description}</div>
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
            <Link href="/regions/germany" className="hover:text-[#722F37] transition-colors">
              Germany
            </Link>
          </nav>

          {/* Page Header */}
          <header className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mosel</h1>
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
