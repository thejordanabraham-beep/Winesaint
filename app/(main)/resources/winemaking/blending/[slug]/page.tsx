import { notFound } from 'next/navigation';
import Link from 'next/link';
import wmData from '@/app/data/winemaking.json';

export async function generateStaticParams() {
  const techniques = wmData.sections.blending.techniques;
  return techniques.map((t) => ({ slug: t.id }));
}

export default async function BlendingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const technique = wmData.sections.blending.techniques.find((t) => t.id === slug);

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

          {data.famous_blends && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Famous Blends</h2>
              <div className="grid gap-4">
                {Object.entries(data.famous_blends as Record<string, Record<string, unknown>>).map(([key, blend]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-4">
                    <h3 className="font-medium text-[#1C1C1C] capitalize mb-2">{key.replace(/_/g, ' ')}</h3>
                    {blend.varieties && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {(Array.isArray(blend.varieties) ? blend.varieties : [blend.varieties]).map((v: string, i: number) => (
                          <span key={i} className="bg-[#722F37]/10 text-[#722F37] px-2 py-1 rounded text-sm">{v}</span>
                        ))}
                      </div>
                    )}
                    {blend.rationale && <p className="text-sm text-gray-600">{blend.rationale as string}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.reasons && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Reasons for Blending</h2>
              <ul className="space-y-2">
                {(data.reasons as string[]).map((reason, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#722F37]">•</span>
                    <span className="text-gray-700">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.examples && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Examples</h2>
              <div className="grid gap-3">
                {Object.entries(data.examples as Record<string, string>).map(([key, desc]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-3">
                    <p className="font-medium text-[#1C1C1C] capitalize">{key.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.process && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Process</h2>
              {Array.isArray(data.process) ? (
                <ol className="space-y-3">
                  {(data.process as string[]).map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#722F37] text-white flex items-center justify-center text-sm">
                        {i + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-700">{data.process as string}</p>
              )}
            </div>
          )}

          {data.considerations && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-amber-800 mb-2">Considerations</h2>
              <p className="text-gray-700">{data.considerations as string}</p>
            </div>
          )}

          {data.goal && (
            <div className="bg-[#722F37]/5 border border-[#722F37]/20 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-[#722F37] mb-2">Goal</h2>
              <p className="text-gray-700">{data.goal as string}</p>
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
