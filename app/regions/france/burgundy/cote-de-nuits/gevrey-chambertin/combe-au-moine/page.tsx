import RegionLayout from '@/components/RegionLayout';

export default function CombeauMoinePage() {
  return (
    <RegionLayout
      title="Combe au Moine"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/gevrey-chambertin"
      classification="premier-cru"
      contentFile="combe-au-moine-guide.md"
    />
  );
}
