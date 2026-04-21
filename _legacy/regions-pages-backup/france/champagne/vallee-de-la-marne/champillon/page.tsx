import RegionLayout from '@/components/RegionLayout';

export default async function ChampillonPage() {
  return (
    <RegionLayout
      title="Champillon"
      level="village"
      parentRegion="france/champagne/vallee-de-la-marne"
      contentFile="champillon-guide.md"
    />
  );
}
