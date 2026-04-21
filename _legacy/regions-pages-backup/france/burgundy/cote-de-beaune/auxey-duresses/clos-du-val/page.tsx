import RegionLayout from '@/components/RegionLayout';

export default function ClosduValPage() {
  return (
    <RegionLayout
      title="Clos du Val"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/auxey-duresses"
      classification="premier-cru"
      contentFile="clos-du-val-guide.md"
    />
  );
}
