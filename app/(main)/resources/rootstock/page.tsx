'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type SectionId = 'history' | 'species' | 'rootstocks' | 'selection' | 'regions' | 'modern';

const SECTIONS: { id: SectionId; label: string; icon: string }[] = [
  { id: 'history', label: 'The Phylloxera Crisis', icon: '🦠' },
  { id: 'species', label: 'American Species', icon: '🌿' },
  { id: 'rootstocks', label: 'Rootstock Varieties', icon: '🌱' },
  { id: 'selection', label: 'Selection Criteria', icon: '📋' },
  { id: 'regions', label: 'Regional Preferences', icon: '🗺️' },
  { id: 'modern', label: 'Modern Developments', icon: '🔬' },
];

function VigorMeter({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-500 mr-1">Vigor:</span>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-sm ${
            i <= rating
              ? i <= 2 ? 'bg-green-500' : i <= 3 ? 'bg-yellow-500' : 'bg-red-500'
              : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

function ResistanceScale({ rating, label }: { rating: number; label: string }) {
  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-400', 'bg-green-500'];
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-20">{label}:</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-24">
        <div
          className={`h-2 rounded-full ${colors[rating - 1] || 'bg-gray-300'}`}
          style={{ width: `${rating * 20}%` }}
        />
      </div>
    </div>
  );
}

function ParentageIndicator({ parentage }: { parentage: { type: string; species?: string } }) {
  const getSpeciesColor = (species: string) => {
    if (species.includes('riparia')) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (species.includes('rupestris')) return 'bg-amber-100 text-amber-800 border-amber-300';
    if (species.includes('berlandieri')) return 'bg-green-100 text-green-800 border-green-300';
    if (species.includes('vinifera')) return 'bg-purple-100 text-purple-800 border-purple-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (parentage.species) {
    return (
      <span className={`text-xs px-2 py-0.5 rounded border ${getSpeciesColor(parentage.species)}`}>
        {parentage.species}
      </span>
    );
  }

  return (
    <span className={`text-xs px-2 py-0.5 rounded border ${getSpeciesColor(parentage.type)}`}>
      {parentage.type}
    </span>
  );
}

export default function RootstockGuidePage() {
  const [activeSection, setActiveSection] = useState<SectionId>('history');
  const [rootstockData, setRootstockData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/resource-guides/rootstock`);
        if (res.ok) {
          const data = await res.json();
          setRootstockData(data.content);
        }
      } catch (error) {
        console.error('Error fetching rootstock data:', error);
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

  if (!rootstockData) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Failed to load rootstock guide data.</p>
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
          <span className="text-[#1C1C1C]">Rootstock Guide</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{rootstockData.title}</h1>
          <p className="mt-1 text-lg text-[#722F37] italic">{rootstockData.subtitle}</p>
          <p className="mt-3 text-gray-600 max-w-3xl">
            {rootstockData.sections.overview.description}
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

        {/* History Section */}
        {activeSection === 'history' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{rootstockData.sections.history.title}</h2>
              <p className="text-gray-600 mb-6">{rootstockData.sections.history.description}</p>

              {/* Timeline */}
              <div className="mb-8">
                <h3 className="font-semibold text-[#1C1C1C] mb-4">Crisis Timeline</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#722F37]" />
                  <div className="space-y-6">
                    {rootstockData.sections.history.crisis.timeline.map((event: any, idx: number) => (
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

              {/* Impact */}
              <div className="grid gap-4 md:grid-cols-3 mb-8">
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Economic Impact</h4>
                  <p className="text-sm text-gray-700">{rootstockData.sections.history.crisis.impact.economic}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">Social Impact</h4>
                  <p className="text-sm text-gray-700">{rootstockData.sections.history.crisis.impact.social}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Viticultural Impact</h4>
                  <p className="text-sm text-gray-700">{rootstockData.sections.history.crisis.impact.viticultural}</p>
                </div>
              </div>

              {/* Pioneers */}
              <div className="mb-8">
                <h3 className="font-semibold text-[#1C1C1C] mb-4">Pioneers of the Solution</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {rootstockData.sections.history.solution.pioneers.map((pioneer: any) => (
                    <div key={pioneer.name} className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10">
                      <h4 className="font-serif text-lg italic text-[#722F37]">{pioneer.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{pioneer.origin}</p>
                      <p className="text-sm text-gray-700">{pioneer.contribution}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Species Section */}
        {activeSection === 'species' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{rootstockData.sections.species.title}</h2>
              <p className="text-gray-600 mb-6">{rootstockData.sections.species.description}</p>

              <div className="grid gap-6 lg:grid-cols-3">
                {rootstockData.sections.species.items.map((species: any) => (
                  <Link key={species.id} href={`/resources/rootstock/species/${species.id}`} className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group block">
                    <h3 className="font-serif text-xl italic text-[#722F37] group-hover:underline">{species.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{species.common_name}</p>

                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-xs font-medium text-[#1C1C1C]">Native Range:</span>
                        <p className="text-gray-600">{species.native_range}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-gray-500">Vigor:</span>
                          <p className="font-medium">{species.vigor}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Drought:</span>
                          <p className="font-medium">{species.drought_tolerance}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-[#1C1C1C] mb-1">Famous Hybrids:</p>
                        <div className="flex flex-wrap gap-1">
                          {species.famous_hybrids.slice(0, 4).map((h: string, i: number) => (
                            <span key={i} className="text-xs bg-white px-2 py-0.5 rounded border border-[#1C1C1C]/20">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rootstocks Section */}
        {activeSection === 'rootstocks' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{rootstockData.sections.rootstocks.title}</h2>
              <p className="text-gray-600 mb-6">{rootstockData.sections.rootstocks.description}</p>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rootstockData.sections.rootstocks.varieties.map((rootstock: any) => (
                  <Link
                    key={rootstock.id}
                    href={`/resources/rootstock/varieties/${rootstock.id}`}
                    className={`bg-[#FAF7F2] rounded-lg p-4 border hover:shadow-md transition-all group block ${
                      rootstock.id === 'axr1'
                        ? 'border-red-300 bg-red-50'
                        : 'border-[#1C1C1C]/10 hover:border-[#722F37]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-serif text-xl italic text-[#722F37] group-hover:underline">{rootstock.name}</h3>
                        <p className="text-xs text-gray-500">{rootstock.full_name}</p>
                      </div>
                      {rootstock.id === 'axr1' && (
                        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded">FAILED</span>
                      )}
                    </div>

                    <div className="mb-3">
                      <ParentageIndicator parentage={rootstock.parentage} />
                    </div>

                    <div className="space-y-2">
                      <VigorMeter rating={rootstock.vigor_rating} />
                      <ResistanceScale rating={rootstock.limestone_rating} label="Limestone" />
                      <ResistanceScale rating={rootstock.drought_rating} label="Drought" />
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#1C1C1C]/10">
                      <p className="text-xs text-gray-500 mb-1">Best for:</p>
                      <div className="flex flex-wrap gap-1">
                        {rootstock.best_for.slice(0, 2).map((use: string, i: number) => (
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
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{rootstockData.sections.selection.title}</h2>
              <p className="text-gray-600 mb-6">{rootstockData.sections.selection.description}</p>

              {rootstockData.sections.selection.factors.map((factor: any) => (
                <div key={factor.factor} className="mb-8 last:mb-0">
                  <h3 className="font-semibold text-[#1C1C1C] mb-2">{factor.factor}</h3>
                  <p className="text-sm text-gray-600 mb-4">{factor.description}</p>

                  <div className="bg-[#FAF7F2] rounded-lg p-4">
                    <div className="space-y-2">
                      {factor.rankings.slice(0, 8).map((rank: any) => (
                        <div key={rank.rootstock} className="flex items-center gap-3">
                          <span className="w-28 text-sm font-medium">{rank.rootstock}</span>
                          <div className="flex-1 max-w-xs">
                            {typeof rank.rating === 'number' ? (
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className={`w-6 h-3 rounded-sm ${
                                      i <= rank.rating
                                        ? factor.factor.includes('Vigor')
                                          ? i <= 2 ? 'bg-green-500' : i <= 3 ? 'bg-yellow-500' : 'bg-red-500'
                                          : 'bg-[#722F37]'
                                        : 'bg-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>
                            ) : (
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                rank.rating === 'Low-K' || rank.rating === 'Low' ? 'bg-green-100 text-green-800' :
                                rank.rating === 'Very High-K' || rank.rating === 'High-K' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {rank.rating}
                              </span>
                            )}
                          </div>
                          {rank.notes && (
                            <span className="text-xs text-gray-500">{rank.notes}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regions Section */}
        {activeSection === 'regions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{rootstockData.sections.regions.title}</h2>
              <p className="text-gray-600 mb-6">{rootstockData.sections.regions.description}</p>

              <div className="grid gap-6 md:grid-cols-2">
                {rootstockData.sections.regions.regions.map((region: any) => (
                  <Link
                    key={region.id}
                    href={`/resources/rootstock/regions/${region.id}`}
                    className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group block"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-serif text-xl italic text-[#722F37] group-hover:underline">{region.name}</h3>
                        <p className="text-sm text-gray-500">{region.country}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Key Challenge:</span> {region.key_challenge}
                    </p>

                    <div className="mb-3">
                      <p className="text-xs font-medium text-[#1C1C1C] mb-2">Primary Rootstocks:</p>
                      <div className="space-y-1">
                        {region.primary_rootstocks.map((rs: any, i: number) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="font-medium">{rs.name}</span>
                            <span className="text-xs text-gray-500">{rs.percentage}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {region.unique_factors && (
                      <div className="pt-3 border-t border-[#1C1C1C]/10">
                        <ul className="text-xs text-gray-600 space-y-1">
                          {region.unique_factors.slice(0, 2).map((f: string, i: number) => (
                            <li key={i}>• {f}</li>
                          ))}
                        </ul>
                      </div>
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
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{rootstockData.sections.modern.title}</h2>
              <p className="text-gray-600 mb-6">{rootstockData.sections.modern.description}</p>

              {/* Climate Change */}
              <div className="mb-8">
                <h3 className="font-semibold text-[#1C1C1C] mb-4">Climate Change Adaptation</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <h4 className="font-medium text-orange-800 mb-3">Challenges</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      {rootstockData.sections.modern.climate_change.challenges.map((c: string, i: number) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-medium text-green-800 mb-3">Rootstock Responses</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      {rootstockData.sections.modern.climate_change.rootstock_responses.map((r: string, i: number) => (
                        <li key={i}>• {r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Future Directions */}
              <div>
                <h3 className="font-semibold text-[#1C1C1C] mb-4">Future Directions</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {rootstockData.sections.modern.future_directions.map((dir: any) => (
                    <div key={dir.area} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">{dir.area}</h4>
                      <p className="text-sm text-gray-700">{dir.description}</p>
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
