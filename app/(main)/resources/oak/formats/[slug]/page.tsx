import Link from 'next/link';
import { notFound } from 'next/navigation';
import oakData from '@/app/data/oak.json';

export function generateStaticParams() {
  return oakData.sections.barrel_formats.formats.map((format) => ({
    slug: format.id,
  }));
}

function CapacityVisual({ liters }: { liters: number | string }) {
  // Normalize to number for comparison
  const numLiters = typeof liters === 'number' ? liters :
    parseInt(liters.toString().replace(/[^0-9]/g, '')) || 225;

  // Scale: 225L = 100%, larger = proportionally wider
  const scale = Math.min(Math.max(numLiters / 225, 0.5), 4);
  const width = Math.min(scale * 60, 200);
  const height = Math.min(scale * 40, 120);

  return (
    <div className="flex items-center justify-center py-6">
      <div
        className="bg-amber-700 rounded-[40%] border-4 border-amber-900 flex items-center justify-center"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <span className="text-white font-bold text-sm">
          {typeof liters === 'number' ? `${liters}L` : liters}
        </span>
      </div>
    </div>
  );
}

function OakInfluenceBar({ influence }: { influence: string }) {
  const influenceLower = influence.toLowerCase();
  let level = 50;
  if (influenceLower.includes('very low') || influenceLower.includes('minimal')) level = 10;
  else if (influenceLower.includes('low')) level = 25;
  else if (influenceLower.includes('medium-high')) level = 65;
  else if (influenceLower.includes('medium')) level = 50;
  else if (influenceLower.includes('high')) level = 85;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-500">Oak Influence</span>
        <span className="font-medium">{influence}</span>
      </div>
      <div className="bg-gray-200 rounded-full h-3">
        <div
          className="bg-[#722F37] h-full rounded-full transition-all"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}

export default async function FormatDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const format = oakData.sections.barrel_formats.formats.find((f) => f.id === slug);

  if (!format) {
    notFound();
  }

  // Find regions that use this format
  const regionsUsingFormat = oakData.sections.regional_traditions.regions.filter((region) => {
    const formatLower = region.format.toLowerCase();
    const formatNameLower = format.name.toLowerCase();
    const formatIdLower = format.id.toLowerCase();
    return formatLower.includes(formatNameLower) ||
           formatLower.includes(formatIdLower) ||
           (format.id === 'barrique' && formatLower.includes('225l')) ||
           (format.id === 'piece' && formatLower.includes('228l'));
  });

  // Get other formats for comparison, sorted by capacity
  const otherFormats = oakData.sections.barrel_formats.formats
    .filter((f) => f.id !== slug)
    .sort((a, b) => {
      const aLiters = typeof a.capacity_liters === 'number' ? a.capacity_liters :
        parseInt(a.capacity_liters.toString().replace(/[^0-9]/g, '')) || 0;
      const bLiters = typeof b.capacity_liters === 'number' ? b.capacity_liters :
        parseInt(b.capacity_liters.toString().replace(/[^0-9]/g, '')) || 0;
      return aLiters - bLiters;
    });

  // Calculate surface area context
  const liters = typeof format.capacity_liters === 'number' ? format.capacity_liters :
    parseInt(format.capacity_liters.toString().replace(/[^0-9]/g, '')) || 225;
  const isSmallFormat = liters <= 300;
  const isMediumFormat = liters > 300 && liters <= 700;
  const isLargeFormat = liters > 700;

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-[#722F37]">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources" className="text-gray-500 hover:text-[#722F37]">Resources</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources/oak" className="text-gray-500 hover:text-[#722F37]">Oak Guide</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#1C1C1C]">{format.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{format.name}</h1>
          <p className="mt-2 text-gray-500">{format.origin}</p>
        </div>

        {/* Visual */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-8">
          <CapacityVisual liters={format.capacity_liters} />

          {format.dimensions && (
            <p className="text-center text-sm text-gray-500 mb-4">{format.dimensions}</p>
          )}

          <OakInfluenceBar influence={format.oak_influence} />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-8">
          {/* Characteristics */}
          <div className="mb-8">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Characteristics</h2>
            <p className="text-gray-700 leading-relaxed">{format.characteristics}</p>
          </div>

          {/* Size Category */}
          <div className="mb-8 bg-[#FAF7F2] rounded-lg p-5">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Size Impact</h2>
            {isSmallFormat && (
              <p className="text-gray-700">{oakData.sections.barrel_formats.size_impact.small_format}</p>
            )}
            {isMediumFormat && (
              <p className="text-gray-700">Medium format provides a balance between small and large vessel characteristics. Moderate extraction rate with good oxygen exposure.</p>
            )}
            {isLargeFormat && (
              <p className="text-gray-700">{oakData.sections.barrel_formats.size_impact.large_format}</p>
            )}
          </div>

          {/* Surface Area Math */}
          <div className="mb-8">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Why Size Matters</h2>
            <p className="text-gray-700">
              {isSmallFormat
                ? `A ${format.name} at ${format.capacity_liters} has a high surface-to-volume ratio, meaning more wine is in contact with oak. This accelerates extraction and oxygen exposure, delivering more pronounced oak character in less time.`
                : isLargeFormat
                ? `Large format vessels like the ${format.name} minimize the surface-to-volume ratio. Less wine touches oak at any given time, resulting in subtle, slow integration. These vessels are often used for decades, contributing primarily through micro-oxygenation rather than flavor.`
                : `The ${format.name} offers a middle ground: enough surface contact for character development, but less aggressive than a standard barrique. Popular for winemakers seeking integration without domination.`
              }
            </p>
          </div>
        </div>

        {/* Regions Using This Format */}
        {regionsUsingFormat.length > 0 && (
          <div className="mb-8">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Regions Using {format.name}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {regionsUsingFormat.map((region) => {
                const regionSlug = region.region.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return (
                  <Link
                    key={regionSlug}
                    href={`/resources/oak/traditions/${regionSlug}`}
                    className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
                  >
                    <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                      {region.region}
                    </h3>
                    <p className="text-sm text-gray-500">{region.oak_type}</p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{region.style_impact}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Compare Formats */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Compare Barrel Sizes</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {otherFormats.slice(0, 6).map((other) => (
              <Link
                key={other.id}
                href={`/resources/oak/formats/${other.id}`}
                className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                    {other.name}
                  </h3>
                  <span className="text-sm font-bold text-[#722F37]">
                    {typeof other.capacity_liters === 'number'
                      ? `${other.capacity_liters}L`
                      : other.capacity_liters}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{other.oak_influence}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/resources/oak"
            className="inline-flex items-center text-[#722F37] hover:underline"
          >
            ← Back to Oak Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
