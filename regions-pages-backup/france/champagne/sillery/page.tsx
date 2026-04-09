import RegionLayout from '@/components/RegionLayout';

export default function SilleryPage() {
  return (
    <RegionLayout
      title="Sillery"
      level="vineyard"
      parentRegion="france/champagne"
      classification="grand-cru"
      contentFile="sillery-guide.md"
    />
  );
}
