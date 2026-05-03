'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const SECTIONS = [
  { id: 'shapes', label: 'Regional Shapes', icon: '🍾' },
  { id: 'sizes', label: 'Bottle Sizes', icon: '📏' },
  { id: 'aging', label: 'Aging & Oxidation', icon: '⏳' },
  { id: 'science', label: 'Why It Matters', icon: '🔬' },
];

function ShoulderIndicator({ type }: { type: string }) {
  const getColor = () => {
    if (type.toLowerCase().includes('high')) return 'bg-[#722F37]';
    if (type.toLowerCase().includes('sloped')) return 'bg-amber-600';
    if (type.toLowerCase().includes('none') || type.toLowerCase().includes('rounded')) return 'bg-gray-400';
    return 'bg-gray-500';
  };

  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs text-white ${getColor()}`}>
      {type}
    </span>
  );
}

function BottleSilhouette({ ml }: { ml: number }) {
  const sizeMap: Record<number, number> = {
    187: 28, 375: 40, 750: 52, 1500: 68, 3000: 84,
    4500: 96, 6000: 108, 9000: 120, 12000: 132, 15000: 144, 18000: 156,
  };
  const height = sizeMap[ml] || 52;
  const width = Math.max(height * 0.28, 12);

  return (
    <svg width={width} height={height} viewBox="0 0 30 100" className="fill-[#722F37]" style={{ minWidth: width }}>
      <path d="M12 0 H18 V15 C24 20 26 30 26 45 V90 C26 95 24 98 20 99 H10 C6 98 4 95 4 90 V45 C4 30 6 20 12 15 Z" />
    </svg>
  );
}

export default function BottlesGuidePage() {
  const [activeSection, setActiveSection] = useState('shapes');
  const [bottleData, setBottleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/resource-guides/bottles`);
        if (res.ok) {
          const data = await res.json();
          setBottleData(data.content);
        }
      } catch (error) {
        console.error('Error fetching bottle data:', error);
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

  if (!bottleData) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Failed to load bottle guide data.</p>
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
          <span className="text-[#1C1C1C]">Bottles</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{bottleData.title}</h1>
          <p className="mt-3 text-gray-600 max-w-3xl">{bottleData.subtitle}</p>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeSection === section.id
                  ? 'bg-[#722F37] text-white'
                  : 'bg-white border-2 border-[#1C1C1C]/20 text-[#1C1C1C] hover:border-[#722F37]'
              }`}
            >
              <span>{section.icon}</span>
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        {/* Regional Shapes Section */}
        {activeSection === 'shapes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{bottleData.sections.shapes.title}</h2>
              <p className="text-gray-600 mb-6">{bottleData.sections.shapes.description}</p>

              <div className="grid gap-6 md:grid-cols-2">
                {bottleData.sections.shapes.bottles.map((bottle: any) => (
                  <div key={bottle.id} className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-serif text-xl italic text-[#722F37]">{bottle.name}</h3>
                        {bottle.aka && <p className="text-sm text-gray-500 italic">{bottle.aka}</p>}
                      </div>
                      <ShoulderIndicator type={bottle.shoulder_type} />
                    </div>

                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Shape:</span> {bottle.shape}</p>
                      <p><span className="font-medium">Glass Color:</span> {bottle.color}</p>
                      <p><span className="font-medium">Origin:</span> {bottle.origin}</p>
                      <p><span className="font-medium">Wines:</span> {bottle.wines.join(', ')}</p>
                      <p><span className="font-medium">Regions:</span> {bottle.regions_using.join(', ')}</p>
                      <p className="text-gray-500 italic pt-2 border-t border-[#1C1C1C]/10">
                        {bottle.practical_reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottle Sizes Section */}
        {activeSection === 'sizes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{bottleData.sections.sizes.title}</h2>
              <p className="text-gray-600 mb-2">{bottleData.sections.sizes.description}</p>
              <p className="text-sm text-gray-500 italic mb-6">{bottleData.sections.sizes.intro_note}</p>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {bottleData.sections.sizes.sizes.map((size: any) => (
                  <div key={size.name} className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10 flex gap-4">
                    <div className="flex items-end justify-center w-16 min-h-[130px]">
                      <BottleSilhouette ml={size.ml} />
                    </div>
                    <div className="flex-1">
                      <div className="mb-2">
                        <h3 className="font-serif text-lg italic text-[#722F37]">{size.name}</h3>
                        {size.aka && <p className="text-xs text-gray-500">{size.aka}</p>}
                      </div>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">{size.liters}L</span> <span className="text-gray-500">({size.ml}ml)</span></p>
                        <p><span className="text-gray-500">= {size.standard_bottles} standard</span></p>
                        <p><span className="text-gray-500">~{size.glasses} glasses</span></p>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">{size.aging_impact}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 rounded-lg p-5 border border-amber-200">
                <h3 className="font-semibold text-[#1C1C1C] mb-3">{bottleData.sections.sizes.aging_explanation.title}</h3>
                <ul className="space-y-2">
                  {bottleData.sections.sizes.aging_explanation.points.map((point: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-amber-600 mt-1">*</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Aging & Oxidation Section */}
        {activeSection === 'aging' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{bottleData.sections.aging.title}</h2>
              <p className="text-gray-600 mb-6">{bottleData.sections.aging.description}</p>

              {/* How Wine Breathes */}
              <div className="mb-8">
                <h3 className="font-semibold text-[#1C1C1C] mb-2">{bottleData.sections.aging.oxygen_exchange.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{bottleData.sections.aging.oxygen_exchange.description}</p>

                <div className="space-y-3">
                  {bottleData.sections.aging.oxygen_exchange.process.map((stage: any, idx: number) => (
                    <div key={stage.stage} className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-8 h-8 rounded-full bg-[#722F37] text-white flex items-center justify-center text-sm font-medium">
                          {idx + 1}
                        </span>
                        <h4 className="font-serif text-lg italic text-[#722F37]">{stage.stage}</h4>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">{stage.what_happens}</p>
                      <p className="text-xs text-gray-500 italic">Character: {stage.character}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size & Aging Speed */}
              <div className="mb-8">
                <h3 className="font-semibold text-[#1C1C1C] mb-2">{bottleData.sections.aging.bottle_size_impact.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{bottleData.sections.aging.bottle_size_impact.description}</p>

                <div className="space-y-2">
                  {bottleData.sections.aging.bottle_size_impact.comparison.map((item: any) => (
                    <div key={item.size} className="flex items-center gap-4 bg-[#FAF7F2] rounded-lg p-3 border border-[#1C1C1C]/10">
                      <div className="w-40 font-medium text-sm">{item.size}</div>
                      <div className="w-24 text-center">
                        <span className="px-2 py-1 bg-[#722F37] text-white text-xs rounded">
                          {item.aging_rate}
                        </span>
                      </div>
                      <div className="flex-1 text-sm text-gray-600">{item.note}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Closure Types */}
              <div className="mb-8">
                <h3 className="font-semibold text-[#1C1C1C] mb-2">{bottleData.sections.aging.closure_types.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{bottleData.sections.aging.closure_types.description}</p>

                <div className="grid gap-4 md:grid-cols-2">
                  {bottleData.sections.aging.closure_types.closures.map((closure: any) => (
                    <div key={closure.type} className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10">
                      <h4 className="font-serif text-lg italic text-[#722F37] mb-2">{closure.type}</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">O2 transmission:</span> {closure.oxygen_transmission}</p>
                        <p><span className="font-medium">Best for:</span> {closure.best_for}</p>
                        <p><span className="font-medium">Risk:</span> {closure.risk}</p>
                        <p className="text-gray-500 text-xs">Lifespan: {closure.lifespan}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Storage Conditions */}
              <div className="mb-8">
                <h3 className="font-semibold text-[#1C1C1C] mb-2">{bottleData.sections.aging.storage_factors.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{bottleData.sections.aging.storage_factors.description}</p>

                <div className="space-y-3">
                  {bottleData.sections.aging.storage_factors.conditions.map((condition: any) => (
                    <div key={condition.factor} className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-serif text-lg italic text-[#722F37]">{condition.factor}</h4>
                        <span className="text-sm bg-white px-2 py-1 rounded border border-[#1C1C1C]/20">
                          Ideal: {condition.ideal}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Range:</span> {condition.range}</p>
                      <p className="text-sm text-gray-700">{condition.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Science Section */}
        {activeSection === 'science' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
              <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-2">{bottleData.sections.science.title}</h2>
              <p className="text-gray-600 mb-6">{bottleData.sections.science.description}</p>

              <div className="space-y-4 mb-6">
                {bottleData.sections.science.factors.map((item: any) => (
                  <div key={item.factor} className="bg-[#FAF7F2] rounded-lg p-5 border border-[#1C1C1C]/10">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-serif text-lg italic text-[#722F37]">{item.factor}</h3>
                      <span className="text-xs bg-white px-2 py-1 rounded border border-[#1C1C1C]/20">
                        {item.impact}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{item.explanation}</p>
                    <p className="text-xs text-gray-500 italic">{item.detail}</p>
                  </div>
                ))}
              </div>

              <div className="bg-red-50 rounded-lg p-5 border border-red-200">
                <h3 className="font-semibold text-red-800 mb-2">{bottleData.sections.science.lightstrike_note.title}</h3>
                <p className="text-sm text-red-700">{bottleData.sections.science.lightstrike_note.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
