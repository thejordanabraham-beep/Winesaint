import { notFound } from 'next/navigation';
import Link from 'next/link';
import wmData from '@/app/data/winemaking.json';

export async function generateStaticParams() {
  const methods = wmData.sections.sparkling.methods;
  return methods.map((m) => ({ slug: m.id }));
}

export default async function SparklingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const method = wmData.sections.sparkling.methods.find((m) => m.id === slug);

  if (!method) notFound();

  const data = method as Record<string, unknown>;

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
          {data.aka && (
            <p className="text-gray-500 mt-1">Also known as: {(data.aka as string[]).join(', ')}</p>
          )}
        </div>

        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-6">
          <p className="text-gray-700 leading-relaxed mb-6">{data.description as string}</p>

          {data.process && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Process</h2>
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
            </div>
          )}

          {data.lees_aging_effects && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Lees Aging Effects</h2>
              <ul className="space-y-2">
                {(data.lees_aging_effects as string[]).map((effect, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#722F37]">•</span>
                    <span className="text-gray-700">{effect}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.characteristics && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Characteristics</h2>
              {Array.isArray(data.characteristics) ? (
                <ul className="space-y-2">
                  {(data.characteristics as string[]).map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#722F37]">•</span>
                      <span className="text-gray-700">{c}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">{data.characteristics as string}</p>
              )}
            </div>
          )}

          {data.advantages && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-green-800 mb-2">Advantages</h2>
              <p className="text-gray-700">{data.advantages as string}</p>
            </div>
          )}

          {data.disadvantages && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-red-800 mb-2">Disadvantages</h2>
              <p className="text-gray-700">{data.disadvantages as string}</p>
            </div>
          )}

          {data.regions && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Regions</h2>
              <p className="text-gray-700">{data.regions as string}</p>
            </div>
          )}

          {data.trend && (
            <div className="bg-[#722F37]/5 border border-[#722F37]/20 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-[#722F37] mb-2">Current Trend</h2>
              <p className="text-gray-700">{data.trend as string}</p>
            </div>
          )}

          {data.use && (
            <div className="bg-[#FAF7F2] rounded-lg p-4">
              <p className="text-gray-700">{data.use as string}</p>
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
