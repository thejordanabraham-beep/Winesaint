import RegionLayout from '@/components/RegionLayout';

export default async function BarSurAubePage() {
  return (
    <RegionLayout
      title="Bar sur Aube"
      level="village"
      parentRegion="france/champagne/cote-des-bar"
      contentFile="bar-sur-aube-guide.md"
    />
  );
}
