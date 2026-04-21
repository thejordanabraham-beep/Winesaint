import RegionLayout from '@/components/RegionLayout';

export default async function VrignyPage() {
  return (
    <RegionLayout
      title="Vrigny"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="vrigny-guide.md"
    />
  );
}
