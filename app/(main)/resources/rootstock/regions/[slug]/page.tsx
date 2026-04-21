import Link from 'next/link';
import { notFound } from 'next/navigation';
import rootstockData from '@/app/data/rootstock.json';

export function generateStaticParams() {
  return rootstockData.sections.regions.regions.map((region) => ({
    slug: region.id,
  }));
}

export default async function RegionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const region = rootstockData.sections.regions.regions.find((r) => r.id === slug);

  if (!region) {
    notFound();
  }

  // Get other regions for comparison
  const otherRegions = rootstockData.sections.regions.regions.filter((r) => r.id !== slug);

  // Find detailed rootstock info for primary rootstocks
  const primaryRootstockDetails = region.primary_rootstocks.map((rs) => {
    const detail = rootstockData.sections.rootstocks.varieties.find(
      (v) => v.name.toLowerCase() === rs.name.toLowerCase() ||
             v.id === rs.name.toLowerCase().replace(/\s+/g, '-')
    );
    return { ...rs, detail };
  });

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-[#722F37]">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources" className="text-gray-500 hover:text-[#722F37]">Resources</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources/rootstock" className="text-gray-500 hover:text-[#722F37]">Rootstock Guide</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#1C1C1C]">{region.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{region.name}</h1>
          <p className="mt-2 text-xl text-gray-600">{region.country}</p>
        </div>

        {/* Key Challenge */}
        <div className="bg-amber-50 rounded-lg border-3 border-amber-200 p-6 mb-8">
          <h2 className="font-semibold text-amber-800 mb-2">Key Challenge</h2>
          <p className="text-lg text-gray-700">{region.key_challenge}</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-8">
          {/* Primary Rootstocks */}
          <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Primary Rootstocks</h2>
            <div className="space-y-4">
              {primaryRootstockDetails.map((rs, idx) => (
                <div key={idx} className="bg-[#FAF7F2] rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-serif text-lg italic text-[#722F37]">{rs.name}</h3>
                      {rs.detail && (
                        <p className="text-sm text-gray-500">{rs.detail.parentage.type}</p>
                      )}
                    </div>
                    <span className="text-lg font-bold text-[#722F37]">{rs.percentage}</span>
                  </div>
                  <p className="text-gray-700">{rs.reason}</p>
                  {rs.detail && (
                    <Link
                      href={`/resources/rootstock/varieties/${rs.detail.id}`}
                      className="inline-block mt-2 text-sm text-[#722F37] hover:underline"
                    >
                      View details →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Secondary Rootstocks */}
          {region.secondary_rootstocks && region.secondary_rootstocks.length > 0 && (
            <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Secondary Rootstocks</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {region.secondary_rootstocks.map((rs, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{rs.name}</span>
                      <span className="text-sm text-gray-500">{rs.percentage}</span>
                    </div>
                    <p className="text-sm text-gray-600">{rs.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Soil Notes */}
          {region.soil_notes && (
            <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Soils</h2>
              <p className="text-gray-700">{region.soil_notes}</p>
            </div>
          )}

          {/* Climate Notes */}
          {region.climate_notes && (
            <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Climate</h2>
              <p className="text-gray-700">{region.climate_notes}</p>
            </div>
          )}

          {/* Historical Context */}
          {region.historical_context && (
            <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Historical Context</h2>
              <p className="text-gray-700">{region.historical_context}</p>
            </div>
          )}

          {/* AXR1 History (Napa) */}
          {region.axr1_history && (
            <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10 bg-red-50 -mx-6 px-6 py-4">
              <h2 className="font-serif text-xl italic text-red-800 mb-3">The AXR1 Failure</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Recommendation:</strong> {region.axr1_history.recommendation}</p>
                <p><strong>Peak Adoption:</strong> {region.axr1_history.peak_adoption}</p>
                <p><strong>Failure:</strong> {region.axr1_history.failure_start}</p>
                <p className="text-red-700"><strong>Cost:</strong> {region.axr1_history.replanting_cost}</p>
                <p className="font-medium mt-2">{region.axr1_history.lesson}</p>
              </div>
            </div>
          )}

          {/* Phylloxera Status (Australia) */}
          {region.phylloxera_status && (
            <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Phylloxera Status</h2>
              <p className="text-gray-700 mb-3">{region.phylloxera_status.description}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="font-medium text-green-800 mb-1">Free Zones</p>
                  <ul className="text-sm text-gray-700">
                    {region.phylloxera_status.free_zones.map((zone, i) => (
                      <li key={i}>• {zone}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <p className="font-medium text-red-800 mb-1">Infected Zones</p>
                  <ul className="text-sm text-gray-700">
                    {region.phylloxera_status.infected_zones.map((zone, i) => (
                      <li key={i}>• {zone}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3"><strong>Quarantine:</strong> {region.phylloxera_status.quarantine}</p>
            </div>
          )}

          {/* Phylloxera Free Reason (Chile) */}
          {region.phylloxera_free_reason && (
            <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Why Phylloxera-Free</h2>
              <p className="text-gray-700 mb-3">{region.phylloxera_free_reason.description}</p>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="font-medium text-green-800 mb-2">Natural Barriers</p>
                <ul className="text-sm text-gray-700 grid grid-cols-2 gap-1">
                  {region.phylloxera_free_reason.barriers.map((barrier, i) => (
                    <li key={i}>• {barrier}</li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-[#722F37] mt-3 italic">{region.phylloxera_free_reason.significance}</p>
            </div>
          )}

          {/* Bordeaux Distribution */}
          {region.bordeaux_rootstock_distribution && (
            <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Sub-Regional Distribution</h2>
              <p className="text-sm text-gray-500 mb-3">{region.bordeaux_rootstock_distribution.note}</p>
              <div className="space-y-2">
                {Object.entries(region.bordeaux_rootstock_distribution)
                  .filter(([key]) => key !== 'note')
                  .map(([area, rootstocks]) => (
                    <div key={area} className="flex gap-4 border-b border-[#1C1C1C]/5 pb-2 last:border-0">
                      <span className="w-40 text-sm font-medium capitalize">{area.replace(/_/g, ' ')}</span>
                      <span className="text-sm text-gray-600">{rootstocks as string}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Modern Trends */}
          {region.modern_trends && (
            <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Modern Trends</h2>
              <p className="text-gray-700">{region.modern_trends}</p>
            </div>
          )}

          {/* Own-Rooted Significance */}
          {region.own_rooted_significance && (
            <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Own-Rooted Vines</h2>
              <p className="text-gray-700">{region.own_rooted_significance}</p>
            </div>
          )}

          {/* Unique Factors */}
          {region.unique_factors && (
            <div className="bg-[#FAF7F2] rounded-lg p-5">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Regional Notes</h2>
              <ul className="space-y-2">
                {region.unique_factors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[#722F37] rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Other Regions */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Explore Other Regions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {otherRegions.map((other) => (
              <Link
                key={other.id}
                href={`/resources/rootstock/regions/${other.id}`}
                className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
              >
                <h3 className="font-serif text-lg italic text-[#722F37] group-hover:underline">
                  {other.name}
                </h3>
                <p className="text-sm text-gray-500">{other.country}</p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{other.key_challenge}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/resources/rootstock"
            className="inline-flex items-center text-[#722F37] hover:underline"
          >
            ← Back to Rootstock Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
