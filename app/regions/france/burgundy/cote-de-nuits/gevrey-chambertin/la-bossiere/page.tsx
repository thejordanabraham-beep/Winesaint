import RegionLayout from '@/components/RegionLayout';

export default function LaBossirePage() {
  return (
    <RegionLayout
      title="La Bossière"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/gevrey-chambertin"
      classification="premier-cru"
      contentFile="la-bossiere-guide.md"
    />
  );
}
