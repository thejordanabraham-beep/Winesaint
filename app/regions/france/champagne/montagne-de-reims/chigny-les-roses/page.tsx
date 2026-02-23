import RegionLayout from '@/components/RegionLayout';

export default async function ChignyLesRosesPage() {
  return (
    <RegionLayout
      title="Chigny les Roses"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="chigny-les-roses-guide.md"
    />
  );
}
