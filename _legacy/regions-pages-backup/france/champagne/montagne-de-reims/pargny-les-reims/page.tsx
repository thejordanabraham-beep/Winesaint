import RegionLayout from '@/components/RegionLayout';

export default async function PargnyLesReimsPage() {
  return (
    <RegionLayout
      title="Pargny les Reims"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="pargny-lès-reims-guide.md"
    />
  );
}
