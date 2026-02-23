import RegionLayout from '@/components/RegionLayout';

export default function LesAussyPage() {
  return (
    <RegionLayout
      title="Les Aussy"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/volnay"
      classification="premier-cru"
      contentFile="les-aussy-guide.md"
    />
  );
}
