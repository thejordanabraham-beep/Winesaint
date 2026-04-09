import RegionLayout from '@/components/RegionLayout';

export default function BillyleGrandPage() {
  return (
    <RegionLayout
      title="Billy-le-Grand"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="billy-le-grand-guide.md"
    />
  );
}
