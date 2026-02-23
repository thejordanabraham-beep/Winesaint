import RegionLayout from '@/components/RegionLayout';

export default function LesChalumeauxPage() {
  return (
    <RegionLayout
      title="Les Chalumeaux"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/puligny-montrachet"
      classification="premier-cru"
      contentFile="les-chalumeaux-guide.md"
    />
  );
}
