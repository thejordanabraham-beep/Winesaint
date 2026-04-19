import Link from 'next/link';
import { notFound } from 'next/navigation';
import oakData from '@/app/data/oak.json';

// Flatten cooperages from all regions
function getAllCooperages() {
  const cooperages: Array<{
    id: string;
    name: string;
    location: string;
    founded?: string;
    annual_production?: string;
    style?: string;
    classification?: string;
    notable_clients?: string[];
    characteristics: string;
    specialty?: string;
    regionName: string;
  }> = [];

  oakData.sections.cooperage.famous_cooperages.regions.forEach((region) => {
    region.cooperages.forEach((cooperage) => {
      cooperages.push({
        ...cooperage,
        regionName: region.name,
      });
    });
  });

  return cooperages;
}

export function generateStaticParams() {
  const cooperages = getAllCooperages();
  return cooperages.map((cooperage) => ({
    slug: cooperage.id,
  }));
}

export default async function CooperageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cooperages = getAllCooperages();
  const cooperage = cooperages.find((c) => c.id === slug);

  if (!cooperage) {
    notFound();
  }

  // Get other cooperages from the same region
  const sameRegionCooperages = cooperages.filter(
    (c) => c.regionName === cooperage.regionName && c.id !== slug
  );

  // Get cooperages with the same style
  const sameStyleCooperages = cooperages.filter(
    (c) => c.style === cooperage.style && c.id !== slug && c.regionName !== cooperage.regionName
  );

  const isClassifiedPremier = cooperage.classification === 'Premier' || cooperage.classification === 'Premier Hungarian';
  const isBurgundian = cooperage.style === 'Burgundian';
  const isBordelaise = cooperage.style === 'Bordelaise';

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
          <span className="text-[#1C1C1C]">{cooperage.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{cooperage.name}</h1>
          <p className="mt-2 text-gray-500">{cooperage.location}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {cooperage.founded && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                Est. {cooperage.founded}
              </span>
            )}
            {cooperage.style && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isBurgundian ? 'bg-purple-100 text-purple-800' :
                isBordelaise ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {cooperage.style} Style
              </span>
            )}
            {cooperage.classification && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isClassifiedPremier ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {cooperage.classification}
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#FAF7F2] border border-[#1C1C1C]/20">
              {cooperage.regionName}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-8">
          {/* Quick Stats */}
          {cooperage.annual_production && (
            <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
              <div className="bg-[#FAF7F2] rounded-lg p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Annual Production</p>
                    <p className="text-xl font-bold text-[#722F37]">{cooperage.annual_production}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-lg font-medium">{cooperage.location}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Characteristics */}
          <div className="mb-8">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Characteristics</h2>
            <p className="text-gray-700 leading-relaxed">{cooperage.characteristics}</p>
          </div>

          {/* Specialty */}
          {cooperage.specialty && (
            <div className="mb-8 bg-amber-50 rounded-lg p-5 border border-amber-200">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Specialty</h2>
              <p className="text-gray-700">{cooperage.specialty}</p>
            </div>
          )}

          {/* Notable Clients */}
          {cooperage.notable_clients && cooperage.notable_clients.length > 0 && (
            <div className="mb-8">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Notable Clients</h2>
              <div className="flex flex-wrap gap-2">
                {cooperage.notable_clients.map((client, i) => (
                  <span key={i} className="px-4 py-2 bg-[#FAF7F2] rounded-full border border-[#1C1C1C]/20 text-[#1C1C1C]">
                    {client}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Style Info */}
          {cooperage.style && (
            <div className={`rounded-lg p-5 border ${
              isBurgundian ? 'bg-purple-50 border-purple-200' :
              isBordelaise ? 'bg-red-50 border-red-200' :
              'bg-gray-50 border-gray-200'
            }`}>
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">{cooperage.style} Cooperage Style</h2>
              {isBurgundian && (
                <p className="text-gray-700">
                  {oakData.sections.cooperage.famous_cooperages.classification_styles.burgundian.description} Typical stave thickness: {oakData.sections.cooperage.famous_cooperages.classification_styles.burgundian.stave_thickness}.
                </p>
              )}
              {isBordelaise && (
                <p className="text-gray-700">
                  {oakData.sections.cooperage.famous_cooperages.classification_styles.bordelaise.description} Typical stave thickness: {oakData.sections.cooperage.famous_cooperages.classification_styles.bordelaise.stave_thickness}.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Same Region Cooperages */}
        {sameRegionCooperages.length > 0 && (
          <div className="mb-8">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Other {cooperage.regionName} Cooperages</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {sameRegionCooperages.map((other) => (
                <Link
                  key={other.id}
                  href={`/resources/oak/cooperages/${other.id}`}
                  className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                      {other.name}
                    </h3>
                    {other.style && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        other.style === 'Burgundian' ? 'bg-purple-100 text-purple-800' :
                        other.style === 'Bordelaise' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {other.style}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{other.location}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{other.characteristics}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Same Style Cooperages (Different Region) */}
        {sameStyleCooperages.length > 0 && (
          <div className="mb-8">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Other {cooperage.style} Cooperages</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {sameStyleCooperages.slice(0, 4).map((other) => (
                <Link
                  key={other.id}
                  href={`/resources/oak/cooperages/${other.id}`}
                  className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
                >
                  <p className="text-xs text-[#722F37] mb-1">{other.regionName}</p>
                  <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                    {other.name}
                  </h3>
                  <p className="text-sm text-gray-500">{other.location}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{other.characteristics}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

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
