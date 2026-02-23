import RegionLayout from '@/components/RegionLayout';

export default function AvizePage() {
  return (
    <RegionLayout
      title="Avize"
      level="vineyard"
      parentRegion="france/champagne"
      classification="grand-cru"
      contentFile="avize-guide.md"
    />
  );
}
