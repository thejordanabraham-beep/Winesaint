import RegionLayout from '@/components/RegionLayout';

export default async function MutignyPage() {
  return (
    <RegionLayout
      title="Mutigny"
      level="village"
      parentRegion="france/champagne/vallee-de-la-marne"
      contentFile="mutigny-guide.md"
    />
  );
}
