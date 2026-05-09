import Link from 'next/link';
import { notFound } from 'next/navigation';
import tastingData from '@/app/data/tasting.json';

export function generateStaticParams() {
  return tastingData.sections.faults.faults.map((fault) => ({
    slug: fault.id,
  }));
}

function FixabilityBadge({ canFix }: { canFix: boolean | string }) {
  const isFixable = canFix === true || canFix === 'Often yes';
  const label = typeof canFix === 'string' ? canFix : (isFixable ? 'May be fixable' : 'Cannot be fixed');

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
      isFixable ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      <span className={`w-2 h-2 rounded-full ${isFixable ? 'bg-green-500' : 'bg-red-500'}`} />
      {label}
    </span>
  );
}

function SeverityScale({ severity }: { severity: string }) {
  return (
    <div className="bg-[#FAF7F2] rounded-lg p-4">
      <h3 className="font-medium text-sm text-gray-500 mb-2">Severity</h3>
      <p className="text-gray-700">{severity}</p>
    </div>
  );
}

export default async function FaultDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fault = tastingData.sections.faults.faults.find((f) => f.id === slug) as any;

  if (!fault) {
    notFound();
  }

  const otherFaults = tastingData.sections.faults.faults.filter((f) => f.id !== slug);

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
          <span className="text-[#1C1C1C]">{fault.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <span className="text-5xl">{fault.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{fault.name}</h1>
              <FixabilityBadge canFix={fault.can_fix} />
            </div>
            <p className="text-gray-500 mt-1">Wine Fault</p>
          </div>
        </div>

        {/* Cause */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-6">
          <h2 className="font-serif text-xl italic text-[#722F37] mb-3">What Causes It</h2>
          <p className="text-gray-700 text-lg">{fault.cause}</p>
          {fault.how_it_happens && (
            <p className="text-gray-600 mt-3">{fault.how_it_happens}</p>
          )}
        </div>

        {/* Detection */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
          <h2 className="font-serif text-xl italic text-amber-800 mb-3">How to Detect It</h2>
          {typeof fault.detection === 'string' ? (
            <p className="text-amber-900 text-lg">{fault.detection}</p>
          ) : (
            <div className="space-y-3">
              {fault.detection.visual && (
                <div>
                  <p className="text-sm font-medium text-amber-700">Visual:</p>
                  <p className="text-amber-900">{fault.detection.visual}</p>
                </div>
              )}
              {fault.detection.aroma && (
                <div>
                  <p className="text-sm font-medium text-amber-700">Aroma:</p>
                  <p className="text-amber-900">{fault.detection.aroma}</p>
                </div>
              )}
              {fault.detection.palate && (
                <div>
                  <p className="text-sm font-medium text-amber-700">Palate:</p>
                  <p className="text-amber-900">{fault.detection.palate}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Compounds */}
        {fault.compounds && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Chemical Compounds</h2>
            {Array.isArray(fault.compounds) ? (
              <div className="flex flex-wrap gap-2">
                {fault.compounds.map((compound: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-[#FAF7F2] rounded-full text-sm font-mono">
                    {compound}
                  </span>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(fault.compounds).map(([level, desc]: [string, any]) => (
                  <div key={level} className="bg-[#FAF7F2] rounded-lg p-3">
                    <span className="font-medium text-[#1C1C1C] capitalize">{level}: </span>
                    <span className="text-gray-700">{desc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Threshold */}
        {fault.threshold && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Detection Threshold</h2>
            {typeof fault.threshold === 'string' ? (
              <p className="font-mono text-lg">{fault.threshold}</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(fault.threshold).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between bg-[#FAF7F2] rounded-lg p-3">
                    <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                    <span className="font-mono">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chemistry */}
        {fault.chemistry && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-3">The Chemistry</h2>
            <p className="text-gray-700">{fault.chemistry}</p>
          </div>
        )}

        {/* Severity */}
        {fault.severity && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Severity</h2>
            <p className="text-gray-700">{fault.severity}</p>
          </div>
        )}

        {/* How to Fix (if applicable) */}
        {fault.how_to_fix && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-6">
            <h2 className="font-serif text-xl italic text-green-800 mb-4">How to Fix It</h2>
            <ul className="space-y-2">
              {fault.how_to_fix.map((step: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-green-900">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* What to Do */}
        {fault.what_to_do && (
          <div className="bg-[#722F37] text-white rounded-lg p-6 mb-6">
            <h2 className="font-serif text-xl italic mb-3">What to Do</h2>
            <p className="text-white/90">{fault.what_to_do}</p>
          </div>
        )}

        {/* Controversy (for Brett) */}
        {fault.controversy && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">The Controversy</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-medium text-green-800 mb-2">Defenders Say</h3>
                <p className="text-sm text-green-700">{fault.controversy.defenders}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h3 className="font-medium text-red-800 mb-2">Critics Say</h3>
                <p className="text-sm text-red-700">{fault.controversy.critics}</p>
              </div>
            </div>
            {fault.controversy.regional_tolerance && (
              <p className="text-sm text-gray-600 mt-4 bg-[#FAF7F2] rounded-lg p-3">
                <strong>Regional tolerance:</strong> {fault.controversy.regional_tolerance}
              </p>
            )}
          </div>
        )}

        {/* Tolerance (for VA) */}
        {fault.tolerance && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Tolerance Levels</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-[#FAF7F2] rounded-lg p-4">
                <h3 className="font-medium text-[#1C1C1C] mb-2">Traditional View</h3>
                <p className="text-sm text-gray-700">{fault.tolerance.traditional}</p>
              </div>
              <div className="bg-[#FAF7F2] rounded-lg p-4">
                <h3 className="font-medium text-[#1C1C1C] mb-2">Modern View</h3>
                <p className="text-sm text-gray-700">{fault.tolerance.modern}</p>
              </div>
            </div>
          </div>
        )}

        {/* Intentional Examples (for Oxidation) */}
        {fault.intentional_examples && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">When It's Intentional</h2>
            <div className="flex flex-wrap gap-2">
              {fault.intentional_examples.map((example: string, i: number) => (
                <span key={i} className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm">
                  {example}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Susceptible Wines (for Lightstrike) */}
        {fault.susceptible && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Most Susceptible</h2>
            <div className="flex flex-wrap gap-2">
              {fault.susceptible.map((wine: string, i: number) => (
                <span key={i} className="px-4 py-2 bg-[#722F37] text-white rounded-full text-sm">
                  {wine}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Prevention */}
        {fault.prevention && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
            <h2 className="font-serif text-xl italic text-blue-800 mb-3">Prevention</h2>
            <p className="text-blue-900">{fault.prevention}</p>
          </div>
        )}

        {/* Prevalence */}
        {fault.prevalence && (
          <div className="bg-[#FAF7F2] rounded-lg p-4 mb-6">
            <p className="text-gray-600">
              <strong>Prevalence:</strong> {fault.prevalence}
            </p>
          </div>
        )}

        {/* Note */}
        {fault.note && (
          <div className="bg-gray-100 rounded-lg p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Note</h2>
            <p className="text-gray-700">{fault.note}</p>
          </div>
        )}

        {/* Other Faults */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Other Wine Faults</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {otherFaults.map((other: any) => (
              <Link
                key={other.id}
                href={`/resources/tasting/faults/${other.id}`}
                className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{other.icon}</span>
                  <div>
                    <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                      {other.name}
                    </h3>
                    <p className="text-xs text-gray-500">{other.cause}</p>
                  </div>
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
