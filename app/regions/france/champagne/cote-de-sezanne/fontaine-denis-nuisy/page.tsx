import RegionLayout from '@/components/RegionLayout';

export default async function FontaineDenisNuisyPage() {
  return (
    <RegionLayout
      title="Fontaine Denis Nuisy"
      level="village"
      parentRegion="france/champagne/cote-de-sezanne"
      contentFile="fontaine-denis-nuisy-guide.md"
    />
  );
}
