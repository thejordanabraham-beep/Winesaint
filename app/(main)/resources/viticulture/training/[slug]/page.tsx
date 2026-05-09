import { notFound } from 'next/navigation';
import Link from 'next/link';
import vitData from '@/app/data/viticulture.json';

export async function generateStaticParams() {
  const systems = vitData.sections.training_systems.systems;
  return systems.map((system) => ({
    slug: system.id,
  }));
}

// Vigor meter component
function VigorMeter({ level }: { level: string }) {
  const getVigorLevel = (vigor: string) => {
    const lower = vigor.toLowerCase();
    if (lower.includes('very high')) return 5;
    if (lower.includes('high')) return 4;
    if (lower.includes('moderate') || lower.includes('medium')) return 3;
    if (lower.includes('low to moderate') || lower.includes('low-med')) return 2;
    if (lower.includes('low')) return 1;
    return 3;
  };

  const vigorLevel = getVigorLevel(level);

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i <= vigorLevel ? 'bg-green-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600">{level}</span>
    </div>
  );
}

export default async function TrainingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const system = vitData.sections.training_systems.systems.find((s) => s.id === slug);

  if (!system) {
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
          <span className="text-[#1C1C1C]">{system.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{system.name}</h1>
          {system.aka && (
            <p className="text-gray-500 mt-2">Also known as: {system.aka.join(', ')}</p>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-6">
          {/* Description */}
          <p className="text-gray-700 leading-relaxed mb-6">{system.description}</p>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 bg-[#FAF7F2] rounded-lg p-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Vigor Suitability</p>
              <VigorMeter level={system.vigor_suitability} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Climate</p>
              <p className="text-lg font-medium text-[#1C1C1C]">{system.climate_suitability}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Labor Intensity</p>
              <p className="text-lg font-medium text-[#1C1C1C]">{system.labor_intensity}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Mechanization</p>
              <p className="text-lg font-medium text-[#1C1C1C]">{system.mechanization}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Planting Density</p>
              <p className="text-lg font-medium text-[#1C1C1C]">{system.planting_density}</p>
            </div>
            {system.origin && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Origin</p>
                <p className="text-lg font-medium text-[#1C1C1C]">{system.origin}</p>
              </div>
            )}
          </div>

          {/* Structure Details */}
          {system.structure && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Structure</h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(system.structure).map(([key, value]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase">{key.replace(/_/g, ' ')}</p>
                    <p className="text-[#1C1C1C]">{value as string}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Characteristics */}
          {system.characteristics && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Characteristics</h2>
              <ul className="space-y-2">
                {system.characteristics.map((char: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#722F37]">•</span>
                    <span className="text-gray-700">{char}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Advantages & Disadvantages */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {system.advantages && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h2 className="font-serif text-lg italic text-green-800 mb-3">Advantages</h2>
                <ul className="space-y-2">
                  {system.advantages.map((adv: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-600">+</span>
                      <span className="text-gray-700">{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {system.disadvantages && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h2 className="font-serif text-lg italic text-red-800 mb-3">Disadvantages</h2>
                <ul className="space-y-2">
                  {system.disadvantages.map((dis: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-600">-</span>
                      <span className="text-gray-700">{dis}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Famous Regions */}
          {system.famous_regions && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Famous Regions</h2>
              <div className="flex flex-wrap gap-2">
                {system.famous_regions.map((region: string, i: number) => (
                  <span key={i} className="bg-[#722F37]/10 text-[#722F37] px-3 py-1 rounded-full text-sm">
                    {region}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Best Varieties */}
          {system.best_varieties && (
            <div className="bg-[#FAF7F2] rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-[#722F37] mb-2">Best Suited Varieties</h2>
              <div className="flex flex-wrap gap-2">
                {system.best_varieties.map((variety: string, i: number) => (
                  <span key={i} className="bg-white px-3 py-1 rounded-full text-sm border border-[#1C1C1C]/10">
                    {variety}
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
