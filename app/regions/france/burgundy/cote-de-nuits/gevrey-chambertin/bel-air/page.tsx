import RegionLayout from '@/components/RegionLayout';

export default function BelAirPage() {
  return (
    <RegionLayout
      title="Bel Air"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/gevrey-chambertin"
      classification="premier-cru"
      contentFile="bel-air-guide.md"
    />
  );
}
