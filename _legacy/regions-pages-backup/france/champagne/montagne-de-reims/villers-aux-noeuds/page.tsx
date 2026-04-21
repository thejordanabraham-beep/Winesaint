import RegionLayout from '@/components/RegionLayout';

export default async function VillersAuxNoeudsPage() {
  return (
    <RegionLayout
      title="Villers aux Noeuds"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="villers-aux-noeuds-guide.md"
    />
  );
}
