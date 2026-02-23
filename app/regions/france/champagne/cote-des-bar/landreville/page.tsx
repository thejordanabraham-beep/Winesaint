import RegionLayout from '@/components/RegionLayout';

export default async function LandrevillePage() {
  return (
    <RegionLayout
      title="Landreville"
      level="village"
      parentRegion="france/champagne/cote-des-bar"
      contentFile="landreville-guide.md"
    />
  );
}
