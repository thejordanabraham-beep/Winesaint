import RegionLayout from '@/components/RegionLayout';

export default async function AllemantPage() {
  return (
    <RegionLayout
      title="Allemant"
      level="village"
      parentRegion="france/champagne/cote-de-sezanne"
      contentFile="allemant-guide.md"
    />
  );
}
