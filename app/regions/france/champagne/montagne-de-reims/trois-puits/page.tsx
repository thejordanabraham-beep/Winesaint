import RegionLayout from '@/components/RegionLayout';

export default async function TroisPuitsPage() {
  return (
    <RegionLayout
      title="Trois Puits"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="trois-puits-guide.md"
    />
  );
}
