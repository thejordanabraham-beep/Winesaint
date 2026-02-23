import RegionLayout from '@/components/RegionLayout';

export default async function AvizePage() {
  return (
    <RegionLayout
      title="Avize"
      level="village"
      parentRegion="france/champagne/cote-des-blancs"
      contentFile="avize-guide.md"
    />
  );
}
