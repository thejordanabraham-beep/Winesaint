import RegionLayout from '@/components/RegionLayout';

export default function DizyPage() {
  return (
    <RegionLayout
      title="Dizy"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="dizy-guide.md"
    />
  );
}
