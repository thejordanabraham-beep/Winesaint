import RegionLayout from '@/components/RegionLayout';

export default function OgerPage() {
  return (
    <RegionLayout
      title="Oger"
      level="vineyard"
      parentRegion="france/champagne"
      classification="grand-cru"
      contentFile="oger-guide.md"
    />
  );
}
