'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type SectionId = 'overview' | 'soil' | 'climate' | 'geology' | 'topography' | 'drainage' | 'microclimate' | 'examples';

const SECTIONS: { id: SectionId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Introduction', icon: '🌍' },
  { id: 'soil', label: 'Soil Types', icon: '🪨' },
  { id: 'climate', label: 'Climate Zones', icon: '☀️' },
  { id: 'geology', label: 'Geology', icon: '⛰️' },
  { id: 'topography', label: 'Topography', icon: '📐' },
  { id: 'drainage', label: 'Water & Drainage', icon: '💧' },
  { id: 'microclimate', label: 'Microclimate', icon: '🌡️' },
  { id: 'examples', label: 'Famous Terroirs', icon: '🏆' },
];

function SoilColorSwatch({ color, name }: { color: string; name: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded border border-[#1C1C1C]/20"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-gray-500">Typical color</span>
    </div>
  );
}

function DrainageRating({ soilType }: { soilType: string }) {
  const drainageMap: Record<string, number> = {
    'gravel': 5,
    'sand': 5,
    'volcanic': 4,
    'limestone': 4,
    'chalk': 4,
    'schist': 4,
    'slate': 4,
    'granite': 4,
    'loess': 3,
    'marl': 3,
    'terra-rossa': 3,
    'clay': 1,
  };
  const level = drainageMap[soilType] || 3;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">Drainage:</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-4 h-2 rounded-sm ${
              i <= level ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-600">
        {level >= 4 ? 'Excellent' : level === 3 ? 'Moderate' : 'Poor'}
      </span>
    </div>
  );
}

function ClimateIndicator({ type, value }: { type: 'temperature' | 'rainfall' | 'gdd'; value: string }) {
  const icons = {
    temperature: '🌡️',
    rainfall: '🌧️',
    gdd: '☀️',
  };
  const labels = {
    temperature: 'Temp Range',
    rainfall: 'Rainfall',
    gdd: 'Growing Degree Days',
  };

  return (
    <div className="flex items-center gap-2">
      <span>{icons[type]}</span>
      <div>
        <p className="text-xs text-gray-500">{labels[type]}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function AspectCompass({ aspect }: { aspect: string }) {
  const aspectLower = aspect.toLowerCase();
  let direction = 'S';
  if (aspectLower.includes('south') && aspectLower.includes('east')) direction = 'SE';
  else if (aspectLower.includes('south') && aspectLower.includes('west')) direction = 'SW';
  else if (aspectLower.includes('north') && aspectLower.includes('east')) direction = 'NE';
  else if (aspectLower.includes('north') && aspectLower.includes('west')) direction = 'NW';
  else if (aspectLower.includes('east')) direction = 'E';
  else if (aspectLower.includes('west')) direction = 'W';
  else if (aspectLower.includes('north')) direction = 'N';

  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-2 border-[#1C1C1C]/20 rounded-full" />
        {directions.map((dir, i) => {
          const angle = (i * 45 - 90) * (Math.PI / 180);
          const x = 24 + 18 * Math.cos(angle);
          const y = 24 + 18 * Math.sin(angle);
          const isActive = dir === direction;
          return (
            <div
              key={dir}
              className={`absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full text-[8px] flex items-center justify-center ${
                isActive ? 'bg-[#722F37] text-white font-bold' : 'text-gray-400'
              }`}
              style={{ left: x, top: y }}
            >
              {dir === 'N' || dir === 'S' || dir === 'E' || dir === 'W' ? dir : ''}
            </div>
          );
        })}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-[#722F37]">{direction}</span>
        </div>
      </div>
      <span className="text-sm text-gray-600">{aspect}</span>
    </div>
  );
}

function ElevationIndicator({ elevation }: { elevation: string }) {
  const match = elevation.match(/(\d+)/);
  const meters = match ? parseInt(match[1]) : 200;
  const percentage = Math.min((meters / 1500) * 100, 100);

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-4 h-16 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute bottom-0 w-full bg-gradient-to-t from-[#722F37] to-[#A85D66] rounded-full transition-all"
          style={{ height: `${percentage}%` }}
        />
      </div>
      <div>
        <p className="text-xs text-gray-500">Elevation</p>
        <p className="text-sm font-medium">{elevation}</p>
      </div>
    </div>
  );
}

function SlopeIndicator({ slope }: { slope: string }) {
  const match = slope.match(/(\d+)/);
  const percent = match ? parseInt(match[1]) : 10;
  const angle = Math.min(Math.atan(percent / 100) * (180 / Math.PI), 45);

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-8">
        <div
          className="absolute bottom-0 left-0 w-full h-0.5 bg-[#722F37] origin-left"
          style={{ transform: `rotate(-${angle}deg)` }}
        />
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300" />
      </div>
      <div>
        <p className="text-xs text-gray-500">Slope</p>
        <p className="text-sm font-medium">{slope}</p>
      </div>
    </div>
  );
}

export default function TerroirGuidePage() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [terroirData, setTerroirData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/resource-guides/terroir');
        if (res.ok) {
          const data = await res.json();
          setTerroirData(data.content);
        }
      } catch (error) {
        console.error('Error fetching terroir data:', error);
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

  if (!terroirData) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Failed to load terroir guide data.</p>
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
          <span className="text-[#1C1C1C]">Terroir Guide</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">The Terroir Guide</h1>
          <p className="mt-3 text-gray-600 max-w-3xl">
            {terroirData.sections.overview.description}
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
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">{terroirData.sections.overview.title}</h2>

              {/* Key Components */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Key Components of Terroir</h3>
                <div className="flex flex-wrap gap-2">
                  {terroirData.sections.overview.key_components.map((component: string, i: number) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-[#FAF7F2] rounded-full border border-[#1C1C1C]/20 text-[#1C1C1C]"
                    >
                      {component}
                    </span>
                  ))}
                </div>
              </div>

              {/* Philosophy */}
              <div className="grid gap-4 md:grid-cols-3 mb-8">
                <div className="bg-[#FAF7F2] rounded-lg p-4">
                  <h4 className="font-medium text-[#722F37] mb-2">French View</h4>
                  <p className="text-sm text-gray-600">{terroirData.sections.overview.philosophy.french_view}</p>
                </div>
                <div className="bg-[#FAF7F2] rounded-lg p-4">
                  <h4 className="font-medium text-[#722F37] mb-2">The Debate</h4>
                  <p className="text-sm text-gray-600">{terroirData.sections.overview.philosophy.debate}</p>
                </div>
                <div className="bg-[#FAF7F2] rounded-lg p-4">
                  <h4 className="font-medium text-[#722F37] mb-2">Modern Science</h4>
                  <p className="text-sm text-gray-600">{terroirData.sections.overview.philosophy.modern_science}</p>
                </div>
              </div>

              {/* Key Terms */}
              <div>
                <h3 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Key Terms</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {terroirData.sections.overview.key_terms.map((term: any, i: number) => (
                    <div key={i} className="bg-[#FAF7F2] rounded-lg p-4">
                      <h4 className="font-serif italic text-[#722F37]">{term.term}</h4>
                      <p className="text-sm text-gray-600 mt-1">{term.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Soil Section */}
        {activeSection === 'soil' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{terroirData.sections.soil.title}</h2>
              <p className="text-gray-600 mb-6">{terroirData.sections.soil.description}</p>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {terroirData.sections.soil.items.map((soil: any) => (
                  <Link
                    key={soil.id}
                    href={`/resources/terroir/soil/${soil.id}`}
                    className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group block"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-serif text-xl italic text-[#722F37] group-hover:underline">{soil.name}</h3>
                      <SoilColorSwatch color={soil.color} name={soil.name} />
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{soil.wine_impact}</p>

                    <DrainageRating soilType={soil.id} />

                    <div className="mt-3 pt-3 border-t border-[#1C1C1C]/10">
                      <p className="text-xs font-medium text-[#1C1C1C] mb-1">Best for:</p>
                      <div className="flex flex-wrap gap-1">
                        {soil.best_for.slice(0, 3).map((grape: string, i: number) => (
                          <span key={i} className="text-xs bg-white px-2 py-0.5 rounded border border-[#1C1C1C]/20">
                            {grape}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                      {soil.famous_regions.slice(0, 3).join(' · ')}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Climate Section */}
        {activeSection === 'climate' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{terroirData.sections.climate.title}</h2>
              <p className="text-gray-600 mb-6">{terroirData.sections.climate.description}</p>

              <div className="space-y-4">
                {terroirData.sections.climate.items.map((climate: any) => (
                  <Link
                    key={climate.id}
                    href={`/resources/terroir/climate/${climate.id}`}
                    className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group block"
                  >
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <h3 className="font-serif text-xl italic text-[#722F37] group-hover:underline">{climate.name}</h3>
                      <ClimateIndicator type="temperature" value={climate.temperature_range} />
                      <ClimateIndicator type="gdd" value={climate.growing_degree_days} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-[#1C1C1C] mb-1">Characteristics:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {climate.characteristics.slice(0, 3).map((c: string, i: number) => (
                            <li key={i}>• {c}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#1C1C1C] mb-1">Wine Impact:</p>
                        <p className="text-sm text-gray-600">{climate.wine_impact}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#1C1C1C]/10 flex flex-wrap gap-2">
                      {climate.famous_regions.slice(0, 4).map((region: string, i: number) => (
                        <span key={i} className="text-xs bg-white px-2 py-0.5 rounded border border-[#1C1C1C]/20">
                          {region}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Geology Section */}
        {activeSection === 'geology' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{terroirData.sections.geology.title}</h2>
              <p className="text-gray-600 mb-6">{terroirData.sections.geology.description}</p>

              <div className="grid gap-4 md:grid-cols-2">
                {terroirData.sections.geology.items.map((geo: any) => (
                  <Link
                    key={geo.id}
                    href={`/resources/terroir/geology/${geo.id}`}
                    className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group block"
                  >
                    <h3 className="font-serif text-xl italic text-[#722F37] group-hover:underline mb-2">{geo.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">{geo.formation}</p>

                    <p className="text-sm text-gray-600 mb-3">{geo.wine_impact}</p>

                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-[#1C1C1C] mb-1">Characteristics:</p>
                        <div className="flex flex-wrap gap-1">
                          {geo.characteristics.slice(0, 3).map((c: string, i: number) => (
                            <span key={i} className="text-xs bg-white px-2 py-0.5 rounded border border-[#1C1C1C]/20">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 italic pt-2 border-t border-[#1C1C1C]/10">
                        {geo.famous_regions.join(' · ')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Topography Section */}
        {activeSection === 'topography' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{terroirData.sections.topography.title}</h2>
              <p className="text-gray-600 mb-6">{terroirData.sections.topography.description}</p>

              <div className="space-y-4">
                {terroirData.sections.topography.concepts.map((concept: any) => (
                  <div
                    key={concept.id}
                    className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10"
                  >
                    <h3 className="font-serif text-xl italic text-[#722F37] mb-2">{concept.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{concept.explanation}</p>

                    {concept.temperature_gain && (
                      <div className="bg-white rounded p-3 mb-3">
                        <span className="text-xs text-gray-500">Temperature Gain: </span>
                        <span className="text-sm font-medium text-[#722F37]">{concept.temperature_gain}</span>
                      </div>
                    )}

                    {concept.optimal_range && (
                      <div className="bg-white rounded p-3 mb-3">
                        <span className="text-xs text-gray-500">Optimal Range: </span>
                        <span className="text-sm font-medium">{concept.optimal_range}</span>
                      </div>
                    )}

                    {concept.temperature_effect && (
                      <div className="bg-white rounded p-3 mb-3">
                        <span className="text-xs text-gray-500">Temperature Effect: </span>
                        <span className="text-sm font-medium">{concept.temperature_effect}</span>
                      </div>
                    )}

                    {concept.benefits && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-[#1C1C1C] mb-1">Benefits:</p>
                        <div className="flex flex-wrap gap-1">
                          {concept.benefits.map((b: string, i: number) => (
                            <span key={i} className="text-xs bg-white px-2 py-0.5 rounded border border-[#1C1C1C]/20">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {concept.famous_examples && (
                      <p className="text-xs text-gray-500 italic pt-2 border-t border-[#1C1C1C]/10">
                        Examples: {concept.famous_examples.join(' · ')}
                      </p>
                    )}

                    {concept.note && (
                      <p className="text-xs text-amber-700 mt-2">{concept.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Drainage Section */}
        {activeSection === 'drainage' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{terroirData.sections.drainage.title}</h2>
              <p className="text-gray-600 mb-6">{terroirData.sections.drainage.description}</p>

              <div className="space-y-6">
                {terroirData.sections.drainage.factors.map((factor: any) => (
                  <div
                    key={factor.id}
                    className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10"
                  >
                    <h3 className="font-serif text-xl italic text-[#722F37] mb-2">{factor.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{factor.explanation}</p>

                    {factor.ideal_depth && (
                      <div className="bg-white rounded p-3 mb-3">
                        <span className="text-xs text-gray-500">Ideal Depth: </span>
                        <span className="text-sm font-medium">{factor.ideal_depth}</span>
                      </div>
                    )}

                    {factor.ideal_pattern && (
                      <div className="bg-white rounded p-3 mb-3">
                        <span className="text-xs text-gray-500">Ideal Pattern: </span>
                        <span className="text-sm font-medium">{factor.ideal_pattern}</span>
                      </div>
                    )}

                    {factor.impact && (
                      <p className="text-sm text-gray-700 mb-3">{factor.impact}</p>
                    )}

                    {factor.drainage_scale && (
                      <div className="space-y-2 mb-3">
                        {factor.drainage_scale.map((scale: any, i: number) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className={`w-20 text-xs font-medium ${
                              scale.rating === 'Excellent' ? 'text-green-600' :
                              scale.rating === 'Good' ? 'text-blue-600' :
                              scale.rating === 'Moderate' ? 'text-amber-600' : 'text-red-600'
                            }`}>{scale.rating}</span>
                            <span className="text-sm text-gray-600">{scale.soil_types.join(', ')}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {factor.regional_variations && (
                      <div className="space-y-2 mb-3">
                        {factor.regional_variations.map((rv: any, i: number) => (
                          <div key={i} className="bg-white rounded p-2">
                            <span className="text-xs font-medium text-[#1C1C1C]">{rv.region}: </span>
                            <span className="text-xs text-gray-600">{rv.pattern}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {factor.positions && (
                      <div className="grid gap-2 md:grid-cols-3 mb-3">
                        {Object.entries(factor.positions).map(([key, value]: [string, any]) => (
                          <div key={key} className="bg-white rounded p-3">
                            <p className="text-xs font-medium text-[#1C1C1C] capitalize mb-1">{key}</p>
                            <p className="text-xs text-gray-600">{value}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {factor.irrigation_types && (
                      <div className="flex flex-wrap gap-1">
                        {factor.irrigation_types.map((type: string, i: number) => (
                          <span key={i} className="text-xs bg-white px-2 py-0.5 rounded border border-[#1C1C1C]/20">
                            {type}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Microclimate Section */}
        {activeSection === 'microclimate' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{terroirData.sections.microclimate.title}</h2>
              <p className="text-gray-600 mb-6">{terroirData.sections.microclimate.description}</p>

              <div className="grid gap-4 md:grid-cols-2">
                {terroirData.sections.microclimate.factors.map((factor: any) => (
                  <div
                    key={factor.id}
                    className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10"
                  >
                    <h3 className="font-serif text-xl italic text-[#722F37] mb-2">{factor.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{factor.definition}</p>

                    {factor.ideal_range && (
                      <div className="bg-white rounded p-3 mb-3">
                        <span className="text-xs text-gray-500">Ideal Range: </span>
                        <span className="text-sm font-medium text-[#722F37]">{factor.ideal_range}</span>
                      </div>
                    )}

                    {factor.impact && (
                      <p className="text-sm text-gray-700 mb-3">{factor.impact}</p>
                    )}

                    {factor.benefits && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-[#1C1C1C] mb-1">Benefits:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {factor.benefits.map((b: string, i: number) => (
                            <li key={i}>• {b}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {factor.risks && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-red-700 mb-1">Risks:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {factor.risks.map((r: string, i: number) => (
                            <li key={i}>• {r}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {factor.named_winds && (
                      <div className="space-y-2 mb-3">
                        {factor.named_winds.map((wind: any, i: number) => (
                          <div key={i} className="bg-white rounded p-2">
                            <span className="text-xs font-medium text-[#722F37]">{wind.name}</span>
                            <span className="text-xs text-gray-500"> ({wind.region}): </span>
                            <span className="text-xs text-gray-600">{wind.effect}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {factor.mechanisms && (
                      <div className="space-y-1 mb-3">
                        {factor.mechanisms.map((m: any, i: number) => (
                          <div key={i} className="text-xs">
                            <span className="font-medium text-[#1C1C1C]">{m.effect}: </span>
                            <span className="text-gray-600">{m.explanation}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {(factor.high_diurnal_regions || factor.famous_regions || factor.famous_examples) && (
                      <p className="text-xs text-gray-500 italic pt-2 border-t border-[#1C1C1C]/10">
                        {(factor.high_diurnal_regions || factor.famous_regions || factor.famous_examples || []).slice(0, 4).join(' · ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Famous Terroirs Section */}
        {activeSection === 'examples' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{terroirData.sections.examples.title}</h2>
              <p className="text-gray-600 mb-6">{terroirData.sections.examples.description}</p>

              <div className="space-y-6">
                {terroirData.sections.examples.sites.map((site: any) => (
                  <Link
                    key={site.id}
                    href={`/resources/terroir/examples/${site.id}`}
                    className="bg-[#FAF7F2] rounded-lg p-6 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group block"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-serif text-2xl italic text-[#722F37] group-hover:underline">{site.name}</h3>
                        <p className="text-gray-500">{site.region}</p>
                        <p className="text-xs text-gray-400">{site.appellation}</p>
                      </div>
                      <div className="flex gap-4">
                        <ElevationIndicator elevation={site.elevation} />
                        {site.slope && site.slope !== 'Minimal' && site.slope !== 'Minimal (plateau)' && (
                          <SlopeIndicator slope={site.slope} />
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Soil</p>
                        <p className="text-sm font-medium">{site.soil}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Aspect</p>
                        <AspectCompass aspect={site.aspect} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Grape</p>
                        <p className="text-sm font-medium">{site.grape}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Area</p>
                        <p className="text-sm font-medium">{site.area}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 mb-4">
                      <p className="text-xs font-medium text-[#1C1C1C] mb-2">What Makes It Special</p>
                      <p className="text-sm text-gray-700">{site.what_makes_it_special}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500 pt-4 border-t border-[#1C1C1C]/10">
                      <span>Production: {site.production}</span>
                      <span className="text-[#722F37] font-medium">{site.price_indication}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
