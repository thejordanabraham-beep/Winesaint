import { notFound } from 'next/navigation';
import Link from 'next/link';
import wmData from '@/app/data/winemaking.json';

export async function generateStaticParams() {
  const stages = wmData.sections.reception.stages;
  return stages.map((stage) => ({ slug: stage.id }));
}

export default async function ReceptionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stage = wmData.sections.reception.stages.find((s) => s.id === slug);

  if (!stage) notFound();

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
          <span className="text-[#1C1C1C]">{stage.name}</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{stage.name}</h1>
        </div>

        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-6">
          <p className="text-gray-700 leading-relaxed mb-6">{stage.description}</p>

          {stage.considerations && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Considerations</h2>
              <ul className="space-y-2">
                {stage.considerations.map((c: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#722F37]">•</span>
                    <span className="text-gray-700">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stage.methods && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Methods</h2>
              <div className="grid gap-4">
                {Object.entries(stage.methods as Record<string, { description: string; advantages?: string[]; disadvantages?: string[] }>).map(([key, method]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-4">
                    <h3 className="font-medium text-[#1C1C1C] capitalize mb-2">{key.replace(/_/g, ' ')}</h3>
                    <p className="text-sm text-gray-700 mb-2">{method.description}</p>
                    {method.advantages && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-green-700">Advantages:</p>
                        <p className="text-sm text-gray-600">{method.advantages.join(', ')}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage.options && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Options</h2>
              <div className="grid gap-4">
                {Object.entries(stage.options as Record<string, { description: string; effect: string }>).map(([key, option]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-4">
                    <h3 className="font-medium text-[#1C1C1C] capitalize mb-1">{key.replace(/_/g, ' ')}</h3>
                    <p className="text-sm text-gray-700">{option.description}</p>
                    <p className="text-sm text-gray-500 mt-1"><strong>Effect:</strong> {option.effect}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage.regional_traditions && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Regional Traditions</h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(stage.regional_traditions as Record<string, string>).map(([region, tradition]) => (
                  <div key={region} className="bg-[#FAF7F2] rounded-lg p-3">
                    <p className="font-medium text-[#1C1C1C] capitalize">{region}</p>
                    <p className="text-sm text-gray-600">{tradition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage.best_practice && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-green-800 mb-2">Best Practice</h2>
              <p className="text-gray-700">{stage.best_practice}</p>
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
