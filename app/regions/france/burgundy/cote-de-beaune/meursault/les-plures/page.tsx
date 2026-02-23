import RegionLayout from '@/components/RegionLayout';

export default function LesPluresPage() {
  return (
    <RegionLayout
      title="Les Plures"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/meursault"
      classification="premier-cru"
      contentFile="les-plures-vineyard-guide.md"
    />
  );
}
