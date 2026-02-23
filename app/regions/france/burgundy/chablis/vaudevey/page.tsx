import RegionLayout from '@/components/RegionLayout';

export default function VaudeveyPage() {
  return (
    <RegionLayout
      title="Vaudevey"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="premier-cru"
      contentFile="vaudevey-guide.md"
    />
  );
}
