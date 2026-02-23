import RegionLayout from '@/components/RegionLayout';

export default async function SacyPage() {
  return (
    <RegionLayout
      title="Sacy"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="sacy-guide.md"
    />
  );
}
