import RegionLayout from '@/components/RegionLayout';

export default async function VertusPage() {
  return (
    <RegionLayout
      title="Vertus"
      level="village"
      parentRegion="france/champagne/cote-des-blancs"
      contentFile="vertus-guide.md"
    />
  );
}
