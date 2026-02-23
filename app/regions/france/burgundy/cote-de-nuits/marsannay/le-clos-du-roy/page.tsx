import RegionLayout from '@/components/RegionLayout';

export default function LeClosduRoyPage() {
  return (
    <RegionLayout
      title="Le Clos du Roy"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/marsannay"
      classification="premier-cru"
      contentFile="le-clos-du-roy-guide.md"
    />
  );
}
