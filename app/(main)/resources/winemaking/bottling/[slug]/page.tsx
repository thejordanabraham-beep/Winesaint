import { notFound } from 'next/navigation';
import Link from 'next/link';
import wmData from '@/app/data/winemaking.json';

export async function generateStaticParams() {
  const techniques = wmData.sections.bottling.techniques;
  return techniques.map((t) => ({ slug: t.id }));
}

export default async function BottlingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const technique = wmData.sections.bottling.techniques.find((t) => t.id === slug);

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

          {data.considerations && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Considerations</h2>
              <ul className="space-y-2">
                {(data.considerations as string[]).map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#722F37]">•</span>
                    <span className="text-gray-700">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.typical_timing && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Typical Timing</h2>
              <div className="grid gap-3">
                {Object.entries(data.typical_timing as Record<string, string>).map(([wine, time]) => (
                  <div key={wine} className="bg-[#FAF7F2] rounded-lg p-3 flex justify-between items-center">
                    <span className="font-medium text-[#1C1C1C] capitalize">{wine.replace(/_/g, ' ')}</span>
                    <span className="text-sm text-gray-600">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.types && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Closure Types</h2>
              <div className="grid gap-4">
                {Object.entries(data.types as Record<string, Record<string, unknown>>).map(([key, type]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-4">
                    <h3 className="font-medium text-[#1C1C1C] mb-2">{type.description as string}</h3>
                    {type.advantages && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-green-700">Advantages:</p>
                        <ul className="text-sm text-gray-600">
                          {(type.advantages as string[]).map((a, i) => <li key={i}>+ {a}</li>)}
                        </ul>
                      </div>
                    )}
                    {type.disadvantages && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-red-700">Disadvantages:</p>
                        <ul className="text-sm text-gray-600">
                          {(type.disadvantages as string[]).map((d, i) => <li key={i}>- {d}</li>)}
                        </ul>
                      </div>
                    )}
                    {type.aging && <p className="text-sm text-gray-500 mt-2"><strong>Aging:</strong> {type.aging as string}</p>}
                    {type.use && <p className="text-sm text-gray-500 mt-1"><strong>Use:</strong> {type.use as string}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.steps && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Bottling Line Steps</h2>
              <ol className="space-y-2">
                {(data.steps as string[]).map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#722F37] text-white flex items-center justify-center text-sm">
                      {i + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {data.critical_factors && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Critical Factors</h2>
              <div className="grid gap-3">
                {Object.entries(data.critical_factors as Record<string, string>).map(([factor, desc]) => (
                  <div key={factor} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="font-medium text-amber-800 capitalize">{factor}</p>
                    <p className="text-sm text-gray-700">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.cause && (
            <div className="mb-6 bg-[#FAF7F2] rounded-lg p-4">
              <p><strong>Cause:</strong> {data.cause as string}</p>
              {data.duration && <p className="mt-2"><strong>Duration:</strong> {data.duration as string}</p>}
            </div>
          )}

          {data.recommendation && (
            <div className="bg-[#722F37]/5 border border-[#722F37]/20 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-[#722F37] mb-2">Recommendation</h2>
              <p className="text-gray-700">{data.recommendation as string}</p>
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
