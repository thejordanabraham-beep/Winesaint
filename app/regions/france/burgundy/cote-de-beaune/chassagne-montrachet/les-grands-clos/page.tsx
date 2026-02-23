import RegionLayout from '@/components/RegionLayout';

export default function LesGrandsClosPage() {
  return (
    <RegionLayout
      title="Les Grands Clos"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="les-grands-clos-vineyard-guide.md"
    />
  );
}
