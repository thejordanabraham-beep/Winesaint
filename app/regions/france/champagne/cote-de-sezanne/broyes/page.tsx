import RegionLayout from '@/components/RegionLayout';

export default async function BroyesPage() {
  return (
    <RegionLayout
      title="Broyes"
      level="village"
      parentRegion="france/champagne/cote-de-sezanne"
      contentFile="broyes-guide.md"
    />
  );
}
