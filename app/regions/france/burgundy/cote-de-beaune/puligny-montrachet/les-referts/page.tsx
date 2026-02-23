import RegionLayout from '@/components/RegionLayout';

export default function LesRefertsPage() {
  return (
    <RegionLayout
      title="Les Referts"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/puligny-montrachet"
      classification="premier-cru"
      contentFile="les-referts-guide.md"
    />
  );
}
