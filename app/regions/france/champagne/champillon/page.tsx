import RegionLayout from '@/components/RegionLayout';

export default function ChampillonPage() {
  return (
    <RegionLayout
      title="Champillon"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="champillon-guide.md"
    />
  );
}
