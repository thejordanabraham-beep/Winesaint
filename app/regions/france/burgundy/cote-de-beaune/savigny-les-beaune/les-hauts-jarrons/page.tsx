import RegionLayout from '@/components/RegionLayout';

export default function LesHautsJarronsPage() {
  return (
    <RegionLayout
      title="Les Hauts Jarrons"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/savigny-les-beaune"
      classification="premier-cru"
      contentFile="les-hauts-jarrons-guide.md"
    />
  );
}
