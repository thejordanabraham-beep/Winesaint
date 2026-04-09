import RegionLayout from '@/components/RegionLayout';

export default function TauxiresPage() {
  return (
    <RegionLayout
      title="Tauxières"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="tauxieres-guide.md"
    />
  );
}
