import RegionLayout from '@/components/RegionLayout';

export default function BarsacPage() {
  return (
    <RegionLayout
      title="Barsac"
      level="sub-region"
      parentRegion="france/bordeaux"
      contentFile="barsac-guide.md"
    />
  );
}
