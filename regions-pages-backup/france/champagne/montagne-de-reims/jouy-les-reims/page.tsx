import RegionLayout from '@/components/RegionLayout';

export default async function JouyLesReimsPage() {
  return (
    <RegionLayout
      title="Jouy les Reims"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="jouy-lès-reims-guide.md"
    />
  );
}
