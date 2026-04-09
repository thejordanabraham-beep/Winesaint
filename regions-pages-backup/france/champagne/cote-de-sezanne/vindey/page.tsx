import RegionLayout from '@/components/RegionLayout';

export default async function VindeyPage() {
  return (
    <RegionLayout
      title="Vindey"
      level="village"
      parentRegion="france/champagne/cote-de-sezanne"
      contentFile="vindey-guide.md"
    />
  );
}
