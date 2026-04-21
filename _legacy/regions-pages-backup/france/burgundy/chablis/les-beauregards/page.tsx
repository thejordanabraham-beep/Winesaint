import RegionLayout from '@/components/RegionLayout';

export default function LesBeauregardsPage() {
  return (
    <RegionLayout
      title="Les Beauregards"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="premier-cru"
      contentFile="les-beauregards-guide.md"
    />
  );
}
