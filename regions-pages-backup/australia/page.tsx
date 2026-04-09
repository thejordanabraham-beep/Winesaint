import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

// Australian regions organized by state
const AUSTRALIA_REGIONS = {
  southAustralia: [
    { name: 'Barossa Valley', slug: 'barossa-valley' },
    { name: 'Eden Valley', slug: 'eden-valley' },
    { name: 'McLaren Vale', slug: 'mclaren-vale' },
    { name: 'Clare Valley', slug: 'clare-valley' },
    { name: 'Adelaide Hills', slug: 'adelaide-hills' },
    { name: 'Coonawarra', slug: 'coonawarra' },
  ],
  victoria: [
    { name: 'Yarra Valley', slug: 'yarra-valley' },
    { name: 'Mornington Peninsula', slug: 'mornington-peninsula' },
    { name: 'Heathcote', slug: 'heathcote' },
    { name: 'Geelong', slug: 'geelong' },
    { name: 'Beechworth', slug: 'beechworth' },
    { name: 'Gippsland', slug: 'gippsland' },
  ],
  westernAustralia: [
    { name: 'Margaret River', slug: 'margaret-river' },
    { name: 'Great Southern', slug: 'great-southern' },
    { name: 'Pemberton', slug: 'pemberton' },
  ],
  newSouthWales: [
    { name: 'Hunter Valley', slug: 'hunter-valley' },
    { name: 'Mudgee', slug: 'mudgee' },
    { name: 'Orange', slug: 'orange' },
    { name: 'Hilltops', slug: 'hilltops' },
  ],
  tasmania: [
    { name: 'Tasmania', slug: 'tasmania' },
  ]
} as const;

export default async function AustraliaPage() {
  // Read and parse markdown file
  const guidesDir = path.join(process.cwd(), 'guides');
  const filePath = path.join(guidesDir, 'australia-guide.md');

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
        {/* Sidebar with states and regions */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-2">
            <h3 className="font-bold text-lg mb-4 text-[#722F37]">Regions</h3>

            {/* South Australia */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-[#722F37] mb-2 pl-2">
                South Australia
              </h4>
              <nav className="space-y-1">
                {AUSTRALIA_REGIONS.southAustralia.map((region) => (
                  <Link
                    key={region.slug}
                    href={`/regions/australia/${region.slug}`}
                    className="block px-3 py-1.5 rounded text-sm hover:bg-[#722F37]/10 transition-colors hover:text-[#722F37]"
                  >
                    {region.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Victoria */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-[#722F37] mb-2 pl-2">
                Victoria
              </h4>
              <nav className="space-y-1">
                {AUSTRALIA_REGIONS.victoria.map((region) => (
                  <Link
                    key={region.slug}
                    href={`/regions/australia/${region.slug}`}
                    className="block px-3 py-1.5 rounded text-sm hover:bg-[#722F37]/10 transition-colors hover:text-[#722F37]"
                  >
                    {region.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Western Australia */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-[#722F37] mb-2 pl-2">
                Western Australia
              </h4>
              <nav className="space-y-1">
                {AUSTRALIA_REGIONS.westernAustralia.map((region) => (
                  <Link
                    key={region.slug}
                    href={`/regions/australia/${region.slug}`}
                    className="block px-3 py-1.5 rounded text-sm hover:bg-[#722F37]/10 transition-colors hover:text-[#722F37]"
                  >
                    {region.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* New South Wales */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-[#722F37] mb-2 pl-2">
                New South Wales
              </h4>
              <nav className="space-y-1">
                {AUSTRALIA_REGIONS.newSouthWales.map((region) => (
                  <Link
                    key={region.slug}
                    href={`/regions/australia/${region.slug}`}
                    className="block px-3 py-1.5 rounded text-sm hover:bg-[#722F37]/10 transition-colors hover:text-[#722F37]"
                  >
                    {region.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Tasmania */}
            <div>
              <h4 className="text-xs font-semibold text-[#722F37] mb-2 pl-2">
                Tasmania
              </h4>
              <nav className="space-y-1">
                {AUSTRALIA_REGIONS.tasmania.map((region) => (
                  <Link
                    key={region.slug}
                    href={`/regions/australia/${region.slug}`}
                    className="block px-3 py-1.5 rounded text-sm hover:bg-[#722F37]/10 transition-colors hover:text-[#722F37]"
                  >
                    {region.name}
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
          </nav>

          {/* Page Header */}
          <header className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Australia</h1>
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
