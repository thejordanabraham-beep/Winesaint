import { notFound } from 'next/navigation';
import Link from 'next/link';
import wmData from '@/app/data/winemaking.json';

export async function generateStaticParams() {
  const techniques = wmData.sections.fermentation.techniques;
  return techniques.map((t) => ({ slug: t.id }));
}

export default async function FermentationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const technique = wmData.sections.fermentation.techniques.find((t) => t.id === slug);

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

          {data.stages && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Fermentation Stages</h2>
              <div className="grid gap-3">
                {Object.entries(data.stages as Record<string, string>).map(([stage, desc]) => (
                  <div key={stage} className="bg-[#FAF7F2] rounded-lg p-3">
                    <p className="font-medium text-[#1C1C1C] capitalize">{stage.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.options && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Options</h2>
              <div className="grid gap-4">
                {Object.entries(data.options as Record<string, Record<string, unknown>>).map(([key, option]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-4">
                    <h3 className="font-medium text-[#1C1C1C] mb-2">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                    {option.description && <p className="text-sm text-gray-700 mb-2">{option.description as string}</p>}
                    {option.advantages && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-green-700">Advantages:</p>
                        <ul className="text-sm text-gray-600">
                          {(option.advantages as string[]).map((a, i) => <li key={i}>• {a}</li>)}
                        </ul>
                      </div>
                    )}
                    {option.disadvantages && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-red-700">Disadvantages:</p>
                        <ul className="text-sm text-gray-600">
                          {(option.disadvantages as string[]).map((d, i) => <li key={i}>• {d}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.effects && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Effects</h2>
              <div className="grid gap-4">
                {Object.entries(data.effects as Record<string, Record<string, string>>).map(([key, effect]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-4">
                    <h3 className="font-medium text-[#1C1C1C] capitalize mb-2">{key.replace(/_/g, ' ')}</h3>
                    {effect.range && <p className="text-sm"><strong>Temperature:</strong> {effect.range}</p>}
                    {effect.effect && <p className="text-sm text-gray-700">{effect.effect}</p>}
                    {effect.risks && <p className="text-sm text-red-600"><strong>Risks:</strong> {effect.risks}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.techniques && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Techniques</h2>
              <div className="grid gap-4">
                {Object.entries(data.techniques as Record<string, Record<string, unknown>>).map(([key, tech]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-4">
                    <h3 className="font-medium text-[#1C1C1C] mb-1">{tech.name as string || key}</h3>
                    <p className="text-sm text-gray-700">{tech.description as string}</p>
                    {tech.effect && <p className="text-sm text-gray-500 mt-1"><strong>Effect:</strong> {tech.effect as string}</p>}
                    {tech.frequency && <p className="text-sm text-gray-500"><strong>Frequency:</strong> {tech.frequency as string}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.byproducts && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Byproducts</h2>
              <div className="flex flex-wrap gap-2">
                {(data.byproducts as string[]).map((b, i) => (
                  <span key={i} className="bg-[#FAF7F2] px-3 py-1 rounded-full text-sm">{b}</span>
                ))}
              </div>
            </div>
          )}

          {data.temperature && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p><strong>Temperature:</strong> {data.temperature as string}</p>
            </div>
          )}

          {data.duration && (
            <div className="mb-6 bg-[#FAF7F2] rounded-lg p-4">
              <p><strong>Duration:</strong> {data.duration as string}</p>
            </div>
          )}

          {data.effect && (
            <div className="bg-[#722F37]/5 border border-[#722F37]/20 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-[#722F37] mb-2">Effect on Wine</h2>
              <p className="text-gray-700">{data.effect as string}</p>
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
