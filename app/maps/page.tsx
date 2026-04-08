import Link from 'next/link';

export const metadata = {
  title: 'Wine Maps | WineSaint',
  description: 'Explore wine regions around the world with our interactive maps. Discover appellations, vineyards, and terroir across France, Italy, Spain, Germany, Austria, and more.',
};

export default function MapsPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-[#FAF7F2]">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="font-serif text-4xl md:text-5xl text-[#1C1C1C] mb-6">
          Wine Region Maps
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Our interactive wine map is available at its own dedicated site for the best experience.
          Explore appellations, vineyards, and terroir across 20+ countries.
        </p>
        <a
          href="https://wine-saint-maps.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 bg-[#722F37] text-white font-semibold uppercase tracking-wide hover:bg-[#5a252c] transition-colors rounded"
        >
          Open Wine Maps
        </a>
        <p className="mt-6 text-sm text-gray-500">
          Features: Interactive region explorer, satellite/terrain views, 3D terrain analysis,
          vineyard-level detail for Burgundy, Piedmont, Germany, and more.
        </p>
      </div>
    </div>
  );
}
