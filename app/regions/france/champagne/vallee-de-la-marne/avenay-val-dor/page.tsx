import RegionLayout from '@/components/RegionLayout';

export default async function AvenayValDorPage() {
  return (
    <RegionLayout
      title="Avenay Val Dor"
      level="village"
      parentRegion="france/champagne/vallee-de-la-marne"
      contentFile="avenay-val-dor-guide.md"
    />
  );
}
