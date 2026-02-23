import RegionLayout from '@/components/RegionLayout';

export default function LeClosMicotPage() {
  return (
    <RegionLayout
      title="Le Clos Micot"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pommard"
      classification="premier-cru"
      contentFile="le-clos-micot-guide.md"
    />
  );
}
