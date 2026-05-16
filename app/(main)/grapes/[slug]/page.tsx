import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import grapesData from '@/app/data/grapes.json';

interface Clone {
  name: string;
  origin: string;
  characteristics: string;
  yield: string;
  berry_size: string;
  regions: string[];
  approved?: string;
}

interface DiseaseProfile {
  susceptibilities: Array<{ disease: string; severity: string; notes: string }>;
  resistances: Array<{ disease: string; level: string; notes: string }>;
  general_notes: string;
}

interface Terroir {
  soil: string;
  also_known_as?: string[];
  effect: string;
  wine_character?: {
    body: string;
    acidity: string;
    tannin: string;
    aromatics: string;
  };
  regions?: string[];
}

interface RegionalExpression {
  region: string;
  country: string;
  importance?: string;
  climate?: string;
  soils?: string[];
  style_summary: string;
  typical_character?: {
    body: string;
    acidity: string;
    tannin: string;
    aromatics: string;
  };
  key_appellations?: Array<{ name: string; style: string }>;
  notable_producers?: string[];
  aging_potential?: string;
  price_range?: string;
}

interface GeneticLineage {
  overview: string;
  parents: Array<{ name: string; slug: string | null; confirmed: boolean; notes: string }>;
  offspring: Array<{ name: string; slug: string | null; other_parent: string; cross_type: string; importance: string; notes: string }>;
  mutations: Array<{ name: string; type: string; description: string }>;
  siblings: Array<{ name: string; slug: string | null; relationship: string; shared_parent: string; notes: string }>;
  biotypes?: Array<{ name: string; region: string; description: string; wine_style: string }>;
}

interface GrapeData {
  id: string;
  name: string;
  berry_color: string;
  is_essential: boolean;
  principal_synonyms: string;
  level_1: {
    description: string;
    key_characteristics: string[];
    typical_flavors: string[];
    major_regions: string[];
  };
  level_2: {
    full_description: string;
    origins_history: string;
    viticultural_characteristics: string;
    wine_styles: string;
    regional_details: string;
  };
  level_3?: {
    genetic_lineage?: GeneticLineage;
    clones?: Clone[];
    terroir?: Terroir[];
    disease_profile?: DiseaseProfile;
    regional_expressions?: RegionalExpression[];
  };
}

function getGrapeBySlug(slug: string): GrapeData | null {
  // Try multiple matching strategies
  const normalizedSlug = slug.toLowerCase().replace(/-/g, '_');

  const grape = (grapesData as any).grapes.find((g: any) => {
    // Match by ID (grape_cabernet_franc)
    if (g.id === `grape_${normalizedSlug}`) return true;

    // Match by name converted to slug
    const nameSlug = g.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[áàâã]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[íìîï]/g, 'i')
      .replace(/[óòôõ]/g, 'o')
      .replace(/[úùûü]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[ç]/g, 'c');
    if (nameSlug === slug) return true;

    return false;
  });

  return grape || null;
}

function formatGrapeName(name: string) {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getColorBadge(color: string) {
  if (color === 'black' || color === 'red') {
    return { label: 'Red', bgClass: 'bg-[#722F37]', textClass: 'text-white' };
  }
  if (color === 'white' || color === 'green') {
    return { label: 'White', bgClass: 'bg-[#E8DFD0]', textClass: 'text-[#1C1C1C]' };
  }
  return { label: 'Rosé', bgClass: 'bg-[#E8B4B8]', textClass: 'text-[#1C1C1C]' };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const grape = getGrapeBySlug(slug);

  if (!grape) {
    return { title: 'Grape Not Found' };
  }

  const name = formatGrapeName(grape.name);
  return {
    title: `${name} - Grape Guide | WineSaint`,
    description: grape.level_1.description,
  };
}

export default async function GrapeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const grape = getGrapeBySlug(slug);

  if (!grape) {
    notFound();
  }

  const colorBadge = getColorBadge(grape.berry_color);
  const flavors = grape.level_1.typical_flavors.map(f => f.replace(/^- /, ''));
  const regions = grape.level_1.major_regions.map(r => r.replace(/^- /, ''));
  const characteristics = grape.level_1.key_characteristics;
  const aliases = grape.principal_synonyms ? grape.principal_synonyms.split(', ') : [];

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-[#722F37]">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/grapes" className="hover:text-[#722F37]">Grape Guide</Link>
            </li>
            <li>/</li>
            <li className="text-[#1C1C1C] font-medium">{formatGrapeName(grape.name)}</li>
          </ol>
        </nav>

        {/* Header Card */}
        <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-5 sm:p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="font-serif text-3xl sm:text-4xl italic text-[#1C1C1C]">
              {formatGrapeName(grape.name)}
            </h1>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border-2 border-[#1C1C1C] ${colorBadge.bgClass} ${colorBadge.textClass}`}>
              {colorBadge.label}
            </span>
          </div>

          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            {grape.level_1.description}
          </p>

          {/* Key Characteristics */}
          {characteristics.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-[#1C1C1C] mb-2">Key Characteristics</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {characteristics.map((char, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-[#722F37] mr-2">•</span>
                    {char}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Flavor Pills */}
          {flavors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-[#1C1C1C] mb-2">Typical Flavors</h3>
              <div className="flex flex-wrap gap-2">
                {flavors.map((flavor, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-[#FAF7F2] border border-[#1C1C1C]/20 text-[#1C1C1C] text-sm px-3 py-1 rounded"
                  >
                    {flavor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Regions */}
          {regions.length > 0 && (
            <div className="pt-4 border-t border-[#1C1C1C]/10 mb-4">
              <h3 className="text-sm font-medium text-[#1C1C1C] mb-2">Major Regions</h3>
              <p className="text-sm text-gray-600">{regions.join(' · ')}</p>
            </div>
          )}

          {/* Aliases */}
          {aliases.length > 0 && (
            <div className="pt-4 border-t border-[#1C1C1C]/10">
              <h3 className="text-sm font-medium text-[#1C1C1C] mb-2">Also Known As</h3>
              <p className="text-sm text-gray-600">{aliases.join(' · ')}</p>
            </div>
          )}
        </div>

        {/* Full Description */}
        <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-5 sm:p-8 mb-6">
          <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Overview</h2>
          <p className="text-gray-700 leading-relaxed">{grape.level_2.full_description}</p>
        </div>

        {/* Origins & History */}
        {grape.level_2.origins_history && (
          <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-5 sm:p-8 mb-6">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Origins & History</h2>
            <p className="text-gray-700 leading-relaxed">{grape.level_2.origins_history}</p>
          </div>
        )}

        {/* Viticultural Characteristics */}
        {grape.level_2.viticultural_characteristics && (
          <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-5 sm:p-8 mb-6">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Viticultural Characteristics</h2>
            <p className="text-gray-700 leading-relaxed">{grape.level_2.viticultural_characteristics}</p>
          </div>
        )}

        {/* Wine Styles */}
        {grape.level_2.wine_styles && (
          <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-5 sm:p-8 mb-6">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Wine Styles & Characteristics</h2>
            <p className="text-gray-700 leading-relaxed">{grape.level_2.wine_styles}</p>
          </div>
        )}

        {/* Genetic Lineage */}
        {grape.level_3?.genetic_lineage && (
          <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-5 sm:p-8 mb-6">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Genetic Lineage</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{grape.level_3.genetic_lineage.overview}</p>

            {/* Parents */}
            {grape.level_3.genetic_lineage.parents?.length > 0 && grape.level_3.genetic_lineage.parents[0].name !== 'Unknown' && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#1C1C1C] mb-3">Parents</h3>
                <div className="grid gap-3">
                  {grape.level_3.genetic_lineage.parents.map((parent, idx) => (
                    <div key={idx} className="bg-[#FAF7F2] rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[#722F37]">{parent.name}</span>
                        {parent.confirmed && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Confirmed</span>}
                      </div>
                      <p className="text-sm text-gray-600">{parent.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Offspring */}
            {grape.level_3.genetic_lineage.offspring?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#1C1C1C] mb-3">Notable Offspring</h3>
                <div className="grid gap-3">
                  {grape.level_3.genetic_lineage.offspring.slice(0, 6).map((child, idx) => (
                    <div key={idx} className="bg-[#FAF7F2] rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[#722F37]">{child.name}</span>
                        {child.other_parent && <span className="text-xs text-gray-500">× {child.other_parent}</span>}
                      </div>
                      <p className="text-sm text-gray-600">{child.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Biotypes */}
            {grape.level_3.genetic_lineage.biotypes?.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-[#1C1C1C] mb-3">Biotypes</h3>
                <div className="grid gap-3">
                  {grape.level_3.genetic_lineage.biotypes.map((biotype, idx) => (
                    <div key={idx} className="bg-[#FAF7F2] rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[#722F37]">{biotype.name}</span>
                        <span className="text-xs text-gray-500">{biotype.region}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{biotype.description}</p>
                      <p className="text-sm text-gray-500 italic">Wine style: {biotype.wine_style}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Clones */}
        {grape.level_3?.clones && grape.level_3.clones.length > 0 && (
          <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-5 sm:p-8 mb-6">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Clonal Selection</h2>
            <div className="grid gap-4">
              {grape.level_3.clones.map((clone, idx) => (
                <div key={idx} className="bg-[#FAF7F2] rounded-lg p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-medium text-[#722F37]">{clone.name}</span>
                    <div className="flex gap-2">
                      {clone.yield && <span className="text-xs bg-white border border-[#1C1C1C]/20 px-2 py-0.5 rounded">Yield: {clone.yield}</span>}
                      {clone.berry_size && <span className="text-xs bg-white border border-[#1C1C1C]/20 px-2 py-0.5 rounded">Berry: {clone.berry_size}</span>}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">Origin: {clone.origin}</p>
                  <p className="text-sm text-gray-600">{clone.characteristics}</p>
                  {clone.approved && <p className="text-xs text-gray-400 mt-2">Approved: {clone.approved}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disease Profile */}
        {grape.level_3?.disease_profile && (
          <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-5 sm:p-8 mb-6">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Disease Profile</h2>

            {grape.level_3.disease_profile.general_notes && (
              <p className="text-gray-700 leading-relaxed mb-6">{grape.level_3.disease_profile.general_notes}</p>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Susceptibilities */}
              {grape.level_3.disease_profile.susceptibilities?.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-[#1C1C1C] mb-3">Susceptibilities</h3>
                  <div className="space-y-3">
                    {grape.level_3.disease_profile.susceptibilities.map((disease, idx) => (
                      <div key={idx} className="bg-red-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-red-800">{disease.disease}</span>
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">{disease.severity}</span>
                        </div>
                        <p className="text-sm text-red-700">{disease.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resistances */}
              {grape.level_3.disease_profile.resistances?.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-[#1C1C1C] mb-3">Resistances</h3>
                  <div className="space-y-3">
                    {grape.level_3.disease_profile.resistances.map((disease, idx) => (
                      <div key={idx} className="bg-green-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-green-800">{disease.disease}</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">{disease.level}</span>
                        </div>
                        <p className="text-sm text-green-700">{disease.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Terroir */}
        {grape.level_3?.terroir && grape.level_3.terroir.length > 0 && (
          <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-5 sm:p-8 mb-6">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Terroir Preferences</h2>
            <div className="grid gap-4">
              {grape.level_3.terroir.map((t, idx) => (
                <div key={idx} className="bg-[#FAF7F2] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-[#722F37]">{t.soil}</span>
                    {t.regions && t.regions.length > 0 && (
                      <span className="text-xs text-gray-500">{t.regions.join(', ')}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{t.effect}</p>
                  {t.wine_character && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="font-medium">Body:</span> {t.wine_character.body}</div>
                      <div><span className="font-medium">Acidity:</span> {t.wine_character.acidity}</div>
                      <div><span className="font-medium">Tannin:</span> {t.wine_character.tannin}</div>
                      <div><span className="font-medium">Aromatics:</span> {t.wine_character.aromatics}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regional Expressions */}
        {grape.level_3?.regional_expressions && grape.level_3.regional_expressions.length > 0 && (
          <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-5 sm:p-8 mb-6">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Regional Expressions</h2>
            <div className="grid gap-6">
              {grape.level_3.regional_expressions.map((expr, idx) => (
                <div key={idx} className="bg-[#FAF7F2] rounded-lg p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="font-medium text-lg text-[#722F37]">{expr.region}</span>
                    <div className="flex items-center gap-2">
                      {expr.importance && <span className="text-xs bg-[#722F37] text-white px-2 py-0.5 rounded">{expr.importance}</span>}
                      <span className="text-sm text-gray-500">{expr.country}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4">{expr.style_summary}</p>

                  {expr.typical_character && (
                    <div className="grid grid-cols-2 gap-2 text-xs mb-4 bg-white rounded p-3">
                      <div><span className="font-medium">Body:</span> {expr.typical_character.body}</div>
                      <div><span className="font-medium">Acidity:</span> {expr.typical_character.acidity}</div>
                      <div><span className="font-medium">Tannin:</span> {expr.typical_character.tannin}</div>
                      <div><span className="font-medium">Aromatics:</span> {expr.typical_character.aromatics}</div>
                    </div>
                  )}

                  {expr.key_appellations && expr.key_appellations.length > 0 && (
                    <div className="mb-3">
                      <span className="text-xs font-medium text-gray-700">Key Appellations: </span>
                      <span className="text-xs text-gray-600">
                        {expr.key_appellations.map(a => a.name).join(' · ')}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    {expr.aging_potential && <span>Aging: {expr.aging_potential}</span>}
                    {expr.price_range && <span>Price: {expr.price_range}</span>}
                  </div>

                  {expr.notable_producers && expr.notable_producers.length > 0 && (
                    <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-[#1C1C1C]/10">
                      Notable producers: {expr.notable_producers.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8">
          <Link
            href="/grapes"
            className="text-[#722F37] hover:text-[#5a252c] font-medium"
          >
            ← Back to Grape Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
