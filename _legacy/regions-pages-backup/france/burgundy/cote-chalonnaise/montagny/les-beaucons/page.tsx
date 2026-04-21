import RegionLayout from '@/components/RegionLayout';

export default function LesBeauconsPage() {
  return (
    <RegionLayout
      title="Les Beaucons"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-beaucons-guide.md"
    />
  );
}
