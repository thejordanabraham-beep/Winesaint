import RegionLayout from '@/components/RegionLayout';

export default function LeCouletPage() {
  return (
    <RegionLayout
      title="Le Coulet"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="le-coulet-guide.md"
    />
  );
}
