import RegionLayout from '@/components/RegionLayout';

export default async function UrvillePage() {
  return (
    <RegionLayout
      title="Urville"
      level="village"
      parentRegion="france/champagne/cote-des-bar"
      contentFile="urville-guide.md"
    />
  );
}
