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
    owner?: string;
    notable_clients?: string[];
    characteristics: string;
    specialty?: string;
    history?: {
      founding?: string;
      timeline?: Array<{ year: string; event: string }>;
      legacy?: string;
    } | string;
    forest_sources?: {
      description?: string;
      grain_selections?: Array<{ name: string; forest: string; character: string }>;
      primary_forests?: string[];
      notes?: string;
    };
    seasoning?: {
      duration?: string;
      location?: string;
      notes?: string;
    };
    toast_profiles?: {
      traditional?: string[];
      signature?: string[];
      notes?: string;
    };
    signature_products?: Array<{
      name: string;
      description: string;
      price?: string;
    }>;
    barrel_formats?: string[];
    price_positioning?: string;
    unique_points?: string[];
    regionName: string;
  }> = [];

  oakData.sections.cooperage.famous_cooperages.regions.forEach((region: { name: string; cooperages: any[] }) => {
    region.cooperages.forEach((cooperage: any) => {
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
          <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
            <div className="bg-[#FAF7F2] rounded-lg p-5">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {cooperage.annual_production && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Annual Production</p>
                    <p className="text-lg font-bold text-[#722F37]">{cooperage.annual_production}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="text-sm font-medium">{cooperage.location}</p>
                </div>
                {cooperage.owner && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Owner</p>
                    <p className="text-sm font-medium">{cooperage.owner}</p>
                  </div>
                )}
                {cooperage.price_positioning && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Price Tier</p>
                    <p className="text-sm font-medium">{cooperage.price_positioning}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Specialty */}
          {cooperage.specialty && (
            <div className="mb-8 bg-amber-50 rounded-lg p-5 border border-amber-200">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-2">Specialty</h2>
              <p className="text-gray-700 text-lg">{cooperage.specialty}</p>
            </div>
          )}

          {/* History */}
          {cooperage.history && (
            <div className="mb-8">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">History</h2>
              {typeof cooperage.history === 'string' ? (
                <p className="text-gray-700 leading-relaxed">{cooperage.history}</p>
              ) : (
                <div className="space-y-4">
                  {cooperage.history.founding && (
                    <p className="text-gray-700 leading-relaxed">{cooperage.history.founding}</p>
                  )}
                  {cooperage.history.timeline && cooperage.history.timeline.length > 0 && (
                    <div className="border-l-2 border-[#722F37] pl-4 space-y-3 mt-4">
                      {cooperage.history.timeline.map((event, i) => (
                        <div key={i} className="flex gap-4">
                          <span className="text-sm font-bold text-[#722F37] w-20 shrink-0">{event.year}</span>
                          <span className="text-sm text-gray-700">{event.event}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {cooperage.history.legacy && (
                    <p className="text-gray-600 italic mt-4">{cooperage.history.legacy}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Forest Sources */}
          {cooperage.forest_sources && (
            <div className="mb-8">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Forest Sources</h2>
              {cooperage.forest_sources.description && (
                <p className="text-gray-700 mb-4">{cooperage.forest_sources.description}</p>
              )}
              {cooperage.forest_sources.grain_selections && cooperage.forest_sources.grain_selections.length > 0 && (
                <div className="grid gap-3 md:grid-cols-2">
                  {cooperage.forest_sources.grain_selections.map((grain, i) => (
                    <div key={i} className="bg-[#FAF7F2] rounded-lg p-3 border border-[#1C1C1C]/10">
                      <p className="font-medium text-[#722F37]">{grain.name}</p>
                      <p className="text-sm text-gray-600">{grain.forest}</p>
                      <p className="text-xs text-gray-500 italic">{grain.character}</p>
                    </div>
                  ))}
                </div>
              )}
              {cooperage.forest_sources.primary_forests && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {cooperage.forest_sources.primary_forests.map((forest, i) => (
                    <span key={i} className="px-3 py-1 bg-green-50 text-green-800 rounded-full text-sm border border-green-200">
                      {forest}
                    </span>
                  ))}
                </div>
              )}
              {cooperage.forest_sources.notes && (
                <p className="text-sm text-gray-500 italic mt-3">{cooperage.forest_sources.notes}</p>
              )}
            </div>
          )}

          {/* Seasoning */}
          {cooperage.seasoning && (
            <div className="mb-8 bg-blue-50 rounded-lg p-5 border border-blue-200">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Seasoning</h2>
              <div className="grid gap-2 md:grid-cols-2">
                {cooperage.seasoning.duration && (
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-medium text-blue-800">{cooperage.seasoning.duration}</p>
                  </div>
                )}
                {cooperage.seasoning.location && (
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-medium">{cooperage.seasoning.location}</p>
                  </div>
                )}
              </div>
              {cooperage.seasoning.notes && (
                <p className="text-sm text-gray-600 mt-3">{cooperage.seasoning.notes}</p>
              )}
            </div>
          )}

          {/* Toast Profiles */}
          {cooperage.toast_profiles && (
            <div className="mb-8">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Toast Profiles</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {cooperage.toast_profiles.traditional && (
                  <div className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1C1C1C]/10">
                    <p className="text-sm font-medium text-gray-500 mb-2">Traditional</p>
                    <div className="flex flex-wrap gap-2">
                      {cooperage.toast_profiles.traditional.map((toast, i) => (
                        <span key={i} className="px-2 py-1 bg-white rounded text-sm border border-[#1C1C1C]/20">
                          {toast}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {cooperage.toast_profiles.signature && (
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <p className="text-sm font-medium text-amber-700 mb-2">Signature</p>
                    <div className="flex flex-wrap gap-2">
                      {cooperage.toast_profiles.signature.map((toast: any, i) => (
                        typeof toast === 'string' ? (
                          <span key={i} className="px-2 py-1 bg-white rounded text-sm border border-amber-300">
                            {toast}
                          </span>
                        ) : (
                          <div key={i} className="bg-white rounded p-2 border border-amber-300 text-sm">
                            <p className="font-medium text-[#722F37]">{toast.name}</p>
                            {toast.composition && <p className="text-gray-600 text-xs">{toast.composition}</p>}
                            {toast.character && <p className="text-gray-500 text-xs italic">{toast.character}</p>}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {cooperage.toast_profiles.notes && (
                <p className="text-sm text-gray-600 mt-3">{cooperage.toast_profiles.notes}</p>
              )}
            </div>
          )}

          {/* Signature Products */}
          {cooperage.signature_products && cooperage.signature_products.length > 0 && (
            <div className="mb-8">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Signature Products</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {cooperage.signature_products.map((product, i) => (
                  <div key={i} className="bg-[#722F37]/5 rounded-lg p-4 border border-[#722F37]/20">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-lg italic text-[#722F37]">{product.name}</h3>
                      {product.price && (
                        <span className="text-sm font-medium text-gray-600">{product.price}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{product.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Barrel Formats */}
          {cooperage.barrel_formats && cooperage.barrel_formats.length > 0 && (
            <div className="mb-8">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Barrel Formats</h2>
              <div className="flex flex-wrap gap-2">
                {cooperage.barrel_formats.map((format, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    {format}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Characteristics */}
          <div className="mb-8">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Characteristics</h2>
            <p className="text-gray-700 leading-relaxed">{cooperage.characteristics}</p>
          </div>

          {/* Unique Points */}
          {cooperage.unique_points && cooperage.unique_points.length > 0 && (
            <div className="mb-8">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Key Distinctions</h2>
              <ul className="space-y-2">
                {cooperage.unique_points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#722F37] mt-1">*</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
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
