import { notFound } from 'next/navigation';
import Link from 'next/link';
import wmData from '@/app/data/winemaking.json';

export async function generateStaticParams() {
  const styles = wmData.sections.fortified.styles;
  return styles.map((s) => ({ slug: s.id }));
}

export default async function FortifiedDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const style = wmData.sections.fortified.styles.find((s) => s.id === slug);

  if (!style) notFound();

  const data = style as Record<string, unknown>;

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
          <p className="text-lg text-gray-500 mt-1">{data.region as string}</p>
        </div>

        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-6">
          <p className="text-gray-700 leading-relaxed mb-6">{data.description as string}</p>

          {data.production && (
            <div className="mb-6 bg-[#FAF7F2] rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-[#722F37] mb-2">Production</h2>
              <p className="text-gray-700">{data.production as string}</p>
            </div>
          )}

          {data.solera && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-amber-800 mb-2">Solera System</h2>
              <p className="text-gray-700">{data.solera as string}</p>
            </div>
          )}

          {data.estufagem && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Estufagem (Heating)</h2>
              <p className="text-gray-700 mb-3">{(data.estufagem as Record<string, unknown>).description as string}</p>
              {(data.estufagem as Record<string, Record<string, string>>).methods && (
                <div className="grid gap-3">
                  {Object.entries((data.estufagem as Record<string, Record<string, string>>).methods).map(([key, desc]) => (
                    <div key={key} className="bg-[#FAF7F2] rounded-lg p-3">
                      <p className="font-medium text-[#1C1C1C] capitalize">{key}</p>
                      <p className="text-sm text-gray-600">{desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {data.styles && (
            <div className="mb-6">
              <h2 className="font-serif text-xl italic text-[#722F37] mb-3">Styles</h2>
              <div className="grid gap-4">
                {Object.entries(data.styles as Record<string, Record<string, unknown>>).map(([key, styleInfo]) => (
                  <div key={key} className="bg-[#FAF7F2] rounded-lg p-4">
                    <h3 className="font-medium text-[#1C1C1C] mb-1">{styleInfo.name as string || key}</h3>
                    {styleInfo.aging && <p className="text-sm text-gray-500 mb-1"><strong>Aging:</strong> {styleInfo.aging as string}</p>}
                    {styleInfo.character && <p className="text-sm text-gray-700">{styleInfo.character as string}</p>}
                    {styleInfo.fortification && <p className="text-sm text-gray-500 mt-1"><strong>Fortification:</strong> {styleInfo.fortification as string}</p>}
                    {styleInfo.ages && <p className="text-sm text-gray-500 mt-1"><strong>Age designations:</strong> {styleInfo.ages as string}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.aging && (
            <div className="bg-[#FAF7F2] rounded-lg p-4">
              <h2 className="font-serif text-lg italic text-[#722F37] mb-2">Aging</h2>
              <p className="text-gray-700">{data.aging as string}</p>
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
