import Link from 'next/link';
import { notFound } from 'next/navigation';
import oakData from '@/app/data/oak.json';

export function generateStaticParams() {
  return oakData.sections.species.items.map((species) => ({
    slug: species.id,
  }));
}

function GrainIndicator({ grain }: { grain: string }) {
  const grainLower = grain.toLowerCase();
  let level = 2;
  if (grainLower.includes('tight')) level = 1;
  if (grainLower.includes('coarse') || grainLower.includes('wide') || grainLower.includes('medium to wide')) level = 3;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-8 rounded-sm ${i <= level ? 'bg-[#722F37]' : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <span className="font-medium">{grain}</span>
    </div>
  );
}

export default async function SpeciesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const species = oakData.sections.species.items.find((s) => s.id === slug);

  if (!species) {
    notFound();
  }

  // Find forests that use this species
  const relatedForests: any[] = [];
  oakData.sections.forests.regions.forEach((region) => {
    region.forests.forEach((forest: any) => {
      const speciesMix = (forest.species_mix || forest.species || '').toLowerCase();
      const speciesName = species.name.toLowerCase();
      if (speciesMix.includes(speciesName) || speciesMix.includes(species.common_name.toLowerCase())) {
        relatedForests.push({
          ...forest,
          regionName: region.name,
        });
      }
    });
  });

  // Get other species for comparison
  const otherSpecies = oakData.sections.species.items.filter((s) => s.id !== slug);

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
          <span className="text-[#1C1C1C]">{species.common_name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{species.name}</h1>
          <p className="mt-2 text-xl text-gray-600">{species.common_name}</p>
          <p className="mt-1 text-sm text-[#722F37]">{species.origin}</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-8">
          {/* Grain */}
          <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
            <h2 className="text-sm font-medium text-gray-500 mb-3">Typical Grain</h2>
            <GrainIndicator grain={species.grain} />
          </div>

          {/* Characteristics */}
          <div className="mb-8">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Key Characteristics</h2>
            <ul className="space-y-3">
              {species.characteristics.map((char, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#722F37] rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{char}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Flavor Profile */}
          <div className="mb-8">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Flavor Profile</h2>
            <div className="flex flex-wrap gap-2">
              {species.flavor_profile.map((flavor, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-[#FAF7F2] rounded-full border border-[#1C1C1C]/20 text-[#1C1C1C]"
                >
                  {flavor}
                </span>
              ))}
            </div>
          </div>

          {/* Best For */}
          <div className="bg-[#FAF7F2] rounded-lg p-5">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Best Used For</h2>
            <p className="text-gray-700">{species.best_for}</p>
          </div>
        </div>

        {/* Related Forests */}
        {relatedForests.length > 0 && (
          <div className="mb-8">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">
              Forests with {species.common_name}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {relatedForests.map((forest) => (
                <Link
                  key={forest.id}
                  href={`/resources/oak/forests/${forest.id}`}
                  className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
                >
                  <p className="text-xs text-[#722F37] mb-1">{forest.regionName}</p>
                  <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                    {forest.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{forest.characteristics}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Compare Species */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Compare Species</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {otherSpecies.map((other) => (
              <Link
                key={other.id}
                href={`/resources/oak/species/${other.id}`}
                className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
              >
                <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                  {other.name}
                </h3>
                <p className="text-sm text-gray-500">{other.common_name}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {other.flavor_profile.slice(0, 3).map((f, i) => (
                    <span key={i} className="text-xs bg-[#FAF7F2] px-2 py-0.5 rounded">
                      {f}
                    </span>
                  ))}
                </div>
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
