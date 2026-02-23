import RegionLayout from '@/components/RegionLayout';

export default async function AmbonnayPage() {
  return (
    <RegionLayout
      title="Ambonnay"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="ambonnay-guide.md"
    />
  );
}
