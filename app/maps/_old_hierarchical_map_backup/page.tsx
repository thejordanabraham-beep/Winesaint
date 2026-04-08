import { notFound } from 'next/navigation';
import { fetchMapData } from '@/lib/sanity/map-queries';
import HierarchicalMap from '@/components/maps/HierarchicalMap';

export const revalidate = 0; // always fetch fresh boundary data

interface PageProps {
  params: Promise<{ path?: string[] }>;
}

export default async function HierarchicalMapPage({ params }: PageProps) {
  const { path = [] } = await params;

  // Fetch data based on the URL path
  const mapData = await fetchMapData(path);

  if (!mapData.region && path.length > 0) {
    notFound();
  }

  return (
    <div className="h-[calc(100vh-80px)]">
      <HierarchicalMap
        level={mapData.level}
        region={mapData.region}
        children={mapData.children}
        siblings={mapData.siblings}
        breadcrumbs={mapData.breadcrumbs}
        currentPath={path}
      />
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { path = [] } = await params;
  const mapData = await fetchMapData(path);

  if (!mapData.region) {
    return {
      title: 'Wine Maps | WineSaint',
      description: 'Explore wine regions around the world with our interactive maps.',
    };
  }

  return {
    title: `${mapData.region.name} Wine Map | WineSaint`,
    description: mapData.region.description || `Interactive wine map of ${mapData.region.name}. Explore appellations and vineyards.`,
  };
}
