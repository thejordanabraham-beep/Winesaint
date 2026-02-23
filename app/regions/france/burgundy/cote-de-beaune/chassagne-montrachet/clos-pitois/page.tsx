import RegionLayout from '@/components/RegionLayout';

export default function ClosPitoisPage() {
  return (
    <RegionLayout
      title="Clos Pitois"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="clos-pitois-vineyard-guide.md"
    />
  );
}
