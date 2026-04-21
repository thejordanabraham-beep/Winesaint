import RegionLayout from '@/components/RegionLayout';

export default async function EcueilPage() {
  return (
    <RegionLayout
      title="Ecueil"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="écueil-guide.md"
    />
  );
}
