import RegionLayout from '@/components/RegionLayout';

export default async function MareuilSurAyPage() {
  return (
    <RegionLayout
      title="Mareuil sur Ay"
      level="village"
      parentRegion="france/champagne/vallee-de-la-marne"
      contentFile="mareuil-sur-aÿ-guide.md"
    />
  );
}
