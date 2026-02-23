import RegionLayout from '@/components/RegionLayout';

export default function SantoriniPage() {
  return (
    <RegionLayout
      title="Santorini"
      level="region"
      parentRegion="greece"
      contentFile="santorini-guide.md"
    />
  );
}
