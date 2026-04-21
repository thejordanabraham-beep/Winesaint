import Link from 'next/link';
import { notFound } from 'next/navigation';
import rootstockData from '@/app/data/rootstock.json';

export function generateStaticParams() {
  return rootstockData.sections.rootstocks.varieties.map((rootstock) => ({
    slug: rootstock.id,
  }));
}

function VigorMeter({ rating }: { rating: number }) {
  const labels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-8 h-4 rounded-sm ${
              i <= rating
                ? i <= 2 ? 'bg-green-500' : i <= 3 ? 'bg-yellow-500' : 'bg-red-500'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-gray-600">{labels[rating - 1]}</p>
    </div>
  );
}

function ResistanceBar({ rating, label, maxLabel = '5' }: { rating: number; label: string; maxLabel?: string }) {
  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-400', 'bg-green-500'];
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{label}</span>
        <span>{rating}/{maxLabel}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full ${colors[rating - 1] || 'bg-gray-300'}`}
          style={{ width: `${rating * 20}%` }}
        />
      </div>
    </div>
  );
}

function ParentageVisualization({ parentage }: { parentage: { type: string; female?: string; male?: string; species?: string; composition?: string } }) {
  const getSpeciesColor = (species: string) => {
    if (species.toLowerCase().includes('riparia')) return 'bg-blue-500';
    if (species.toLowerCase().includes('rupestris')) return 'bg-amber-500';
    if (species.toLowerCase().includes('berlandieri')) return 'bg-green-500';
    if (species.toLowerCase().includes('vinifera')) return 'bg-purple-500';
    return 'bg-gray-500';
  };

  if (parentage.species) {
    return (
      <div className="bg-[#FAF7F2] rounded-lg p-4">
        <p className="text-sm text-gray-500 mb-2">Pure Species Selection</p>
        <div className={`inline-block px-4 py-2 rounded-lg text-white ${getSpeciesColor(parentage.species)}`}>
          {parentage.species}
        </div>
      </div>
    );
  }

  if (parentage.composition) {
    return (
      <div className="bg-[#FAF7F2] rounded-lg p-4">
        <p className="text-sm text-gray-500 mb-2">Complex Hybrid</p>
        <p className="font-medium text-[#1C1C1C]">{parentage.composition}</p>
        <p className="text-sm text-[#722F37] mt-1">{parentage.type}</p>
      </div>
    );
  }

  const parts = parentage.type.split(' x ');
  return (
    <div className="bg-[#FAF7F2] rounded-lg p-4">
      <div className="flex items-center justify-center gap-4">
        <div className={`px-4 py-2 rounded-lg text-white text-center ${getSpeciesColor(parts[0])}`}>
          <p className="text-xs opacity-75">Female</p>
          <p className="font-medium capitalize">{parts[0]}</p>
        </div>
        <span className="text-2xl text-gray-400">x</span>
        <div className={`px-4 py-2 rounded-lg text-white text-center ${getSpeciesColor(parts[1])}`}>
          <p className="text-xs opacity-75">Male</p>
          <p className="font-medium capitalize">{parts[1]}</p>
        </div>
      </div>
    </div>
  );
}

export default async function RootstockDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rootstock = rootstockData.sections.rootstocks.varieties.find((r) => r.id === slug);

  if (!rootstock) {
    notFound();
  }

  // Find related rootstocks with same parentage type
  const relatedRootstocks = rootstockData.sections.rootstocks.varieties.filter(
    (r) => r.id !== slug && r.parentage.type === rootstock.parentage.type
  );

  const isAXR1 = rootstock.id === 'axr1';

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
          <span className="text-[#1C1C1C]">{rootstock.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{rootstock.name}</h1>
              <p className="mt-2 text-xl text-gray-600">{rootstock.full_name}</p>
            </div>
            {isAXR1 && (
              <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
                HISTORICAL FAILURE
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-[#722F37]">
            {rootstock.origin.location} · {rootstock.origin.year}
            {rootstock.origin.breeder && ` · ${rootstock.origin.breeder}`}
          </p>
        </div>

        {/* AXR1 Warning */}
        {isAXR1 && rootstock.historical_failure && (
          <div className="bg-red-50 border-3 border-red-600 rounded-lg p-6 mb-8">
            <h2 className="font-serif text-2xl italic text-red-800 mb-4">The AXR1 Disaster</h2>
            <p className="text-gray-700 mb-4">{rootstock.historical_failure.description}</p>

            <div className="space-y-3 mb-4">
              {rootstock.historical_failure.timeline.map((event, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="font-bold text-red-700 w-24">{event.period}</span>
                  <span className="text-gray-700">{event.event}</span>
                </div>
              ))}
            </div>

            <div className="bg-red-100 rounded p-4">
              <p className="font-bold text-red-800">Cost: {rootstock.historical_failure.cost}</p>
              <p className="text-red-700 mt-2"><strong>Lesson:</strong> {rootstock.historical_failure.lesson}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-8">
          {/* Parentage */}
          <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
            <h2 className="text-sm font-medium text-gray-500 mb-3">Parentage</h2>
            <ParentageVisualization parentage={rootstock.parentage} />
          </div>

          {/* Ratings Grid */}
          <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Performance Ratings</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Vigor</h3>
                <VigorMeter rating={rootstock.vigor_rating} />
                <p className="text-sm text-gray-600 mt-2">{rootstock.vigor}</p>
              </div>
              <div className="space-y-4">
                <ResistanceBar rating={rootstock.limestone_rating} label="Limestone Tolerance" />
                <ResistanceBar rating={rootstock.drought_rating} label="Drought Tolerance" />
              </div>
            </div>
          </div>

          {/* Resistance & Tolerance */}
          <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Resistance & Tolerance</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-[#FAF7F2] rounded-lg p-4">
                <p className="text-xs text-gray-500">Phylloxera Resistance</p>
                <p className="font-medium text-lg">{rootstock.phylloxera_resistance}</p>
              </div>
              <div className="bg-[#FAF7F2] rounded-lg p-4">
                <p className="text-xs text-gray-500">Nematode Resistance</p>
                <p className="font-medium text-lg">{rootstock.nematode_resistance}</p>
              </div>
              <div className="bg-[#FAF7F2] rounded-lg p-4">
                <p className="text-xs text-gray-500">Limestone Tolerance</p>
                <p className="font-medium text-lg">{rootstock.limestone_tolerance}</p>
              </div>
              <div className="bg-[#FAF7F2] rounded-lg p-4">
                <p className="text-xs text-gray-500">Drought Tolerance</p>
                <p className="font-medium text-lg">{rootstock.drought_tolerance}</p>
              </div>
              <div className="bg-[#FAF7F2] rounded-lg p-4">
                <p className="text-xs text-gray-500">Salt Tolerance</p>
                <p className="font-medium text-lg">{rootstock.salt_tolerance}</p>
              </div>
              <div className="bg-[#FAF7F2] rounded-lg p-4">
                <p className="text-xs text-gray-500">Potassium Uptake</p>
                <p className={`font-medium text-lg ${
                  rootstock.potassium_uptake.includes('Low') ? 'text-green-700' :
                  rootstock.potassium_uptake.includes('High') ? 'text-red-700' :
                  'text-yellow-700'
                }`}>{rootstock.potassium_uptake}</p>
              </div>
            </div>
          </div>

          {/* Propagation */}
          <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Propagation</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-[#FAF7F2] rounded-lg p-4">
                <p className="text-xs text-gray-500">Rooting Ability</p>
                <p className="font-medium">{rootstock.rooting_ability}</p>
              </div>
              <div className="bg-[#FAF7F2] rounded-lg p-4">
                <p className="text-xs text-gray-500">Graft Compatibility</p>
                <p className="font-medium">{rootstock.graft_compatibility}</p>
              </div>
            </div>
          </div>

          {/* Characteristics */}
          <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Key Characteristics</h2>
            <ul className="space-y-3">
              {rootstock.characteristics.map((char, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#722F37] rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{char}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Best For / Avoid */}
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <div className="bg-green-50 rounded-lg p-5 border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3">Best For</h3>
              <ul className="space-y-2">
                {rootstock.best_for.map((use, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-600">+</span>
                    {use}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-5 border border-red-200">
              <h3 className="font-semibold text-red-800 mb-3">Avoid For</h3>
              <ul className="space-y-2">
                {rootstock.avoid_for.map((use, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <span className="text-red-600">-</span>
                    {use}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Regional Use */}
          {rootstock.regional_use && (
            <div className="bg-[#FAF7F2] rounded-lg p-5">
              <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Regional Use</h2>
              <ul className="space-y-2">
                {rootstock.regional_use.map((use, i) => (
                  <li key={i} className="text-gray-700">{use}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Caution */}
          {rootstock.caution && (
            <div className="mt-6 bg-amber-50 rounded-lg p-4 border border-amber-200">
              <p className="text-amber-800"><strong>Caution:</strong> {rootstock.caution}</p>
            </div>
          )}
        </div>

        {/* Related Rootstocks */}
        {relatedRootstocks.length > 0 && (
          <div className="mb-8">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">
              Related Rootstocks ({rootstock.parentage.type})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {relatedRootstocks.map((related) => (
                <Link
                  key={related.id}
                  href={`/resources/rootstock/varieties/${related.id}`}
                  className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
                >
                  <h3 className="font-serif text-lg italic text-[#722F37] group-hover:underline">
                    {related.name}
                  </h3>
                  <p className="text-sm text-gray-500">{related.full_name}</p>
                  <p className="text-sm text-gray-600 mt-2">{related.vigor}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

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
