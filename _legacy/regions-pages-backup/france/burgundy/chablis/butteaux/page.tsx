import RegionLayout from '@/components/RegionLayout';

export default function ButteauxPage() {
  return (
    <RegionLayout
      title="Butteaux"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="premier-cru"
      contentFile="butteaux-guide.md"
    />
  );
}
