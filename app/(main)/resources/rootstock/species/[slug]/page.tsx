import Link from 'next/link';
import { notFound } from 'next/navigation';
import rootstockData from '@/app/data/rootstock.json';

export function generateStaticParams() {
  return rootstockData.sections.species.items.map((species) => ({
    slug: species.id,
  }));
}

function ToleranceIndicator({ level, label }: { level: string; label: string }) {
  const levelLower = level.toLowerCase();
  let rating = 3;
  let color = 'bg-yellow-500';

  if (levelLower.includes('very high') || levelLower.includes('excellent')) {
    rating = 5;
    color = 'bg-green-500';
  } else if (levelLower.includes('high')) {
    rating = 4;
    color = 'bg-lime-500';
  } else if (levelLower.includes('moderate')) {
    rating = 3;
    color = 'bg-yellow-500';
  } else if (levelLower.includes('low to moderate')) {
    rating = 2;
    color = 'bg-orange-400';
  } else if (levelLower.includes('low') || levelLower.includes('very low')) {
    rating = 1;
    color = 'bg-red-400';
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-500 text-xs">{level}</span>
      </div>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-6 h-2 rounded-sm ${i <= rating ? color : 'bg-gray-200'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default async function SpeciesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const species = rootstockData.sections.species.items.find((s) => s.id === slug);

  if (!species) {
    notFound();
  }

  // Find rootstocks derived from this species
  const derivedRootstocks = rootstockData.sections.rootstocks.varieties.filter((r) => {
    const parentageType = r.parentage.type.toLowerCase();
    const speciesName = species.name.toLowerCase().replace('vitis ', '');
    return parentageType.includes(speciesName) ||
           (r.parentage.species && r.parentage.species.toLowerCase().includes(speciesName));
  });

  // Get other species for comparison
  const otherSpecies = rootstockData.sections.species.items.filter((s) => s.id !== slug);

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
          <span className="text-[#1C1C1C]">{species.common_name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{species.name}</h1>
          <p className="mt-2 text-xl text-gray-600">{species.common_name}</p>
          <p className="mt-1 text-sm text-[#722F37]">{species.native_range}</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-8">
          {/* Key Traits */}
          <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Key Traits</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <ToleranceIndicator level={species.vigor} label="Vigor" />
              <ToleranceIndicator level={species.phylloxera_resistance} label="Phylloxera Resistance" />
              <ToleranceIndicator level={species.nematode_resistance} label="Nematode Resistance" />
              <ToleranceIndicator level={species.limestone_tolerance} label="Limestone Tolerance" />
              <ToleranceIndicator level={species.drought_tolerance} label="Drought Tolerance" />
            </div>
          </div>

          {/* Climate & Soil */}
          <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Adaptation</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-[#FAF7F2] rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Climate</p>
                <p className="font-medium">{species.climate_adaptation}</p>
              </div>
              <div className="bg-[#FAF7F2] rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Soil Preference</p>
                <p className="font-medium">{species.soil_preference}</p>
              </div>
            </div>
          </div>

          {/* Characteristics */}
          <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Characteristics</h2>
            <ul className="space-y-3">
              {species.characteristics.map((char, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#722F37] rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{char}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Rootstock Contribution */}
          <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Contribution to Rootstocks</h2>
            <p className="text-gray-700">{species.rootstock_contribution}</p>
          </div>

          {/* Famous Hybrids */}
          <div className="bg-[#FAF7F2] rounded-lg p-5">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Famous Hybrids</h2>
            <div className="flex flex-wrap gap-2">
              {species.famous_hybrids.map((hybrid, i) => (
                <Link
                  key={i}
                  href={`/resources/rootstock/varieties/${hybrid.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}`}
                  className="px-4 py-2 bg-white rounded-full border border-[#1C1C1C]/20 hover:border-[#722F37] hover:text-[#722F37] transition-colors"
                >
                  {hybrid}
                </Link>
              ))}
            </div>
          </div>

          {/* Viala Discovery (for V. berlandieri) */}
          {species.viala_discovery && (
            <div className="mt-6 bg-amber-50 rounded-lg p-5 border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-3">The Viala Discovery ({species.viala_discovery.year})</h3>
              <p className="text-gray-700 mb-2">{species.viala_discovery.context}</p>
              <p className="text-sm text-gray-600"><strong>Location:</strong> {species.viala_discovery.location}</p>
              <p className="text-sm text-amber-700 mt-2 italic">{species.viala_discovery.significance}</p>
            </div>
          )}
        </div>

        {/* Derived Rootstocks */}
        {derivedRootstocks.length > 0 && (
          <div className="mb-8">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">
              Rootstocks with {species.common_name}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {derivedRootstocks.slice(0, 6).map((rootstock) => (
                <Link
                  key={rootstock.id}
                  href={`/resources/rootstock/varieties/${rootstock.id}`}
                  className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
                >
                  <h3 className="font-serif text-lg italic text-[#722F37] group-hover:underline">
                    {rootstock.name}
                  </h3>
                  <p className="text-sm text-gray-500">{rootstock.parentage.type}</p>
                  <p className="text-sm text-gray-600 mt-2">{rootstock.vigor}</p>
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
                href={`/resources/rootstock/species/${other.id}`}
                className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
              >
                <h3 className="font-serif text-lg italic text-[#722F37] group-hover:underline">
                  {other.name}
                </h3>
                <p className="text-sm text-gray-500">{other.common_name}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-xs text-gray-500">Vigor:</span>
                    <p className="font-medium">{other.vigor}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Limestone:</span>
                    <p className="font-medium">{other.limestone_tolerance.split(' ')[0]}</p>
                  </div>
                </div>
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
