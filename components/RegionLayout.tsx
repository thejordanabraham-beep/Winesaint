import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import Link from 'next/link';
import { groupByClassification, type ClassificationType } from '@/lib/guide-config';

interface RegionLayoutProps {
  title: string;
  level: 'country' | 'region' | 'sub-region' | 'village' | 'vineyard';
  parentRegion?: string;
  classification?: string; // Added for vineyard-level classification
  sidebarLinks?: ReadonlyArray<{ name: string; slug: string; type?: string; classification?: ClassificationType }>;
  sidebarTitle?: string; // Optional custom sidebar title
  contentFile: string;
  vineyardData?: {
    classification?: string;
    acreage?: number;
    hectares?: number;
    soilTypes?: string[];
    aspect?: string;
    slope?: number;
    elevationRange?: { min: number; max: number };
    producers?: Array<{ name: string; slug: string }>;
  };
}

export default async function RegionLayout({
  title,
  level,
  parentRegion,
  classification,
  sidebarLinks,
  sidebarTitle,
  contentFile,
  vineyardData
}: RegionLayoutProps) {
  // Read and parse markdown file
  const guidesDir = path.join(process.cwd(), 'guides');
  const filePath = path.join(guidesDir, contentFile);

  let contentHtml = '';
  let fileExists = false;

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    fileExists = true;

    const processedContent = await remark()
      .use(html)
      .process(fileContent);

    contentHtml = processedContent.toString();
  } catch (error) {
    contentHtml = '<p class="text-gray-600">Guide content coming soon...</p>';
  }

  // Generate nested path for links
  const generateNestedPath = (): string => {
    if (level === 'country') {
      return title.toLowerCase().replace(/\s+/g, '-');
    } else if (parentRegion) {
      // parentRegion is already a slug path like "france/burgundy", use it directly
      const currentSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
      return `${parentRegion}/${currentSlug}`;
    }
    return '';
  };

  // Generate breadcrumb path
  const generateBreadcrumb = () => {
    const parts = [];

    if (parentRegion) {
      parts.push(
        <Link key={parentRegion} href={`/regions/${parentRegion}`} className="hover:underline">
          {parentRegion}
        </Link>
      );
    }

    return parts;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex gap-8">
        {/* Left Sidebar Navigation */}
        {sidebarLinks && sidebarLinks.length > 0 && (
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-2">
              {/* For village level: Group by classification */}
              {level === 'village' ? (
                <>
                  {(() => {
                    const grouped = groupByClassification(sidebarLinks);
                    return (
                      <div className="space-y-6">
                        {grouped.grandCru.length > 0 && (
                          <section>
                            <h4 className="font-bold text-sm uppercase tracking-wide text-amber-600 mb-3">
                              Grand Cru ({grouped.grandCru.length})
                            </h4>
                            <nav className="space-y-1">
                              {grouped.grandCru.map((link) => (
                                <Link
                                  key={link.slug}
                                  href={`/regions/${generateNestedPath()}/${link.slug}`}
                                  className="block px-3 py-2 rounded text-sm hover:bg-amber-50 transition-colors hover:text-amber-700"
                                >
                                  {link.name}
                                </Link>
                              ))}
                            </nav>
                          </section>
                        )}
                        {grouped.premierCru.length > 0 && (
                          <section>
                            <h4 className="font-bold text-sm uppercase tracking-wide text-[#722F37] mb-3">
                              Premier Cru ({grouped.premierCru.length})
                            </h4>
                            <nav className="space-y-1">
                              {grouped.premierCru.map((link) => (
                                <Link
                                  key={link.slug}
                                  href={`/regions/${generateNestedPath()}/${link.slug}`}
                                  className="block px-3 py-2 rounded text-sm hover:bg-[#722F37]/10 transition-colors hover:text-[#722F37]"
                                >
                                  {link.name}
                                </Link>
                              ))}
                            </nav>
                          </section>
                        )}
                        {grouped.village.length > 0 && (
                          <section>
                            <h4 className="font-bold text-sm uppercase tracking-wide text-gray-600 mb-3">
                              Village
                            </h4>
                            <nav className="space-y-1">
                              {grouped.village.map((link) => (
                                <Link
                                  key={link.slug}
                                  href={`/regions/${generateNestedPath()}/${link.slug}`}
                                  className="block px-3 py-2 rounded text-sm hover:bg-gray-100 transition-colors hover:text-gray-700"
                                >
                                  {link.name}
                                </Link>
                              ))}
                            </nav>
                          </section>
                        )}
                        {grouped.premierCruClasse.length > 0 && (
                          <section>
                            <h4 className="font-bold text-sm uppercase tracking-wide text-amber-600 mb-3">
                              Premier Cru Classé ({grouped.premierCruClasse.length})
                            </h4>
                            <nav className="space-y-1">
                              {grouped.premierCruClasse.map((link) => (
                                <Link
                                  key={link.slug}
                                  href={`/regions/${generateNestedPath()}/${link.slug}`}
                                  className="block px-3 py-2 rounded text-sm hover:bg-amber-50 transition-colors hover:text-amber-700"
                                >
                                  {link.name}
                                </Link>
                              ))}
                            </nav>
                          </section>
                        )}
                        {grouped.deuxiemeCruClasse.length > 0 && (
                          <section>
                            <h4 className="font-bold text-sm uppercase tracking-wide text-[#722F37] mb-3">
                              Deuxième Cru Classé ({grouped.deuxiemeCruClasse.length})
                            </h4>
                            <nav className="space-y-1">
                              {grouped.deuxiemeCruClasse.map((link) => (
                                <Link
                                  key={link.slug}
                                  href={`/regions/${generateNestedPath()}/${link.slug}`}
                                  className="block px-3 py-2 rounded text-sm hover:bg-[#722F37]/10 transition-colors hover:text-[#722F37]"
                                >
                                  {link.name}
                                </Link>
                              ))}
                            </nav>
                          </section>
                        )}
                        {grouped.troisiemeCruClasse.length > 0 && (
                          <section>
                            <h4 className="font-bold text-sm uppercase tracking-wide text-orange-600 mb-3">
                              Troisième Cru Classé ({grouped.troisiemeCruClasse.length})
                            </h4>
                            <nav className="space-y-1">
                              {grouped.troisiemeCruClasse.map((link) => (
                                <Link
                                  key={link.slug}
                                  href={`/regions/${generateNestedPath()}/${link.slug}`}
                                  className="block px-3 py-2 rounded text-sm hover:bg-orange-50 transition-colors hover:text-orange-700"
                                >
                                  {link.name}
                                </Link>
                              ))}
                            </nav>
                          </section>
                        )}
                        {grouped.quatriemeCruClasse.length > 0 && (
                          <section>
                            <h4 className="font-bold text-sm uppercase tracking-wide text-red-600 mb-3">
                              Quatrième Cru Classé ({grouped.quatriemeCruClasse.length})
                            </h4>
                            <nav className="space-y-1">
                              {grouped.quatriemeCruClasse.map((link) => (
                                <Link
                                  key={link.slug}
                                  href={`/regions/${generateNestedPath()}/${link.slug}`}
                                  className="block px-3 py-2 rounded text-sm hover:bg-red-50 transition-colors hover:text-red-700"
                                >
                                  {link.name}
                                </Link>
                              ))}
                            </nav>
                          </section>
                        )}
                        {grouped.cinquiemeCruClasse.length > 0 && (
                          <section>
                            <h4 className="font-bold text-sm uppercase tracking-wide text-pink-600 mb-3">
                              Cinquième Cru Classé ({grouped.cinquiemeCruClasse.length})
                            </h4>
                            <nav className="space-y-1">
                              {grouped.cinquiemeCruClasse.map((link) => (
                                <Link
                                  key={link.slug}
                                  href={`/regions/${generateNestedPath()}/${link.slug}`}
                                  className="block px-3 py-2 rounded text-sm hover:bg-pink-50 transition-colors hover:text-pink-700"
                                >
                                  {link.name}
                                </Link>
                              ))}
                            </nav>
                          </section>
                        )}
                        {grouped.premierGrandCruClasseA.length > 0 && (
                          <section>
                            <h4 className="font-bold text-sm uppercase tracking-wide text-amber-600 mb-3">
                              Premier Grand Cru Classé A ({grouped.premierGrandCruClasseA.length})
                            </h4>
                            <nav className="space-y-1">
                              {grouped.premierGrandCruClasseA.map((link) => (
                                <Link
                                  key={link.slug}
                                  href={`/regions/${generateNestedPath()}/${link.slug}`}
                                  className="block px-3 py-2 rounded text-sm hover:bg-amber-50 transition-colors hover:text-amber-700"
                                >
                                  {link.name}
                                </Link>
                              ))}
                            </nav>
                          </section>
                        )}
                        {grouped.premierGrandCruClasseB.length > 0 && (
                          <section>
                            <h4 className="font-bold text-sm uppercase tracking-wide text-orange-600 mb-3">
                              Premier Grand Cru Classé B ({grouped.premierGrandCruClasseB.length})
                            </h4>
                            <nav className="space-y-1">
                              {grouped.premierGrandCruClasseB.map((link) => (
                                <Link
                                  key={link.slug}
                                  href={`/regions/${generateNestedPath()}/${link.slug}`}
                                  className="block px-3 py-2 rounded text-sm hover:bg-orange-50 transition-colors hover:text-orange-700"
                                >
                                  {link.name}
                                </Link>
                              ))}
                            </nav>
                          </section>
                        )}
                        {grouped.mga.length > 0 && (
                          <section>
                            <h4 className="font-bold text-sm uppercase tracking-wide text-amber-700 mb-3">
                              MGA ({grouped.mga.length})
                            </h4>
                            <nav className="space-y-1">
                              {grouped.mga.map((link) => (
                                <Link
                                  key={link.slug}
                                  href={`/regions/${generateNestedPath()}/${link.slug}`}
                                  className="block px-3 py-2 rounded text-sm hover:bg-amber-50 transition-colors hover:text-amber-800"
                                >
                                  {link.name}
                                </Link>
                              ))}
                            </nav>
                          </section>
                        )}
                        {grouped.grossesGewachs.length > 0 && (
                          <section>
                            <h4 className="font-bold text-sm uppercase tracking-wide text-amber-700 mb-3">
                              Grosses Gewächs ({grouped.grossesGewachs.length})
                            </h4>
                            <nav className="space-y-1">
                              {grouped.grossesGewachs.map((link) => (
                                <Link
                                  key={link.slug}
                                  href={`/regions/${generateNestedPath()}/${link.slug}`}
                                  className="block px-3 py-2 rounded text-sm hover:bg-amber-50 transition-colors hover:text-amber-800"
                                >
                                  {link.name}
                                </Link>
                              ))}
                            </nav>
                          </section>
                        )}
                        {grouped.singleVineyard.length > 0 && (
                          <section>
                            <h4 className="font-bold text-sm uppercase tracking-wide text-gray-600 mb-3">
                              Estates ({grouped.singleVineyard.length})
                            </h4>
                            <nav className="space-y-1">
                              {grouped.singleVineyard.map((link) => (
                                <Link
                                  key={link.slug}
                                  href={`/regions/${generateNestedPath()}/${link.slug}`}
                                  className="block px-3 py-2 rounded text-sm hover:bg-gray-100 transition-colors hover:text-gray-700"
                                >
                                  {link.name}
                                </Link>
                              ))}
                            </nav>
                          </section>
                        )}
                      </div>
                    );
                  })()}
                </>
              ) : (
                /* For other levels: Standard sidebar */
                <>
                  <h3 className="font-bold text-lg mb-4 text-[#722F37]">
                    {sidebarTitle || (level === 'country' ? 'Major Regions' :
                     level === 'region' ? 'Sub-Regions' :
                     level === 'sub-region' ? 'Villages' :
                     'Explore')}
                  </h3>
                  <nav className="space-y-1">
                    {sidebarLinks.map((link) => {
                      const linkHref = level === 'country'
                        ? `/regions/${title.toLowerCase().replace(/\s+/g, '-')}/${link.slug}`
                        : `/regions/${generateNestedPath()}/${link.slug}`;

                      return (
                        <Link
                          key={link.slug}
                          href={linkHref}
                          className="block px-3 py-2 rounded text-sm hover:bg-[#722F37]/10 transition-colors hover:text-[#722F37]"
                        >
                          {link.name}
                        </Link>
                      );
                    })}
                  </nav>
                </>
              )}
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main className="flex-1 max-w-5xl">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
            <Link href="/regions" className="hover:text-[#722F37] transition-colors">
              Wine Region Guide
            </Link>
            {generateBreadcrumb().length > 0 && (
              <>
                <span className="text-gray-400">/</span>
                {generateBreadcrumb()}
              </>
            )}
            <span className="text-gray-400">/</span>
            <span className="text-gray-700 font-medium">{title}</span>
          </nav>

          {/* Vineyard Classification Badge (for vineyard pages) */}
          {level === 'vineyard' && vineyardData?.classification && (
            <div className="mb-6">
              <span className={`
                inline-block px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide
                ${vineyardData.classification === 'grand_cru' ? 'bg-amber-500 text-white' : ''}
                ${vineyardData.classification === 'premier_cru' ? 'bg-[#722F37] text-white' : ''}
                ${vineyardData.classification === 'village' ? 'bg-gray-500 text-white' : ''}
                ${vineyardData.classification === 'mga' ? 'bg-purple-600 text-white' : ''}
                ${vineyardData.classification === 'grosses_gewachs' ? 'bg-green-700 text-white' : ''}
              `}>
                {vineyardData.classification === 'grand_cru' && 'Grand Cru'}
                {vineyardData.classification === 'premier_cru' && 'Premier Cru'}
                {vineyardData.classification === 'village' && 'Village'}
                {vineyardData.classification === 'mga' && 'MGA'}
                {vineyardData.classification === 'grosses_gewachs' && 'Grosses Gewächs'}
              </span>
            </div>
          )}

          {/* Content Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            {/* Generated Guide Content */}
            <article
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* Footer note */}
            {fileExists && (
              <div className="mt-16 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 italic">
                  This comprehensive guide is part of the WineSaint Wine Region Guide collection.
                  Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}.
                </p>
              </div>
            )}
          </div>

          {/* Vineyard Metadata (for vineyard pages) */}
          {level === 'vineyard' && vineyardData && (
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h3 className="font-bold text-xl mb-6 text-[#722F37]">Vineyard Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {(vineyardData.acreage || vineyardData.hectares) && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Size</dt>
                      <dd className="mt-1 text-lg text-gray-900">
                        {vineyardData.hectares ? `${vineyardData.hectares} hectares` :
                         vineyardData.acreage ? `${vineyardData.acreage} acres` : ''}
                      </dd>
                    </div>
                  )}

                  {vineyardData.elevationRange && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Elevation</dt>
                      <dd className="mt-1 text-lg text-gray-900">
                        {vineyardData.elevationRange.min}-{vineyardData.elevationRange.max} meters
                      </dd>
                    </div>
                  )}

                  {vineyardData.aspect && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Aspect</dt>
                      <dd className="mt-1 text-lg text-gray-900 capitalize">
                        {vineyardData.aspect}
                      </dd>
                    </div>
                  )}

                  {vineyardData.slope && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Slope</dt>
                      <dd className="mt-1 text-lg text-gray-900">
                        {vineyardData.slope}%
                      </dd>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {vineyardData.soilTypes && vineyardData.soilTypes.length > 0 && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Soil Types</dt>
                      <dd className="mt-1">
                        <div className="flex flex-wrap gap-2">
                          {vineyardData.soilTypes.map((soil) => (
                            <span
                              key={soil}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800"
                            >
                              {soil.charAt(0).toUpperCase() + soil.slice(1)}
                            </span>
                          ))}
                        </div>
                      </dd>
                    </div>
                  )}

                  {vineyardData.producers && vineyardData.producers.length > 0 && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Producers</dt>
                      <dd className="mt-1 space-y-1">
                        {vineyardData.producers.map((producer) => (
                          <Link
                            key={producer.slug}
                            href={`/producers/${producer.slug}`}
                            className="block text-[#722F37] hover:underline"
                          >
                            {producer.name}
                          </Link>
                        ))}
                      </dd>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function generateSlug(parentRegion?: string, currentRegion?: string, slug?: string): string {
  const parts = [];

  if (parentRegion) {
    parts.push(parentRegion.toLowerCase().replace(/\s+/g, '-'));
  }

  if (slug) {
    parts.push(slug);
  }

  return parts.join('/');
}
