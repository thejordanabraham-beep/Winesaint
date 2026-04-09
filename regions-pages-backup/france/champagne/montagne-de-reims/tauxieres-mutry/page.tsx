import RegionLayout from '@/components/RegionLayout';

export default async function TauxieresMutryPage() {
  return (
    <RegionLayout
      title="Tauxieres Mutry"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="tauxières-mutry-guide.md"
    />
  );
}
