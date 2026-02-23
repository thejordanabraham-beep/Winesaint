import RegionLayout from '@/components/RegionLayout';

export default async function TrepailPage() {
  return (
    <RegionLayout
      title="Trepail"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="trépail-guide.md"
    />
  );
}
