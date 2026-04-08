import WineMap from '@/components/maplibre/WineMap';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Wine Maps | WineSaint',
  description: 'Explore wine regions around the world with our interactive maps. Discover appellations, vineyards, and terroir across France, Italy, Spain, Germany, Austria, and more.',
};

export default function MapsPage() {
  return (
    <div className="h-[calc(100vh-80px)]">
      <WineMap />
    </div>
  );
}
