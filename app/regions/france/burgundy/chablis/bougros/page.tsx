import RegionLayout from '@/components/RegionLayout';

export default function BougrosPage() {
  return (
    <RegionLayout
      title="Bougros"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="grand-cru"
      contentFile="bougros-guide.md"
    />
  );
}
