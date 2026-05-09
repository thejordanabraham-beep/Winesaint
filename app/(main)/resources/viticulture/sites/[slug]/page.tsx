import { notFound } from 'next/navigation';
import Link from 'next/link';
import vitData from '@/app/data/viticulture.json';

export async function generateStaticParams() {
  const sites = vitData.sections.famous_sites.sites;
  return sites.map((site) => ({
    slug: site.id,
  }));
}

export default async function SiteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = vitData.sections.famous_sites.sites.find((s) => s.id === slug);

  if (!site) {
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
          <span className="text-[#1C1C1C]">{site.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{site.name}</h1>
          <p className="text-xl text-gray-500 mt-1">{site.region}</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-6">
          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 bg-[#FAF7F2] rounded-lg p-4">
            {site.size_ha && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Size</p>
                <p className="text-lg font-medium text-[#1C1C1C]">{site.size_ha} ha</p>
              </div>
            )}
            {site.elevation && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Elevation</p>
                <p className="text-lg font-medium text-[#1C1C1C]">{site.elevation}</p>
              </div>
            )}
            {site.aspect && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Aspect</p>
                <p className="text-lg font-medium text-[#1C1C1C]">{site.aspect}</p>
              </div>
            )}
            {site.training_system && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Training System</p>
                <p className="text-lg font-medium text-[#1C1C1C]">{site.training_system}</p>
              </div>
            )}
            {site.planting_density && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Planting Density</p>
                <p className="text-lg font-medium text-[#1C1C1C]">{site.planting_density}</p>
              </div>
            )}
            {site.vine_age && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Vine Age</p>
                <p className="text-lg font-medium text-[#1C1C1C]">{site.vine_age}</p>
              </div>
            )}
          </div>

          {/* Soil */}
          {site.soil && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Soil</h2>
              <p className="text-gray-700 bg-[#FAF7F2] rounded-lg p-4">{site.soil}</p>
            </div>
          )}

          {/* Owner */}
          {(site.owner || site.owners) && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Owner(s)</h2>
              {site.owner ? (
                <p className="text-gray-700">{site.owner}</p>
              ) : site.owners ? (
                Array.isArray(site.owners) ? (
                  <div className="flex flex-wrap gap-2">
                    {site.owners.map((owner: string, i: number) => (
                      <span key={i} className="bg-[#FAF7F2] px-3 py-1 rounded-full text-sm border border-[#1C1C1C]/10">
                        {owner}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700">{site.owners}</p>
                )
              ) : null}
            </div>
          )}

          {/* Farming */}
          {site.farming && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Farming</h2>
              <p className="text-gray-700 bg-green-50 border border-green-200 rounded-lg p-4">{site.farming}</p>
            </div>
          )}

          {/* Yields */}
          {site.yields && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Yields</h2>
              <p className="text-gray-700 bg-[#FAF7F2] rounded-lg p-4">{site.yields}</p>
            </div>
          )}

          {/* Viticulture Notes */}
          {site.viticulture_notes && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Viticulture Notes</h2>
              <ul className="space-y-2">
                {site.viticulture_notes.map((note: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#722F37]">•</span>
                    <span className="text-gray-700">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What Makes It Special */}
          {site.what_makes_it_special && (
            <div className="bg-[#722F37]/5 border border-[#722F37]/20 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-[#722F37] mb-2">What Makes It Special</h2>
              <p className="text-gray-700">{site.what_makes_it_special}</p>
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
