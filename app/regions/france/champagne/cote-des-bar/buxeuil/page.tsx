import RegionLayout from '@/components/RegionLayout';

export default async function BuxeuilPage() {
  return (
    <RegionLayout
      title="Buxeuil"
      level="village"
      parentRegion="france/champagne/cote-des-bar"
      contentFile="buxeuil-guide.md"
    />
  );
}
