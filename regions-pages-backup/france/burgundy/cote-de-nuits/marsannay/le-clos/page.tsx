import RegionLayout from '@/components/RegionLayout';

export default function LeClosPage() {
  return (
    <RegionLayout
      title="Le Clos"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/marsannay"
      classification="premier-cru"
      contentFile="le-clos-guide.md"
    />
  );
}
