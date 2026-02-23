import RegionLayout from '@/components/RegionLayout';

export default function PatagoniaPage() {
  return (
    <RegionLayout
      title="Patagonia"
      level="region"
      parentRegion="argentina"
      contentFile="patagonia-guide.md"
    />
  );
}
