import RegionLayout from '@/components/RegionLayout';

export default function VilledommangePage() {
  return (
    <RegionLayout
      title="Villedommange"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="villedommange-guide.md"
    />
  );
}
