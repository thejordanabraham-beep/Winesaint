import RegionLayout from '@/components/RegionLayout';

export default function LouvoisPage() {
  return (
    <RegionLayout
      title="Louvois"
      level="vineyard"
      parentRegion="france/champagne"
      classification="grand-cru"
      contentFile="louvois-guide.md"
    />
  );
}
