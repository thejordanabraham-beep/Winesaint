import RegionLayout from '@/components/RegionLayout';

export default function ClosdeVergerPage() {
  return (
    <RegionLayout
      title="Clos de Verger"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pommard"
      classification="premier-cru"
      contentFile="clos-de-verger-guide.md"
    />
  );
}
