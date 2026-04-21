import RegionLayout from '@/components/RegionLayout';

export default function LesBoucherottesPage() {
  return (
    <RegionLayout
      title="Les Boucherottes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="les-boucherottes-guide.md"
    />
  );
}
