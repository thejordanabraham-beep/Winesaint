import { notFound } from 'next/navigation';
import Link from 'next/link';
import wmData from '@/app/data/winemaking.json';

export async function generateStaticParams() {
  const techniques = wmData.sections.aging.techniques;
  return techniques.map((t) => ({ slug: t.id }));
}

export default async function AgingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const technique = wmData.sections.aging.techniques.find((t) => t.id === slug);

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

          {data.duration && typeof data.duration === 'object' && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Duration</h2>
              <div className="grid gap-3">
                {Object.entries(data.duration as Record<string, string>).map(([key, value]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-3">
                    <p className="font-medium text-[#1C1C1C] capitalize">{key.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-gray-600">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.advantages && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Advantages</h2>
              <ul className="space-y-2">
                {(data.advantages as string[]).map((adv, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600">+</span>
                    <span className="text-gray-700">{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.vessels && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Vessel Types</h2>
              <div className="grid gap-3">
                {Object.entries(data.vessels as Record<string, string>).map(([vessel, desc]) => (
                  <div key={vessel} className="bg-[#FAF7F2] rounded-lg p-3">
                    <p className="font-medium text-[#1C1C1C] capitalize">{vessel}</p>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.batonnage && (
            <div className="mb-6 bg-[#FAF7F2] rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-[#722F37] mb-2">Batonnage (Lees Stirring)</h2>
              <p className="text-gray-700 mb-2">{(data.batonnage as Record<string, string>).description}</p>
              <p className="text-sm text-gray-600"><strong>Frequency:</strong> {(data.batonnage as Record<string, string>).frequency}</p>
              <p className="text-sm text-gray-600"><strong>Effect:</strong> {(data.batonnage as Record<string, string>).effect}</p>
            </div>
          )}

          {data.examples && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Examples</h2>
              <div className="grid gap-3">
                {Object.entries(data.examples as Record<string, string>).map(([style, desc]) => (
                  <div key={style} className="bg-[#FAF7F2] rounded-lg p-3">
                    <p className="font-medium text-[#1C1C1C] capitalize">{style.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.timeline && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Aging Timeline</h2>
              <div className="grid gap-3">
                {Object.entries(data.timeline as Record<string, string>).map(([category, time]) => (
                  <div key={category} className="bg-[#FAF7F2] rounded-lg p-3">
                    <p className="font-medium text-[#1C1C1C] capitalize">{category.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-gray-600">{time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.wines && (
            <div className="bg-[#722F37]/5 border border-[#722F37]/20 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-[#722F37] mb-2">Common Wines</h2>
              {Array.isArray(data.wines) ? (
                <div className="flex flex-wrap gap-2">
                  {(data.wines as string[]).map((wine, i) => (
                    <span key={i} className="bg-white px-3 py-1 rounded-full text-sm border border-[#722F37]/20">{wine}</span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700">{data.wines as string}</p>
              )}
            </div>
          )}

          {data.cross_reference && (
            <div className="mt-6">
              <Link
                href={data.cross_reference as string}
                className="inline-flex items-center gap-2 bg-[#722F37] text-white px-4 py-2 rounded-lg hover:bg-[#5a252c] transition-colors"
              >
                Learn more in the Oak Guide →
              </Link>
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
