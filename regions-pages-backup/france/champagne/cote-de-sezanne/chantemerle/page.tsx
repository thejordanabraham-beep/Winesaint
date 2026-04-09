import RegionLayout from '@/components/RegionLayout';

export default async function ChantemerlePage() {
  return (
    <RegionLayout
      title="Chantemerle"
      level="village"
      parentRegion="france/champagne/cote-de-sezanne"
      contentFile="chantemerle-guide.md"
    />
  );
}
