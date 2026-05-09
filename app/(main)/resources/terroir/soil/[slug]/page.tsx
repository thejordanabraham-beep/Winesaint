import Link from 'next/link';
import { notFound } from 'next/navigation';
import terroirData from '@/app/data/terroir.json';

export function generateStaticParams() {
  return terroirData.sections.soil.items.map((soil) => ({
    slug: soil.id,
  }));
}

function SoilColorSwatch({ color }: { color: string }) {
  return (
    <div
      className="w-16 h-16 rounded-lg border-2 border-[#1C1C1C]/20 shadow-inner"
      style={{ backgroundColor: color }}
    />
  );
}

function DrainageRating({ soilType }: { soilType: string }) {
  const drainageMap: Record<string, number> = {
    'gravel': 5,
    'sand': 5,
    'volcanic': 4,
    'limestone': 4,
    'chalk': 4,
    'schist': 4,
    'slate': 4,
    'granite': 4,
    'loess': 3,
    'marl': 3,
    'terra-rossa': 3,
    'clay': 1,
  };
  const level = drainageMap[soilType] || 3;
  const labels = ['', 'Poor', 'Below Average', 'Moderate', 'Good', 'Excellent'];

  return (
    <div className="bg-[#FAF7F2] rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Drainage Capacity</h3>
      <div className="flex items-center gap-3">
        <div className="flex gap-1 flex-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-8 flex-1 rounded ${
                i <= level ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <span className="text-lg font-medium text-[#722F37]">{labels[level]}</span>
      </div>
    </div>
  );
}

export default async function SoilDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const soil = terroirData.sections.soil.items.find((s) => s.id === slug);

  if (!soil) {
    notFound();
  }

  const otherSoils = terroirData.sections.soil.items.filter((s) => s.id !== slug);

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-[#722F37]">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources" className="text-gray-500 hover:text-[#722F37]">Resources</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources/terroir" className="text-gray-500 hover:text-[#722F37]">Terroir Guide</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#1C1C1C]">{soil.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start gap-6 mb-8">
          <SoilColorSwatch color={soil.color} />
          <div>
            <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{soil.name}</h1>
            <p className="mt-2 text-gray-600">{soil.composition}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-8">
          {/* Wine Impact */}
          <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Impact on Wine</h2>
            <p className="text-gray-700 text-lg">{soil.wine_impact}</p>
          </div>

          {/* Drainage */}
          <div className="mb-8">
            <DrainageRating soilType={soil.id} />
          </div>

          {/* Characteristics */}
          <div className="mb-8">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Characteristics</h2>
            <ul className="space-y-3">
              {soil.characteristics.map((char, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#722F37] rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{char}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Best Grapes */}
          <div className="mb-8">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Best Grape Varieties</h2>
            <div className="flex flex-wrap gap-2">
              {soil.best_for.map((grape, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-[#FAF7F2] rounded-full border border-[#1C1C1C]/20 text-[#1C1C1C]"
                >
                  {grape}
                </span>
              ))}
            </div>
          </div>

          {/* Famous Regions */}
          <div className="mb-8">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Famous Wine Regions</h2>
            <div className="grid gap-2 md:grid-cols-2">
              {soil.famous_regions.map((region, i) => (
                <div key={i} className="bg-[#FAF7F2] rounded-lg p-3">
                  <span className="text-[#722F37] font-medium">{region}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Depth Note */}
          <div className="bg-amber-50 rounded-lg p-5 border border-amber-200">
            <h3 className="font-medium text-amber-800 mb-2">Winemaker's Note</h3>
            <p className="text-amber-900">{soil.depth_note}</p>
          </div>
        </div>

        {/* Other Soil Types */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Compare Other Soil Types</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {otherSoils.slice(0, 6).map((other) => (
              <Link
                key={other.id}
                href={`/resources/terroir/soil/${other.id}`}
                className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-6 h-6 rounded border border-[#1C1C1C]/20"
                    style={{ backgroundColor: other.color }}
                  />
                  <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                    {other.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{other.wine_impact}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/resources/terroir"
            className="inline-flex items-center text-[#722F37] hover:underline"
          >
            ← Back to Terroir Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
