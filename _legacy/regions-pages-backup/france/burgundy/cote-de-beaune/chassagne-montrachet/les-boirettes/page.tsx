import RegionLayout from '@/components/RegionLayout';

export default function LesBoirettesPage() {
  return (
    <RegionLayout
      title="Les Boirettes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="les-boirettes-vineyard-guide.md"
    />
  );
}
