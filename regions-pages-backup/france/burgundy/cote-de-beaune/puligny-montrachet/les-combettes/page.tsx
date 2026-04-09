import RegionLayout from '@/components/RegionLayout';

export default function LesCombettesPage() {
  return (
    <RegionLayout
      title="Les Combettes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/puligny-montrachet"
      classification="premier-cru"
      contentFile="les-combettes-guide.md"
    />
  );
}
