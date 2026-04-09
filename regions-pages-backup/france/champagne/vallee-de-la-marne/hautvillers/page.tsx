import RegionLayout from '@/components/RegionLayout';

export default async function HautvillersPage() {
  return (
    <RegionLayout
      title="Hautvillers"
      level="village"
      parentRegion="france/champagne/vallee-de-la-marne"
      contentFile="hautvillers-guide.md"
    />
  );
}
