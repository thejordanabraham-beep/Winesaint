import RegionLayout from '@/components/RegionLayout';

export default async function VillenauxeLaGrandePage() {
  return (
    <RegionLayout
      title="Villenauxe la Grande"
      level="village"
      parentRegion="france/champagne/cote-de-sezanne"
      contentFile="villenauxe-la-grande-guide.md"
    />
  );
}
