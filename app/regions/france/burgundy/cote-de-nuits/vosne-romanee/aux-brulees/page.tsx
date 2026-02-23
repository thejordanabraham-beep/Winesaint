import RegionLayout from '@/components/RegionLayout';

export default function AuxBrlesPage() {
  return (
    <RegionLayout
      title="Aux Brûlées"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/vosne-romanee"
      classification="premier-cru"
      contentFile="aux-brulees-guide.md"
    />
  );
}
