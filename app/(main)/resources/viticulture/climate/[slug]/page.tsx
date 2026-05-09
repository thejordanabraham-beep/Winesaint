import { notFound } from 'next/navigation';
import Link from 'next/link';
import vitData from '@/app/data/viticulture.json';

export async function generateStaticParams() {
  const challenges = vitData.sections.climate_challenges.challenges;
  return challenges.map((challenge) => ({
    slug: challenge.id,
  }));
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    critical: 'bg-red-600 text-white',
    high: 'bg-orange-500 text-white',
    'medium-high': 'bg-amber-500 text-white',
    medium: 'bg-yellow-500 text-black',
    low: 'bg-green-500 text-white',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[severity.toLowerCase()] || 'bg-gray-500 text-white'}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)} Severity
    </span>
  );
}

export default async function ClimateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const challenge = vitData.sections.climate_challenges.challenges.find((c) => c.id === slug);

  if (!challenge) {
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
          <span className="text-[#1C1C1C]">{challenge.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {challenge.severity && <SeverityBadge severity={challenge.severity} />}
          </div>
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{challenge.name}</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-6">
          {/* Description */}
          <p className="text-gray-700 leading-relaxed mb-6">{challenge.description}</p>

          {/* Observed Changes (climate change) */}
          {challenge.observed_changes && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Observed Changes</h2>
              <ul className="space-y-2">
                {challenge.observed_changes.map((change: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600">!</span>
                    <span className="text-gray-700">{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Adaptation Strategies (climate change) */}
          {challenge.adaptation_strategies && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Adaptation Strategies</h2>
              <div className="space-y-3">
                {challenge.adaptation_strategies.map((strategy: { strategy: string; approach: string; examples: string }, i: number) => (
                  <div key={i} className="bg-[#FAF7F2] rounded-lg p-4">
                    <p className="font-medium text-[#1C1C1C] mb-1">{strategy.strategy}</p>
                    <p className="text-sm text-gray-700 mb-1">{strategy.approach}</p>
                    <p className="text-xs text-gray-500">Examples: {strategy.examples}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Migration (climate change) */}
          {challenge.migration && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Wine Region Migration</h2>
              <p className="text-gray-700 mb-3">{challenge.migration.description}</p>
              <div className="flex flex-wrap gap-2">
                {challenge.migration.examples.map((example: string, i: number) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {example}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Smoke Taint (wildfires) */}
          {challenge.smoke_taint && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Smoke Taint</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-gray-700 mb-3"><strong>Cause:</strong> {challenge.smoke_taint.cause}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-amber-800 mb-1">Compounds</p>
                    <ul className="text-sm">
                      {challenge.smoke_taint.compounds.map((compound: string, i: number) => (
                        <li key={i} className="text-gray-700">• {compound}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-amber-800 mb-1">Symptoms</p>
                    <ul className="text-sm">
                      {challenge.smoke_taint.symptoms.map((symptom: string, i: number) => (
                        <li key={i} className="text-gray-700">• {symptom}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3"><strong>The Problem:</strong> {challenge.smoke_taint.problem}</p>
              </div>
            </div>
          )}

          {/* Affected Regions */}
          {challenge.affected_regions && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Affected Regions</h2>
              <div className="flex flex-wrap gap-2">
                {challenge.affected_regions.map((region: string, i: number) => (
                  <span key={i} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    {region}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mitigation */}
          {challenge.mitigation && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Mitigation</h2>
              <div className="grid gap-3">
                {Object.entries(challenge.mitigation).map(([key, value]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">{key.replace(/_/g, ' ')}</p>
                    <p className="text-gray-700">{value as string}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Damage (heat, hail) */}
          {challenge.damage && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Damage</h2>
              {Array.isArray(challenge.damage) ? (
                <ul className="space-y-2">
                  {challenge.damage.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-600">!</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="grid gap-3">
                  {Object.entries(challenge.damage as Record<string, string>).map(([key, value]) => (
                    <div key={key} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="font-medium text-red-800 capitalize">{key.replace(/_/g, ' ')}</p>
                      <p className="text-gray-700">{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Management */}
          {challenge.management && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Management</h2>
              <ul className="space-y-2">
                {challenge.management.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Responses (water scarcity) */}
          {challenge.responses && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Responses</h2>
              <div className="grid gap-4">
                {Object.entries(challenge.responses).map(([category, items]) => (
                  <div key={category} className="bg-[#FAF7F2] rounded-lg p-4">
                    <p className="font-medium text-[#1C1C1C] capitalize mb-2">{category.replace(/_/g, ' ')}</p>
                    <ul className="space-y-1">
                      {(items as string[]).map((item, i) => (
                        <li key={i} className="text-sm text-gray-700">• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dry Farming */}
          {challenge.dry_farming && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-green-800 mb-2">Dry Farming</h2>
              <p className="text-gray-700 mb-2"><strong>Definition:</strong> {challenge.dry_farming.definition}</p>
              <p className="text-gray-700 mb-2"><strong>Requirements:</strong> {challenge.dry_farming.requirements}</p>
              <p className="text-gray-700 mb-2"><strong>Examples:</strong> {challenge.dry_farming.examples}</p>
              <p className="text-sm text-gray-600 italic">{challenge.dry_farming.quality_argument}</p>
            </div>
          )}

          {/* Protection (hail) */}
          {challenge.protection && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Protection Methods</h2>
              <div className="space-y-3">
                {challenge.protection.map((method: { method: string; effectiveness: string; drawback?: string }, i: number) => (
                  <div key={i} className="bg-[#FAF7F2] rounded-lg p-4">
                    <p className="font-medium text-[#1C1C1C]">{method.method}</p>
                    <p className="text-sm text-gray-700">Effectiveness: {method.effectiveness}</p>
                    {method.drawback && (
                      <p className="text-sm text-amber-600">Note: {method.drawback}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2021 Examples */}
          {challenge['2021_examples'] && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Recent Events (2021)</h2>
              <div className="flex flex-wrap gap-2">
                {challenge['2021_examples'].map((example: string, i: number) => (
                  <span key={i} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                    {example}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hail Prone Regions */}
          {challenge.hail_prone_regions && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Hail-Prone Regions</h2>
              <div className="flex flex-wrap gap-2">
                {challenge.hail_prone_regions.map((region: string, i: number) => (
                  <span key={i} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {region}
                  </span>
                ))}
              </div>
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
