import RegionLayout from '@/components/RegionLayout';

export default async function LaCelleSousChantemerlePage() {
  return (
    <RegionLayout
      title="la Celle sous Chantemerle"
      level="village"
      parentRegion="france/champagne/cote-de-sezanne"
      contentFile="la-celle-sous-chantemerle-guide.md"
    />
  );
}
