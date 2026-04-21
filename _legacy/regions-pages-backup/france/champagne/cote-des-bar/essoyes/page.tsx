import RegionLayout from '@/components/RegionLayout';

export default async function EssoyesPage() {
  return (
    <RegionLayout
      title="Essoyes"
      level="village"
      parentRegion="france/champagne/cote-des-bar"
      contentFile="essoyes-guide.md"
    />
  );
}
