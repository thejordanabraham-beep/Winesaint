import RegionLayout from '@/components/RegionLayout';

export default function LesGrchonsPage() {
  return (
    <RegionLayout
      title="Les Grêchons"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/ladoix"
      classification="premier-cru"
      contentFile="les-grechons-guide.md"
    />
  );
}
