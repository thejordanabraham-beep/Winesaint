import Link from 'next/link';
import { notFound } from 'next/navigation';
import tastingData from '@/app/data/tasting.json';

export function generateStaticParams() {
  return tastingData.sections.structure.elements.map((element) => ({
    slug: element.id,
  }));
}

function SpectrumBar({ low, high }: { low: string; high: string }) {
  return (
    <div className="bg-[#FAF7F2] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{low}</span>
        <span className="text-sm text-gray-600">{high}</span>
      </div>
      <div className="h-3 bg-gradient-to-r from-gray-200 via-[#722F37]/50 to-[#722F37] rounded-full" />
    </div>
  );
}

function InfoCard({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#FAF7F2] rounded-lg p-4 ${className}`}>
      <h3 className="font-medium text-sm text-gray-500 mb-2">{title}</h3>
      {children}
    </div>
  );
}

export default async function StructureDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const element = tastingData.sections.structure.elements.find((e) => e.id === slug) as any;

  if (!element) {
    notFound();
  }

  const otherElements = tastingData.sections.structure.elements.filter((e) => e.id !== slug);

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-[#722F37]">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources" className="text-gray-500 hover:text-[#722F37]">Resources</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources/tasting" className="text-gray-500 hover:text-[#722F37]">Tasting Science</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#1C1C1C]">{element.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-5xl">{element.icon}</span>
          <div>
            <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{element.name}</h1>
            <p className="text-gray-600 mt-1">Structural Element</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-6">
          <h2 className="font-serif text-xl italic text-[#722F37] mb-3">What It Is</h2>
          <p className="text-gray-700 leading-relaxed">{element.what_it_is}</p>
        </div>

        {/* Spectrum */}
        {element.spectrum && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">The Spectrum</h2>
            <SpectrumBar low={element.spectrum.low} high={element.spectrum.high} />
            {element.spectrum.medium && (
              <p className="text-center text-sm text-gray-500 mt-2">{element.spectrum.medium}</p>
            )}
          </div>
        )}

        {/* How to Detect */}
        <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
          <h2 className="font-serif text-xl italic text-[#722F37] mb-3">How to Detect</h2>
          <p className="text-gray-700">{element.how_to_detect}</p>
        </div>

        {/* The Science */}
        {element.science && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-6">
            <h2 className="font-serif text-xl italic text-amber-800 mb-3">The Science</h2>
            <p className="text-amber-900">{element.science}</p>
          </div>
        )}

        {/* Acids (for Acidity) */}
        {element.acids && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Types of Acids in Wine</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {element.acids.map((acid: any) => (
                <div key={acid.name} className="bg-[#FAF7F2] rounded-lg p-4">
                  <h3 className="font-medium text-[#1C1C1C]">{acid.name}</h3>
                  <p className="text-sm text-gray-500">Source: {acid.source}</p>
                  <p className="text-sm text-gray-700 mt-1">{acid.character}</p>
                  {acid.note && <p className="text-xs text-[#722F37] mt-2 italic">{acid.note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sources (for Tannin) */}
        {element.sources && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Sources of Tannin</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {element.sources.map((source: any) => (
                <div key={source.name} className="bg-[#FAF7F2] rounded-lg p-4">
                  <h3 className="font-medium text-[#1C1C1C]">{source.name}</h3>
                  <p className="text-sm text-gray-700">{source.character}</p>
                  {source.extraction && <p className="text-xs text-gray-500 mt-1">{source.extraction}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Texture Vocabulary (for Tannin) */}
        {element.texture_vocabulary && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Tannin Texture Vocabulary</h2>
            <div className="flex flex-wrap gap-3">
              {element.texture_vocabulary.map((tex: any) => (
                <div key={tex.term} className="bg-[#FAF7F2] rounded-lg px-4 py-2">
                  <span className="font-medium text-[#1C1C1C]">{tex.term}</span>
                  <span className="text-gray-500 text-sm ml-2">{tex.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alcohol Levels */}
        {element.levels && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Alcohol Levels</h2>
            <div className="space-y-3">
              {element.levels.map((level: any, i: number) => (
                <div key={i} className="flex items-center gap-4 bg-[#FAF7F2] rounded-lg p-3">
                  <span className="font-mono text-sm font-medium text-[#722F37] w-24">{level.range}</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{level.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    level.heat === 'None' ? 'bg-blue-100 text-blue-700' :
                    level.heat === 'Minimal' ? 'bg-green-100 text-green-700' :
                    level.heat === 'Subtle' ? 'bg-yellow-100 text-yellow-700' :
                    level.heat === 'Noticeable' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>{level.heat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Body Spectrum */}
        {element.id === 'body' && element.spectrum && Array.isArray(element.spectrum) && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Body Spectrum</h2>
            <div className="space-y-3">
              {element.spectrum.map((level: any) => (
                <div key={level.level} className="bg-[#FAF7F2] rounded-lg p-4">
                  <h3 className="font-medium text-[#1C1C1C]">{level.level}</h3>
                  <p className="text-sm text-gray-600">{level.description}</p>
                  <p className="text-xs text-[#722F37] mt-1">Examples: {level.examples}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sweetness Spectrum */}
        {element.id === 'sweetness' && element.spectrum && Array.isArray(element.spectrum) && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Sweetness Spectrum</h2>
            <div className="space-y-3">
              {element.spectrum.map((level: any) => (
                <div key={level.level} className="bg-[#FAF7F2] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-[#1C1C1C]">{level.level}</h3>
                    <span className="text-xs font-mono text-gray-500">{level.rs}</span>
                  </div>
                  <p className="text-xs text-[#722F37]">Examples: {level.examples}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Components (for Body) */}
        {element.components && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">What Creates Body</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {element.components.map((comp: any) => (
                <div key={comp.name} className="bg-[#FAF7F2] rounded-lg p-3">
                  <span className="font-medium text-[#1C1C1C]">{comp.name}: </span>
                  <span className="text-sm text-gray-600">{comp.contribution}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Perception Factors (for Sweetness) */}
        {element.perception_factors && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Factors Affecting Sweetness Perception</h2>
            <ul className="space-y-2">
              {element.perception_factors.map((factor: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#722F37] mt-0.5">&#x2022;</span>
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Balance Considerations */}
        {element.considerations && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Key Considerations</h2>
            <ul className="space-y-2">
              {element.considerations.map((consideration: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#722F37] mt-0.5">&#x2022;</span>
                  {consideration}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Balance Examples */}
        {element.examples && Array.isArray(element.examples) && element.id === 'balance' && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Examples of Balance</h2>
            <div className="space-y-3">
              {element.examples.map((ex: any, i: number) => (
                <div key={i} className="bg-[#FAF7F2] rounded-lg p-4">
                  <h3 className="font-medium text-[#1C1C1C]">{ex.wine}</h3>
                  <p className="text-sm text-gray-600">{ex.balance}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Imbalance Signs */}
        {element.imbalance_signs && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-5 mb-6">
            <h2 className="font-serif text-xl italic text-red-800 mb-4">Signs of Imbalance</h2>
            <ul className="space-y-2">
              {element.imbalance_signs.map((sign: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-red-900">
                  <span className="text-red-500 mt-0.5">&#x2022;</span>
                  {sign}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Wine Impact */}
        <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
          <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Impact on Wine</h2>
          <p className="text-gray-700">{element.wine_impact}</p>
        </div>

        {/* Examples */}
        {element.examples && !Array.isArray(element.examples) && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Examples</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-medium text-green-800 mb-2">High {element.name}</h3>
                <p className="text-sm text-green-700">{element.examples.high}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2">Low {element.name}</h3>
                <p className="text-sm text-blue-700">{element.examples.low}</p>
              </div>
            </div>
          </div>
        )}

        {/* Climate Correlation */}
        {element.climate_correlation && (
          <div className="bg-[#FAF7F2] rounded-lg p-5 mb-6">
            <h3 className="font-medium text-[#1C1C1C] mb-2">Climate Connection</h3>
            <p className="text-gray-700">{element.climate_correlation}</p>
          </div>
        )}

        {/* Other Elements */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Other Structural Elements</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {otherElements.map((other: any) => (
              <Link
                key={other.id}
                href={`/resources/tasting/structure/${other.id}`}
                className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{other.icon}</span>
                  <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                    {other.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/resources/tasting"
            className="inline-flex items-center text-[#722F37] hover:underline"
          >
            ← Back to Tasting Science Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
