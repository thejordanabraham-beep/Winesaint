import RegionLayout from '@/components/RegionLayout';

export default async function VillersMarmeryPage() {
  return (
    <RegionLayout
      title="Villers Marmery"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="villers-marmery-guide.md"
    />
  );
}
