'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type SectionId = 'overview' | 'sensory' | 'structure' | 'aromas' | 'faults' | 'quality' | 'perception';

const SECTIONS: { id: SectionId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Introduction', icon: '👃' },
  { id: 'sensory', label: 'Sensory Science', icon: '🧠' },
  { id: 'structure', label: 'Wine Structure', icon: '⚖️' },
  { id: 'aromas', label: 'Aroma Compounds', icon: '🌸' },
  { id: 'faults', label: 'Wine Faults', icon: '⚠️' },
  { id: 'quality', label: 'Quality Assessment', icon: '✨' },
  { id: 'perception', label: 'Perception Factors', icon: '🌡️' },
];

function IntensityMeter({ level, max = 5, label }: { level: number; max?: number; label?: string }) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs text-gray-500">{label}:</span>}
      <div className="flex gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-sm ${
              i < level ? 'bg-[#722F37]' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function AromaCategoryBadge({ category }: { category: 'primary' | 'secondary' | 'tertiary' }) {
  const colors = {
    primary: 'bg-green-100 text-green-800 border-green-200',
    secondary: 'bg-purple-100 text-purple-800 border-purple-200',
    tertiary: 'bg-amber-100 text-amber-800 border-amber-200',
  };
  const icons = {
    primary: '🍇',
    secondary: '🧪',
    tertiary: '🛢️',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${colors[category]}`}>
      <span>{icons[category]}</span>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>
  );
}

function FaultSeverityIndicator({ canFix }: { canFix: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${canFix ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className="text-xs text-gray-600">
        {canFix ? 'May be fixable' : 'Cannot be fixed'}
      </span>
    </div>
  );
}

function ThresholdIndicator({ threshold }: { threshold: string }) {
  return (
    <div className="bg-gray-100 rounded px-2 py-1 inline-block">
      <span className="text-xs text-gray-500">Detection threshold: </span>
      <span className="text-xs font-mono font-medium">{threshold}</span>
    </div>
  );
}

function TemperatureRange({ style, range, reason }: { style: string; range: string; reason: string }) {
  return (
    <div className="flex items-center gap-3 bg-[#FAF7F2] rounded-lg p-3">
      <div className="w-12 h-12 bg-gradient-to-t from-blue-400 to-red-400 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">{range.split('/')[0].trim()}</span>
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm">{style}</p>
        <p className="text-xs text-gray-500">{reason}</p>
      </div>
    </div>
  );
}

export default function TastingGuidePage() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/resource-guides/tasting')
      .then((res) => res.json())
      .then((json) => {
        setData(json.content);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load tasting data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#722F37]">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center">
        <div className="text-red-600">Failed to load guide data</div>
      </div>
    );
  }

  const sections = data.sections;

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-[#722F37]">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources" className="text-gray-500 hover:text-[#722F37]">Resources</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#1C1C1C]">Tasting Science Guide</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{data.title}</h1>
          <p className="mt-3 text-gray-600 max-w-3xl">{data.subtitle}</p>
        </div>

        {/* Section Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeSection === section.id
                    ? 'bg-[#722F37] text-white'
                    : 'bg-white border-2 border-[#1C1C1C]/10 text-[#1C1C1C] hover:border-[#722F37]'
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Overview Section */}
          {activeSection === 'overview' && sections.overview && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
                <h2 className="font-serif text-2xl italic text-[#722F37] mb-4">{sections.overview.title}</h2>
                <p className="text-gray-700 leading-relaxed mb-6">{sections.overview.description}</p>

                {/* Philosophy */}
                <div className="bg-[#FAF7F2] rounded-lg p-5 mb-6">
                  <h3 className="font-serif text-xl italic text-[#1C1C1C] mb-3">{sections.overview.philosophy.title}</h3>
                  <ul className="space-y-2">
                    {sections.overview.philosophy.points.map((point: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <span className="text-[#722F37] mt-1">&#x2022;</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* The WineSaint Approach */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-6">
                  <h3 className="font-serif text-xl italic text-amber-800 mb-2">{sections.overview.the_winesaint_approach.title}</h3>
                  <p className="text-amber-900 text-sm mb-4">{sections.overview.the_winesaint_approach.description}</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {sections.overview.the_winesaint_approach.questions.map((q: any, i: number) => (
                      <div key={i} className="bg-white rounded-lg p-3 border border-amber-200">
                        <p className="font-medium text-[#1C1C1C]">{i + 1}. {q.question}</p>
                        <p className="text-xs text-gray-500 mt-1">{q.purpose}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why Science */}
                <div className="bg-[#722F37]/5 rounded-lg p-5">
                  <h3 className="font-serif text-xl italic text-[#722F37] mb-2">{sections.overview.why_science.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{sections.overview.why_science.content}</p>
                </div>
              </div>
            </div>
          )}

          {/* Sensory Science Section */}
          {activeSection === 'sensory' && sections.sensory && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
                <h2 className="font-serif text-2xl italic text-[#722F37] mb-2">{sections.sensory.title}</h2>
                <p className="text-gray-600 mb-6">{sections.sensory.description}</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {sections.sensory.topics.map((topic: any) => (
                  <div key={topic.id} className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-2xl">{topic.icon}</span>
                      <div>
                        <h3 className="font-serif text-xl italic text-[#1C1C1C]">{topic.name}</h3>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">{topic.content}</p>

                    {topic.tastes && (
                      <div className="space-y-2">
                        {topic.tastes.map((taste: any, i: number) => (
                          <div key={i} className="bg-[#FAF7F2] rounded p-3">
                            <p className="font-medium text-sm">{taste.name}</p>
                            <p className="text-xs text-gray-500">In wine: {taste.in_wine}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {topic.pathways && (
                      <div className="space-y-2">
                        {topic.pathways.map((pathway: any, i: number) => (
                          <div key={i} className="bg-[#FAF7F2] rounded p-3">
                            <p className="font-medium text-sm">{pathway.name}</p>
                            <p className="text-xs text-gray-600">{pathway.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {topic.sensations && (
                      <div className="space-y-2">
                        {topic.sensations.map((sensation: any, i: number) => (
                          <div key={i} className="bg-[#FAF7F2] rounded p-3">
                            <p className="font-medium text-sm">{sensation.name}</p>
                            <p className="text-xs text-gray-500">Source: {sensation.source}</p>
                            <p className="text-xs text-gray-600">{sensation.perception}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {topic.factors && (
                      <div className="space-y-2">
                        {topic.factors.map((factor: any, i: number) => (
                          <div key={i} className="bg-[#FAF7F2] rounded p-3">
                            <p className="font-medium text-sm">{factor.name}</p>
                            <p className="text-xs text-gray-600">{factor.description}</p>
                            <p className="text-xs text-[#722F37] mt-1">{factor.impact}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Structure Section */}
          {activeSection === 'structure' && sections.structure && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
                <h2 className="font-serif text-2xl italic text-[#722F37] mb-2">{sections.structure.title}</h2>
                <p className="text-gray-600 mb-6">{sections.structure.description}</p>
              </div>

              <div className="grid gap-6">
                {sections.structure.elements.map((element: any) => (
                  <Link
                    key={element.id}
                    href={`/resources/tasting/structure/${element.id}`}
                    className="bg-white rounded-lg border-2 border-[#1C1C1C] p-6 hover:border-[#722F37] hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{element.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-serif text-xl italic text-[#1C1C1C] group-hover:text-[#722F37]">
                          {element.name}
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm">{element.what_it_is}</p>

                        {element.spectrum && (
                          <div className="mt-4 flex items-center gap-4">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{element.spectrum.low}</span>
                            <div className="flex-1 h-2 bg-gradient-to-r from-gray-200 via-[#722F37]/50 to-[#722F37] rounded-full" />
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{element.spectrum.high}</span>
                          </div>
                        )}

                        <p className="mt-4 text-sm font-medium text-[#722F37] group-hover:underline">
                          Learn more →
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Aromas Section */}
          {activeSection === 'aromas' && sections.aromas && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
                <h2 className="font-serif text-2xl italic text-[#722F37] mb-2">{sections.aromas.title}</h2>
                <p className="text-gray-600 mb-6">{sections.aromas.description}</p>

                {/* Category Cards */}
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  {Object.entries(sections.aromas.categories).map(([key, cat]: [string, any]) => (
                    <div key={key} className={`rounded-lg p-4 border-2 ${
                      key === 'primary' ? 'bg-green-50 border-green-200' :
                      key === 'secondary' ? 'bg-purple-50 border-purple-200' :
                      'bg-amber-50 border-amber-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{cat.icon}</span>
                        <h3 className="font-medium">{cat.name}</h3>
                      </div>
                      <p className="text-xs text-gray-600 mb-1"><strong>Source:</strong> {cat.source}</p>
                      <p className="text-xs text-gray-500">{cat.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compound Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                {sections.aromas.compounds.map((compound: any) => (
                  <Link
                    key={compound.id}
                    href={`/resources/tasting/aromas/${compound.id}`}
                    className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 hover:border-[#722F37] hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                        {compound.name}
                      </h3>
                      <AromaCategoryBadge category={compound.category} />
                    </div>
                    <p className="text-[#722F37] font-medium text-sm mb-2">{compound.aroma}</p>
                    <p className="text-xs text-gray-500 mb-3">
                      Found in: {compound.found_in?.join(', ') || 'Various wines'}
                    </p>
                    {compound.threshold && (
                      <ThresholdIndicator threshold={compound.threshold} />
                    )}
                    {compound.note && (
                      <p className="text-xs text-gray-600 mt-2 italic">{compound.note}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Faults Section */}
          {activeSection === 'faults' && sections.faults && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
                <h2 className="font-serif text-2xl italic text-[#722F37] mb-2">{sections.faults.title}</h2>
                <p className="text-gray-600 mb-4">{sections.faults.description}</p>
                <p className="text-sm text-gray-700 bg-amber-50 rounded-lg p-4 border border-amber-200">
                  {sections.faults.introduction}
                </p>
              </div>

              <div className="grid gap-4">
                {sections.faults.faults.map((fault: any) => (
                  <Link
                    key={fault.id}
                    href={`/resources/tasting/faults/${fault.id}`}
                    className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 hover:border-[#722F37] hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{fault.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-serif text-xl italic text-[#1C1C1C] group-hover:text-[#722F37]">
                            {fault.name}
                          </h3>
                          <FaultSeverityIndicator canFix={fault.can_fix === true || fault.can_fix === 'Often yes'} />
                        </div>
                        <p className="text-sm text-gray-600 mt-2"><strong>Cause:</strong> {fault.cause}</p>
                        <p className="text-sm text-[#722F37] mt-1">
                          <strong>Detect by:</strong> {typeof fault.detection === 'string' ? fault.detection : fault.detection?.aroma || 'Various indicators'}
                        </p>
                        {fault.what_to_do && (
                          <p className="text-xs text-gray-500 mt-2 bg-[#FAF7F2] rounded p-2">
                            <strong>What to do:</strong> {fault.what_to_do}
                          </p>
                        )}
                        <p className="mt-3 text-sm font-medium text-[#722F37] group-hover:underline">
                          Learn more →
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quality Section */}
          {activeSection === 'quality' && sections.quality && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
                <h2 className="font-serif text-2xl italic text-[#722F37] mb-2">{sections.quality.title}</h2>
                <p className="text-gray-600 mb-6">{sections.quality.description}</p>

                {/* Introduction */}
                <div className="bg-[#FAF7F2] rounded-lg p-5 mb-6">
                  <h3 className="font-serif text-lg italic text-[#1C1C1C] mb-2">{sections.quality.introduction.title}</h3>
                  <p className="text-gray-700 text-sm">{sections.quality.introduction.content}</p>
                </div>

                {/* Quality Markers */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {sections.quality.markers.map((marker: any) => (
                    <div key={marker.id} className="bg-white border-2 border-[#1C1C1C]/20 rounded-lg p-4 hover:border-[#722F37] transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{marker.icon}</span>
                        <h4 className="font-serif text-lg italic text-[#1C1C1C]">{marker.name}</h4>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{marker.definition}</p>
                      <p className="text-xs text-gray-500"><strong>How to assess:</strong> {marker.how_to_assess}</p>
                      {marker.note && (
                        <p className="text-xs text-[#722F37] mt-2 italic">{marker.note}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Quality vs Preference */}
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-5">
                  <h3 className="font-serif text-xl italic text-amber-800 mb-2">{sections.quality.quality_vs_preference.title}</h3>
                  <p className="text-amber-900 text-sm">{sections.quality.quality_vs_preference.content}</p>
                </div>

                {/* Rating Systems */}
                {sections.quality.rating_systems && (
                  <div className="mt-6 bg-gray-100 rounded-lg p-5">
                    <h3 className="font-serif text-lg italic text-[#1C1C1C] mb-2">{sections.quality.rating_systems.title}</h3>
                    <p className="text-gray-700 text-sm">{sections.quality.rating_systems.content}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Perception Section */}
          {activeSection === 'perception' && sections.perception && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
                <h2 className="font-serif text-2xl italic text-[#722F37] mb-2">{sections.perception.title}</h2>
                <p className="text-gray-600 mb-6">{sections.perception.description}</p>
              </div>

              <div className="grid gap-6">
                {sections.perception.factors.map((factor: any) => (
                  <div key={factor.id} className="bg-white rounded-lg border-2 border-[#1C1C1C] p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <span className="text-3xl">{factor.icon}</span>
                      <div>
                        <h3 className="font-serif text-xl italic text-[#1C1C1C]">{factor.name}</h3>
                        <p className="text-gray-600 mt-1">{factor.impact}</p>
                      </div>
                    </div>

                    {factor.science && (
                      <p className="text-sm text-gray-700 bg-[#FAF7F2] rounded-lg p-3 mb-4">
                        <strong>The science:</strong> {typeof factor.science === 'string' ? factor.science : ''}
                      </p>
                    )}

                    {factor.guidelines && (
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {factor.guidelines.map((guide: any, i: number) => (
                          <TemperatureRange
                            key={i}
                            style={guide.style}
                            range={guide.range}
                            reason={guide.reason}
                          />
                        ))}
                      </div>
                    )}

                    {factor.what_matters && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-[#1C1C1C] mb-2">What matters:</p>
                        <div className="flex flex-wrap gap-2">
                          {factor.what_matters.map((item: any, i: number) => (
                            <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              {typeof item === 'string' ? item : item.feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {factor.what_doesnt_matter_much && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-500 mb-2">Less important:</p>
                        <div className="flex flex-wrap gap-2">
                          {factor.what_doesnt_matter_much.map((item: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {factor.principles && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-[#1C1C1C] mb-2">Key principles:</p>
                        <ul className="space-y-1">
                          {factor.principles.map((principle: string, i: number) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-[#722F37]">&#x2022;</span>
                              {principle}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {factor.research && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium text-[#1C1C1C]">Research findings:</p>
                        {factor.research.map((study: any, i: number) => (
                          <div key={i} className="bg-[#FAF7F2] rounded p-3">
                            <p className="text-xs text-gray-500">{study.study}</p>
                            <p className="text-sm text-gray-700">{study.finding}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {factor.takeaway && (
                      <p className="mt-4 text-sm text-[#722F37] font-medium">{factor.takeaway}</p>
                    )}

                    {factor.implications && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-[#1C1C1C] mb-2">Implications:</p>
                        <ul className="space-y-1">
                          {factor.implications.map((imp: string, i: number) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-[#722F37]">&#x2022;</span>
                              {imp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
