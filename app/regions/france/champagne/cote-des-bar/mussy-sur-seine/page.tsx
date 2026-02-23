import RegionLayout from '@/components/RegionLayout';

export default async function MussySurSeinePage() {
  return (
    <RegionLayout
      title="Mussy sur Seine"
      level="village"
      parentRegion="france/champagne/cote-des-bar"
      contentFile="mussy-sur-seine-guide.md"
    />
  );
}
