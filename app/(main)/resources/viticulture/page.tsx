'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type SectionId = 'lifecycle' | 'training' | 'canopy' | 'pests' | 'harvest' | 'practices' | 'vine-age' | 'yield' | 'climate' | 'sites';

const SECTIONS: { id: SectionId; label: string; icon: string }[] = [
  { id: 'lifecycle', label: 'Vine Lifecycle', icon: '🌱' },
  { id: 'training', label: 'Training Systems', icon: '🍇' },
  { id: 'canopy', label: 'Canopy Management', icon: '🌿' },
  { id: 'pests', label: 'Pests & Diseases', icon: '🐛' },
  { id: 'harvest', label: 'Harvest', icon: '🧺' },
  { id: 'practices', label: 'Farming Practices', icon: '🌾' },
  { id: 'vine-age', label: 'Vine Age', icon: '🌳' },
  { id: 'yield', label: 'Yield Management', icon: '⚖️' },
  { id: 'climate', label: 'Climate Challenges', icon: '🌡️' },
  { id: 'sites', label: 'Famous Sites', icon: '📍' },
];

function VigorMeter({ level }: { level: string }) {
  const levels: Record<string, number> = {
    'low': 1,
    'low to moderate': 2,
    'moderate': 2,
    'moderate to high': 3,
    'high': 4,
    'high to very high': 4,
    'very high': 5,
  };
  const value = levels[level.toLowerCase()] || 3;

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-500">Vigor:</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-sm ${i <= value ? 'bg-green-600' : 'bg-gray-200'}`}
          />
        ))}
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    'low': 'bg-green-100 text-green-800',
    'low-medium': 'bg-yellow-100 text-yellow-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'medium-high': 'bg-orange-100 text-orange-800',
    'high': 'bg-red-100 text-red-800',
    'very high': 'bg-red-200 text-red-900',
    'critical': 'bg-red-300 text-red-900',
    'variable': 'bg-purple-100 text-purple-800',
  };
  const colorClass = colors[severity.toLowerCase()] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorClass}`}>
      {severity}
    </span>
  );
}

function LifecycleTimeline({ stages, activeStage }: { stages: any[]; activeStage: string | null }) {
  return (
    <div className="flex overflow-x-auto gap-1 pb-2">
      {stages.map((stage, i) => (
        <div
          key={stage.id}
          className={`flex-shrink-0 text-center px-3 py-2 rounded-lg border-2 transition-all ${
            activeStage === stage.id
              ? 'border-[#722F37] bg-[#722F37]/10'
              : 'border-transparent bg-white hover:border-[#722F37]/30'
          }`}
        >
          <div className="text-xs text-gray-500">{i + 1}</div>
          <div className="text-sm font-medium">{stage.name}</div>
        </div>
      ))}
    </div>
  );
}

export default function VitultureGuidePage() {
  const [activeSection, setActiveSection] = useState<SectionId>('lifecycle');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/resource-guides/viticulture');
        if (res.ok) {
          const json = await res.json();
          setData(json.content);
        }
      } catch (error) {
        console.error('Error fetching viticulture data:', error);
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

  if (!data) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Failed to load viticulture guide data.</p>
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
          <span className="text-[#1C1C1C]">Viticulture Guide</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">The Viticulture Guide</h1>
          <p className="mt-3 text-gray-600 max-w-3xl">
            {data.sections.overview.description}
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

        {/* Lifecycle Section */}
        {activeSection === 'lifecycle' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{data.sections.lifecycle.title}</h2>
              <p className="text-gray-600 mb-6">{data.sections.lifecycle.description}</p>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {data.sections.lifecycle.stages.map((stage: any) => (
                  <Link
                    key={stage.id}
                    href={`/resources/viticulture/lifecycle/${stage.id}`}
                    className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group"
                  >
                    <h3 className="font-serif text-lg italic text-[#722F37] group-hover:underline">{stage.name}</h3>
                    <p className="text-xs text-gray-500 italic mb-2">{stage.french_term}</p>
                    <p className="text-xs text-gray-600 mb-2">{stage.timing.northern_hemisphere}</p>
                    <p className="text-sm text-gray-600 line-clamp-3">{stage.description.substring(0, 120)}...</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Training Systems Section */}
        {activeSection === 'training' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{data.sections.training_systems.title}</h2>
              <p className="text-gray-600 mb-6">{data.sections.training_systems.description}</p>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.sections.training_systems.systems.map((system: any) => (
                  <Link
                    key={system.id}
                    href={`/resources/viticulture/training/${system.id}`}
                    className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group"
                  >
                    <h3 className="font-serif text-lg italic text-[#722F37] group-hover:underline">{system.name}</h3>
                    {system.aka && (
                      <p className="text-xs text-gray-500 mb-2">{system.aka.slice(0, 2).join(', ')}</p>
                    )}

                    <div className="space-y-2 mt-3">
                      <VigorMeter level={system.vigor_suitability} />

                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs bg-white px-2 py-0.5 rounded border border-[#1C1C1C]/20">
                          {system.climate_suitability}
                        </span>
                        <span className="text-xs bg-white px-2 py-0.5 rounded border border-[#1C1C1C]/20">
                          {system.mechanization === 'Not possible' || system.mechanization === 'No' ? '🚫 No machines' : '✓ Mechanizable'}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 pt-2">
                        Regions: {system.famous_regions?.slice(0, 3).join(', ')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Canopy Management Section */}
        {activeSection === 'canopy' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{data.sections.canopy_management.title}</h2>
              <p className="text-gray-600 mb-6">{data.sections.canopy_management.description}</p>

              {/* Principles */}
              <div className="bg-[#FAF7F2] rounded-lg p-4 mb-6">
                <h3 className="font-medium text-[#1C1C1C] mb-3">Core Principles</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {data.sections.canopy_management.principles.concepts.map((concept: any, i: number) => (
                    <div key={i} className="bg-white p-3 rounded border border-[#1C1C1C]/10">
                      <p className="font-medium text-sm text-[#722F37]">{concept.principle}</p>
                      <p className="text-xs text-gray-600">{concept.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Techniques */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.sections.canopy_management.techniques.map((tech: any) => (
                  <Link
                    key={tech.id}
                    href={`/resources/viticulture/canopy/${tech.id}`}
                    className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group"
                  >
                    <h3 className="font-serif text-lg italic text-[#722F37] group-hover:underline">{tech.name}</h3>
                    <p className="text-xs text-gray-500 italic mb-2">{tech.french_term}</p>
                    <p className="text-xs text-gray-600 mb-2">Timing: {tech.timing}</p>
                    <p className="text-sm text-gray-600">{tech.purpose}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pests & Diseases Section */}
        {activeSection === 'pests' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{data.sections.pests_diseases.title}</h2>
              <p className="text-gray-600 mb-6">{data.sections.pests_diseases.description}</p>

              {/* Fungal Diseases */}
              <div className="mb-8">
                <h3 className="font-medium text-lg text-[#1C1C1C] mb-4 flex items-center gap-2">
                  <span>🍄</span> Fungal Diseases
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data.sections.pests_diseases.fungal.map((disease: any) => (
                    <Link
                      key={disease.id}
                      href={`/resources/viticulture/pests/${disease.id}`}
                      className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-serif text-lg italic text-[#722F37] group-hover:underline">{disease.name}</h4>
                        <SeverityBadge severity={disease.severity} />
                      </div>
                      <p className="text-xs text-gray-500 italic mb-2">{disease.scientific_name}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{disease.description?.substring(0, 100)}...</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Insects */}
              <div className="mb-8">
                <h3 className="font-medium text-lg text-[#1C1C1C] mb-4 flex items-center gap-2">
                  <span>🐛</span> Insects
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data.sections.pests_diseases.insects.map((pest: any) => (
                    <Link
                      key={pest.id}
                      href={`/resources/viticulture/pests/${pest.id}`}
                      className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-serif text-lg italic text-[#722F37] group-hover:underline">{pest.name}</h4>
                        {pest.severity && <SeverityBadge severity={pest.severity} />}
                      </div>
                      <p className="text-xs text-gray-500 italic mb-2">{pest.scientific_name}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{pest.description?.substring(0, 100)}...</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Viruses */}
              <div className="mb-8">
                <h3 className="font-medium text-lg text-[#1C1C1C] mb-4 flex items-center gap-2">
                  <span>🦠</span> Viruses
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data.sections.pests_diseases.viruses.map((virus: any) => (
                    <Link
                      key={virus.id}
                      href={`/resources/viticulture/pests/${virus.id}`}
                      className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-serif text-lg italic text-[#722F37] group-hover:underline">{virus.name}</h4>
                        {virus.severity && <SeverityBadge severity={virus.severity} />}
                      </div>
                      <p className="text-xs text-gray-500 italic mb-2">{virus.aka?.join(', ')}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{virus.description?.substring(0, 100)}...</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Environmental */}
              <div>
                <h3 className="font-medium text-lg text-[#1C1C1C] mb-4 flex items-center gap-2">
                  <span>🌡️</span> Environmental Stress
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data.sections.pests_diseases.environmental.map((stress: any) => (
                    <Link
                      key={stress.id}
                      href={`/resources/viticulture/pests/${stress.id}`}
                      className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-serif text-lg italic text-[#722F37] group-hover:underline">{stress.name}</h4>
                        {stress.severity && <SeverityBadge severity={stress.severity} />}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{stress.description?.substring(0, 100)}...</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Harvest Section */}
        {activeSection === 'harvest' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{data.sections.harvest.title}</h2>
              <p className="text-gray-600 mb-6">{data.sections.harvest.description}</p>

              {/* Metrics */}
              <div className="mb-8">
                <h3 className="font-medium text-lg text-[#1C1C1C] mb-4">Ripeness Metrics</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data.sections.harvest.metrics.map((metric: any) => (
                    <div key={metric.id} className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10">
                      <h4 className="font-serif text-lg italic text-[#722F37]">{metric.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{metric.measurement?.tool || metric.measurement?.assessment}</p>
                      <p className="text-sm text-gray-600">{metric.significance}</p>
                      {metric.target_ranges && (
                        <div className="mt-2 text-xs space-y-1">
                          {Object.entries(metric.target_ranges).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}:</span>
                              <span className="font-medium">{value as string}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Methods */}
              <div>
                <h3 className="font-medium text-lg text-[#1C1C1C] mb-4">Harvest Methods</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {data.sections.harvest.methods.map((method: any) => (
                    <div key={method.id} className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10">
                      <h4 className="font-serif text-lg italic text-[#722F37] mb-2">{method.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{method.description}</p>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-green-700">Advantages:</p>
                          <ul className="text-xs text-gray-600">
                            {method.advantages.slice(0, 3).map((adv: string, i: number) => (
                              <li key={i}>+ {adv}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-red-700">Disadvantages:</p>
                          <ul className="text-xs text-gray-600">
                            {method.disadvantages.slice(0, 2).map((dis: string, i: number) => (
                              <li key={i}>- {dis}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Farming Practices Section */}
        {activeSection === 'practices' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{data.sections.practices.title}</h2>
              <p className="text-gray-600 mb-6">{data.sections.practices.description}</p>

              <div className="grid gap-6 md:grid-cols-2">
                {data.sections.practices.approaches.map((approach: any) => (
                  <Link
                    key={approach.id}
                    href={`/resources/viticulture/practices/${approach.id}`}
                    className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group"
                  >
                    <h3 className="font-serif text-xl italic text-[#722F37] group-hover:underline mb-2">{approach.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{approach.philosophy}</p>

                    {approach.certifications && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-[#1C1C1C] mb-1">Certifications:</p>
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(approach.certifications)
                            ? approach.certifications.slice(0, 3).map((c: any) => c.name || c)
                            : [approach.certifications]
                          ).map((cert: string, i: number) => (
                            <span key={i} className="text-xs bg-white px-2 py-0.5 rounded border border-[#1C1C1C]/20">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="font-medium text-green-700">Advantages:</p>
                        <ul className="text-gray-600">
                          {approach.advantages?.slice(0, 2).map((adv: string, i: number) => (
                            <li key={i}>+ {adv}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-red-700">Challenges:</p>
                        <ul className="text-gray-600">
                          {approach.disadvantages?.slice(0, 2).map((dis: string, i: number) => (
                            <li key={i}>- {dis}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Vine Age Section */}
        {activeSection === 'vine-age' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{data.sections.vine_age.title}</h2>
              <p className="text-gray-600 mb-6">{data.sections.vine_age.description}</p>

              {/* Age Stages */}
              <div className="grid gap-4 md:grid-cols-5 mb-8">
                {data.sections.vine_age.stages.map((stage: any, i: number) => (
                  <div key={i} className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10 text-center">
                    <div className="text-2xl mb-2">{'🌱'.repeat(Math.min(i + 1, 5))}</div>
                    <p className="text-sm font-medium text-[#722F37]">{stage.age_range}</p>
                    <p className="text-xs text-gray-600 font-medium">{stage.name}</p>
                    <p className="text-xs text-gray-500 italic">{stage.french_term}</p>
                    <p className="text-xs text-gray-600 mt-2">{stage.wine_character}</p>
                  </div>
                ))}
              </div>

              {/* Why Age Matters */}
              <div className="bg-[#FAF7F2] rounded-lg p-4 mb-6">
                <h3 className="font-medium text-[#1C1C1C] mb-3">{data.sections.vine_age.why_age_matters.title}</h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {data.sections.vine_age.why_age_matters.factors.map((factor: any, i: number) => (
                    <div key={i} className="bg-white p-3 rounded border border-[#1C1C1C]/10">
                      <p className="font-medium text-sm text-[#722F37]">{factor.factor}</p>
                      <p className="text-xs text-gray-600">{factor.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regional Terms */}
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                {Object.entries(data.sections.vine_age.regional_terms).map(([country, term]) => (
                  <div key={country} className="bg-[#FAF7F2] rounded-lg p-3 text-center border border-[#1C1C1C]/10">
                    <p className="text-xs text-gray-500 capitalize">{country}</p>
                    <p className="text-sm font-medium text-[#722F37]">{term as string}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Yield Management Section */}
        {activeSection === 'yield' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{data.sections.yield_management.title}</h2>
              <p className="text-gray-600 mb-6">{data.sections.yield_management.description}</p>

              {/* Techniques */}
              <div className="mb-8">
                <h3 className="font-medium text-lg text-[#1C1C1C] mb-4">Yield Control Techniques</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {data.sections.yield_management.techniques.map((tech: any) => (
                    <div key={tech.id} className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10">
                      <h4 className="font-serif text-lg italic text-[#722F37]">{tech.name}</h4>
                      {tech.french_term && <p className="text-xs text-gray-500 italic mb-2">{tech.french_term}</p>}
                      {tech.timing && <p className="text-xs text-gray-600 mb-2">Timing: {tech.timing}</p>}
                      <p className="text-sm text-gray-600">{tech.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appellation Regulations */}
              <div className="bg-[#FAF7F2] rounded-lg p-4">
                <h3 className="font-medium text-[#1C1C1C] mb-3">{data.sections.yield_management.appellation_regulations.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{data.sections.yield_management.appellation_regulations.note}</p>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {data.sections.yield_management.appellation_regulations.examples.map((ex: any, i: number) => (
                    <div key={i} className="bg-white p-3 rounded border border-[#1C1C1C]/10 flex justify-between items-center">
                      <span className="text-sm font-medium">{ex.appellation}</span>
                      <span className="text-sm text-[#722F37] font-medium">{ex.max_yield}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Climate Challenges Section */}
        {activeSection === 'climate' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{data.sections.climate_challenges.title}</h2>
              <p className="text-gray-600 mb-6">{data.sections.climate_challenges.description}</p>

              <div className="grid gap-6 md:grid-cols-2">
                {data.sections.climate_challenges.challenges.map((challenge: any) => (
                  <Link
                    key={challenge.id}
                    href={`/resources/viticulture/climate/${challenge.id}`}
                    className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-xl italic text-[#722F37] group-hover:underline">{challenge.name}</h3>
                      <SeverityBadge severity={challenge.severity} />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{challenge.description?.substring(0, 150)}...</p>

                    {challenge.affected_regions && (
                      <div className="text-xs text-gray-500">
                        Affected: {challenge.affected_regions.slice(0, 3).join(', ')}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Famous Sites Section */}
        {activeSection === 'sites' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{data.sections.famous_sites.title}</h2>
              <p className="text-gray-600 mb-6">{data.sections.famous_sites.description}</p>

              <div className="grid gap-6 md:grid-cols-2">
                {data.sections.famous_sites.sites.map((site: any) => (
                  <Link
                    key={site.id}
                    href={`/resources/viticulture/sites/${site.id}`}
                    className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10 hover:border-[#722F37] hover:shadow-md transition-all group"
                  >
                    <h3 className="font-serif text-xl italic text-[#722F37] group-hover:underline">{site.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{site.region}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <span className="text-gray-500">Size:</span>
                        <span className="ml-1 font-medium">{site.size_ha} ha</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Training:</span>
                        <span className="ml-1 font-medium">{site.training_system}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Vine Age:</span>
                        <span className="ml-1 font-medium">{site.vine_age}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Farming:</span>
                        <span className="ml-1 font-medium">{site.farming}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 italic">{site.what_makes_it_special?.substring(0, 120)}...</p>
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
