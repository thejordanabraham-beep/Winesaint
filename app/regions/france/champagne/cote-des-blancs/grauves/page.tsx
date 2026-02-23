import RegionLayout from '@/components/RegionLayout';

export default async function GrauvesPage() {
  return (
    <RegionLayout
      title="Grauves"
      level="village"
      parentRegion="france/champagne/cote-des-blancs"
      contentFile="grauves-guide.md"
    />
  );
}
