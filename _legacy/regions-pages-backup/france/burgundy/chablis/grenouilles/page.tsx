import RegionLayout from '@/components/RegionLayout';

export default function GrenouillesPage() {
  return (
    <RegionLayout
      title="Grenouilles"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="grand-cru"
      contentFile="grenouilles-guide.md"
    />
  );
}
