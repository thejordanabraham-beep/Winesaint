import RegionLayout from '@/components/RegionLayout';

export default async function SaudoyPage() {
  return (
    <RegionLayout
      title="Saudoy"
      level="village"
      parentRegion="france/champagne/cote-de-sezanne"
      contentFile="saudoy-guide.md"
    />
  );
}
