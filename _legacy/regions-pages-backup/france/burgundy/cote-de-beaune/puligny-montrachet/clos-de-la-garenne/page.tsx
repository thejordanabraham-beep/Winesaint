import RegionLayout from '@/components/RegionLayout';

export default function ClosdelaGarennePage() {
  return (
    <RegionLayout
      title="Clos de la Garenne"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/puligny-montrachet"
      classification="premier-cru"
      contentFile="clos-de-la-garenne-guide.md"
    />
  );
}
