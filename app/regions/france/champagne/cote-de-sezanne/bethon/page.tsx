import RegionLayout from '@/components/RegionLayout';

export default async function BethonPage() {
  return (
    <RegionLayout
      title="Bethon"
      level="village"
      parentRegion="france/champagne/cote-de-sezanne"
      contentFile="bethon-guide.md"
    />
  );
}
