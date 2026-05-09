import { notFound } from 'next/navigation';
import Link from 'next/link';
import wmData from '@/app/data/winemaking.json';

export async function generateStaticParams() {
  const techniques = wmData.sections.clarification.techniques;
  return techniques.map((t) => ({ slug: t.id }));
}

export default async function ClarificationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const technique = wmData.sections.clarification.techniques.find((t) => t.id === slug);

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

          {data.method && (
            <div className="mb-6 bg-[#FAF7F2] rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-[#722F37] mb-2">Method</h2>
              <p className="text-gray-700">{data.method as string}</p>
            </div>
          )}

          {data.duration && (
            <div className="mb-6 bg-[#FAF7F2] rounded-lg p-4">
              <p><strong>Duration:</strong> {data.duration as string}</p>
            </div>
          )}

          {data.agents && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Fining Agents</h2>
              <div className="grid gap-4">
                {Object.entries(data.agents as Record<string, Record<string, string>>).map(([key, agent]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-4">
                    <h3 className="font-medium text-[#1C1C1C] capitalize mb-1">{key.replace(/_/g, ' ')}</h3>
                    <p className="text-sm text-gray-500 mb-1"><strong>Source:</strong> {agent.source}</p>
                    <p className="text-sm text-gray-700 mb-1"><strong>Removes:</strong> {agent.removes}</p>
                    <p className="text-sm text-gray-600">{agent.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.types && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Filtration Types</h2>
              <div className="grid gap-4">
                {Object.entries(data.types as Record<string, Record<string, string>>).map(([key, type]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-4">
                    <h3 className="font-medium text-[#1C1C1C] mb-1">{type.name}</h3>
                    {type.pore_size && <p className="text-sm text-gray-500"><strong>Pore size:</strong> {type.pore_size}</p>}
                    {type.removes && <p className="text-sm text-gray-700"><strong>Removes:</strong> {type.removes}</p>}
                    {type.description && <p className="text-sm text-gray-700">{type.description}</p>}
                    {type.effect && <p className="text-sm text-gray-600 mt-1">{type.effect}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.advantages && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-green-800 mb-2">Advantages</h2>
              <ul className="space-y-1">
                {(data.advantages as string[]).map((adv, i) => (
                  <li key={i} className="text-gray-700 flex items-start gap-2">
                    <span className="text-green-600">+</span>
                    {adv}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.disadvantages && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-red-800 mb-2">Disadvantages</h2>
              <ul className="space-y-1">
                {(data.disadvantages as string[]).map((dis, i) => (
                  <li key={i} className="text-gray-700 flex items-start gap-2">
                    <span className="text-red-600">-</span>
                    {dis}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.rationale && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Rationale</h2>
              <ul className="space-y-2">
                {(data.rationale as string[]).map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#722F37]">•</span>
                    <span className="text-gray-700">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.risks && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-amber-800 mb-2">Risks</h2>
              <ul className="space-y-1">
                {(data.risks as string[]).map((risk, i) => (
                  <li key={i} className="text-gray-700 flex items-start gap-2">
                    <span className="text-amber-600">!</span>
                    {risk}
                  </li>
                ))}
              </ul>
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
