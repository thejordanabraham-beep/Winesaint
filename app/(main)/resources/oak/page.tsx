'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type SectionId = 'species' | 'forests' | 'cooperage' | 'toast' | 'formats' | 'chemistry' | 'usage' | 'traditions' | 'alternatives';

const SECTIONS: { id: SectionId; label: string; icon: string }[] = [
  { id: 'species', label: 'Oak Species', icon: '🌳' },
  { id: 'forests', label: 'Forest Origins', icon: '🗺️' },
  { id: 'cooperage', label: 'Cooperage Craft', icon: '🛠️' },
  { id: 'toast', label: 'Toast Levels', icon: '🔥' },
  { id: 'formats', label: 'Barrel Formats', icon: '🛢️' },
  { id: 'chemistry', label: 'Oak Chemistry', icon: '⚗️' },
  { id: 'usage', label: 'New vs Used', icon: '♻️' },
  { id: 'traditions', label: 'Regional Traditions', icon: '🌍' },
  { id: 'alternatives', label: 'Alternatives', icon: '📦' },
];

function GrainIndicator({ grain }: { grain: string }) {
  const grainLower = grain.toLowerCase();
  let level = 2;
  if (grainLower.includes('very tight') || grainLower.includes('tight')) level = 1;
  if (grainLower.includes('coarse') || grainLower.includes('loose') || grainLower.includes('wide')) level = 3;

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-500">Grain:</span>
      <div className="flex gap-0.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-2 h-4 rounded-sm ${i <= level ? 'bg-[#722F37]' : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-600">{grain}</span>
    </div>
  );
}

function ToastMeter({ level }: { level: string }) {
  const levels: Record<string, number> = {
    'light': 1,
    'medium': 2,
    'medium-plus': 3,
    'heavy': 4,
  };
  const value = levels[level] || 2;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-6 h-3 rounded-sm transition-colors ${
              i <= value
                ? i === 1 ? 'bg-amber-200'
                : i === 2 ? 'bg-amber-400'
                : i === 3 ? 'bg-amber-600'
                : 'bg-amber-900'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function OakGuidePage() {
  const [activeSection, setActiveSection] = useState<SectionId>('species');
  const [oakData, setOakData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/resource-guides/oak');
        if (res.ok) {
          const data = await res.json();
          setOakData(data.content);
        }
      } catch (error) {
        console.error('Error fetching oak data:', error);
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

  if (!oakData) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Failed to load oak guide data.</p>
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
          <span className="text-[#1C1C1C]">Oak Guide</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">The Oak Guide</h1>
          <p className="mt-3 text-gray-600 max-w-3xl">
            {oakData.sections.overview.description}
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

        {/* Species Section */}
        {activeSection === 'species' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{oakData.sections.species.title}</h2>
              <p className="text-gray-600 mb-6">{oakData.sections.species.description}</p>

              <div className="grid gap-6 md:grid-cols-3">
                {oakData.sections.species.items.map((species: any) => (
                  <Link key={species.id} href={`/resources/oak/species/${species.id}`} className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group block">
                    <h3 className="font-serif text-xl italic text-[#722F37] group-hover:underline">{species.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{species.common_name}</p>

                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-medium text-[#1C1C1C]">Origin:</span>
                        <span className="text-sm text-gray-600 ml-2">{species.origin}</span>
                      </div>

                      <GrainIndicator grain={species.grain} />

                      <div>
                        <p className="text-xs font-medium text-[#1C1C1C] mb-1">Characteristics:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {species.characteristics.slice(0, 3).map((c: string, i: number) => (
                            <li key={i}>• {c}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-[#1C1C1C] mb-1">Flavors:</p>
                        <div className="flex flex-wrap gap-1">
                          {species.flavor_profile.map((f: string, i: number) => (
                            <span key={i} className="text-xs bg-white px-2 py-0.5 rounded border border-[#1C1C1C]/20">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 italic pt-2 border-t border-[#1C1C1C]/10">
                        Best for: {species.best_for}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Forests Section */}
        {activeSection === 'forests' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{oakData.sections.forests.title}</h2>
              <p className="text-gray-600 mb-6">{oakData.sections.forests.description}</p>

              {oakData.sections.forests.regions.map((region: any) => (
                <div key={region.id} className="mb-8 last:mb-0">
                  <h3 className="text-lg font-semibold text-[#1C1C1C] mb-4 pb-2 border-b-2 border-[#722F37]">
                    {region.name} <span className="text-gray-400 font-normal">({region.country})</span>
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {region.forests.map((forest: any) => (
                      <Link key={forest.id} href={`/resources/oak/forests/${forest.id}`} className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group block">
                        <h4 className="font-serif text-lg italic text-[#722F37] group-hover:underline">{forest.name}</h4>
                        {forest.department && (
                          <p className="text-xs text-gray-500 mb-2">{forest.department}</p>
                        )}

                        <div className="space-y-2 text-sm">
                          {forest.species_mix && (
                            <p><span className="font-medium">Species:</span> {forest.species_mix}</p>
                          )}
                          {forest.species && (
                            <p><span className="font-medium">Species:</span> {forest.species}</p>
                          )}
                          <GrainIndicator grain={forest.grain} />
                          <p className="text-gray-600">{forest.characteristics}</p>

                          <div className="pt-2 border-t border-[#1C1C1C]/10">
                            <p className="text-xs"><span className="font-medium">Flavors:</span> {forest.flavor_notes}</p>
                            <p className="text-xs mt-1"><span className="font-medium">Price:</span> {forest.price_tier}</p>
                            <p className="text-xs text-gray-500 italic mt-1">Best for: {forest.best_for}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Toast Levels Section */}
        {activeSection === 'toast' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{oakData.sections.toast_levels.title}</h2>
              <p className="text-gray-600 mb-6">{oakData.sections.toast_levels.description}</p>

              <div className="space-y-4">
                {oakData.sections.toast_levels.levels.map((level: any) => (
                  <Link key={level.id} href={`/resources/oak/toast/${level.id}`} className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group block">
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <h3 className="font-serif text-xl italic text-[#722F37] group-hover:underline">{level.name}</h3>
                      <ToastMeter level={level.id} />
                      <span className="text-sm text-gray-500">
                        {level.temperature_f} / {level.temperature_c}
                      </span>
                      <span className="text-sm text-gray-500">
                        {level.duration}
                      </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-xs font-medium text-[#1C1C1C] mb-1">Characteristics:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {level.characteristics.map((c: string, i: number) => (
                            <li key={i}>• {c}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-[#1C1C1C] mb-1">Flavor Compounds:</p>
                        <div className="flex flex-wrap gap-1">
                          {level.flavor_compounds.map((f: string, i: number) => (
                            <span key={i} className="text-xs bg-white px-2 py-0.5 rounded border border-[#1C1C1C]/20">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-[#1C1C1C] mb-1">Ellagitannins:</p>
                        <p className="text-sm text-gray-600">{level.ellagitannins}</p>
                        <p className="text-xs text-gray-500 italic mt-2">Best for: {level.best_for}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Barrel Formats Section */}
        {activeSection === 'formats' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{oakData.sections.barrel_formats.title}</h2>
              <p className="text-gray-600 mb-6">{oakData.sections.barrel_formats.description}</p>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {oakData.sections.barrel_formats.formats.map((format: any) => (
                  <Link key={format.id} href={`/resources/oak/formats/${format.id}`} className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group block">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-lg italic text-[#722F37] group-hover:underline">{format.name}</h3>
                      <span className="text-lg font-bold text-[#1C1C1C]">
                        {typeof format.capacity_liters === 'number'
                          ? `${format.capacity_liters}L`
                          : format.capacity_liters}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mb-2">{format.origin}</p>
                    {format.dimensions && (
                      <p className="text-xs text-gray-500 mb-2">{format.dimensions}</p>
                    )}
                    <p className="text-sm text-gray-600">{format.characteristics}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      <span className="font-medium">Oak influence:</span> {format.oak_influence}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cooperage Section */}
        {activeSection === 'cooperage' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{oakData.sections.cooperage.title}</h2>
              <p className="text-gray-600 mb-6">{oakData.sections.cooperage.description}</p>

              {/* Tree Requirements */}
              <div className="bg-[#FAF7F2] rounded-lg p-5 mb-6">
                <h3 className="font-semibold text-[#1C1C1C] mb-3">Tree Requirements</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-xs text-gray-500">Minimum Age</p>
                    <p className="text-lg font-medium">{oakData.sections.cooperage.tree_requirements.minimum_age}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Yield</p>
                    <p className="text-lg font-medium">{oakData.sections.cooperage.tree_requirements.yield}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Selection</p>
                    <p className="text-sm">{oakData.sections.cooperage.tree_requirements.selection}</p>
                  </div>
                </div>
              </div>

              {/* Seasoning */}
              <div className="mb-6">
                <h3 className="font-semibold text-[#1C1C1C] mb-3">Seasoning</h3>
                <p className="text-sm text-gray-600 mb-4">{oakData.sections.cooperage.seasoning.description}</p>
                <div className="grid gap-4 md:grid-cols-2">
                  {oakData.sections.cooperage.seasoning.methods.map((method: any) => (
                    <div key={method.name} className="bg-[#FAF7F2] rounded-lg p-4">
                      <h4 className="font-medium text-[#722F37]">{method.name}</h4>
                      <p className="text-sm"><span className="font-medium">Duration:</span> {method.duration}</p>
                      <p className="text-sm"><span className="font-medium">Quality:</span> {method.quality}</p>
                      <p className="text-xs text-gray-500 mt-2">{method.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stave Preparation */}
              {oakData.sections.cooperage.stave_preparation && (
                <div className="mb-6">
                  <h3 className="font-semibold text-[#1C1C1C] mb-3">Stave Preparation</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-[#FAF7F2] rounded-lg p-4">
                      <h4 className="font-medium text-[#722F37]">French Oak</h4>
                      <p className="text-sm text-gray-600">{oakData.sections.cooperage.stave_preparation.french_oak}</p>
                    </div>
                    <div className="bg-[#FAF7F2] rounded-lg p-4">
                      <h4 className="font-medium text-[#722F37]">American Oak</h4>
                      <p className="text-sm text-gray-600">{oakData.sections.cooperage.stave_preparation.american_oak}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Barrel Forming */}
              {oakData.sections.cooperage.barrel_forming && (
                <div className="mb-6">
                  <h3 className="font-semibold text-[#1C1C1C] mb-3">Barrel Forming Stages</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    {oakData.sections.cooperage.barrel_forming.stages.map((stage: any) => (
                      <div key={stage.name} className="bg-[#FAF7F2] rounded-lg p-4">
                        <h4 className="font-medium text-[#722F37]">{stage.name}</h4>
                        <p className="text-xs text-gray-500 italic mb-2">{stage.translation}</p>
                        {stage.duration && <p className="text-sm"><span className="font-medium">Duration:</span> {stage.duration}</p>}
                        {stage.method && <p className="text-sm"><span className="font-medium">Method:</span> {stage.method}</p>}
                        <p className="text-sm text-gray-600 mt-1">{stage.purpose}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Heat Sources */}
              {oakData.sections.cooperage.heat_sources && (
                <div className="mb-6">
                  <h3 className="font-semibold text-[#1C1C1C] mb-3">Heat Sources</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    {oakData.sections.cooperage.heat_sources.map((source: any) => (
                      <div key={source.name} className="bg-[#FAF7F2] rounded-lg p-4">
                        <h4 className="font-medium text-[#722F37]">{source.name}</h4>
                        <p className="text-sm text-gray-600">{source.description}</p>
                        <p className="text-xs text-gray-500 mt-2"><span className="font-medium">Character:</span> {source.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Famous Cooperages */}
              {oakData.sections.cooperage.famous_cooperages && (
                <div className="mb-6">
                  <h3 className="font-semibold text-[#1C1C1C] mb-3">Famous Cooperages</h3>
                  <p className="text-sm text-gray-600 mb-4">{oakData.sections.cooperage.famous_cooperages.description}</p>

                  {/* Price Tiers */}
                  {oakData.sections.cooperage.famous_cooperages.price_tiers && (
                    <div className="bg-[#FAF7F2] rounded-lg p-5 mb-6">
                      <h4 className="font-medium text-[#1C1C1C] mb-3">Barrel Price Guide</h4>
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {oakData.sections.cooperage.famous_cooperages.price_tiers.map((tier: any) => (
                          <div key={tier.type} className="flex justify-between items-center bg-white rounded p-3 border border-[#1C1C1C]/10">
                            <div>
                              <p className="font-medium text-sm">{tier.type}</p>
                              <p className="text-xs text-gray-500">{tier.notes}</p>
                            </div>
                            <span className="text-[#722F37] font-semibold">{tier.range}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {oakData.sections.cooperage.famous_cooperages.regions?.map((region: any) => (
                    <div key={region.name} className="mb-6">
                      <h4 className="text-lg font-semibold text-[#1C1C1C] mb-3 pb-2 border-b-2 border-[#722F37]">{region.name}</h4>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {region.cooperages.map((cooper: any) => (
                          <Link
                            key={cooper.id}
                            href={`/resources/oak/cooperages/${cooper.id}`}
                            className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group block"
                          >
                            <h5 className="font-serif text-lg italic text-[#722F37] group-hover:underline">{cooper.name}</h5>
                            <p className="text-xs text-gray-500 mb-2">{cooper.location} · Est. {cooper.founded}</p>
                            <p className="text-sm text-gray-600 line-clamp-2">{cooper.specialty || cooper.characteristics}</p>
                            {cooper.classification && (
                              <span className="inline-block mt-2 text-xs bg-white px-2 py-0.5 rounded border border-[#1C1C1C]/20">
                                {cooper.classification}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Classification Styles */}
                  {oakData.sections.cooperage.famous_cooperages.classification_styles && (
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      {Object.entries(oakData.sections.cooperage.famous_cooperages.classification_styles).map(([key, style]: [string, any]) => (
                        <div key={key} className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                          <h4 className="font-serif text-lg italic text-[#722F37] capitalize mb-2">{key} Style</h4>
                          <p className="text-sm text-gray-600 mb-2">{style.description}</p>
                          <p className="text-xs text-gray-500"><span className="font-medium">Stave thickness:</span> {style.stave_thickness}</p>
                          <p className="text-xs text-gray-500 mt-1"><span className="font-medium">Notable coopers:</span> {style.cooperages?.join(', ')}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chemistry Section */}
        {activeSection === 'chemistry' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{oakData.sections.chemistry.title}</h2>
              <p className="text-gray-600 mb-6">{oakData.sections.chemistry.description}</p>

              {/* Oak Composition */}
              <div className="bg-[#FAF7F2] rounded-lg p-5 mb-6">
                <h3 className="font-semibold text-[#1C1C1C] mb-3">Oak Composition</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#722F37]">{oakData.sections.chemistry.oak_composition.cellulose}</p>
                    <p className="text-sm text-gray-600">Cellulose</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#722F37]">{oakData.sections.chemistry.oak_composition.hemicellulose}</p>
                    <p className="text-sm text-gray-600">Hemicellulose</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#722F37]">{oakData.sections.chemistry.oak_composition.lignin}</p>
                    <p className="text-sm text-gray-600">Lignin</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#722F37]">{oakData.sections.chemistry.oak_composition.tannins}</p>
                    <p className="text-sm text-gray-600">Tannins</p>
                  </div>
                </div>
              </div>

              {/* Compounds */}
              <div className="space-y-4">
                {oakData.sections.chemistry.compounds.map((compound: any) => (
                  <div key={compound.id} className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-serif text-xl italic text-[#722F37]">{compound.name}</h3>
                      <span className="text-sm bg-white px-2 py-0.5 rounded border border-[#1C1C1C]/20">
                        {compound.aroma}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">Source:</span> {compound.source}
                    </p>
                    <p className="text-sm text-gray-600">{compound.notes}</p>
                    <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-[#1C1C1C]/10">
                      <span className="font-medium">Toast effect:</span> {compound.toast_effect}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* New vs Used Section */}
        {activeSection === 'usage' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{oakData.sections.new_vs_used.title}</h2>
              <p className="text-gray-600 mb-6">{oakData.sections.new_vs_used.description}</p>

              {/* Extraction Rates */}
              <div className="mb-6">
                <h3 className="font-semibold text-[#1C1C1C] mb-4">Extraction by Use</h3>
                <div className="space-y-3">
                  {oakData.sections.new_vs_used.extraction_rates.map((rate: any) => (
                    <div key={rate.use} className="flex items-center gap-4">
                      <div className="w-32 text-sm font-medium">{rate.use}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-[#722F37] h-full rounded-full transition-all"
                          style={{ width: rate.widthPercent }}
                        />
                      </div>
                      <div className="w-16 text-sm text-right">{rate.extraction}</div>
                      <div className="w-48 text-xs text-gray-500 hidden md:block">{rate.character}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typical Usage */}
              <div className="bg-[#FAF7F2] rounded-lg p-5">
                <h3 className="font-semibold text-[#1C1C1C] mb-4">Typical New Oak Usage</h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(oakData.sections.new_vs_used.typical_usage).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600">{key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                      <span className="font-medium">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regional Traditions Section */}
        {activeSection === 'traditions' && oakData.sections.regional_traditions && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{oakData.sections.regional_traditions.title}</h2>
              <p className="text-gray-600 mb-6">{oakData.sections.regional_traditions.description}</p>

              <div className="space-y-6">
                {oakData.sections.regional_traditions.regions.map((region: any) => (
                  <div key={region.region} className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="font-serif text-xl italic text-[#722F37]">{region.region}</h3>
                      <span className="text-sm bg-white px-2 py-0.5 rounded border border-[#1C1C1C]/20">
                        {region.oak_type}
                      </span>
                      {region.format && (
                        <span className="text-sm bg-white px-2 py-0.5 rounded border border-[#1C1C1C]/20">
                          {region.format}
                        </span>
                      )}
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 text-sm mb-3">
                      {region.tradition && (
                        <p><span className="font-medium">Tradition:</span> {region.tradition}</p>
                      )}
                      {region.style_impact && (
                        <p><span className="font-medium">Style Impact:</span> {region.style_impact}</p>
                      )}
                      {region.new_oak_usage && (
                        <p><span className="font-medium">New Oak Usage:</span> {region.new_oak_usage}</p>
                      )}
                      {region.inventory && (
                        <p><span className="font-medium">Inventory:</span> {region.inventory}</p>
                      )}
                    </div>

                    {region.aging_requirements && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Aging Requirements:</span> {region.aging_requirements}
                      </p>
                    )}

                    {region.modern_trend && (
                      <p className="text-xs text-gray-500 italic pt-2 border-t border-[#1C1C1C]/10">
                        Modern trend: {region.modern_trend}
                      </p>
                    )}

                    {region.debate && (
                      <p className="text-xs text-amber-700 italic pt-2 border-t border-[#1C1C1C]/10">
                        {region.debate}
                      </p>
                    )}

                    {region.notable_coopers && (
                      <p className="text-xs text-gray-500 mt-2">
                        <span className="font-medium">Notable coopers:</span> {region.notable_coopers.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Alternatives Section */}
        {activeSection === 'alternatives' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{oakData.sections.alternatives.title}</h2>
              <p className="text-gray-600 mb-6">{oakData.sections.alternatives.description}</p>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                {oakData.sections.alternatives.formats.map((format: any) => (
                  <div key={format.id} className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-lg italic text-[#722F37]">{format.name}</h3>
                      <span className="text-xs bg-white px-2 py-0.5 rounded border border-[#1C1C1C]/20">
                        {format.quality_tier}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Speed:</span> {format.extraction_speed}
                    </p>

                    {format.pros && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-green-700">Pros:</p>
                        <ul className="text-xs text-gray-600">
                          {format.pros.map((p: string, i: number) => <li key={i}>+ {p}</li>)}
                        </ul>
                      </div>
                    )}

                    {format.cons && (
                      <div>
                        <p className="text-xs font-medium text-red-700">Cons:</p>
                        <ul className="text-xs text-gray-600">
                          {format.cons.map((c: string, i: number) => <li key={i}>- {c}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm font-medium text-[#722F37]">
                  Quality Hierarchy: {oakData.sections.alternatives.quality_hierarchy}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Barrel Costs Footer */}
        {oakData.barrel_costs && (
          <div className="mt-8 bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">{oakData.barrel_costs.title}</h2>
            <div className="grid gap-3 md:grid-cols-5">
              {oakData.barrel_costs.prices.map((item: any) => (
                <div key={item.type} className="text-center">
                  <p className="text-lg font-bold text-[#722F37]">{item.price_range}</p>
                  <p className="text-xs text-gray-600">{item.type}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
