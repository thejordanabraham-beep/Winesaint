import RegionLayout from '@/components/RegionLayout';

export default function LesJoyeusesPage() {
  return (
    <RegionLayout
      title="Les Joyeuses"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/ladoix"
      classification="premier-cru"
      contentFile="les-joyeuses-guide.md"
    />
  );
}
