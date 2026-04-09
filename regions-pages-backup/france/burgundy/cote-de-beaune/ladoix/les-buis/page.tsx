import RegionLayout from '@/components/RegionLayout';

export default function LesBuisPage() {
  return (
    <RegionLayout
      title="Les Buis"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/ladoix"
      classification="premier-cru"
      contentFile="les-buis-guide.md"
    />
  );
}
