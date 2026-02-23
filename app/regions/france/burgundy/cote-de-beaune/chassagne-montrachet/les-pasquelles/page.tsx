import RegionLayout from '@/components/RegionLayout';

export default function LesPasquellesPage() {
  return (
    <RegionLayout
      title="Les Pasquelles"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="les-pasquelles-vineyard-guide.md"
    />
  );
}
