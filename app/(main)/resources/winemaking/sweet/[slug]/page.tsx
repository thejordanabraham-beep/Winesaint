import { notFound } from 'next/navigation';
import Link from 'next/link';
import wmData from '@/app/data/winemaking.json';

export async function generateStaticParams() {
  const methods = wmData.sections.sweet.methods;
  return methods.map((m) => ({ slug: m.id }));
}

export default async function SweetDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const method = wmData.sections.sweet.methods.find((m) => m.id === slug);

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
        </div>

        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-6">
          <p className="text-gray-700 leading-relaxed mb-6">{data.description as string}</p>

          {data.sugar_levels && (
            <div className="mb-6 bg-[#FAF7F2] rounded-lg p-4">
              <p><strong>Sugar levels:</strong> {data.sugar_levels as string}</p>
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

          {data.methods && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Methods</h2>
              <div className="grid gap-3">
                {Object.entries(data.methods as Record<string, string>).map(([key, desc]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-3">
                    <p className="font-medium text-[#1C1C1C] capitalize">{key.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.regions && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Regions</h2>
              {typeof data.regions === 'object' ? (
                <div className="grid gap-3">
                  {Object.entries(data.regions as Record<string, string>).map(([region, wines]) => (
                    <div key={region} className="bg-[#FAF7F2] rounded-lg p-3">
                      <p className="font-medium text-[#1C1C1C] capitalize">{region.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-gray-600">{wines}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700">{data.regions as string}</p>
              )}
            </div>
          )}

          {data.character && (
            <div className="mb-6 bg-[#722F37]/5 border border-[#722F37]/20 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-[#722F37] mb-2">Character</h2>
              <p className="text-gray-700">{data.character as string}</p>
            </div>
          )}

          {data.challenges && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-amber-800 mb-2">Challenges</h2>
              <p className="text-gray-700">{data.challenges as string}</p>
            </div>
          )}

          {data.timing_affects_style && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Timing Effects</h2>
              <div className="grid gap-3">
                {Object.entries(data.timing_affects_style as Record<string, string>).map(([timing, effect]) => (
                  <div key={timing} className="bg-[#FAF7F2] rounded-lg p-3">
                    <p className="font-medium text-[#1C1C1C] capitalize">{timing.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-gray-600">{effect}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.examples && (
            <div className="bg-[#FAF7F2] rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-[#722F37] mb-2">Examples</h2>
              <p className="text-gray-700">{data.examples as string}</p>
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
