import RegionLayout from '@/components/RegionLayout';

export default function VrignyPage() {
  return (
    <RegionLayout
      title="Vrigny"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="vrigny-guide.md"
    />
  );
}
