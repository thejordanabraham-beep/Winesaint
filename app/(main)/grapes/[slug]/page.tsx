import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import grapesData from '@/app/data/grapes.json';

interface GeneticParent {
  name: string;
  slug: string | null;
  confirmed?: boolean;
  relationship?: string;
  notes?: string;
  evidence?: string;
}

interface GeneticOffspring {
  name: string;
  slug: string;
  other_parent?: string;
  cross_type?: string;
  importance?: string;
  notes?: string;
}

interface GeneticMutation {
  name: string;
  slug: string | null;
  type: string;
  mutation_type?: string;
  importance?: string;
  description: string;
  regions?: string[];
  discovery?: string;
}

interface GeneticSibling {
  name: string;
  slug: string;
  relationship?: string;
  shared_parent?: string;
  notes?: string;
}

interface ModernCross {
  name: string;
  slug: string | null;
  cross: string;
  year?: number;
  breeder?: string;
  location?: string;
  notes?: string;
}

interface Clone {
  name: string;
  origin: string;
  source_vineyard?: string;
  characteristics: string;
  yield: string;
  berry_size?: string;
  cluster_size?: string;
  color_intensity?: string;
  acidity?: string;
  tannin?: string;
  aromatics?: string;
  best_for?: string[];
  regions: string[];
}

interface RegionalExpression {
  region: string;
  country: string;
  slug?: string;
  importance?: string;
  climate?: string;
  soils?: string[];
  style_summary: string;
  typical_character?: {
    body?: string;
    acidity?: string;
    tannin?: string;
    aromatics?: string;
  };
  key_appellations?: { name: string; style: string }[];
  wine_styles?: string[];
  notable_producers?: string[];
  aging_potential?: string;
  price_range?: string;
}

interface TerriorInteraction {
  soil: string;
  also_known_as?: string[];
  effect: string;
  wine_character?: {
    body?: string;
    acidity?: string;
    tannin?: string;
    aromatics?: string;
    aging_potential?: string;
  };
  drainage?: string;
  vigor?: string;
  regions: string[];
  notable_vineyards?: string[];
}

interface DiseaseSusceptibility {
  disease: string;
  severity: string;
  type?: string;
  conditions?: string;
  notes: string;
  management?: string[];
  impact_on_wine?: string;
}

interface DiseaseResistance {
  condition: string;
  level: string;
  notes?: string;
}

interface Grape {
  id: string;
  name: string;
  berry_color: string;
  is_essential: boolean;
  principal_synonyms?: string;
  level_1: {
    description: string;
    key_characteristics?: string[];
    typical_flavors?: string[];
    major_regions?: string[];
  };
  level_2?: {
    full_description?: string;
    origins_history?: string;
    viticultural_characteristics?: string;
    wine_styles?: string;
    regional_details?: string;
  };
  level_3?: {
    genetic_lineage?: {
      overview?: string;
      parents?: GeneticParent[];
      offspring?: GeneticOffspring[];
      mutations?: GeneticMutation[];
      siblings?: GeneticSibling[];
      modern_crosses?: ModernCross[];
      genetic_significance?: string;
    };
    clones?: Clone[];
    terroir?: TerriorInteraction[];
    disease_profile?: {
      susceptibilities?: DiseaseSusceptibility[];
      resistances?: DiseaseResistance[];
      general_notes?: string;
    };
    regional_expressions?: RegionalExpression[];
  };
  original_rewritten_content?: string;
}

// Format grape name to title case
function formatGrapeName(name: string) {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Create slug from name
function createSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Get color badge styling
function getColorBadge(berryColor: string) {
  const color = berryColor.toLowerCase();
  if (color.includes('black') || color.includes('red') || color.includes('blue')) {
    return { label: 'Red', bgClass: 'bg-[#722F37]', textClass: 'text-white' };
  }
  if (color.includes('white') || color.includes('green') || color.includes('yellow')) {
    return { label: 'White', bgClass: 'bg-[#E8DFD0]', textClass: 'text-[#1C1C1C]' };
  }
  if (color.includes('pink') || color.includes('grey') || color.includes('gray')) {
    return { label: 'Rosé', bgClass: 'bg-[#E8B4B8]', textClass: 'text-[#1C1C1C]' };
  }
  return { label: 'White', bgClass: 'bg-[#E8DFD0]', textClass: 'text-[#1C1C1C]' };
}

// Parse Level 2 content from markdown if structured data not available
function parseLevel2FromMarkdown(content: string) {
  const sections: Record<string, string> = {};

  if (!content || !content.includes('## LEVEL 2')) {
    return sections;
  }

  const level2Content = content.split('## LEVEL 2')[1] || '';

  const sectionPatterns = [
    { key: 'full_description', pattern: /### Full Description\s*\n([\s\S]*?)(?=###|$)/ },
    { key: 'origins_history', pattern: /### Origins & History\s*\n([\s\S]*?)(?=###|$)/ },
    { key: 'viticultural_characteristics', pattern: /### Viticultural Characteristics\s*\n([\s\S]*?)(?=###|$)/ },
    { key: 'wine_styles', pattern: /### Wine Styles & Characteristics\s*\n([\s\S]*?)(?=###|$)/ },
    { key: 'regional_details', pattern: /### Regional Details\s*\n([\s\S]*?)(?=###|$)/ },
  ];

  for (const { key, pattern } of sectionPatterns) {
    const match = level2Content.match(pattern);
    if (match) {
      sections[key] = match[1].trim();
    }
  }

  return sections;
}

// Parse flavors - handles malformed data
function parseFlavors(rawFlavors: string[]): string[] {
  const cleaned: string[] = [];
  for (const item of rawFlavors) {
    const parts = item.split(/\n/).map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      const clean = part.replace(/^[-–—•]\s*/, '').trim();
      if (clean && clean.length < 50) {
        cleaned.push(clean);
      }
    }
  }
  return cleaned;
}

function getGrape(slug: string): Grape | null {
  const grapes = grapesData.grapes as Grape[];
  return grapes.find(g => createSlug(g.name) === slug) || null;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const grape = getGrape(slug);

  if (!grape) {
    return { title: 'Grape Not Found' };
  }

  const name = formatGrapeName(grape.name);
  return {
    title: `${name} - Grape Guide | WineSaint`,
    description: grape.level_1.description,
  };
}

export async function generateStaticParams() {
  const grapes = grapesData.grapes as Grape[];
  return grapes.map(g => ({ slug: createSlug(g.name) }));
}

export default async function GrapeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const grape = getGrape(slug);

  if (!grape) {
    notFound();
  }

  const colorBadge = getColorBadge(grape.berry_color);
  const flavors = parseFlavors(grape.level_1.typical_flavors || []);
  const regions = (grape.level_1.major_regions || []).map(r => r.replace(/\s*\([^)]*\)/g, ''));

  // Get Level 2 content - prefer structured, fallback to parsed markdown
  let level2 = grape.level_2 || {};
  if (!level2.full_description && grape.original_rewritten_content) {
    level2 = parseLevel2FromMarkdown(grape.original_rewritten_content);
  }

  const level3 = grape.level_3;
  const hasGeneticLineage = level3?.genetic_lineage && (
    (level3.genetic_lineage.parents && level3.genetic_lineage.parents.length > 0) ||
    (level3.genetic_lineage.offspring && level3.genetic_lineage.offspring.length > 0) ||
    (level3.genetic_lineage.mutations && level3.genetic_lineage.mutations.length > 0)
  );

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
        <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="font-serif text-4xl italic text-[#1C1C1C]">
              {formatGrapeName(grape.name)}
            </h1>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border-2 border-[#1C1C1C] ${colorBadge.bgClass} ${colorBadge.textClass}`}>
              {colorBadge.label}
            </span>
          </div>

          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            {grape.level_1.description}
          </p>

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

          {/* Key Characteristics */}
          {grape.level_1.key_characteristics && grape.level_1.key_characteristics.length > 0 && (
            <div className="pt-4 border-t border-[#1C1C1C]/10 mb-4">
              <h3 className="text-sm font-medium text-[#1C1C1C] mb-2">Key Characteristics</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {grape.level_1.key_characteristics.map((char, idx) => (
                  <li key={idx}>• {char}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Regions */}
          {regions.length > 0 && (
            <div className="pt-4 border-t border-[#1C1C1C]/10 mb-4">
              <h3 className="text-sm font-medium text-[#1C1C1C] mb-2">Major Regions</h3>
              <p className="text-sm text-gray-600">{regions.join(' · ')}</p>
            </div>
          )}

          {/* Synonyms */}
          {grape.principal_synonyms && (
            <div className="pt-4 border-t border-[#1C1C1C]/10">
              <h3 className="text-sm font-medium text-[#1C1C1C] mb-2">Also Known As</h3>
              <p className="text-sm text-gray-600">
                {grape.principal_synonyms.split(',').map(s => s.trim()).join(' · ')}
              </p>
            </div>
          )}
        </div>

        {/* Origins & History */}
        {level2.origins_history && (
          <section className="bg-white border-3 border-[#1C1C1C] rounded-lg p-8 mb-6">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Origins & History</h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {level2.origins_history}
            </div>
          </section>
        )}

        {/* Genetic Lineage */}
        {hasGeneticLineage && (
          <section className="bg-white border-3 border-[#1C1C1C] rounded-lg p-8 mb-6">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Genetic Lineage</h2>

            {/* Overview */}
            {level3?.genetic_lineage?.overview && (
              <p className="text-gray-700 mb-6">{level3.genetic_lineage.overview}</p>
            )}

            {/* Parents */}
            {level3?.genetic_lineage?.parents && level3.genetic_lineage.parents.length > 0 && (
              <div className="mb-6">
                <h3 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Parents</h3>
                <div className="space-y-4">
                  {level3.genetic_lineage.parents.map((parent, idx) => (
                    <div key={idx} className="pl-4 border-l-2 border-[#722F37]/30">
                      <div className="flex items-baseline gap-2 mb-1">
                        {parent.slug ? (
                          <Link href={`/grapes/${parent.slug}`} className="text-[#722F37] hover:underline font-medium text-lg">
                            {parent.name}
                          </Link>
                        ) : (
                          <span className="font-medium text-[#1C1C1C] text-lg">{parent.name}</span>
                        )}
                        {parent.confirmed === false && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">unconfirmed</span>
                        )}
                        {parent.confirmed === true && (
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">DNA confirmed</span>
                        )}
                      </div>
                      {parent.notes && <p className="text-gray-700 text-sm">{parent.notes}</p>}
                      {parent.evidence && (
                        <p className="text-gray-500 text-xs mt-1">Evidence: {parent.evidence}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Offspring */}
            {level3?.genetic_lineage?.offspring && level3.genetic_lineage.offspring.length > 0 && (
              <div className="mb-6">
                <h3 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Offspring</h3>
                <div className="space-y-4">
                  {level3.genetic_lineage.offspring.map((child, idx) => (
                    <div key={idx} className="pb-4 border-b border-[#1C1C1C]/10 last:border-b-0 last:pb-0">
                      <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        <Link href={`/grapes/${child.slug}`} className="text-[#722F37] hover:underline font-medium text-lg">
                          {child.name}
                        </Link>
                        {child.other_parent && (
                          <span className="text-sm text-gray-500">(× {child.other_parent})</span>
                        )}
                        {child.importance && (
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            child.importance === 'major' ? 'bg-[#722F37]/10 text-[#722F37]' :
                            child.importance === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {child.importance}
                          </span>
                        )}
                      </div>
                      {child.notes && <p className="text-gray-700 text-sm">{child.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mutations */}
            {level3?.genetic_lineage?.mutations && level3.genetic_lineage.mutations.length > 0 && (
              <div className="mb-6">
                <h3 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Mutations</h3>
                <div className="space-y-4">
                  {level3.genetic_lineage.mutations.map((mutation, idx) => (
                    <div key={idx} className="pb-4 border-b border-[#1C1C1C]/10 last:border-b-0 last:pb-0">
                      <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        {mutation.slug ? (
                          <Link href={`/grapes/${mutation.slug}`} className="text-[#722F37] hover:underline font-medium text-lg">
                            {mutation.name}
                          </Link>
                        ) : (
                          <span className="font-medium text-[#1C1C1C] text-lg">{mutation.name}</span>
                        )}
                        <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded">
                          {mutation.type} mutation
                        </span>
                        {mutation.importance && (
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            mutation.importance === 'major' ? 'bg-[#722F37]/10 text-[#722F37]' :
                            mutation.importance === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {mutation.importance}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{mutation.description}</p>
                      {mutation.regions && mutation.regions.length > 0 && (
                        <p className="text-gray-500 text-sm">
                          <span className="text-gray-400">Regions:</span> {mutation.regions.join(', ')}
                        </p>
                      )}
                      {mutation.discovery && (
                        <p className="text-gray-500 text-xs mt-1">{mutation.discovery}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modern Crosses */}
            {level3?.genetic_lineage?.modern_crosses && level3.genetic_lineage.modern_crosses.length > 0 && (
              <div className="mb-6">
                <h3 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Modern Crosses</h3>
                <div className="space-y-4">
                  {level3.genetic_lineage.modern_crosses.map((cross, idx) => (
                    <div key={idx} className="pb-4 border-b border-[#1C1C1C]/10 last:border-b-0 last:pb-0">
                      <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        {cross.slug ? (
                          <Link href={`/grapes/${cross.slug}`} className="text-[#722F37] hover:underline font-medium text-lg">
                            {cross.name}
                          </Link>
                        ) : (
                          <span className="font-medium text-[#1C1C1C] text-lg">{cross.name}</span>
                        )}
                        {cross.year && (
                          <span className="text-sm text-gray-500">({cross.year})</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="text-gray-400">Cross:</span> {cross.cross}
                      </p>
                      {(cross.breeder || cross.location) && (
                        <p className="text-sm text-gray-600 mb-1">
                          {cross.breeder && <><span className="text-gray-400">Breeder:</span> {cross.breeder}</>}
                          {cross.breeder && cross.location && ' · '}
                          {cross.location && <><span className="text-gray-400">Location:</span> {cross.location}</>}
                        </p>
                      )}
                      {cross.notes && <p className="text-gray-700 text-sm">{cross.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Genetic Significance */}
            {level3?.genetic_lineage?.genetic_significance && (
              <div className="bg-[#FAF7F2] rounded p-4 mt-4">
                <p className="text-sm font-medium text-[#1C1C1C] mb-1">Genetic Significance</p>
                <p className="text-gray-700 text-sm">{level3.genetic_lineage.genetic_significance}</p>
              </div>
            )}
          </section>
        )}

        {/* Clonal Selection */}
        {level3?.clones && level3.clones.length > 0 && (
          <section className="bg-white border-3 border-[#1C1C1C] rounded-lg p-8 mb-6">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Clonal Selection</h2>
            <p className="text-gray-600 mb-6">
              {formatGrapeName(grape.name)} has more identified clones than almost any other variety. Clone selection significantly impacts wine style.
            </p>
            <div className="space-y-6">
              {level3.clones.map((clone, idx) => (
                <div key={idx} className="pb-6 border-b border-[#1C1C1C]/10 last:border-b-0 last:pb-0">
                  {/* Clone header */}
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-2">
                    <h3 className="font-medium text-[#1C1C1C] text-lg">{clone.name}</h3>
                    <span className="text-sm text-gray-500">{clone.origin}</span>
                    {clone.source_vineyard && (
                      <span className="text-sm text-gray-400">· {clone.source_vineyard}</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mb-3">{clone.characteristics}</p>

                  {/* Characteristics grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm mb-3">
                    {clone.berry_size && (
                      <div>
                        <span className="text-gray-500">Berry size:</span>
                        <span className="text-gray-700 ml-1">{clone.berry_size}</span>
                      </div>
                    )}
                    {clone.cluster_size && (
                      <div>
                        <span className="text-gray-500">Cluster:</span>
                        <span className="text-gray-700 ml-1">{clone.cluster_size}</span>
                      </div>
                    )}
                    {clone.yield && (
                      <div>
                        <span className="text-gray-500">Yield:</span>
                        <span className="text-gray-700 ml-1">{clone.yield}</span>
                      </div>
                    )}
                    {clone.color_intensity && (
                      <div>
                        <span className="text-gray-500">Color:</span>
                        <span className="text-gray-700 ml-1">{clone.color_intensity}</span>
                      </div>
                    )}
                    {clone.acidity && (
                      <div>
                        <span className="text-gray-500">Acidity:</span>
                        <span className="text-gray-700 ml-1">{clone.acidity}</span>
                      </div>
                    )}
                    {clone.tannin && (
                      <div>
                        <span className="text-gray-500">Tannin:</span>
                        <span className="text-gray-700 ml-1">{clone.tannin}</span>
                      </div>
                    )}
                  </div>

                  {/* Aromatics */}
                  {clone.aromatics && (
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="text-gray-500">Aromatics:</span> {clone.aromatics}
                    </p>
                  )}

                  {/* Best for and Regions */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {clone.best_for && clone.best_for.length > 0 && (
                      <p className="text-gray-600">
                        <span className="text-gray-500">Best for:</span> {clone.best_for.join(', ')}
                      </p>
                    )}
                    {clone.regions && clone.regions.length > 0 && (
                      <p className="text-gray-600">
                        <span className="text-gray-500">Regions:</span> {clone.regions.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* In the Vineyard */}
        {(level2.viticultural_characteristics || level3?.terroir || level3?.disease_profile) && (
          <section className="bg-white border-3 border-[#1C1C1C] rounded-lg p-8 mb-6">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">In the Vineyard</h2>

            {/* Viticultural characteristics text */}
            {level2.viticultural_characteristics && (
              <div className="text-gray-700 leading-relaxed whitespace-pre-line mb-6">
                {level2.viticultural_characteristics}
              </div>
            )}

            {/* Terroir Interactions */}
            {level3?.terroir && level3.terroir.length > 0 && (
              <div className="mb-8">
                <h3 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Terroir Interactions</h3>
                <div className="space-y-6">
                  {level3.terroir.map((t, idx) => (
                    <div key={idx} className="pb-6 border-b border-[#1C1C1C]/10 last:border-b-0 last:pb-0">
                      {/* Soil type header */}
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-2">
                        <h4 className="font-medium text-[#1C1C1C] text-lg">{t.soil}</h4>
                        {t.also_known_as && t.also_known_as.length > 0 && (
                          <span className="text-sm text-gray-500">({t.also_known_as.join(', ')})</span>
                        )}
                      </div>

                      {/* Effect description */}
                      <p className="text-gray-700 mb-3">{t.effect}</p>

                      {/* Wine character */}
                      {t.wine_character && (
                        <div className="bg-[#FAF7F2] rounded p-3 mb-3">
                          <p className="text-sm font-medium text-[#1C1C1C] mb-2">Wine Character</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                            {t.wine_character.body && (
                              <div>
                                <span className="text-gray-500">Body:</span>
                                <span className="text-gray-700 ml-1">{t.wine_character.body}</span>
                              </div>
                            )}
                            {t.wine_character.acidity && (
                              <div>
                                <span className="text-gray-500">Acidity:</span>
                                <span className="text-gray-700 ml-1">{t.wine_character.acidity}</span>
                              </div>
                            )}
                            {t.wine_character.tannin && (
                              <div>
                                <span className="text-gray-500">Tannin:</span>
                                <span className="text-gray-700 ml-1">{t.wine_character.tannin}</span>
                              </div>
                            )}
                            {t.wine_character.aging_potential && (
                              <div>
                                <span className="text-gray-500">Aging:</span>
                                <span className="text-gray-700 ml-1">{t.wine_character.aging_potential}</span>
                              </div>
                            )}
                          </div>
                          {t.wine_character.aromatics && (
                            <p className="text-sm mt-2">
                              <span className="text-gray-500">Aromatics:</span>
                              <span className="text-gray-700 ml-1">{t.wine_character.aromatics}</span>
                            </p>
                          )}
                        </div>
                      )}

                      {/* Viticulture details */}
                      {(t.drainage || t.vigor) && (
                        <div className="flex flex-wrap gap-4 text-sm mb-2">
                          {t.drainage && (
                            <p className="text-gray-600">
                              <span className="text-gray-500">Drainage:</span> {t.drainage}
                            </p>
                          )}
                          {t.vigor && (
                            <p className="text-gray-600">
                              <span className="text-gray-500">Vine vigor:</span> {t.vigor}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Regions */}
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="text-gray-500">Regions:</span> {t.regions.join(', ')}
                      </p>

                      {/* Notable vineyards */}
                      {t.notable_vineyards && t.notable_vineyards.length > 0 && (
                        <p className="text-sm text-gray-600">
                          <span className="text-gray-500">Notable vineyards:</span> {t.notable_vineyards.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disease & Pest Susceptibility - Only show if there are high susceptibilities or resistances */}
            {level3?.disease_profile && (
              (() => {
                const highSusceptibilities = level3.disease_profile.susceptibilities?.filter(d => d.severity === 'high') || [];
                const resistances = level3.disease_profile.resistances || [];
                const hasNotableIssues = highSusceptibilities.length > 0 || resistances.length > 0;

                if (!hasNotableIssues && !level3.disease_profile.general_notes) return null;

                return (
                  <div className="border-t-2 border-[#1C1C1C]/10 pt-6">
                    <h3 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Disease & Pest Susceptibility</h3>

                    {/* General notes */}
                    {level3.disease_profile.general_notes && (
                      <p className="text-gray-700 mb-4">{level3.disease_profile.general_notes}</p>
                    )}

                    {/* High susceptibilities only */}
                    {highSusceptibilities.length > 0 && (
                      <div className="space-y-4 mb-4">
                        <p className="text-sm font-medium text-[#1C1C1C]">Notable Susceptibilities</p>
                        {highSusceptibilities.map((d, idx) => (
                          <div key={idx} className="bg-red-50 rounded p-4">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-medium text-[#1C1C1C]">{d.disease}</span>
                              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                high
                              </span>
                              {d.type && (
                                <span className="text-sm text-gray-500">({d.type})</span>
                              )}
                            </div>
                            <p className="text-gray-700 text-sm">{d.notes}</p>
                            {d.impact_on_wine && (
                              <p className="text-sm text-gray-600 mt-2">
                                <span className="text-gray-500">Impact on wine:</span> {d.impact_on_wine}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Resistances */}
                    {resistances.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-[#1C1C1C] mb-2">Notable Resistances</p>
                        <div className="space-y-2">
                          {resistances.map((r, idx) => (
                            <div key={idx} className="bg-green-50 rounded p-3 flex items-start gap-2">
                              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                {r.level}
                              </span>
                              <div>
                                <span className="font-medium text-[#1C1C1C]">{r.condition}</span>
                                {r.notes && <p className="text-gray-600 text-sm mt-1">{r.notes}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            )}
          </section>
        )}

        {/* Regional Expressions */}
        {(level3?.regional_expressions || level2.regional_details) && (
          <section className="bg-white border-3 border-[#1C1C1C] rounded-lg p-8 mb-6">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Regional Expressions</h2>

            {/* Expanded regional expressions from level_3 */}
            {level3?.regional_expressions && level3.regional_expressions.length > 0 ? (
              <div className="space-y-8">
                {level3.regional_expressions.map((region, idx) => (
                  <div key={idx} className="pb-8 border-b border-[#1C1C1C]/10 last:border-b-0 last:pb-0">
                    {/* Region header */}
                    <div className="flex flex-wrap items-baseline gap-2 mb-2">
                      <h3 className="font-medium text-[#1C1C1C] text-xl">{region.region}</h3>
                      <span className="text-sm text-gray-500">{region.country}</span>
                      {region.importance && (
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          region.importance === 'benchmark' ? 'bg-[#722F37] text-white' :
                          region.importance === 'major' ? 'bg-[#722F37]/10 text-[#722F37]' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {region.importance}
                        </span>
                      )}
                    </div>

                    {/* Climate and soils */}
                    {(region.climate || region.soils) && (
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        {region.climate && (
                          <p><span className="text-gray-400">Climate:</span> {region.climate}</p>
                        )}
                        {region.soils && region.soils.length > 0 && (
                          <p><span className="text-gray-400">Soils:</span> {region.soils.join(', ')}</p>
                        )}
                      </div>
                    )}

                    {/* Style summary */}
                    <p className="text-gray-700 mb-4">{region.style_summary}</p>

                    {/* Typical character */}
                    {region.typical_character && (
                      <div className="bg-[#FAF7F2] rounded p-3 mb-4">
                        <p className="text-sm font-medium text-[#1C1C1C] mb-2">Typical Character</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                          {region.typical_character.body && (
                            <div>
                              <span className="text-gray-400">Body:</span>
                              <span className="text-gray-700 ml-1">{region.typical_character.body}</span>
                            </div>
                          )}
                          {region.typical_character.acidity && (
                            <div>
                              <span className="text-gray-400">Acidity:</span>
                              <span className="text-gray-700 ml-1">{region.typical_character.acidity}</span>
                            </div>
                          )}
                          {region.typical_character.tannin && (
                            <div>
                              <span className="text-gray-400">Tannin:</span>
                              <span className="text-gray-700 ml-1">{region.typical_character.tannin}</span>
                            </div>
                          )}
                        </div>
                        {region.typical_character.aromatics && (
                          <p className="text-sm mt-2">
                            <span className="text-gray-400">Aromatics:</span>
                            <span className="text-gray-700 ml-1">{region.typical_character.aromatics}</span>
                          </p>
                        )}
                      </div>
                    )}

                    {/* Key appellations */}
                    {region.key_appellations && region.key_appellations.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-[#1C1C1C] mb-2">Key Appellations</p>
                        <div className="space-y-1">
                          {region.key_appellations.map((app, appIdx) => (
                            <p key={appIdx} className="text-sm">
                              <span className="font-medium text-gray-700">{app.name}</span>
                              <span className="text-gray-500 ml-1">— {app.style}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Wine styles (for regions like Champagne) */}
                    {region.wine_styles && region.wine_styles.length > 0 && (
                      <p className="text-sm text-gray-600 mb-3">
                        <span className="text-gray-400">Wine styles:</span> {region.wine_styles.join(', ')}
                      </p>
                    )}

                    {/* Notable producers, aging, price */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      {region.notable_producers && region.notable_producers.length > 0 && (
                        <p className="text-gray-600">
                          <span className="text-gray-400">Notable producers:</span> {region.notable_producers.slice(0, 5).join(', ')}
                        </p>
                      )}
                      {region.aging_potential && (
                        <p className="text-gray-600">
                          <span className="text-gray-400">Aging:</span> {region.aging_potential}
                        </p>
                      )}
                      {region.price_range && (
                        <p className="text-gray-600">
                          <span className="text-gray-400">Price:</span> {region.price_range}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Fallback to simple text from level_2 */
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {level2.regional_details}
              </div>
            )}
          </section>
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
