import RegionLayout from '@/components/RegionLayout';

export default async function DizyPage() {
  return (
    <RegionLayout
      title="Dizy"
      level="village"
      parentRegion="france/champagne/vallee-de-la-marne"
      contentFile="dizy-guide.md"
    />
  );
}
