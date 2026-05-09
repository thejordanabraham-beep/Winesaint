import { notFound } from 'next/navigation';
import Link from 'next/link';
import vitData from '@/app/data/viticulture.json';

export async function generateStaticParams() {
  const techniques = vitData.sections.canopy_management.techniques;
  return techniques.map((technique) => ({
    slug: technique.id,
  }));
}

export default async function CanopyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const technique = vitData.sections.canopy_management.techniques.find((t) => t.id === slug);

  if (!technique) {
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
          <span className="text-[#1C1C1C]">{technique.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{technique.name}</h1>
          {technique.french_term && (
            <p className="text-xl text-gray-500 italic mt-1">{technique.french_term}</p>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-6">
          {/* Timing & Labor */}
          <div className="grid grid-cols-2 gap-4 mb-6 bg-[#FAF7F2] rounded-lg p-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Timing</p>
              <p className="text-lg font-medium text-[#1C1C1C]">{technique.timing}</p>
            </div>
            {technique.labor && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Labor Intensity</p>
                <p className="text-lg font-medium text-[#1C1C1C]">{technique.labor}</p>
              </div>
            )}
            {technique.timing_critical && (
              <div className="col-span-2">
                <p className="text-xs font-medium text-gray-500 uppercase">Timing Critical?</p>
                <p className="text-lg font-medium text-[#1C1C1C]">{technique.timing_critical}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed mb-6">{technique.description}</p>

          {/* Purpose */}
          {technique.purpose && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Purpose</h2>
              <p className="text-gray-700 bg-[#FAF7F2] rounded-lg p-4">{technique.purpose}</p>
            </div>
          )}

          {/* Technique Steps */}
          {technique.technique && Array.isArray(technique.technique) && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Technique</h2>
              <ol className="space-y-3">
                {technique.technique.map((step: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#722F37] text-white flex items-center justify-center text-sm">
                      {i + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Goals (if present) */}
          {technique.goals && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Goals</h2>
              <div className="grid gap-3">
                {Object.entries(technique.goals).map(([key, value]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase">{key}</p>
                    <p className="text-[#1C1C1C]">{value as string}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Controversy (if present) */}
          {technique.controversy && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-amber-800 mb-2">Debate</h2>
              <p className="text-gray-700">{technique.controversy}</p>
            </div>
          )}

          {/* Impact on Wine */}
          {technique.impact_on_wine && (
            <div className="bg-[#722F37]/5 border border-[#722F37]/20 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-[#722F37] mb-2">Impact on Wine</h2>
              <p className="text-gray-700">{technique.impact_on_wine}</p>
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
