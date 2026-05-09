import { notFound } from 'next/navigation';
import Link from 'next/link';
import wmData from '@/app/data/winemaking.json';

export async function generateStaticParams() {
  const techniques = wmData.sections.mlf.techniques;
  return techniques.map((t) => ({ slug: t.id }));
}

export default async function MLFDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const technique = wmData.sections.mlf.techniques.find((t) => t.id === slug);

  if (!technique) notFound();

  const data = technique as Record<string, unknown>;

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-[#722F37]">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources" className="text-gray-500 hover:text-[#722F37]">Resources</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources/winemaking" className="text-gray-500 hover:text-[#722F37]">Winemaking</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#1C1C1C]">{data.name as string}</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{data.name as string}</h1>
        </div>

        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-6">
          <p className="text-gray-700 leading-relaxed mb-6">{data.description as string}</p>

          {data.equation && (
            <div className="mb-6 bg-[#FAF7F2] rounded-lg p-4 text-center">
              <p className="font-mono text-lg">{data.equation as string}</p>
            </div>
          )}

          {data.effects && Array.isArray(data.effects) && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Effects</h2>
              <ul className="space-y-2">
                {(data.effects as string[]).map((effect, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#722F37]">•</span>
                    <span className="text-gray-700">{effect}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.methods && Array.isArray(data.methods) && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Methods</h2>
              <ul className="space-y-2">
                {(data.methods as string[]).map((method, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-gray-700">{method}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.wines_that_benefit && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-green-800 mb-2">Wines That Benefit</h2>
              <div className="flex flex-wrap gap-2">
                {(data.wines_that_benefit as string[]).map((wine, i) => (
                  <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">{wine}</span>
                ))}
              </div>
            </div>
          )}

          {data.wines_that_skip && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-blue-800 mb-2">Wines That Skip MLF</h2>
              <div className="flex flex-wrap gap-2">
                {(data.wines_that_skip as string[]).map((wine, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{wine}</span>
                ))}
              </div>
            </div>
          )}

          {data.controlling_levels && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Controlling Diacetyl Levels</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(data.controlling_levels as Record<string, string>).map(([key, value]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-4">
                    <h3 className="font-medium text-[#1C1C1C] capitalize mb-1">{key.replace(/_/g, ' ')}</h3>
                    <p className="text-sm text-gray-700">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.regional_preferences && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Regional Preferences</h2>
              <div className="grid gap-3">
                {Object.entries(data.regional_preferences as Record<string, string>).map(([region, pref]) => (
                  <div key={region} className="bg-[#FAF7F2] rounded-lg p-3">
                    <p className="font-medium text-[#1C1C1C] capitalize">{region.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-gray-600">{pref}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.chemistry && (
            <div className="bg-[#FAF7F2] rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-[#722F37] mb-2">Chemistry</h2>
              <p className="text-gray-700">{data.chemistry as string}</p>
            </div>
          )}
        </div>

        <Link href="/resources/winemaking" className="text-[#722F37] hover:underline">
          ← Back to Winemaking Guide
        </Link>
      </div>
    </div>
  );
}
