import RegionLayout from '@/components/RegionLayout';

export default async function TaissyPage() {
  return (
    <RegionLayout
      title="Taissy"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="taissy-guide.md"
    />
  );
}
