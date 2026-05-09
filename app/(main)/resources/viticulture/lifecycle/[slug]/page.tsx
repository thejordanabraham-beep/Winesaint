import { notFound } from 'next/navigation';
import Link from 'next/link';
import vitData from '@/app/data/viticulture.json';

export async function generateStaticParams() {
  const stages = vitData.sections.lifecycle.stages;
  return stages.map((stage) => ({
    slug: stage.id,
  }));
}

export default async function LifecycleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stage = vitData.sections.lifecycle.stages.find((s) => s.id === slug);

  if (!stage) {
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
          <span className="text-[#1C1C1C]">{stage.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{stage.name}</h1>
          <p className="text-xl text-gray-500 italic mt-1">{stage.french_term}</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-6">
          {/* Timing */}
          <div className="grid grid-cols-2 gap-4 mb-6 bg-[#FAF7F2] rounded-lg p-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Northern Hemisphere</p>
              <p className="text-lg font-medium text-[#1C1C1C]">{stage.timing.northern_hemisphere}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Southern Hemisphere</p>
              <p className="text-lg font-medium text-[#1C1C1C]">{stage.timing.southern_hemisphere}</p>
            </div>
            {stage.duration && (
              <div className="col-span-2">
                <p className="text-xs font-medium text-gray-500 uppercase">Duration</p>
                <p className="text-lg font-medium text-[#1C1C1C]">{stage.duration}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed mb-6">{stage.description}</p>

          {/* Visual Signs */}
          {stage.visual_signs && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Visual Signs</h2>
              <ul className="space-y-2">
                {stage.visual_signs.map((sign: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#722F37]">•</span>
                    <span className="text-gray-700">{sign}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Physiological Changes */}
          {stage.physiological_changes && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">What&apos;s Happening</h2>
              <ul className="space-y-2">
                {stage.physiological_changes.map((change: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#722F37]">•</span>
                    <span className="text-gray-700">{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Vineyard Activities */}
          {stage.vineyard_activities && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Vineyard Activities</h2>
              <div className="flex flex-wrap gap-2">
                {stage.vineyard_activities.map((activity: string, i: number) => (
                  <span key={i} className="bg-[#FAF7F2] px-3 py-1 rounded-full text-sm border border-[#1C1C1C]/10">
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Risks */}
          {stage.risks && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Risks</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {stage.risks.map((risk: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-600">⚠</span>
                      <span className="text-gray-700">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Impact on Wine */}
          {stage.impact_on_wine && (
            <div className="bg-[#722F37]/5 border border-[#722F37]/20 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-[#722F37] mb-2">Impact on Wine</h2>
              <p className="text-gray-700">{stage.impact_on_wine}</p>
            </div>
          )}
        </div>

        {/* Regional Notes */}
        {stage.regional_notes && (
          <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Regional Notes</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(stage.regional_notes).map(([region, note]) => (
                <div key={region} className="bg-[#FAF7F2] rounded-lg p-4">
                  <p className="font-medium text-[#1C1C1C] capitalize mb-1">{region}</p>
                  <p className="text-sm text-gray-600">{note as string}</p>
                </div>
              ))}
            </div>
          </div>
        )}

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
