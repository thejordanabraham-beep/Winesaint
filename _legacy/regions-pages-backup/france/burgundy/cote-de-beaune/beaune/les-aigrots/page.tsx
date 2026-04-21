import RegionLayout from '@/components/RegionLayout';

export default function LesAigrotsPage() {
  return (
    <RegionLayout
      title="Les Aigrots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="les-aigrots-guide.md"
    />
  );
}
