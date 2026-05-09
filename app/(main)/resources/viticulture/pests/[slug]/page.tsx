import { notFound } from 'next/navigation';
import Link from 'next/link';
import vitData from '@/app/data/viticulture.json';

// Gather all pests from all categories
function getAllPests() {
  const pests = vitData.sections.pests_diseases;
  const allPests: Array<{ category: string; item: Record<string, unknown> }> = [];

  if (pests.fungal) {
    pests.fungal.forEach((item) => allPests.push({ category: 'fungal', item }));
  }
  if (pests.insects) {
    pests.insects.forEach((item) => allPests.push({ category: 'insects', item }));
  }
  if (pests.viruses) {
    pests.viruses.forEach((item) => allPests.push({ category: 'viruses', item }));
  }
  if (pests.environmental) {
    pests.environmental.forEach((item) => allPests.push({ category: 'environmental', item }));
  }

  return allPests;
}

export async function generateStaticParams() {
  const allPests = getAllPests();
  return allPests.map(({ item }) => ({
    slug: (item as { id: string }).id,
  }));
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    critical: 'bg-red-600 text-white',
    'very high': 'bg-red-500 text-white',
    high: 'bg-orange-500 text-white',
    'medium-high': 'bg-amber-500 text-white',
    medium: 'bg-yellow-500 text-black',
    'low-medium': 'bg-green-400 text-black',
    low: 'bg-green-500 text-white',
    variable: 'bg-purple-500 text-white',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[severity.toLowerCase()] || 'bg-gray-500 text-white'}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)} Severity
    </span>
  );
}

export default async function PestDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allPests = getAllPests();
  const found = allPests.find(({ item }) => (item as { id: string }).id === slug);

  if (!found) {
    notFound();
  }

  const { category, item: pest } = found;
  const pestData = pest as Record<string, unknown>;

  const categoryLabels: Record<string, string> = {
    fungal: 'Fungal Disease',
    insects: 'Insect Pest',
    viruses: 'Viral Disease',
    environmental: 'Environmental Stress',
  };

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
          <span className="text-[#1C1C1C]">{pestData.name as string}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm bg-[#1C1C1C] text-white px-2 py-1 rounded">
              {categoryLabels[category]}
            </span>
            {pestData.severity && <SeverityBadge severity={pestData.severity as string} />}
          </div>
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{pestData.name as string}</h1>
          {pestData.scientific_name && (
            <p className="text-lg text-gray-500 italic mt-1">{pestData.scientific_name as string}</p>
          )}
          {pestData.aka && (
            <p className="text-gray-500 mt-1">Also known as: {(pestData.aka as string[]).join(', ')}</p>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-6">
          {/* Description */}
          <p className="text-gray-700 leading-relaxed mb-6">{pestData.description as string}</p>

          {/* Origin (if present) */}
          {pestData.origin && (
            <div className="mb-6 bg-[#FAF7F2] rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 uppercase">Origin</p>
              <p className="text-[#1C1C1C]">{pestData.origin as string}</p>
            </div>
          )}

          {/* Symptoms */}
          {pestData.symptoms && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Symptoms</h2>
              {typeof pestData.symptoms === 'object' && !Array.isArray(pestData.symptoms) ? (
                <div className="grid gap-4">
                  {Object.entries(pestData.symptoms as Record<string, string[] | string>).map(([location, symptomList]) => (
                    <div key={location} className="bg-[#FAF7F2] rounded-lg p-4">
                      <p className="font-medium text-[#1C1C1C] capitalize mb-2">{location.replace(/_/g, ' ')}</p>
                      {Array.isArray(symptomList) ? (
                        <ul className="space-y-1">
                          {symptomList.map((symptom, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="text-[#722F37]">•</span>
                              <span className="text-gray-700">{symptom}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-700">{symptomList}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : Array.isArray(pestData.symptoms) ? (
                <ul className="space-y-2">
                  {(pestData.symptoms as string[]).map((symptom, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#722F37]">•</span>
                      <span className="text-gray-700">{symptom}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}

          {/* Conditions Favoring */}
          {pestData.conditions_favoring && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Conditions Favoring</h2>
              <div className="grid gap-3">
                {typeof pestData.conditions_favoring === 'object' ? (
                  Object.entries(pestData.conditions_favoring as Record<string, string>).map(([key, value]) => (
                    <div key={key} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs font-medium text-amber-800 uppercase">{key.replace(/_/g, ' ')}</p>
                      <p className="text-gray-700">{value}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-700">{pestData.conditions_favoring as string}</p>
                )}
              </div>
            </div>
          )}

          {/* Dual Nature (for Botrytis) */}
          {pestData.dual_nature && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Dual Nature</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(pestData.dual_nature as Record<string, Record<string, unknown>>).map(([type, details]) => (
                  <div
                    key={type}
                    className={`rounded-lg p-4 ${
                      type === 'noble_rot' ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <h3 className="font-medium capitalize mb-2">{type.replace(/_/g, ' ')}</h3>
                    {Object.entries(details).map(([key, value]) => (
                      <p key={key} className="text-sm text-gray-700">
                        <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span> {String(value)}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prevention */}
          {pestData.prevention && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Prevention</h2>
              <ul className="space-y-2">
                {(pestData.prevention as string[]).map((method, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-gray-700">{method}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Treatment */}
          {pestData.treatment && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Treatment</h2>
              {typeof pestData.treatment === 'object' && !Array.isArray(pestData.treatment) ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(pestData.treatment as Record<string, string[]>).map(([type, methods]) => (
                    <div key={type} className="bg-[#FAF7F2] rounded-lg p-4">
                      <p className="font-medium text-[#1C1C1C] capitalize mb-2">{type}</p>
                      <ul className="space-y-1">
                        {(methods as string[]).map((method, i) => (
                          <li key={i} className="text-sm text-gray-700">• {method}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700 bg-[#FAF7F2] rounded-lg p-4">{pestData.treatment as string}</p>
              )}
            </div>
          )}

          {/* Control (for insects) */}
          {pestData.control && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Control Methods</h2>
              {Array.isArray(pestData.control) ? (
                <ul className="space-y-2">
                  {(pestData.control as string[]).map((method, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-gray-700">{method}</span>
                    </li>
                  ))}
                </ul>
              ) : typeof pestData.control === 'object' ? (
                <div className="grid gap-4">
                  {Object.entries(pestData.control as Record<string, string[]>).map(([type, methods]) => (
                    <div key={type} className="bg-[#FAF7F2] rounded-lg p-4">
                      <p className="font-medium text-[#1C1C1C] capitalize mb-2">{type}</p>
                      <ul className="space-y-1">
                        {(methods as string[]).map((method, i) => (
                          <li key={i} className="text-sm text-gray-700">• {method}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700">{pestData.control as string}</p>
              )}
            </div>
          )}

          {/* Protection Methods (for environmental) */}
          {pestData.protection_methods && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Protection Methods</h2>
              <div className="space-y-3">
                {(pestData.protection_methods as Array<{ method: string; how: string; cost: string; effectiveness: string }>).map((protection, i) => (
                  <div key={i} className="bg-[#FAF7F2] rounded-lg p-4">
                    <p className="font-medium text-[#1C1C1C] mb-1">{protection.method}</p>
                    <p className="text-sm text-gray-700 mb-2">{protection.how}</p>
                    <div className="flex gap-4 text-xs">
                      <span className="text-gray-500">Cost: {protection.cost}</span>
                      <span className="text-gray-500">Effectiveness: {protection.effectiveness}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cross Reference */}
          {pestData.cross_reference && (
            <div className="mb-6">
              <Link
                href={pestData.cross_reference as string}
                className="inline-flex items-center gap-2 bg-[#722F37] text-white px-4 py-2 rounded-lg hover:bg-[#5a252c] transition-colors"
              >
                Learn more in the Rootstock Guide →
              </Link>
            </div>
          )}

          {/* Impact on Wine */}
          {pestData.impact_on_wine && (
            <div className="bg-[#722F37]/5 border border-[#722F37]/20 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-[#722F37] mb-2">Impact on Wine</h2>
              <p className="text-gray-700">{pestData.impact_on_wine as string}</p>
            </div>
          )}

          {/* Famous Events (for environmental) */}
          {pestData.famous_events && (
            <div className="mt-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Notable Events</h2>
              <ul className="space-y-2">
                {(pestData.famous_events as string[]).map((event, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600">!</span>
                    <span className="text-gray-700">{event}</span>
                  </li>
                ))}
              </ul>
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
