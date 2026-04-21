import RegionLayout from '@/components/RegionLayout';

export default function VertusPage() {
  return (
    <RegionLayout
      title="Vertus"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="vertus-guide.md"
    />
  );
}
