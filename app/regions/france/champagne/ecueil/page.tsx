import RegionLayout from '@/components/RegionLayout';

export default function cueilPage() {
  return (
    <RegionLayout
      title="Écueil"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="ecueil-guide.md"
    />
  );
}
