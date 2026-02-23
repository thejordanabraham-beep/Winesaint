import RegionLayout from '@/components/RegionLayout';

export default function VillersMarmeryPage() {
  return (
    <RegionLayout
      title="Villers-Marmery"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="villers-marmery-guide.md"
    />
  );
}
