import RegionLayout from '@/components/RegionLayout';

export default function ClosBlancPage() {
  return (
    <RegionLayout
      title="Clos Blanc"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pommard"
      classification="premier-cru"
      contentFile="clos-blanc-guide.md"
    />
  );
}
