import { notFound } from 'next/navigation';
import Link from 'next/link';
import wmData from '@/app/data/winemaking.json';

export async function generateStaticParams() {
  const techniques = wmData.sections.pressing.techniques;
  return techniques.map((t) => ({ slug: t.id }));
}

export default async function PressingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const technique = wmData.sections.pressing.techniques.find((t) => t.id === slug);

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

          {data.options && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Options</h2>
              <div className="grid gap-4">
                {Object.entries(data.options as Record<string, Record<string, string>>).map(([key, option]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-4">
                    <h3 className="font-medium text-[#1C1C1C] mb-1">{option.name || key.replace(/_/g, ' ')}</h3>
                    <p className="text-sm text-gray-700">{option.description}</p>
                    {option.effect && <p className="text-sm text-gray-500 mt-1"><strong>Effect:</strong> {option.effect}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.types && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Press Types</h2>
              <div className="grid gap-4">
                {Object.entries(data.types as Record<string, Record<string, unknown>>).map(([key, type]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-4">
                    <h3 className="font-medium text-[#1C1C1C] mb-1">{type.name as string}</h3>
                    <p className="text-sm text-gray-700 mb-2">{type.description as string}</p>
                    {type.advantages && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-green-700">Advantages:</p>
                        <ul className="text-sm text-gray-600">
                          {(type.advantages as string[]).map((a, i) => <li key={i}>• {a}</li>)}
                        </ul>
                      </div>
                    )}
                    {type.used_for && <p className="text-sm text-gray-500 mt-2"><strong>Used for:</strong> {type.used_for as string}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.fractions && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Press Fractions</h2>
              <div className="grid gap-4">
                {Object.entries(data.fractions as Record<string, Record<string, string>>).map(([key, fraction]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-[#1C1C1C]">{fraction.name}</h3>
                      <span className="text-sm text-[#722F37] font-medium">{fraction.percentage}</span>
                    </div>
                    <p className="text-sm text-gray-700">{fraction.description}</p>
                    <p className="text-sm text-gray-500 mt-1">{fraction.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.usage && (
            <div className="bg-[#722F37]/5 border border-[#722F37]/20 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-[#722F37] mb-2">Usage</h2>
              <p className="text-gray-700">{data.usage as string}</p>
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
