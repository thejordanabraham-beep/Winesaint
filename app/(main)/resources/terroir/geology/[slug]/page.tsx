import Link from 'next/link';
import { notFound } from 'next/navigation';
import terroirData from '@/app/data/terroir.json';

export function generateStaticParams() {
  return terroirData.sections.geology.items.map((geo) => ({
    slug: geo.id,
  }));
}

function GeologicalTimeline({ formation }: { formation: string }) {
  const periods = [
    { name: 'Precambrian', age: '4600-541 Ma', position: 0 },
    { name: 'Paleozoic', age: '541-252 Ma', position: 20 },
    { name: 'Mesozoic', age: '252-66 Ma', position: 50 },
    { name: 'Cenozoic', age: '66-0 Ma', position: 80 },
  ];

  const formationLower = formation.toLowerCase();
  let activePosition = 50;

  if (formationLower.includes('precambrian') || formationLower.includes('500 million')) {
    activePosition = 10;
  } else if (formationLower.includes('devonian') || formationLower.includes('400 million')) {
    activePosition = 25;
  } else if (formationLower.includes('triassic') || formationLower.includes('250')) {
    activePosition = 40;
  } else if (formationLower.includes('jurassic') || formationLower.includes('155') || formationLower.includes('170')) {
    activePosition = 55;
  } else if (formationLower.includes('cretaceous') || formationLower.includes('145') || formationLower.includes('66')) {
    activePosition = 70;
  } else if (formationLower.includes('tertiary') || formationLower.includes('quaternary') || formationLower.includes('million years')) {
    activePosition = 85;
  }

  return (
    <div className="bg-[#FAF7F2] rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-500 mb-3">Geological Timeline</h3>
      <div className="relative h-6 rounded-full bg-gradient-to-r from-gray-800 via-amber-600 to-green-500">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-8 bg-white border-2 border-[#722F37] rounded shadow-lg"
          style={{ left: `${activePosition}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Ancient</span>
        <span>Paleozoic</span>
        <span>Mesozoic</span>
        <span>Recent</span>
      </div>
    </div>
  );
}

export default async function GeologyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const geology = terroirData.sections.geology.items.find((g) => g.id === slug);

  if (!geology) {
    notFound();
  }

  const otherGeology = terroirData.sections.geology.items.filter((g) => g.id !== slug);

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-[#722F37]">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources" className="text-gray-500 hover:text-[#722F37]">Resources</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources/terroir" className="text-gray-500 hover:text-[#722F37]">Terroir Guide</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#1C1C1C]">{geology.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{geology.name}</h1>
          <p className="mt-2 text-gray-600">{geology.formation}</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-8">
          {/* Timeline */}
          <div className="mb-8">
            <GeologicalTimeline formation={geology.formation} />
          </div>

          {/* Composition */}
          <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Composition</h2>
            <p className="text-gray-700 text-lg">{geology.composition}</p>
          </div>

          {/* Wine Impact */}
          <div className="mb-8 pb-6 border-b border-[#1C1C1C]/10">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-3">Impact on Wine</h2>
            <p className="text-gray-700 text-lg">{geology.wine_impact}</p>
          </div>

          {/* Characteristics */}
          <div className="mb-8">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Characteristics</h2>
            <div className="flex flex-wrap gap-2">
              {geology.characteristics.map((char, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-[#FAF7F2] rounded-full border border-[#1C1C1C]/20 text-[#1C1C1C]"
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          {/* Famous Regions */}
          <div className="mb-8">
            <h2 className="font-serif text-xl italic text-[#1C1C1C] mb-4">Famous Wine Regions</h2>
            <div className="grid gap-2 md:grid-cols-2">
              {geology.famous_regions.map((region, i) => (
                <div key={i} className="bg-[#FAF7F2] rounded-lg p-3">
                  <span className="text-[#722F37] font-medium">{region}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Geological Note */}
          <div className="bg-amber-50 rounded-lg p-5 border border-amber-200">
            <h3 className="font-medium text-amber-800 mb-2">Geological Note</h3>
            <p className="text-amber-900">{geology.geological_note}</p>
          </div>
        </div>

        {/* Other Geology Types */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Compare Geological Formations</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {otherGeology.map((other) => (
              <Link
                key={other.id}
                href={`/resources/terroir/geology/${other.id}`}
                className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
              >
                <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                  {other.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{other.formation}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{other.wine_impact}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/resources/terroir"
            className="inline-flex items-center text-[#722F37] hover:underline"
          >
            ← Back to Terroir Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
