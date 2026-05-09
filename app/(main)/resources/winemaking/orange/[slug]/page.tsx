import { notFound } from 'next/navigation';
import Link from 'next/link';
import wmData from '@/app/data/winemaking.json';

export async function generateStaticParams() {
  const techniques = wmData.sections.orange.techniques;
  return techniques.map((t) => ({ slug: t.id }));
}

export default async function OrangeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const technique = wmData.sections.orange.techniques.find((t) => t.id === slug);

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

          {data.duration && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Maceration Duration</h2>
              <div className="grid gap-3">
                {Object.entries(data.duration as Record<string, string>).map(([level, time]) => (
                  <div key={level} className="bg-[#FAF7F2] rounded-lg p-3">
                    <p className="font-medium text-[#1C1C1C] capitalize">{level}</p>
                    <p className="text-sm text-gray-600">{time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.options && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Vessel Options</h2>
              <div className="grid gap-4">
                {Object.entries(data.options as Record<string, Record<string, string>>).map(([key, option]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-4">
                    <h3 className="font-medium text-[#1C1C1C] capitalize mb-1">{key}</h3>
                    <p className="text-sm text-gray-700">{option.description}</p>
                    <p className="text-sm text-gray-500 mt-1"><strong>Effect:</strong> {option.effect}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          {data.pioneers && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Pioneers</h2>
              <ul className="space-y-2">
                {(data.pioneers as string[]).map((pioneer, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#722F37]">•</span>
                    <span className="text-gray-700">{pioneer}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.pairings && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Food Pairings</h2>
              <div className="flex flex-wrap gap-2">
                {(data.pairings as string[]).map((pairing, i) => (
                  <span key={i} className="bg-[#FAF7F2] px-3 py-1 rounded-full text-sm border border-[#1C1C1C]/10">{pairing}</span>
                ))}
              </div>
            </div>
          )}

          {data.serving && (
            <div className="mb-6 bg-[#FAF7F2] rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-[#722F37] mb-2">Serving</h2>
              <p className="text-gray-700">{data.serving as string}</p>
            </div>
          )}

          {data.unesco && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-gray-700">{data.unesco as string}</p>
            </div>
          )}

          {data.character && (
            <div className="bg-[#722F37]/5 border border-[#722F37]/20 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-[#722F37] mb-2">Character</h2>
              <p className="text-gray-700">{data.character as string}</p>
            </div>
          )}

          {data.spread && (
            <div className="bg-[#FAF7F2] rounded-lg p-4">
              <p className="text-gray-700">{data.spread as string}</p>
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
