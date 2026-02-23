import RegionLayout from '@/components/RegionLayout';

export default function trechyPage() {
  return (
    <RegionLayout
      title="Étrechy"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="etrechy-guide.md"
    />
  );
}
