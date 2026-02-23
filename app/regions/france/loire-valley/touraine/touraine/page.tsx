import RegionLayout from '@/components/RegionLayout';

export default function TourainePage() {
  return (
    <RegionLayout
      title="Touraine"
      level="village"
      parentRegion="france/loire-valley/touraine"
      contentFile="touraine-guide.md"
    />
  );
}
