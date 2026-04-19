import Link from 'next/link';
import { notFound } from 'next/navigation';
import oakData from '@/app/data/oak.json';

export function generateStaticParams() {
  return oakData.sections.toast_levels.levels.map((level) => ({
    slug: level.id,
  }));
}

function ToastMeter({ currentLevel }: { currentLevel: string }) {
  const levels = ['light', 'medium', 'medium-plus', 'heavy'];
  const currentIdx = levels.indexOf(currentLevel);

  return (
    <div className="flex items-center gap-1">
      {levels.map((level, idx) => (
        <div
          key={level}
          className={`h-8 flex-1 rounded transition-colors ${
            idx <= currentIdx
              ? idx === 0 ? 'bg-amber-200'
              : idx === 1 ? 'bg-amber-400'
              : idx === 2 ? 'bg-amber-600'
              : 'bg-amber-900'
              : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

function CompoundBar({ label, level }: { label: string; level: 'high' | 'moderate' | 'low' | 'very-low' }) {
  const widths = {
    'high': 'w-full',
    'moderate': 'w-2/3',
    'low': 'w-1/3',
    'very-low': 'w-1/6',
  };

  return (
    <div className="flex items-center gap-3">
      <span className="w-32 text-sm text-gray-600">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-3">
        <div className={`${widths[level]} bg-[#722F37] h-full rounded-full`} />
      </div>
    </div>
  );
}

export default async function ToastDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const level = oakData.sections.toast_levels.levels.find((l) => l.id === slug);

  if (!level) {
    notFound();
  }

  // Determine compound levels based on toast level
  const getCompoundLevels = (toastId: string) => {
    const compounds: Record<string, Record<string, 'high' | 'moderate' | 'low' | 'very-low'>> = {
      'light': { lactones: 'high', ellagitannins: 'high', vanillin: 'moderate', furfural: 'low', guaiacol: 'very-low' },
      'medium': { lactones: 'moderate', ellagitannins: 'moderate', vanillin: 'high', furfural: 'moderate', guaiacol: 'low' },
      'medium-plus': { lactones: 'low', ellagitannins: 'low', vanillin: 'high', furfural: 'high', guaiacol: 'moderate' },
      'heavy': { lactones: 'very-low', ellagitannins: 'very-low', vanillin: 'moderate', furfural: 'high', guaiacol: 'high' },
    };
    return compounds[toastId] || compounds['medium'];
  };

  const compoundLevels = getCompoundLevels(slug);

  // Get other toast levels for comparison
  const otherLevels = oakData.sections.toast_levels.levels.filter((l) => l.id !== slug);

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
          <span className="text-[#1C1C1C]">{level.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{level.name}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-gray-600">
            <span>{level.temperature_f} / {level.temperature_c}</span>
            <span>•</span>
            <span>{level.duration}</span>
          </div>
        </div>

        {/* Toast Meter */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-8">
          <h2 className="text-sm font-medium text-gray-500 mb-3">Toast Intensity</h2>
          <ToastMeter currentLevel={slug} />
          <p className="mt-4 text-gray-600">
            {level.wood_appearance}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-8">
          {/* Characteristics */}
          <div className="mb-8">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Characteristics</h2>
            <ul className="space-y-3">
              {level.characteristics.map((char, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#722F37] rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{char}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Flavor Compounds */}
          <div className="mb-8">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Flavor Compounds</h2>
            <div className="flex flex-wrap gap-2">
              {level.flavor_compounds.map((compound, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-[#FAF7F2] rounded-full border border-[#1C1C1C]/20 text-[#1C1C1C]"
                >
                  {compound}
                </span>
              ))}
            </div>
          </div>

          {/* Compound Levels Chart */}
          <div className="mb-8 bg-[#FAF7F2] rounded-lg p-5">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Compound Intensity at {level.name}</h2>
            <div className="space-y-3">
              <CompoundBar label="Oak Lactones" level={compoundLevels.lactones} />
              <CompoundBar label="Ellagitannins" level={compoundLevels.ellagitannins} />
              <CompoundBar label="Vanillin" level={compoundLevels.vanillin} />
              <CompoundBar label="Furfural" level={compoundLevels.furfural} />
              <CompoundBar label="Guaiacol" level={compoundLevels.guaiacol} />
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Relative concentration at this toast level. Higher toast reduces lactones/tannins, increases smoke compounds.
            </p>
          </div>

          {/* Ellagitannins */}
          <div className="mb-8">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Ellagitannin Level</h2>
            <p className="text-gray-700">{level.ellagitannins}</p>
          </div>

          {/* Best For */}
          <div className="bg-amber-50 rounded-lg p-5 border border-amber-200">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Best Used For</h2>
            <p className="text-gray-700">{level.best_for}</p>
          </div>
        </div>

        {/* Compare Toast Levels */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Compare Toast Levels</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {otherLevels.map((other) => (
              <Link
                key={other.id}
                href={`/resources/oak/toast/${other.id}`}
                className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
              >
                <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                  {other.name}
                </h3>
                <p className="text-sm text-gray-500">{other.temperature_f}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {other.flavor_compounds.slice(0, 3).map((f, i) => (
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
