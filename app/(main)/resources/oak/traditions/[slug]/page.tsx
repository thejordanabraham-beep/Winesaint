import Link from 'next/link';
import { notFound } from 'next/navigation';
import oakData from '@/app/data/oak.json';

// Create slug from region name
function createSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export function generateStaticParams() {
  return oakData.sections.regional_traditions.regions.map((region) => ({
    slug: createSlug(region.region),
  }));
}

export default async function TraditionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tradition = oakData.sections.regional_traditions.regions.find(
    (r) => createSlug(r.region) === slug
  );

  if (!tradition) {
    notFound();
  }

  // Get other traditions for comparison
  const otherTraditions = oakData.sections.regional_traditions.regions.filter(
    (r) => createSlug(r.region) !== slug
  );

  // Find related barrel format
  const formatMatch = tradition.format.match(/(\d+)L?\s*(\w+)/i);
  let relatedFormat = null;
  if (formatMatch) {
    const formatName = formatMatch[2].toLowerCase();
    relatedFormat = oakData.sections.barrel_formats.formats.find(
      (f) => f.name.toLowerCase().includes(formatName) || f.id.includes(formatName)
    );
  }

  // Determine if American or French oak dominant
  const isAmericanOak = tradition.oak_type.toLowerCase().includes('american');
  const isFrenchOak = tradition.oak_type.toLowerCase().includes('french');
  const isSlavonian = tradition.oak_type.toLowerCase().includes('slavonian');

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
          <span className="text-[#1C1C1C]">{tradition.region}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">Oak in {tradition.region}</h1>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isAmericanOak ? 'bg-blue-100 text-blue-800' :
              isFrenchOak ? 'bg-purple-100 text-purple-800' :
              isSlavonian ? 'bg-amber-100 text-amber-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {tradition.oak_type}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#FAF7F2] border border-[#1C1C1C]/20">
              {tradition.format}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-8">
          {/* Tradition */}
          {tradition.tradition && (
            <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">History & Tradition</h2>
              <p className="text-gray-700 leading-relaxed">{tradition.tradition}</p>
            </div>
          )}

          {/* Style Impact */}
          <div className="mb-8">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Impact on Wine Style</h2>
            <p className="text-gray-700 leading-relaxed">{tradition.style_impact}</p>
          </div>

          {/* New Oak Usage */}
          {tradition.new_oak_usage && (
            <div className="mb-8">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">New Oak Usage</h2>
              <p className="text-gray-700">{tradition.new_oak_usage}</p>
            </div>
          )}

          {/* Aging Requirements */}
          {tradition.aging_requirements && (
            <div className="mb-8 bg-[#FAF7F2] rounded-lg p-5">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Aging Requirements</h2>
              <p className="text-gray-700">{tradition.aging_requirements}</p>
            </div>
          )}

          {/* Inventory */}
          {tradition.inventory && (
            <div className="mb-8">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Regional Barrel Inventory</h2>
              <p className="text-gray-700">{tradition.inventory}</p>
            </div>
          )}

          {/* Notable Coopers */}
          {tradition.notable_coopers && (
            <div className="mb-8">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Notable Cooperages</h2>
              <div className="flex flex-wrap gap-2">
                {tradition.notable_coopers.map((cooper, i) => (
                  <span key={i} className="px-3 py-1 bg-[#FAF7F2] rounded-full border border-[#1C1C1C]/20">
                    {cooper}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Modern Trend */}
          {tradition.modern_trend && (
            <div className="bg-amber-50 rounded-lg p-5 border border-amber-200">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Modern Trends</h2>
              <p className="text-gray-700">{tradition.modern_trend}</p>
            </div>
          )}

          {/* Debate */}
          {tradition.debate && (
            <div className="mt-6 bg-red-50 rounded-lg p-5 border border-red-200">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">The Debate</h2>
              <p className="text-gray-700">{tradition.debate}</p>
            </div>
          )}
        </div>

        {/* Related Format */}
        {relatedFormat && (
          <div className="mb-8">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Traditional Barrel Format</h2>
            <Link
              href={`/resources/oak/formats/${relatedFormat.id}`}
              className="block bg-white rounded-lg border-2 border-[#1C1C1C] p-5 hover:border-[#722F37] hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-xl italic text-[#1C1C1C] group-hover:text-[#722F37]">
                    {relatedFormat.name}
                  </h3>
                  <p className="text-sm text-gray-500">{relatedFormat.origin}</p>
                </div>
                <span className="text-2xl font-bold text-[#722F37]">
                  {typeof relatedFormat.capacity_liters === 'number'
                    ? `${relatedFormat.capacity_liters}L`
                    : relatedFormat.capacity_liters}
                </span>
              </div>
              <p className="text-gray-600 mt-3">{relatedFormat.characteristics}</p>
            </Link>
          </div>
        )}

        {/* Other Traditions */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Other Regional Traditions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {otherTraditions.slice(0, 4).map((other) => (
              <Link
                key={createSlug(other.region)}
                href={`/resources/oak/traditions/${createSlug(other.region)}`}
                className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
              >
                <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                  {other.region}
                </h3>
                <p className="text-sm text-gray-500">{other.oak_type}</p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{other.style_impact}</p>
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
