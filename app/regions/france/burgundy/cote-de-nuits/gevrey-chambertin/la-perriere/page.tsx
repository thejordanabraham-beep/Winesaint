import RegionLayout from '@/components/RegionLayout';

export default function LaPerrirePage() {
  return (
    <RegionLayout
      title="La Perrière"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/gevrey-chambertin"
      classification="premier-cru"
      contentFile="la-perriere-guide.md"
    />
  );
}
