import RegionLayout from '@/components/RegionLayout';

export default async function VerzyPage() {
  return (
    <RegionLayout
      title="Verzy"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="verzy-guide.md"
    />
  );
}
