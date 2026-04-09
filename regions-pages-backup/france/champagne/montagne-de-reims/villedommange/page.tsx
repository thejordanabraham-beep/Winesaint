import RegionLayout from '@/components/RegionLayout';

export default async function VilledommangePage() {
  return (
    <RegionLayout
      title="Villedommange"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="villedommange-guide.md"
    />
  );
}
