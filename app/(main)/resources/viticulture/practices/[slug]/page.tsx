import { notFound } from 'next/navigation';
import Link from 'next/link';
import vitData from '@/app/data/viticulture.json';

export async function generateStaticParams() {
  const approaches = vitData.sections.practices.approaches;
  return approaches.map((approach) => ({
    slug: approach.id,
  }));
}

export default async function PracticeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const practice = vitData.sections.practices.approaches.find((p) => p.id === slug);

  if (!practice) {
    notFound();
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-[#722F37]">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources" className="text-gray-500 hover:text-[#722F37]">Resources</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources/viticulture" className="text-gray-500 hover:text-[#722F37]">Viticulture</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#1C1C1C]">{practice.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{practice.name}</h1>
          {practice.market_position && (
            <p className="text-gray-500 mt-2">{practice.market_position}</p>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-6">
          {/* Philosophy */}
          <div className="mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Philosophy</h2>
            <p className="text-gray-700 leading-relaxed bg-[#FAF7F2] rounded-lg p-4">{practice.philosophy}</p>
          </div>

          {/* Founder (for biodynamic) */}
          {practice.founder && (
            <div className="mb-6 bg-[#FAF7F2] rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 uppercase">Founded By</p>
              <p className="text-lg font-medium text-[#1C1C1C]">
                {typeof practice.founder === 'object'
                  ? `${practice.founder.name} (${practice.founder.year})`
                  : practice.founder}
              </p>
              {typeof practice.founder === 'object' && practice.founder.origin && (
                <p className="text-sm text-gray-600">{practice.founder.origin}</p>
              )}
            </div>
          )}

          {/* Inputs */}
          {practice.inputs && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Inputs</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {practice.inputs.prohibited && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="font-medium text-red-800 mb-2">Prohibited</p>
                    <ul className="space-y-1">
                      {practice.inputs.prohibited.map((item: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700">✕ {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {practice.inputs.allowed && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="font-medium text-green-800 mb-2">Allowed</p>
                    <ul className="space-y-1">
                      {(Array.isArray(practice.inputs.allowed) ? practice.inputs.allowed : [practice.inputs.allowed]).map((item: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700">✓ {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {practice.inputs.common && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="font-medium text-gray-800 mb-2">Common</p>
                    <ul className="space-y-1">
                      {practice.inputs.common.map((item: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {practice.inputs.approach && (
                  <div className="bg-[#FAF7F2] rounded-lg p-4 col-span-2">
                    <p className="text-gray-700">{practice.inputs.approach}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Certifications */}
          {practice.certifications && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Certifications</h2>
              <div className="flex flex-wrap gap-2">
                {practice.certifications.map((cert: { name: string; region: string } | string, i: number) => (
                  <div key={i} className="bg-[#FAF7F2] px-3 py-2 rounded-lg border border-[#1C1C1C]/10">
                    {typeof cert === 'object' ? (
                      <>
                        <p className="font-medium text-[#1C1C1C]">{cert.name}</p>
                        <p className="text-xs text-gray-500">{cert.region}</p>
                      </>
                    ) : (
                      <p className="font-medium text-[#1C1C1C]">{cert}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core Practices (biodynamic) */}
          {practice.core_practices && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Core Practices</h2>

              {/* Preparations */}
              {practice.core_practices.preparations && (
                <div className="mb-4">
                  <h3 className="font-medium text-[#1C1C1C] mb-2">Biodynamic Preparations</h3>
                  <div className="grid gap-2">
                    {practice.core_practices.preparations.map((prep: { number: string; name: string; purpose: string }, i: number) => (
                      <div key={i} className="bg-[#FAF7F2] rounded-lg p-3 flex items-start gap-3">
                        <span className="bg-[#722F37] text-white px-2 py-1 rounded text-sm font-mono">{prep.number}</span>
                        <div>
                          <p className="font-medium text-[#1C1C1C]">{prep.name}</p>
                          <p className="text-sm text-gray-600">{prep.purpose}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Calendar */}
              {practice.core_practices.calendar && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-medium text-purple-800 mb-2">Lunar Calendar</h3>
                  <p className="text-sm text-gray-700 mb-2">{practice.core_practices.calendar.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-purple-600">Root Days:</span> {practice.core_practices.calendar.root_days}</div>
                    <div><span className="text-purple-600">Leaf Days:</span> {practice.core_practices.calendar.leaf_days}</div>
                    <div><span className="text-purple-600">Flower Days:</span> {practice.core_practices.calendar.flower_days}</div>
                    <div><span className="text-purple-600">Fruit Days:</span> {practice.core_practices.calendar.fruit_days}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Focus Areas (regenerative) */}
          {practice.focus_areas && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Focus Areas</h2>
              <div className="grid gap-4">
                {Object.entries(practice.focus_areas).map(([area, points]) => (
                  <div key={area} className="bg-[#FAF7F2] rounded-lg p-4">
                    <p className="font-medium text-[#1C1C1C] capitalize mb-2">{area.replace(/_/g, ' ')}</p>
                    <ul className="space-y-1">
                      {(points as string[]).map((point, i) => (
                        <li key={i} className="text-sm text-gray-700">• {point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practices (regenerative) */}
          {practice.practices && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Practices</h2>
              <div className="flex flex-wrap gap-2">
                {practice.practices.map((p: string, i: number) => (
                  <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Advantages & Disadvantages */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {practice.advantages && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h2 className="font-serif text-lg italic text-green-800 mb-3">Advantages</h2>
                <ul className="space-y-2">
                  {practice.advantages.map((adv: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-600">+</span>
                      <span className="text-gray-700">{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {practice.disadvantages && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h2 className="font-serif text-lg italic text-red-800 mb-3">Disadvantages</h2>
                <ul className="space-y-2">
                  {practice.disadvantages.map((dis: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-600">-</span>
                      <span className="text-gray-700">{dis}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Famous Practitioners */}
          {practice.famous_practitioners && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Famous Practitioners</h2>
              <div className="flex flex-wrap gap-2">
                {practice.famous_practitioners.map((name: string, i: number) => (
                  <span key={i} className="bg-[#722F37]/10 text-[#722F37] px-3 py-1 rounded-full text-sm">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pioneers */}
          {practice.pioneers && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Pioneers</h2>
              <div className="flex flex-wrap gap-2">
                {practice.pioneers.map((name: string, i: number) => (
                  <span key={i} className="bg-[#722F37]/10 text-[#722F37] px-3 py-1 rounded-full text-sm">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Copper Debate */}
          {practice.copper_debate && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-amber-800 mb-2">The Copper Debate</h2>
              <p className="text-gray-700">{practice.copper_debate}</p>
            </div>
          )}

          {/* Scientific View */}
          {practice.scientific_view && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-blue-800 mb-2">Scientific Perspective</h2>
              <p className="text-gray-700">{practice.scientific_view}</p>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link href="/resources/viticulture" className="text-[#722F37] hover:underline">
            ← Back to Viticulture Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
