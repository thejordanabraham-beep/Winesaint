import RegionLayout from '@/components/RegionLayout';

export default function LesMarconnetsPage() {
  return (
    <RegionLayout
      title="Les Marconnets"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="les-marconnets-guide.md"
    />
  );
}
