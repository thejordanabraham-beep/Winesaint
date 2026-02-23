import RegionLayout from '@/components/RegionLayout';

export default function LesHautsMarconnetsPage() {
  return (
    <RegionLayout
      title="Les Hauts Marconnets"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/savigny-les-beaune"
      classification="premier-cru"
      contentFile="les-hauts-marconnets-guide.md"
    />
  );
}
