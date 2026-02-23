import RegionLayout from '@/components/RegionLayout';

export default function TroisPuitsPage() {
  return (
    <RegionLayout
      title="Trois-Puits"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="trois-puits-guide.md"
    />
  );
}
