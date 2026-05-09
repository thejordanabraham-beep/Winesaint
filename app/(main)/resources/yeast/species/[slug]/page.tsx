import Link from 'next/link';
import { notFound } from 'next/navigation';
import yeastData from '@/app/data/yeast.json';

export function generateStaticParams() {
  return yeastData.sections.species.items.map((species) => ({
    slug: species.id,
  }));
}

function AlcoholToleranceMeter({ tolerance }: { tolerance: string }) {
  const getLevel = (t: string) => {
    if (t.includes('18') || t.includes('Very High')) return 5;
    if (t.includes('16') || t.includes('17') || t.includes('High')) return 4;
    if (t.includes('14') || t.includes('15')) return 3;
    if (t.includes('12') || t.includes('13')) return 2;
    return 1;
  };
  const level = getLevel(tolerance);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Alcohol Tolerance:</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-sm ${
              i <= level
                ? i <= 2 ? 'bg-green-500' : i <= 3 ? 'bg-yellow-500' : i <= 4 ? 'bg-orange-500' : 'bg-red-500'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <span className="font-medium text-[#1C1C1C]">{tolerance}</span>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const getColor = (r: string) => {
    if (r.toLowerCase().includes('primary')) return 'bg-green-100 text-green-800 border-green-200';
    if (r.toLowerCase().includes('spoilage')) return 'bg-red-100 text-red-800 border-red-200';
    if (r.toLowerCase().includes('co-ferment')) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm border ${getColor(role)}`}>
      {role}
    </span>
  );
}

export default async function SpeciesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const species = yeastData.sections.species.items.find((s) => s.id === slug) as any;

  if (!species) {
    notFound();
  }

  const otherSpecies = yeastData.sections.species.items.filter((s) => s.id !== slug);

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-[#722F37]">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources" className="text-gray-500 hover:text-[#722F37]">Resources</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources/yeast" className="text-gray-500 hover:text-[#722F37]">Yeast Guide</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#1C1C1C]">{species.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <span className="text-5xl">{species.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{species.name}</h1>
              <RoleBadge role={species.role} />
            </div>
            <p className="text-gray-500 mt-1">{species.common_name}</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-6">
          <p className="text-gray-700 text-lg">{species.description}</p>
        </div>

        {/* Key Metrics */}
        <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
          <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Key Characteristics</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-[#FAF7F2] rounded-lg p-4">
              <AlcoholToleranceMeter tolerance={species.alcohol_tolerance} />
            </div>
            <div className="bg-[#FAF7F2] rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="text-blue-500 text-xl">🌡️</span>
                <span className="text-sm text-gray-600">Optimal Temperature:</span>
                <span className="font-medium text-[#1C1C1C]">{species.optimal_temperature}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Characteristics */}
        <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
          <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Characteristics</h2>
          <div className="grid gap-2 md:grid-cols-2">
            {species.characteristics.map((char: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 bg-[#FAF7F2] rounded-lg p-3">
                <span className="text-[#722F37]">•</span>
                <span className="text-sm text-gray-700">{char}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Origin */}
        {species.origin && (
          <div className="bg-amber-50 rounded-lg p-5 border border-amber-200 mb-6">
            <h2 className="font-serif text-xl italic text-amber-800 mb-2">Origin</h2>
            <p className="text-gray-700">{species.origin}</p>
          </div>
        )}

        {/* Flavor Contribution */}
        <div className="bg-[#722F37] text-white rounded-lg p-6 mb-6">
          <h2 className="font-serif text-xl italic mb-3">Flavor Contribution</h2>
          <p className="text-white/90">{species.flavor_contribution}</p>
        </div>

        {/* Famous Strains */}
        {species.famous_strains && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Famous Commercial Strains</h2>
            <div className="flex flex-wrap gap-2">
              {species.famous_strains.map((strain: string, idx: number) => (
                <span key={idx} className="px-4 py-2 bg-[#FAF7F2] rounded-full text-sm font-medium">
                  {strain}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Commercial Use */}
        {species.commercial_use && (
          <div className="bg-blue-50 rounded-lg p-5 border border-blue-200 mb-6">
            <h2 className="font-serif text-xl italic text-blue-800 mb-2">Commercial Products</h2>
            <p className="text-gray-700">{species.commercial_use}</p>
          </div>
        )}

        {/* Pairing Info */}
        {species.pairing && (
          <div className="bg-green-50 rounded-lg p-5 border border-green-200 mb-6">
            <h2 className="font-serif text-xl italic text-green-800 mb-2">Usage with S. cerevisiae</h2>
            <p className="text-gray-700">{species.pairing}</p>
          </div>
        )}

        {/* Controversy (for Brett) */}
        {species.controversy && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">The Controversy</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-medium text-green-800 mb-2">Character View</h3>
                <p className="text-sm text-gray-700">{species.controversy.character_view}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h3 className="font-medium text-red-800 mb-2">Fault View</h3>
                <p className="text-sm text-gray-700">{species.controversy.fault_view}</p>
              </div>
            </div>
            {species.controversy.regional_tolerance && (
              <p className="text-sm text-gray-600 mt-4 bg-[#FAF7F2] rounded-lg p-3">
                <strong>Regional tolerance:</strong> {species.controversy.regional_tolerance}
              </p>
            )}
          </div>
        )}

        {/* Prevention (for Brett) */}
        {species.prevention && (
          <div className="bg-red-50 rounded-lg p-5 border border-red-200 mb-6">
            <h2 className="font-serif text-xl italic text-red-800 mb-3">Prevention</h2>
            <ul className="space-y-2">
              {species.prevention.map((p: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <span className="text-red-600">•</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Climate Change Relevance */}
        {species.climate_change_relevance && (
          <div className="bg-orange-50 rounded-lg p-5 border border-orange-200 mb-6">
            <h2 className="font-serif text-xl italic text-orange-800 mb-2">Climate Change Relevance</h2>
            <p className="text-gray-700">{species.climate_change_relevance}</p>
          </div>
        )}

        {/* Unique Metabolism */}
        {species.unique_metabolism && (
          <div className="bg-purple-50 rounded-lg p-5 border border-purple-200 mb-6">
            <h2 className="font-serif text-xl italic text-purple-800 mb-2">Unique Metabolism</h2>
            <p className="font-mono text-purple-900">{species.unique_metabolism}</p>
          </div>
        )}

        {/* Other Species */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Other Yeast Species</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {otherSpecies.map((other: any) => (
              <Link
                key={other.id}
                href={`/resources/yeast/species/${other.id}`}
                className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{other.icon}</span>
                  <div>
                    <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                      {other.name}
                    </h3>
                    <p className="text-xs text-gray-500">{other.common_name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/resources/yeast"
            className="inline-flex items-center text-[#722F37] hover:underline"
          >
            ← Back to Yeast Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
