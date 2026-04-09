import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

// Pfalz Vineyards grouped by VDP Classification
const PFALZ_VINEYARDS = {
  grosseLage: [
    { name: 'Annaberg', slug: 'annaberg' },
    { name: 'Burgergarten Im Breumel', slug: 'burgergarten-im-breumel' },
    { name: 'Felsenberg', slug: 'felsenberg' },
    { name: 'Freundstuck', slug: 'freundstuck' },
    { name: 'Gaisbohl', slug: 'gaisbohl' },
    { name: 'Grainhubel', slug: 'grainhubel' },
    { name: 'Guldenwingert', slug: 'guldenwingert' },
    { name: 'Herrenberg', slug: 'herrenberg' },
    { name: 'Heydenreich', slug: 'heydenreich' },
    { name: 'Hohenmorgen', slug: 'hohenmorgen' },
    { name: 'Holle Unterer Faulenberg', slug: 'holle-unterer-faulenberg' },
    { name: 'Idig', slug: 'idig' },
    { name: 'Im Grossen Garten', slug: 'im-grossen-garten' },
    { name: 'Im Sonnenschein', slug: 'im-sonnenschein' },
    { name: 'Im Sonnenschein Ganz Horn', slug: 'im-sonnenschein-ganz-horn' },
    { name: 'Jesuitengarten', slug: 'jesuitengarten' },
    { name: 'Kalkberg', slug: 'kalkberg' },
    { name: 'Kalkofen', slug: 'kalkofen' },
    { name: 'Kalmit', slug: 'kalmit' },
    { name: 'Kammerberg', slug: 'kammerberg' },
    { name: 'Kastanienbusch', slug: 'kastanienbusch' },
    { name: 'Kastanienbusch Koppel', slug: 'kastanienbusch-koppel' },
    { name: 'Kieselberg', slug: 'kieselberg' },
    { name: 'Kirchberg', slug: 'kirchberg' },
    { name: 'Kirchenstuck', slug: 'kirchenstuck' },
    { name: 'Kirschgarten', slug: 'kirschgarten' },
    { name: 'Kostert', slug: 'kostert' },
    { name: 'Kreuzberg', slug: 'kreuzberg' },
    { name: 'Langenmorgen', slug: 'langenmorgen' },
    { name: 'Mandelberg', slug: 'mandelberg' },
    { name: 'Mandelberg Am Speyrer Weg', slug: 'mandelberg-am-speyrer-weg' },
    { name: 'Mandelpfad', slug: 'mandelpfad' },
    { name: 'Meerspinne', slug: 'meerspinne' },
    { name: 'Michelsberg', slug: 'michelsberg' },
    { name: 'Munzberg', slug: 'munzberg' },
    { name: 'Odinstal', slug: 'odinstal' },
    { name: 'Olberg Hart', slug: 'olberg-hart' },
    { name: 'Pechstein', slug: 'pechstein' },
    { name: 'Philippsbrunnen', slug: 'philippsbrunnen' },
    { name: 'Radling', slug: 'radling' },
    { name: 'Reiterpfad An Den Achtmorgen', slug: 'reiterpfad-an-den-achtmorgen' },
    { name: 'Reiterpfad Hofstuck', slug: 'reiterpfad-hofstuck' },
    { name: 'Reiterpfad In Der Hohl', slug: 'reiterpfad-in-der-hohl' },
    { name: 'Rosenkranz Im Untern Kreuz', slug: 'rosenkranz-im-untern-kreuz' },
    { name: 'Rosenkranz Zinkelerde', slug: 'rosenkranz-zinkelerde' },
    { name: 'Sankt Paul', slug: 'sankt-paul' },
    { name: 'Saumagen', slug: 'saumagen' },
    { name: 'Schawer', slug: 'schawer' },
    { name: 'Schild', slug: 'schild' },
    { name: 'Schwarzer Herrgott', slug: 'schwarzer-herrgott' },
    { name: 'Sonnenberg', slug: 'sonnenberg' },
    { name: 'Steinbuckel', slug: 'steinbuckel' },
    { name: 'Ungeheuer', slug: 'ungeheuer' },
    { name: 'Vogelsang', slug: 'vogelsang' },
    { name: 'Weilberg', slug: 'weilberg' },
  ],
};

export default async function PfalzPage() {
  // Read and parse markdown file
  const guidesDir = path.join(process.cwd(), 'guides');
  const filePath = path.join(guidesDir, 'pfalz-guide.md');

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
                {PFALZ_VINEYARDS.grosseLage.map((vineyard) => (
                  <Link
                    key={vineyard.slug}
                    href={`/regions/germany/pfalz/${vineyard.slug}`}
                    className="block px-3 py-1.5 rounded text-sm hover:bg-[#722F37]/10 transition-colors hover:text-[#722F37]"
                  >
                    {vineyard.name}
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
            <Link href="/regions/germany" className="hover:text-[#722F37] transition-colors">
              Germany
            </Link>
          </nav>

          {/* Page Header */}
          <header className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Pfalz</h1>
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
