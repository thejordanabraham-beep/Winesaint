import RegionLayout from '@/components/RegionLayout';

export default async function AyPage() {
  return (
    <RegionLayout
      title="Aÿ"
      level="village"
      parentRegion="france/champagne/vallee-de-la-marne"
      contentFile="aÿ-guide.md"
    />
  );
}
