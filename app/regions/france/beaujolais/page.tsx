import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

// Beaujolais Crus
const BEAUJOLAIS_CRUS = [
  { name: 'Brouilly', slug: 'brouilly' },
  { name: 'Chénas', slug: 'chenas' },
  { name: 'Chiroubles', slug: 'chiroubles' },
  { name: 'Côte de Brouilly', slug: 'cote-de-brouilly' },
  { name: 'Fleurie', slug: 'fleurie' },
  { name: 'Juliénas', slug: 'julienas' },
  { name: 'Morgon', slug: 'morgon' },
  { name: 'Moulin-à-Vent', slug: 'moulin-a-vent' },
  { name: 'Régnié', slug: 'regnie' },
  { name: 'Saint-Amour', slug: 'saint-amour' }
] as const;

export default async function BeaujolaisPage() {
  const guidesDir = path.join(process.cwd(), 'guides');
  const filePath = path.join(guidesDir, 'beaujolais-guide.md');

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
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-2">
            <h3 className="font-bold text-lg mb-4 text-[#722F37]">Beaujolais Crus</h3>
            <nav className="space-y-1">
              {BEAUJOLAIS_CRUS.map((cru) => (
                <Link
                  key={cru.slug}
                  href={`/regions/france/beaujolais/${cru.slug}`}
                  className="block px-3 py-2 rounded text-sm hover:bg-[#722F37]/10 transition-colors hover:text-[#722F37]"
                >
                  {cru.name}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 max-w-5xl">
          <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
            <Link href="/regions" className="hover:text-[#722F37] transition-colors">
              Wine Region Guide
            </Link>
            <span>›</span>
            <Link href="/regions/france" className="hover:text-[#722F37] transition-colors">
              France
            </Link>
          </nav>

          <header className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Beaujolais</h1>
            <p className="text-gray-600 text-lg">France</p>
          </header>

          <article
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-[#722F37] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </main>
      </div>
    </div>
  );
}
