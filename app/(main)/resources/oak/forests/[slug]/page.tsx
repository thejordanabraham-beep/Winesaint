import Link from 'next/link';
import { notFound } from 'next/navigation';
import oakData from '@/app/data/oak.json';

// Flatten all forests for lookup
function getAllForests() {
  const forests: any[] = [];
  oakData.sections.forests.regions.forEach((region) => {
    region.forests.forEach((forest) => {
      forests.push({
        ...forest,
        regionName: region.name,
        regionCountry: region.country,
      });
    });
  });
  return forests;
}

export function generateStaticParams() {
  const forests = getAllForests();
  return forests.map((forest) => ({
    slug: forest.id,
  }));
}

function GrainIndicator({ grain, size = 'md' }: { grain: string; size?: 'sm' | 'md' | 'lg' }) {
  const grainLower = grain.toLowerCase();
  let level = 2;
  if (grainLower.includes('very tight') || grainLower.includes('tight')) level = 1;
  if (grainLower.includes('coarse') || grainLower.includes('loose') || grainLower.includes('wide')) level = 3;

  const sizeClasses = {
    sm: 'w-2 h-4',
    md: 'w-3 h-6',
    lg: 'w-4 h-8',
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Grain Tightness:</span>
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`${sizeClasses[size]} rounded-sm ${i <= level ? 'bg-[#722F37]' : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-[#1C1C1C]">{grain}</span>
    </div>
  );
}

export default async function ForestDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const forests = getAllForests();
  const forest = forests.find((f) => f.id === slug);

  if (!forest) {
    notFound();
  }

  // Get related forests from same region
  const region = oakData.sections.forests.regions.find((r) =>
    r.forests.some((f) => f.id === slug)
  );
  const relatedForests = region?.forests.filter((f) => f.id !== slug) || [];

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
          <span className="text-[#1C1C1C]">{forest.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-[#722F37] font-medium mb-1">{forest.regionName} • {forest.regionCountry}</p>
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{forest.name}</h1>
          {forest.department && (
            <p className="mt-2 text-gray-500">{forest.department}</p>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-8">
          {/* Key Stats */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Species Composition</h2>
              <p className="text-lg">{forest.species_mix || forest.species || 'Not specified'}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Price Tier</h2>
              <p className="text-lg">{forest.price_tier}</p>
            </div>
          </div>

          {/* Grain */}
          <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
            <GrainIndicator grain={forest.grain} size="lg" />
            <p className="mt-3 text-gray-600">
              {forest.grain.toLowerCase().includes('tight')
                ? 'Tight grain means slower extraction, more aromatic compounds, and lower tannin contribution. Premium wines benefit from the subtlety.'
                : forest.grain.toLowerCase().includes('loose') || forest.grain.toLowerCase().includes('coarse')
                ? 'Looser grain allows faster extraction and higher tannin contribution. Better suited for spirits or wines needing aggressive oak.'
                : 'Medium grain provides balanced extraction, suitable for a wide range of wine styles.'}
            </p>
          </div>

          {/* Characteristics */}
          <div className="mb-8">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Characteristics</h2>
            <p className="text-gray-700 leading-relaxed">{forest.characteristics}</p>
          </div>

          {/* Flavor Profile */}
          <div className="mb-8">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Flavor Profile</h2>
            <p className="text-gray-700">{forest.flavor_notes}</p>
          </div>

          {/* Best For */}
          <div className="bg-[#FAF7F2] rounded-lg p-5">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Best Used For</h2>
            <p className="text-gray-700">{forest.best_for}</p>
          </div>

          {/* Tree Age if available */}
          {forest.tree_age && (
            <div className="mt-6 pt-6 border-t border-[#1C1C1C]/10">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Tree Age</h2>
              <p className="text-gray-700">{forest.tree_age}</p>
            </div>
          )}
        </div>

        {/* Related Forests */}
        {relatedForests.length > 0 && (
          <div className="mb-8">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">
              Other {forest.regionName} Forests
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {relatedForests.map((related) => (
                <Link
                  key={related.id}
                  href={`/resources/oak/forests/${related.id}`}
                  className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
                >
                  <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                    {related.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{related.grain} grain</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{related.characteristics}</p>
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
