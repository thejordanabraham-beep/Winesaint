'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type SectionId = 'overview' | 'history' | 'species' | 'strains' | 'selection' | 'fermentation' | 'compounds' | 'techniques' | 'modern';

const SECTIONS: { id: SectionId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '🍷' },
  { id: 'history', label: 'History', icon: '📜' },
  { id: 'species', label: 'Species', icon: '🔬' },
  { id: 'strains', label: 'Commercial Strains', icon: '🧪' },
  { id: 'selection', label: 'Selection', icon: '📋' },
  { id: 'fermentation', label: 'Fermentation', icon: '🫧' },
  { id: 'compounds', label: 'Flavor Compounds', icon: '🍎' },
  { id: 'techniques', label: 'Techniques', icon: '🌿' },
  { id: 'modern', label: 'Modern Developments', icon: '🧬' },
];

function AlcoholToleranceMeter({ tolerance }: { tolerance: string }) {
  const getLevel = (t: string) => {
    if (t.includes('18') || t.includes('Very High')) return 5;
    if (t.includes('16') || t.includes('17') || t.includes('High')) return 4;
    if (t.includes('14') || t.includes('15')) return 3;
    if (t.includes('12') || t.includes('13')) return 2;
    return 1;
  };
  const level = getLevel(tolerance);

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-500 mr-1">Alcohol:</span>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-sm ${
            i <= level
              ? i <= 2 ? 'bg-green-500' : i <= 3 ? 'bg-yellow-500' : i <= 4 ? 'bg-orange-500' : 'bg-red-500'
              : 'bg-gray-200'
          }`}
        />
      ))}
      <span className="text-xs text-gray-600 ml-1">{tolerance}</span>
    </div>
  );
}

function TemperatureRange({ range }: { range: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-blue-500">🌡️</span>
      <span className="text-gray-600">{range}</span>
    </div>
  );
}

function FermentationSpeedIndicator({ speed }: { speed: string }) {
  const getColor = (s: string) => {
    if (s.toLowerCase().includes('fast')) return 'bg-green-100 text-green-800 border-green-200';
    if (s.toLowerCase().includes('slow')) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded border ${getColor(speed)}`}>
      {speed}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const getColor = (c: string) => {
    if (c.toLowerCase().includes('neutral') || c.toLowerCase().includes('robust')) return 'bg-gray-100 text-gray-800 border-gray-300';
    if (c.toLowerCase().includes('aromatic')) return 'bg-purple-100 text-purple-800 border-purple-300';
    if (c.toLowerCase().includes('specialty')) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded border ${getColor(category)}`}>
      {category}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const getColor = (r: string) => {
    if (r.toLowerCase().includes('primary')) return 'bg-green-100 text-green-800';
    if (r.toLowerCase().includes('spoilage')) return 'bg-red-100 text-red-800';
    if (r.toLowerCase().includes('co-ferment')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded ${getColor(role)}`}>
      {role}
    </span>
  );
}

function CompoundCategoryIcon({ id }: { id: string }) {
  const icons: Record<string, string> = {
    'esters': '🍎',
    'higher-alcohols': '⚗️',
    'aldehydes': '🍏',
    'sulfur-compounds': '🥚',
    'glycerol': '💧',
    'volatile-phenols': '🐴',
  };
  return <span className="text-2xl">{icons[id] || '🧪'}</span>;
}

export default function YeastGuidePage() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [yeastData, setYeastData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/resource-guides/yeast`);
        if (res.ok) {
          const data = await res.json();
          setYeastData(data.content);
        }
      } catch (error) {
        console.error('Error fetching yeast data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!yeastData) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Failed to load yeast guide data.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-[#722F37]">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources" className="text-gray-500 hover:text-[#722F37]">Resources</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#1C1C1C]">Yeast Guide</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{yeastData.title}</h1>
          <p className="mt-1 text-lg text-[#722F37] italic">{yeastData.subtitle}</p>
          <p className="mt-3 text-gray-600 max-w-3xl">
            {yeastData.sections.overview.description}
          </p>
        </div>

        {/* Section Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-[#722F37] text-white'
                    : 'bg-white border-2 border-[#1C1C1C] text-[#1C1C1C] hover:bg-[#722F37] hover:text-white hover:border-[#722F37]'
                }`}
              >
                <span className="mr-1">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">{yeastData.sections.overview.title}</h2>

              {/* Role in Winemaking */}
              <div className="mb-6">
                <h3 className="font-semibold text-[#1C1C1C] mb-3">Role in Winemaking</h3>
                <div className="bg-[#FAF7F2] rounded-lg p-4 mb-4">
                  <p className="font-medium text-[#722F37] mb-2">Primary Function</p>
                  <p className="text-gray-700">{yeastData.sections.overview.role_in_winemaking.primary_function}</p>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 mb-4 border border-amber-200">
                  <p className="font-medium text-amber-800 mb-2">The Equation</p>
                  <p className="font-mono text-sm text-amber-900">{yeastData.sections.overview.role_in_winemaking.the_equation}</p>
                  <p className="text-xs text-amber-700 mt-2">{yeastData.sections.overview.role_in_winemaking.yield}</p>
                </div>

                <div className="grid gap-2 md:grid-cols-2">
                  {yeastData.sections.overview.role_in_winemaking.secondary_functions.map((fn: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 bg-white border border-[#1C1C1C]/10 rounded-lg p-3">
                      <span className="text-[#722F37]">•</span>
                      <span className="text-sm text-gray-700">{fn}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wild vs Cultured Debate */}
              <div>
                <h3 className="font-semibold text-[#1C1C1C] mb-3">{yeastData.sections.overview.wild_vs_cultured_debate.title}</h3>
                <p className="text-gray-600 mb-4">{yeastData.sections.overview.wild_vs_cultured_debate.description}</p>

                <div className="grid gap-4 md:grid-cols-2 mb-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">Wild Yeast Advocates</h4>
                    <p className="text-sm text-gray-700 mb-2">{yeastData.sections.overview.wild_vs_cultured_debate.wild_advocates.argument}</p>
                    <p className="text-xs text-gray-500 italic">{yeastData.sections.overview.wild_vs_cultured_debate.wild_advocates.proponents}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Cultured Yeast Advocates</h4>
                    <p className="text-sm text-gray-700 mb-2">{yeastData.sections.overview.wild_vs_cultured_debate.cultured_advocates.argument}</p>
                    <p className="text-xs text-gray-500 italic">{yeastData.sections.overview.wild_vs_cultured_debate.cultured_advocates.proponents}</p>
                  </div>
                </div>

                <div className="bg-[#FAF7F2] rounded-lg p-4">
                  <p className="text-sm text-gray-700"><span className="font-medium">The Reality:</span> {yeastData.sections.overview.wild_vs_cultured_debate.reality}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Section */}
        {activeSection === 'history' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{yeastData.sections.history.title}</h2>
              <p className="text-gray-600 mb-6">{yeastData.sections.history.description}</p>

              {/* Timeline */}
              <div className="mb-8">
                <h3 className="font-semibold text-[#1C1C1C] mb-4">Timeline of Discovery</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#722F37]" />
                  <div className="space-y-6">
                    {yeastData.sections.history.timeline.map((event: any, idx: number) => (
                      <div key={idx} className="relative pl-12">
                        <div className="absolute left-2 w-5 h-5 bg-[#722F37] rounded-full border-4 border-white" />
                        <div className="bg-[#FAF7F2] rounded-lg p-4">
                          <p className="font-bold text-[#722F37]">{event.year}</p>
                          <p className="text-gray-700 mt-1">{event.event}</p>
                          <p className="text-sm text-gray-500 italic mt-1">{event.significance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pasteur */}
              <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">🔬</span>
                  <div>
                    <h3 className="font-serif text-xl italic text-amber-800 mb-2">{yeastData.sections.history.pasteur.name}</h3>
                    <p className="text-gray-700 mb-3">{yeastData.sections.history.pasteur.contribution}</p>

                    <div className="mb-3">
                      <p className="text-sm font-medium text-amber-800 mb-2">Key Experiments:</p>
                      <ul className="space-y-1">
                        {yeastData.sections.history.pasteur.key_experiments.map((exp: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-700">• {exp}</li>
                        ))}
                      </ul>
                    </div>

                    <blockquote className="border-l-4 border-amber-400 pl-4 italic text-gray-600">
                      &ldquo;{yeastData.sections.history.pasteur.famous_quote}&rdquo;
                    </blockquote>

                    <p className="text-sm text-amber-700 mt-3"><span className="font-medium">Legacy:</span> {yeastData.sections.history.pasteur.legacy}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Species Section */}
        {activeSection === 'species' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{yeastData.sections.species.title}</h2>
              <p className="text-gray-600 mb-6">{yeastData.sections.species.description}</p>

              <div className="grid gap-4 md:grid-cols-2">
                {yeastData.sections.species.items.map((species: any) => (
                  <Link
                    key={species.id}
                    href={`/resources/yeast/species/${species.id}`}
                    className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group block"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">{species.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-serif text-lg italic text-[#722F37] group-hover:underline">{species.name}</h3>
                        <p className="text-sm text-gray-500">{species.common_name}</p>
                      </div>
                      <RoleBadge role={species.role} />
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{species.description}</p>

                    <div className="space-y-2">
                      <AlcoholToleranceMeter tolerance={species.alcohol_tolerance} />
                      <TemperatureRange range={species.optimal_temperature} />
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#1C1C1C]/10">
                      <p className="text-xs text-gray-500 mb-1">Flavor contribution:</p>
                      <p className="text-sm text-gray-700">{species.flavor_contribution}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Strains Section */}
        {activeSection === 'strains' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{yeastData.sections.strains.title}</h2>
              <p className="text-gray-600 mb-4">{yeastData.sections.strains.description}</p>

              {/* Categories Legend */}
              <div className="bg-[#FAF7F2] rounded-lg p-4 mb-6">
                <h4 className="font-medium text-sm text-[#1C1C1C] mb-2">Strain Categories</h4>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                  {Object.entries(yeastData.sections.strains.categories).map(([key, desc]) => (
                    <div key={key} className="text-sm">
                      <span className="font-medium capitalize">{key}:</span>{' '}
                      <span className="text-gray-600">{desc as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {yeastData.sections.strains.strains.map((strain: any) => (
                  <Link
                    key={strain.id}
                    href={`/resources/yeast/strains/${strain.id}`}
                    className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group block"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{strain.icon}</span>
                          <h3 className="font-serif text-lg italic text-[#722F37] group-hover:underline">{strain.name}</h3>
                        </div>
                        <p className="text-xs text-gray-500">{strain.brand} | {strain.species}</p>
                      </div>
                      <CategoryBadge category={strain.category} />
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{strain.description}</p>

                    <div className="space-y-2 mb-3">
                      <AlcoholToleranceMeter tolerance={strain.alcohol_tolerance} />
                      <div className="flex items-center gap-2">
                        <TemperatureRange range={strain.temperature_range} />
                        <FermentationSpeedIndicator speed={strain.fermentation_speed} />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#1C1C1C]/10">
                      <p className="text-xs text-gray-500 mb-1">Best for:</p>
                      <div className="flex flex-wrap gap-1">
                        {strain.best_for.slice(0, 3).map((use: string, i: number) => (
                          <span key={i} className="text-xs bg-white px-2 py-0.5 rounded border border-[#1C1C1C]/10">
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Selection Section */}
        {activeSection === 'selection' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{yeastData.sections.selection.title}</h2>
              <p className="text-gray-600 mb-6">{yeastData.sections.selection.description}</p>

              {yeastData.sections.selection.factors.map((factor: any) => (
                <div key={factor.factor} className="mb-8 last:mb-0">
                  <h3 className="font-semibold text-[#1C1C1C] mb-2">{factor.factor}</h3>
                  <p className="text-sm text-gray-600 mb-4">{factor.description}</p>

                  {factor.considerations && (
                    <ul className="mb-4 space-y-1">
                      {factor.considerations.map((c: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700">• {c}</li>
                      ))}
                    </ul>
                  )}

                  {factor.rankings && (
                    <div className="bg-[#FAF7F2] rounded-lg p-4">
                      <div className="space-y-3">
                        {factor.rankings.map((rank: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3">
                            <span className="w-32 text-sm font-medium text-gray-700">{rank.category}</span>
                            <div className="flex-1 flex flex-wrap gap-1">
                              {rank.strains.map((s: string, i: number) => (
                                <span key={i} className="text-xs bg-white px-2 py-0.5 rounded border border-[#1C1C1C]/20">
                                  {s}
                                </span>
                              ))}
                            </div>
                            {rank.notes && <span className="text-xs text-gray-500">{rank.notes}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {factor.examples && (
                    <div className="bg-[#FAF7F2] rounded-lg p-4">
                      <div className="space-y-2">
                        {factor.examples.map((ex: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3">
                            <span className="w-48 text-sm text-gray-700">{ex.style}</span>
                            <span className="text-sm font-medium text-[#722F37]">{ex.strain}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {factor.caution && (
                    <p className="text-sm text-red-600 mt-2 italic">{factor.caution}</p>
                  )}
                </div>
              ))}

              {/* Quick Reference */}
              <div className="mt-8 pt-6 border-t border-[#1C1C1C]/10">
                <h3 className="font-semibold text-[#1C1C1C] mb-4">Quick Reference by Grape</h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(yeastData.sections.selection.quick_reference).map(([grape, strains]) => (
                    <div key={grape} className="bg-[#FAF7F2] rounded-lg p-3">
                      <p className="font-medium text-[#722F37] capitalize mb-1">{grape.replace(/_/g, ' ')}</p>
                      <div className="flex flex-wrap gap-1">
                        {(strains as string[]).map((s, i) => (
                          <span key={i} className="text-xs bg-white px-2 py-0.5 rounded border border-[#1C1C1C]/10">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fermentation Section */}
        {activeSection === 'fermentation' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{yeastData.sections.fermentation.title}</h2>
              <p className="text-gray-600 mb-6">{yeastData.sections.fermentation.description}</p>

              {/* Stages */}
              <div className="mb-8">
                <h3 className="font-semibold text-[#1C1C1C] mb-4">Fermentation Stages</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {yeastData.sections.fermentation.stages.map((stage: any, idx: number) => (
                    <div key={idx} className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-serif text-lg italic text-[#722F37]">{stage.stage}</h4>
                        <span className="text-xs bg-white px-2 py-0.5 rounded border">{stage.duration}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{stage.description}</p>
                      <p className="text-xs text-gray-600"><span className="font-medium">What happens:</span> {stage.what_happens}</p>
                      <p className="text-xs text-red-600 mt-1"><span className="font-medium">Concerns:</span> {stage.concerns}</p>
                      <p className="text-xs text-green-600 mt-1"><span className="font-medium">Management:</span> {stage.management}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stuck Fermentation */}
              <div className="mb-8">
                <h3 className="font-semibold text-[#1C1C1C] mb-4">{yeastData.sections.fermentation.stuck_fermentation.title}</h3>
                <p className="text-gray-600 mb-4">{yeastData.sections.fermentation.stuck_fermentation.description}</p>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <h4 className="font-medium text-red-800 mb-3">Common Causes</h4>
                    <div className="space-y-2">
                      {yeastData.sections.fermentation.stuck_fermentation.causes.map((c: any, idx: number) => (
                        <div key={idx}>
                          <p className="text-sm font-medium text-red-700">{c.cause}</p>
                          <p className="text-xs text-gray-600">{c.detail}</p>
                          <p className="text-xs text-green-700">Solution: {c.solution}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                      <h4 className="font-medium text-blue-800 mb-2">Prevention</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {yeastData.sections.fermentation.stuck_fermentation.prevention.map((p: string, i: number) => (
                          <li key={i}>• {p}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-medium text-green-800 mb-2">Restart Protocol</h4>
                      <ol className="text-sm text-gray-700 space-y-1">
                        {yeastData.sections.fermentation.stuck_fermentation.restart_protocol.map((step: string, i: number) => (
                          <li key={i}>{i + 1}. {step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              {/* Temperature */}
              <div className="mb-8">
                <h3 className="font-semibold text-[#1C1C1C] mb-4">{yeastData.sections.fermentation.temperature.title}</h3>
                <div className="space-y-3">
                  {yeastData.sections.fermentation.temperature.ranges.map((range: any, idx: number) => (
                    <div key={idx} className="bg-[#FAF7F2] rounded-lg p-4 flex items-start gap-4">
                      <span className="text-2xl">🌡️</span>
                      <div className="flex-1">
                        <p className="font-medium text-[#722F37]">{range.range}</p>
                        <p className="text-sm text-gray-700">{range.effect}</p>
                        <p className="text-xs text-gray-500 mt-1">Best for: {range.use}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4 bg-amber-50 p-3 rounded-lg">{yeastData.sections.fermentation.temperature.science}</p>
              </div>

              {/* Nutrients */}
              <div>
                <h3 className="font-semibold text-[#1C1C1C] mb-4">{yeastData.sections.fermentation.nutrients.title}</h3>
                <p className="text-gray-600 mb-4">{yeastData.sections.fermentation.nutrients.description}</p>

                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 mb-4">
                  <h4 className="font-medium text-amber-800 mb-2">{yeastData.sections.fermentation.nutrients.yan.title}</h4>
                  <p className="text-sm text-gray-700 mb-2">{yeastData.sections.fermentation.nutrients.yan.description}</p>

                  <div className="grid gap-2 md:grid-cols-3 mt-3">
                    {Object.entries(yeastData.sections.fermentation.nutrients.yan.targets).map(([level, target]) => (
                      <div key={level} className="bg-white rounded p-2 text-center">
                        <p className="text-xs text-gray-500 capitalize">{level.replace(/_/g, ' ')}</p>
                        <p className="font-mono text-sm">{target as string}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {yeastData.sections.fermentation.nutrients.additions.map((add: any, idx: number) => (
                    <div key={idx} className="bg-[#FAF7F2] rounded-lg p-4">
                      <h4 className="font-medium text-[#722F37] mb-1">{add.product}</h4>
                      <p className="text-xs text-gray-500 mb-2">{add.type}</p>
                      <p className="text-sm text-gray-700"><span className="font-medium">Timing:</span> {add.timing}</p>
                      <p className="text-xs text-gray-600 mt-1">{add.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compounds Section */}
        {activeSection === 'compounds' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{yeastData.sections.compounds.title}</h2>
              <p className="text-gray-600 mb-6">{yeastData.sections.compounds.description}</p>

              <div className="grid gap-6 md:grid-cols-2">
                {yeastData.sections.compounds.categories.map((compound: any) => (
                  <div key={compound.id} className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10">
                    <div className="flex items-start gap-3 mb-3">
                      <CompoundCategoryIcon id={compound.id} />
                      <div>
                        <h3 className="font-serif text-lg italic text-[#722F37]">{compound.name}</h3>
                        <p className="text-sm text-gray-600">{compound.aroma_character || compound.contribution}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{compound.description}</p>

                    {compound.formation && (
                      <p className="text-xs text-gray-500 mb-2"><span className="font-medium">Formation:</span> {compound.formation}</p>
                    )}

                    {compound.factors_increasing && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-green-700">Increases with:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {compound.factors_increasing.map((f: string, i: number) => (
                            <span key={i} className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">{f}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {compound.factors_decreasing && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-red-700">Decreases with:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {compound.factors_decreasing.map((f: string, i: number) => (
                            <span key={i} className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">{f}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {compound.examples && (
                      <div className="mt-3 pt-3 border-t border-[#1C1C1C]/10">
                        <p className="text-xs font-medium text-[#1C1C1C] mb-2">Key Compounds:</p>
                        <div className="space-y-1">
                          {compound.examples.slice(0, 3).map((ex: any, i: number) => (
                            <div key={i} className="text-xs flex justify-between">
                              <span className="font-mono">{ex.compound}</span>
                              <span className="text-gray-500">{ex.aroma}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Techniques Section */}
        {activeSection === 'techniques' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{yeastData.sections.techniques.title}</h2>
              <p className="text-gray-600 mb-6">{yeastData.sections.techniques.description}</p>

              <div className="grid gap-4 md:grid-cols-2">
                {yeastData.sections.techniques.techniques.map((technique: any) => (
                  <Link
                    key={technique.id}
                    href={`/resources/yeast/techniques/${technique.id}`}
                    className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group block"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">{technique.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-serif text-lg italic text-[#722F37] group-hover:underline">{technique.name}</h3>
                        {technique.risk_level && (
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            technique.risk_level === 'High' ? 'bg-red-100 text-red-800' :
                            technique.risk_level === 'Low' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {technique.risk_level} risk
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{technique.description}</p>

                    {technique.advantages && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-green-700 mb-1">Advantages:</p>
                        <ul className="text-xs text-gray-600 space-y-0.5">
                          {technique.advantages.slice(0, 2).map((a: string, i: number) => (
                            <li key={i}>• {a}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {technique.who_uses && (
                      <p className="text-xs text-gray-500 mt-2"><span className="font-medium">Used by:</span> {technique.who_uses}</p>
                    )}

                    {technique.styles && (
                      <p className="text-xs text-gray-500 mt-1"><span className="font-medium">Styles:</span> {technique.styles}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modern Section */}
        {activeSection === 'modern' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{yeastData.sections.modern.title}</h2>
              <p className="text-gray-600 mb-6">{yeastData.sections.modern.description}</p>

              {/* Trends */}
              <div className="mb-8">
                <h3 className="font-semibold text-[#1C1C1C] mb-4">Current Trends</h3>
                <div className="space-y-4">
                  {yeastData.sections.modern.trends.map((trend: any, idx: number) => (
                    <div key={idx} className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10">
                      <h4 className="font-serif text-lg italic text-[#722F37] mb-2">{trend.trend}</h4>
                      <p className="text-sm text-gray-700 mb-3">{trend.description}</p>

                      {trend.examples && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-[#1C1C1C] mb-1">Examples:</p>
                          <ul className="text-sm text-gray-600 space-y-0.5">
                            {trend.examples.map((ex: string, i: number) => (
                              <li key={i}>• {ex}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {trend.challenges && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-red-700 mb-1">Challenges:</p>
                          <ul className="text-sm text-gray-600 space-y-0.5">
                            {trend.challenges.map((c: string, i: number) => (
                              <li key={i}>• {c}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {trend.solutions && (
                        <div>
                          <p className="text-xs font-medium text-green-700 mb-1">Solutions:</p>
                          <ul className="text-sm text-gray-600 space-y-0.5">
                            {trend.solutions.map((s: string, i: number) => (
                              <li key={i}>• {s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Institutions */}
              <div className="mb-8">
                <h3 className="font-semibold text-[#1C1C1C] mb-4">Research Institutions</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {yeastData.sections.modern.research_institutions.map((inst: any) => (
                    <div key={inst.name} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-serif text-lg italic text-blue-800">{inst.name}</h4>
                        <span className="text-xs bg-white px-2 py-0.5 rounded border">{inst.country}</span>
                      </div>
                      <p className="text-sm text-gray-700"><span className="font-medium">Focus:</span> {inst.focus}</p>
                      <p className="text-xs text-gray-500 mt-1 italic">{inst.notable}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Future Directions */}
              <div>
                <h3 className="font-semibold text-[#1C1C1C] mb-4">Future Directions</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {yeastData.sections.modern.future_directions.map((dir: any) => (
                    <div key={dir.area} className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="font-medium text-purple-800 mb-2">{dir.area}</h4>
                      <p className="text-sm text-gray-700 mb-2">{dir.description}</p>
                      <p className="text-xs text-purple-600"><span className="font-medium">Status:</span> {dir.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
