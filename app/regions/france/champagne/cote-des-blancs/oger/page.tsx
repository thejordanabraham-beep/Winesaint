import RegionLayout from '@/components/RegionLayout';

export default async function OgerPage() {
  return (
    <RegionLayout
      title="Oger"
      level="village"
      parentRegion="france/champagne/cote-des-blancs"
      contentFile="oger-guide.md"
    />
  );
}
