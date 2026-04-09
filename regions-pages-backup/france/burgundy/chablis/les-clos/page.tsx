import RegionLayout from '@/components/RegionLayout';

export default function LesClosPage() {
  return (
    <RegionLayout
      title="Les Clos"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="grand-cru"
      contentFile="les-clos-guide.md"
    />
  );
}
