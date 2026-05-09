import Link from 'next/link';
import { notFound } from 'next/navigation';
import terroirData from '@/app/data/terroir.json';

export function generateStaticParams() {
  return terroirData.sections.climate.items.map((climate) => ({
    slug: climate.id,
  }));
}

function TemperatureScale({ range }: { range: string }) {
  const isHot = range.toLowerCase().includes('hot') || range.toLowerCase().includes('40');
  const isCold = range.toLowerCase().includes('cold') || range.toLowerCase().includes('-10');
  const isMild = range.toLowerCase().includes('mild');

  let position = 50;
  if (isHot) position = 80;
  if (isCold) position = 30;
  if (isMild) position = 50;

  return (
    <div className="bg-[#FAF7F2] rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-500 mb-3">Temperature Profile</h3>
      <div className="relative h-4 rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-500">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-6 bg-white border-2 border-[#1C1C1C] rounded"
          style={{ left: `${position}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Cold</span>
        <span>Mild</span>
        <span>Hot</span>
      </div>
      <p className="text-center mt-2 font-medium">{range}</p>
    </div>
  );
}

function GrowingDegreeDays({ gdd }: { gdd: string }) {
  const match = gdd.match(/(\d+)/);
  const value = match ? parseInt(match[1]) : 1500;
  const percentage = Math.min((value / 2500) * 100, 100);

  return (
    <div className="bg-[#FAF7F2] rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-500 mb-3">Growing Degree Days</h3>
      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-[#1C1C1C]">{gdd}</span>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Cool (900)</span>
        <span>Moderate (1500)</span>
        <span>Hot (2500+)</span>
      </div>
    </div>
  );
}

export default async function ClimateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const climate = terroirData.sections.climate.items.find((c) => c.id === slug);

  if (!climate) {
    notFound();
  }

  const otherClimates = terroirData.sections.climate.items.filter((c) => c.id !== slug);

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
          <span className="text-[#1C1C1C]">{climate.name} Climate</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{climate.name} Climate</h1>
          <p className="mt-2 text-xl text-gray-600">{climate.temperature_range}</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-8">
          {/* Climate Indicators */}
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <TemperatureScale range={climate.temperature_range} />
            <GrowingDegreeDays gdd={climate.growing_degree_days} />
          </div>

          {/* Wine Impact */}
          <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Impact on Wine</h2>
            <p className="text-gray-700 text-lg">{climate.wine_impact}</p>
          </div>

          {/* Characteristics */}
          <div className="mb-8">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Characteristics</h2>
            <ul className="space-y-3">
              {climate.characteristics.map((char, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#722F37] rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{char}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Challenges */}
          <div className="mb-8">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Key Challenges</h2>
            <div className="flex flex-wrap gap-2">
              {climate.key_challenges.map((challenge, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-red-50 rounded-full border border-red-200 text-red-800"
                >
                  {challenge}
                </span>
              ))}
            </div>
          </div>

          {/* Famous Regions */}
          <div className="bg-[#FAF7F2] rounded-lg p-5">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Famous Wine Regions</h2>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {climate.famous_regions.map((region, i) => (
                <div key={i} className="bg-white rounded-lg p-3 border border-[#1C1C1C]/10">
                  <span className="text-[#722F37] font-medium">{region}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Other Climate Types */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Compare Climate Zones</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {otherClimates.map((other) => (
              <Link
                key={other.id}
                href={`/resources/terroir/climate/${other.id}`}
                className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
              >
                <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                  {other.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{other.temperature_range}</p>
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
