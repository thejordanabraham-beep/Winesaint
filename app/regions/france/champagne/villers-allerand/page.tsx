import RegionLayout from '@/components/RegionLayout';

export default function VillersAllerandPage() {
  return (
    <RegionLayout
      title="Villers-Allerand"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="villers-allerand-guide.md"
    />
  );
}
