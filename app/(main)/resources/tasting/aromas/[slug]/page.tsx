import Link from 'next/link';
import { notFound } from 'next/navigation';
import tastingData from '@/app/data/tasting.json';

export function generateStaticParams() {
  return tastingData.sections.aromas.compounds.map((compound) => ({
    slug: compound.id,
  }));
}

function AromaCategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    primary: 'bg-green-100 text-green-800 border-green-200',
    secondary: 'bg-purple-100 text-purple-800 border-purple-200',
    tertiary: 'bg-amber-100 text-amber-800 border-amber-200',
  };
  const icons: Record<string, string> = {
    primary: '🍇',
    secondary: '🧪',
    tertiary: '🛢️',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${colors[category] || colors.primary}`}>
      <span>{icons[category] || '🍇'}</span>
      {category.charAt(0).toUpperCase() + category.slice(1)} Aroma
    </span>
  );
}

function CategoryExplanation({ category }: { category: string }) {
  const explanations: Record<string, { source: string; description: string }> = {
    primary: {
      source: 'From the grape itself',
      description: 'Varietal character and terroir expression. These aromas are present in the grape and survive fermentation.',
    },
    secondary: {
      source: 'From fermentation and early winemaking',
      description: 'Yeast-derived aromas, malolactic fermentation byproducts, carbonic maceration characteristics.',
    },
    tertiary: {
      source: 'From aging (oak and/or bottle)',
      description: 'Oak influence, oxidative development, bottle bouquet. These develop over time.',
    },
  };

  const info = explanations[category] || explanations.primary;

  return (
    <div className="bg-[#FAF7F2] rounded-lg p-4 mb-6">
      <p className="text-sm text-gray-500 mb-1">{info.source}</p>
      <p className="text-gray-700">{info.description}</p>
    </div>
  );
}

export default async function AromaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const compound = tastingData.sections.aromas.compounds.find((c) => c.id === slug) as any;

  if (!compound) {
    notFound();
  }

  const otherCompounds = tastingData.sections.aromas.compounds
    .filter((c) => c.id !== slug)
    .slice(0, 6);

  const relatedByCategory = tastingData.sections.aromas.compounds
    .filter((c) => c.category === compound.category && c.id !== slug)
    .slice(0, 3);

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-[#722F37]">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources" className="text-gray-500 hover:text-[#722F37]">Resources</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources/tasting" className="text-gray-500 hover:text-[#722F37]">Tasting Science</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#1C1C1C]">{compound.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <AromaCategoryBadge category={compound.category} />
          <h1 className="font-serif text-4xl italic text-[#1C1C1C] mt-3">{compound.name}</h1>
          {compound.family && (
            <p className="text-gray-500 mt-1">Family: {compound.family}</p>
          )}
        </div>

        <CategoryExplanation category={compound.category} />

        {/* Aroma Description */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-6">
          <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Aroma Profile</h2>
          <p className="text-2xl text-[#1C1C1C] mb-4">{compound.aroma}</p>

          {compound.source && (
            <p className="text-gray-600 mb-4">
              <strong>Source:</strong> {compound.source}
            </p>
          )}
        </div>

        {/* Found In */}
        {compound.found_in && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Where You'll Find It</h2>
            <div className="flex flex-wrap gap-2">
              {compound.found_in.map((wine: string, i: number) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-[#722F37] text-white rounded-full text-sm"
                >
                  {wine}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Threshold */}
        {compound.threshold && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-6">
            <h2 className="font-serif text-xl italic text-amber-800 mb-3">Detection Threshold</h2>
            <p className="text-2xl font-mono text-amber-900">{compound.threshold}</p>
            <p className="text-sm text-amber-700 mt-2">
              This is the concentration at which most people can detect this compound.
            </p>
          </div>
        )}

        {/* Chemistry */}
        {compound.chemistry && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-3">The Chemistry</h2>
            <p className="text-gray-700 leading-relaxed">{compound.chemistry}</p>
          </div>
        )}

        {/* Subtypes */}
        {compound.subtypes && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Subtypes</h2>
            <div className="space-y-3">
              {compound.subtypes.map((subtype: any, i: number) => (
                <div key={i} className="bg-[#FAF7F2] rounded-lg p-4">
                  <h3 className="font-medium text-[#1C1C1C]">{subtype.name}</h3>
                  <p className="text-sm text-[#722F37]">{subtype.aroma}</p>
                  {subtype.note && (
                    <p className="text-xs text-gray-500 mt-1 italic">{subtype.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Note */}
        {compound.note && (
          <div className="bg-[#722F37]/5 border border-[#722F37]/20 rounded-lg p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Important Note</h2>
            <p className="text-gray-700">{compound.note}</p>
          </div>
        )}

        {/* Related Compounds by Category */}
        {relatedByCategory.length > 0 && (
          <div className="mb-8">
            <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">
              Other {compound.category.charAt(0).toUpperCase() + compound.category.slice(1)} Aromas
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedByCategory.map((other: any) => (
                <Link
                  key={other.id}
                  href={`/resources/tasting/aromas/${other.id}`}
                  className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
                >
                  <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                    {other.name}
                  </h3>
                  <p className="text-sm text-[#722F37] mt-1">{other.aroma}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Explore More */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Explore More Compounds</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {otherCompounds.map((other: any) => (
              <Link
                key={other.id}
                href={`/resources/tasting/aromas/${other.id}`}
                className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                    {other.name}
                  </h3>
                  <AromaCategoryBadge category={other.category} />
                </div>
                <p className="text-sm text-[#722F37] mt-2">{other.aroma}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/resources/tasting"
            className="inline-flex items-center text-[#722F37] hover:underline"
          >
            ← Back to Tasting Science Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
