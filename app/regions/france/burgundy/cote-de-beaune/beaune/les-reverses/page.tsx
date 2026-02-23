import RegionLayout from '@/components/RegionLayout';

export default function LesReverssPage() {
  return (
    <RegionLayout
      title="Les Reversés"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="les-reverses-guide.md"
    />
  );
}
