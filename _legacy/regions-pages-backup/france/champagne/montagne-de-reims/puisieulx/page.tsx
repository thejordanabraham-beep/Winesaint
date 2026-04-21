import RegionLayout from '@/components/RegionLayout';

export default async function PuisieulxPage() {
  return (
    <RegionLayout
      title="Puisieulx"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="puisieulx-guide.md"
    />
  );
}
