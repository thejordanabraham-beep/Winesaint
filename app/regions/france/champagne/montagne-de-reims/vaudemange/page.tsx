import RegionLayout from '@/components/RegionLayout';

export default async function VaudemangePage() {
  return (
    <RegionLayout
      title="Vaudemange"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="vaudemange-guide.md"
    />
  );
}
