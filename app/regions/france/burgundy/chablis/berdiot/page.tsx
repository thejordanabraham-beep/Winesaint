import RegionLayout from '@/components/RegionLayout';

export default function BerdiotPage() {
  return (
    <RegionLayout
      title="Berdiot"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="premier-cru"
      contentFile="berdiot-guide.md"
    />
  );
}
