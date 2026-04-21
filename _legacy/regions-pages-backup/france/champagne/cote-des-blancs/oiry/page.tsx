import RegionLayout from '@/components/RegionLayout';

export default async function OiryPage() {
  return (
    <RegionLayout
      title="Oiry"
      level="village"
      parentRegion="france/champagne/cote-des-blancs"
      contentFile="oiry-guide.md"
    />
  );
}
