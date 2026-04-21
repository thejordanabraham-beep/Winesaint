import RegionLayout from '@/components/RegionLayout';

export default function LesJarronsPage() {
  return (
    <RegionLayout
      title="Les Jarrons"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/savigny-les-beaune"
      classification="premier-cru"
      contentFile="les-jarrons-guide.md"
    />
  );
}
