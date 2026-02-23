import RegionLayout from '@/components/RegionLayout';

export default function LaGarennePage() {
  return (
    <RegionLayout
      title="La Garenne"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/puligny-montrachet"
      classification="premier-cru"
      contentFile="la-garenne-guide.md"
    />
  );
}
