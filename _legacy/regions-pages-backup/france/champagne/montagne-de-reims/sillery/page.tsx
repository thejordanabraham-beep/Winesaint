import RegionLayout from '@/components/RegionLayout';

export default async function SilleryPage() {
  return (
    <RegionLayout
      title="Sillery"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="sillery-guide.md"
    />
  );
}
