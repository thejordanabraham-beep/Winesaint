import RegionLayout from '@/components/RegionLayout';

export default function LesChouacheuxPage() {
  return (
    <RegionLayout
      title="Les Chouacheux"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="les-chouacheux-guide.md"
    />
  );
}
