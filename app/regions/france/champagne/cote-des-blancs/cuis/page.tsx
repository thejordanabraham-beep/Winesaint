import RegionLayout from '@/components/RegionLayout';

export default async function CuisPage() {
  return (
    <RegionLayout
      title="Cuis"
      level="village"
      parentRegion="france/champagne/cote-des-blancs"
      contentFile="cuis-guide.md"
    />
  );
}
