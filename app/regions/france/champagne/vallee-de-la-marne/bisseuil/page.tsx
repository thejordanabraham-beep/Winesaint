import RegionLayout from '@/components/RegionLayout';

export default async function BisseuilPage() {
  return (
    <RegionLayout
      title="Bisseuil"
      level="village"
      parentRegion="france/champagne/vallee-de-la-marne"
      contentFile="bisseuil-guide.md"
    />
  );
}
