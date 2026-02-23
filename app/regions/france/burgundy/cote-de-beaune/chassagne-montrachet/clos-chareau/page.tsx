import RegionLayout from '@/components/RegionLayout';

export default function ClosChareauPage() {
  return (
    <RegionLayout
      title="Clos Chareau"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="clos-chareau-vineyard-guide.md"
    />
  );
}
