import Link from 'next/link';
import { notFound } from 'next/navigation';
import yeastData from '@/app/data/yeast.json';

export function generateStaticParams() {
  return yeastData.sections.strains.strains.map((strain) => ({
    slug: strain.id,
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
    <div className="flex flex-col gap-1">
      <span className="text-sm text-gray-600">Alcohol Tolerance</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-sm ${
              i <= level
                ? i <= 2 ? 'bg-green-500' : i <= 3 ? 'bg-yellow-500' : i <= 4 ? 'bg-orange-500' : 'bg-red-500'
                : 'bg-gray-200'
            }`}
          />
        ))}
        <span className="ml-2 font-medium text-[#1C1C1C]">{tolerance}</span>
      </div>
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const getColor = (c: string) => {
    if (c.toLowerCase().includes('neutral') || c.toLowerCase().includes('robust')) return 'bg-gray-100 text-gray-800 border-gray-300';
    if (c.toLowerCase().includes('aromatic')) return 'bg-purple-100 text-purple-800 border-purple-300';
    if (c.toLowerCase().includes('specialty')) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm border ${getColor(category)}`}>
      {category}
    </span>
  );
}

function FermentationSpeedIndicator({ speed }: { speed: string }) {
  const getColor = (s: string) => {
    if (s.toLowerCase().includes('fast')) return 'bg-green-100 text-green-800 border-green-200';
    if (s.toLowerCase().includes('slow')) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  return (
    <span className={`px-3 py-1 rounded text-sm border ${getColor(speed)}`}>
      {speed}
    </span>
  );
}

function NutrientNeedsIndicator({ needs }: { needs: string }) {
  const getColor = (n: string) => {
    if (n.toLowerCase().includes('low')) return 'bg-green-100 text-green-800';
    if (n.toLowerCase().includes('high')) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <span className={`px-3 py-1 rounded text-sm ${getColor(needs)}`}>
      {needs} nutrient needs
    </span>
  );
}

export default async function StrainDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const strain = yeastData.sections.strains.strains.find((s) => s.id === slug) as any;

  if (!strain) {
    notFound();
  }

  const otherStrains = yeastData.sections.strains.strains.filter((s) => s.id !== slug);

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
          <span className="text-[#1C1C1C]">{strain.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <span className="text-5xl">{strain.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{strain.name}</h1>
              <CategoryBadge category={strain.category} />
            </div>
            <p className="text-gray-500 mt-1">{strain.brand} | {strain.full_name}</p>
            <p className="text-sm text-gray-400">{strain.species}</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-6">
          <p className="text-gray-700 text-lg">{strain.description}</p>
          {strain.popularity && (
            <p className="text-sm text-[#722F37] mt-3 font-medium">{strain.popularity}</p>
          )}
        </div>

        {/* Origin */}
        <div className="bg-amber-50 rounded-lg p-5 border border-amber-200 mb-6">
          <h2 className="font-serif text-xl italic text-amber-800 mb-2">Origin</h2>
          <p className="text-gray-700">{strain.origin}</p>
        </div>

        {/* Key Metrics */}
        <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
          <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Fermentation Profile</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-[#FAF7F2] rounded-lg p-4">
              <AlcoholToleranceMeter tolerance={strain.alcohol_tolerance} />
            </div>
            <div className="bg-[#FAF7F2] rounded-lg p-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Temperature Range</span>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500 text-xl">🌡️</span>
                  <span className="font-medium text-[#1C1C1C]">{strain.temperature_range}</span>
                </div>
              </div>
            </div>
            <div className="bg-[#FAF7F2] rounded-lg p-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Fermentation Speed</span>
                <FermentationSpeedIndicator speed={strain.fermentation_speed} />
              </div>
            </div>
            <div className="bg-[#FAF7F2] rounded-lg p-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Nutrient Requirements</span>
                <NutrientNeedsIndicator needs={strain.nutrient_needs} />
              </div>
            </div>
          </div>
        </div>

        {/* Characteristics */}
        <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
          <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Characteristics</h2>
          <div className="grid gap-2 md:grid-cols-2">
            {strain.characteristics.map((char: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 bg-[#FAF7F2] rounded-lg p-3">
                <span className="text-[#722F37]">•</span>
                <span className="text-sm text-gray-700">{char}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Flavor Profile */}
        <div className="bg-[#722F37] text-white rounded-lg p-6 mb-6">
          <h2 className="font-serif text-xl italic mb-4">Flavor Profile</h2>
          <div className="space-y-3">
            <div>
              <p className="text-white/70 text-sm">Character</p>
              <p className="text-lg">{strain.flavor_profile.character}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm">Esters</p>
              <p className="text-lg">{strain.flavor_profile.esters}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm">Impact</p>
              <p className="text-lg">{strain.flavor_profile.impact}</p>
            </div>
          </div>
        </div>

        {/* Best For */}
        <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
          <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Best For</h2>
          <div className="flex flex-wrap gap-2">
            {strain.best_for.map((use: string, idx: number) => (
              <span key={idx} className="px-4 py-2 bg-[#FAF7F2] rounded-full text-sm font-medium">
                {use}
              </span>
            ))}
          </div>
        </div>

        {/* Wine Styles */}
        <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
          <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Recommended Wine Styles</h2>
          <div className="flex flex-wrap gap-2">
            {strain.wine_styles.map((style: string, idx: number) => (
              <span key={idx} className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm">
                {style}
              </span>
            ))}
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
          <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Technical Details</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="bg-[#FAF7F2] rounded-lg p-3">
              <p className="text-xs text-gray-500">SO2 Tolerance</p>
              <p className="font-medium">{strain.so2_tolerance}</p>
            </div>
            <div className="bg-[#FAF7F2] rounded-lg p-3">
              <p className="text-xs text-gray-500">Flocculation</p>
              <p className="font-medium">{strain.flocculation}</p>
            </div>
            {strain.killer_factor && (
              <div className="bg-[#FAF7F2] rounded-lg p-3">
                <p className="text-xs text-gray-500">Killer Factor</p>
                <p className="font-medium">{strain.killer_factor}</p>
              </div>
            )}
            {strain.thiol_release && (
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <p className="text-xs text-green-600">Thiol Release</p>
                <p className="font-medium text-green-800">{strain.thiol_release}</p>
              </div>
            )}
            {strain.malic_metabolism && (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-blue-600">Malic Acid Metabolism</p>
                <p className="font-medium text-blue-800">{strain.malic_metabolism}</p>
              </div>
            )}
            {strain.modern_breeding && (
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 md:col-span-2">
                <p className="text-xs text-purple-600">Breeding Method</p>
                <p className="font-medium text-purple-800">{strain.modern_breeding}</p>
              </div>
            )}
          </div>
        </div>

        {/* Caution */}
        {strain.caution && (
          <div className="bg-red-50 rounded-lg p-5 border border-red-200 mb-6">
            <h2 className="font-serif text-xl italic text-red-800 mb-2">Caution</h2>
            <p className="text-gray-700">{strain.caution}</p>
          </div>
        )}

        {/* Other Strains */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Other Commercial Strains</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {otherStrains.slice(0, 6).map((other: any) => (
              <Link
                key={other.id}
                href={`/resources/yeast/strains/${other.id}`}
                className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{other.icon}</span>
                  <div>
                    <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                      {other.name}
                    </h3>
                    <p className="text-xs text-gray-500">{other.brand}</p>
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
