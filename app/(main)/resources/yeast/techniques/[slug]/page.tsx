import Link from 'next/link';
import { notFound } from 'next/navigation';
import yeastData from '@/app/data/yeast.json';

export function generateStaticParams() {
  return yeastData.sections.techniques.techniques.map((technique) => ({
    slug: technique.id,
  }));
}

function RiskBadge({ level }: { level: string }) {
  const getColor = (l: string) => {
    if (l.toLowerCase() === 'high') return 'bg-red-100 text-red-800 border-red-200';
    if (l.toLowerCase() === 'low') return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm border ${getColor(level)}`}>
      {level} Risk
    </span>
  );
}

export default async function TechniqueDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const technique = yeastData.sections.techniques.techniques.find((t) => t.id === slug) as any;

  if (!technique) {
    notFound();
  }

  const otherTechniques = yeastData.sections.techniques.techniques.filter((t) => t.id !== slug);

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
          <span className="text-[#1C1C1C]">{technique.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <span className="text-5xl">{technique.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{technique.name}</h1>
              {technique.risk_level && <RiskBadge level={technique.risk_level} />}
            </div>
            <p className="text-gray-500 mt-1">Fermentation Technique</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-6">
          <p className="text-gray-700 text-lg">{technique.description}</p>
        </div>

        {/* Process */}
        {technique.process && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Process</h2>
            <ol className="space-y-3">
              {technique.process.map((step: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#722F37] text-white text-sm flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Advantages */}
        {technique.advantages && (
          <div className="bg-green-50 rounded-lg p-5 border border-green-200 mb-6">
            <h2 className="font-serif text-xl italic text-green-800 mb-4">Advantages</h2>
            <ul className="space-y-2">
              {technique.advantages.map((adv: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-600">✓</span>
                  {adv}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disadvantages */}
        {technique.disadvantages && (
          <div className="bg-red-50 rounded-lg p-5 border border-red-200 mb-6">
            <h2 className="font-serif text-xl italic text-red-800 mb-4">Disadvantages</h2>
            <ul className="space-y-2">
              {technique.disadvantages.map((dis: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <span className="text-red-600">✗</span>
                  {dis}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Characteristics (for carbonic maceration) */}
        {technique.characteristics && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Characteristics</h2>
            <div className="grid gap-2 md:grid-cols-2">
              {technique.characteristics.map((char: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 bg-[#FAF7F2] rounded-lg p-3">
                  <span className="text-[#722F37]">•</span>
                  <span className="text-sm text-gray-700">{char}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compounds Released (for sur lie) */}
        {technique.compounds_released && (
          <div className="bg-purple-50 rounded-lg p-5 border border-purple-200 mb-6">
            <h2 className="font-serif text-xl italic text-purple-800 mb-4">Compounds Released</h2>
            <div className="grid gap-2 md:grid-cols-2">
              {technique.compounds_released.map((compound: string, idx: number) => (
                <div key={idx} className="bg-white rounded-lg p-3 border border-purple-100">
                  <span className="text-gray-700">{compound}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Who Uses */}
        {technique.who_uses && (
          <div className="bg-[#722F37] text-white rounded-lg p-6 mb-6">
            <h2 className="font-serif text-xl italic mb-3">Who Uses This</h2>
            <p className="text-white/90">{technique.who_uses}</p>
          </div>
        )}

        {/* Wine Styles */}
        {technique.styles && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Wine Styles</h2>
            <p className="text-gray-700">{technique.styles}</p>
          </div>
        )}

        {/* Grape Varieties */}
        {technique.grape_varieties && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h2 className="font-serif text-xl italic text-[#722F37] mb-4">Grape Varieties</h2>
            <p className="text-gray-700">{technique.grape_varieties}</p>
          </div>
        )}

        {/* Duration */}
        {technique.duration && (
          <div className="bg-amber-50 rounded-lg p-5 border border-amber-200 mb-6">
            <h2 className="font-serif text-xl italic text-amber-800 mb-2">Duration</h2>
            <p className="text-gray-700">{technique.duration}</p>
          </div>
        )}

        {/* Other Techniques */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Other Fermentation Techniques</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {otherTechniques.map((other: any) => (
              <Link
                key={other.id}
                href={`/resources/yeast/techniques/${other.id}`}
                className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{other.icon}</span>
                  <div>
                    <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                      {other.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{other.description}</p>
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
