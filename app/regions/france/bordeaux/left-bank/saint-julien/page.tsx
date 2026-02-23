import RegionLayout from '@/components/RegionLayout';

export default function SaintJulienPage() {
  return (
    <RegionLayout
      title="Saint-Julien"
      level="sub-region"
      parentRegion="france/bordeaux/left-bank"
      contentFile="saint-julien-guide.md"
    />
  );
}
