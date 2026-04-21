import RegionLayout from '@/components/RegionLayout';

export default async function GyeSurSeinePage() {
  return (
    <RegionLayout
      title="Gye sur Seine"
      level="village"
      parentRegion="france/champagne/cote-des-bar"
      contentFile="gyé-sur-seine-guide.md"
    />
  );
}
