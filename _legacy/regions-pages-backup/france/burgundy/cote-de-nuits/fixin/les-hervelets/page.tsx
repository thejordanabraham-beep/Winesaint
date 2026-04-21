import RegionLayout from '@/components/RegionLayout';

export default function LesHerveletsPage() {
  return (
    <RegionLayout
      title="Les Hervelets"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/fixin"
      classification="premier-cru"
      contentFile="les-hervelets-guide.md"
    />
  );
}
