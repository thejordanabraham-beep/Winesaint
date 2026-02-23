import RegionLayout from '@/components/RegionLayout';

export default async function BarbonneFayelPage() {
  return (
    <RegionLayout
      title="Barbonne Fayel"
      level="village"
      parentRegion="france/champagne/cote-de-sezanne"
      contentFile="barbonne-fayel-guide.md"
    />
  );
}
