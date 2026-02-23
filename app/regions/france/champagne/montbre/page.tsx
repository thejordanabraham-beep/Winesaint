import RegionLayout from '@/components/RegionLayout';

export default function MontbrPage() {
  return (
    <RegionLayout
      title="Montbré"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="montbre-guide.md"
    />
  );
}
