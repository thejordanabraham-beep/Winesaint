import RegionLayout from '@/components/RegionLayout';

export default async function SezannePage() {
  return (
    <RegionLayout
      title="Sezanne"
      level="village"
      parentRegion="france/champagne/cote-de-sezanne"
      contentFile="sézanne-guide.md"
    />
  );
}
