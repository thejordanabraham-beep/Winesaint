import RegionLayout from '@/components/RegionLayout';

export default async function VillersAllerandPage() {
  return (
    <RegionLayout
      title="Villers Allerand"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="villers-allerand-guide.md"
    />
  );
}
