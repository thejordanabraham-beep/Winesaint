import RegionLayout from '@/components/RegionLayout';

export default function VerzyPage() {
  return (
    <RegionLayout
      title="Verzy"
      level="vineyard"
      parentRegion="france/champagne"
      classification="grand-cru"
      contentFile="verzy-guide.md"
    />
  );
}
