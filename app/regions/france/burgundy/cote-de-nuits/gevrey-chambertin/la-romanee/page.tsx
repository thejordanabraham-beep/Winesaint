import RegionLayout from '@/components/RegionLayout';

export default function LaRomanePage() {
  return (
    <RegionLayout
      title="La Romanée"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/gevrey-chambertin"
      classification="premier-cru"
      contentFile="la-romanee-guide.md"
    />
  );
}
