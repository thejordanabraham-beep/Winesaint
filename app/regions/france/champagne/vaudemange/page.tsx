import RegionLayout from '@/components/RegionLayout';

export default function VaudemangePage() {
  return (
    <RegionLayout
      title="Vaudemange"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="vaudemange-guide.md"
    />
  );
}
