'use client';

import { useState } from 'react';
import Link from 'next/link';
import oakData from '@/app/data/oak.json';

type SectionId = 'species' | 'forests' | 'cooperage' | 'toast' | 'formats' | 'chemistry' | 'usage' | 'traditions' | 'alternatives';

const SECTIONS: { id: SectionId; label: string; icon: string }[] = [
  { id: 'species', label: 'Oak Species', icon: '🌳' },
  { id: 'forests', label: 'Forest Origins', icon: '🗺️' },
  { id: 'cooperage', label: 'Cooperage Craft', icon: '🛠️' },
  { id: 'toast', label: 'Toast Levels', icon: '🔥' },
  { id: 'formats', label: 'Barrel Formats', icon: '🛢️' },
  { id: 'chemistry', label: 'Oak Chemistry', icon: '⚗️' },
  { id: 'usage', label: 'New vs Used', icon: '♻️' },
  { id: 'traditions', label: 'Regional Traditions', icon: '🍷' },
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
                {oakData.sections.species.items.map((species) => (
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
                          {species.characteristics.slice(0, 3).map((c, i) => (
                            <li key={i}>• {c}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-[#1C1C1C] mb-1">Flavors:</p>
                        <div className="flex flex-wrap gap-1">
                          {species.flavor_profile.map((f, i) => (
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

              {oakData.sections.forests.regions.map((region) => (
                <div key={region.id} className="mb-8 last:mb-0">
                  <h3 className="text-lg font-semibold text-[#1C1C1C] mb-4 pb-2 border-b-2 border-[#722F37]">
                    {region.name} <span className="text-gray-400 font-normal">({region.country})</span>
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {region.forests.map((forest) => (
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
                  {oakData.sections.cooperage.seasoning.methods.map((method) => (
                    <div key={method.name} className="bg-[#FAF7F2] rounded-lg p-4">
                      <h4 className="font-medium text-[#722F37]">{method.name}</h4>
                      <p className="text-sm"><span className="font-medium">Duration:</span> {method.duration}</p>
                      <p className="text-sm"><span className="font-medium">Quality:</span> {method.quality}</p>
                      <p className="text-xs text-gray-500 mt-2">{method.notes}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  <span className="font-medium">Target moisture:</span> {oakData.sections.cooperage.seasoning.target_moisture}
                </p>
              </div>

              {/* Barrel Forming Stages */}
              <div className="mb-6">
                <h3 className="font-semibold text-[#1C1C1C] mb-3">Barrel Forming: Three Stages</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {oakData.sections.cooperage.barrel_forming.stages.map((stage, idx) => (
                    <div key={stage.name} className="bg-[#FAF7F2] rounded-lg p-4 relative">
                      <div className="absolute -top-3 -left-2 w-8 h-8 bg-[#722F37] text-white rounded-full flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <h4 className="font-serif text-lg italic text-[#722F37] mt-2">{stage.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{stage.translation}</p>
                      {stage.duration && <p className="text-sm"><span className="font-medium">Duration:</span> {stage.duration}</p>}
                      {stage.method && <p className="text-sm"><span className="font-medium">Method:</span> {stage.method}</p>}
                      <p className="text-sm text-gray-600 mt-2">{stage.purpose}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stave Preparation */}
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <h3 className="font-semibold text-[#1C1C1C] mb-2">Stave Preparation: Split vs Sawn</h3>
                <div className="grid gap-4 md:grid-cols-2 text-sm">
                  <div>
                    <p className="font-medium">French Oak:</p>
                    <p className="text-gray-600">{oakData.sections.cooperage.stave_preparation.french_oak}</p>
                  </div>
                  <div>
                    <p className="font-medium">American Oak:</p>
                    <p className="text-gray-600">{oakData.sections.cooperage.stave_preparation.american_oak}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Famous Cooperages */}
            {oakData.sections.cooperage.famous_cooperages && (
              <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
                <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">Famous Cooperages</h2>
                <p className="text-gray-600 mb-6">{oakData.sections.cooperage.famous_cooperages.description}</p>

                {/* Price Tiers */}
                <div className="bg-[#FAF7F2] rounded-lg p-5 mb-6">
                  <h3 className="font-semibold text-[#1C1C1C] mb-3">Barrel Price Tiers (225L)</h3>
                  <div className="space-y-2">
                    {oakData.sections.cooperage.famous_cooperages.price_tiers.map((tier: { type: string; range: string; notes: string }) => (
                      <div key={tier.type} className="flex items-center justify-between text-sm border-b border-[#1C1C1C]/10 pb-2 last:border-0">
                        <span className="font-medium">{tier.type}</span>
                        <span className="text-[#722F37] font-bold">{tier.range}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Classification Styles */}
                <div className="grid gap-4 md:grid-cols-2 mb-6">
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="font-serif text-lg italic text-purple-800 mb-2">Burgundian Style</h4>
                    <p className="text-sm text-gray-600 mb-2">{oakData.sections.cooperage.famous_cooperages.classification_styles.burgundian.description}</p>
                    <p className="text-xs text-gray-500">Stave: {oakData.sections.cooperage.famous_cooperages.classification_styles.burgundian.stave_thickness}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <h4 className="font-serif text-lg italic text-red-800 mb-2">Bordelaise Style</h4>
                    <p className="text-sm text-gray-600 mb-2">{oakData.sections.cooperage.famous_cooperages.classification_styles.bordelaise.description}</p>
                    <p className="text-xs text-gray-500">Stave: {oakData.sections.cooperage.famous_cooperages.classification_styles.bordelaise.stave_thickness}</p>
                  </div>
                </div>

                {/* Cooperages by Region */}
                {oakData.sections.cooperage.famous_cooperages.regions.map((region: { name: string; cooperages: Array<{ id: string; name: string; location: string; founded?: string; style?: string; classification?: string; notable_clients?: string[]; characteristics: string; specialty?: string; annual_production?: string }> }) => (
                  <div key={region.name} className="mb-8 last:mb-0">
                    <h3 className="font-serif text-xl italic text-[#722F37] mb-4 pb-2 border-b border-[#1C1C1C]/10">{region.name}</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {region.cooperages.map((cooperage) => (
                        <Link
                          key={cooperage.id}
                          href={`/resources/oak/cooperages/${cooperage.id}`}
                          className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group block"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37] group-hover:underline">{cooperage.name}</h4>
                            {cooperage.classification && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                cooperage.style === 'Burgundian' ? 'bg-purple-100 text-purple-800' :
                                cooperage.style === 'Bordelaise' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {cooperage.classification}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{cooperage.location}{cooperage.founded && ` · Est. ${cooperage.founded}`}</p>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{cooperage.characteristics}</p>
                          {cooperage.notable_clients && cooperage.notable_clients.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {cooperage.notable_clients.slice(0, 3).map((client: string, i: number) => (
                                <span key={i} className="text-xs bg-white px-2 py-0.5 rounded border border-[#1C1C1C]/10">{client}</span>
                              ))}
                              {cooperage.notable_clients.length > 3 && (
                                <span className="text-xs text-gray-400">+{cooperage.notable_clients.length - 3} more</span>
                              )}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Toast Levels Section */}
        {activeSection === 'toast' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{oakData.sections.toast_levels.title}</h2>
              <p className="text-gray-600 mb-6">{oakData.sections.toast_levels.description}</p>

              <div className="space-y-4">
                {oakData.sections.toast_levels.levels.map((level) => (
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
                          {level.characteristics.map((c, i) => (
                            <li key={i}>• {c}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-[#1C1C1C] mb-1">Flavor Compounds:</p>
                        <div className="flex flex-wrap gap-1">
                          {level.flavor_compounds.map((f, i) => (
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

              <div className="mt-6 bg-amber-50 rounded-lg p-4 border border-amber-200">
                <h4 className="font-medium text-[#1C1C1C] mb-1">Toasted Heads Option</h4>
                <p className="text-sm text-gray-600">{oakData.sections.toast_levels.toasted_heads.description}</p>
                <p className="text-sm text-gray-500 mt-1">{oakData.sections.toast_levels.toasted_heads.effect}</p>
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
                {oakData.sections.barrel_formats.formats.map((format) => (
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

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="bg-[#722F37]/10 rounded-lg p-4">
                  <h4 className="font-medium text-[#722F37] mb-2">Small Format Impact</h4>
                  <p className="text-sm text-gray-600">{oakData.sections.barrel_formats.size_impact.small_format}</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <h4 className="font-medium text-[#1C1C1C] mb-2">Large Format Impact</h4>
                  <p className="text-sm text-gray-600">{oakData.sections.barrel_formats.size_impact.large_format}</p>
                </div>
              </div>
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

              {/* Flavor Compounds */}
              <div className="space-y-4">
                {oakData.sections.chemistry.compounds.map((compound) => (
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

                    {compound.isomers && (
                      <div className="bg-white rounded p-3 mb-2">
                        <p className="text-sm font-medium mb-2">Isomers:</p>
                        <div className="grid gap-2 md:grid-cols-2 text-sm">
                          <div>
                            <p className="font-medium">Cis-isomer:</p>
                            <p className="text-gray-600">Concentration: {compound.isomers.cis.concentration}</p>
                            <p className="text-gray-600">Potency: {compound.isomers.cis.potency}</p>
                            <p className="text-gray-600">Threshold: {compound.isomers.cis.threshold_red_wine}</p>
                          </div>
                          <div>
                            <p className="font-medium">Trans-isomer:</p>
                            <p className="text-gray-600">Threshold: {compound.isomers.trans.threshold_red_wine}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {compound.types && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Types:</span> {compound.types.join(', ')}
                      </p>
                    )}

                    {compound.effect && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Effect:</span> {compound.effect}
                      </p>
                    )}

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
                  {oakData.sections.new_vs_used.extraction_rates.map((rate, idx) => (
                    <div key={rate.use} className="flex items-center gap-4">
                      <div className="w-32 text-sm font-medium">{rate.use}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-[#722F37] h-full rounded-full transition-all"
                          style={{ width: rate.extraction }}
                        />
                      </div>
                      <div className="w-16 text-sm text-right">{rate.extraction}</div>
                      <div className="w-48 text-xs text-gray-500 hidden md:block">{rate.character}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h4 className="font-medium text-[#1C1C1C] mb-2">Lactone Behavior</h4>
                  <p className="text-sm text-gray-600">{oakData.sections.new_vs_used.lactone_note}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-medium text-[#1C1C1C] mb-2">Oxygen Transmission</h4>
                  <p className="text-sm text-gray-600">{oakData.sections.new_vs_used.oxygen_note}</p>
                </div>
              </div>

              {/* Typical Usage */}
              <div className="bg-[#FAF7F2] rounded-lg p-5">
                <h3 className="font-semibold text-[#1C1C1C] mb-4">Typical New Oak Usage</h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(oakData.sections.new_vs_used.typical_usage).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600">{key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regional Traditions Section */}
        {activeSection === 'traditions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{oakData.sections.regional_traditions.title}</h2>
              <p className="text-gray-600 mb-6">{oakData.sections.regional_traditions.description}</p>

              <div className="grid gap-6 md:grid-cols-2">
                {oakData.sections.regional_traditions.regions.map((region) => {
                  const regionSlug = region.region.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                  return (
                    <Link
                      key={region.region}
                      href={`/resources/oak/traditions/${regionSlug}`}
                      className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group block"
                    >
                      <h3 className="font-serif text-xl italic text-[#722F37] mb-3 group-hover:underline">{region.region}</h3>

                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Oak Type:</span> {region.oak_type}</p>
                        <p><span className="font-medium">Format:</span> {region.format}</p>
                        {region.tradition && <p><span className="font-medium">Tradition:</span> {region.tradition}</p>}
                        <p><span className="font-medium">Style Impact:</span> {region.style_impact}</p>
                        {region.new_oak_usage && <p><span className="font-medium">New Oak:</span> {region.new_oak_usage}</p>}
                        {region.modern_trend && (
                          <p className="text-gray-500 italic pt-2 border-t border-[#1C1C1C]/10">
                            Modern trend: {region.modern_trend}
                          </p>
                        )}
                        {region.debate && (
                          <p className="text-gray-500 italic pt-2 border-t border-[#1C1C1C]/10">
                            {region.debate}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
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
                {oakData.sections.alternatives.formats.map((format) => (
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
                          {format.pros.map((p, i) => <li key={i}>+ {p}</li>)}
                        </ul>
                      </div>
                    )}

                    {format.cons && (
                      <div>
                        <p className="text-xs font-medium text-red-700">Cons:</p>
                        <ul className="text-xs text-gray-600">
                          {format.cons.map((c, i) => <li key={i}>- {c}</li>)}
                        </ul>
                      </div>
                    )}

                    {format.cost && (
                      <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-[#1C1C1C]/10">
                        Cost: {format.cost}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Micro-oxygenation */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
                <h4 className="font-medium text-[#1C1C1C] mb-2">Micro-oxygenation</h4>
                <p className="text-sm text-gray-600">{oakData.sections.alternatives.micro_oxygenation.description}</p>
                <p className="text-sm text-gray-500 mt-1">{oakData.sections.alternatives.micro_oxygenation.purpose}</p>
              </div>

              {/* Cost and Legal */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-[#FAF7F2] rounded-lg p-4">
                  <h4 className="font-medium text-[#1C1C1C] mb-2">Cost Comparison</h4>
                  <p className="text-sm"><span className="font-medium">Barrel:</span> {oakData.sections.alternatives.cost_comparison.barrel}</p>
                  <p className="text-sm"><span className="font-medium">Alternatives:</span> {oakData.sections.alternatives.cost_comparison.alternatives}</p>
                </div>
                <div className="bg-[#FAF7F2] rounded-lg p-4">
                  <h4 className="font-medium text-[#1C1C1C] mb-2">Legal Status</h4>
                  <p className="text-sm"><span className="font-medium">Prohibited:</span> {oakData.sections.alternatives.legal_status.prohibited}</p>
                  <p className="text-sm"><span className="font-medium">Allowed:</span> {oakData.sections.alternatives.legal_status.allowed}</p>
                </div>
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
        <div className="mt-8 bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
          <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">{oakData.barrel_costs.title}</h2>
          <div className="grid gap-3 md:grid-cols-5">
            {oakData.barrel_costs.prices.map((item) => (
              <div key={item.type} className="text-center">
                <p className="text-lg font-bold text-[#722F37]">{item.price_range}</p>
                <p className="text-xs text-gray-600">{item.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
