import RegionLayout from '@/components/RegionLayout';

export default async function BarSurSeinePage() {
  return (
    <RegionLayout
      title="Bar sur Seine"
      level="village"
      parentRegion="france/champagne/cote-des-bar"
      contentFile="bar-sur-seine-guide.md"
    />
  );
}
