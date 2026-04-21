import RegionLayout from '@/components/RegionLayout';

export default async function BeaumontSurVeslePage() {
  return (
    <RegionLayout
      title="Beaumont sur Vesle"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="beaumont-sur-vesle-guide.md"
    />
  );
}
